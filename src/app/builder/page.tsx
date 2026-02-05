'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Mic, Phone, Mail, MessageSquare, Calendar, ArrowLeft, Rocket, Settings, CheckCircle } from 'lucide-react'

function BuilderContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [config, setConfig] = useState<any>(null)
  const [isDeploying, setIsDeploying] = useState(false)
  const [deployed, setDeployed] = useState(false)

  useEffect(() => {
    const configParam = searchParams.get('config')
    if (configParam) {
      try {
        setConfig(JSON.parse(decodeURIComponent(configParam)))
      } catch (e) {
        console.error('Failed to parse config')
      }
    }
  }, [searchParams])

  const handleDeploy = async () => {
    setIsDeploying(true)
    await new Promise(resolve => setTimeout(resolve, 3000))
    setDeployed(true)
    setIsDeploying(false)
  }

  if (!config) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">No agent configuration found</p>
          <button onClick={() => router.push('/')} className="text-primary-400 hover:underline">
            ← Go back and create one
          </button>
        </div>
      </div>
    )
  }

  if (deployed) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
        <div className="max-w-lg w-full text-center">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-400" />
          </div>
          <h1 className="text-3xl font-bold mb-4 text-white">Agent Deployed! 🎉</h1>
          <p className="text-gray-400 mb-8">Your voice AI &quot;{config.agent_name}&quot; is now live.</p>
          <div className="bg-gray-900 rounded-xl p-6 mb-6 text-left">
            <p className="text-gray-500 text-sm mb-2">Your Phone Number</p>
            <p className="text-2xl font-mono text-white">+1 (555) 123-4567</p>
            <p className="text-gray-500 text-xs mt-2">* Demo number</p>
          </div>
          <button onClick={() => router.push('/')} className="w-full py-3 bg-gray-800 rounded-xl font-semibold hover:bg-gray-700 text-white">
            Create Another Agent
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <header className="border-b border-gray-800 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button onClick={() => router.push('/')} className="flex items-center gap-2 text-gray-400 hover:text-white">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <div className="flex items-center gap-2">
            <Mic className="w-5 h-5 text-primary-400" />
            <span className="font-bold">TechMoose.dev</span>
          </div>
          <div className="w-16"></div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-8 text-center">Configure Your Agent</h1>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gray-900 rounded-xl p-6">
            <h2 className="font-semibold mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5 text-primary-400" /> Agent Details
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-gray-500 text-sm">Name</label>
                <input type="text" value={config.agent_name || ''} onChange={(e) => setConfig({...config, agent_name: e.target.value})} className="w-full mt-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg" />
              </div>
              <div>
                <label className="text-gray-500 text-sm">Type</label>
                <p className="capitalize">{config.agent_type}</p>
              </div>
              <div>
                <label className="text-gray-500 text-sm">Industry</label>
                <p>{config.industry}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 rounded-xl p-6">
            <h2 className="font-semibold mb-4">Integrations</h2>
            <div className="space-y-3">
              {[
                { key: 'phone', icon: Phone, label: 'Phone' },
                { key: 'email', icon: Mail, label: 'Email' },
                { key: 'whatsapp', icon: MessageSquare, label: 'WhatsApp' },
                { key: 'calendar', icon: Calendar, label: 'Calendar' },
              ].map((item) => (
                <label key={item.key} className="flex items-center gap-3">
                  <input type="checkbox" checked={config.integrations?.[item.key] || false} onChange={(e) => setConfig({...config, integrations: {...config.integrations, [item.key]: e.target.checked}})} className="w-4 h-4" />
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button onClick={handleDeploy} disabled={isDeploying} className="px-8 py-4 bg-gradient-to-r from-primary-600 to-accent-600 rounded-xl font-semibold flex items-center gap-2 mx-auto disabled:opacity-50">
            {isDeploying ? (
              <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Deploying...</>
            ) : (
              <><Rocket className="w-5 h-5" /> Deploy Agent</>
            )}
          </button>
        </div>
      </main>
    </div>
  )
}

export default function BuilderPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <BuilderContent />
    </Suspense>
  )
}