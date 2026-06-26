-- FindYourStay tables in the SHARED Supabase project. All prefixed `fys_` so
-- they can't collide with the other sites in this database. Paste once into the
-- Supabase SQL Editor (Dashboard -> SQL Editor -> New query -> Run).

create table if not exists fys_hosts (
  id text primary key, email text unique, name text,
  stripe_customer_id text, stripe_connect_id text, connect_onboarded boolean default false,
  subscription_tier text default 'free', subscription_status text, created_at timestamptz default now()
);

create table if not exists fys_listings (
  id text primary key,
  host_id text,
  status text default 'unclaimed',
  source text default 'host',
  property_name text not null,
  slug text unique not null,
  city_slug text not null,
  city_name text not null,
  country text,
  lat double precision,
  lng double precision,
  neighborhood text,
  description text,
  property_type text default 'guest_house',
  price_range text default 'mid',
  price_per_night integer,
  currency text default 'gbp',
  amenities jsonb default '[]'::jsonb,
  photos jsonb default '[]'::jsonb,
  booking_url text,
  has_booking_site boolean default false,
  verified boolean default false,
  tier text default 'free',
  tier_rank integer default 3,
  rating double precision,
  review_count integer default 0,
  attribution text,
  real_photo boolean default false,
  external_ical_urls jsonb default '[]'::jsonb,
  created_at timestamptz default now()
);
create index if not exists fys_idx_listings_city on fys_listings(city_slug);
create index if not exists fys_idx_listings_country on fys_listings(country);
create index if not exists fys_idx_listings_status on fys_listings(status);
create index if not exists fys_idx_listings_order on fys_listings(tier_rank, rating);

create or replace view fys_city_summary as
  select city_slug, max(city_name) as city_name, max(country) as country,
         count(*)::int as n, avg(lat) as lat, avg(lng) as lng
  from fys_listings where status in ('active','unclaimed')
  group by city_slug;

create table if not exists fys_calendar_blocks (
  id text primary key, listing_id text, start_date text, end_date text,
  source text, external_uid text, updated_at timestamptz default now()
);
create index if not exists fys_idx_calblocks_listing on fys_calendar_blocks(listing_id);

create table if not exists fys_enquiries (
  id text primary key, listing_id text, guest_email text, check_in text, check_out text,
  guests integer, message text, relayed boolean default false, created_at timestamptz default now()
);

create table if not exists fys_bookings (
  id text primary key, listing_id text, host_id text, guest_email text, check_in text, check_out text,
  guests integer, status text, deposit_amount integer, currency text, created_at timestamptz default now()
);

create table if not exists fys_reports (
  id text primary key, listing_id text, reporter_email text, reason text,
  status text default 'open', created_at timestamptz default now()
);

create table if not exists fys_events (
  id bigserial primary key, listing_id text, type text, created_at timestamptz default now(), meta text
);

create table if not exists fys_domains (
  domain text primary key, listing_id text, status text default 'pending',
  provider text, created_at timestamptz default now()
);
