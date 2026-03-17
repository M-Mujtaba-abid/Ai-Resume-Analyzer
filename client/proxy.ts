import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  // 1. Token nikalein (Cookies se)
  const authToken = request.cookies.get('accessToken')?.value;
  const { pathname } = request.nextUrl;


//    Debugging ke liye (Terminal mein check karein)
  console.log(`i am from middleware============ Path: ${pathname} | Token Exists: ${!!authToken}`);
  // 2. Define karein kaunse pages PUBLIC hain (Bina login ke accessible)
  const publicRoutes = [
    '/',
    '/login',
    '/register',
    '/solutions',
    '/technology',
    '/pricing',
    '/Forgot-Password',
    '/reset-password',
    '/verify-otp',
    '/',
  ];

  const isPublicRoute = publicRoutes.some((route) =>
  pathname.startsWith(route)
);

  // 3. CASE: Agar user login NAHI hai aur Protected page par jana chahta hai
  if (!authToken && !isPublicRoute) {
    // User ko login par redirect karein aur 'callbackUrl' save karein taake login ke baad wapis wahin aaye
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname); 
    return NextResponse.redirect(loginUrl);
  }

  // 4. CASE: Agar user LOGIN hai aur login/register page kholne ki koshish kare
  if (authToken && (pathname === '/login' || pathname === '/register')) {
    // Usay seedha dashboard par bhej dein
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Baqi tamam cases ke liye request ko aage jane dein
  return NextResponse.next();
}

// 5. Matcher Configuration
export const config = {
  matcher: [
    /*
     * In paths ko middleware skip karega:
     * - api (internal API routes)
     * - _next/static (static files like CSS/JS)
     * - _next/image (Next.js image optimization)
     * - favicon.ico aur images (public folder files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};