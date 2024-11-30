import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "./lib/session";

// Remove trailing slashes from origins
const allowedOrigins = [
  "https://aoek-prod.vercel.app",
  "https://www.aoek-prod.vercel.app",
  "http://localhost:3000",
];

const corsOptions = {
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Credentials": "true", // Important for cookies/sessions
};

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
  "/about",
];

// Middleware entry point
export async function middleware(request: NextRequest) {
  const origin = request.headers.get("origin") ?? "";
  const isAllowedOrigin = allowedOrigins.includes(origin);
  const isPreflight = request.method === "OPTIONS";

  // Handle preflight requests
  if (isPreflight) {
    const preflightHeaders = {
      ...(isAllowedOrigin && {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Credentials": "true"
      }),
      ...corsOptions,
    };
    return NextResponse.json({}, { headers: preflightHeaders });
  }

  const path = request.nextUrl.pathname;
  const session = await getToken(request);
  const response = NextResponse.next();

  // Set CORS headers
  if (isAllowedOrigin) {
    response.headers.set("Access-Control-Allow-Origin", origin);
    response.headers.set("Access-Control-Allow-Credentials", "true");
  }

  Object.entries(corsOptions).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  // Redirect logged-in users away from login/register
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
    (route) => path === route || path.startsWith(route + "/")
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
    "/api/:path*" // Add this to ensure API routes are covered
  ],
};
