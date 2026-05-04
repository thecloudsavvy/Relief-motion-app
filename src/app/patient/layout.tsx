import { ReactNode } from 'react'
import Link from 'next/link'
import { Home, PlaySquare, LineChart, LogOut, Activity } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function PatientLayout({ children }: { children: ReactNode }) {
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
    <div className="flex flex-col min-h-screen bg-slate-50 pb-16 md:pb-0">
      {/* Mobile Top Header */}
      <header className="bg-white border-b border-slate-200 p-4 sticky top-0 z-10 flex justify-between items-center shadow-sm">
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

      {/* Main Content */}
      <main className="flex-1 p-4 overflow-auto">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 w-full bg-white border-t border-slate-200 flex justify-around items-center h-16 pb-safe z-10 md:hidden">
        <Link href="/patient/dashboard" className="flex flex-col items-center justify-center w-full h-full text-slate-500 hover:text-blue-600 transition-colors">
          <Home size={24} />
          <span className="text-[10px] mt-1 font-medium">Home</span>
        </Link>
        <Link href="/patient/exercises" className="flex flex-col items-center justify-center w-full h-full text-slate-500 hover:text-blue-600 transition-colors">
          <PlaySquare size={24} />
          <span className="text-[10px] mt-1 font-medium">Exercises</span>
        </Link>
        <Link href="/patient/progress" className="flex flex-col items-center justify-center w-full h-full text-slate-500 hover:text-blue-600 transition-colors">
          <LineChart size={24} />
          <span className="text-[10px] mt-1 font-medium">Progress</span>
        </Link>
      </nav>

      {/* Desktop Sidebar (hidden on mobile) */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-slate-200 hidden md:flex flex-col z-20">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Activity className="text-blue-600" />
            Relief Motion
          </h2>
          <p className="text-sm text-slate-500 mt-1">Patient Portal</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/patient/dashboard" className="flex items-center gap-3 px-3 py-2 text-slate-700 rounded-md hover:bg-slate-100 font-medium">
            <Home size={20} />
            Dashboard
          </Link>
          <Link href="/patient/exercises" className="flex items-center gap-3 px-3 py-2 text-slate-700 rounded-md hover:bg-slate-100 font-medium">
            <PlaySquare size={20} />
            My Exercises
          </Link>
          <Link href="/patient/progress" className="flex items-center gap-3 px-3 py-2 text-slate-700 rounded-md hover:bg-slate-100 font-medium">
            <LineChart size={20} />
            My Progress
          </Link>
        </nav>
      </aside>
    </div>
  )
}
