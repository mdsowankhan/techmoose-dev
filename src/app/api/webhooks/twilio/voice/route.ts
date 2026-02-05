import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const agentId = request.nextUrl.searchParams.get('agentId')
    const from = formData.get('From') as string

    if (!agentId) {
      return new NextResponse(
        `<?xml version="1.0" encoding="UTF-8"?><Response><Say>Sorry, this number is not configured.</Say><Hangup/></Response>`,
        { headers: { 'Content-Type': 'text/xml' } }
      )
    }

    const supabase = createServerClient()
    const { data: agent } = await supabase.from('agents').select('*').eq('id', agentId).single()

    if (!agent) {
      return new NextResponse(
        `<?xml version="1.0" encoding="UTF-8"?><Response><Say>Sorry, this assistant is unavailable.</Say><Hangup/></Response>`,
        { headers: { 'Content-Type': 'text/xml' } }
      )
    }

    // Log call
    await supabase.from('calls').insert({ agent_id: agentId, caller_phone: from, status: 'completed' })

    // Connect to ElevenLabs
    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
    <Response>
      <Connect>
        <ConversationRelay url="wss://api.elevenlabs.io/v1/convai/twilio/${agent.elevenlabs_agent_id}" />
      </Connect>
    </Response>`

    return new NextResponse(twiml, { headers: { 'Content-Type': 'text/xml' } })
  } catch (error) {
    console.error('Twilio webhook error:', error)
    return new NextResponse(
      `<?xml version="1.0" encoding="UTF-8"?><Response><Say>An error occurred.</Say><Hangup/></Response>`,
      { headers: { 'Content-Type': 'text/xml' } }
    )
  }
}
