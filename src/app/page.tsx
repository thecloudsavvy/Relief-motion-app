import Link from 'next/link'
import { Activity, ArrowRight, Video, ClipboardCheck, TrendingUp, Shield } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Nav */}
      <header className="border-b border-slate-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Activity className="text-blue-600" size={28} />
            <span className="text-xl font-bold text-slate-900 tracking-tight">Relief Motion</span>
          </div>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium text-sm hover:bg-blue-700 transition-colors shadow-sm"
          >
            Sign In <ArrowRight size={16} />
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="flex-1 flex items-center">
        <div className="max-w-6xl mx-auto px-6 py-20 md:py-32">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-xs font-semibold mb-6 border border-blue-100">
              <Shield size={14} />
              HIPAA-Aware • Built for Lagos Physiotherapy
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight leading-tight">
              Recovery,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                guided by your physio.
              </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 mt-6 leading-relaxed max-w-xl">
              Relief Motion connects physiotherapists and patients through video-guided exercise routines, daily progress tracking, and real-time compliance insights — all from a mobile-first platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-md"
              >
                Get Started <ArrowRight size={18} />
              </Link>
              <a
                href="#features"
                className="inline-flex items-center justify-center gap-2 bg-white text-slate-700 px-6 py-3 rounded-lg font-medium border border-slate-200 hover:bg-slate-50 transition-colors"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-slate-50 border-t border-slate-100">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Everything your practice needs</h2>
            <p className="text-slate-500 mt-3 max-w-lg mx-auto">Purpose-built tools for physiotherapists managing home recovery programs.</p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 mb-4">
                <Video size={24} />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Video Exercise Library</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Upload and manage exercise videos. Assign specific routines to each patient with custom reps and frequency.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center text-green-600 mb-4">
                <ClipboardCheck size={24} />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Daily Check-ins</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Patients log pain levels and exercise completion daily. Physios get instant visibility into adherence and progress.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 mb-4">
                <TrendingUp size={24} />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Progress Tracking</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Visual pain trend charts and compliance history help physios adjust treatment plans with data, not guesswork.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Activity className="text-blue-600" size={20} />
            <span className="text-sm font-semibold text-slate-700">Relief Motion Physio</span>
          </div>
          <p className="text-sm text-slate-400">&copy; {new Date().getFullYear()} Relief Motion. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
