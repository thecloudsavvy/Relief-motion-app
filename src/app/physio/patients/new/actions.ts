'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createServerClient } from '@supabase/ssr'

export async function createPatient(formData: FormData) {
  // We need the service role key to bypass RLS and create a user in auth.users
  // If not available, we use the regular client, but creating users is restricted by default.
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll: () => [],
      setAll: () => {},
    }
  })

  // We also need the current physio ID
  const { data: { user } } = await supabase.auth.getUser()

  const fullName = formData.get('full_name') as string
  const phone = formData.get('phone') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string || 'default123!' // Default password for MVP
  const condition = formData.get('condition') as string
  const notes = formData.get('notes') as string

  // 1. Create auth user (this will trigger profile creation)
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: email,
    password: password,
    email_confirm: true,
    user_metadata: {
      full_name: fullName,
      phone: phone,
      role: 'patient'
    }
  })

  if (authError || !authData.user) {
    console.error("Error creating auth user:", authError)
    return redirect('/physio/patients/new?error=Failed to create patient account')
  }

  // 2. Wait a moment for the trigger to create the profile, or handle it manually if we don't have the trigger setup correctly yet.
  // Assuming the trigger works, the profile exists. We just create the patient record.
  
  const { error: patientError } = await supabase
    .from('patients')
    .insert({
      id: authData.user.id,
      condition,
      notes,
      assigned_physio_id: user?.id
    })

  if (patientError) {
    console.error("Error creating patient record:", patientError)
    // Could not create patient record, but auth user was created.
    return redirect('/physio/patients/new?error=Failed to create patient details')
  }

  revalidatePath('/physio/patients')
  redirect('/physio/patients')
}
