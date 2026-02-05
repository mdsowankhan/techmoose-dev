import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { config, userId } = await request.json()

    if (!config || !userId) {
      return NextResponse.json({ error: 'Config and userId required' }, { status: 400 })
    }

    const supabase = createServerClient()

    // Create agent in database
    const { data: agent, error } = await supabase
      .from('agents')
      .insert({
        user_id: userId,
        name: config.agent_name,
        config: config,
        status: 'deploying',
      })
      .select()
      .single()

    if (error) throw new Error(error.message)

    // TODO: Provision Twilio phone number
    // TODO: Create ElevenLabs agent
    // TODO: Set up integrations

    return NextResponse.json({
      success: true,
      agent: { id: agent.id, name: agent.name, status: 'deploying' },
    })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Failed to create agent' }, { status: 500 })
  }
}
