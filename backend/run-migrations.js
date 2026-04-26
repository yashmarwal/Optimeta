/**
 * Optimeta DB Migration Runner
 * Run once: node run-migrations.js
 */
require('dotenv').config();
const https = require('https');
const url = require('url');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Extract project ref from URL: https://xxxx.supabase.co → xxxx
const projectRef = SUPABASE_URL.replace('https://', '').split('.')[0];

const statements = [
  `create extension if not exists "uuid-ossp"`,

  `create table if not exists profiles (
    id uuid references auth.users on delete cascade primary key,
    email text unique not null,
    full_name text,
    plan text default 'free' check (plan in ('free','pro','ultra')),
    campaigns_used integer default 0,
    billing_cycle_start timestamp with time zone default now(),
    created_at timestamp with time zone default now()
  )`,

  `create table if not exists campaigns (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references profiles(id) on delete cascade,
    campaign_name text,
    business_inputs jsonb not null,
    blueprint jsonb not null,
    created_at timestamp with time zone default now()
  )`,

  `create table if not exists subscriptions (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references profiles(id) on delete cascade,
    razorpay_subscription_id text unique,
    razorpay_payment_id text,
    plan text check (plan in ('pro','ultra')),
    status text default 'active' check (status in ('active','cancelled','expired','created')),
    current_period_start timestamp with time zone,
    current_period_end timestamp with time zone,
    created_at timestamp with time zone default now()
  )`,

  `create table if not exists free_trial_fingerprints (
    id uuid default uuid_generate_v4() primary key,
    fingerprint_hash text not null,
    ip_address text,
    email text,
    user_id uuid references profiles(id) on delete cascade,
    created_at timestamp with time zone default now()
  )`,

  `create index if not exists idx_fingerprint_hash on free_trial_fingerprints(fingerprint_hash)`,
  `create index if not exists idx_fingerprint_ip on free_trial_fingerprints(ip_address)`,

  `alter table profiles enable row level security`,
  `alter table campaigns enable row level security`,
  `alter table subscriptions enable row level security`,
  `alter table free_trial_fingerprints enable row level security`,

  `do $$ begin
    if not exists (select 1 from pg_policies where tablename='profiles' and policyname='own profile select') then
      create policy "own profile select" on profiles for select using (auth.uid() = id);
    end if;
  end $$`,

  `do $$ begin
    if not exists (select 1 from pg_policies where tablename='profiles' and policyname='own profile update') then
      create policy "own profile update" on profiles for update using (auth.uid() = id);
    end if;
  end $$`,

  `do $$ begin
    if not exists (select 1 from pg_policies where tablename='campaigns' and policyname='own campaigns select') then
      create policy "own campaigns select" on campaigns for select using (auth.uid() = user_id);
    end if;
  end $$`,

  `do $$ begin
    if not exists (select 1 from pg_policies where tablename='campaigns' and policyname='own campaigns insert') then
      create policy "own campaigns insert" on campaigns for insert with check (auth.uid() = user_id);
    end if;
  end $$`,

  `do $$ begin
    if not exists (select 1 from pg_policies where tablename='campaigns' and policyname='own campaigns delete') then
      create policy "own campaigns delete" on campaigns for delete using (auth.uid() = user_id);
    end if;
  end $$`,

  `do $$ begin
    if not exists (select 1 from pg_policies where tablename='subscriptions' and policyname='own subscriptions select') then
      create policy "own subscriptions select" on subscriptions for select using (auth.uid() = user_id);
    end if;
  end $$`,

  `do $$ begin
    if not exists (select 1 from pg_policies where tablename='free_trial_fingerprints' and policyname='own fingerprints select') then
      create policy "own fingerprints select" on free_trial_fingerprints for select using (auth.uid() = user_id);
    end if;
  end $$`,

  `create or replace function handle_new_user()
  returns trigger as $$
  begin
    insert into profiles (id, email, full_name)
    values (new.id, new.email, new.raw_user_meta_data->>'full_name');
    return new;
  end;
  $$ language plpgsql security definer`,

  `drop trigger if exists on_auth_user_created on auth.users`,

  `create trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure handle_new_user()`,
];

async function runSQL(sql) {
  const parsedUrl = new url.URL(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`);

  // Use Supabase Management API
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ sql });
    const options = {
      hostname: `api.supabase.com`,
      path: `/v1/projects/${projectRef}/database/query`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
        'Authorization': `Bearer ${SERVICE_KEY}`,
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function migrate() {
  console.log('\n🗄️  Optimeta Database Migration\n');
  console.log(`Project: ${projectRef}\n`);

  let success = 0;
  let skipped = 0;

  for (const stmt of statements) {
    const preview = stmt.trim().split('\n')[0].substring(0, 60) + '...';
    try {
      const result = await runSQL(stmt);
      if (result.status === 200 || result.status === 201) {
        console.log(`  ✓ ${preview}`);
        success++;
      } else if (result.status === 401 || result.status === 403) {
        console.log(`\n❌ Auth failed. The Management API requires a Supabase Personal Access Token.`);
        console.log(`\n📋 MANUAL SETUP REQUIRED:`);
        console.log(`   1. Open: https://supabase.com/dashboard/project/${projectRef}/sql/new`);
        console.log(`   2. Copy the contents of: backend/migrate.sql`);
        console.log(`   3. Paste and click "Run"\n`);
        process.exit(1);
      } else {
        // Check if it's "already exists" which is fine
        const body = JSON.stringify(result.body);
        if (body.includes('already exists') || body.includes('duplicate')) {
          console.log(`  ~ ${preview} (already exists)`);
          skipped++;
        } else {
          console.log(`  ⚠ ${preview} — ${result.status}`);
        }
      }
    } catch (err) {
      console.log(`  ✗ ${preview} — ${err.message}`);
    }
  }

  console.log(`\n✅ Migration complete: ${success} applied, ${skipped} already existed\n`);
}

migrate().catch(console.error);
