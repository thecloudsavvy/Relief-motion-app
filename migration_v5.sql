-- ============================================================
-- Relief Motion v5 Migration - Fix Patients Table RLS Recursion
-- Run this ENTIRE script in Supabase SQL Editor
-- ============================================================

-- 1. Update the patients table policy to also use the secure function
-- This prevents infinite recursion when joining profiles and patients
DROP POLICY IF EXISTS "Physios can view all patients" ON public.patients;

CREATE POLICY "Physios can view all patients"
ON public.patients FOR SELECT TO authenticated
USING (
  public.is_physio()
);

-- 2. Let's also make sure the profiles policy is absolutely clean
DROP POLICY IF EXISTS "Physios can view all patient profiles" ON public.profiles;

CREATE POLICY "Physios can view all patient profiles"
ON public.profiles FOR SELECT TO authenticated
USING (
  role = 'patient' AND public.is_physio()
);
