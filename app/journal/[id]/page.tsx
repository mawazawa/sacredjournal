'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { motion } from 'framer-motion'
import type { Database } from '@/lib/supabase/client'

type Entry = Database['public']['Tables']['entries']['Row']

export default function EntryDetailPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [entry, setEntry] = useState<Entry | null>(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState('')
  const [editContent, setEditContent] = useState('')
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  useEffect(() => {
    loadEntry()
  }, [id])

  async function loadEntry() {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      router.push('/auth/signin')
      return
    }

    const { data } = await supabase
      .from('entries')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (!data) {
      router.push('/journal')
      return
    }

    setEntry(data)
    setEditTitle(data.title)
    setEditContent(data.content)
    setLoading(false)
  }

  const handleSave = async () => {
    if (!entry) return
    setSaving(true)
    setSaveError(null)

    const wordCount = editContent.trim().split(/\s+/).filter(w => w.length > 0).length

    const { error } = await supabase
      .from('entries')
      .update({
        title: editTitle,
        content: editContent,
        word_count: wordCount
      })
      .eq('id', entry.id)

    if (error) {
      setSaveError(error.message)
    } else {
      setEntry({ ...entry, title: editTitle, content: editContent, word_count: wordCount })
      setIsEditing(false)
    }
    setSaving(false)
  }

  const handleDelete = async () => {
    if (!entry || !confirm('Are you sure you want to delete this entry?')) return
    setDeleting(true)

    const { error } = await supabase
      .from('entries')
      .delete()
      .eq('id', entry.id)

    if (!error) {
      router.push('/journal')
    }
    setDeleting(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-950 to-stone-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    )
  }

  if (!entry) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 to-stone-950 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Link href="/journal" className="text-white/60 hover:text-white text-sm mb-2 inline-block">
            ← Back to Journal
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 md:p-8"
        >
          {isEditing ? (
            <div className="space-y-4">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-xl font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                rows={15}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
              />
              {saveError && (
                <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
                  {saveError}
                </div>
              )}
              <div className="flex gap-3">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  onClick={() => {
                    setEditTitle(entry.title)
                    setEditContent(entry.content)
                    setIsEditing(false)
                  }}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-2xl font-bold text-white">{entry.title}</h1>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3 mb-6 text-sm text-white/60">
                <span>{formatDate(entry.created_at)}</span>
                <span>•</span>
                <span className={`px-2 py-0.5 rounded ${getSourceBadgeColor(entry.source)}`}>
                  {entry.source}
                </span>
                {entry.mood && (
                  <>
                    <span>•</span>
                    <span>{entry.mood}</span>
                  </>
                )}
                <span>•</span>
                <span>{entry.word_count} words</span>
              </div>

              <div className="prose prose-invert max-w-none">
                <p className="text-white/90 whitespace-pre-wrap leading-relaxed">
                  {entry.content}
                </p>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  )
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
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
