import { createClient } from '@/utils/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button, buttonVariants } from '@/components/ui/button'
import Link from 'next/link'
import { PlusCircle, Search, PlayCircle } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { VideoDialog } from '@/components/video-dialog'

export default async function PhysioExercisesPage() {
  const supabase = await createClient()

  const { data: exercises } = await supabase
    .from('exercises')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Exercise Library</h1>
          <p className="text-slate-500">Manage the pool of exercises available for your patients.</p>
        </div>
        <Link href="/physio/exercises/new" className={buttonVariants({ className: "flex items-center gap-2" })}>
          <PlusCircle size={16} />
          Add Exercise
        </Link>
      </div>

      <div className="flex items-center space-x-2 bg-white p-2 rounded-md shadow-sm border border-slate-200 w-full max-w-md">
        <Search className="text-slate-400 ml-2" size={20} />
        <Input 
          type="text" 
          placeholder="Search exercises..." 
          className="border-0 shadow-none focus-visible:ring-0 px-2"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {exercises && exercises.length > 0 ? (
          exercises.map((exercise: any) => (
            <Card key={exercise.id} className="hover:shadow-md transition-shadow flex flex-col overflow-hidden">
              {/* Video Thumbnail */}
              <div className="aspect-video bg-slate-100 relative group cursor-pointer overflow-hidden">
                <VideoDialog
                  videoUrl={exercise.video_url}
                  title={exercise.name}
                  description={exercise.description}
                  trigger={
                    <div className="w-full h-full flex items-center justify-center relative">
                      <video
                        src={exercise.video_url}
                        preload="metadata"
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                        <PlayCircle size={48} className="text-white drop-shadow-lg opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                      </div>
                    </div>
                  }
                />
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{exercise.name}</CardTitle>
                <CardDescription className="line-clamp-2">{exercise.description}</CardDescription>
              </CardHeader>
              <CardContent className="mt-auto pt-4 flex gap-2">
                <VideoDialog 
                  videoUrl={exercise.video_url} 
                  title={exercise.name}
                  description={exercise.description}
                />
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full p-8 text-center bg-white rounded-lg border border-dashed border-slate-300">
            <h3 className="text-lg font-medium text-slate-900 mb-1">No exercises found</h3>
            <p className="text-slate-500 mb-4">Your exercise library is currently empty.</p>
            <Link href="/physio/exercises/new" className={buttonVariants({ variant: "outline" })}>
              Upload your first exercise
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
