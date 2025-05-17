import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Get the pathname
  const path = request.nextUrl.pathname

  // Define protected routes
  const sellerProtectedRoutes = [
    "/dashboard",
    "/dashboard/seller-products",
    "/dashboard/messages",
    "/dashboard/settings",
  ]

  // Check if the path is a protected seller route
  const isSellerProtectedRoute = sellerProtectedRoutes.some((route) => path === route || path.startsWith(`${route}/`))

  // Get the seller cookie
  const sellerLoggedIn = request.cookies.get("seller_logged_in")?.value === "true"
  const sellerId = request.cookies.get("seller_id")?.value

  // If it's a protected seller route and the user is not logged in, redirect to login
  if (isSellerProtectedRoute && (!sellerLoggedIn || !sellerId)) {
    return NextResponse.redirect(new URL("/sellers/login", request.url))
  }

  // Continue with the request
  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*"],
}
