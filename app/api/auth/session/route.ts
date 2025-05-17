import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET(request: NextRequest) {
  try {
    // Get the session cookie
    const sessionCookie = cookies().get("discord_session")?.value

    if (!sessionCookie) {
      return NextResponse.json({ session: null })
    }

    // Parse the session
    const session = JSON.parse(sessionCookie)

    // Check if the session has expired
    if (session.expires_at && session.expires_at < Date.now()) {
      cookies().delete("discord_session")
      return NextResponse.json({ session: null, reason: "expired" })
    }

    // Return the session (excluding the access token for security)
    const { access_token, ...safeSession } = session
    return NextResponse.json({ session: safeSession })
  } catch (error) {
    console.error("Error in session route:", error)
    return NextResponse.json({ session: null, error: "Failed to get session" }, { status: 500 })
  }
}
