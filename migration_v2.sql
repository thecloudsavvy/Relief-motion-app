-- ============================================================
-- Relief Motion v2 Migration
-- Run this ENTIRE script in Supabase SQL Editor
-- ============================================================

-- --------------------------------------------------------
-- 1. FIX PROFILE TRIGGER (phone was reading wrong field)
-- --------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone_number, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', 'Unknown'),
    COALESCE(new.raw_user_meta_data->>'phone', new.phone),
    COALESCE((new.raw_user_meta_data->>'role')::public.user_role, 'patient'::public.user_role)
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- --------------------------------------------------------
-- 2. ADD completed_at COLUMN TO patient_exercises
-- --------------------------------------------------------
ALTER TABLE public.patient_exercises
ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;

-- --------------------------------------------------------
-- 3. ADD UNIQUE CONSTRAINT (prevent duplicate daily check-ins)
-- --------------------------------------------------------
ALTER TABLE public.progress_logs
ADD CONSTRAINT unique_patient_daily_log UNIQUE (patient_id, date);

-- --------------------------------------------------------
-- 4. DROP OLD WIDE-OPEN RLS POLICIES
-- --------------------------------------------------------
DROP POLICY IF EXISTS "Allow authenticated full access to profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow authenticated full access to patients" ON public.patients;
DROP POLICY IF EXISTS "Allow authenticated full access to sessions" ON public.sessions;
DROP POLICY IF EXISTS "Allow authenticated full access to exercises" ON public.exercises;
DROP POLICY IF EXISTS "Allow authenticated full access to patient_exercises" ON public.patient_exercises;
DROP POLICY IF EXISTS "Allow authenticated full access to progress_logs" ON public.progress_logs;

-- --------------------------------------------------------
-- 5. NEW ROLE-BASED RLS POLICIES
-- --------------------------------------------------------

-- === PROFILES ===
-- Everyone can read their own profile
CREATE POLICY "Users can view own profile"
ON public.profiles FOR SELECT TO authenticated
USING (auth.uid() = id);

-- Physios can view profiles of their assigned patients
CREATE POLICY "Physios can view patient profiles"
ON public.profiles FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.patients
    WHERE patients.id = profiles.id
    AND patients.assigned_physio_id = auth.uid()
  )
);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE TO authenticated
USING (auth.uid() = id);

-- Allow insert (needed for trigger / admin user creation)
CREATE POLICY "Allow profile insert"
ON public.profiles FOR INSERT TO authenticated
WITH CHECK (true);

-- === PATIENTS ===
-- Patients can read their own row
CREATE POLICY "Patients can view own record"
ON public.patients FOR SELECT TO authenticated
USING (id = auth.uid());

-- Physios can read/write their assigned patients
CREATE POLICY "Physios can view assigned patients"
ON public.patients FOR SELECT TO authenticated
USING (assigned_physio_id = auth.uid());

CREATE POLICY "Physios can insert patients"
ON public.patients FOR INSERT TO authenticated
WITH CHECK (assigned_physio_id = auth.uid());

CREATE POLICY "Physios can update assigned patients"
ON public.patients FOR UPDATE TO authenticated
USING (assigned_physio_id = auth.uid());

-- === EXERCISES ===
-- Anyone authenticated can view exercises
CREATE POLICY "Anyone can view exercises"
ON public.exercises FOR SELECT TO authenticated
USING (true);

-- Only physios can create/update/delete exercises
-- (We check role via profiles table)
CREATE POLICY "Physios can manage exercises"
ON public.exercises FOR INSERT TO authenticated
WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'physio')
);

CREATE POLICY "Physios can update exercises"
ON public.exercises FOR UPDATE TO authenticated
USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'physio')
);

CREATE POLICY "Physios can delete exercises"
ON public.exercises FOR DELETE TO authenticated
USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'physio')
);

-- === PATIENT_EXERCISES ===
-- Patients can view their own assigned exercises
CREATE POLICY "Patients can view own exercises"
ON public.patient_exercises FOR SELECT TO authenticated
USING (patient_id = auth.uid());

-- Patients can update their own exercises (for Mark Done)
CREATE POLICY "Patients can update own exercises"
ON public.patient_exercises FOR UPDATE TO authenticated
USING (patient_id = auth.uid());

-- Physios can manage exercises for their assigned patients
CREATE POLICY "Physios can assign exercises"
ON public.patient_exercises FOR INSERT TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.patients
    WHERE patients.id = patient_exercises.patient_id
    AND patients.assigned_physio_id = auth.uid()
  )
);

CREATE POLICY "Physios can view assigned patient exercises"
ON public.patient_exercises FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.patients
    WHERE patients.id = patient_exercises.patient_id
    AND patients.assigned_physio_id = auth.uid()
  )
);

-- === PROGRESS_LOGS ===
-- Patients can CRUD their own logs
CREATE POLICY "Patients can manage own logs"
ON public.progress_logs FOR ALL TO authenticated
USING (patient_id = auth.uid())
WITH CHECK (patient_id = auth.uid());

-- Physios can read logs for their assigned patients
CREATE POLICY "Physios can view patient logs"
ON public.progress_logs FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.patients
    WHERE patients.id = progress_logs.patient_id
    AND patients.assigned_physio_id = auth.uid()
  )
);

-- === SESSIONS ===
-- Patients can view their own sessions
CREATE POLICY "Patients can view own sessions"
ON public.sessions FOR SELECT TO authenticated
USING (patient_id = auth.uid());

-- Physios can manage sessions for their patients
CREATE POLICY "Physios can manage sessions"
ON public.sessions FOR ALL TO authenticated
USING (physio_id = auth.uid())
WITH CHECK (physio_id = auth.uid());

-- --------------------------------------------------------
-- DONE! All policies are now role + ownership based.
-- --------------------------------------------------------
