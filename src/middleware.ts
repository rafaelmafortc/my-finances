import {
    NextResponse,
    type MiddlewareConfig,
    type NextRequest,
} from 'next/server';
import { getToken } from 'next-auth/jwt';

const publicRoutes = [
    {
        path: '/',
        whenAuthenticated: 'next',
    },
    {
        path: '/login',
        whenAuthenticated: 'redirect',
    },
] as const;

const REDIRECT_WHEN_NOT_AUTHENTICANTED_ROUTE = '/';
const REDIRECT_IF_AUTHENTICATED_ROUTE = '/dashboard';

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;
    const publicRoute = publicRoutes.find((route) => route.path === path);
    const token = await getToken({ req: request });

    if (!token && !publicRoute) {
        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = REDIRECT_WHEN_NOT_AUTHENTICANTED_ROUTE;

        return NextResponse.redirect(redirectUrl);
    }

    if (token && publicRoute && publicRoute?.whenAuthenticated === 'redirect') {
        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = REDIRECT_IF_AUTHENTICATED_ROUTE;

        return NextResponse.redirect(redirectUrl);
    }

    // if (token && !publicRoute) {
    //     // Checar se o JWT está EXPIRADO
    //     // Se sim, remover o cookie e redirecionar o usuário para o login
    //     return NextResponse.next();
    // }

    return NextResponse.next();
}

export const config: MiddlewareConfig = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico, sitemap.xml, robots.txt (metadata files)
         */
        '/((?!api|_next/static|_next/image|assets|favicon.ico|sitemap.xml|robots.txt).*)',
    ],
};
