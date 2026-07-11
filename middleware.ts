import NextAuth from 'next-auth'
import { NextResponse } from 'next/server'
import { authConfig } from '@/auth.config'

// Middleware runs on the Edge Runtime with a strict bundle size limit, so it
// uses the lightweight authConfig (no Credentials provider, no bcrypt, no zod)
// instead of importing the full ./auth.ts — that keeps this Edge Function
// well under the 1MB limit. This only checks whether a valid session exists;
// actual credential verification still happens via auth.ts in the Node runtime.
const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const { pathname } = req.nextUrl

  // Protect all /admin routes except /admin/login
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    if (!req.auth) {
      const loginUrl = new URL('/admin/login', req.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  // Redirect authenticated users away from login page
  if (pathname === '/admin/login' && req.auth) {
    return NextResponse.redirect(new URL('/admin', req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/admin/:path*'],
}