# FindYourStay Directory (local prototype)

Airbnb-style direct-booking directory. Fully local, no cloud, no cost. Real SQLite
database, seeded with real direct-booking venues from OpenStreetMap.

## Run it

```bash
npm run dev
# open http://localhost:3000
```

## Re-seed the database

Pulls real guesthouses/B&Bs/apartments (with their own website, OTAs filtered out)
from OpenStreetMap across the anchor cities in `scripts/anchor-cities.mjs`.

```bash
node scripts/seed.mjs            # add to existing
node scripts/seed.mjs --reset    # wipe and reseed
```

The DB is a single file at `data/fys.db` (gitignored). It is created and migrated
automatically. To add more cities, edit `scripts/anchor-cities.mjs` and reseed.

## What's built (Phase 1)

- Home: hero search, category row, featured stays, popular destinations.
- `/s` search results: card grid + live Leaflet map with price pins, filters, sort.
- `/rooms/[slug]` listing detail: gallery, amenities, map, booking box, claim banner.
- `/host` marketing + annual-first pricing (£0 / £79 / £149 / £299).
- `/host/dashboard` stubbed host control panel (views/enquiries value-proof UI).
- Enquiry relay API writing to the DB (`/api/enquiry`).

## Deliberately stubbed (wired at deploy time, they need cloud + cost money)

- Stripe Billing (host subscription) and Stripe Connect (guest-to-host payments).
- Calendar iCal sync cron.
- Host auth + real listing creation.

## Architecture notes

- Data access is isolated in `src/lib/db.ts`. Moving to Supabase/Postgres later
  means re-implementing those functions only; the UI does not change.
- All seeded listings are `status='unclaimed'`, link to the venue's own site, use
  representative (not scraped) imagery, and carry a "Claim this listing" CTA. This
  is the legitimate way to look established. See `../findyourstay/REBUILD-SPEC.md`.

## Map / images

- Map tiles: OpenStreetMap. Listing imagery: deterministic Picsum placeholders
  (representative, swapped for host-uploaded photos on claim). Both need internet
  on the dev machine; the app itself is otherwise fully local.
