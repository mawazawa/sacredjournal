'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { motion } from 'framer-motion'
import type { Database } from '@/lib/supabase/client'

type Entry = Database['public']['Tables']['entries']['Row']

export default function JournalPage() {
  const router = useRouter()
  const [entries, setEntries] = useState<Entry[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [sourceFilter, setSourceFilter] = useState<string>('all')

  useEffect(() => {
    loadEntries()
  }, [])

  async function loadEntries() {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      router.push('/auth/signin')
      return
    }

    const { data } = await supabase
      .from('entries')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    setEntries(data || [])
    setLoading(false)
  }

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = searchQuery === '' ||
      entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.content.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesSource = sourceFilter === 'all' || entry.source === sourceFilter

    return matchesSearch && matchesSource
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-950 to-stone-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 to-stone-950 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-6"
        >
          <div>
            <Link href="/dashboard" className="text-white/60 hover:text-white text-sm mb-2 inline-block">
              ← Back to Dashboard
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              Your Journal
            </h1>
          </div>
          <Link
            href="/journal/new"
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
          >
            New Entry
          </Link>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 space-y-4"
        >
          <input
            type="text"
            placeholder="Search entries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />

          <div className="flex gap-2 flex-wrap">
            {['all', 'text', 'voice', 'email', 'image'].map(source => (
              <button
                key={source}
                onClick={() => setSourceFilter(source)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  sourceFilter === source
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white/10 text-white/60 hover:bg-white/20'
                }`}
              >
                {source === 'all' ? 'All' : source.charAt(0).toUpperCase() + source.slice(1)}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Entries List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {filteredEntries.length === 0 ? (
            <div className="bg-white/5 rounded-xl p-8 text-center">
              <p className="text-white/60">
                {entries.length === 0
                  ? 'No entries yet. Start journaling!'
                  : 'No entries match your search.'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredEntries.map((entry, index) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    href={`/journal/${entry.id}`}
                    className="block bg-white/5 hover:bg-white/10 rounded-xl p-4 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-medium text-white">{entry.title}</h3>
                        <p className="text-sm text-white/60 mt-1 line-clamp-2">
                          {entry.content.substring(0, 200)}
                        </p>
                      </div>
                      <span className="text-xs text-white/40 whitespace-nowrap ml-4">
                        {formatDate(entry.created_at)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      <span className={`text-xs px-2 py-1 rounded ${getSourceBadgeColor(entry.source)}`}>
                        {entry.source}
                      </span>
                      {entry.mood && (
                        <span className="text-xs text-white/40">{entry.mood}</span>
                      )}
                      <span className="text-xs text-white/40">
                        {entry.word_count} words
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
  })
}

function getSourceBadgeColor(source: string): string {
  switch (source) {
    case 'voice': return 'bg-emerald-500/20 text-emerald-300'
    case 'text': return 'bg-stone-500/20 text-stone-300'
    case 'email': return 'bg-blue-500/20 text-blue-300'
    case 'image': return 'bg-yellow-500/20 text-yellow-300'
    default: return 'bg-white/10 text-white/60'
  }
}
