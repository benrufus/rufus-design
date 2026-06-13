import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.next()
  }

  const path = request.nextUrl.pathname

  // Skip middleware entirely for static files
  if (
    path.startsWith('/_next') ||
    path.startsWith('/api') ||
    path.includes('.') // files with extensions (images, fonts etc)
  ) {
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

  // Only check redirects for public routes
  if (!path.startsWith('/760')) {
    const pathWithSlash = path.endsWith('/') ? path : path + '/'
    const pathWithout = path.endsWith('/') ? path.slice(0, -1) : path
    const { data: redirect } = await supabase
      .from('redirects')
      .select('to, permanent')
      .in('from', [path, pathWithSlash, pathWithout])
      .maybeSingle()
    if (redirect) {
      const dest = request.nextUrl.clone()
      dest.pathname = redirect.to
      return NextResponse.redirect(dest, { status: redirect.permanent ? 301 : 302 })
    }
  }

  // Only check auth for /760 routes
  if (path.startsWith('/760')) {
    const { data: { user } } = await supabase.auth.getUser()
    if (path !== '/760/login' && !user) {
      const loginUrl = request.nextUrl.clone()
      loginUrl.pathname = '/760/login'
      return NextResponse.redirect(loginUrl)
    }
    if (path === '/760/login' && user) {
      const dashboardUrl = request.nextUrl.clone()
      dashboardUrl.pathname = '/760'
      return NextResponse.redirect(dashboardUrl)
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/:path*'],
}
