import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname;

  // Protect /physio, /patient, and / routes
  if (!user && (path.startsWith('/physio') || path.startsWith('/patient') || path === '/')) {
    // no user, potentially respond by redirecting the user to the login page
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Role-based redirection if user is logged in
  if (user) {
    // Fetch actual role from the profiles table, because user_metadata might be stale
    // if updated manually in the database.
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
      
    const role = profile?.role || 'patient';

    if (path === '/login' || path === '/') {
      const url = request.nextUrl.clone()
      if (role === 'physio' || role === 'admin') {
        url.pathname = '/physio/dashboard'
      } else {
        url.pathname = '/patient/dashboard'
      }
      return NextResponse.redirect(url)
    }

    // Optional: Protect physio routes from patients
    if (path.startsWith('/physio') && role === 'patient') {
      const url = request.nextUrl.clone()
      url.pathname = '/patient/dashboard'
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}
