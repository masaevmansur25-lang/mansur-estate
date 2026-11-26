# Project memory

## Product intent & audience

- Real-estate property listing site.
- Public visitors browse a catalog of published properties and view detail pages.
- Admins sign in to manage listings (CRUD, status toggling) and upload photos.

## Brand personality & voice

- Production-grade, beautiful, non-cookie-cutter design (per `.bolt/prompt`).

## Visual design & UX direction

- Design and all existing pages/features are to be preserved as-is during backend changes.
- Pages present: public catalog, property detail, admin login, admin dashboard.

## Decisions, constraints & rationale

- Backend is exclusively the user's existing Supabase project; no Bolt Database anywhere.
- Use `@supabase/supabase-js` only — do not install alternative DB/auth/storage packages.
- Database reads/writes target the existing `public.properties` table.
- Auth uses Supabase Auth email/password sign-in; session gates admin dashboard access.
- Photo uploads target the existing `property-photos` Storage bucket; public URLs used for display.
- Must NOT create, recreate, or modify existing Supabase tables, buckets, or RLS policies — app only reads/writes rows within RLS allowances.
- If Supabase config is missing, ask the user rather than substituting another DB.
- Supabase credentials expected in `.env` (Project URL + anon/publishable key); file did not exist as of this turn — awaiting user to paste values.

## Open questions & assumptions

- Awaiting user to provide Supabase Project URL and anon key to populate `.env`.
- Assuming `properties` table has columns supporting: published status, listing fields used by catalog/detail pages, and photo URL references (exact schema not yet confirmed).
- Assuming admin auth uses a single email/password account (no role system implied).