'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { motion } from 'framer-motion'

export default function NewEntryPage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [mood, setMood] = useState('')
  const [source, setSource] = useState<'text' | 'voice'>('text')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Voice recording state
  const [isRecording, setIsRecording] = useState(false)
  const [isTranscribing, setIsTranscribing] = useState(false)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      router.push('/auth/signin')
      return
    }

    const wordCount = content.trim().split(/\s+/).filter(w => w.length > 0).length

    const { error: insertError } = await supabase
      .from('entries')
      .insert({
        user_id: user.id,
        title: title || 'Untitled Entry',
        content,
        source,
        mood: mood || null,
        word_count: wordCount
      })

    if (insertError) {
      setError(insertError.message)
      setLoading(false)
      return
    }

    router.push('/journal')
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data)
        }
      }

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' })
        stream.getTracks().forEach(track => track.stop())
        await transcribeAudio(audioBlob)
      }

      mediaRecorder.start()
      setIsRecording(true)
      setSource('voice')
    } catch (err) {
      setError('Could not access microphone. Please check permissions.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const transcribeAudio = async (audioBlob: Blob) => {
    setIsTranscribing(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('audio', audioBlob, 'recording.webm')

      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Transcription failed')
      }

      const { text } = await response.json()
      setContent(prev => prev + (prev ? '\n\n' : '') + text)
    } catch (err) {
      setError('Failed to transcribe audio. Please try again.')
    } finally {
      setIsTranscribing(false)
    }
  }

  const moods = ['😊 Happy', '😔 Sad', '😤 Frustrated', '😌 Calm', '🤔 Thoughtful', '😰 Anxious', '🙏 Grateful']

  return (
    <div className="min-h-screen bg-gradient-to-br from-sacred-purple-950 to-sacred-teal-950 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Link href="/journal" className="text-white/60 hover:text-white text-sm mb-2 inline-block">
            ← Back to Journal
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            New Entry
          </h1>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-white/80 mb-1">
              Title (optional)
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-sacred-purple-500"
              placeholder="Give your entry a title..."
            />
          </div>

          {/* Voice Recording */}
          <div className="bg-white/5 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <span className="text-white/80">Voice Recording</span>
              <button
                type="button"
                onClick={isRecording ? stopRecording : startRecording}
                disabled={isTranscribing}
                className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                  isRecording
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-sacred-purple-600 hover:bg-sacred-purple-700 text-white'
                } disabled:opacity-50`}
              >
                {isRecording ? (
                  <>
                    <span className="w-3 h-3 bg-white rounded-full animate-pulse"></span>
                    Stop Recording
                  </>
                ) : isTranscribing ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    Transcribing...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                      <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
                    </svg>
                    Record
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Content */}
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-white/80 mb-1">
              Entry Content
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => {
                setContent(e.target.value)
                if (source === 'voice' && !isRecording) setSource('text')
              }}
              rows={12}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-sacred-purple-500 resize-none"
              placeholder="What's on your mind?"
              required
            />
            <p className="text-xs text-white/40 mt-1">
              {content.trim().split(/\s+/).filter(w => w.length > 0).length} words
            </p>
          </div>

          {/* Mood */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              How are you feeling?
            </label>
            <div className="flex flex-wrap gap-2">
              {moods.map(m => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMood(mood === m ? '' : m)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    mood === m
                      ? 'bg-sacred-purple-600 text-white'
                      : 'bg-white/10 text-white/60 hover:bg-white/20'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
              {error}
            </div>
          )}

          {/* Submit */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading || !content.trim()}
              className="flex-1 py-3 bg-sacred-purple-600 hover:bg-sacred-purple-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : 'Save Entry'}
            </button>
            <Link
              href="/journal"
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
            >
              Cancel
            </Link>
          </div>
        </motion.form>
      </div>
    </div>
  )
}
