import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from './lib/supabaseServer'

const protectedRoutes = ['/dashboard', '/drafts', '/upgrade']
const apiRoutes = ['/api']
const publicRoutes = ['/auth', '/']

const isPublicRoute = (route: string) =>
  publicRoutes.some((r) => route.startsWith(r))
const isProtectedRoute = (route: string) =>
  protectedRoutes.some((r) => route.startsWith(r))
const isApiRoute = (route: string) => apiRoutes.some((r) => route.startsWith(r))
const isApiWebhookRoute = (route: string) => route.startsWith('/api/webhook')

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('sb-access-token')?.value
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser(token)

  const url = req.nextUrl.clone()
  if (error || !data?.user) {
    if (isApiRoute(req.nextUrl.pathname)) {
      if (isApiWebhookRoute(req.nextUrl.pathname)) {
        return NextResponse.next()
      }
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (isPublicRoute(req.nextUrl.pathname)) {
      return NextResponse.next()
    }

    url.pathname = '/auth'
    url.searchParams.set('redirectedFrom', req.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  if (isProtectedRoute(req.nextUrl.pathname)) {
    const planId = req.nextUrl.searchParams.get('planId')
    if (planId && !url.pathname.startsWith('/upgrade')) {
      url.pathname = '/upgrade'
      return NextResponse.redirect(url)
    }
    return NextResponse.next()
  } else if (isApiRoute(req.nextUrl.pathname)) {
    return NextResponse.next()
  } else if (isPublicRoute(req.nextUrl.pathname)) {
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/api/:path*',
    '/auth',
    '/dashboard/:path*',
    '/',
    '/drafts/:path*',
    '/upgrade/:path*',
  ],
}
