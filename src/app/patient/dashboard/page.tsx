import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { createClient } from '@/utils/supabase/server'
import { PlayCircle, CheckCircle2, AlertCircle } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { VideoDialog } from '@/components/video-dialog'
import Link from 'next/link'

export default async function PatientDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch today's assigned exercises
  const { data: exercises } = await supabase
    .from('patient_exercises')
    .select(`
      id,
      reps,
      frequency,
      exercises (
        name,
        description
      )
    `)
    .eq('patient_id', user?.id)

  const hasExercises = exercises && exercises.length > 0;

  return (
    <div className="space-y-6 md:ml-64 md:p-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Hi, {user?.user_metadata?.full_name?.split(' ')[0] || 'there'}! 👋</h1>
        <p className="text-slate-500 mt-1">Here is your daily recovery plan.</p>
      </div>

      {/* Daily Check-in CTA */}
      <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0 shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-white text-lg">Daily Check-in</CardTitle>
          <CardDescription className="text-blue-100">Log your pain level and compliance for today.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle size={18} className="text-blue-200" />
            <span className="text-sm text-blue-100">You haven't checked in yet today.</span>
          </div>
          <Link href="/patient/progress/new" className={buttonVariants({ variant: "secondary", className: "w-full sm:w-auto" })}>
            Complete Check-in
          </Link>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
          Your Exercises
          <span className="bg-blue-100 text-blue-700 text-xs py-0.5 px-2 rounded-full">{exercises?.length || 0} left</span>
        </h3>

        {hasExercises ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {exercises.map((pe: any) => (
              <Card key={pe.id} className="overflow-hidden border-l-4 border-l-blue-500">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{pe.exercises?.name}</CardTitle>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-sm text-slate-500 line-clamp-2">{pe.exercises?.description}</p>
                  <div className="flex items-center gap-4 mt-3">
                    <div className="bg-slate-100 px-2 py-1 rounded text-xs font-medium text-slate-700">
                      Reps: {pe.reps || 'N/A'}
                    </div>
                    <div className="bg-slate-100 px-2 py-1 rounded text-xs font-medium text-slate-700">
                      {pe.frequency || 'Daily'}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-slate-50 pt-3 pb-3 border-t border-slate-100 flex justify-between">
                  <VideoDialog 
                    videoUrl="/videos/example.mp4" 
                    title={pe.exercises?.name}
                    description={pe.exercises?.description}
                    trigger={
                      <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-2">
                        <PlayCircle size={16} className="mr-1" /> Watch
                      </Button>
                    }
                  />
                  <Button variant="outline" size="sm" className="text-slate-600 px-2 border-slate-300">
                    <CheckCircle2 size={16} className="mr-1" /> Mark Done
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-dashed border-2 bg-slate-50">
            <CardContent className="flex flex-col items-center justify-center py-10">
              <CheckCircle2 size={40} className="text-green-500 mb-3" />
              <h3 className="text-lg font-medium text-slate-800">All caught up!</h3>
              <p className="text-sm text-slate-500 text-center max-w-xs mt-1">You don't have any exercises assigned right now, or you've completed them all.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
