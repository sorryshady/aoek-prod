import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "./lib/session";

// CORS Configuration
const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "https://yourmobileapp.com",
  "https://aoek-testing.vercel.app",
];

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

// CORS headers generation
function getCorsHeaders(origin: string): Record<string, string> {
  return ALLOWED_ORIGINS.includes(origin)
    ? {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods":
          "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
        "Access-Control-Allow-Headers":
          "Content-Type, Authorization, X-Requested-With",
        "Access-Control-Allow-Credentials": "true",
      }
    : {};
}

// Middleware entry point
export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const origin = request.headers.get("origin") || "";

  // Handle CORS preflight requests
  if (request.method === "OPTIONS") {
    const corsHeaders = getCorsHeaders(origin);
    return new NextResponse(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  // Create a response object for CORS
  const response = NextResponse.next();
  const corsHeaders = getCorsHeaders(origin);
  Object.entries(corsHeaders).forEach(([key, value]) => {
    response.headers.append(key, value);
  });

  // Redirect logged-in users away from login/register
  const session = await getToken(request);
  if (session && (path === "/login" || path === "/register")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Allow access to public routes
  if (isPublicRoute(path)) {
    return response;
  }

  // Protected route: Require session
  if (!session) {
    return redirectToLogin(request);
  }

  // Assume session is valid for protected routes
  return response;
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
    "/api/:path*", // Add API routes to CORS handling
  ],
};
