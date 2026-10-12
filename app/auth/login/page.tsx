'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  Lock,
  Mail,
  ArrowRight,
  Sparkles,
  AlertCircle,
  ShieldCheck,
  ShoppingBag,
  CheckCircle2,
  KeyRound,
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

export default function LoginPage() {
  const { login } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()

  const fromUrl = searchParams.get('from')
  const initialRole = searchParams.get('role') === 'admin' ? 'ADMIN' : 'CUSTOMER'

  const [activeTab, setActiveTab] = useState<'CUSTOMER' | 'ADMIN'>(initialRole)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Switch role credentials helper
  useEffect(() => {
    setError(null)
    if (activeTab === 'CUSTOMER') {
      setEmail('priya@example.com')
      setPassword('CustomerPassword123!')
    } else {
      setEmail('admin@kagzify.com')
      setPassword('AdminPassword123!')
    }
  }, [activeTab])

  const handleLogin = async (e?: React.FormEvent, directEmail?: string, directPassword?: string) => {
    if (e) e.preventDefault()
    setLoading(true)
    setError(null)

    const targetEmail = directEmail || email
    const targetPassword = directPassword || password

    const res = await login(targetEmail, targetPassword)

    if (res.success) {
      if (activeTab === 'ADMIN' && res.role !== 'ADMIN') {
        setError('Access Denied: This account does not possess administrator privileges.')
        setLoading(false)
        return
      }

      // Successful redirect logic
      if (res.role === 'ADMIN') {
        router.push(fromUrl && fromUrl.startsWith('/admin') ? fromUrl : '/admin')
      } else {
        router.push(fromUrl && !fromUrl.startsWith('/admin') ? fromUrl : '/')
      }
      router.refresh()
    } else {
      setError(res.error || 'Invalid credentials. Please verify your email and password.')
      setLoading(false)
    }
  }

  const quickLoginAs = async (role: 'CUSTOMER' | 'ADMIN') => {
    setActiveTab(role)
    const targetEmail = role === 'ADMIN' ? 'admin@kagzify.com' : 'priya@example.com'
    const targetPassword = role === 'ADMIN' ? 'AdminPassword123!' : 'CustomerPassword123!'
    setEmail(targetEmail)
    setPassword(targetPassword)
    await handleLogin(undefined, targetEmail, targetPassword)
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-paper-50 dark:bg-stone-950 transition-colors">
      <div className="max-w-md w-full bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-7 sm:p-9 shadow-2xl space-y-6">
        
        {/* Brand header */}
        <div className="text-center space-y-2">
          <div className="w-13 h-13 rounded-2xl bg-brand-900 dark:bg-gold-500 text-gold-300 dark:text-stone-950 flex items-center justify-center mx-auto shadow-lg mb-2">
            <span className="font-extrabold text-2xl font-display">K</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-100 font-display">
            Welcome to Kagzify
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
            {fromUrl
              ? 'Please sign in to access the protected Kagzify studio.'
              : 'Choose your access role to continue to the portal.'}
          </p>
        </div>

        {/* Role Selection Tabs */}
        <div className="flex p-1 bg-stone-100 dark:bg-stone-800/80 rounded-2xl border border-stone-200 dark:border-stone-700/60">
          <button
            type="button"
            onClick={() => setActiveTab('CUSTOMER')}
            className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
              activeTab === 'CUSTOMER'
                ? 'bg-white dark:bg-stone-900 text-brand-900 dark:text-gold-400 shadow-md'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Customer</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('ADMIN')}
            className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
              activeTab === 'ADMIN'
                ? 'bg-stone-900 dark:bg-gold-500 text-gold-300 dark:text-stone-950 shadow-md'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Studio Admin</span>
          </button>
        </div>

        {/* 1-Click Fast Pass Banner */}
        <div className="bg-stone-50 dark:bg-stone-800/50 p-3.5 rounded-2xl border border-stone-200/80 dark:border-stone-700/50 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-semibold text-stone-600 dark:text-stone-300">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-gold-500" />
              1-Click Developer Fast-Pass:
            </span>
            <span className="text-emerald-700 dark:text-emerald-400 font-bold">Ready</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              disabled={loading}
              onClick={() => quickLoginAs('CUSTOMER')}
              className={`py-2 px-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition ${
                activeTab === 'CUSTOMER'
                  ? 'bg-brand-50 dark:bg-gold-950/40 border-brand-200 dark:border-gold-800/60 text-brand-900 dark:text-gold-300'
                  : 'bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-brand-600 dark:text-gold-400" />
              <span>Customer Login</span>
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={() => quickLoginAs('ADMIN')}
              className={`py-2 px-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition ${
                activeTab === 'ADMIN'
                  ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-300'
                  : 'bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5 text-amber-500" />
              <span>Admin Login</span>
            </button>
          </div>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5">
              {activeTab === 'CUSTOMER' ? 'Customer Email' : 'Operator Email'}
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 text-xs sm:text-sm bg-stone-50/50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500 outline-none focus:border-brand-600 dark:focus:border-gold-400 transition"
              />
              <Mail className="w-4 h-4 text-stone-400 dark:text-stone-500 absolute left-3.5 top-3" />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
                Password
              </label>
              {activeTab === 'CUSTOMER' && (
                <Link
                  href="/auth/forgot-password"
                  className="text-xs text-brand-800 dark:text-gold-400 hover:text-brand-950 dark:hover:text-gold-300 underline"
                >
                  Forgot password?
                </Link>
              )}
            </div>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 text-xs sm:text-sm bg-stone-50/50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500 outline-none focus:border-brand-600 dark:focus:border-gold-400 transition"
              />
              <Lock className="w-4 h-4 text-stone-400 dark:text-stone-500 absolute left-3.5 top-3" />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-xs text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 p-3 rounded-xl border border-rose-200 dark:border-rose-900/60">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3.5 px-4 rounded-xl font-bold text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50 ${
              activeTab === 'ADMIN'
                ? 'bg-amber-600 hover:bg-amber-700 text-white dark:bg-gold-500 dark:hover:bg-gold-400 dark:text-stone-950'
                : 'bg-brand-900 hover:bg-brand-950 dark:bg-gold-500 dark:hover:bg-gold-400 text-gold-300 dark:text-stone-950'
            }`}
          >
            <span>
              {loading
                ? 'Authenticating...'
                : activeTab === 'ADMIN'
                ? 'Sign In to Admin Console'
                : 'Sign In to Storefront'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Footer */}
        <div className="text-center text-xs text-stone-500 dark:text-stone-400 pt-2 border-t border-stone-100 dark:border-stone-800">
          <span>Don&apos;t have an account yet? </span>
          <Link
            href="/auth/register"
            className="text-brand-900 dark:text-gold-400 font-bold hover:underline"
          >
            Create Customer Account
          </Link>
        </div>

      </div>
    </div>
  )
}
