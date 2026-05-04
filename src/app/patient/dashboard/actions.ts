'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'

export async function markExerciseDone(formData: FormData) {
  const supabase = await createClient()
  const exerciseId = formData.get('exercise_id') as string

  const { error } = await supabase
    .from('patient_exercises')
    .update({ completed_at: new Date().toISOString() })
    .eq('id', exerciseId)

  if (error) {
    console.error("Error marking exercise done:", error)
  }

  revalidatePath('/patient/dashboard')
}
