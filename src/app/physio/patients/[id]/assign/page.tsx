import { createClient } from '@/utils/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button, buttonVariants } from '@/components/ui/button'
import { assignExercise } from './actions'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { notFound } from 'next/navigation'

export default async function AssignExercisePage(props: { params: Promise<{ id: string }>, searchParams: Promise<{ error?: string }> }) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const supabase = await createClient()

  // Fetch patient profile for the header
  const { data: patient } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', params.id)
    .single()

  if (!patient) return notFound()

  // Fetch all available exercises for the dropdown
  const { data: exercises } = await supabase
    .from('exercises')
    .select('id, name')
    .order('name')

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/physio/patients/${params.id}`} className={buttonVariants({ variant: "ghost", size: "icon" })}>
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Assign Exercise</h1>
          <p className="text-slate-500">Adding a new exercise to {patient.full_name}'s routine.</p>
        </div>
      </div>

      <Card>
        <form action={assignExercise}>
          {/* Hidden input to pass patient_id */}
          <input type="hidden" name="patient_id" value={params.id} />

          <CardHeader>
            <CardTitle>Exercise Assignment</CardTitle>
            <CardDescription>Select an exercise from your library and configure the instructions.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {searchParams?.error && (
              <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-200">
                {searchParams.error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="exercise_id">Select Exercise</Label>
              {exercises && exercises.length > 0 ? (
                <select 
                  id="exercise_id" 
                  name="exercise_id" 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                >
                  <option value="">-- Select an exercise --</option>
                  {exercises.map(ex => (
                    <option key={ex.id} value={ex.id}>{ex.name}</option>
                  ))}
                </select>
              ) : (
                <div className="p-3 border rounded-md bg-slate-50 text-slate-600 text-sm">
                  <p>Your exercise library is empty!</p>
                  <Link href="/physio/exercises/new" className="text-blue-600 hover:underline">
                    Click here to add an exercise to your library first.
                  </Link>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="reps">Sets & Reps</Label>
                <Input id="reps" name="reps" placeholder="e.g. 3 sets of 10" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="frequency">Frequency</Label>
                <Input id="frequency" name="frequency" placeholder="e.g. Daily, 2x a week" required />
              </div>
            </div>

          </CardContent>
          <CardFooter className="flex justify-between border-t border-slate-100 pt-6">
            <Link href={`/physio/patients/${params.id}`} className={buttonVariants({ variant: "outline" })}>
              Cancel
            </Link>
            <Button type="submit" disabled={!exercises || exercises.length === 0}>
              Assign to Patient
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
