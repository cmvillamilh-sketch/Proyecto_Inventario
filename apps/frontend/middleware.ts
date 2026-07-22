import { NextRequest, NextResponse } from 'next/server';
import { ROLE_COOKIE, TOKEN_COOKIE } from './lib/auth/constants';

export function middleware(request: NextRequest) {
  const token = request.cookies.get(TOKEN_COOKIE)?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const role = request.cookies.get(ROLE_COOKIE)?.value;

  if (request.nextUrl.pathname.startsWith('/users') && role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/materials', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!login|_next|favicon.ico|.*\\..*).*)'],
};
