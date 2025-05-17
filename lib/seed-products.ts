import { supabase } from "./supabase"

// Initial products data for seeding
const initialProducts = [
  {
    name: "Nike Air Force 1",
    price: "45.99$",
    numeric_price: 45.99,
    image: "/placeholder.svg?height=300&width=300",
    description: "Classic Nike Air Force 1 in white colorway.",
    categories: ["Shoes", "Nike"],
    product_id: "AF1001",
    source: "WD",
    user_code: "nike",
    quality: "AAA+",
    in_stock: true,
    rating: 4.8,
    review_count: 120,
    colors: ["White", "Black", "Red"],
    sizes: ["US 7", "US 8", "US 9", "US 10", "US 11"],
    featured: true,
    date_added: new Date().toISOString(),
    brand_id: 1,
  },
  {
    name: "Adidas Ultraboost",
    price: "59.99$",
    numeric_price: 59.99,
    image: "/placeholder.svg?height=300&width=300",
    description: "Adidas Ultraboost running shoes with responsive cushioning.",
    categories: ["Shoes", "Adidas", "Running"],
    product_id: "UB2001",
    source: "WD",
    user_code: "adidas",
    quality: "AAA+",
    in_stock: true,
    rating: 4.9,
    review_count: 150,
    colors: ["Black", "White", "Blue"],
    sizes: ["US 7", "US 8", "US 9", "US 10", "US 11"],
    featured: true,
    date_added: new Date().toISOString(),
    brand_id: 2,
  },
  {
    name: "Puma RS-X",
    price: "39.99$",
    numeric_price: 39.99,
    image: "/placeholder.svg?height=300&width=300",
    description: "Puma RS-X with chunky design and bold colors.",
    categories: ["Shoes", "Puma", "Casual"],
    product_id: "RSX001",
    source: "WD",
    user_code: "puma",
    quality: "AA",
    in_stock: true,
    rating: 4.5,
    review_count: 80,
    colors: ["White", "Black", "Yellow"],
    sizes: ["US 7", "US 8", "US 9", "US 10", "US 11"],
    featured: false,
    date_added: new Date().toISOString(),
    brand_id: 3,
  },
  {
    name: "Under Armour HOVR",
    price: "49.99$",
    numeric_price: 49.99,
    image: "/placeholder.svg?height=300&width=300",
    description: "Under Armour HOVR running shoes with energy return technology.",
    categories: ["Shoes", "Under Armour", "Running"],
    product_id: "HOVR001",
    source: "WD",
    user_code: "underarmour",
    quality: "AAA+",
    in_stock: true,
    rating: 4.7,
    review_count: 95,
    colors: ["Black", "Gray", "Red"],
    sizes: ["US 7", "US 8", "US 9", "US 10", "US 11"],
    featured: false,
    date_added: new Date().toISOString(),
    brand_id: 4,
  },
  {
    name: "New Balance 990",
    price: "54.99$",
    numeric_price: 54.99,
    image: "/placeholder.svg?height=300&width=300",
    description: "New Balance 990 with premium materials and superior comfort.",
    categories: ["Shoes", "New Balance", "Running"],
    product_id: "NB990",
    source: "WD",
    user_code: "newbalance",
    quality: "AAA+",
    in_stock: true,
    rating: 4.8,
    review_count: 110,
    colors: ["Gray", "Navy", "Black"],
    sizes: ["US 7", "US 8", "US 9", "US 10", "US 11"],
    featured: true,
    date_added: new Date().toISOString(),
    brand_id: 5,
  },
]

// Function to seed the database with initial products
export const seedProducts = async () => {
  try {
    // Check if products already exist
    const { count, error: countError } = await supabase.from("products").select("*", { count: "exact", head: true })

    if (countError) {
      throw countError
    }

    // If products already exist, don't seed
    if (count && count > 0) {
      console.log(`Database already has ${count} products. Skipping seed.`)
      return { success: true, message: "Products already exist" }
    }

    // Get sellers to associate products with
    const { data: sellers, error: sellersError } = await supabase.from("sellers").select("id, username")

    if (sellersError) {
      throw sellersError
    }

    if (!sellers || sellers.length === 0) {
      return { success: false, error: "No sellers found. Please seed sellers first." }
    }

    // Map products to sellers
    const productsWithSellers = initialProducts.map((product) => {
      const seller = sellers.find((s) => s.username === product.user_code)
      return {
        ...product,
        seller_id: seller ? seller.id : sellers[0].id,
      }
    })

    // Insert products
    const { data, error } = await supabase.from("products").insert(productsWithSellers).select()

    if (error) {
      throw error
    }

    console.log(`Successfully seeded ${data.length} products`)

    // Create seller_products junction entries
    const junctionEntries = data.map((product) => ({
      seller_id: product.seller_id,
      product_id: product.id,
    }))

    const { error: junctionError } = await supabase.from("seller_products").insert(junctionEntries)

    if (junctionError) {
      throw junctionError
    }

    console.log(`Successfully created ${junctionEntries.length} seller_products relationships`)

    return { success: true, message: "Products seeded successfully" }
  } catch (error) {
    console.error("Error seeding products:", error)
    return { success: false, error: "Failed to seed products" }
  }
}
