-- Host-curated guest testimonials (quotes the host adds themselves, e.g. from
-- their Airbnb/Booking.com reviews). We do NOT run an on-platform review system.
alter table fys_listings add column if not exists testimonials jsonb default '[]'::jsonb;
