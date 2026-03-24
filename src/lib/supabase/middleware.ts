import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  // If env vars are missing, skip auth middleware gracefully
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.next({ request })
  }

  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        )
        supabaseResponse = NextResponse.next({ request })
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        )
      },
    },
  })

  try {
    const { data: { user } } = await supabase.auth.getUser()

    const isProtected =
      request.nextUrl.pathname.startsWith('/dashboard') ||
      request.nextUrl.pathname.startsWith('/focus') ||
      request.nextUrl.pathname.startsWith('/tasks') ||
      request.nextUrl.pathname.startsWith('/reflect') ||
      request.nextUrl.pathname.startsWith('/settings') ||
      request.nextUrl.pathname.startsWith('/myworld') ||
      request.nextUrl.pathname.startsWith('/planner') ||
      request.nextUrl.pathname.startsWith('/bodydouble')

    if (isProtected && !user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    const isAuthPage =
      request.nextUrl.pathname.startsWith('/login') ||
      request.nextUrl.pathname.startsWith('/signup')

    if (isAuthPage && user) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  } catch {
    // If Supabase auth fails, allow the request through
    return NextResponse.next({ request })
  }

  return supabaseResponse
}
