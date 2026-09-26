export const rlsPoliciesSqlScript = `-- ====================================================================
-- MASSEKO ROW LEVEL SECURITY (RLS) POLICIES
-- Strict role-based security policies for Citizens, Collectors, Admins, Recyclers & Guests
-- ====================================================================

-- Enable RLS on all core tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tours ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tour_stops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.waste_lots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recyclers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.traceability_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_config ENABLE ROW LEVEL SECURITY;

-- --------------------------------------------------------------------
-- HELPER ROLE FUNCTION
-- --------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS user_role AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- --------------------------------------------------------------------
-- 1. PROFILES POLICIES
-- --------------------------------------------------------------------
-- Public read for basic profile attributes (for leaderboards & stats)
CREATE POLICY "Profiles are readable by authenticated users"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

-- User can update their own profile
CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (id = auth.uid());

-- Admin can manage all profiles
CREATE POLICY "Admin full access to profiles"
  ON public.profiles FOR ALL
  TO authenticated
  USING (public.current_user_role() = 'admin');

-- --------------------------------------------------------------------
-- 2. REPORTS POLICIES
-- --------------------------------------------------------------------
-- Public & Guest Read Access to Reports for the Map & Hotspots
CREATE POLICY "Reports are publicly viewable"
  ON public.reports FOR SELECT
  TO public
  USING (true);

-- Authenticated Users & Guest Signalment Creation
CREATE POLICY "Anyone can create a report"
  ON public.reports FOR INSERT
  TO public
  WITH CHECK (true);

-- Citizens can update their own unvalidated reports
CREATE POLICY "Authors can edit unvalidated reports"
  ON public.reports FOR UPDATE
  TO authenticated
  USING (
    author_id = auth.uid() 
    AND status IN ('reported', 'pending_validation')
  );

-- Collectors & Admins can update status & collected weights
CREATE POLICY "Collectors and Admins can update report status"
  ON public.reports FOR UPDATE
  TO authenticated
  USING (public.current_user_role() IN ('collector', 'admin'));

-- --------------------------------------------------------------------
-- 3. TOURS & TOUR STOPS POLICIES
-- --------------------------------------------------------------------
-- Collectors can see assigned tours; Admins see all
CREATE POLICY "View tours"
  ON public.tours FOR SELECT
  TO authenticated
  USING (
    collector_id = auth.uid() 
    OR public.current_user_role() = 'admin'
  );

-- Admins create & manage tours
CREATE POLICY "Admins manage tours"
  ON public.tours FOR ALL
  TO authenticated
  USING (public.current_user_role() = 'admin');

-- Collectors can update status of assigned tour
CREATE POLICY "Collectors update assigned tour status"
  ON public.tours FOR UPDATE
  TO authenticated
  USING (collector_id = auth.uid());

-- Tour stops viewable by tour collector or admin
CREATE POLICY "View tour stops"
  ON public.tour_stops FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.tours t 
      WHERE t.id = tour_stops.tour_id 
        AND (t.collector_id = auth.uid() OR public.current_user_role() = 'admin')
    )
  );

-- --------------------------------------------------------------------
-- 4. WASTE LOTS & TRACEABILITY EVENTS POLICIES
-- --------------------------------------------------------------------
-- Waste Lots viewable by public for QR transparency
CREATE POLICY "Waste Lots are viewable by public"
  ON public.waste_lots FOR SELECT
  TO public
  USING (true);

-- Collectors create lots from tours
CREATE POLICY "Collectors create waste lots"
  ON public.waste_lots FOR INSERT
  TO authenticated
  WITH CHECK (
    collector_id = auth.uid() 
    OR public.current_user_role() = 'admin'
  );

-- Recyclers can update lot status when receiving/valorizing
CREATE POLICY "Recyclers update lot status"
  ON public.waste_lots FOR UPDATE
  TO authenticated
  USING (
    recycler_id = auth.uid() 
    OR public.current_user_role() IN ('admin', 'recycler')
  );

-- Traceability events viewable by public for complete transparency
CREATE POLICY "Traceability events viewable by public"
  ON public.traceability_events FOR SELECT
  TO public
  USING (true);

-- Traceability events inserted by Collectors, Admins, Recyclers
CREATE POLICY "Authorized roles insert traceability events"
  ON public.traceability_events FOR INSERT
  TO authenticated
  WITH CHECK (public.current_user_role() IN ('collector', 'admin', 'recycler'));

-- --------------------------------------------------------------------
-- 5. RECYCLERS & SCHOOLS POLICIES
-- --------------------------------------------------------------------
CREATE POLICY "Recyclers public view" ON public.recyclers FOR SELECT TO public USING (true);
CREATE POLICY "Schools public view" ON public.schools FOR SELECT TO public USING (true);
CREATE POLICY "System config public view" ON public.system_config FOR SELECT TO public USING (true);

-- --------------------------------------------------------------------
-- 6. POSTGIS TURTLE NEST GPS ANONYMIZATION VIEW & POLICY (ANTI-BRACONNAGE)
-- --------------------------------------------------------------------
-- Anonymizes precise GPS coordinates for nesting zones (is_nesting_zone = true)
-- when viewed by public/unverified users, blurring location within a 800m grid.
-- Prevents egg poaching and nest destruction on Pointe-Noire beaches.

CREATE OR REPLACE VIEW public.reports_public_anonymized AS
SELECT 
  id,
  waste_type,
  estimated_volume,
  estimated_weight_kg,
  status,
  priority_level,
  turtle_danger_level,
  is_nesting_zone,
  CASE 
    -- Verified Rangers, Éco-Gardes Accrédités, Admins, Collectors receive exact GPS coordinates
    WHEN public.current_user_role() IN ('admin', 'collector', 'association') OR is_nesting_zone = FALSE 
    THEN latitude
    -- Public users receive blurred coordinates (approx 800m grid buffer)
    ELSE ROUND(latitude::numeric, 2)::double precision
  END AS latitude,
  CASE 
    WHEN public.current_user_role() IN ('admin', 'collector', 'association') OR is_nesting_zone = FALSE 
    THEN longitude
    ELSE ROUND(longitude::numeric, 2)::double precision
  END AS longitude,
  created_at
FROM public.reports;
`;
