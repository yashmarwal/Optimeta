-- Optimeta Database Migration
-- Run this entire script in: Supabase Dashboard > SQL Editor > New Query

-- Enable extensions
create extension if not exists "uuid-ossp";

-- Profiles table
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  full_name text,
  plan text default 'free' check (plan in ('free','pro','ultra')),
  campaigns_used integer default 0,
  billing_cycle_start timestamp with time zone default now(),
  created_at timestamp with time zone default now()
);

-- Campaigns table
create table if not exists campaigns (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade,
  campaign_name text,
  business_inputs jsonb not null,
  blueprint jsonb not null,
  created_at timestamp with time zone default now()
);

-- Subscriptions table
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

-- Free trial fingerprints table
create table if not exists free_trial_fingerprints (
  id uuid default uuid_generate_v4() primary key,
  fingerprint_hash text not null,
  ip_address text,
  email text,
  user_id uuid references profiles(id) on delete cascade,
  created_at timestamp with time zone default now()
);

-- Indexes
create index if not exists idx_fingerprint_hash on free_trial_fingerprints(fingerprint_hash);
create index if not exists idx_fingerprint_ip on free_trial_fingerprints(ip_address);

-- Row Level Security
alter table profiles enable row level security;
alter table campaigns enable row level security;
alter table subscriptions enable row level security;
alter table free_trial_fingerprints enable row level security;

-- RLS Policies
create policy "own profile select" on profiles for select using (auth.uid() = id);
create policy "own profile update" on profiles for update using (auth.uid() = id);
create policy "own campaigns select" on campaigns for select using (auth.uid() = user_id);
create policy "own campaigns insert" on campaigns for insert with check (auth.uid() = user_id);
create policy "own campaigns delete" on campaigns for delete using (auth.uid() = user_id);
create policy "own subscriptions select" on subscriptions for select using (auth.uid() = user_id);
create policy "own fingerprints select" on free_trial_fingerprints for select using (auth.uid() = user_id);

-- Auto-create profile on user signup
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name'
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();
