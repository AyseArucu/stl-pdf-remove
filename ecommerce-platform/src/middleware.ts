import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // Check if the path starts with /erashu/admin
    if (request.nextUrl.pathname.startsWith('/erashu/admin')) {

        // Exclude the login page itself to prevent infinite loops
        if (request.nextUrl.pathname === '/erashu/admin/login') {
            return NextResponse.next();
        }

        const session = request.cookies.get('user_session');

        if (!session) {
            // No session, redirect to login
            return NextResponse.redirect(new URL('/erashu/admin/login', request.url));
        }

        try {
            const user = JSON.parse(session.value);

            // Check for ADMIN role
            if (user.role !== 'ADMIN') {
                // Logged in but not admin, redirect to home
                return NextResponse.redirect(new URL('/', request.url));
            }
        } catch (e) {
            // Invalid session cookie, treat as not logged in
            return NextResponse.redirect(new URL('/erashu/admin/login', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/erashu/admin/:path*',
};
