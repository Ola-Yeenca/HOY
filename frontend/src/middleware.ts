import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Protected routes that require authentication
const protectedRoutes = ['/admin', '/events', '/dashboard']
const publicRoutes = ['/', '/login', '/register']

export function middleware(request: NextRequest) {
  // Check for auth tokens in cookies
  const tokens = request.cookies.get('auth_tokens')?.value
  const hasValidToken = tokens ? JSON.parse(tokens)?.access : false
  const path = request.nextUrl.pathname
  
  // Check if the current path starts with any protected route
  const isProtectedPath = protectedRoutes.some(route => path.startsWith(route))
  const isLoginPath = path === '/login'

  // Always allow public routes
  if (publicRoutes.includes(path)) {
    return NextResponse.next()
  }

  // Redirect to login if accessing protected route without token
  if (isProtectedPath && !hasValidToken) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('from', request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Redirect to dashboard if accessing login while authenticated
  if (isLoginPath && hasValidToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ]
}
