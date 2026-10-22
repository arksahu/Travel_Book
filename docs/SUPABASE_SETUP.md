# Supabase Setup & Security Guide for WanderWise

This guide walks you through setting up a free Supabase project, executing the database migrations, configuring Row Level Security (RLS), and connecting WanderWise.

---

## 1. Create a Supabase Project

1. Visit [supabase.com](https://supabase.com) and log in or create a free account.
2. Click **New Project**.
3. Set your project details:
   - **Name**: `wanderwise`
   - **Database Password**: Choose a strong password and save it securely.
   - **Region**: Select the region geographically closest to your users.
4. Click **Create new project** and wait 1-2 minutes for provisioning to finish.

---

## 2. Apply Database Migrations

1. In your Supabase Dashboard, open the **SQL Editor** from the left navigation.
2. Click **New query**.
3. Open [`supabase/migrations/001_initial_schema.sql`](file:///C:/Users/DELL/.gemini/antigravity/scratch/wanderwise/supabase/migrations/001_initial_schema.sql) from this repository, copy its entire contents, and paste it into the SQL Editor.
4. Click **Run** (or press `Ctrl+Enter`).
5. Verify the output displays `Success. No rows returned`.

### What This Migration Configures:
- Tables: `profiles`, `trips`, `trip_preferences`, `itinerary_days`, `itinerary_activities`.
- Automatic timestamps via PostgreSQL trigger `handle_updated_at()`.
- Auto profile creation on user registration via `on_auth_user_created` trigger on `auth.users`.
- Row Level Security (RLS) enabled on all 5 tables.
- Granular SELECT, INSERT, UPDATE, DELETE policies restricting access strictly to records owned by the calling `auth.uid()`.

---

## 3. Retrieve API Credentials

1. Go to **Project Settings** (gear icon) -> **API**.
2. Find the following values:
   - **Project URL**: e.g. `https://your-project-id.supabase.co`
   - **anon public key**: e.g. `eyJhbGciOi...` (safe for browser and frontend)
   - **service_role secret**: e.g. `eyJhbGciOi...` (backend only, never expose to frontend)

---

## 4. Configure Authentication Settings

1. In Supabase Dashboard, go to **Authentication** -> **URL Configuration**.
2. Set **Site URL** to:
   - Development: `http://localhost:5173`
   - Production: `https://your-app.vercel.app`
3. Add redirect URLs:
   - `http://localhost:5173/**`
   - `https://your-app.vercel.app/**`
4. *(Optional for testing)*: Under **Authentication** -> **Providers** -> **Email**, you can temporarily turn off **Confirm email** if you want new signups to be immediately logged in without waiting for an email confirmation link.

---

## 5. Populate Environment Files

### Frontend (`frontend/.env`)
```bash
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
VITE_API_BASE_URL=http://localhost:8000
```

### Backend (`backend/.env`)
```bash
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_KEY=your-anon-or-service-role-key
GEMINI_API_KEY=your-gemini-api-key
```

Once populated, restart your frontend (`npm run dev`) and backend (`uvicorn app.main:app`). WanderWise will automatically exit Demo Mode and synchronize all trips with your live Supabase cloud database!
