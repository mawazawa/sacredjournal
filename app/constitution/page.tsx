'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { motion, AnimatePresence } from 'framer-motion'

interface Principle {
  id: string
  title: string
  description: string
  category: 'core_value' | 'life_principle' | 'decision_rule' | 'aspiration'
  examples: string[]
  priority: number
  created_at: string
}

const categoryLabels = {
  core_value: 'Sacred Value',
  life_principle: 'Life Principle',
  decision_rule: 'Decision Wisdom',
  aspiration: 'Aspiration'
}

const categoryColors = {
  core_value: 'bg-emerald-500/20 text-emerald-300',
  life_principle: 'bg-stone-500/20 text-stone-300',
  decision_rule: 'bg-amber-500/20 text-amber-300',
  aspiration: 'bg-sky-500/20 text-sky-300'
}

export default function ConstitutionPage() {
  const router = useRouter()
  const [principles, setPrinciples] = useState<Principle[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)

  useEffect(() => {
    loadPrinciples()
  }, [])

  async function loadPrinciples() {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      router.push('/auth/signin')
      return
    }

    const { data } = await supabase
      .from('principles')
      .select('*')
      .eq('user_id', user.id)
      .order('priority', { ascending: false })

    setPrinciples((data as Principle[]) || [])
    setLoading(false)
  }

  const deletePrinciple = async (id: string) => {
    if (!confirm('Release this principle?')) return

    await supabase.from('principles').delete().eq('id', id)
    setPrinciples(prev => prev.filter(p => p.id !== id))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-950 to-stone-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 to-stone-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link href="/dashboard" className="text-white/60 hover:text-white text-sm mb-2 inline-block">
            ← Back to Dashboard
          </Link>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-white">Personal Constitution</h1>
              <p className="text-emerald-200/60 mt-2">
                Your life plan—principles that connect you to your wisdom and guide your path
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg transition-colors"
            >
              Add Principle
            </button>
          </div>
        </motion.div>

        {/* Philosophy Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-emerald-900/30 border border-emerald-800/50 rounded-xl p-6 mb-8"
        >
          <p className="text-emerald-100/80 text-sm italic">
            &quot;A vision to guide into the future must be based on your own origins,
            knowledge of your ancestors, and your unique vision of the world.&quot;
          </p>
          <p className="text-emerald-200/60 text-xs mt-2">
            — Inspired by the Yawanawá Life Plan
          </p>
        </motion.div>

        {/* Intro Section */}
        {principles.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 rounded-xl p-8 text-center mb-8"
          >
            <h2 className="text-xl font-semibold text-white mb-4">
              Begin Your Constitution
            </h2>
            <p className="text-white/60 mb-6 max-w-lg mx-auto">
              Like the wisdom traditions that guide communities through generations,
              your personal constitution becomes a living document—connecting you to
              your values and keeping you aligned with who you truly want to be.
            </p>
            <div className="grid grid-cols-2 gap-3 text-left max-w-md mx-auto mb-6">
              <div className="bg-white/5 p-3 rounded-lg">
                <p className="text-emerald-300 font-semibold text-sm">Relationship</p>
                <p className="text-white/50 text-xs">How you connect with others</p>
              </div>
              <div className="bg-white/5 p-3 rounded-lg">
                <p className="text-emerald-300 font-semibold text-sm">Responsibility</p>
                <p className="text-white/50 text-xs">What you own and honor</p>
              </div>
              <div className="bg-white/5 p-3 rounded-lg">
                <p className="text-emerald-300 font-semibold text-sm">Reciprocity</p>
                <p className="text-white/50 text-xs">How you give and receive</p>
              </div>
              <div className="bg-white/5 p-3 rounded-lg">
                <p className="text-emerald-300 font-semibold text-sm">Growth</p>
                <p className="text-white/50 text-xs">How you transform</p>
              </div>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-3 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg transition-colors"
            >
              Create Your First Principle
            </button>
          </motion.div>
        )}

        {/* Principles List */}
        <div className="space-y-4">
          <AnimatePresence>
            {principles.map((principle, index) => (
              <motion.div
                key={principle.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white/10 backdrop-blur-lg rounded-xl p-6"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-xl font-semibold text-white">{principle.title}</h3>
                    <span className={`inline-block mt-2 text-xs px-2 py-1 rounded ${categoryColors[principle.category]}`}>
                      {categoryLabels[principle.category]}
                    </span>
                  </div>
                  <button
                    onClick={() => deletePrinciple(principle.id)}
                    className="p-2 text-white/40 hover:text-red-400 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>

                <p className="text-white/80 mb-4">{principle.description}</p>

                {principle.examples && principle.examples.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <p className="text-sm text-white/60 mb-2">How this shows up:</p>
                    <ul className="space-y-1">
                      {principle.examples.map((example, i) => (
                        <li key={i} className="text-sm text-white/70 flex items-start gap-2">
                          <span className="text-emerald-400">•</span>
                          {example}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Add Principle Modal */}
      <AnimatePresence>
        {showAddModal && (
          <AddPrincipleModal
            onClose={() => setShowAddModal(false)}
            onAdd={(principle) => {
              setPrinciples(prev => [principle, ...prev])
              setShowAddModal(false)
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

interface AddPrincipleModalProps {
  onClose: () => void
  onAdd: (principle: Principle) => void
}

function AddPrincipleModal({ onClose, onAdd }: AddPrincipleModalProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<Principle['category']>('core_value')
  const [examples, setExamples] = useState([''])
  const [loading, setLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const filteredExamples = examples.filter(ex => ex.trim())

    const { data, error } = await supabase
      .from('principles')
      .insert({
        user_id: user.id,
        title,
        description,
        category,
        examples: filteredExamples,
        priority: 0
      })
      .select()
      .single()

    if (!error && data) {
      onAdd(data as Principle)
    }

    setLoading(false)
  }

  const getSuggestions = async () => {
    setShowSuggestions(true)

    // Get personality-tuned suggestions from API
    const response = await fetch('/api/principle-suggestions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category })
    })

    if (response.ok) {
      const data = await response.json()
      setSuggestions(data.suggestions)
    }
  }

  const addExample = () => {
    setExamples(prev => [...prev, ''])
  }

  const updateExample = (index: number, value: string) => {
    setExamples(prev => prev.map((ex, i) => i === index ? value : ex))
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-gradient-to-br from-emerald-900 to-stone-900 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold text-white mb-2">Add Principle</h2>
        <p className="text-emerald-200/60 text-sm mb-6">What wisdom guides your path?</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Category</label>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(categoryLabels) as Array<keyof typeof categoryLabels>).map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`p-3 rounded-lg text-sm transition-colors ${
                    category === cat
                      ? 'bg-emerald-700 text-white'
                      : 'bg-white/5 text-white/60 hover:bg-white/10'
                  }`}
                >
                  {categoryLabels[cat]}
                </button>
              ))}
            </div>
          </div>

          {/* Get suggestions button */}
          <button
            type="button"
            onClick={getSuggestions}
            className="text-sm text-emerald-400 hover:text-emerald-300"
          >
            Receive wisdom suggestions based on your nature →
          </button>

          {showSuggestions && suggestions.length > 0 && (
            <div className="bg-white/5 rounded-lg p-3">
              <p className="text-xs text-white/60 mb-2">Suggestions aligned with your personality:</p>
              <div className="space-y-1">
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setTitle(s)
                      setShowSuggestions(false)
                    }}
                    className="block w-full text-left text-sm text-white/80 hover:text-white py-1"
                  >
                    • {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-white/80 mb-1">
              Principle
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="e.g., Honor What Is Given"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-white/80 mb-1">
              What this means to you
            </label>
            <textarea
              id="description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
              placeholder="How does this principle guide your life?"
              required
            />
          </div>

          {/* Examples */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">
              How it shows up (optional)
            </label>
            {examples.map((example, index) => (
              <input
                key={index}
                type="text"
                value={example}
                onChange={e => updateExample(index, e.target.value)}
                className="w-full px-4 py-2 mb-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="A specific way you live this principle"
              />
            ))}
            <button
              type="button"
              onClick={addExample}
              className="text-sm text-white/60 hover:text-white"
            >
              + Add another example
            </button>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading || !title || !description}
              className="flex-1 py-3 bg-emerald-700 hover:bg-emerald-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Add Principle'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}
