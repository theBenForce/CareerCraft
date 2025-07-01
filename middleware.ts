import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
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
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
