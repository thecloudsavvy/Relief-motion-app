'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { createServerClient } from '@supabase/ssr'

export async function createPatient(formData: FormData) {
  // 1. Cookie-based client to get the logged-in physio's ID
  const cookieClient = await createClient()
  const { data: { user: physio } } = await cookieClient.auth.getUser()

  if (!physio) {
    return redirect('/login')
  }

  // 2. Admin client (service-role) for creating users — bypasses RLS
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

  const adminClient = createServerClient(supabaseUrl, serviceRoleKey, {
    cookies: {
      getAll: () => [],
      setAll: () => {},
    }
  })

  const fullName = formData.get('full_name') as string
  const phone = formData.get('phone') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string || 'default123!'
  const condition = formData.get('condition') as string
  const notes = formData.get('notes') as string

  // 3. Create auth user via admin client (triggers profile creation)
  const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
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

  // 4. Create the patient record with the CORRECT physio ID
  const { error: patientError } = await adminClient
    .from('patients')
    .insert({
      id: authData.user.id,
      condition,
      notes,
      assigned_physio_id: physio.id  // Now correctly set from the cookie-based client
    })

  if (patientError) {
    console.error("Error creating patient record:", patientError)
    return redirect('/physio/patients/new?error=Failed to create patient details')
  }

  revalidatePath('/physio/patients')
  redirect('/physio/patients')
}
