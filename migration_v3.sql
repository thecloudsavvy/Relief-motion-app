-- ============================================================
-- Relief Motion v3 Migration
-- Run this ENTIRE script in Supabase SQL Editor
-- ============================================================

-- --------------------------------------------------------
-- 1. UPDATE PROFILES RLS
-- --------------------------------------------------------
-- Drop the restrictive policy that only allows physios to see assigned patients
DROP POLICY IF EXISTS "Physios can view patient profiles" ON public.profiles;
DROP POLICY IF EXISTS "Physios can view all patient profiles" ON public.profiles;

-- Create a new policy that allows physios to see ALL patient profiles.
-- We use auth.jwt() to check the physio role to avoid infinite recursion on the profiles table.
CREATE POLICY "Physios can view all patient profiles"
ON public.profiles FOR SELECT TO authenticated
USING (
  role = 'patient' AND 
  (auth.jwt() -> 'user_metadata' ->> 'role') = 'physio'
);

-- --------------------------------------------------------
-- 2. UPDATE PATIENTS RLS (Optional, but good for completeness)
-- --------------------------------------------------------
-- Allow physios to view ALL patient records, not just assigned ones
DROP POLICY IF EXISTS "Physios can view assigned patients" ON public.patients;
DROP POLICY IF EXISTS "Physios can view all patients" ON public.patients;

CREATE POLICY "Physios can view all patients"
ON public.patients FOR SELECT TO authenticated
USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'physio')
);
