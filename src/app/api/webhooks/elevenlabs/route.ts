import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const {
      agent_id: elevenlabsAgentId,
      call_duration_secs,
      transcript,
      transcript_summary,
      analysis,
    } = data

    // Find the agent
    const { data: agent } = await supabase
      .from('agents')
      .select('id')
      .eq('elevenlabs_agent_id', elevenlabsAgentId)
      .single()

    if (!agent) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 })
    }

    const callerPhone = data.caller_id || data.user_id || 'unknown'

    // Save call record
    await supabase.from('calls').insert({
      agent_id: agent.id,
      caller_phone: callerPhone,
      caller_name: analysis?.data_collection_results?.full_name?.value || null,
      caller_email: analysis?.data_collection_results?.email?.value || null,
      duration_secs: call_duration_secs || 0,
      status: 'completed',
      summary: transcript_summary || null,
      transcript: transcript || null,
      data_collected: analysis?.data_collection_results || {},
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('ElevenLabs webhook error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}