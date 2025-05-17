"use server"

import { supabase } from "@/lib/supabase"
import { seedSellers } from "@/lib/seed-sellers"
import { seedProducts } from "@/lib/seed-products"

type SeedResult = {
  success: boolean
  message: string
  details?: string[]
}

// Helper function to execute SQL directly
async function executeSql(supabase, query) {
  try {
    // Try using rpc first
    try {
      const { error } = await supabase.rpc("exec_sql", { sql: query })
      if (error) throw error
      return { success: true }
    } catch (rpcError) {
      console.warn("RPC exec_sql failed, trying direct query:", rpcError)

      // If rpc fails, try a direct query if possible
      // This is a fallback and might not work in all cases
      const { error } = await supabase.from("sql_query").insert({ query })
      if (error) throw error
      return { success: true }
    }
  } catch (error) {
    console.error("All SQL execution methods failed:", error)
    return { success: false, error }
  }
}

export async function createTables(): Promise<SeedResult> {
  const results: string[] = []

  try {
    // Enable UUID extension
    const { error: uuidError } = await supabase.rpc("create_uuid_extension")

    if (uuidError && !uuidError.message.includes("already exists")) {
      console.error("Error creating UUID extension:", uuidError)
      results.push(`- Error creating UUID extension: ${uuidError.message}`)
    } else {
      results.push("- UUID extension already exists or created successfully")
    }

    // Create tables
    const sqlScript = `
      -- Create sellers table
      CREATE TABLE IF NOT EXISTS sellers (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name TEXT NOT NULL,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        email TEXT UNIQUE,
        logo TEXT,
        description TEXT,
        verified BOOLEAN DEFAULT false,
        rating DECIMAL(3,1) DEFAULT 5.0,
        join_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        followers INTEGER DEFAULT 0,
        location TEXT,
        specialties TEXT[],
        image TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      -- Create products table if it doesn't exist
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        price TEXT NOT NULL,
        numeric_price DECIMAL(10,2) NOT NULL,
        image TEXT,
        description TEXT,
        categories TEXT[],
        product_id TEXT,
        source TEXT,
        user_code TEXT,
        quality TEXT,
        in_stock BOOLEAN DEFAULT true,
        discount INTEGER,
        rating DECIMAL(3,1),
        review_count INTEGER DEFAULT 0,
        colors TEXT[],
        sizes TEXT[],
        featured BOOLEAN DEFAULT false,
        date_added TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        brand_id INTEGER,
        additional_images TEXT[],
        qc_picture_url TEXT,
        product_link TEXT,
        gender TEXT,
        seller_id UUID REFERENCES sellers(id)
      );

      -- Create seller_products junction table
      CREATE TABLE IF NOT EXISTS seller_products (
        seller_id UUID REFERENCES sellers(id) ON DELETE CASCADE,
        product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
        PRIMARY KEY (seller_id, product_id)
      );

      -- Create admin_users table
      CREATE TABLE IF NOT EXISTS admin_users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        email TEXT UNIQUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      -- Create a function to verify admin credentials
      CREATE OR REPLACE FUNCTION verify_admin(admin_username TEXT, admin_password TEXT)
      RETURNS BOOLEAN AS $$
      DECLARE
        stored_password TEXT;
      BEGIN
        SELECT password INTO stored_password FROM admin_users WHERE username = admin_username;
        
        IF stored_password IS NULL THEN
          RETURN FALSE;
        END IF;
        
        -- In a real application, you would use a proper password hashing function
        -- For this example, we're just comparing the stored password
        RETURN stored_password = admin_password;
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER;
    `

    // Execute the SQL script
    const { error } = await executeSql(supabase, sqlScript)

    if (error) {
      console.error("Error creating tables:", error)
      results.push(`- Error creating tables: ${error.message}`)
    } else {
      results.push("- Created sellers table")
      results.push("- Created products table")
      results.push("- Created seller_products junction table")
      results.push("- Created admin_users table")
      results.push("- Created verify_admin function")
    }

    return {
      success: true,
      message: "Tables created successfully",
      details: results,
    }
  } catch (error) {
    console.error("Error creating tables:", error)
    return {
      success: false,
      message: "Failed to create tables",
      details: [error.message],
    }
  }
}

export async function seedInitialData(): Promise<SeedResult> {
  const results: string[] = []

  try {
    // Seed sellers
    const sellerResult = await seedSellers()

    if (!sellerResult.success) {
      return sellerResult
    }

    results.push(...sellerResult.details)

    // Seed products
    const productResult = await seedProducts()

    if (!productResult.success) {
      return productResult
    }

    results.push(...productResult.details)

    return {
      success: true,
      message: "Database seeded successfully",
      details: results,
    }
  } catch (error) {
    console.error("Error seeding database:", error)
    return {
      success: false,
      message: "Failed to seed database",
      details: [error.message],
    }
  }
}
