import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Protected routes that require authentication
const protectedRoutes = [
  '/admin',
  '/events',
  '/dashboard',
  '/gallery',
  '/profile',
  '/feedback'  // This covers /feedback and all its sub-routes
]
const publicRoutes = ['/', '/login', '/register']

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  console.log('Current path:', path);

  // Check if the current path starts with any protected route
  const isProtectedPath = protectedRoutes.some(route => 
    path === route || // Exact match
    path.startsWith(`${route}/`) // Nested routes
  )
  const isLoginPath = path === '/login'
  console.log('Is protected path:', isProtectedPath);
  console.log('Is login path:', isLoginPath);

  // Get auth status and user data from cookies
  const authStatus = request.cookies.get('auth_status')?.value;
  const userId = request.cookies.get('user_id')?.value;
  console.log('Auth status:', authStatus);
  console.log('User ID:', userId);

  // Check if user is authenticated
  const isAuthenticated = authStatus === 'authenticated' && userId;
  console.log('Is authenticated:', isAuthenticated);

  // If accessing login page while authenticated, redirect to dashboard
  if (isLoginPath && isAuthenticated) {
    console.log('Redirecting to dashboard from login');
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // If accessing protected route without authentication, redirect to login
  if (isProtectedPath && !isAuthenticated) {
    console.log('Redirecting to login from protected route');
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('returnUrl', path);
    return NextResponse.redirect(loginUrl);
  }

  // Allow all other requests
  return NextResponse.next();
}

// Match all routes except static files and API routes
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images (public images)
     * - videos (public videos)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images|videos).*)',
  ]
}
