import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export async function GET() {
  const checks = {
    timestamp: new Date().toISOString(),
    status: 'healthy' as 'healthy' | 'unhealthy',
    supabase: { connected: false, error: null as string | null },
    environment: {
      NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      OPENAI_API_KEY: !!process.env.OPENAI_API_KEY,
    },
  }

  // Test Supabase connection
  try {
    const supabase = createServerClient()

    // Try to query the users table (will return empty if no users)
    const { error } = await supabase.from('users').select('id').limit(1)

    if (error) {
      checks.supabase.error = error.message
      checks.status = 'unhealthy'
    } else {
      checks.supabase.connected = true
    }
  } catch (err: any) {
    checks.supabase.error = err.message
    checks.status = 'unhealthy'
  }

  // Check if all required env vars are present
  const allEnvPresent = Object.values(checks.environment).every(Boolean)
  if (!allEnvPresent) {
    checks.status = 'unhealthy'
  }

  return NextResponse.json(checks, {
    status: checks.status === 'healthy' ? 200 : 500,
  })
}
