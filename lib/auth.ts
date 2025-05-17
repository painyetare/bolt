import { getSupabase } from "./supabase"
import crypto from "crypto"

const HASH_SECRET = "gl6gHEuNztamFHLrFE98OL8dYQklDumDoGYR2Vr1YyQ="

// Hash password using the provided secret
export const hashPassword = (password: string): string => {
  const hmac = crypto.createHmac("sha256", HASH_SECRET)
  hmac.update(password)
  return hmac.digest("hex")
}

// Verify password against hashed password
export const verifyPassword = (password: string, hashedPassword: string): boolean => {
  const hashedInput = hashPassword(password)
  return hashedInput === hashedPassword
}

// Admin login
export const adminLogin = async (username: string, password: string) => {
  const supabase = getSupabase()

  // Check if the username and password match the admin credentials
  const { data, error } = await supabase.from("admin_users").select("*").eq("username", username).single()

  if (error || !data) {
    return { success: false, error: "Invalid credentials" }
  }

  // Verify the password using the database's crypt function
  const { data: verificationData, error: verificationError } = await supabase.rpc("verify_admin", {
    admin_username: username,
    admin_password: password,
  })

  if (verificationError || !verificationData) {
    return { success: false, error: "Invalid credentials" }
  }

  // Set a session cookie or token
  localStorage.setItem(
    "adminAuth",
    JSON.stringify({
      isAuthenticated: true,
      username: username,
    }),
  )

  return { success: true }
}

// Seller login
export const sellerLogin = async (username: string, password: string) => {
  const supabase = getSupabase()

  // Get the seller
  const { data: seller, error } = await supabase.from("sellers").select("*").eq("username", username).single()

  if (error || !seller) {
    return { success: false, error: "Invalid credentials" }
  }

  // Verify the password
  const hashedPassword = hashPassword(password)
  if (seller.password !== hashedPassword) {
    return { success: false, error: "Invalid credentials" }
  }

  // Set a session cookie or token
  localStorage.setItem(
    "sellerAuth",
    JSON.stringify({
      isAuthenticated: true,
      username: username,
      id: seller.id,
      name: seller.name,
    }),
  )

  return { success: true, seller }
}

// Check if admin is logged in
export const isAdminLoggedIn = (): boolean => {
  if (typeof window === "undefined") return false

  const adminAuth = localStorage.getItem("adminAuth")
  if (!adminAuth) return false

  try {
    const auth = JSON.parse(adminAuth)
    return auth.isAuthenticated === true
  } catch (e) {
    return false
  }
}

// Check if seller is logged in
export const isSellerLoggedIn = (): boolean => {
  if (typeof window === "undefined") return false

  const sellerAuth = localStorage.getItem("sellerAuth")
  if (!sellerAuth) return false

  try {
    const auth = JSON.parse(sellerAuth)
    return auth.isAuthenticated === true
  } catch (e) {
    return false
  }
}

// Get current seller
export const getCurrentSeller = () => {
  if (typeof window === "undefined") return null

  const sellerAuth = localStorage.getItem("sellerAuth")
  if (!sellerAuth) return null

  try {
    return JSON.parse(sellerAuth)
  } catch (e) {
    return null
  }
}

// Logout
export const logout = (type: "admin" | "seller") => {
  if (type === "admin") {
    localStorage.removeItem("adminAuth")
  } else {
    localStorage.removeItem("sellerAuth")
  }
}
