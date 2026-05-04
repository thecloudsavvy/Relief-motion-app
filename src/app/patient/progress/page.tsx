import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/utils/supabase/server'
import { Calendar, CheckCircle2, XCircle, Activity } from 'lucide-react'

export default async function PatientProgressPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch recent progress logs
  const { data: logs } = await supabase
    .from('progress_logs')
    .select('*')
    .eq('patient_id', user?.id)
    .order('date', { ascending: false })
    .limit(14)

  const hasLogs = logs && logs.length > 0;

  return (
    <div className="space-y-6 md:ml-64 md:p-4">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">My Progress</h1>
        <p className="text-slate-500 mt-1">Track your recovery journey over time.</p>
      </div>

      {hasLogs ? (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pain Level Trend</CardTitle>
              <CardDescription>Your reported pain levels over the last 14 days.</CardDescription>
            </CardHeader>
            <CardContent>
              {/* In a real app, we'd use recharts here. For MVP, we'll build a simple CSS bar chart */}
              <div className="flex items-end h-40 gap-2 mt-4 pb-4 border-b border-slate-100">
                {logs.slice().reverse().map((log: any) => (
                  <div key={log.id} className="flex flex-col items-center flex-1 group">
                    <div className="w-full bg-slate-100 rounded-t-sm relative flex items-end justify-center h-full">
                      <div 
                        className="w-full bg-blue-500 rounded-t-sm transition-all group-hover:bg-blue-600"
                        style={{ height: `${(log.pain_level / 10) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-[10px] text-slate-400 mt-2 truncate w-full text-center">
                      {new Date(log.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Check-ins</CardTitle>
              <CardDescription>Your daily compliance logs.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {logs.map((log: any) => (
                <div key={log.id} className="flex items-center justify-between p-3 border border-slate-100 rounded-lg bg-slate-50">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${log.completed ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                      {log.completed ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">
                        {new Date(log.date).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
                      </p>
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <Activity size={12} /> Pain Level: {log.pain_level}/10
                      </p>
                    </div>
                  </div>
                  <div className="text-sm font-medium text-slate-600">
                    {log.completed ? 'Completed' : 'Missed'}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card className="border-dashed border-2 bg-slate-50">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Calendar size={48} className="text-slate-300 mb-4" />
            <h3 className="text-lg font-medium text-slate-800">No progress data yet</h3>
            <p className="text-sm text-slate-500 text-center max-w-sm mt-2">Start doing your daily check-ins from the Dashboard to see your progress charts here.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
