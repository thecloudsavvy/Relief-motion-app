import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { createClient } from '@/utils/supabase/server'
import { PlayCircle } from 'lucide-react'
import { VideoDialog } from '@/components/video-dialog'

export default async function PatientExercisesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch all assigned exercises
  const { data: exercises } = await supabase
    .from('patient_exercises')
    .select(`
      id,
      reps,
      frequency,
      exercises (
        name,
        description,
        video_url
      )
    `)
    .eq('patient_id', user?.id)

  const hasExercises = exercises && exercises.length > 0;

  return (
    <div className="space-y-6 md:ml-64 md:p-4">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">My Exercises</h1>
        <p className="text-slate-500 mt-1">Your complete prescribed physical therapy routine.</p>
      </div>

      {hasExercises ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {exercises.map((pe: any) => (
            <Card key={pe.id} className="overflow-hidden flex flex-col">
              <div className="aspect-video bg-slate-100 flex items-center justify-center relative group cursor-pointer overflow-hidden">
                <VideoDialog 
                  videoUrl={pe.exercises?.video_url || '/videos/example.mp4'} 
                  title={pe.exercises?.name}
                  description={pe.exercises?.description}
                  trigger={
                    <div className="w-full h-full flex items-center justify-center relative">
                      <video src={pe.exercises?.video_url || '/videos/example.mp4'} className="w-full h-full object-cover opacity-50" />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                        <PlayCircle size={64} className="text-white drop-shadow-md opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                      </div>
                    </div>
                  }
                />
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{pe.exercises?.name}</CardTitle>
                <CardDescription className="line-clamp-2">{pe.exercises?.description}</CardDescription>
              </CardHeader>
              <CardContent className="mt-auto pt-4 pb-4">
                <div className="flex gap-2">
                  <div className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md text-xs font-semibold border border-blue-100">
                    {pe.reps || '10 Reps'}
                  </div>
                  <div className="bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-md text-xs font-semibold border border-indigo-100">
                    {pe.frequency || 'Daily'}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-slate-50 pt-4 pb-4 border-t border-slate-100">
                <VideoDialog 
                  videoUrl={pe.exercises?.video_url || '/videos/example.mp4'} 
                  title={pe.exercises?.name}
                  description={pe.exercises?.description}
                />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          <Card className="border-dashed border-2 bg-slate-50">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <h3 className="text-lg font-medium text-slate-800">No exercises assigned</h3>
              <p className="text-sm text-slate-500 text-center max-w-sm mt-2">Your physiotherapist hasn't assigned any specific exercises to your plan yet.</p>
            </CardContent>
          </Card>

          <div>
            <h3 className="text-xl font-semibold text-slate-800 mb-4">Try this Demo Exercise</h3>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <Card className="overflow-hidden flex flex-col border-blue-200 shadow-sm">
                <div className="aspect-video bg-slate-100 flex items-center justify-center relative group cursor-pointer overflow-hidden">
                  <VideoDialog 
                    videoUrl="/videos/example.mp4" 
                    title="Demo: Morning Stretch"
                    description="A basic morning stretch routine to test the video player."
                    trigger={
                      <div className="w-full h-full flex items-center justify-center relative">
                        <video src="/videos/example.mp4" className="w-full h-full object-cover opacity-50" />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                          <PlayCircle size={64} className="text-white drop-shadow-md opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                        </div>
                      </div>
                    }
                  />
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Demo: Morning Stretch</CardTitle>
                  <CardDescription className="line-clamp-2">A basic morning stretch routine to test the video player functionality.</CardDescription>
                </CardHeader>
                <CardContent className="mt-auto pt-4 pb-4">
                  <div className="flex gap-2">
                    <div className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md text-xs font-semibold border border-blue-100">
                      5 Reps
                    </div>
                    <div className="bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-md text-xs font-semibold border border-indigo-100">
                      Once
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-slate-50 pt-4 pb-4 border-t border-slate-100">
                  <VideoDialog 
                    videoUrl="/videos/example.mp4" 
                    title="Demo: Morning Stretch"
                    description="A basic morning stretch routine to test the video player."
                  />
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
