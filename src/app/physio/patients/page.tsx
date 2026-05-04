import { createClient } from '@/utils/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button, buttonVariants } from '@/components/ui/button'
import Link from 'next/link'
import { PlusCircle, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

export default async function PatientsPage() {
  const supabase = await createClient()

  // In a real app we would join with the profiles table for name/phone, but here patients is a linked table.
  // Wait, the schema links patients.id to profiles.id. Let's fetch patients along with their profile data.
  const { data: patients } = await supabase
    .from('patients')
    .select(`
      id,
      condition,
      profiles (
        full_name,
        phone_number
      )
    `)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Patients</h1>
          <p className="text-slate-500">Manage your patients and their treatment plans.</p>
        </div>
        <Link href="/physio/patients/new" className={buttonVariants({ className: "flex items-center gap-2" })}>
          <PlusCircle size={16} />
          Add Patient
        </Link>
      </div>

      <div className="flex items-center space-x-2 bg-white p-2 rounded-md shadow-sm border border-slate-200 w-full max-w-md">
        <Search className="text-slate-400 ml-2" size={20} />
        <Input 
          type="text" 
          placeholder="Search patients..." 
          className="border-0 shadow-none focus-visible:ring-0 px-2"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {patients && patients.length > 0 ? (
          patients.map((patient: any) => (
            <Card key={patient.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle>{patient.profiles?.full_name || 'Unknown Patient'}</CardTitle>
                <CardDescription>{patient.profiles?.phone_number || 'No phone'}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm">
                  <span className="font-medium text-slate-700">Condition:</span>{' '}
                  <span className="text-slate-600">{patient.condition || 'Not specified'}</span>
                </div>
                <div className="mt-4">
                  <Link href={`/physio/patients/${patient.id}`} className={buttonVariants({ variant: "outline", size: "sm", className: "w-full" })}>
                    View Profile
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full p-8 text-center bg-white rounded-lg border border-dashed border-slate-300">
            <h3 className="text-lg font-medium text-slate-900 mb-1">No patients found</h3>
            <p className="text-slate-500 mb-4">You have not added any patients yet.</p>
            <Link href="/physio/patients/new" className={buttonVariants({ variant: "outline" })}>
              Add your first patient
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
