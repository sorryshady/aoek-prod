import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "./lib/session";

// List of public routes that don't require authentication
const PUBLIC_ROUTES = [
  "/",
  "/news",
  "/events",
  "/committee",
  "/login",
  "/register",
  "/updates",
  "/newsletter",
  "/forgot-password",
  "/public",
  "/gallery",
  "/contact",
  "/about", // Add any other public routes
];

// Middleware entry point
export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const session = await getToken(request);

  // Redirect logged-in users away from login/register
  if (session && (path === "/login" || path === "/register")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Allow access to public routes
  if (isPublicRoute(path)) {
    return NextResponse.next();
  }

  // Protected route: Require session
  if (!session) {
    return redirectToLogin(request);
  }

  // Assume session is valid for protected routes
  return NextResponse.next();
}

// Helper: Check if a route is public
function isPublicRoute(path: string): boolean {
  return PUBLIC_ROUTES.some(
    (route) => path === route || path.startsWith(route + "/"),
  );
}

// Redirect to login with redirectTo query parameter
function redirectToLogin(request: NextRequest) {
  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("redirectTo", encodeURIComponent(request.url));
  return NextResponse.redirect(loginUrl);
}

// Middleware configuration
export const config = {
  matcher: [
    "/account",
    "/admin/:path*",
    "/protected/:path*",
  ],
};
