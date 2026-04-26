# Optimeta — AI Meta Ad Campaign Architect

> India's most advanced AI-powered Meta (Facebook & Instagram) Ad Campaign Architect. Transform your business into a complete, ready-to-launch campaign blueprint in seconds.

---

## Project Structure

```
optimeta/
├── frontend/          Next.js 14 App Router (TypeScript)
└── backend/           Node.js + Express API
```

---

## Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project
- A [Google AI Studio](https://aistudio.google.com) API key (Gemini 1.5 Pro)
- A [Razorpay](https://razorpay.com) account with subscription plans created

---

## Backend Setup

### 1. Configure Environment

Edit `backend/.env`:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
GEMINI_API_KEY=your_gemini_api_key
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_key_secret
RAZORPAY_PLAN_PRO=plan_xxxxxxxxxxxxxxxx       # ₹499/month plan
RAZORPAY_PLAN_ULTRA=plan_xxxxxxxxxxxxxxxx     # ₹999/month plan
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
JWT_SECRET=a_random_string_minimum_32_characters_long
PORT=4000
FRONTEND_URL=http://localhost:3000
```

### 2. Create Razorpay Plans

In your Razorpay dashboard, create two subscription plans:
- **Pro**: ₹499/month, interval=monthly
- **Ultra**: ₹999/month, interval=monthly

Copy their plan IDs into `.env`.

### 3. Run Supabase Migrations

Run the following SQL in your Supabase SQL editor (Database > SQL Editor):

```sql
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

create policy "own profile select" on profiles for select using (auth.uid() = id);
create policy "own profile update" on profiles for update using (auth.uid() = id);
create policy "own campaigns select" on campaigns for select using (auth.uid() = user_id);
create policy "own campaigns insert" on campaigns for insert with check (auth.uid() = user_id);
create policy "own campaigns delete" on campaigns for delete using (auth.uid() = user_id);
create policy "own subscriptions select" on subscriptions for select using (auth.uid() = user_id);
create policy "own fingerprints select" on free_trial_fingerprints for select using (auth.uid() = user_id);

create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();
```

### 4. Start Backend

```bash
cd backend
npm install
npm run dev
```

Backend runs at: `http://localhost:4000`

---

## Frontend Setup

### 1. Configure Environment

Edit `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxxxxx
```

### 2. Start Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: `http://localhost:3000`

---

## Razorpay Webhook Setup

1. Go to Razorpay Dashboard → Settings → Webhooks
2. Add webhook URL: `https://your-backend.com/api/payments/webhook`
3. Select events: `subscription.activated`, `subscription.charged`, `subscription.cancelled`, `subscription.expired`, `payment.failed`
4. Copy the webhook secret into `RAZORPAY_WEBHOOK_SECRET` in `.env`

---

## Plan Limits

| Plan | Campaigns | PDF Export | Price |
|------|-----------|------------|-------|
| Free | 1 lifetime | No | ₹0 |
| Pro | 15/month | Yes | ₹499/month |
| Ultra | 50/month | Yes | ₹999/month |

---

## Tech Stack

**Frontend**: Next.js 14, TypeScript, Tailwind CSS, Framer Motion, Lucide React, React Hot Toast

**Backend**: Node.js, Express, Supabase (Postgres + Auth), Google Gemini 1.5 Pro, Razorpay, JWT

---

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /api/auth/register | No | Register new user |
| POST | /api/auth/login | No | Login |
| POST | /api/auth/logout | No | Logout |
| GET | /api/auth/me | JWT | Get current user |
| PATCH | /api/auth/profile | JWT | Update name |
| DELETE | /api/auth/account | JWT | Delete account |
| GET | /api/campaigns | JWT | List campaigns |
| GET | /api/campaigns/:id | JWT | Get campaign |
| POST | /api/campaigns/generate | JWT | Generate blueprint |
| DELETE | /api/campaigns/:id | JWT | Delete campaign |
| GET | /api/campaigns/:id/export | JWT (Pro+) | Export HTML |
| GET | /api/usage | JWT | Get usage stats |
| POST | /api/payments/create-subscription | JWT | Create Razorpay sub |
| POST | /api/payments/verify | JWT | Verify payment |
| GET | /api/payments/subscription | JWT | Get subscription |
| POST | /api/payments/cancel | JWT | Cancel subscription |
| POST | /api/payments/webhook | Razorpay | Webhook handler |

---

© 2025 Optimeta. Built for Indian brands.
