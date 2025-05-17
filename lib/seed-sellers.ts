import { supabase } from "./supabase"
import { hashPassword } from "./auth-service"

// Initial sellers data for seeding
const initialSellers = [
  {
    name: "Nike",
    username: "nike",
    password: "123",
    email: "nike@example.com",
    logo: "/placeholder.svg?height=100&width=100",
    description: "Official Nike store offering the latest in athletic footwear, apparel, and accessories.",
    verified: true,
    rating: 4.8,
    followers: 15000,
    location: "Beaverton, Oregon",
    specialties: ["Footwear", "Athletic Apparel", "Sports Equipment"],
  },
  {
    name: "Adidas",
    username: "adidas",
    password: "123",
    email: "adidas@example.com",
    logo: "/placeholder.svg?height=100&width=100",
    description: "Official Adidas store offering the latest in athletic footwear, apparel, and accessories.",
    verified: true,
    rating: 4.7,
    followers: 12000,
    location: "Bavaria, Germany",
    specialties: ["Footwear", "Athletic Apparel", "Sports Equipment"],
  },
  {
    name: "Puma",
    username: "puma",
    password: "123",
    email: "puma@example.com",
    logo: "/placeholder.svg?height=100&width=100",
    description: "Official Puma store offering the latest in athletic footwear, apparel, and accessories.",
    verified: true,
    rating: 4.5,
    followers: 9000,
    location: "Herzogenaurach, Germany",
    specialties: ["Footwear", "Athletic Apparel", "Sports Equipment"],
  },
  {
    name: "Under Armour",
    username: "underarmour",
    password: "123",
    email: "underarmour@example.com",
    logo: "/placeholder.svg?height=100&width=100",
    description: "Official Under Armour store offering the latest in athletic footwear, apparel, and accessories.",
    verified: true,
    rating: 4.6,
    followers: 7500,
    location: "Baltimore, USA",
    specialties: ["Footwear", "Athletic Apparel", "Sports Equipment"],
  },
  {
    name: "New Balance",
    username: "newbalance",
    password: "123",
    email: "newbalance@example.com",
    logo: "/placeholder.svg?height=100&width=100",
    description: "Official New Balance store offering the latest in athletic footwear, apparel, and accessories.",
    verified: true,
    rating: 4.4,
    followers: 6000,
    location: "Boston, USA",
    specialties: ["Footwear", "Athletic Apparel", "Sports Equipment"],
  },
]

// Admin user for seeding
const adminUser = {
  username: "admin",
  password: "123",
  email: "admin@example.com",
}

// Function to seed the database with initial sellers
export const seedSellers = async () => {
  try {
    // Check if sellers already exist
    const { count, error: countError } = await supabase.from("sellers").select("*", { count: "exact", head: true })

    if (countError) {
      throw countError
    }

    // If sellers already exist, don't seed
    if (count && count > 0) {
      console.log(`Database already has ${count} sellers. Skipping seed.`)
      return { success: true, message: "Sellers already exist" }
    }

    // Hash passwords and prepare data for insertion
    const sellersWithHashedPasswords = initialSellers.map((seller) => ({
      ...seller,
      password: hashPassword(seller.password),
    }))

    // Insert sellers
    const { data, error } = await supabase.from("sellers").insert(sellersWithHashedPasswords).select()

    if (error) {
      throw error
    }

    console.log(`Successfully seeded ${data.length} sellers`)

    // Check if admin already exists
    const { count: adminCount, error: adminCountError } = await supabase
      .from("admin_users")
      .select("*", { count: "exact", head: true })

    if (adminCountError) {
      throw adminCountError
    }

    // If admin already exists, don't seed
    if (adminCount && adminCount > 0) {
      console.log(`Admin user already exists. Skipping seed.`)
      return { success: true, message: "Sellers and admin seeded successfully" }
    }

    // Insert admin user
    const { error: adminError } = await supabase
      .from("admin_users")
      .insert([{ ...adminUser, password: hashPassword(adminUser.password) }])

    if (adminError) {
      throw adminError
    }

    console.log("Successfully seeded admin user")

    return { success: true, message: "Sellers and admin seeded successfully" }
  } catch (error) {
    console.error("Error seeding sellers:", error)
    return { success: false, error: "Failed to seed sellers" }
  }
}
