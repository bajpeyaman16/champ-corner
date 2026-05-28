# Champ Corner

Tournament discovery & registration app built with TanStack Start + Lovable Cloud (Supabase) + Razorpay.

## Run locally (after cloning from GitHub in VS Code)

### 1. Install dependencies

```bash
npm install
# or: bun install
```

### 2. Create your `.env` file

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

Get the values from your Lovable project:

- **Lovable** → Project → **Connectors** → **Lovable Cloud** → click **View backend** to open the Supabase dashboard.
- In Supabase: **Project Settings → API** → copy:
  - `Project URL` → `VITE_SUPABASE_URL` and `SUPABASE_URL`
  - `anon public` key → `VITE_SUPABASE_PUBLISHABLE_KEY` and `SUPABASE_PUBLISHABLE_KEY`
  - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (server-only, never expose!)
- For Razorpay: https://dashboard.razorpay.com/app/keys → copy Key ID + Secret.

> ⚠️ Without these env vars the app throws `Missing Supabase environment variable(s)` on every page.

### 3. Start the dev server

```bash
npm run dev
```

Open http://localhost:5173 (or the port shown in the terminal).

### 4. Build for production

```bash
npm run build
npm run preview
```

## Notes

- `.env` is NOT in `.gitignore` for this project so the Lovable-managed values travel with the repo. If you fork it publicly, add `.env` to `.gitignore` and rotate your keys.
- All database schema lives in `supabase/migrations/`. Migrations are applied automatically inside Lovable; for a local Supabase you can run them with the Supabase CLI.
- Server-side logic uses TanStack `createServerFn` (see `src/lib/*.functions.ts`), not Supabase Edge Functions.
