// ============================================
// TECHMOOSE.DEV DATABASE TYPES
// Auto-generated to match Supabase schema
// ============================================

// ============================================
// ENUMS (must match SQL enums)
// ============================================

export type UserPlan = 'free' | 'starter' | 'pro' | 'business'
export type AgentStatus = 'draft' | 'deploying' | 'active' | 'paused' | 'error'
export type CallStatus = 'in_progress' | 'completed' | 'missed' | 'failed'
export type IntegrationType = 'email' | 'whatsapp' | 'calendar' | 'webhook' | 'sms'
export type IntegrationStatus = 'active' | 'inactive' | 'error'
export type UsageType = 'call_minutes' | 'sms' | 'email' | 'whatsapp'

// ============================================
// AGENT CONFIG (stored as JSONB)
// ============================================

export type AgentConfig = {
  agent_name: string
  agent_type: 'receptionist' | 'support' | 'sales' | 'general'
  industry: string
  description: string
  personality: {
    tone: 'professional' | 'friendly' | 'casual'
    traits: string[]
  }
  tasks: string[]
  integrations: {
    phone: boolean
    email: boolean
    whatsapp: boolean
    calendar: boolean
  }
  data_collection: {
    field: string
    type: 'string' | 'email' | 'phone' | 'date' | 'boolean'
    required: boolean
    question: string
  }[]
  greeting: string
  goodbye: string
  _meta?: {
    original_prompt: string
    generated_at: string
  }
}

// ============================================
// TRANSCRIPT MESSAGE (stored as JSONB array)
// ============================================

export type TranscriptMessage = {
  role: 'agent' | 'user'
  message: string
  time_in_call_secs?: number
}

// ============================================
// TABLE TYPES
// ============================================

export type User = {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  plan: UserPlan
  plan_started_at: string | null
  plan_expires_at: string | null
  stripe_customer_id: string | null
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export type Agent = {
  id: string
  user_id: string
  name: string
  slug: string
  config: AgentConfig
  status: AgentStatus
  phone_number: string | null
  twilio_phone_sid: string | null
  elevenlabs_agent_id: string | null
  elevenlabs_conversation_id: string | null
  minutes_used: number
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export type Call = {
  id: string
  agent_id: string
  twilio_call_sid: string | null
  elevenlabs_conversation_id: string | null
  caller_phone: string | null
  caller_name: string | null
  caller_email: string | null
  caller_location: string | null
  duration_secs: number
  status: CallStatus
  summary: string | null
  transcript: TranscriptMessage[] | null
  data_collected: Record<string, any>
  cost_cents: number
  created_at: string
}

export type Integration = {
  id: string
  agent_id: string
  type: IntegrationType
  provider: string | null
  config: Record<string, any>
  credentials: Record<string, any>
  status: IntegrationStatus
  last_used_at: string | null
  created_at: string
  updated_at: string
}

export type Usage = {
  id: string
  user_id: string
  agent_id: string | null
  type: UsageType
  quantity: number
  cost_cents: number
  period_start: string
  period_end: string
  created_at: string
}

export type Webhook = {
  id: string
  agent_id: string
  url: string
  events: string[]
  secret: string
  status: IntegrationStatus
  last_triggered_at: string | null
  failure_count: number
  created_at: string
  updated_at: string
}

// ============================================
// INSERT TYPES (for creating new records)
// ============================================

export type UserInsert = Omit<User, 'id' | 'created_at' | 'updated_at' | 'deleted_at'> & {
  id: string // Required - comes from auth.users
}

export type AgentInsert = Omit<Agent, 'id' | 'created_at' | 'updated_at' | 'deleted_at' | 'minutes_used'> & {
  minutes_used?: number
}

export type CallInsert = Omit<Call, 'id' | 'created_at'>

export type IntegrationInsert = Omit<Integration, 'id' | 'created_at' | 'updated_at'>

export type UsageInsert = Omit<Usage, 'id' | 'created_at'>

export type WebhookInsert = Omit<Webhook, 'id' | 'created_at' | 'updated_at' | 'secret' | 'failure_count'> & {
  secret?: string
  failure_count?: number
}

// ============================================
// UPDATE TYPES (for updating records)
// ============================================

export type UserUpdate = Partial<Omit<User, 'id' | 'created_at' | 'updated_at'>>
export type AgentUpdate = Partial<Omit<Agent, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
export type CallUpdate = Partial<Omit<Call, 'id' | 'agent_id' | 'created_at'>>
export type IntegrationUpdate = Partial<Omit<Integration, 'id' | 'agent_id' | 'created_at' | 'updated_at'>>
export type WebhookUpdate = Partial<Omit<Webhook, 'id' | 'agent_id' | 'created_at' | 'updated_at'>>

// ============================================
// SUPABASE DATABASE TYPE (for client)
// ============================================

export type Database = {
  public: {
    Tables: {
      users: {
        Row: User
        Insert: UserInsert
        Update: UserUpdate
      }
      agents: {
        Row: Agent
        Insert: AgentInsert
        Update: AgentUpdate
      }
      calls: {
        Row: Call
        Insert: CallInsert
        Update: CallUpdate
      }
      integrations: {
        Row: Integration
        Insert: IntegrationInsert
        Update: IntegrationUpdate
      }
      usage: {
        Row: Usage
        Insert: UsageInsert
        Update: Partial<Usage>
      }
      webhooks: {
        Row: Webhook
        Insert: WebhookInsert
        Update: WebhookUpdate
      }
    }
    Enums: {
      user_plan: UserPlan
      agent_status: AgentStatus
      call_status: CallStatus
      integration_type: IntegrationType
      integration_status: IntegrationStatus
      usage_type: UsageType
    }
  }
}

// ============================================
// HELPER TYPES
// ============================================

// Agent with user info
export type AgentWithUser = Agent & {
  user: Pick<User, 'id' | 'email' | 'full_name'>
}

// Call with agent info
export type CallWithAgent = Call & {
  agent: Pick<Agent, 'id' | 'name' | 'phone_number'>
}

// Dashboard stats
export type DashboardStats = {
  total_agents: number
  active_agents: number
  total_calls: number
  total_minutes: number
  calls_this_week: number
}
