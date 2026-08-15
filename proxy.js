import { NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function proxy(request) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    if (!request.cookies.get('admin_session')) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  // Refreshes the Supabase Auth session cookie on every request so JWTs
  // don't silently expire between client-side navigations.
  return updateSession(request)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
