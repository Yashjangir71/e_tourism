import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
export { default } from "next-auth/middleware"
import { getToken } from 'next-auth/jwt'
 
// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
    const token = await getToken({req: request})
    const url = request.nextUrl

    if (token && (
        url.pathname == ('/login') ||
        url.pathname == ('/signup') ||
        url.pathname == ('/verify-email') ||
        url.pathname == ('/')
    )) {
        return NextResponse.redirect(new URL('/app', request.url))
    }

    if (!token && url.pathname.startsWith('/app')) {
        return NextResponse.redirect(new URL('/', request.url))
    }


    if (
        token?.userType === 'tourist' &&
        url.pathname === '/app/create-tour'
      ) {
        return NextResponse.redirect(new URL('/app', request.url)) // Or show a 403 page if you want
      }
//   return NextResponse.redirect(new URL('/app', request.url))
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/login',
    '/signup',
    '/verify-email',
    '/',
    '/app/:path*'
],
}