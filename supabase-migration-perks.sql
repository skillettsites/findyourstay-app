-- Run once in the Supabase SQL editor (project noxczm). Safe to re-run.
-- Host's "book direct and get..." benefits (best price, free breakfast, etc).
alter table fys_listings add column if not exists perks jsonb default '[]'::jsonb;
