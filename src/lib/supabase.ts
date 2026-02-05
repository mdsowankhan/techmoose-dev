import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'

// ============================================
// ENVIRONMENT VALIDATION
// ============================================

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Validate environment variables exist
if (!supabaseUrl) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable')
}
if (!supabaseAnonKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable')
}

// ============================================
// BROWSER CLIENT (uses anon key, respects RLS)
// ============================================
// Use this in client components and for user-authenticated requests

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
})

// ============================================
// SERVER CLIENT (uses service role, bypasses RLS)
// ============================================
// Use this ONLY in:
// - API routes that handle webhooks (Twilio, ElevenLabs)
// - Server actions that need to bypass RLS
// - Background jobs

export function createServerClient() {
  if (!supabaseServiceRoleKey) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable')
  }

  return createClient<Database>(supabaseUrl!, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

// ============================================
// HELPER: Get authenticated user from server
// ============================================
// Use this in API routes to get the current user

export async function getAuthenticatedUser() {
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    return null
  }

  return user
}

// ============================================
// HELPER: Check if user owns a resource
// ============================================

export async function userOwnsAgent(userId: string, agentId: string): Promise<boolean> {
  const { data } = await supabase
    .from('agents')
    .select('id')
    .eq('id', agentId)
    .eq('user_id', userId)
    .single()

  return !!data
}
