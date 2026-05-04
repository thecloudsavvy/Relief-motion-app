'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function assignExercise(formData: FormData) {
  const supabase = await createClient()

  const patientId = formData.get('patient_id') as string
  const exerciseId = formData.get('exercise_id') as string
  const reps = formData.get('reps') as string
  const frequency = formData.get('frequency') as string

  const { error } = await supabase
    .from('patient_exercises')
    .insert({
      patient_id: patientId,
      exercise_id: exerciseId,
      reps,
      frequency
    })

  if (error) {
    console.error("Assignment error:", error)
    return redirect(`/physio/patients/${patientId}/assign?error=Could not assign exercise`)
  }

  revalidatePath(`/physio/patients/${patientId}`)
  redirect(`/physio/patients/${patientId}?message=Exercise assigned successfully`)
}
