import { supabase } from "./supabase"
import crypto from "crypto"

const HASH_SECRET = process.env.HASH_SECRET || "gl6gHEuNztamFHLrFE98OL8dYQklDumDoGYR2Vr1YyQ="

// Hash password using the provided secret
export const hashPassword = (password: string): string => {
  const hmac = crypto.createHmac("sha256", HASH_SECRET)
  hmac.update(password)
  return hmac.digest("hex")
}

// Admin login
export const loginAdmin = async (username: string, password: string) => {
  try {
    // Hash the password
    const hashedPassword = hashPassword(password)

    // First verify admin credentials
    const { data: adminData, error: adminError } = await supabase
      .from("admin_users")
      .select("*")
      .eq("username", username)
      .eq("password", hashedPassword)
      .single()

    if (adminError || !adminData) {
      return { success: false, error: "Invalid credentials" }
    }

    // If verification successful, sign in with Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email: username,
      password,
    })

    if (error) {
      // If auth doesn't exist yet, sign up first
      if (error.message.includes("Email not confirmed")) {
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: username,
          password,
        })

        if (signUpError) {
          return { success: false, error: signUpError.message }
        }

        return { success: true, user: signUpData.user }
      }

      return { success: false, error: error.message }
    }

    return { success: true, user: data.user }
  } catch (error) {
    console.error("Admin login error:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

// Seller login
export const loginSeller = async (username: string, password: string) => {
  try {
    // Hash the password
    const hashedPassword = hashPassword(password)

    // Get the seller
    const { data: seller, error: sellerError } = await supabase
      .from("sellers")
      .select("*")
      .eq("username", username)
      .eq("password", hashedPassword)
      .single()

    if (sellerError || !seller) {
      return { success: false, error: "Invalid credentials" }
    }

    // Sign in with Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email: username,
      password,
    })

    if (error) {
      // If auth doesn't exist yet, sign up first
      if (error.message.includes("Email not confirmed") || error.message.includes("Invalid login credentials")) {
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: username,
          password,
        })

        if (signUpError) {
          return { success: false, error: signUpError.message }
        }

        return { success: true, seller, user: signUpData.user }
      }

      return { success: false, error: error.message }
    }

    return { success: true, seller, user: data.user }
  } catch (error) {
    console.error("Seller login error:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

// Logout
export const logoutSeller = async () => {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    return { success: true }
  } catch (error) {
    console.error("Logout error:", error)
    return { success: false, error: "Failed to logout" }
  }
}

// Get current session
export const getSession = async () => {
  try {
    const { data, error } = await supabase.auth.getSession()
    if (error) throw error
    return data.session
  } catch (error) {
    console.error("Get session error:", error)
    return null
  }
}

// Register a new seller
export const registerSeller = async (sellerData: {
  username: string
  password: string
  name: string
  email: string
  description?: string
  logo?: string
}) => {
  try {
    // Hash the password
    const hashedPassword = hashPassword(sellerData.password)

    // Insert the seller into the database
    const { data, error } = await supabase
      .from("sellers")
      .insert([
        {
          ...sellerData,
          password: hashedPassword,
          verified: false,
          rating: 5.0,
          followers: 0,
        },
      ])
      .select()
      .single()

    if (error) throw error

    // Create auth account
    const { error: authError } = await supabase.auth.signUp({
      email: sellerData.username,
      password: sellerData.password,
    })

    if (authError) {
      // Rollback seller creation if auth fails
      await supabase.from("sellers").delete().eq("id", data.id)
      throw authError
    }

    return { success: true, seller: data }
  } catch (error) {
    console.error("Register seller error:", error)
    return { success: false, error: "Failed to register seller" }
  }
}
