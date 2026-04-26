require('dotenv').config();

// Verify critical env vars are present at startup
console.log('SUPABASE_URL:', process.env.SUPABASE_URL ? 'loaded' : 'MISSING');
console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'loaded' : 'MISSING');
console.log('GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? 'loaded' : 'MISSING');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'loaded' : 'MISSING');

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const supabase = require('./config/supabase');

const authRoutes = require('./routes/auth');
const campaignRoutes = require('./routes/campaigns');
const paymentRoutes = require('./routes/payments');
const usageRoutes = require('./routes/usage');

const app = express();
const PORT = process.env.PORT || 4000;

// Security
app.use(helmet());
app.set('trust proxy', 1);

// Rate limiting
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: { success: false, message: 'Too many requests. Please slow down.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Body parsing — webhook route needs raw body
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/usage', usageRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ success: true, data: { status: 'OK', timestamp: new Date().toISOString() } });
});

// 404
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found.' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('[Error]', err);
  res.status(500).json({ success: false, message: 'Internal server error.' });
});

// Run DB migrations on startup
const runMigrations = async () => {
  const sql = `
    create extension if not exists "uuid-ossp";

    create table if not exists profiles (
      id uuid references auth.users on delete cascade primary key,
      email text unique not null,
      full_name text,
      plan text default 'free' check (plan in ('free','pro','ultra')),
      campaigns_used integer default 0,
      billing_cycle_start timestamp with time zone default now(),
      created_at timestamp with time zone default now()
    );

    create table if not exists campaigns (
      id uuid default uuid_generate_v4() primary key,
      user_id uuid references profiles(id) on delete cascade,
      campaign_name text,
      business_inputs jsonb not null,
      blueprint jsonb not null,
      created_at timestamp with time zone default now()
    );

    create table if not exists subscriptions (
      id uuid default uuid_generate_v4() primary key,
      user_id uuid references profiles(id) on delete cascade,
      razorpay_subscription_id text unique,
      razorpay_payment_id text,
      plan text check (plan in ('pro','ultra')),
      status text default 'active' check (status in ('active','cancelled','expired','created')),
      current_period_start timestamp with time zone,
      current_period_end timestamp with time zone,
      created_at timestamp with time zone default now()
    );

    create table if not exists free_trial_fingerprints (
      id uuid default uuid_generate_v4() primary key,
      fingerprint_hash text not null,
      ip_address text,
      email text,
      user_id uuid references profiles(id) on delete cascade,
      created_at timestamp with time zone default now()
    );

    create index if not exists idx_fingerprint_hash on free_trial_fingerprints(fingerprint_hash);
    create index if not exists idx_fingerprint_ip on free_trial_fingerprints(ip_address);

    alter table profiles enable row level security;
    alter table campaigns enable row level security;
    alter table subscriptions enable row level security;
    alter table free_trial_fingerprints enable row level security;
  `;

  try {
    await supabase.rpc('exec_sql', { sql });
    console.log('[DB] Migration check complete.');
  } catch {
    console.log('[DB] Migration note: Run migrations manually via Supabase SQL editor.');
  }
};

app.listen(PORT, async () => {
  console.log(`\n🚀 Optimeta Backend running on http://localhost:${PORT}`);
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`   Frontend URL: ${process.env.FRONTEND_URL}\n`);
  await runMigrations();
});

module.exports = app;
