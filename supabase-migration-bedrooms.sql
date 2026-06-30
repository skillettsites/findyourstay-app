-- Per-bedroom photo sets + a bathroom count for host listings.
alter table fys_listings add column if not exists bedrooms jsonb default '[]'::jsonb;
alter table fys_listings add column if not exists bathrooms int default 0;
