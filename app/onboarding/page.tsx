'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { motion, AnimatePresence } from 'framer-motion'
import type { PersonalityProfile } from '@/lib/supabase/client'

const questions = [
  // Openness
  { id: 'o1', trait: 'openness', text: 'I enjoy exploring new ideas and concepts', reverse: false },
  { id: 'o2', trait: 'openness', text: 'I prefer routine over variety', reverse: true },
  { id: 'o3', trait: 'openness', text: 'I have a vivid imagination', reverse: false },
  // Conscientiousness
  { id: 'c1', trait: 'conscientiousness', text: 'I like to plan things in advance', reverse: false },
  { id: 'c2', trait: 'conscientiousness', text: 'I often leave tasks unfinished', reverse: true },
  { id: 'c3', trait: 'conscientiousness', text: 'I pay attention to details', reverse: false },
  // Extraversion
  { id: 'e1', trait: 'extraversion', text: 'I feel energized around other people', reverse: false },
  { id: 'e2', trait: 'extraversion', text: 'I prefer spending time alone', reverse: true },
  { id: 'e3', trait: 'extraversion', text: 'I am talkative in social situations', reverse: false },
  // Agreeableness
  { id: 'a1', trait: 'agreeableness', text: 'I try to help others when I can', reverse: false },
  { id: 'a2', trait: 'agreeableness', text: 'I sometimes find it hard to trust people', reverse: true },
  { id: 'a3', trait: 'agreeableness', text: 'I care about how others feel', reverse: false },
  // Neuroticism
  { id: 'n1', trait: 'neuroticism', text: 'I often feel anxious or worried', reverse: false },
  { id: 'n2', trait: 'neuroticism', text: 'I stay calm under pressure', reverse: true },
  { id: 'n3', trait: 'neuroticism', text: 'My mood changes frequently', reverse: false },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(false)

  const question = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100

  const handleAnswer = (value: number) => {
    setAnswers(prev => ({
      ...prev,
      [question.id]: value
    }))

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    } else {
      calculateAndSave()
    }
  }

  const calculateAndSave = async () => {
    setLoading(true)

    const traits = ['openness', 'conscientiousness', 'extraversion', 'agreeableness', 'neuroticism']
    const scores: Record<string, number> = {}

    traits.forEach(trait => {
      const traitQuestions = questions.filter(q => q.trait === trait)
      let total = 0

      traitQuestions.forEach(q => {
        const answer = answers[q.id] || 3
        total += q.reverse ? (6 - answer) : answer
      })

      scores[trait] = total / (traitQuestions.length * 5)
    })

    // Determine persuasion style based on traits
    let persuasion_style: 'logos' | 'pathos' | 'ethos' = 'pathos'
    if (scores.openness > 0.6 && scores.conscientiousness > 0.6) {
      persuasion_style = 'logos'
    } else if (scores.agreeableness > 0.6) {
      persuasion_style = 'pathos'
    } else {
      persuasion_style = 'ethos'
    }

    const profile: PersonalityProfile = {
      openness: scores.openness,
      conscientiousness: scores.conscientiousness,
      extraversion: scores.extraversion,
      agreeableness: scores.agreeableness,
      neuroticism: scores.neuroticism,
      persuasion_style,
      completed_at: new Date().toISOString()
    }

    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      await supabase
        .from('users')
        .update({
          personality_profile: profile,
          onboarded: true
        })
        .eq('id', user.id)
    }

    router.push('/dashboard')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-950 to-stone-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-white">Understanding your nature...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 to-stone-900 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-white mb-2">Know Thyself</h1>
          <p className="text-emerald-200/80 text-sm">Understanding your nature helps us guide you with wisdom that resonates</p>
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-emerald-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <p className="text-white/60 text-sm mt-2 text-center">
            Question {currentQuestion + 1} of {questions.length}
          </p>
        </div>

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={question.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-8"
          >
            <h2 className="text-xl font-semibold text-white text-center mb-8">
              {question.text}
            </h2>

            <div className="space-y-3">
              {[
                { value: 1, label: 'Strongly Disagree' },
                { value: 2, label: 'Disagree' },
                { value: 3, label: 'Neutral' },
                { value: 4, label: 'Agree' },
                { value: 5, label: 'Strongly Agree' },
              ].map(option => (
                <button
                  key={option.value}
                  onClick={() => handleAnswer(option.value)}
                  className="w-full py-3 px-4 bg-white/5 hover:bg-emerald-700 border border-white/10 hover:border-emerald-500 rounded-lg text-white transition-all text-left"
                >
                  {option.label}
                </button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {currentQuestion > 0 && (
          <button
            onClick={() => setCurrentQuestion(prev => prev - 1)}
            className="mt-4 text-white/60 hover:text-white transition-colors mx-auto block"
          >
            ← Previous question
          </button>
        )}
      </div>
    </div>
  )
}
