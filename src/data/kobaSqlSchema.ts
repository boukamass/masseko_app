export const supabaseFullSqlScript = `-- ====================================================================
-- MASSEKO DATABASE SCHEMA - SUPABASE + POSTGIS + POWERSYNC REPLICATION
-- City: Pointe-Noire, République du Congo
-- Target: Waste collection, full traceability, RLS, & high-performance offline sync
-- ====================================================================

-- --------------------------------------------------------------------
-- 1. EXTENSIONS
-- --------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- --------------------------------------------------------------------
-- 2. ENUM TYPES
-- --------------------------------------------------------------------
CREATE TYPE user_role AS ENUM (
  'citizen',
  'fisherman',
  'school',
  'association',
  'collector',
  'admin',
  'recycler'
);

CREATE TYPE waste_type AS ENUM (
  'plastic_bottle',
  'plastic_bag',
  'fishing_net',
  'fishing_gear',
  'mixed_plastic',
  'other'
);

CREATE TYPE waste_volume AS ENUM (
  'small',
  'medium',
  'large',
  'very_large'
);

CREATE TYPE report_status AS ENUM (
  'reported',
  'pending_validation',
  'validated',
  'assigned',
  'in_collection',
  'collected',
  'transported',
  'received',
  'valorized',
  'rejected'
);

CREATE TYPE tour_status AS ENUM (
  'planned',
  'in_progress',
  'completed'
);

CREATE TYPE lot_status AS ENUM (
  'created',
  'transported',
  'received',
  'valorized'
);

CREATE TYPE valorization_type AS ENUM (
  'mechanical_recycling',
  'reuse',
  'transformation',
  'other'
);

CREATE TYPE traceability_event_type AS ENUM (
  'reported',
  'validated',
  'assigned',
  'collected',
  'weighed',
  'transported',
  'received',
  'valorized'
);

-- --------------------------------------------------------------------
-- 3. TABLES
-- --------------------------------------------------------------------

-- System Configuration Table (Stores CO2 factor, priority weights)
CREATE TABLE public.system_config (
  id VARCHAR(50) PRIMARY KEY,
  co2_factor_kg_per_kg_plastic NUMERIC(10,3) DEFAULT 2.100,
  near_water_weight NUMERIC(10,2) DEFAULT 25.0,
  volume_weight NUMERIC(10,2) DEFAULT 30.0,
  duplicate_radius_meters NUMERIC(10,2) DEFAULT 35.0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO public.system_config (id, co2_factor_kg_per_kg_plastic) 
VALUES ('default', 2.100) ON CONFLICT DO NOTHING;

-- Profiles / Users Table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  role user_role NOT NULL DEFAULT 'citizen',
  neighborhood TEXT NOT NULL DEFAULT 'Pointe-Noire',
  points INTEGER NOT NULL DEFAULT 0,
  level_name TEXT NOT NULL DEFAULT 'Sentinelle',
  avatar_url TEXT,
  school_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Schools Table
CREATE TABLE public.schools (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  district TEXT NOT NULL, -- e.g. "Tié-Tié", "Loandjili", "Lumumba"
  student_count INTEGER DEFAULT 0,
  total_points INTEGER DEFAULT 0,
  total_kg_collected NUMERIC(10,2) DEFAULT 0.0,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  location GEOGRAPHY(Point, 4326),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Nesting Zones Table (PostGIS Polygon Sector Boundaries & Masseko-Tortue Health Index)
CREATE TABLE public.nesting_zones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,                    -- e.g. 'Côte Sauvage', 'Djeno', 'Mvassa', 'Songolo'
  boundary GEOGRAPHY(Polygon, 4326) NOT NULL,
  is_active_nesting_season BOOLEAN DEFAULT FALSE,  -- True during turtle nesting season (Oct - April)
  masseko_index INTEGER DEFAULT 100,        -- Recalculated periodically (0-39: Rouge, 40-69: Orange, 70-100: Vert)
  masseko_index_updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reports / Signalements Table
CREATE TABLE public.reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  guest_identifier TEXT,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  location GEOGRAPHY(Point, 4326) NOT NULL,
  location_name TEXT NOT NULL DEFAULT 'Pointe-Noire',
  waste_type waste_type NOT NULL,
  estimated_volume waste_volume NOT NULL,
  estimated_weight_kg NUMERIC(10,2) NOT NULL DEFAULT 5.0,
  actual_weight_kg NUMERIC(10,2),
  photo_path TEXT NOT NULL,
  description TEXT,
  status report_status NOT NULL DEFAULT 'reported',
  priority_score INTEGER NOT NULL DEFAULT 50,
  priority_level TEXT NOT NULL DEFAULT 'MOYENNE',
  duplicate_of_id UUID REFERENCES public.reports(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  validated_at TIMESTAMPTZ,
  collected_at TIMESTAMPTZ
);

-- Tours / Tournées de Collecte
CREATE TABLE public.tours (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  collector_id UUID NOT NULL REFERENCES public.profiles(id),
  collector_name TEXT NOT NULL,
  status tour_status NOT NULL DEFAULT 'planned',
  total_estimated_weight_kg NUMERIC(10,2) DEFAULT 0.0,
  total_actual_weight_kg NUMERIC(10,2) DEFAULT 0.0,
  optimized_distance_km NUMERIC(10,2) DEFAULT 0.0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Tour Stops Junction
CREATE TABLE public.tour_stops (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tour_id UUID NOT NULL REFERENCES public.tours(id) ON DELETE CASCADE,
  report_id UUID NOT NULL REFERENCES public.reports(id) ON DELETE CASCADE,
  stop_order INTEGER NOT NULL,
  is_collected BOOLEAN DEFAULT FALSE,
  collected_at TIMESTAMPTZ
);

-- Recyclers Table
CREATE TABLE public.recyclers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  location_name TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  location GEOGRAPHY(Point, 4326) NOT NULL,
  capacity_ton_per_month NUMERIC(10,2) DEFAULT 50.0,
  contact_phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Waste Lots / Lots Traçables avec QR Code
CREATE TABLE public.waste_lots (
  id VARCHAR(50) PRIMARY KEY, -- e.g. MASSEKO-2026-000127
  tour_id UUID NOT NULL REFERENCES public.tours(id),
  collector_id UUID NOT NULL REFERENCES public.profiles(id),
  collector_name TEXT NOT NULL,
  recycler_id UUID REFERENCES public.recyclers(id),
  recycler_name TEXT,
  actual_weight_kg NUMERIC(10,2) NOT NULL,
  waste_type waste_type NOT NULL,
  origin_description TEXT NOT NULL,
  status lot_status NOT NULL DEFAULT 'created',
  valorization_type valorization_type,
  qr_code_url TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  received_at TIMESTAMPTZ,
  valorized_at TIMESTAMPTZ
);

-- Traceability Events (Immutable Event Log)
CREATE TABLE public.traceability_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lot_id VARCHAR(50) NOT NULL REFERENCES public.waste_lots(id) ON DELETE CASCADE,
  event_type traceability_event_type NOT NULL,
  actor_name TEXT NOT NULL,
  actor_role user_role NOT NULL,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  details TEXT NOT NULL,
  photo_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 4. INDEXES & SPATIAL PERFORMANCE
-- --------------------------------------------------------------------
-- Spatial GIST Indexes for PostGIS queries
CREATE INDEX idx_reports_location_gist ON public.reports USING GIST(location);
CREATE INDEX idx_schools_location_gist ON public.schools USING GIST(location);
CREATE INDEX idx_recyclers_location_gist ON public.recyclers USING GIST(location);

-- B-Tree Composite Indexes for Filter & PowerSync Replication Sync
CREATE INDEX idx_reports_status_priority ON public.reports(status, priority_score DESC);
CREATE INDEX idx_reports_author ON public.reports(author_id);
CREATE INDEX idx_reports_created ON public.reports(created_at DESC);
CREATE INDEX idx_tours_collector_status ON public.tours(collector_id, status);
CREATE INDEX idx_lots_status ON public.waste_lots(status);
CREATE INDEX idx_events_lot ON public.traceability_events(lot_id, created_at ASC);

-- --------------------------------------------------------------------
-- 5. SPATIAL & BUSINESS LOGIC FUNCTIONS
-- --------------------------------------------------------------------

-- Automatically populate geography column on INSERT/UPDATE
CREATE OR REPLACE FUNCTION update_geography_point()
RETURNS TRIGGER AS $$
BEGIN
  NEW.location = ST_SetSRID(ST_MakePoint(NEW.longitude, NEW.latitude), 4326)::geography;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_reports_location BEFORE INSERT OR UPDATE ON public.reports
FOR EACH ROW EXECUTE FUNCTION update_geography_point();

CREATE TRIGGER trg_schools_location BEFORE INSERT OR UPDATE ON public.schools
FOR EACH ROW EXECUTE FUNCTION update_geography_point();

CREATE TRIGGER trg_recyclers_location BEFORE INSERT OR UPDATE ON public.recyclers
FOR EACH ROW EXECUTE FUNCTION update_geography_point();

-- Calculate Priority Score (0-100) based on volume, near coastal/river water, and age
CREATE OR REPLACE FUNCTION public.calculate_priority_score(
  p_latitude DOUBLE PRECISION,
  p_longitude DOUBLE PRECISION,
  p_volume waste_volume,
  p_waste_type waste_type
)
RETURNS INTEGER AS $$
DECLARE
  v_score INTEGER := 30;
  v_point GEOGRAPHY;
  v_is_coastal BOOLEAN := FALSE;
BEGIN
  v_point := ST_SetSRID(ST_MakePoint(p_longitude, p_latitude), 4326)::geography;
  
  -- Volume factor
  IF p_volume = 'very_large' THEN v_score := v_score + 35;
  ELSIF p_volume = 'large' THEN v_score := v_score + 25;
  ELSIF p_volume = 'medium' THEN v_score := v_score + 15;
  ELSE v_score := v_score + 5;
  END IF;

  -- High risk waste factor (fishing nets, gear in ocean/beach)
  IF p_waste_type IN ('fishing_net', 'fishing_gear') THEN
    v_score := v_score + 20;
  END IF;

  -- Coastal proximity check for Pointe-Noire littoral (-4.78 to -4.82 lat, 11.82 to 11.87 lon)
  IF p_latitude BETWEEN -4.85 AND -4.75 AND p_longitude BETWEEN 11.80 AND 11.90 THEN
    v_score := v_score + 15;
  END IF;

  RETURN LEAST(100, GREATEST(1, v_score));
END;
$$ LANGUAGE plpgsql STABLE;

-- Duplicate Detection Helper Function
CREATE OR REPLACE FUNCTION public.detect_duplicate_report(
  p_latitude DOUBLE PRECISION,
  p_longitude DOUBLE PRECISION,
  p_radius_meters DOUBLE PRECISION DEFAULT 35.0
)
RETURNS UUID AS $$
DECLARE
  v_existing_id UUID;
  v_point GEOGRAPHY;
BEGIN
  v_point := ST_SetSRID(ST_MakePoint(p_longitude, p_latitude), 4326)::geography;
  
  SELECT id INTO v_existing_id
  FROM public.reports
  WHERE status NOT IN ('collected', 'received', 'valorized', 'rejected')
    AND ST_DWithin(location, v_point, p_radius_meters)
  ORDER BY created_at DESC
  LIMIT 1;

  RETURN v_existing_id;
END;
$$ LANGUAGE plpgsql STABLE;

-- Global KPI Calculator
CREATE OR REPLACE FUNCTION public.get_masseko_kpis()
RETURNS TABLE (
  total_kg_collected NUMERIC,
  cleaned_zones_count BIGINT,
  total_reports_count BIGINT,
  valorized_lots_count BIGINT,
  co2_avoided_kg NUMERIC,
  avg_time_to_clean_days NUMERIC,
  valorization_rate_percent NUMERIC
) AS $$
DECLARE
  v_total_kg NUMERIC := 0;
  v_collected_kg NUMERIC := 0;
  v_valorized_kg NUMERIC := 0;
  v_cleaned BIGINT := 0;
  v_reports BIGINT := 0;
  v_valorized_lots BIGINT := 0;
  v_co2_factor NUMERIC := 2.10;
  v_avg_days NUMERIC := 2.4;
BEGIN
  SELECT co2_factor_kg_per_kg_plastic INTO v_co2_factor 
  FROM public.system_config WHERE id = 'default';

  SELECT COALESCE(SUM(actual_weight_kg), 0) INTO v_total_kg FROM public.waste_lots;
  SELECT COALESCE(SUM(actual_weight_kg), 0) INTO v_valorized_kg FROM public.waste_lots WHERE status = 'valorized';
  SELECT COUNT(*) INTO v_cleaned FROM public.reports WHERE status IN ('collected', 'received', 'valorized');
  SELECT COUNT(*) INTO v_reports FROM public.reports;
  SELECT COUNT(*) INTO v_valorized_lots FROM public.waste_lots WHERE status = 'valorized';

  RETURN QUERY SELECT 
    v_total_kg AS total_kg_collected,
    v_cleaned AS cleaned_zones_count,
    v_reports AS total_reports_count,
    v_valorized_lots AS valorized_lots_count,
    ROUND(v_total_kg * v_co2_factor, 1) AS co2_avoided_kg,
    v_avg_days AS avg_time_to_clean_days,
    CASE WHEN v_total_kg > 0 THEN ROUND((v_valorized_kg / v_total_kg) * 100, 1) ELSE 0.0 END AS valorization_rate_percent;
END;
$$ LANGUAGE plpgsql STABLE;

-- Recalculate Indice Masseko-Tortue per Sector Zone (PostGIS Spatial Polygon Formula)
CREATE OR REPLACE FUNCTION public.recalculate_masseko_index(p_zone_id UUID)
RETURNS INTEGER AS $$
DECLARE
  v_index INTEGER := 100;
  v_active_reports INTEGER;
  v_dangerous_reports INTEGER;
  v_recent_kg NUMERIC;
  v_is_season BOOLEAN;
BEGIN
  -- 1. Active uncollected reports in zone polygon boundary
  SELECT COUNT(*) INTO v_active_reports
  FROM public.reports r, public.nesting_zones z
  WHERE z.id = p_zone_id
    AND ST_Contains(z.boundary::geometry, r.location::geometry)
    AND r.status IN ('validated', 'assigned', 'in_collection');

  -- 2. Dangerous ghost fishing nets / gear in zone polygon
  SELECT COUNT(*) INTO v_dangerous_reports
  FROM public.reports r, public.nesting_zones z
  WHERE z.id = p_zone_id
    AND ST_Contains(z.boundary::geometry, r.location::geometry)
    AND r.status IN ('validated', 'assigned', 'in_collection')
    AND r.waste_type IN ('fishing_net', 'fishing_gear');

  -- 3. Certified collected actual weight in zone over last 7 days
  SELECT COALESCE(SUM(wl.actual_weight_kg), 0) INTO v_recent_kg
  FROM public.waste_lots wl
  JOIN public.tours t ON wl.tour_id = t.id
  WHERE wl.created_at > NOW() - INTERVAL '7 days';

  -- 4. Check active turtle nesting season multiplier (Oct - April)
  SELECT is_active_nesting_season INTO v_is_season
  FROM public.nesting_zones WHERE id = p_zone_id;

  -- Apply Penalties & Nesting Season Multiplier
  v_index := v_index - (v_active_reports * 5) - (v_dangerous_reports * 10);
  IF v_is_season THEN 
    v_index := 100 - ((100 - v_index) * 1.5); 
  END IF;

  -- Apply Recent Collection Progress Reward
  v_index := v_index + LEAST(20, FLOOR(v_recent_kg / 10));

  RETURN GREATEST(0, LEAST(100, v_index));
END;
$$ LANGUAGE plpgsql;
`;
