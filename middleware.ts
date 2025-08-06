import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value || 
                request.headers.get('Authorization')?.replace('Bearer ', '');

  const { pathname } = request.nextUrl;

  // Public routes that don't require authentication
  const publicRoutes = ['/signin', '/signup'];
  
  // Check if the current path is a public route
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  // If no token and trying to access protected route
  if (!token && !isPublicRoute) {
    return NextResponse.redirect(new URL('/signin', request.url));
  }

  // If has token and trying to access signin/signup, redirect to dashboard
  if (token && (pathname === '/signin' || pathname === '/signup')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
