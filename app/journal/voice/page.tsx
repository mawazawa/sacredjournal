'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { motion, AnimatePresence } from 'framer-motion'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export default function VoiceJournalingPage() {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([])
  const [isRecording, setIsRecording] = useState(false)
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [isThinking, setIsThinking] = useState(false)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [sessionStarted, setSessionStarted] = useState(false)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const startSession = async () => {
    setSessionStarted(true)
    setIsThinking(true)

    // Get initial greeting from AI
    try {
      const response = await fetch('/api/journal-conversation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: '__START_SESSION__',
          conversationId: null
        })
      })

      const data = await response.json()

      const aiMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date()
      }

      setMessages([aiMessage])
      setConversationId(data.conversationId)
    } catch (error) {
      console.error('Failed to start session:', error)
    } finally {
      setIsThinking(false)
    }
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
        await processVoiceInput(audioBlob)
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch (err) {
      console.error('Could not access microphone:', err)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const processVoiceInput = async (audioBlob: Blob) => {
    setIsTranscribing(true)

    try {
      // Transcribe audio
      const formData = new FormData()
      formData.append('audio', audioBlob, 'recording.webm')

      const transcribeResponse = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData
      })

      if (!transcribeResponse.ok) throw new Error('Transcription failed')

      const { text } = await transcribeResponse.json()

      // Add user message
      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: text,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, userMessage])
      setIsTranscribing(false)
      setIsThinking(true)

      // Get AI response
      const response = await fetch('/api/journal-conversation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          conversationId
        })
      })

      const data = await response.json()

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, aiMessage])
      if (data.conversationId) {
        setConversationId(data.conversationId)
      }
    } catch (error) {
      console.error('Error processing voice:', error)
    } finally {
      setIsTranscribing(false)
      setIsThinking(false)
    }
  }

  const saveAsEntry = async () => {
    if (messages.length === 0) return

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // Combine conversation into entry content
    const content = messages
      .map(m => `${m.role === 'user' ? 'Me' : 'Guide'}: ${m.content}`)
      .join('\n\n')

    const wordCount = content.split(/\s+/).filter(w => w.length > 0).length

    await supabase.from('entries').insert({
      user_id: user.id,
      title: `Sacred Reflection - ${new Date().toLocaleDateString()}`,
      content,
      source: 'voice',
      word_count: wordCount
    })

    router.push('/journal')
  }

  if (!sessionStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-950 to-stone-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-24 h-24 bg-emerald-700/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-emerald-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
              <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">Sacred Reflection</h1>
          <p className="text-emerald-200/70 mb-4">
            Close your eyes and speak from the heart.
          </p>
          <p className="text-white/60 mb-8 text-sm">
            Your guide will listen deeply, ask probing questions, and challenge you to grow—
            like a wise friend who cares enough to be honest.
          </p>
          <button
            onClick={startSession}
            className="px-8 py-4 bg-emerald-700 hover:bg-emerald-600 text-white font-medium rounded-xl transition-colors"
          >
            Enter Sacred Space
          </button>
          <Link
            href="/dashboard"
            className="block mt-4 text-white/60 hover:text-white transition-colors"
          >
            ← Back to Dashboard
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 to-stone-900 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <div className="max-w-3xl mx-auto flex justify-between items-center">
          <div>
            <Link href="/dashboard" className="text-white/60 hover:text-white text-sm">
              ← Back
            </Link>
            <h1 className="text-xl font-bold text-white mt-1">Sacred Reflection</h1>
          </div>
          {messages.length > 1 && (
            <button
              onClick={saveAsEntry}
              className="px-4 py-2 bg-amber-700 hover:bg-amber-600 text-white text-sm rounded-lg transition-colors"
            >
              Save Reflection
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-3xl mx-auto space-y-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] p-4 rounded-2xl ${
                    message.role === 'user'
                      ? 'bg-stone-700 text-white'
                      : 'bg-emerald-900/50 text-white'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {(isTranscribing || isThinking) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-emerald-900/50 p-4 rounded-2xl">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-emerald-400/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-2 h-2 bg-emerald-400/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-2 h-2 bg-emerald-400/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Recording Controls */}
      <div className="p-6 border-t border-white/10">
        <div className="max-w-3xl mx-auto flex justify-center">
          <button
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isTranscribing || isThinking}
            className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${
              isRecording
                ? 'bg-red-600 hover:bg-red-700 animate-pulse'
                : 'bg-emerald-700 hover:bg-emerald-600'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isRecording ? (
              <div className="w-6 h-6 bg-white rounded-sm"></div>
            ) : (
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
              </svg>
            )}
          </button>
        </div>
        <p className="text-center text-emerald-200/40 text-sm mt-4">
          {isRecording ? 'Tap to complete your thought' : 'Tap to speak from the heart'}
        </p>
      </div>
    </div>
  )
}
