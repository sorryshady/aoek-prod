import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

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
  "/about", // Add any other public routes
];

// Middleware entry point
export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const session = (await cookies()).get("session")?.value;

  console.log(`[Middleware] Path: ${path}, Session Exists: ${!!session}`);

  // Redirect logged-in users away from login/register
  if (session && (path === "/login" || path === "/register")) {
    console.log(
      "[Middleware] Logged-in user accessing /login or /register. Redirecting to /",
    );
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Allow access to public routes
  if (isPublicRoute(path)) {
    console.log("[Middleware] Public route. Allowing access.");
    return NextResponse.next();
  }

  // Protected route: Require session
  if (!session) {
    console.log("[Middleware] No session found. Redirecting to login.");
    return redirectToLogin(request);
  }

  // Assume session is valid for protected routes
  console.log("[Middleware] Protected route. Session found. Proceeding.");
  return NextResponse.next();
}

// Helper: Check if a route is public
function isPublicRoute(path: string): boolean {
  return PUBLIC_ROUTES.some(
    (route) => path === route || path.startsWith(route + "/")
  );
}

// Redirect to login with redirectTo query parameter
function redirectToLogin(request: NextRequest) {
  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("redirectTo", encodeURIComponent(request.url));
  console.log(
    "[Middleware] Will redirect to: ",
    decodeURIComponent(new URL(request.url).href),
  );
  return NextResponse.redirect(loginUrl);
}

// Middleware configuration
export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - API routes
     * - Static files (_next/static)
     * - Image optimization files (_next/image)
     * - Favicon and robots.txt
     * - Public routes
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
