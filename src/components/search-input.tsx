'use client'

import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useTransition, useState, useEffect } from 'react'

export function SearchInput({ placeholder = 'Search...' }: { placeholder?: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  
  const initialQuery = searchParams.get('q') || ''
  const [value, setValue] = useState(initialQuery)

  useEffect(() => {
    setValue(searchParams.get('q') || '')
  }, [searchParams])

  function handleSearch(term: string) {
    setValue(term)
    startTransition(() => {
      const params = new URLSearchParams(window.location.search)
      if (term) {
        params.set('q', term)
      } else {
        params.delete('q')
      }
      router.replace(`${pathname}?${params.toString()}`)
    })
  }

  return (
    <div className="flex items-center space-x-2 bg-white p-2 rounded-md shadow-sm border border-slate-200 w-full max-w-md relative">
      <Search className="text-slate-400 ml-2" size={20} />
      <Input 
        type="text" 
        placeholder={placeholder}
        value={value}
        onChange={(e) => handleSearch(e.target.value)}
        className="border-0 shadow-none focus-visible:ring-0 px-2"
      />
      {isPending && (
        <div className="absolute right-3 w-4 h-4 border-2 border-slate-300 border-t-indigo-600 rounded-full animate-spin" />
      )}
    </div>
  )
}
