-- Run once in the Supabase SQL editor (project noxczm). Safe to re-run.
-- Host's own payment links so guests pay them directly (we never touch money).
alter table fys_listings add column if not exists pay_stripe text;
alter table fys_listings add column if not exists pay_paypal text;
