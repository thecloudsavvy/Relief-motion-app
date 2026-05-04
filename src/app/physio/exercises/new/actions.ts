'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function createExercise(formData: FormData) {
  const supabase = await createClient()

  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const videoUrlOption = formData.get('video_url') as string
  const uploadedUrl = formData.get('uploaded_url') as string

  // Use the manually provided URL, or the client-uploaded URL, or a fallback
  const finalVideoUrl = videoUrlOption || uploadedUrl || '/videos/example.mp4';

  // Insert the exercise into the database
  const { error } = await supabase
    .from('exercises')
    .insert({
      name,
      description,
      video_url: finalVideoUrl
    })

  if (error) {
    console.error("Insert error:", error)
    return redirect('/physio/exercises/new?error=Could not save exercise')
  }

  revalidatePath('/physio/exercises')
  redirect('/physio/exercises?message=Exercise added to library!')
}
