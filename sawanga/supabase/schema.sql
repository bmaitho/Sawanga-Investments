-- =====================================================================
--  SAWANGA Investment Limited — Database Schema
--  Run this in the Supabase SQL Editor (or via the MCP) once.
--  Safe to re-run: uses IF NOT EXISTS / OR REPLACE throughout.
-- =====================================================================

-- ---------- Extensions ----------
create extension if not exists "pgcrypto";

-- =====================================================================
--  1. QUOTE REQUESTS  (Request a Quote / RFQ)
-- =====================================================================
create table if not exists public.quote_requests (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  full_name     text not null,
  email         text not null,
  phone         text not null,
  customer_type text not null default 'homeowner',  -- developer|contractor|institution|homeowner
  company       text,
  project_type  text,
  location      text,
  products      text[],          -- selected product categories
  budget_range  text,
  message       text,
  status        text not null default 'new',         -- new|reviewing|quoted|won|lost
  referral_code text                                  -- painter referral attribution
);

-- =====================================================================
--  2. CONTACT MESSAGES  (Contact Us)
-- =====================================================================
create table if not exists public.contact_messages (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  full_name   text not null,
  email       text not null,
  phone       text,
  subject     text,
  message     text not null,
  status      text not null default 'new'            -- new|read|responded
);

-- =====================================================================
--  3. PAINTERS  (Referral Portal accounts)
--  Linked 1:1 to Supabase auth.users
-- =====================================================================
create table if not exists public.painters (
  id            uuid primary key references auth.users(id) on delete cascade,
  created_at    timestamptz not null default now(),
  full_name     text not null,
  phone         text not null,
  email         text not null,
  county        text,
  id_number     text,
  referral_code text unique not null,                -- shareable code, e.g. SAW-AB12CD
  status        text not null default 'active',       -- active|suspended
  total_points  numeric not null default 0           -- redeemable reward points (KES value)
);

-- Auto-generate a unique referral code helper
create or replace function public.gen_referral_code()
returns text language plpgsql as $$
declare code text;
begin
  loop
    code := 'SAW-' || upper(substr(encode(gen_random_bytes(4),'hex'),1,6));
    exit when not exists (select 1 from public.painters where referral_code = code);
  end loop;
  return code;
end; $$;

-- =====================================================================
--  4. REFERRALS  (clients referred by painters)
--  Reward = % of referred sale value, paid once approved.
-- =====================================================================
create table if not exists public.referrals (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),
  painter_id      uuid not null references public.painters(id) on delete cascade,
  client_name     text not null,
  client_phone    text not null,
  project_detail  text,
  est_value       numeric,                            -- painter's estimate of sale value (KES)
  sale_value      numeric,                            -- confirmed by SAWANGA on approval
  reward_rate     numeric not null default 0.03,      -- 3% default of confirmed sale value
  points_awarded  numeric not null default 0,         -- = sale_value * reward_rate
  status          text not null default 'pending'     -- pending|approved|rejected|paid
);

-- =====================================================================
--  5. REWARD REDEMPTIONS  (painters cashing out points)
-- =====================================================================
create table if not exists public.redemptions (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  painter_id  uuid not null references public.painters(id) on delete cascade,
  amount      numeric not null,                       -- KES requested
  method      text not null default 'mpesa',          -- mpesa|bank|credit
  status      text not null default 'requested'       -- requested|processing|paid|rejected
);

-- =====================================================================
--  ROW LEVEL SECURITY
-- =====================================================================
alter table public.quote_requests   enable row level security;
alter table public.contact_messages enable row level security;
alter table public.painters         enable row level security;
alter table public.referrals        enable row level security;
alter table public.redemptions      enable row level security;

-- Public (anon) may INSERT leads — quotes & contacts — but never read them.
drop policy if exists "anon insert quotes" on public.quote_requests;
create policy "anon insert quotes" on public.quote_requests
  for insert to anon, authenticated with check (true);

drop policy if exists "anon insert contacts" on public.contact_messages;
create policy "anon insert contacts" on public.contact_messages
  for insert to anon, authenticated with check (true);

-- Painters can read & update only their own profile.
drop policy if exists "painter reads own" on public.painters;
create policy "painter reads own" on public.painters
  for select to authenticated using (auth.uid() = id);

drop policy if exists "painter inserts own" on public.painters;
create policy "painter inserts own" on public.painters
  for insert to authenticated with check (auth.uid() = id);

drop policy if exists "painter updates own" on public.painters;
create policy "painter updates own" on public.painters
  for update to authenticated using (auth.uid() = id);

-- Painters manage their own referrals (insert + read). Approval is server-side only.
drop policy if exists "painter reads own referrals" on public.referrals;
create policy "painter reads own referrals" on public.referrals
  for select to authenticated using (auth.uid() = painter_id);

drop policy if exists "painter inserts own referrals" on public.referrals;
create policy "painter inserts own referrals" on public.referrals
  for insert to authenticated with check (auth.uid() = painter_id);

-- Painters read/insert their own redemptions.
drop policy if exists "painter reads own redemptions" on public.redemptions;
create policy "painter reads own redemptions" on public.redemptions
  for select to authenticated using (auth.uid() = painter_id);

drop policy if exists "painter inserts own redemptions" on public.redemptions;
create policy "painter inserts own redemptions" on public.redemptions
  for insert to authenticated with check (auth.uid() = painter_id);

-- NOTE: Admin/staff operations (approving referrals, reading leads, marking
-- redemptions paid) use the SERVICE ROLE key on the server, which bypasses RLS.

-- =====================================================================
--  TRIGGER: when a referral is APPROVED, award points to the painter
-- =====================================================================
create or replace function public.on_referral_approved()
returns trigger language plpgsql security definer as $$
begin
  if new.status = 'approved' and old.status is distinct from 'approved' then
    new.points_awarded := coalesce(new.sale_value,0) * new.reward_rate;
    update public.painters
      set total_points = total_points + new.points_awarded
      where id = new.painter_id;
  end if;
  return new;
end; $$;

drop trigger if exists trg_referral_approved on public.referrals;
create trigger trg_referral_approved
  before update on public.referrals
  for each row execute function public.on_referral_approved();

-- =====================================================================
--  Helpful indexes
-- =====================================================================
create index if not exists idx_quotes_status   on public.quote_requests(status);
create index if not exists idx_quotes_created   on public.quote_requests(created_at desc);
create index if not exists idx_referrals_painter on public.referrals(painter_id);
create index if not exists idx_referrals_status  on public.referrals(status);
