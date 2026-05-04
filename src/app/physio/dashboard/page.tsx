import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/utils/supabase/server'
import { Users, Activity, TrendingUp, ClipboardList } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import Link from 'next/link'

export default async function PhysioDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  // Real stats from database
  const { count: patientCount } = await supabase.from('patients').select('*', { count: 'exact', head: true })
  const { count: exerciseCount } = await supabase.from('exercises').select('*', { count: 'exact', head: true })

  // Compute real compliance from today's logs
  const today = new Date().toISOString().split('T')[0]
  const { data: todayLogs } = await supabase
    .from('progress_logs')
    .select('completed')
    .eq('date', today)

  const totalLogs = todayLogs?.length || 0
  const completedLogs = todayLogs?.filter((l: any) => l.completed).length || 0
  const complianceRate = totalLogs > 0 ? Math.round((completedLogs / totalLogs) * 100) : null

  // Recent patients
  const { data: recentPatients } = await supabase
    .from('patients')
    .select('id, condition, profiles(full_name)')
    .order('created_at', { ascending: false })
    .limit(5)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
        <p className="text-slate-500">Welcome back, {user?.user_metadata?.full_name?.split(' ')[0] || 'Doctor'}. Here is your overview.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Patients</CardTitle>
            <Users className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{patientCount || 0}</div>
            <p className="text-xs text-slate-400 mt-1">Under your care</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Exercise Library</CardTitle>
            <ClipboardList className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{exerciseCount || 0}</div>
            <p className="text-xs text-slate-400 mt-1">Available exercises</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Today's Compliance</CardTitle>
            <TrendingUp className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {complianceRate !== null ? `${complianceRate}%` : '—'}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {totalLogs > 0 ? `${completedLogs}/${totalLogs} patients checked in` : 'No check-ins yet today'}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Patients</CardTitle>
              <CardDescription>Patients recently added to your care.</CardDescription>
            </div>
            <Link href="/physio/patients" className={buttonVariants({ variant: "outline", size: "sm" })}>
              View All
            </Link>
          </CardHeader>
          <CardContent>
            {recentPatients && recentPatients.length > 0 ? (
              <div className="space-y-3">
                {recentPatients.map((p: any) => (
                  <Link
                    key={p.id}
                    href={`/physio/patients/${p.id}`}
                    className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors"
                  >
                    <div>
                      <p className="font-medium text-sm text-slate-900">{p.profiles?.full_name || 'Unknown'}</p>
                      <p className="text-xs text-slate-500">{p.condition || 'No condition set'}</p>
                    </div>
                    <span className="text-xs text-blue-600 font-medium">View →</span>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500 italic">No patients found. Add your first patient to get started.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks for your practice.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/physio/patients/new" className={buttonVariants({ variant: "outline", className: "w-full justify-start gap-2" })}>
              <Users size={16} /> Add New Patient
            </Link>
            <Link href="/physio/exercises/new" className={buttonVariants({ variant: "outline", className: "w-full justify-start gap-2" })}>
              <ClipboardList size={16} /> Upload Exercise
            </Link>
            <Link href="/physio/exercises" className={buttonVariants({ variant: "outline", className: "w-full justify-start gap-2" })}>
              <Activity size={16} /> Browse Exercise Library
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
