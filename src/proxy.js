import { NextResponse } from 'next/server';

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/dashboard-admin/:path*',
  ],
};

export function proxy(request) {
  const { pathname } = request.nextUrl;
  const session = request.cookies.get('boem_session')?.value;
  const role = request.cookies.get('boem_role')?.value;
  const isAdminPath = pathname.startsWith('/dashboard-admin');

  if (!session) {
    const loginUrl = new URL(isAdminPath ? '/admin-login' : '/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (isAdminPath && role !== 'admin') {
    return NextResponse.redirect(new URL('/admin-login', request.url));
  }

  if (!isAdminPath && role === 'admin' && pathname === '/dashboard') {
    return NextResponse.redirect(new URL('/dashboard-admin', request.url));
  }

  return NextResponse.next();
}
