-- ====================================================================
-- WanderWise Travel Planner - Supabase Initial Schema & Security
-- Migration: 001_initial_schema.sql
-- ====================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ====================================================================
-- 2. Profiles Table (Linked to auth.users)
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    avatar_url TEXT,
    home_currency TEXT DEFAULT 'USD',
    preferences JSONB DEFAULT '{
        "travel_style": "balanced",
        "pace": "moderate",
        "dietary": "None",
        "favorite_interests": ["culture", "food", "sightseeing"]
    }'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Index on profiles
CREATE INDEX IF NOT EXISTS idx_profiles_id ON public.profiles(id);

-- ====================================================================
-- 3. Trips Table
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.trips (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    destination TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_days INT NOT NULL CHECK (total_days > 0),
    travelers_count INT NOT NULL DEFAULT 1 CHECK (travelers_count > 0),
    travel_type TEXT NOT NULL DEFAULT 'couple',
    travel_style TEXT NOT NULL DEFAULT 'balanced',
    daily_pace TEXT NOT NULL DEFAULT 'moderate',
    total_budget NUMERIC(12, 2) NOT NULL CHECK (total_budget >= 0),
    currency TEXT NOT NULL DEFAULT 'USD',
    accommodation_pref TEXT,
    dietary_pref TEXT,
    accessibility_pref TEXT,
    notes TEXT,
    status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('draft', 'confirmed', 'archived')),
    cover_image TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT valid_dates CHECK (end_date >= start_date)
);

CREATE INDEX IF NOT EXISTS idx_trips_user_id ON public.trips(user_id);
CREATE INDEX IF NOT EXISTS idx_trips_start_date ON public.trips(start_date);

-- ====================================================================
-- 4. Trip Preferences Table (Normalized Tagging)
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.trip_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    interest TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_trip_preferences_trip_id ON public.trip_preferences(trip_id);
CREATE INDEX IF NOT EXISTS idx_trip_preferences_user_id ON public.trip_preferences(user_id);

-- ====================================================================
-- 5. Itinerary Days Table
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.itinerary_days (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    day_number INT NOT NULL CHECK (day_number > 0),
    date DATE,
    summary TEXT,
    estimated_daily_cost NUMERIC(10, 2) DEFAULT 0.00,
    accommodation_name TEXT,
    accommodation_cost NUMERIC(10, 2) DEFAULT 0.00,
    accommodation_tip TEXT,
    transit_tip TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT unique_day_per_trip UNIQUE (trip_id, day_number)
);

CREATE INDEX IF NOT EXISTS idx_itinerary_days_trip_id ON public.itinerary_days(trip_id);
CREATE INDEX IF NOT EXISTS idx_itinerary_days_user_id ON public.itinerary_days(user_id);

-- ====================================================================
-- 6. Itinerary Activities Table
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.itinerary_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    day_id UUID NOT NULL REFERENCES public.itinerary_days(id) ON DELETE CASCADE,
    trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    time_slot TEXT NOT NULL CHECK (time_slot IN ('morning', 'afternoon', 'evening')),
    title TEXT NOT NULL,
    description TEXT,
    start_time TEXT,
    duration_minutes INT DEFAULT 60 CHECK (duration_minutes >= 0),
    estimated_cost NUMERIC(10, 2) DEFAULT 0.00 CHECK (estimated_cost >= 0),
    location_name TEXT,
    category TEXT DEFAULT 'sightseeing',
    meal_type TEXT,
    booking_tip TEXT,
    is_alternative BOOLEAN DEFAULT FALSE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_activities_day_id ON public.itinerary_activities(day_id);
CREATE INDEX IF NOT EXISTS idx_activities_trip_id ON public.itinerary_activities(trip_id);
CREATE INDEX IF NOT EXISTS idx_activities_user_id ON public.itinerary_activities(user_id);

-- ====================================================================
-- 7. Automated Timestamps Trigger
-- ====================================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_profiles_updated_at ON public.profiles;
CREATE TRIGGER trigger_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trigger_trips_updated_at ON public.trips;
CREATE TRIGGER trigger_trips_updated_at
    BEFORE UPDATE ON public.trips
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trigger_days_updated_at ON public.itinerary_days;
CREATE TRIGGER trigger_days_updated_at
    BEFORE UPDATE ON public.itinerary_days
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trigger_activities_updated_at ON public.itinerary_activities;
CREATE TRIGGER trigger_activities_updated_at
    BEFORE UPDATE ON public.itinerary_activities
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ====================================================================
-- 8. Auto Profile Provisioning Trigger on Signup
-- ====================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, avatar_url)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80')
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ====================================================================
-- 9. Row Level Security (RLS) Policies
-- ====================================================================
-- Enable RLS across all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.itinerary_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.itinerary_activities ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can view and update only their own profile
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Trips: Users can perform all operations on their own trips
DROP POLICY IF EXISTS "Users can view own trips" ON public.trips;
CREATE POLICY "Users can view own trips"
    ON public.trips FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own trips" ON public.trips;
CREATE POLICY "Users can insert own trips"
    ON public.trips FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own trips" ON public.trips;
CREATE POLICY "Users can update own trips"
    ON public.trips FOR UPDATE
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own trips" ON public.trips;
CREATE POLICY "Users can delete own trips"
    ON public.trips FOR DELETE
    USING (auth.uid() = user_id);

-- Trip Preferences
DROP POLICY IF EXISTS "Users can view own trip preferences" ON public.trip_preferences;
CREATE POLICY "Users can view own trip preferences"
    ON public.trip_preferences FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own trip preferences" ON public.trip_preferences;
CREATE POLICY "Users can insert own trip preferences"
    ON public.trip_preferences FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own trip preferences" ON public.trip_preferences;
CREATE POLICY "Users can delete own trip preferences"
    ON public.trip_preferences FOR DELETE
    USING (auth.uid() = user_id);

-- Itinerary Days
DROP POLICY IF EXISTS "Users can view own itinerary days" ON public.itinerary_days;
CREATE POLICY "Users can view own itinerary days"
    ON public.itinerary_days FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own itinerary days" ON public.itinerary_days;
CREATE POLICY "Users can insert own itinerary days"
    ON public.itinerary_days FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own itinerary days" ON public.itinerary_days;
CREATE POLICY "Users can update own itinerary days"
    ON public.itinerary_days FOR UPDATE
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own itinerary days" ON public.itinerary_days;
CREATE POLICY "Users can delete own itinerary days"
    ON public.itinerary_days FOR DELETE
    USING (auth.uid() = user_id);

-- Itinerary Activities
DROP POLICY IF EXISTS "Users can view own activities" ON public.itinerary_activities;
CREATE POLICY "Users can view own activities"
    ON public.itinerary_activities FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own activities" ON public.itinerary_activities;
CREATE POLICY "Users can insert own activities"
    ON public.itinerary_activities FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own activities" ON public.itinerary_activities;
CREATE POLICY "Users can update own activities"
    ON public.itinerary_activities FOR UPDATE
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own activities" ON public.itinerary_activities;
CREATE POLICY "Users can delete own activities"
    ON public.itinerary_activities FOR DELETE
    USING (auth.uid() = user_id);
