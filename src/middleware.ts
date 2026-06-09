import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Skip if env vars not set (avoids crash during initial setup)
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.next()
  }

  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options))
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const path = request.nextUrl.pathname

  // Protect all /760 routes except /760/login
  if (path.startsWith('/760') && path !== '/760/login') {
    if (!user) {
      const loginUrl = request.nextUrl.clone()
      loginUrl.pathname = '/760/login'
      return NextResponse.redirect(loginUrl)
    }
  }

  // Redirect logged-in users away from login page
  if (path === '/760/login' && user) {
    const dashboardUrl = request.nextUrl.clone()
    dashboardUrl.pathname = '/760'
    return NextResponse.redirect(dashboardUrl)
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/760/:path*'],
}
