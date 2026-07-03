-- =====================================================================
--  SAWANGA Investment Limited — Transaction Suite Schema
--  (Quotation -> Invoice -> Delivery Note -> Payments)
--
--  Run this in the Supabase SQL Editor for the SAWANGA project
--  (aiykcgbfjnkbexgmqmyf) — NOT the UniHive project.
--  Safe to re-run: uses IF NOT EXISTS / OR REPLACE throughout.
-- =====================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------
--  Ref number generator — SIL-Q-2026-701, SIL-Q-2026-702, ...
-- ---------------------------------------------------------------------
create sequence if not exists public.transaction_ref_seq start 700;

create or replace function public.gen_transaction_ref()
returns text language sql as $$
  select 'SIL-Q-' || to_char(now(), 'YYYY') || '-' || nextval('public.transaction_ref_seq')::text;
$$;

-- =====================================================================
--  1. TRANSACTIONS  (one record per Quote, which can progress through
--     stages: quote -> invoice -> delivery. Payments are tracked
--     separately so a transaction can be partially paid.)
-- =====================================================================
create table if not exists public.transactions (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  ref             text unique not null default public.gen_transaction_ref(),
  stage           text not null default 'quote',        -- quote | invoice | delivery

  -- client / project details
  client_name     text not null,
  client_company  text,
  client_address  text,
  client_phone    text,
  client_email    text,
  project_name    text,
  kra_pin         text,
  vat_no          text,

  -- quote / invoice meta
  quote_date      date not null default current_date,
  valid_days      int not null default 30,
  account_manager text,
  vat_rate        numeric not null default 16,
  vat_treatment   text not null default 'exclusive',    -- exclusive | inclusive
  delivery_fee    numeric not null default 0,
  notes           text,

  -- delivery note meta
  dispatched_by   text,
  driver_name     text,
  vehicle         text,
  delivered_at    timestamptz,
  received_by     text,

  -- cached totals (recomputed by the app whenever items/payments change)
  subtotal        numeric not null default 0,
  vat_amount      numeric not null default 0,
  total           numeric not null default 0,
  amount_paid     numeric not null default 0,

  status          text not null default 'draft'          -- draft|sent|paid|partially_paid|overdue|cancelled
);

-- =====================================================================
--  2. TRANSACTION ITEMS  (line items — shared across Quote/Invoice/
--     Delivery Note views of the same transaction)
-- =====================================================================
create table if not exists public.transaction_items (
  id              uuid primary key default gen_random_uuid(),
  transaction_id  uuid not null references public.transactions(id) on delete cascade,
  position        int not null default 0,
  description     text not null,
  spec_notes      text,
  qty             numeric not null default 0,
  unit            text not null default 'pcs',
  unit_price      numeric not null default 0,
  discount_pct    numeric not null default 0,

  -- delivery-note specific (filled in when stage = delivery)
  qty_delivered   numeric,
  condition       text,                                  -- Good | Damaged | Short
  received        boolean not null default false
);

-- =====================================================================
--  3. TRANSACTION PAYMENTS  (receipts recorded against a transaction)
-- =====================================================================
create table if not exists public.transaction_payments (
  id              uuid primary key default gen_random_uuid(),
  transaction_id  uuid not null references public.transactions(id) on delete cascade,
  created_at      timestamptz not null default now(),
  amount          numeric not null,
  method          text not null default 'bank',           -- mpesa|bank|cash|cheque|credit
  note            text,
  recorded_by     text
);

-- =====================================================================
--  ROW LEVEL SECURITY
--  All transaction data is staff-only. No anon/authenticated policies
--  are defined — the admin API routes use the SERVICE ROLE key, which
--  bypasses RLS entirely (same pattern as referrals/redemptions).
-- =====================================================================
alter table public.transactions        enable row level security;
alter table public.transaction_items   enable row level security;
alter table public.transaction_payments enable row level security;

-- =====================================================================
--  updated_at trigger
-- =====================================================================
create or replace function public.set_transaction_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end; $$;

drop trigger if exists trg_transactions_updated_at on public.transactions;
create trigger trg_transactions_updated_at
  before update on public.transactions
  for each row execute function public.set_transaction_updated_at();

-- =====================================================================
--  Helpful indexes
-- =====================================================================
create index if not exists idx_transactions_stage      on public.transactions(stage);
create index if not exists idx_transactions_status      on public.transactions(status);
create index if not exists idx_transactions_created     on public.transactions(created_at desc);
create index if not exists idx_transaction_items_txn    on public.transaction_items(transaction_id);
create index if not exists idx_transaction_payments_txn on public.transaction_payments(transaction_id);
