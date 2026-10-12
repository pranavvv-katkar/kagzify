'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ShieldAlert,
  Lock,
  Mail,
  ArrowRight,
  Sparkles,
  AlertCircle,
  KeyRound,
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

export default function AdminLoginPage() {
  const { login } = useAuth()
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const res = await login(email, password)
    if (res.success) {
      if (res.role !== 'ADMIN') {
        setError('Access Denied: This administrative portal is restricted to studio operators only.')
        setLoading(false)
      } else {
        router.push('/admin')
      }
    } else {
      setError(res.error || 'Invalid administrator credentials.')
      setLoading(false)
    }
  }

  const fillAdminCredentials = () => {
    setEmail('admin@kagzify.com')
    setPassword('AdminPassword123!')
  }

  return (
    <div className="min-h-screen bg-stone-950 flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 text-stone-200">
      <div className="max-w-md w-full bg-stone-900 rounded-3xl border border-stone-800 p-8 sm:p-10 shadow-2xl space-y-6">
        
        {/* Admin Emblem */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-brand-900 border border-brand-700 text-gold-400 flex items-center justify-center mx-auto shadow-xl">
            <KeyRound className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black text-white font-display">
            Staff & Admin Portal
          </h1>
          <p className="text-xs text-stone-400">
            Internal Operations, Financials, Inventory & Production Management
          </p>
        </div>

        {/* Warning notification */}
        <div className="p-3 bg-amber-950/40 border border-amber-500/30 rounded-2xl flex items-center gap-2.5 text-xs text-amber-300">
          <ShieldAlert className="w-4 h-4 flex-shrink-0 text-amber-400" />
          <span>Restricted gateway. Public registration disabled.</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-stone-300 uppercase tracking-wider mb-1">
              Admin Email
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@kagzify.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-700 bg-stone-950 text-white text-xs sm:text-sm outline-none focus:border-gold-400"
              />
              <Mail className="w-4 h-4 text-stone-500 absolute left-3.5 top-3" />
            </div>
          </div>

          <div>
            <label className="block font-bold text-stone-300 uppercase tracking-wider mb-1">
              Master Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-700 bg-stone-950 text-white text-xs sm:text-sm outline-none focus:border-gold-400"
              />
              <Lock className="w-4 h-4 text-stone-500 absolute left-3.5 top-3" />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-xs text-rose-400 bg-rose-950/50 p-3 rounded-xl border border-rose-800">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-xl bg-gold-400 hover:bg-gold-500 text-stone-950 font-black text-xs sm:text-sm shadow-xl transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span>{loading ? 'Validating Token...' : 'Enter Operator Console'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Fast Fill */}
        <div className="pt-2 border-t border-stone-800">
          <button
            type="button"
            onClick={fillAdminCredentials}
            className="w-full py-2.5 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold flex items-center justify-center gap-2 transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            <span>Fill Seeded Master Admin Credentials</span>
          </button>
        </div>

        <div className="text-center text-xs text-stone-500 pt-2">
          <Link href="/" className="hover:text-stone-300 transition">
            &larr; Return to Public Storefront
          </Link>
        </div>

      </div>
    </div>
  )
}
