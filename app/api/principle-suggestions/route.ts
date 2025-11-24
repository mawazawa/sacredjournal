import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const geminiApiKey = process.env.GEMINI_API_KEY
  if (!geminiApiKey) {
    return NextResponse.json({ error: 'Gemini API key not configured' }, { status: 500 })
  }

  try {
    const { category } = await request.json()

    // Get user's personality profile
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: profile } = await (supabase as any)
      .from('users')
      .select('personality_profile')
      .eq('id', user.id)
      .single()

    const personality = profile?.personality_profile

    let prompt = `Generate 5 principle suggestions for someone creating their personal constitution. Category: ${category}.`

    if (personality) {
      prompt += `\n\nTheir personality profile (Big Five):
- Openness: ${(personality.openness * 100).toFixed(0)}%
- Conscientiousness: ${(personality.conscientiousness * 100).toFixed(0)}%
- Extraversion: ${(personality.extraversion * 100).toFixed(0)}%
- Agreeableness: ${(personality.agreeableness * 100).toFixed(0)}%
- Neuroticism: ${(personality.neuroticism * 100).toFixed(0)}%

Tailor the suggestions to resonate with this personality type.`
    }

    prompt += `\n\nExamples of good principles (Ray Dalio style):
- "Embrace radical truth and radical transparency"
- "Pain + Reflection = Progress"
- "Understand that people are wired very differently"

Return ONLY a JSON array of 5 short principle titles, nothing else. Example: ["Principle 1", "Principle 2", ...]`

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.9,
            maxOutputTokens: 512,
          }
        })
      }
    )

    if (!geminiResponse.ok) {
      return NextResponse.json({ error: 'Failed to get suggestions' }, { status: 500 })
    }

    const result = await geminiResponse.json()
    const responseText = result.candidates?.[0]?.content?.parts?.[0]?.text || '[]'

    // Parse JSON from response
    const jsonMatch = responseText.match(/\[[\s\S]*\]/)
    let suggestions: string[] = []
    if (jsonMatch) {
      try {
        suggestions = JSON.parse(jsonMatch[0])
      } catch {
        suggestions = ['Embrace continuous learning', 'Act with integrity always', 'Seek truth over comfort', 'Balance logic with empathy', 'Reflect before reacting']
      }
    }

    return NextResponse.json({ suggestions })
  } catch (error) {
    console.error('Principle suggestions error:', error)
    return NextResponse.json({ error: 'Failed to generate suggestions' }, { status: 500 })
  }
}
