import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Public routes accessible without prior authentication
const PUBLIC_PATHS = [
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
]

// API routes that must remain open for auth operations
const PUBLIC_API_PREFIXES = [
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/forgot-password',
  '/api/auth/me',
]

/**
 * Lightweight JWT payload parser compatible with Edge Runtime
 * Avoids Node.js 'crypto' module dependencies in middleware
 */
function parseJwtPayload(token: string) {
  try {
    const parts = token.split('.')
    if (parts.length < 2) return null
    const base64Url = parts[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const decoded = atob(base64)
    return JSON.parse(decoded)
  } catch {
    return null
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 1. Allow Next.js internal files, uploads, and static assets
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/uploads') ||
    pathname === '/favicon.ico' ||
    /\.(.*)$/.test(pathname)
  ) {
    return NextResponse.next()
  }

  // 2. Allow public auth APIs
  if (PUBLIC_API_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return NextResponse.next()
  }

  // 3. Inspect authentication token from cookies
  const token = request.cookies.get('kagzify_token')?.value
  const payload = token ? parseJwtPayload(token) : null

  // Verify token is not expired if exp is set
  const isExpired = payload?.exp ? Date.now() >= payload.exp * 1000 : false
  const isAuthenticated = Boolean(payload && payload.userId && !isExpired)

  const isPublicAuthPage = PUBLIC_PATHS.some(
    (path) => pathname === path || pathname.startsWith(path + '/')
  )

  // 4. If user is NOT authenticated
  if (!isAuthenticated) {
    // If requesting old admin login, redirect to unified portal with role=admin
    if (pathname === '/admin/login') {
      return NextResponse.redirect(new URL('/auth/login?role=admin', request.url))
    }

    // If requesting auth pages (login, register), allow them through
    if (isPublicAuthPage) {
      return NextResponse.next()
    }

    // For any protected API route, return 401 Unauthorized JSON
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // For web pages, redirect to the unified login portal
    const loginUrl = new URL('/auth/login', request.url)
    if (pathname !== '/') {
      loginUrl.searchParams.set('from', pathname)
    }
    return NextResponse.redirect(loginUrl)
  }

  // 5. If user IS authenticated
  // If they visit login/register pages while already authenticated, redirect them
  if (isPublicAuthPage) {
    if (payload?.role === 'ADMIN') {
      return NextResponse.redirect(new URL('/admin', request.url))
    }
    return NextResponse.redirect(new URL('/', request.url))
  }

  // 6. Role-based protection: only ADMIN can access /admin
  if (pathname.startsWith('/admin') && payload?.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except static assets
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
