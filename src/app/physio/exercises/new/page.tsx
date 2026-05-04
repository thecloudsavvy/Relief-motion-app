'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button, buttonVariants } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { createExercise } from './actions'
import Link from 'next/link'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'

export default function NewExercisePage() {
  const searchParams = useSearchParams()
  const serverError = searchParams.get('error')
  
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsUploading(true)
    setUploadError(null)

    const form = e.currentTarget
    const formData = new FormData(form)
    const videoFile = formData.get('video') as File | null
    
    let finalUrl = ''

    // 1. Client-Side Upload to Supabase Storage
    if (videoFile && videoFile.size > 0) {
      try {
        const fileExt = videoFile.name.split('.').pop()
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`
        
        const { error } = await supabase.storage
          .from('videos')
          .upload(fileName, videoFile, {
            cacheControl: '3600',
            upsert: false
          })

        if (error) throw error

        const { data: publicUrlData } = supabase.storage
          .from('videos')
          .getPublicUrl(fileName)

        finalUrl = publicUrlData.publicUrl
      } catch (err: any) {
        setUploadError(`Upload failed: ${err.message}. Make sure the 'videos' bucket exists and is public.`)
        setIsUploading(false)
        return
      }
    }

    // 2. Pass the resulting URL to the Server Action (remove the raw file to avoid Next.js limits)
    formData.delete('video') 
    if (finalUrl) {
      formData.set('uploaded_url', finalUrl)
    }
    
    await createExercise(formData)
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/physio/exercises" className={buttonVariants({ variant: "ghost", size: "icon" })}>
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Add New Exercise</h1>
          <p className="text-slate-500">Upload a video or provide a link to add to the library.</p>
        </div>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Exercise Details</CardTitle>
            <CardDescription>This will be available to assign to any of your patients.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {(serverError || uploadError) && (
              <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-200">
                {serverError || uploadError}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">Exercise Name</Label>
              <Input id="name" name="name" placeholder="e.g. Seated Knee Extension" required disabled={isUploading} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Instructions / Description</Label>
              <Textarea 
                id="description" 
                name="description" 
                placeholder="Describe how to perform the exercise correctly..." 
                rows={4}
                disabled={isUploading}
              />
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h3 className="text-sm font-medium">Video Source (Choose One)</h3>
              
              <div className="space-y-2 p-4 border rounded-md bg-slate-50">
                <Label htmlFor="video" className="font-medium text-blue-700">Option 1: Upload Video</Label>
                <p className="text-xs text-slate-500 mb-2">Upload directly to Supabase Storage (Bypasses Next.js limits)</p>
                <Input id="video" name="video" type="file" accept="video/mp4,video/x-m4v,video/*" disabled={isUploading} />
              </div>

              <div className="space-y-2 p-4 border rounded-md">
                <Label htmlFor="video_url">Option 2: External Video URL</Label>
                <Input id="video_url" name="video_url" placeholder="https://example.com/video.mp4" disabled={isUploading} />
              </div>
            </div>

          </CardContent>
          <CardFooter className="flex justify-between border-t border-slate-100 pt-6">
            <Link href="/physio/exercises" className={buttonVariants({ variant: "outline" })}>
              Cancel
            </Link>
            <Button type="submit" disabled={isUploading}>
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                'Save to Library'
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
