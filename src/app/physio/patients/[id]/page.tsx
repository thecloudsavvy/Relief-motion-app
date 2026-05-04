import { createClient } from '@/utils/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button, buttonVariants } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft, UserCircle, Phone, Calendar, Activity, CheckCircle2, PlayCircle } from 'lucide-react'
import { notFound } from 'next/navigation'
import { VideoDialog } from '@/components/video-dialog'

export default async function PatientProfilePage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const supabase = await createClient()

  // Fetch patient profile
  const { data: patient } = await supabase
    .from('profiles')
    .select('*, patients(*)')
    .eq('id', params.id)
    .single()

  if (!patient) return notFound()

  const patientDetails = patient.patients?.[0] || {};

  // Fetch currently assigned exercises
  const { data: assignedExercises } = await supabase
    .from('patient_exercises')
    .select('*, exercises(*)')
    .eq('patient_id', params.id)
    .order('created_at', { ascending: false })

  // Fetch recent progress logs
  const { data: recentLogs } = await supabase
    .from('progress_logs')
    .select('*')
    .eq('patient_id', params.id)
    .order('date', { ascending: false })
    .limit(5)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/physio/patients" className={buttonVariants({ variant: "ghost", size: "icon" })}>
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{patient.full_name}</h1>
          <p className="text-slate-500">Patient Profile & Treatment Plan</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Patient Details */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCircle className="text-slate-400" />
              Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-slate-500">Condition</p>
              <p className="text-slate-900 font-medium">{patientDetails.condition || 'Not specified'}</p>
            </div>
            {patientDetails.notes && (
              <div>
                <p className="text-sm font-medium text-slate-500">Notes</p>
                <p className="text-slate-700 text-sm">{patientDetails.notes}</p>
              </div>
            )}
            <div className="pt-4 border-t border-slate-100 flex items-center gap-2 text-sm text-slate-600">
              <Phone size={16} />
              {patient.phone_number || 'No phone number'}
            </div>
          </CardContent>
        </Card>

        {/* Assigned Exercises */}
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>Assigned Exercises</CardTitle>
              <CardDescription>Current treatment routine for this patient.</CardDescription>
            </div>
            <Link href={`/physio/patients/${patient.id}/assign`} className={buttonVariants({ size: "sm" })}>
              Assign Exercise
            </Link>
          </CardHeader>
          <CardContent>
            {assignedExercises && assignedExercises.length > 0 ? (
              <div className="space-y-3 mt-4">
                {assignedExercises.map((pe: any) => (
                  <div key={pe.id} className="flex items-center justify-between p-3 border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded bg-blue-100 flex items-center justify-center text-blue-600">
                        <PlayCircle size={20} />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{pe.exercises?.name}</p>
                        <p className="text-xs text-slate-500">{pe.reps} • {pe.frequency}</p>
                      </div>
                    </div>
                    <VideoDialog 
                      videoUrl={pe.exercises?.video_url} 
                      title={pe.exercises?.name}
                      trigger={
                        <Button variant="ghost" size="sm" className="text-slate-500">View</Button>
                      }
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center border-2 border-dashed border-slate-200 rounded-lg mt-4 bg-slate-50">
                <p className="text-slate-500 mb-2">No exercises assigned yet.</p>
                <Link href={`/physio/patients/${patient.id}/assign`} className={buttonVariants({ variant: "outline", size: "sm" })}>
                  Assign their first exercise
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Progress Logs */}
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="text-blue-500" />
              Recent Compliance & Pain Logs
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentLogs && recentLogs.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                {recentLogs.map((log: any) => (
                  <div key={log.id} className="p-3 border border-slate-100 rounded-lg bg-white shadow-sm flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                        <Calendar size={12} />
                        {new Date(log.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </span>
                      {log.completed ? (
                        <CheckCircle2 size={16} className="text-green-500" />
                      ) : (
                        <div className="h-2 w-2 rounded-full bg-red-400" title="Missed exercises"></div>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">Pain: {log.pain_level}/10</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500 p-4 bg-slate-50 rounded-md border border-slate-100">
                Patient has not logged any progress yet.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
