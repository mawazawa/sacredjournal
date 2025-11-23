'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { motion } from 'framer-motion'
import type { Database } from '@/lib/supabase/client'
import { getDisplayName } from '@/lib/utils/user'

type Entry = Database['public']['Tables']['entries']['Row']
type User = Database['public']['Tables']['users']['Row']

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [entries, setEntries] = useState<Entry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      const { data: { user: authUser } } = await supabase.auth.getUser()

      if (!authUser) {
        router.push('/auth/signin')
        return
      }

      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single()

      if (profile && !profile.onboarded) {
        router.push('/onboarding')
        return
      }

      setUser(profile)

      const { data: entriesData } = await supabase
        .from('entries')
        .select('*')
        .eq('user_id', authUser.id)
        .order('created_at', { ascending: false })
        .limit(5)

      setEntries(entriesData || [])
      setLoading(false)
    }

    loadData()
  }, [router])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sacred-purple-950 to-sacred-teal-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sacred-purple-500"></div>
      </div>
    )
  }

  const greeting = getGreeting()

  return (
    <div className="min-h-screen bg-gradient-to-br from-sacred-purple-950 to-sacred-teal-950 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              {greeting}, {getDisplayName(user)}
            </h1>
            <p className="text-white/60 mt-1">Ready to journal?</p>
          </div>
          <button
            onClick={handleSignOut}
            className="text-white/60 hover:text-white transition-colors"
          >
            Sign out
          </button>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          <Link
            href="/journal/new"
            className="bg-sacred-purple-600 hover:bg-sacred-purple-700 text-white p-6 rounded-xl transition-colors flex items-center gap-4"
          >
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold">New Entry</h3>
              <p className="text-sm text-white/70">Write or record</p>
            </div>
          </Link>

          <Link
            href="/coaching"
            className="bg-sacred-teal-600 hover:bg-sacred-teal-700 text-white p-6 rounded-xl transition-colors flex items-center gap-4"
          >
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold">AI Coach</h3>
              <p className="text-sm text-white/70">Get guidance</p>
            </div>
          </Link>

          <Link
            href="/journal"
            className="bg-white/10 hover:bg-white/20 text-white p-6 rounded-xl transition-colors flex items-center gap-4"
          >
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold">All Entries</h3>
              <p className="text-sm text-white/70">View history</p>
            </div>
          </Link>
        </motion.div>

        {/* Recent Entries */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-xl font-semibold text-white mb-4">Recent Entries</h2>
          {entries.length === 0 ? (
            <div className="bg-white/5 rounded-xl p-8 text-center">
              <p className="text-white/60">No entries yet. Start journaling!</p>
              <Link
                href="/journal/new"
                className="inline-block mt-4 px-6 py-2 bg-sacred-purple-600 hover:bg-sacred-purple-700 text-white rounded-lg transition-colors"
              >
                Create your first entry
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {entries.map((entry) => (
                <Link
                  key={entry.id}
                  href={`/journal/${entry.id}`}
                  className="block bg-white/5 hover:bg-white/10 rounded-xl p-4 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-white">{entry.title}</h3>
                      <p className="text-sm text-white/60 mt-1 line-clamp-2">
                        {entry.content.substring(0, 150)}...
                      </p>
                    </div>
                    <span className="text-xs text-white/40 whitespace-nowrap ml-4">
                      {formatDate(entry.created_at)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`text-xs px-2 py-1 rounded ${getSourceBadgeColor(entry.source)}`}>
                      {entry.source}
                    </span>
                    {entry.mood && (
                      <span className="text-xs text-white/40">{entry.mood}</span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`

  return date.toLocaleDateString()
}

function getSourceBadgeColor(source: string): string {
  switch (source) {
    case 'voice': return 'bg-sacred-purple-500/20 text-sacred-purple-300'
    case 'text': return 'bg-sacred-teal-500/20 text-sacred-teal-300'
    case 'email': return 'bg-blue-500/20 text-blue-300'
    case 'image': return 'bg-yellow-500/20 text-yellow-300'
    default: return 'bg-white/10 text-white/60'
  }
}
