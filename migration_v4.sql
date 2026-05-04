-- ============================================================
-- Relief Motion v4 Migration - Fix RLS Recursion / Auth Check
-- Run this ENTIRE script in Supabase SQL Editor
-- ============================================================

-- 1. Create a secure function to check if current user is a physio
-- By using SECURITY DEFINER, this function bypasses RLS and prevents infinite recursion
CREATE OR REPLACE FUNCTION public.is_physio()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'physio'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Update the profiles policy to use this new secure function
DROP POLICY IF EXISTS "Physios can view all patient profiles" ON public.profiles;

CREATE POLICY "Physios can view all patient profiles"
ON public.profiles FOR SELECT TO authenticated
USING (
  role = 'patient' AND public.is_physio()
);
