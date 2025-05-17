import { createClient } from "@supabase/supabase-js"

// Check if we're in a browser environment
const isBrowser = typeof window !== "undefined"

// Check if we're in a server environment during build time
const isServerBuild = !isBrowser && process.env.NODE_ENV === "production" && !process.env.NEXT_PUBLIC_SUPABASE_URL

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""

// Create a complete query builder chain with all methods
const createQueryBuilder = () => {
  const queryBuilder = {
    select: (columns) => ({
      ...queryBuilder,
      limit: (n) => ({
        ...queryBuilder,
        single: () => Promise.resolve({ data: null, error: null }),
        then: (callback) => Promise.resolve({ data: [], error: null }).then(callback),
        catch: (callback) => Promise.resolve({ data: [], error: null }).catch(callback),
      }),
      order: (column, options) => ({
        ...queryBuilder,
        limit: (n) => ({
          ...queryBuilder,
          then: (callback) => Promise.resolve({ data: [], error: null }).then(callback),
          catch: (callback) => Promise.resolve({ data: [], error: null }).catch(callback),
        }),
        then: (callback) => Promise.resolve({ data: [], error: null }).then(callback),
        catch: (callback) => Promise.resolve({ data: [], error: null }).catch(callback),
      }),
      eq: (column, value) => ({
        ...queryBuilder,
        single: () => Promise.resolve({ data: null, error: null }),
        then: (callback) => Promise.resolve({ data: [], error: null }).then(callback),
        catch: (callback) => Promise.resolve({ data: [], error: null }).catch(callback),
      }),
      contains: (column, value) => ({
        ...queryBuilder,
        then: (callback) => Promise.resolve({ data: [], error: null }).then(callback),
        catch: (callback) => Promise.resolve({ data: [], error: null }).catch(callback),
      }),
      then: (callback) => Promise.resolve({ data: [], error: null }).then(callback),
      catch: (callback) => Promise.resolve({ data: [], error: null }).catch(callback),
    }),
    insert: (data) => Promise.resolve({ data: null, error: null }),
    update: (data) => Promise.resolve({ data: null, error: null }),
    delete: () => Promise.resolve({ data: null, error: null }),
    upsert: (data) => Promise.resolve({ data: null, error: null }),
    rpc: (func, params) => Promise.resolve({ data: null, error: null }),
  }
  return queryBuilder
}

// Create a mock client with stub methods for build time or when env vars are missing
const createMockClient = () => {
  console.warn("Creating mock Supabase client because environment variables are missing or during build time")

  // Create a stub implementation that logs warnings instead of throwing errors
  return {
    from: (table) => createQueryBuilder(),
    auth: {
      signIn: () => Promise.resolve({ data: null, error: null }),
      signOut: () => Promise.resolve({ data: null, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    },
    storage: {
      from: () => ({
        upload: () => Promise.resolve({ data: null, error: null }),
        getPublicUrl: () => ({ data: { publicUrl: "" } }),
      }),
    },
    rpc: (func, params) => Promise.resolve({ data: null, error: null }),
    channel: (channel) => ({
      on: () => ({ subscribe: () => ({ unsubscribe: () => {} }) }),
      subscribe: () => ({ unsubscribe: () => {} }),
    }),
    removeChannel: () => {},
  }
}

// Create a single supabase client for the entire app
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper function to get supabase client (useful for components)
export const getSupabase = () => {
  return supabase
}

// Create a server-side supabase client (for server components and API routes)
export const createServerSupabaseClient = () => {
  const serverSupabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || ""
  const serverSupabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""

  return createClient(serverSupabaseUrl, serverSupabaseKey)
}
