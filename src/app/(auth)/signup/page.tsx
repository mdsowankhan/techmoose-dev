'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Mic, Mail, Lock, User, ArrowRight, Loader2, CheckCircle } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

export default function SignupPage() {
  const router = useRouter()
  const { signUpWithEmail, signInWithGoogle } = useAuth()

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  })
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Validate password
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    const { error } = await signUpWithEmail(
      formData.email,
      formData.password,
      formData.fullName
    )

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSuccess(true)
    }
  }

  const handleGoogleSignup = async () => {
    setGoogleLoading(true)
    setError(null)

    const { error } = await signInWithGoogle()

    if (error) {
      setError(error.message)
      setGoogleLoading(false)
    }
    // If successful, user will be redirected to Google
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-4">Check your email!</h1>
          <p className="text-gray-400 mb-6">
            We sent a confirmation link to <span className="text-white">{formData.email}</span>.
            Click the link to activate your account.
          </p>
          <Link
            href="/login"
            className="text-primary-400 hover:text-primary-300 font-medium"
          >
            Back to login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 flex">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
              <Mic className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">TechMoose<span className="text-primary-400">.dev</span></span>
          </Link>

          <h1 className="text-3xl font-bold text-white mb-2">Create your account</h1>
          <p className="text-gray-400 mb-8">Start building voice AI agents in minutes</p>

          {/* Google Button */}
          <button
            onClick={handleGoogleSignup}
            disabled={googleLoading}
            className="w-full py-3 px-4 bg-white hover:bg-gray-100 text-gray-900 rounded-xl font-medium flex items-center justify-center gap-3 transition-colors disabled:opacity-50"
          >
            {googleLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            )}
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-gray-800"></div>
            <span className="text-gray-500 text-sm">or</span>
            <div className="flex-1 h-px bg-gray-800"></div>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Email Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="John Doe"
                  className="w-full pl-11 pr-4 py-3 bg-gray-900 border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="you@example.com"
                  required
                  className="w-full pl-11 pr-4 py-3 bg-gray-900 border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Min 6 characters"
                  required
                  minLength={6}
                  className="w-full pl-11 pr-4 py-3 bg-gray-900 border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-primary-600 to-accent-600 rounded-xl font-semibold text-white flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>Create Account <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          {/* Terms */}
          <p className="mt-6 text-center text-gray-500 text-sm">
            By signing up, you agree to our{' '}
            <a href="/terms" className="text-primary-400 hover:underline">Terms</a>
            {' '}and{' '}
            <a href="/privacy" className="text-primary-400 hover:underline">Privacy Policy</a>
          </p>

          {/* Login link */}
          <p className="mt-8 text-center text-gray-400">
            Already have an account?{' '}
            <Link href="/login" className="text-primary-400 hover:text-primary-300 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Right side - Decoration (hidden on mobile) */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary-900/20 to-accent-900/20 items-center justify-center p-12">
        <div className="max-w-md text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center mx-auto mb-8">
            <Mic className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Build Voice AI in Minutes</h2>
          <p className="text-gray-400">
            Describe what you need and get a fully working voice AI assistant with phone, email, and WhatsApp integrations.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4 text-left">
            {[
              'No coding required',
              'Real phone numbers',
              'Email automation',
              'WhatsApp ready',
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-2 text-gray-300">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
