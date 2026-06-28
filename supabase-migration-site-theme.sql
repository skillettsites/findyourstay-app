-- Run once in the Supabase SQL editor (project noxczm).
-- Adds the booking-site template choice to listings. Safe to re-run.
alter table fys_listings add column if not exists site_theme text default 'classic';
