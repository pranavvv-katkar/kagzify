'use client'

import React, { useState, useEffect } from 'react'
import {
  Database,
  Cloud,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  RefreshCw,
  ExternalLink,
  X,
  Zap,
  ArrowRight,
  ShieldCheck,
  Download,
  Server,
  Layers,
} from 'lucide-react'

export default function DatabaseMergeModal({
  isOpen,
  onClose,
  onRefreshData,
}: {
  isOpen: boolean
  onClose: () => void
  onRefreshData?: () => void
}) {
  const [loading, setLoading] = useState(true)
  const [dbInfo, setDbInfo] = useState<any>(null)
  const [copied, setCopied] = useState(false)

  // Form state
  const [supabaseDbUrl, setSupabaseDbUrl] = useState('')
  const [supabaseProjectUrl, setSupabaseProjectUrl] = useState('')
  const [supabaseAnonKey, setSupabaseAnonKey] = useState('')

  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState<{ success?: boolean; message?: string } | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (isOpen) {
      loadDbInfo()
    }
  }, [isOpen])

  const loadDbInfo = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/database')
      if (res.ok) {
        const data = await res.json()
        setDbInfo(data)
        if (data.supabaseUrl) setSupabaseProjectUrl(data.supabaseUrl)
      }
    } catch (e) {
      console.error('Failed to load database info:', e)
    } finally {
      setLoading(false)
    }
  }

  const handleTestConnection = async () => {
    setTesting(true)
    setTestResult(null)
    try {
      const res = await fetch('/api/admin/database', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'test_connection',
          databaseUrl: supabaseDbUrl,
          supabaseUrl: supabaseProjectUrl,
        }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setTestResult({ success: true, message: data.message })
      } else {
        setTestResult({ success: false, message: data.error || 'Connection check failed' })
      }
    } catch (e: any) {
      setTestResult({ success: false, message: e.message || 'Network error testing connection' })
    } finally {
      setTesting(false)
    }
  }

  const handleSaveConfig = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/admin/database', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save_supabase_config',
          databaseUrl: supabaseDbUrl,
          supabaseUrl: supabaseProjectUrl,
          supabaseAnonKey,
        }),
      })
      const data = await res.json()
      if (res.ok) {
        alert('Supabase configuration saved to .env! Run "npm run supabase:sync" to push data.')
        loadDbInfo()
        if (onRefreshData) onRefreshData()
      } else {
        alert(data.error || 'Failed to save configuration')
      }
    } catch (e: any) {
      alert(e.message || 'Error saving configuration')
    } finally {
      setSaving(false)
    }
  }

  const handleCopySql = () => {
    if (dbInfo?.supabaseSqlScript) {
      navigator.clipboard.writeText(dbInfo.supabaseSqlScript)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }
  }

  const handleExportData = async () => {
    try {
      const res = await fetch('/api/admin/database', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'export_dataset' }),
      })
      if (res.ok) {
        const data = await res.json()
        const jsonBlob = new Blob([JSON.stringify(data.data, null, 2)], {
          type: 'application/json',
        })
        const url = URL.createObjectURL(jsonBlob)
        const a = document.createElement('a')
        a.href = url
        a.download = `Kagzify_Supabase_Export_${Date.now()}.json`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
      }
    } catch (e) {
      console.error('Export failed:', e)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-stone-900 border border-stone-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto text-stone-200">
        
        {/* Modal Header */}
        <div className="flex items-start justify-between pb-4 border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-950 border border-emerald-600/50 text-emerald-400 flex items-center justify-center shadow-lg">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-white font-display">
                  Merge / Connect Supabase Database
                </h2>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-900/60 text-emerald-300 border border-emerald-700">
                  PostgreSQL
                </span>
              </div>
              <p className="text-xs text-stone-400 mt-0.5">
                Permanently store all products, orders, artwork files, and customer accounts in Supabase
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Connection Status Pill */}
        {dbInfo && (
          <div className="bg-stone-950 rounded-2xl p-4 border border-stone-800 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-stone-400">Current Active Database Engine:</span>
              <div className="flex items-center gap-1.5 font-bold">
                <span
                  className={`w-2 h-2 rounded-full ${
                    dbInfo.isSupabase ? 'bg-emerald-400' : 'bg-amber-400'
                  }`}
                />
                <span className={dbInfo.isSupabase ? 'text-emerald-400' : 'text-amber-300'}>
                  {dbInfo.provider}
                </span>
              </div>
            </div>

            <div className="text-[11px] font-mono text-stone-400 bg-stone-900/80 px-3 py-2 rounded-xl border border-stone-800 truncate">
              {dbInfo.currentDbUrl}
            </div>

            {/* Quick table record counts */}
            <div className="grid grid-cols-4 gap-2 pt-2 border-t border-stone-800/80 text-[11px] text-center">
              <div className="bg-stone-900 p-2 rounded-lg">
                <span className="text-stone-400 block text-[10px]">Products</span>
                <strong className="text-white">{dbInfo.tableStats.products}</strong>
              </div>
              <div className="bg-stone-900 p-2 rounded-lg">
                <span className="text-stone-400 block text-[10px]">Orders</span>
                <strong className="text-white">{dbInfo.tableStats.orders}</strong>
              </div>
              <div className="bg-stone-900 p-2 rounded-lg">
                <span className="text-stone-400 block text-[10px]">Custom Quotes</span>
                <strong className="text-white">{dbInfo.tableStats.customRequests}</strong>
              </div>
              <div className="bg-stone-900 p-2 rounded-lg">
                <span className="text-stone-400 block text-[10px]">Customers</span>
                <strong className="text-white">{dbInfo.tableStats.users}</strong>
              </div>
            </div>
          </div>
        )}

        {/* Step 1: Connect via Supabase URL */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
            <Zap className="w-4 h-4" />
            <span>Option 1: Direct Connection String (Recommended)</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-stone-300 font-semibold mb-1">
                Supabase PostgreSQL Connection String URI *
              </label>
              <input
                type="text"
                value={supabaseDbUrl}
                onChange={(e) => setSupabaseDbUrl(e.target.value)}
                placeholder="postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true"
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-white font-mono text-xs outline-none focus:border-emerald-500"
              />
              <span className="text-[10px] text-stone-500 mt-1 block">
                Found in: Supabase Project Settings &rarr; Database &rarr; Connection string &rarr; URI
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-stone-300 font-semibold mb-1">
                  Supabase Project URL (Optional)
                </label>
                <input
                  type="text"
                  value={supabaseProjectUrl}
                  onChange={(e) => setSupabaseProjectUrl(e.target.value)}
                  placeholder="https://xyzproject.supabase.co"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-white text-xs outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-stone-300 font-semibold mb-1">
                  Supabase Anon Public API Key (Optional)
                </label>
                <input
                  type="password"
                  value={supabaseAnonKey}
                  onChange={(e) => setSupabaseAnonKey(e.target.value)}
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-white text-xs outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {testResult && (
              <div
                className={`p-3 rounded-xl border flex items-center gap-2 text-xs ${
                  testResult.success
                    ? 'bg-emerald-950/60 border-emerald-700 text-emerald-300'
                    : 'bg-rose-950/60 border-rose-700 text-rose-300'
                }`}
              >
                {testResult.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                )}
                <span>{testResult.message}</span>
              </div>
            )}

            <div className="flex flex-wrap gap-2 pt-1">
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={testing}
                className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl font-bold text-xs flex items-center gap-1.5 transition disabled:opacity-50"
              >
                <Server className="w-3.5 h-3.5" />
                <span>{testing ? 'Testing...' : 'Test Connection'}</span>
              </button>

              <button
                type="button"
                onClick={handleSaveConfig}
                disabled={saving || !supabaseDbUrl}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow transition disabled:opacity-50"
              >
                <Cloud className="w-3.5 h-3.5" />
                <span>{saving ? 'Saving...' : 'Save & Merge to Supabase'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Option 2: 1-Click Copy Supabase SQL DDL */}
        <div className="space-y-3 pt-4 border-t border-stone-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <Layers className="w-4 h-4" />
              <span>Option 2: Copy 1-Click Supabase SQL Migration Script</span>
            </span>

            <button
              onClick={handleCopySql}
              className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold rounded-lg flex items-center gap-1.5 transition"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied SQL!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy SQL Script</span>
                </>
              )}
            </button>
          </div>

          <p className="text-xs text-stone-400">
            Paste this script directly into your Supabase Dashboard &rarr; <strong>SQL Editor</strong> &rarr; Click <strong>Run</strong>. All 13 tables, relationships, and constraints will be created in under 5 seconds.
          </p>

          <pre className="bg-stone-950 border border-stone-800 rounded-xl p-3 text-[10px] font-mono text-stone-400 max-h-32 overflow-y-auto">
            {dbInfo?.supabaseSqlScript?.slice(0, 500)}...
          </pre>
        </div>

        {/* Option 3: Export Local Data */}
        <div className="pt-4 border-t border-stone-800 flex items-center justify-between">
          <div>
            <h4 className="text-xs font-bold text-white">Export Dataset for Supabase Import</h4>
            <p className="text-[11px] text-stone-400">Download current products, orders, and reviews as JSON</p>
          </div>

          <button
            onClick={handleExportData}
            className="px-3.5 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold rounded-xl flex items-center gap-1.5 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download JSON Dump</span>
          </button>
        </div>

      </div>
    </div>
  )
}
