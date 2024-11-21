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
  "/forgot-password",
  "/public", // Add any other public routes
];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const session = (await cookies()).get("session")?.value;

  // If the user is logged in and tries to access /login or /register, redirect them to the homepage
  if (session && (path === "/login" || path === "/register")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Check if the route is public
  if (isPublicRoute(path)) {
    return NextResponse.next();
  }

  // No session, redirect to login
  if (!session) {
    return redirectToLogin(request);
  }

  // Verify session (you'll need to implement this server-side verification)
  return verifySession(request, session);
}

// Helper to check if a route is public
function isPublicRoute(path: string): boolean {
  return PUBLIC_ROUTES.some(
    (route) => path === route || path.startsWith(route + "/"),
  );
}

// Redirect to login page
function redirectToLogin(request: NextRequest) {
  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("redirectTo", encodeURIComponent(request.url));
  return NextResponse.redirect(loginUrl);
}

// Verify session and check route permissions
async function verifySession(request: NextRequest, session: string) {
  try {
    // Server-side session verification
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/auth/user`,
      {
        headers: {
          cookie: `session=${session}`,
        },
      },
    );

    // If session verification fails, redirect to login
    if (!response.ok) {
      console.log("Session verification failed, redirecting to login");
      return redirectToLogin(request);
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Session verification error:", error);
    return redirectToLogin(request);
  }
}

// Configure which routes this middleware applies to
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public routes
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
