import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET(request: NextRequest) {
  // Clear all Discord-related cookies
  cookies().delete("discord_user_id")
  cookies().delete("discord_username")
  cookies().delete("discord_avatar")

  // Redirect to the home page
  return NextResponse.redirect(new URL("/", request.url))
}
