import { createClient } from '@/utils/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button, buttonVariants } from '@/components/ui/button'
import Link from 'next/link'
import { PlusCircle, PlayCircle } from 'lucide-react'
import { VideoDialog } from '@/components/video-dialog'
import { SearchInput } from '@/components/search-input'

export default async function PhysioExercisesPage(props: { searchParams: Promise<{ q?: string }> }) {
  const supabase = await createClient()
  const searchParams = await props.searchParams;
  const query = searchParams?.q?.toLowerCase() || ''

  let { data: exercises } = await supabase
    .from('exercises')
    .select('*')
    .order('created_at', { ascending: false })

  if (query && exercises) {
    exercises = exercises.filter(e => 
      e.name.toLowerCase().includes(query) || 
      e.id.toLowerCase().includes(query)
    )
  }

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

      <SearchInput placeholder="Search exercises by name or ID..." />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {exercises && exercises.length > 0 ? (
          exercises.map((exercise: any) => (
            <Card key={exercise.id} className="hover:shadow-md transition-shadow flex flex-col overflow-hidden">
              {/* Video Thumbnail */}
              <div className="aspect-video bg-slate-100 relative group overflow-hidden">
                <VideoDialog
                  videoUrl={exercise.video_url}
                  title={exercise.name}
                  description={exercise.description}
                  trigger={
                    <button type="button" className="w-full h-full flex items-center justify-center relative appearance-none border-none p-0 bg-transparent cursor-pointer">
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
                    </button>
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
