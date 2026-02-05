import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.OPENAI_API_KEY

    if (!apiKey) {
      return NextResponse.json({ success: false, error: 'OpenAI API key not configured' }, { status: 500 })
    }

    const openai = new OpenAI({ apiKey })

    const { prompt } = await request.json()

    if (!prompt) {
      return NextResponse.json({ success: false, error: 'Prompt is required' }, { status: 400 })
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are an AI configuration expert. Parse user descriptions into structured voice AI configs.

Return JSON with:
{
  "agent_name": "string",
  "agent_type": "receptionist" | "support" | "sales" | "general",
  "industry": "string",
  "description": "brief description",
  "personality": { "tone": "professional" | "friendly" | "casual", "traits": ["array"] },
  "tasks": ["array of tasks"],
  "integrations": { "phone": true, "email": true/false, "whatsapp": true/false, "calendar": true/false },
  "data_collection": [{ "field": "name", "type": "string", "required": true, "question": "How to ask" }],
  "greeting": "Hello greeting message",
  "goodbye": "Goodbye message"
}`
        },
        { role: 'user', content: prompt }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    })

    const config = JSON.parse(completion.choices[0].message.content || '{}')

    return NextResponse.json({
      success: true,
      config: { ...config, _meta: { original_prompt: prompt, generated_at: new Date().toISOString() } },
    })
  } catch (error: any) {
    console.error('OpenAI Error:', error)
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to parse prompt'
    }, { status: 500 })
  }
}
