import { ReactNode } from 'react'
import Link from 'next/link'
import { Activity, Users, Calendar, ClipboardList, LogOut } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function PhysioLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Handle logout
  async function signOut() {
    'use server'
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/login')
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Activity className="text-blue-600" />
            Relief Motion
          </h2>
          <p className="text-sm text-slate-500 mt-1">Physiotherapist Portal</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          <Link href="/physio/dashboard" className="flex items-center gap-3 px-3 py-2 text-slate-700 rounded-md hover:bg-slate-100 font-medium">
            <Activity size={20} />
            Dashboard
          </Link>
          <Link href="/physio/patients" className="flex items-center gap-3 px-3 py-2 text-slate-700 rounded-md hover:bg-slate-100 font-medium">
            <Users size={20} />
            Patients
          </Link>
          <Link href="/physio/sessions" className="flex items-center gap-3 px-3 py-2 text-slate-700 rounded-md hover:bg-slate-100 font-medium">
            <Calendar size={20} />
            Sessions
          </Link>
          <Link href="/physio/exercises" className="flex items-center gap-3 px-3 py-2 text-slate-700 rounded-md hover:bg-slate-100 font-medium">
            <ClipboardList size={20} />
            Exercises
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-200">
          <form action={signOut}>
            <button className="flex w-full items-center gap-3 px-3 py-2 text-slate-700 rounded-md hover:bg-red-50 hover:text-red-600 font-medium transition-colors">
              <LogOut size={20} />
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <header className="md:hidden bg-white border-b border-slate-200 p-4 flex justify-between items-center">
           <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Activity className="text-blue-600" />
            Relief Motion
          </h2>
           <form action={signOut}>
            <button className="text-slate-500 hover:text-red-600">
              <LogOut size={20} />
            </button>
          </form>
        </header>

        <div className="flex-1 p-6 md:p-8 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
