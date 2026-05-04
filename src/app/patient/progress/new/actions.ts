'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function logProgress(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const painLevel = parseInt(formData.get('pain_level') as string)
  const completed = formData.get('completed') === 'on'

  // Current date (YYYY-MM-DD)
  const today = new Date().toISOString().split('T')[0]

  // Check if already checked in today
  const { data: existing } = await supabase
    .from('progress_logs')
    .select('id')
    .eq('patient_id', user.id)
    .eq('date', today)
    .maybeSingle()

  if (existing) {
    return redirect('/patient/dashboard?message=You have already checked in today!')
  }

  const { error } = await supabase
    .from('progress_logs')
    .insert({
      patient_id: user.id,
      date: today,
      completed,
      pain_level: painLevel
    })

  if (error) {
    console.error("Error logging progress:", error)
    return redirect('/patient/progress/new?error=Could not log progress')
  }

  revalidatePath('/patient/dashboard')
  revalidatePath('/patient/progress')
  redirect('/patient/dashboard?message=Check-in complete!')
}
