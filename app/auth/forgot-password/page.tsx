'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim()) setSent(true)
  }

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-16 px-4 bg-paper-50 dark:bg-stone-950 transition-colors">
      <div className="max-w-md w-full bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-8 sm:p-10 shadow-xl space-y-6 text-center">
        <h1 className="text-2xl font-black text-stone-900 dark:text-stone-100 font-display">
          Reset Your Password
        </h1>
        <p className="text-xs text-stone-500 dark:text-stone-400">
          Enter your registered email and we will send you a secure password reset link.
        </p>

        {sent ? (
          <div className="p-6 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-300 space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mx-auto" />
            <p className="font-bold">Password Reset Link Dispatched!</p>
            <p className="text-stone-600 dark:text-stone-400">
              Please check your inbox at <strong className="text-stone-900 dark:text-stone-100">{email}</strong> for instructions to reset your password.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1">
                Registered Email
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

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl bg-brand-900 hover:bg-brand-950 dark:bg-gold-500 dark:hover:bg-gold-400 text-gold-300 dark:text-stone-950 font-bold text-xs shadow-md transition"
            >
              Send Password Reset Link
            </button>
          </form>
        )}

        <div className="pt-2">
          <Link
            href="/auth/login"
            className="text-xs font-semibold text-brand-900 dark:text-gold-400 hover:text-brand-950 dark:hover:text-gold-300 flex items-center justify-center gap-1.5 hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Sign In</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
