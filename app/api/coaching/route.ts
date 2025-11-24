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
    const body = await request.json()
    const { message, conversationId } = body

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    // Get user's personality profile
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: profile } = await (supabase as any)
      .from('users')
      .select('personality_profile')
      .eq('id', user.id)
      .single()

    const personality = profile?.personality_profile as {
      openness: number
      conscientiousness: number
      extraversion: number
      agreeableness: number
      neuroticism: number
      persuasion_style: 'logos' | 'pathos' | 'ethos'
    } | null

    // Build personality-aware system prompt
    let systemPrompt = `You are a compassionate and insightful AI journaling coach. Your role is to help users reflect on their experiences, emotions, and goals through thoughtful questions and supportive guidance.

Keep responses concise (2-3 paragraphs max). Be warm but not overly effusive. Ask one follow-up question to encourage deeper reflection.`

    if (personality) {
      const traits = []
      if (personality.openness > 0.6) traits.push('intellectually curious')
      if (personality.conscientiousness > 0.6) traits.push('organized and goal-oriented')
      if (personality.extraversion > 0.6) traits.push('energized by social connections')
      if (personality.agreeableness > 0.6) traits.push('empathetic and cooperative')
      if (personality.neuroticism > 0.6) traits.push('sensitive to stress and emotions')

      systemPrompt += `\n\nThis user's personality profile indicates they are ${traits.join(', ') || 'balanced across traits'}. `

      if (personality.persuasion_style === 'logos') {
        systemPrompt += 'They respond well to logical reasoning and structured approaches.'
      } else if (personality.persuasion_style === 'pathos') {
        systemPrompt += 'They respond well to emotional appeals and relational approaches.'
      } else {
        systemPrompt += 'They respond well to authoritative guidance and credible sources.'
      }
    }

    // Get conversation history if exists
    let conversationHistory: Array<{role: string, content: string}> = []
    if (conversationId) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: messages } = await (supabase as any)
        .from('messages')
        .select('role, content')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })
        .limit(10)

      if (messages) {
        conversationHistory = messages.map((m: { role: string, content: string }) => ({
          role: m.role === 'user' ? 'user' : 'model',
          content: m.content
        }))
      }
    }

    // Call Gemini API
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            ...conversationHistory.map(m => ({
              role: m.role,
              parts: [{ text: m.content }]
            })),
            {
              role: 'user',
              parts: [{ text: message }]
            }
          ],
          systemInstruction: {
            parts: [{ text: systemPrompt }]
          },
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1024,
          }
        })
      }
    )

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text()
      return NextResponse.json({ error: `Gemini API error: ${errorText}` }, { status: geminiResponse.status })
    }

    const result = await geminiResponse.json()
    const responseText = result.candidates?.[0]?.content?.parts?.[0]?.text || 'I apologize, but I could not generate a response.'

    // Store messages in conversation
    let finalConversationId = conversationId
    if (!finalConversationId) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: newConversation } = await (supabase as any)
        .from('conversations')
        .insert({ user_id: user.id })
        .select()
        .single()
      finalConversationId = newConversation?.id
    }

    if (finalConversationId) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase as any).from('messages').insert([
        { conversation_id: finalConversationId, role: 'user', content: message },
        { conversation_id: finalConversationId, role: 'assistant', content: responseText }
      ])
    }

    return NextResponse.json({
      response: responseText,
      conversationId: finalConversationId
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate response' }, { status: 500 })
  }
}
