import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button, buttonVariants } from '@/components/ui/button'
import { createPatient } from './actions'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default async function NewPatientPage(props: { searchParams: Promise<{ error?: string }> }) {
  const searchParams = await props.searchParams;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/physio/patients" className={buttonVariants({ variant: "ghost", size: "icon" })}>
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Add New Patient</h1>
          <p className="text-slate-500">Create a profile and assign them to your care.</p>
        </div>
      </div>

      <Card>
        <form action={createPatient}>
          <CardHeader>
            <CardTitle>Patient Details</CardTitle>
            <CardDescription>Fill out the information below to register a new patient.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {searchParams?.error && (
              <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-200">
                {searchParams.error}
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name</Label>
                <Input id="full_name" name="full_name" required placeholder="John Doe" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" name="phone" required placeholder="+1234567890" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required placeholder="john@example.com" />
              <p className="text-xs text-slate-500">Used for patient login.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Temporary Password</Label>
              <Input id="password" name="password" type="text" defaultValue="Relief123!" />
              <p className="text-xs text-slate-500">The patient will use this to log in initially.</p>
            </div>

            <div className="space-y-2 pt-4 border-t border-slate-100">
              <Label htmlFor="condition">Medical Condition</Label>
              <Input id="condition" name="condition" required placeholder="e.g. Lower Back Pain, Post-Op ACL" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Initial Notes</Label>
              <textarea 
                id="notes" 
                name="notes" 
                rows={4}
                className="flex w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Any initial observations or background..."
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t border-slate-100 pt-6">
            <Link href="/physio/patients" className={buttonVariants({ variant: "outline" })}>
              Cancel
            </Link>
            <Button type="submit">Create Patient</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
