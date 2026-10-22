# WanderWise — Production Deployment Guide

This guide covers deploying **WanderWise** to production with:
- **Frontend**: [Vercel](https://vercel.com) (React + Vite)
- **Backend**: [Render](https://render.com) (FastAPI + Python 3.11)
- **Database & Auth**: [Supabase](https://supabase.com) (PostgreSQL with Row Level Security)
- **Version Control**: GitHub

---

## 1. Version Control & GitHub Repository

1. Initialize and push your project to GitHub:
   ```bash
   cd wanderwise
   git add .
   git commit -m "feat: complete WanderWise production application"
   git branch -M main
   git remote add origin https://github.com/<your-username>/wanderwise.git
   git push -u origin main
   ```

---

## 2. Supabase Setup

1. Create a project at [supabase.com](https://supabase.com).
2. Run the migration SQL in Supabase **SQL Editor**:
   - Copy contents from [`supabase/migrations/001_initial_schema.sql`](file:///C:/Users/DELL/.gemini/antigravity/scratch/wanderwise/supabase/migrations/001_initial_schema.sql) and execute.
3. Note your credentials under **Project Settings -> API**:
   - **Project URL**
   - **Anon Public Key** (for frontend)
   - **Service Role Secret** (for backend, keep private!)
4. Under **Authentication -> URL Configuration**, set your production Vercel URL:
   - Site URL: `https://<your-project>.vercel.app`
   - Redirect URLs: `https://<your-project>.vercel.app/**`

---

## 3. Backend Deployment (Render)

1. Sign in to [render.com](https://render.com) and click **New -> Web Service**.
2. Connect your GitHub repository.
3. Configure the service settings:
   - **Name**: `wanderwise-api`
   - **Region**: Choose the region closest to your Supabase database.
   - **Root Directory**: `backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. Add the following **Environment Variables** in Render:
   | Variable | Value | Description |
   | :--- | :--- | :--- |
   | `ENVIRONMENT` | `production` | Production mode |
   | `CORS_ORIGINS` | `["https://<your-project>.vercel.app"]` | Your Vercel frontend domain |
   | `SUPABASE_URL` | `https://<your-project-id>.supabase.co` | Your Supabase Project URL |
   | `SUPABASE_KEY` | `eyJhbGci...` | Supabase Service Role or Anon Key |
   | `AI_PROVIDER` | `gemini` | `gemini` or `openai` |
   | `GEMINI_API_KEY` | `AIzaSy...` | Your Google Gemini API Key |
   | `AI_MODEL_NAME` | `gemini-1.5-flash` | Gemini model name |
5. Click **Create Web Service**.
6. When deployment finishes, verify by opening:
   `https://wanderwise-api.onrender.com/health`
   It should return:
   ```json
   {
     "status": "healthy",
     "version": "1.0.0",
     "environment": "production",
     "supabase_configured": true,
     "ai_configured": true,
     "ai_provider": "gemini"
   }
   ```

---

## 4. Frontend Deployment (Vercel)

1. Sign in to [vercel.com](https://vercel.com) and click **Add New -> Project**.
2. Import your GitHub repository.
3. Configure Project Settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend` (Click Edit and select the `frontend` folder)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add the following **Environment Variables** in Vercel:
   | Variable | Value | Description |
   | :--- | :--- | :--- |
   | `VITE_API_BASE_URL` | `https://wanderwise-api.onrender.com` | Your deployed Render backend URL |
   | `VITE_SUPABASE_URL` | `https://<your-project-id>.supabase.co` | Your Supabase Project URL |
   | `VITE_SUPABASE_ANON_KEY` | `eyJhbGci...` | Your Supabase public Anon key |
   | `VITE_APP_NAME` | `WanderWise` | Branding title |
5. Click **Deploy**.
6. The included [`frontend/vercel.json`](file:///C:/Users/DELL/.gemini/antigravity/scratch/wanderwise/frontend/vercel.json) ensures all client-side routes (`/plan`, `/itinerary/:id`, `/trips`) rewrite to `index.html` seamlessly.

---

## 5. End-to-End Verification

1. Open your live Vercel URL (`https://<your-project>.vercel.app`).
2. Verify the **Demo Banner** is either hidden or displays live connection status.
3. Sign up with a test email. Confirm that a new user record appears in Supabase Auth and the `public.profiles` table.
4. Launch the 5-step trip wizard and generate an itinerary. Confirm the itinerary is created, stored, and viewable.
5. Edit an activity and confirm costs update live.
6. Test PDF/Print export.
