import { login } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Activity, LogIn } from 'lucide-react'
import Link from 'next/link'

export default async function LoginPage(props: { searchParams: Promise<{ message?: string }> }) {
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
            Welcome back to your <span className="text-teal-400">recovery journey.</span>
          </h1>
          <p className="text-lg text-slate-300 leading-relaxed">
            Access your personalized exercise routines, track your daily progress, and stay connected with your physiotherapist.
          </p>
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
              <LogIn size={14} /> Secure Access
            </div>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Sign In</h2>
            <p className="text-slate-500 mt-2">Enter your credentials to access your portal.</p>
          </div>

          <form action={login} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700 font-medium">Email Address</Label>
              <Input id="email" name="email" type="email" placeholder="name@example.com" required className="h-11 bg-slate-50 border-slate-200 focus-visible:ring-indigo-600" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-slate-700 font-medium">Password</Label>
                <Link href="#" className="text-sm font-medium text-indigo-600 hover:underline">Forgot password?</Link>
              </div>
              <Input id="password" name="password" type="password" required className="h-11 bg-slate-50 border-slate-200 focus-visible:ring-indigo-600" />
            </div>

            {searchParams?.message && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-100 p-3 rounded-lg font-medium">
                {searchParams.message}
              </p>
            )}

            <Button type="submit" className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white font-medium text-base mt-2 transition-all">
              Sign In
            </Button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-100 text-center">
            <p className="text-slate-600">
              Are you a Practitioner?{' '}
              <Link href="/signup" className="text-indigo-600 font-semibold hover:underline">
                Register your clinic
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}
