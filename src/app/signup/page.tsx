import { signup } from '@/app/login/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Activity, ArrowRight, UserCheck } from 'lucide-react'
import Link from 'next/link'

export default async function SignupPage(props: { searchParams: Promise<{ message?: string }> }) {
  const searchParams = await props.searchParams;

  return (
    <div className="flex min-h-screen bg-white">
      {/* Left Side - Visual */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 overflow-hidden flex-col justify-between p-12">
        {/* Abstract CSS Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-950 to-teal-900 z-0 opacity-90" />
        <div className="absolute top-0 left-0 right-0 h-full w-full bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-teal-500/20 via-transparent to-transparent z-0" />
        <div className="absolute bottom-0 right-0 h-full w-full bg-[radial-gradient(circle_at_bottom_right,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent z-0" />

        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2 text-white">
            <Activity size={28} className="text-teal-400" />
            <span className="text-xl font-bold tracking-tight">Relief Motion</span>
          </Link>
        </div>

        <div className="relative z-10 max-w-lg mt-auto pb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight mb-6">
            Join the future of <span className="text-teal-400">physical therapy.</span>
          </h1>
          <p className="text-lg text-slate-300 leading-relaxed">
            Create tailored recovery programs, track patient compliance in real-time, and manage your practice effortlessly from one powerful platform.
          </p>
          
          <div className="mt-10 flex items-center gap-4">
            <div className="flex -space-x-3">
              <div className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-700" />
              <div className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-600" />
              <div className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-500" />
            </div>
            <p className="text-sm text-slate-300 font-medium">
              Join 1,000+ practitioners today.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 md:px-24 py-12 relative overflow-y-auto">
        <div className="w-full max-w-sm mx-auto">
          {/* Mobile Logo */}
          <Link href="/" className="flex lg:hidden items-center gap-2 mb-12 text-slate-900">
            <Activity size={28} className="text-blue-600" />
            <span className="text-xl font-bold tracking-tight">Relief Motion</span>
          </Link>

          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-semibold mb-6">
              <UserCheck size={14} /> Practitioner Registration
            </div>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Create your account</h2>
            <p className="text-slate-500 mt-2">Set up your clinic and start managing patients.</p>
          </div>

          <form action={signup} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="full_name" className="text-slate-700 font-medium">Full Name</Label>
              <Input id="full_name" name="full_name" placeholder="Dr. Jane Doe" required className="h-11 bg-slate-50 border-slate-200 focus-visible:ring-indigo-600" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-slate-700 font-medium">Phone Number</Label>
              <Input id="phone" name="phone" type="tel" placeholder="+1 (555) 000-0000" required className="h-11 bg-slate-50 border-slate-200 focus-visible:ring-indigo-600" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700 font-medium">Email Address</Label>
              <Input id="email" name="email" type="email" placeholder="jane@clinic.com" required className="h-11 bg-slate-50 border-slate-200 focus-visible:ring-indigo-600" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-700 font-medium">Password</Label>
              <Input id="password" name="password" type="password" required className="h-11 bg-slate-50 border-slate-200 focus-visible:ring-indigo-600" />
              <p className="text-xs text-slate-500 mt-1">Must be at least 8 characters long.</p>
            </div>

            {searchParams?.message && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-100 p-3 rounded-lg font-medium">
                {searchParams.message}
              </p>
            )}

            <Button type="submit" className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white font-medium text-base mt-2 transition-all">
              Start your free trial
            </Button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-100 text-center">
            <p className="text-slate-600">
              Already have a practitioner account?{' '}
              <Link href="/login" className="text-indigo-600 font-semibold hover:underline">
                Sign in
              </Link>
            </p>
          </div>

          {/* Patient CTA */}
          <div className="mt-12 p-5 bg-slate-50 rounded-xl border border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="font-semibold text-slate-900">Are you a patient?</h4>
              <p className="text-sm text-slate-500 mt-0.5">Access your recovery plan here.</p>
            </div>
            <Link 
              href="/login" 
              className="inline-flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors whitespace-nowrap shadow-sm w-full sm:w-auto"
            >
              Patient Login <ArrowRight size={16} />
            </Link>
          </div>

        </div>
      </div>
    </div>
  )
}
