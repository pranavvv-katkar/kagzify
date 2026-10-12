'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Lock,
  Mail,
  User,
  Phone,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

export default function RegisterPage() {
  const { register } = useAuth()
  const router = useRouter()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setLoading(true)
    setError(null)

    const res = await register(name, email, password, phone)
    if (res.success) {
      router.push('/account')
    } else {
      setError(res.error || 'Registration failed.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 bg-paper-50 dark:bg-stone-950 transition-colors">
      <div className="max-w-md w-full bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-8 sm:p-10 shadow-xl space-y-6">
        
        {/* Brand header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-brand-900 dark:bg-gold-500 text-gold-300 dark:text-stone-950 flex items-center justify-center mx-auto shadow-md">
            <span className="font-extrabold text-xl">K</span>
          </div>
          <h1 className="text-2xl font-black text-stone-900 dark:text-stone-100 font-display">
            Create Customer Account
          </h1>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Enjoy 10% off your first run, saved artwork proofs, and 1-click reorders
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1">
              Full Name *
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Priya Sharma"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 text-xs sm:text-sm bg-stone-50/50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500 outline-none focus:border-brand-600 dark:focus:border-gold-400"
              />
              <User className="w-4 h-4 text-stone-400 dark:text-stone-500 absolute left-3.5 top-3" />
            </div>
          </div>

          <div>
            <label className="block font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1">
              Email Address *
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 text-xs sm:text-sm bg-stone-50/50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500 outline-none focus:border-brand-600 dark:focus:border-gold-400"
              />
              <Mail className="w-4 h-4 text-stone-400 dark:text-stone-500 absolute left-3.5 top-3" />
            </div>
          </div>

          <div>
            <label className="block font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1">
              Phone / WhatsApp
            </label>
            <div className="relative">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 text-xs sm:text-sm bg-stone-50/50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500 outline-none focus:border-brand-600 dark:focus:border-gold-400"
              />
              <Phone className="w-4 h-4 text-stone-400 dark:text-stone-500 absolute left-3.5 top-3" />
            </div>
          </div>

          <div>
            <label className="block font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1">
              Password (min 6 characters) *
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 text-xs sm:text-sm bg-stone-50/50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500 outline-none focus:border-brand-600 dark:focus:border-gold-400"
              />
              <Lock className="w-4 h-4 text-stone-400 dark:text-stone-500 absolute left-3.5 top-3" />
            </div>
          </div>

          <div>
            <label className="block font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1">
              Confirm Password *
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 text-xs sm:text-sm bg-stone-50/50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500 outline-none focus:border-brand-600 dark:focus:border-gold-400"
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

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-brand-900 hover:bg-brand-950 dark:bg-gold-500 dark:hover:bg-gold-400 text-gold-300 dark:text-stone-950 font-bold text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{loading ? 'Creating Account...' : 'Complete Registration'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Footer Links */}
        <div className="text-center text-xs text-stone-500 dark:text-stone-400 pt-2 border-t border-stone-100 dark:border-stone-800">
          <span>Already have an account? </span>
          <Link
            href="/auth/login"
            className="text-brand-900 dark:text-gold-400 font-bold hover:underline"
          >
            Sign In here
          </Link>
        </div>

      </div>
    </div>
  )
}
