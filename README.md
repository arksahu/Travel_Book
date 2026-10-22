# WanderWise — Personalized AI Travel Planner

> A production-oriented, full-stack web application designed for intelligent travel planning. WanderWise transforms traveler pace, dietary choices, budget constraints, and group dynamics into day-by-day itineraries you can edit, recalculate, and export.

[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18+-61DAFB.svg?logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5+-646CFF.svg?logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4+-38B2AC.svg?logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Supabase](https://img.shields.io/badge/Supabase-Auth%20%26%20Postgres-3ECF8E.svg?logo=supabase&logoColor=white)](https://supabase.com)
[![Python](https://img.shields.io/badge/Python-3.11+-3776AB.svg?logo=python&logoColor=white)](https://python.org)

---

## Key Features

1. **Intelligent AI Itinerary Engine**:
   - Structured JSON prompt engineering with strict Pydantic validation.
   - Morning, Afternoon, and Evening activity balancing with realistic durations.
   - Recommended accommodations, local dining highlights, and transit mobility tips.
   - Single-day and full-itinerary regeneration.

2. **Autonomous Zero-Setup Demo Mode**:
   - Works immediately out of the box without requiring Supabase or AI keys.
   - Full simulated persistence via browser LocalStorage and Python fallback.
   - Includes realistic sample trips (Tokyo, Paris, Rome, Kyoto).

3. **Live Budget Recalculator**:
   - Real-time comparison between target budget and projected spending (lodging + dining + experiences + transit).
   - Visual progress bar and immediate alert warnings if expenses exceed the user's budget.

4. **10 Production UI Pages**:
   - Public Landing Page with interactive sample preview.
   - Sign-in & Sign-up pages with Supabase Auth and 1-click Demo Sign-in.
   - Authenticated Dashboard with trip statistics and curated AI inspiration.
   - 5-Step Trip Creation Wizard.
   - Itinerary View with day switcher tabs and printable clean layout.
   - Saved Trips Page with search and travel-style filtering.
   - Trip Editing Page with inline activity modification and deletion.
   - Traveler Profile & Default Preferences.
   - System Diagnostics & Settings Page.
   - Custom 404 Destination Not Found Page.

5. **Print & PDF Export**:
   - Specialized `@media print` stylesheet removing navigation, sidebars, and action buttons for clean, paper-ready travel binders.

6. **Database Security & RLS**:
   - Version-controlled SQL migration (`supabase/migrations/001_initial_schema.sql`).
   - PostgreSQL Row Level Security (RLS) policies on all tables ensuring `auth.uid() = user_id`.

---

## Project Structure

```text
wanderwise/
├── frontend/                        # React + Vite + Tailwind CSS frontend
│   ├── src/
│   │   ├── components/              # ActivityCard, DayTimeline, BudgetSummary, etc.
│   │   ├── context/                 # AuthContext & TripContext
│   │   ├── pages/                   # All 10 views (Landing, Wizard, Itinerary, etc.)
│   │   ├── services/                # API client, Supabase client, Mock generator
│   │   └── utils/                   # Currency/date formatters, PDF print helper
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── vercel.json                  # Vercel deployment rewrite rules
├── backend/                         # FastAPI + Python 3.11 backend
│   ├── app/
│   │   ├── api/                     # Health, Trips, Export REST endpoints
│   │   ├── core/                    # Security, auth token guard, settings
│   │   ├── models/                  # Pydantic validation schemas
│   │   ├── services/                # AI engine, budget calculator, export
│   │   └── main.py                  # FastAPI app entry point
│   ├── tests/                       # Pytest test suite (17 passed tests)
│   ├── requirements.txt
│   ├── pytest.ini
│   ├── render.yaml                  # Render deployment configuration
│   └── Procfile
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql   # PostgreSQL DDL, Triggers & RLS policies
├── docs/
│   ├── ARCHITECTURE.md              # System design & data models
│   ├── DEPLOYMENT_GUIDE.md          # Step-by-step Vercel & Render guide
│   ├── E2E_TEST_CHECKLIST.md        # Manual QA verification checklist
│   └── SUPABASE_SETUP.md            # Cloud database setup instructions
├── .env.example                     # Environment variables template
├── .gitignore
└── README.md
```

---

## Quickstart Guide

### 1. Run the Frontend

```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser. The frontend immediately launches in **Demo Mode** with full interactivity!

To run frontend tests:
```bash
npm run test
```

To verify production build:
```bash
npm run build
```

---

### 2. Run the FastAPI Backend

```bash
cd backend

# Create virtual environment with uv or python
uv venv --python 3.11
# Or on standard Python: python -m venv .venv

# Activate environment (Windows PowerShell)
.venv\Scripts\activate

# Install requirements
pip install -r requirements.txt

# Start FastAPI server
uvicorn app.main:app --reload --port 8000
```

- API Docs: [http://localhost:8000/docs](http://localhost:8000/docs)
- Health Check: [http://localhost:8000/health](http://localhost:8000/health)

To run the backend test suite:
```bash
pytest -v
```

---

## Execution Milestone Checklist

- [x] **Phase 1: Environment Setup, Scaffolding & Responsive UI**
  - Configured portable Git and Python 3.11 with `uv`.
  - Initialized Git repository on `main` branch.
  - Built full React + Vite + Tailwind CSS frontend with 10 responsive pages.
  - Verified clean production build with `npm run build`.
- [x] **Phase 2: Supabase Schema, SQL Migrations & RLS**
  - Created `001_initial_schema.sql` with `profiles`, `trips`, `trip_preferences`, `itinerary_days`, and `itinerary_activities`.
  - Implemented Row Level Security (RLS) policies on every table.
  - Auth triggers for automated timestamps and profile provisioning on signup.
  - Documented setup in `docs/SUPABASE_SETUP.md`.
- [x] **Phase 3: FastAPI Backend & Authenticated CRUD API**
  - Implemented Pydantic models with strict validation.
  - Built JWT bearer token verification guard in `app/core/security.py`.
  - Implemented CRUD REST endpoints with ownership checks.
- [x] **Phase 4: AI Itinerary Engine & Structured Output**
  - Engineered structured JSON prompts conforming to Pydantic schemas.
  - Added Gemini / OpenAI integration with fallback intelligent heuristic engine.
  - Single-day and full-trip regeneration logic.
- [x] **Phase 5: Frontend-Backend Integration & Budget Logic**
  - Wired Axios client with auto Bearer token injection.
  - Built real-time budget calculator and variance alerts.
  - Inline activity editing, additions, and deletions with instant cost recalculation.
- [x] **Phase 6: PDF Export, Testing & Verification**
  - Print/PDF export utility with custom `@media print` styling.
  - 17 backend unit/integration tests with `pytest` (100% pass rate).
  - 6 frontend tests with `vitest` (100% pass rate).
  - Created comprehensive `docs/E2E_TEST_CHECKLIST.md`.
- [x] **Phase 7: Deployment Configuration & Production Readiness**
  - Prepared `vercel.json` for frontend SPA routing.
  - Prepared `render.yaml` and `Procfile` for backend deployment.
  - Created `docs/DEPLOYMENT_GUIDE.md` and updated `README.md`.
