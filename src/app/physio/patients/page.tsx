import { createClient } from '@/utils/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button, buttonVariants } from '@/components/ui/button'
import Link from 'next/link'
import { PlusCircle } from 'lucide-react'
import { SearchInput } from '@/components/search-input'

export default async function PatientsPage(props: { searchParams: Promise<{ q?: string }> }) {
  const supabase = await createClient()
  const searchParams = await props.searchParams;
  const query = searchParams?.q?.toLowerCase() || ''

  const { data: authData } = await supabase.auth.getUser()
  const user = authData.user

  let { data: profilesList, error } = await supabase
    .from('profiles')
    .select(`
      id,
      full_name,
      phone_number,
      patients!patients_id_fkey (
        condition
      )
    `)
    .eq('role', 'patient')

  if (error) {
    console.error("Supabase Error fetching patients:", error)
  }

  if (query && profilesList) {
    profilesList = profilesList.filter((p: any) => 
      p.id.toLowerCase().includes(query) || 
      p.full_name?.toLowerCase().includes(query) ||
      p.phone_number?.includes(query)
    )
  }

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

      <SearchInput placeholder="Search patients by name or ID..." />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {profilesList && profilesList.length > 0 ? (
          profilesList.map((profile: any) => {
            // Supabase returns patients as an array if it thinks it's a 1-to-many, or an object if 1-to-1.
            const condition = Array.isArray(profile.patients) 
              ? profile.patients[0]?.condition 
              : profile.patients?.condition;

            return (
              <Card key={profile.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle>{profile.full_name || 'Unknown Patient'}</CardTitle>
                  <CardDescription>{profile.phone_number || 'No phone'}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm">
                    <span className="font-medium text-slate-700">Condition:</span>{' '}
                    <span className="text-slate-600">{condition || 'Not specified'}</span>
                  </div>
                  <div className="mt-4">
                    <Link href={`/physio/patients/${profile.id}`} className={buttonVariants({ variant: "outline", size: "sm", className: "w-full" })}>
                      View Profile
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )
          })
        ) : (
          <div className="col-span-full p-8 text-center bg-white rounded-lg border border-dashed border-slate-300">
            <h3 className="text-lg font-medium text-slate-900 mb-1">No patients found</h3>
            <p className="text-slate-500 mb-4">No matching patients in the system.</p>
            <Link href="/physio/patients/new" className={buttonVariants({ variant: "outline" })}>
              Add a new patient
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
