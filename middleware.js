import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request) {
    // Use NextAuth's getToken to check for valid session
    const token = await getToken({ 
        req: request,
        secret: process.env.NEXTAUTH_SECRET 
    });

    // Define Private Routes based on requirements: Booking and My Bookings
    const isPrivateRoute =
        request.nextUrl.pathname.startsWith('/booking') ||
        request.nextUrl.pathname.startsWith('/my-bookings');

    if (isPrivateRoute && !token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/booking/:path*', '/my-bookings/:path*'],
};