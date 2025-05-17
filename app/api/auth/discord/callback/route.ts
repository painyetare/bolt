import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createClient } from "@supabase/supabase-js"

export async function GET(request: NextRequest) {
  try {
    // Get the code and state from the query parameters
    const searchParams = request.nextUrl.searchParams
    const code = searchParams.get("code")
    const state = searchParams.get("state")

    // Get the stored state from the cookie
    const storedState = cookies().get("discord_oauth_state")?.value

    // Log for debugging
    console.log("Callback received - Code:", !!code, "State:", state, "Stored State:", storedState)

    // Validate the state parameter to prevent CSRF attacks
    if (!state || !storedState || state !== storedState) {
      console.error("Invalid state parameter", { state, storedState })
      return NextResponse.redirect(new URL("/auth/error?error=invalid_state", request.url))
    }

    // Validate the code parameter
    if (!code) {
      console.error("No code provided")
      return NextResponse.redirect(new URL("/auth/error?error=no_code", request.url))
    }

    // Clear the state cookie
    cookies().delete("discord_oauth_state")

    // Exchange the code for an access token
    const tokenResponse = await exchangeCodeForToken(code, request.nextUrl.origin)

    if (!tokenResponse.access_token) {
      console.error("Failed to get access token", tokenResponse)
      return NextResponse.redirect(
        new URL(`/auth/error?error=${encodeURIComponent(tokenResponse.error || "token_error")}`, request.url),
      )
    }

    // Get the user's Discord profile
    const userProfile = await getDiscordUserProfile(tokenResponse.access_token)

    if (!userProfile.id) {
      console.error("Failed to get user profile", userProfile)
      return NextResponse.redirect(
        new URL(`/auth/error?error=${encodeURIComponent(userProfile.error || "profile_error")}`, request.url),
      )
    }

    // Add the user to the Discord server if needed
    try {
      await addUserToDiscordServer(userProfile.id, tokenResponse.access_token)
    } catch (error) {
      console.error("Failed to add user to Discord server", error)
      // Continue anyway, this is not a critical error
    }

    // Store the user profile in the database
    const dbResult = await storeUserProfile(userProfile)

    if (!dbResult.success) {
      console.error("Failed to store user profile", dbResult.error)
      // Continue anyway, we can still set the session
    }

    // Set the session cookie
    cookies().set(
      "discord_session",
      JSON.stringify({
        id: userProfile.id,
        username: userProfile.username,
        avatar: userProfile.avatar,
        access_token: tokenResponse.access_token,
        expires_at: Date.now() + tokenResponse.expires_in * 1000,
      }),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: tokenResponse.expires_in,
        path: "/",
      },
    )

    // Redirect to the dashboard or home page
    return NextResponse.redirect(new URL("/", request.url))
  } catch (error) {
    console.error("Error in Discord callback route:", error)
    return NextResponse.redirect(
      new URL(
        `/auth/error?error=${encodeURIComponent(error instanceof Error ? error.message : "unknown_error")}`,
        request.url,
      ),
    )
  }
}

// Helper function to exchange the code for an access token
async function exchangeCodeForToken(code: string, origin: string) {
  try {
    const redirectUri = process.env.DISCORD_REDIRECT_URI || `${origin}/api/auth/discord/callback`

    const response = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: process.env.DISCORD_CLIENT_ID || "",
        client_secret: process.env.DISCORD_CLIENT_SECRET || "",
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error("Token exchange failed", response.status, errorData)
      return { error: `token_exchange_failed_${response.status}` }
    }

    return await response.json()
  } catch (error) {
    console.error("Token exchange error:", error)
    return { error: "token_exchange_error" }
  }
}

// Helper function to get the user's Discord profile
async function getDiscordUserProfile(accessToken: string) {
  try {
    const response = await fetch("https://discord.com/api/users/@me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error("Profile fetch failed", response.status, errorData)
      return { error: `profile_fetch_failed_${response.status}` }
    }

    return await response.json()
  } catch (error) {
    console.error("Profile fetch error:", error)
    return { error: "profile_fetch_error" }
  }
}

// Helper function to add the user to the Discord server
async function addUserToDiscordServer(userId: string, accessToken: string) {
  const serverId = process.env.DISCORD_SERVER_ID
  const botToken = process.env.DISCORD_BOT_TOKEN

  if (!serverId || !botToken) {
    console.warn("Discord server ID or bot token not configured")
    return { success: false, error: "missing_config" }
  }

  const response = await fetch(`https://discord.com/api/guilds/${serverId}/members/${userId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bot ${botToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      access_token: accessToken,
    }),
  })

  // 201 = Created (user added)
  // 204 = No Content (user was already a member)
  if (response.status === 201 || response.status === 204) {
    return { success: true }
  }

  const errorData = await response.json().catch(() => ({}))
  console.error("Add to server failed", response.status, errorData)
  return { success: false, error: errorData }
}

// Helper function to store the user profile in the database
async function storeUserProfile(profile: any) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      console.warn("Supabase URL or key not configured")
      return { success: false, error: "missing_config" }
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Check if the user already exists
    const { data: existingUser, error: fetchError } = await supabase
      .from("users")
      .select("*")
      .eq("discord_id", profile.id)
      .single()

    if (fetchError && fetchError.code !== "PGRST116") {
      // PGRST116 = not found
      console.error("Error fetching user:", fetchError)
      return { success: false, error: fetchError }
    }

    if (existingUser) {
      // Update the existing user
      const { error: updateError } = await supabase
        .from("users")
        .update({
          username: profile.username,
          avatar_url: profile.avatar ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png` : null,
          email: profile.email,
          updated_at: new Date().toISOString(),
        })
        .eq("discord_id", profile.id)

      if (updateError) {
        console.error("Error updating user:", updateError)
        return { success: false, error: updateError }
      }

      return { success: true, user: existingUser }
    } else {
      // Create a new user
      const { data: newUser, error: insertError } = await supabase
        .from("users")
        .insert([
          {
            discord_id: profile.id,
            username: profile.username,
            avatar_url: profile.avatar
              ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`
              : null,
            email: profile.email,
            role: "user",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ])
        .select()
        .single()

      if (insertError) {
        console.error("Error creating user:", insertError)
        return { success: false, error: insertError }
      }

      return { success: true, user: newUser }
    }
  } catch (error) {
    console.error("Store user profile error:", error)
    return { success: false, error }
  }
}
