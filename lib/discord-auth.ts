import { createClient } from "@supabase/supabase-js"

// Discord OAuth2 configuration
export const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID || "998993369189589122"
export const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET || "BQHN3L_ecQFxFcBoENU67DaayJ_-c7JB"
export const DISCORD_REDIRECT_URI =
  process.env.DISCORD_REDIRECT_URI || "https://kzmoeth0e11zuntjp9ok.lite.vusercontent.net/auth/discord/callback"
export const DISCORD_BOT_TOKEN =
  process.env.DISCORD_BOT_TOKEN || "OTk4OTkzMzY5MTg5NTg5MTIy.GAICD2.bxCVRpYkLl0zCGws0FZOGbP_0gbmVq1LJPSlpU"
export const DISCORD_SERVER_ID = process.env.DISCORD_SERVER_ID || "981790409166561340"

// Discord API endpoints
const DISCORD_API_URL = "https://discord.com/api/v10"
const DISCORD_AUTH_URL = `${DISCORD_API_URL}/oauth2/authorize`
const DISCORD_TOKEN_URL = `${DISCORD_API_URL}/oauth2/token`
const DISCORD_USER_URL = `${DISCORD_API_URL}/users/@me`
const DISCORD_GUILD_MEMBER_URL = `${DISCORD_API_URL}/guilds/${DISCORD_SERVER_ID}/members`

// Generate Discord OAuth2 authorization URL
export function getDiscordAuthUrl(state: string): string {
  const params = new URLSearchParams({
    client_id: DISCORD_CLIENT_ID,
    redirect_uri: DISCORD_REDIRECT_URI,
    response_type: "code",
    scope: "identify guilds.join",
    state,
  })

  return `${DISCORD_AUTH_URL}?${params.toString()}`
}

// Exchange authorization code for access token
export async function getDiscordToken(code: string): Promise<{
  access_token: string
  refresh_token: string
  expires_in: number
}> {
  const params = new URLSearchParams({
    client_id: DISCORD_CLIENT_ID,
    client_secret: DISCORD_CLIENT_SECRET,
    grant_type: "authorization_code",
    code,
    redirect_uri: DISCORD_REDIRECT_URI,
  })

  const response = await fetch(DISCORD_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(`Failed to get Discord token: ${JSON.stringify(error)}`)
  }

  return response.json()
}

// Get Discord user profile
export async function getDiscordUser(accessToken: string): Promise<{
  id: string
  username: string
  avatar: string
  discriminator: string
}> {
  const response = await fetch(DISCORD_USER_URL, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(`Failed to get Discord user: ${JSON.stringify(error)}`)
  }

  return response.json()
}

// Add user to Discord server
export async function addUserToDiscordServer(userId: string, accessToken: string): Promise<boolean> {
  const url = `${DISCORD_GUILD_MEMBER_URL}/${userId}`

  const response = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      access_token: accessToken,
    }),
  })

  // 201 = Created (user added)
  // 204 = No Content (user was already a member)
  if (response.status === 201 || response.status === 204) {
    return true
  }

  const error = await response.json().catch(() => ({ message: "Unknown error" }))
  console.error("Failed to add user to Discord server:", error)
  return false
}

// Supabase client for user profile management
// This would typically be imported from a shared supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

// User profile management functions
export async function getUserByDiscordId(discordId: string) {
  const { data, error } = await supabase.from("users").select("*").eq("discord_id", discordId).single()

  if (error && error.code !== "PGRST116") {
    console.error("Error fetching user:", error)
  }

  return data
}

export async function createUserProfile(profileData: {
  discord_id: string
  username: string
  avatar_url: string
  role?: string
}) {
  const { data, error } = await supabase
    .from("users")
    .insert([
      {
        ...profileData,
        role: profileData.role || "buyer",
        created_at: new Date().toISOString(),
      },
    ])
    .select()
    .single()

  if (error) {
    console.error("Error creating user profile:", error)
    throw error
  }

  return data
}

export async function updateUserProfile(
  discordId: string,
  profileData: Partial<{
    username: string
    avatar_url: string
    role: string
  }>,
) {
  const { data, error } = await supabase.from("users").update(profileData).eq("discord_id", discordId).select().single()

  if (error) {
    console.error("Error updating user profile:", error)
    throw error
  }

  return data
}
