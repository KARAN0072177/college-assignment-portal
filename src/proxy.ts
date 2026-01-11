import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const sessionCookie = request.cookies.get("session")?.value;
  const pathname = request.nextUrl.pathname;

  // If trying to access protected routes
  const isStudentRoute = pathname.startsWith("/student");
  const isTeacherRoute = pathname.startsWith("/teacher");

  // 1️⃣ Not logged in → block access
  if ((isStudentRoute || isTeacherRoute) && !sessionCookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 2️⃣ Logged in → role-based protection
  if (sessionCookie) {
    try {
      const session = JSON.parse(decodeURIComponent(sessionCookie));

      // Student trying to access teacher route
      if (isTeacherRoute && session.role !== "teacher") {
        return NextResponse.redirect(new URL("/student", request.url));
      }

      // Teacher trying to access student route
      if (isStudentRoute && session.role !== "student") {
        return NextResponse.redirect(new URL("/teacher", request.url));
      }
    } catch (error) {
      // Corrupted cookie → force logout
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // 3️⃣ Allow request
  return NextResponse.next();
}

export const config = {
  matcher: ["/student/:path*", "/teacher/:path*"],
};