import {
  createClient,
  type PostgrestSingleResponse,
  type SupabaseClient,
} from '@supabase/supabase-js'

import type { Database } from './database.types'

/*
 * Server-only Supabase client for public reads (D-043). It uses the publishable key, so
 * Row Level Security applies: published content and reference data only. The secret key
 * is for the seed and upload scripts, never for page rendering. Never import this from a
 * Client Component.
 */

export type Db = SupabaseClient<Database>

export function createSupabaseClient(
  url = process.env.SUPABASE_URL,
  key = process.env.SUPABASE_PUBLISHABLE_KEY,
): Db {
  if (!url || !key) {
    throw new Error(
      'SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY must be set. See .env.example and README.md.',
    )
  }
  return createClient<Database>(url, key, {
    // No user sessions: the site has no accounts (PRD non-goals).
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  })
}

// One client per server process.
const globalForSupabase = globalThis as unknown as { supabase?: Db }

export function getSupabase(): Db {
  globalForSupabase.supabase ??= createSupabaseClient()
  return globalForSupabase.supabase
}

/**
 * Returns the data of a Supabase response, or throws its error. supabase-js reports
 * errors in the result rather than throwing; throwing keeps the previous behaviour, where
 * a failed read reaches the route's error boundary instead of rendering empty content.
 */
export function unwrap<T>(result: PostgrestSingleResponse<T>): T {
  if (result.error) throw new Error(`Database read failed: ${result.error.message}`)
  return result.data
}
