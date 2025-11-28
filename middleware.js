import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import * as jose from 'jose';

const verifyToken = async (token) => {
  if (!token) return null;
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jose.jwtVerify(token, secret);
    return payload;
  } catch (err) {
    return null;
  }
};

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Only protect admin routes (except login)
  if (pathname.startsWith('/admin')) {
    if (pathname === '/admin/login') {
      return NextResponse.next();
    }

    try {
      const cookieStore = await cookies();
      const token = cookieStore.get('token')?.value;
      const user = await verifyToken(token);

      if (!user) {
        // Redirect to login if not authenticated
        const loginUrl = new URL('/admin/login', request.url);
        loginUrl.searchParams.set('from', pathname);
        return NextResponse.redirect(loginUrl);
      }
    } catch (error) {
      // If there's an error, redirect to login
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
  ],
};