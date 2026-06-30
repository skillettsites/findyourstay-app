-- Dedicated hero/background image for a host's booking website (separate from
-- the room photo gallery). Safe to run more than once.
alter table fys_listings add column if not exists hero_image text;
