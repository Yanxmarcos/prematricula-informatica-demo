// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const PUBLIC_ROUTES = ["/", "/login", "/api/auth"];

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // 1. Rutas públicas
    if (PUBLIC_ROUTES.some(route => pathname === route || pathname.startsWith(route + "/"))) {
        return NextResponse.next();
    }

    // 2. Obtener token
    const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
        const url = new URL("/login", request.url);
        url.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(url);
    }

    const { rol } = token;

    // 3. Verificar rutas administración
    if (pathname.startsWith("/administracion")) {
        const hasAdminAccess = rol === "director" || rol === "secretaria" || rol === "administrador";
        if (!hasAdminAccess) {
            return NextResponse.redirect(new URL("/estudiante/inicio", request.url));
        }
        return NextResponse.next();
    }

    // 4. Verificar rutas estudiante
    if (pathname.startsWith("/estudiante")) {
        const hasStudentAccess = rol === "estudiante";
        if (!hasStudentAccess) {
            return NextResponse.redirect(new URL("/administracion/inicio", request.url));
        }
        return NextResponse.next();
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:jpg|jpeg|png|gif|svg|webp|ico|css|js)$).*)",
    ],
};