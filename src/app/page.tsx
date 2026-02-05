'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mic, Zap, Phone, Mail, MessageSquare, Calendar, ArrowRight, Sparkles, CheckCircle, XCircle } from 'lucide-react'

export default function HomePage() {
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleGenerate = async () => {
    if (!prompt.trim()) return
    setIsGenerating(true)
    setResult(null)
    setError(null)

    try {
      const response = await fetch('/api/parse-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      })

      const data = await response.json()

      if (data.success) {
        setResult(data.config)
        console.log('Agent Config:', data.config)
      } else {
        setError(data.error || 'Something went wrong')
      }
    } catch (err: any) {
      setError('Failed to connect to API: ' + err.message)
      console.error('Error:', err)
    } finally {
      setIsGenerating(false)
    }
  }

  const examples = [
    "A dental clinic receptionist that books appointments and sends confirmation emails",
    "A restaurant reservation bot that takes bookings and confirms via WhatsApp",
    "A real estate assistant that qualifies leads and schedules viewings",
  ]

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-gray-800/50 bg-gray-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
              <Mic className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">TechMoose<span className="text-primary-400">.dev</span></span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#features" className="text-gray-400 hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</a>
            <a href="/login" className="text-gray-400 hover:text-white transition-colors">Login</a>
            <a href="/signup" className="px-4 py-2 bg-gradient-to-r from-primary-600 to-accent-600 rounded-lg font-medium hover:opacity-90">
              Get Started
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800/50 rounded-full border border-gray-700/50 mb-8">
              <Sparkles className="w-4 h-4 text-accent-400" />
              <span className="text-sm text-gray-300">Build Voice AI in Minutes, Not Months</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Describe Your AI.<br />
              <span className="gradient-text">We Build It.</span>
            </h1>

            <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
              Just describe what you need — a receptionist, support agent, or sales bot —
              and get a fully working voice AI with phone, email, and WhatsApp in minutes.
            </p>
          </motion.div>

          {/* Prompt Input */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="relative max-w-3xl mx-auto">
            <div className="relative bg-gray-900 rounded-2xl border border-gray-700/50 p-2 glow">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your voice AI assistant... e.g., 'I need a dental clinic receptionist that books appointments and sends confirmation emails'"
                className="w-full h-32 bg-transparent text-white placeholder-gray-500 resize-none p-4 focus:outline-none text-lg"
              />
              <div className="flex items-center justify-between px-4 py-3 border-t border-gray-800">
                <div className="flex items-center gap-4 text-gray-500 text-sm">
                  <span className="flex items-center gap-1"><Phone className="w-4 h-4" /> Phone</span>
                  <span className="flex items-center gap-1"><Mail className="w-4 h-4" /> Email</span>
                  <span className="flex items-center gap-1"><MessageSquare className="w-4 h-4" /> WhatsApp</span>
                </div>
                <button
                  onClick={handleGenerate}
                  disabled={!prompt.trim() || isGenerating}
                  className="px-6 py-3 bg-gradient-to-r from-primary-600 to-accent-600 rounded-xl font-semibold flex items-center gap-2 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? (
                    <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Generating...</>
                  ) : (
                    <><Zap className="w-5 h-5" /> Generate AI</>
                  )}
                </button>
              </div>
            </div>
          </motion.div>

          {/* Result Display */}
          {error && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 max-w-3xl mx-auto">
              <div className="bg-red-900/30 border border-red-700/50 rounded-xl p-4 flex items-start gap-3">
                <XCircle className="w-5 h-5 text-red-400 mt-0.5" />
                <div className="text-left">
                  <p className="text-red-300 font-medium">Error</p>
                  <p className="text-red-400/80 text-sm">{error}</p>
                </div>
              </div>
            </motion.div>
          )}

          {result && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 max-w-3xl mx-auto">
              <div className="bg-green-900/30 border border-green-700/50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <p className="text-green-300 font-medium">AI Agent Generated!</p>
                </div>
                <div className="bg-gray-900/50 rounded-lg p-4 text-left">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Agent Name</p>
                      <p className="text-white font-medium">{result.agent_name}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Type</p>
                      <p className="text-white font-medium capitalize">{result.agent_type}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Industry</p>
                      <p className="text-white font-medium">{result.industry}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Tone</p>
                      <p className="text-white font-medium capitalize">{result.personality?.tone}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-gray-500 text-sm">Tasks</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {result.tasks?.map((task: string, i: number) => (
                        <span key={i} className="px-2 py-1 bg-gray-800 rounded text-xs text-gray-300">{task}</span>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    {result.integrations?.phone && <span className="px-2 py-1 bg-blue-900/50 text-blue-300 rounded text-xs">📞 Phone</span>}
                    {result.integrations?.email && <span className="px-2 py-1 bg-purple-900/50 text-purple-300 rounded text-xs">📧 Email</span>}
                    {result.integrations?.whatsapp && <span className="px-2 py-1 bg-green-900/50 text-green-300 rounded text-xs">💬 WhatsApp</span>}
                    {result.integrations?.calendar && <span className="px-2 py-1 bg-orange-900/50 text-orange-300 rounded text-xs">📅 Calendar</span>}
                  </div>
                </div>
                <button
                  onClick={() => {
                    const configStr = encodeURIComponent(JSON.stringify(result))
                    window.location.href = `/builder?config=${configStr}`
                  }}
                  className="mt-4 w-full py-3 bg-gradient-to-r from-primary-600 to-accent-600 rounded-xl font-semibold flex items-center justify-center gap-2 hover:opacity-90"
                >
                  Deploy This Agent <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Examples */}
          {!result && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.4 }} className="mt-8">
              <p className="text-sm text-gray-500 mb-4">Try an example:</p>
              <div className="flex flex-wrap justify-center gap-3">
                {examples.map((example, i) => (
                  <button key={i} onClick={() => setPrompt(example)} className="px-4 py-2 bg-gray-800/50 hover:bg-gray-800 text-gray-400 hover:text-white rounded-full text-sm border border-gray-700/50 max-w-xs truncate">
                    {example.length > 50 ? example.substring(0, 50) + '...' : example}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6 border-t border-gray-800/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need, Built Automatically</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Your voice AI comes with all the integrations you need — no coding, no complex setup.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Phone, title: 'Phone System', desc: 'Get a dedicated phone number instantly. Your AI answers calls 24/7.', color: 'from-blue-500 to-cyan-500' },
              { icon: Mail, title: 'Email Integration', desc: 'Automatic follow-ups, confirmations, and notifications.', color: 'from-purple-500 to-pink-500' },
              { icon: MessageSquare, title: 'WhatsApp Connected', desc: 'Send confirmations and updates on WhatsApp automatically.', color: 'from-green-500 to-emerald-500' },
              { icon: Calendar, title: 'Calendar Sync', desc: 'Appointments sync directly to Google Calendar or Outlook.', color: 'from-orange-500 to-yellow-500' },
              { icon: Zap, title: 'Instant Deploy', desc: 'From description to working AI in under 5 minutes.', color: 'from-primary-500 to-accent-500' },
              { icon: Sparkles, title: 'Smart Learning', desc: 'Your AI learns from every conversation to get better.', color: 'from-rose-500 to-red-500' },
            ].map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: i * 0.1 }} viewport={{ once: true }} className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800/50">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4`}>
                  <f.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
                <p className="text-gray-400">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 border-t border-gray-800/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Build Your Voice AI?</h2>
          <p className="text-gray-400 mb-8">Start free. No credit card required.</p>
          <a href="/signup" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-600 to-accent-600 rounded-xl font-semibold text-lg hover:opacity-90">
            Get Started Free <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-gray-800/50">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
              <Mic className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold">TechMoose.dev</span>
          </div>
          <p className="text-gray-500 text-sm">© 2026 TechMoose. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}