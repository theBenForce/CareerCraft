import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";

export default withAuth(
  async function middleware(request) {
    const { pathname } = request.nextUrl;

    // Skip setup check for API routes, static files, and the setup page itself
    if (
      pathname.startsWith("/api/") ||
      pathname.startsWith("/_next/") ||
      pathname.startsWith("/setup") ||
      pathname === "/favicon.ico" ||
      pathname.includes(".")
    ) {
      return NextResponse.next();
    }

    try {
      // Check if setup is required
      const setupCheckUrl = new URL("/api/setup", request.url);
      const response = await fetch(setupCheckUrl.toString());

      if (response.ok) {
        const data = await response.json();

        if (data.setupRequired) {
          // Redirect to setup page
          return NextResponse.redirect(new URL("/setup", request.url));
        }
      }
    } catch (error) {
      console.error("Middleware setup check failed:", error);
      // Continue to the requested page if check fails
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // Allow access to auth pages without authentication
        if (pathname.startsWith("/auth/")) {
          return true;
        }

        // Allow access to API auth routes
        if (pathname.startsWith("/api/auth/")) {
          return true;
        }

        // Require authentication for all other pages
        return !!token;
      },
    },
    pages: {
      signIn: "/auth/signin",
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes - handled by callback)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
