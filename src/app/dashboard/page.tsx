'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Mic, Plus, Phone, Zap, BarChart3, Settings, LogOut, Bot, Clock, PhoneCall } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import { Agent } from '@/types/database'

export default function DashboardPage() {
  const router = useRouter()
  const { user, loading: authLoading, signOut } = useAuth()
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalAgents: 0,
    activeAgents: 0,
    totalCalls: 0,
    totalMinutes: 0,
  })

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
      return
    }

    if (user) {
      loadDashboardData()
    }
  }, [user, authLoading, router])

  const loadDashboardData = async () => {
    setLoading(true)

    // Load agents
    const { data: agentsData } = await supabase
      .from('agents')
      .select('*')
      .order('created_at', { ascending: false })

    if (agentsData) {
      setAgents(agentsData)
      setStats({
        totalAgents: agentsData.length,
        activeAgents: agentsData.filter(a => a.status === 'active').length,
        totalCalls: 0, // Will be populated from calls
        totalMinutes: agentsData.reduce((sum, a) => sum + (a.minutes_used || 0), 0),
      })
    }

    // Load total calls count
    const { count } = await supabase
      .from('calls')
      .select('*', { count: 'exact', head: true })

    if (count !== null) {
      setStats(prev => ({ ...prev, totalCalls: count }))
    }

    setLoading(false)
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/login')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500'
      case 'deploying': return 'bg-yellow-500'
      case 'paused': return 'bg-gray-500'
      case 'error': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-gray-900 border-r border-gray-800 p-4 flex flex-col">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
            <Mic className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold text-white">TechMoose<span className="text-primary-400">.dev</span></span>
        </Link>

        {/* Navigation */}
        <nav className="flex-1 space-y-1">
          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-gray-800 text-white">
            <BarChart3 className="w-5 h-5" />
            Dashboard
          </Link>
          <Link href="/dashboard/agents" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/50 transition-colors">
            <Bot className="w-5 h-5" />
            Agents
          </Link>
          <Link href="/dashboard/calls" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/50 transition-colors">
            <PhoneCall className="w-5 h-5" />
            Calls
          </Link>
          <Link href="/dashboard/settings" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/50 transition-colors">
            <Settings className="w-5 h-5" />
            Settings
          </Link>
        </nav>

        {/* User section */}
        <div className="border-t border-gray-800 pt-4">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
              {user?.email?.[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.email}</p>
              <p className="text-xs text-gray-500">Free Plan</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-3 py-2 mt-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/50 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-64 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Dashboard</h1>
            <p className="text-gray-400">Welcome back! Here&apos;s your overview.</p>
          </div>
          <Link
            href="/"
            className="px-4 py-2 bg-gradient-to-r from-primary-600 to-accent-600 rounded-lg font-medium text-white flex items-center gap-2 hover:opacity-90"
          >
            <Plus className="w-4 h-4" />
            New Agent
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Agents', value: stats.totalAgents, icon: Bot, color: 'from-blue-500 to-cyan-500' },
            { label: 'Active Agents', value: stats.activeAgents, icon: Zap, color: 'from-green-500 to-emerald-500' },
            { label: 'Total Calls', value: stats.totalCalls, icon: Phone, color: 'from-purple-500 to-pink-500' },
            { label: 'Minutes Used', value: stats.totalMinutes.toFixed(1), icon: Clock, color: 'from-orange-500 to-yellow-500' },
          ].map((stat) => (
            <div key={stat.label} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
              </div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-gray-500 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Agents List */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl">
          <div className="p-6 border-b border-gray-800">
            <h2 className="text-lg font-semibold text-white">Your Agents</h2>
          </div>

          {agents.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bot className="w-8 h-8 text-gray-600" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">No agents yet</h3>
              <p className="text-gray-500 mb-6">Create your first voice AI agent to get started.</p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-600 to-accent-600 rounded-lg font-medium text-white hover:opacity-90"
              >
                <Plus className="w-4 h-4" />
                Create Agent
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-800">
              {agents.map((agent) => (
                <div key={agent.id} className="p-4 flex items-center justify-between hover:bg-gray-800/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center">
                      <Bot className="w-5 h-5 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-white">{agent.name}</h3>
                      <p className="text-sm text-gray-500">{agent.phone_number || 'No phone number'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(agent.status)}`}></div>
                      <span className="text-sm text-gray-400 capitalize">{agent.status}</span>
                    </div>
                    <Link
                      href={`/dashboard/agents/${agent.id}`}
                      className="px-3 py-1 text-sm text-primary-400 hover:text-primary-300"
                    >
                      View →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
