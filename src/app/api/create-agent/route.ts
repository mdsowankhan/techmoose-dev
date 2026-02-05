import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Generate URL-friendly slug from name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 50) + '-' + Math.random().toString(36).substring(2, 7)
}

export async function POST(request: NextRequest) {
  try {
    const { config, userId } = await request.json()

    if (!config || !userId) {
      return NextResponse.json({ error: 'Config and userId required' }, { status: 400 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Create agent in database
    const { data: agent, error } = await supabase
      .from('agents')
      .insert({
        user_id: userId,
        name: config.agent_name || 'Untitled Agent',
        slug: generateSlug(config.agent_name || 'agent'),
        config: config,
        status: 'draft',
      })
      .select()
      .single()

    if (error) throw new Error(error.message)

    return NextResponse.json({
      success: true,
      agent: { id: agent.id, name: agent.name, status: agent.status },
    })
  } catch (error: any) {
    console.error('Error:', error)
    return NextResponse.json({ error: error.message || 'Failed to create agent' }, { status: 500 })
  }
}