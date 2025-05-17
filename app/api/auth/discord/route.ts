import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { v4 as uuidv4 } from "uuid"

export async function GET(request: NextRequest) {
  try {
    // Generate a state parameter to prevent CSRF attacks
    const state = uuidv4()

    // Store the state in a cookie
    cookies().set("discord_oauth_state", state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 10, // 10 minutes
      path: "/",
    })

    // Get the redirect URL from the query parameters or use the default
    const redirectUri = process.env.DISCORD_REDIRECT_URI || `${request.nextUrl.origin}/api/auth/discord/callback`

    // Log for debugging
    console.log("Discord redirect URI:", redirectUri)

    // Construct the Discord OAuth URL
    const discordClientId = process.env.DISCORD_CLIENT_ID

    if (!discordClientId) {
      console.error("Discord client ID not configured")
      return NextResponse.json(
        {
          error: "Discord client ID not configured",
          env_check: {
            has_client_id: !!process.env.DISCORD_CLIENT_ID,
            has_client_secret: !!process.env.DISCORD_CLIENT_SECRET,
            has_redirect_uri: !!process.env.DISCORD_REDIRECT_URI,
            has_bot_token: !!process.env.DISCORD_BOT_TOKEN,
            has_server_id: !!process.env.DISCORD_SERVER_ID,
          },
        },
        { status: 500 },
      )
    }

    const url = new URL("https://discord.com/api/oauth2/authorize")
    url.searchParams.append("client_id", discordClientId)
    url.searchParams.append("redirect_uri", redirectUri)
    url.searchParams.append("response_type", "code")
    url.searchParams.append("state", state)
    url.searchParams.append("scope", "identify email guilds.join")
    url.searchParams.append("prompt", "consent")

    // Log the final URL for debugging
    console.log("Discord OAuth URL:", url.toString())

    // Redirect to Discord OAuth
    return NextResponse.redirect(url.toString())
  } catch (error) {
    console.error("Error in Discord auth route:", error)

    // Return detailed error information
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}
