import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const supabase = createServerClient()

    const { agent_id, user_id: callerPhone, transcript, analysis, metadata } = data

    // Find agent
    const { data: agent } = await supabase
      .from('agents')
      .select('id')
      .eq('elevenlabs_agent_id', agent_id)
      .single()

    if (!agent) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 })
    }

    // Update call record
    await supabase.from('calls').insert({
      agent_id: agent.id,
      caller_phone: callerPhone || 'unknown',
      caller_name: analysis?.data_collection_results?.full_name?.value || null,
      duration_secs: metadata?.call_duration_secs || 0,
      status: 'completed',
      summary: analysis?.transcript_summary || null,
      transcript: transcript || null,
      data_collected: analysis?.data_collection_results || {},
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('ElevenLabs webhook error:', error)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
