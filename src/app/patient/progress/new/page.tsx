import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button, buttonVariants } from '@/components/ui/button'
import { logProgress } from './actions'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default async function DailyCheckinPage(props: { searchParams: Promise<{ error?: string }> }) {
  const searchParams = await props.searchParams;

  return (
    <div className="max-w-xl mx-auto space-y-6 md:ml-64 md:p-4">
      <div className="flex items-center gap-4">
        <Link href="/patient/dashboard" className={buttonVariants({ variant: "ghost", size: "icon" })}>
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Daily Check-in</h1>
          <p className="text-slate-500 text-sm">Log your pain level and compliance for today.</p>
        </div>
      </div>

      <Card>
        <form action={logProgress}>
          <CardHeader>
            <CardTitle>How are you feeling?</CardTitle>
            <CardDescription>Your physiotherapist will use this data to adjust your treatment.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {searchParams?.error && (
              <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-200">
                {searchParams.error}
              </div>
            )}

            <div className="space-y-4">
              <Label htmlFor="pain_level" className="text-base font-medium">Pain Level (1-10)</Label>
              <div className="flex items-center gap-4">
                <span className="text-sm text-slate-500">1 (Low)</span>
                <input 
                  type="range" 
                  id="pain_level" 
                  name="pain_level" 
                  min="1" 
                  max="10" 
                  defaultValue="3"
                  className="flex-1 accent-blue-600"
                />
                <span className="text-sm text-slate-500">10 (High)</span>
              </div>
            </div>

            <div className="space-y-3 pt-6 border-t border-slate-100">
              <Label className="text-base font-medium">Exercise Compliance</Label>
              <label className="flex items-start gap-3 p-4 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors">
                <input 
                  type="checkbox" 
                  name="completed" 
                  className="mt-1 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                />
                <div>
                  <p className="font-medium text-slate-900">I completed all my exercises today</p>
                  <p className="text-sm text-slate-500">Be honest! It helps your physio help you.</p>
                </div>
              </label>
            </div>
            
          </CardContent>
          <CardFooter className="flex justify-between border-t border-slate-100 pt-6">
            <Link href="/patient/dashboard" className={buttonVariants({ variant: "outline" })}>
              Cancel
            </Link>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">Submit Check-in</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
