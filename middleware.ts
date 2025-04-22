import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const { nextUrl, auth } = req
  const isLoggedIn = !!auth?.user
  const isAdmin = auth?.user?.role === "admin"
  const isAdminPanel = nextUrl.pathname.startsWith("/admin")
  const isAdminProjectsRoute = nextUrl.pathname.startsWith("/admin/projects")

  // If trying to access admin routes without admin role, redirect to login
  if (isAdminPanel && !isAdmin) {
    return NextResponse.redirect(new URL(`/login?callbackUrl=${encodeURIComponent(nextUrl.pathname)}`, nextUrl))
  }

  // If trying to access login/register while logged in, redirect to home
  if ((nextUrl.pathname === "/login" || nextUrl.pathname === "/register") && isLoggedIn) {
    return NextResponse.redirect(new URL("/", nextUrl))
  }

  return NextResponse.next()
})

// Specify which routes the middleware should run on
export const config = {
  matcher: ["/admin/:path*", "/login", "/register"]
}
