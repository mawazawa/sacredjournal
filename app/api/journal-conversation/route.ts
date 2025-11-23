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

    // Get user's personality profile
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: profile } = await (supabase as any)
      .from('users')
      .select('personality_profile, full_name')
      .eq('id', user.id)
      .single()

    const personality = profile?.personality_profile
    const userName = profile?.full_name?.split(' ')[0] || 'friend'

    // Get recent entries for context (working memory)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: recentEntries } = await (supabase as any)
      .from('entries')
      .select('title, content, mood, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5)

    // Get memory items (people, goals, concerns mentioned before)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: memoryItems } = await (supabase as any)
      .from('memory_items')
      .select('name, item_type, context, sentiment')
      .eq('user_id', user.id)
      .order('last_mentioned', { ascending: false })
      .limit(20)

    // Get user's principles for context
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: principles } = await (supabase as any)
      .from('principles')
      .select('title, description, category')
      .eq('user_id', user.id)
      .order('priority', { ascending: false })
      .limit(5)

    // Build the challenging journaling partner system prompt - Sacred Journey inspired
    let systemPrompt = `You are a sacred journaling guide for ${userName}, holding space for their deep reflection and transformation. Your role is to help them connect with their inner wisdom through honest conversation.

## Your Essence
You embody the wisdom of those who guide others with love and honesty. You understand that transformation of consciousness is the basis for all transformation. You hold this space with intention—warm but direct, caring but challenging.

## Your Principles
- **Deep Listening**: You truly hear what they say, and what they don't say
- **Honest Reflection**: You don't sugarcoat or provide empty validation—growth requires truth
- **Probing Questions**: You ask questions that make them think deeper, connect to their values
- **Pattern Recognition**: You notice inconsistencies and recurring themes across their journey
- **Reciprocity**: You give honest wisdom and expect genuine reflection in return

## Your Voice
- Speak with grounded warmth, like a wise elder who has seen much
- Be direct but never harsh—truth delivered with care
- Keep responses conversational (2-3 paragraphs max)
- End most responses with a thought-provoking question
- Reference their principles and past reflections naturally

## Your Approach
- If they mention a problem, ask what they plan to do about it—action follows awareness
- If they blame others, gently ask about their role—responsibility is growth
- If they're avoiding something, name it directly but kindly—avoidance is fear
- If they achieve something, acknowledge it briefly then ask what's next—growth is continuous
- Connect current reflections to their personal constitution and stated values
- Help them see how today connects to their larger life journey`

    // Add personality-specific communication style
    if (personality) {
      systemPrompt += `\n\n## Communication Style for ${userName}`

      if (personality.openness > 0.6) {
        systemPrompt += '\n- They appreciate abstract ideas and creative perspectives'
      } else {
        systemPrompt += '\n- They prefer concrete, practical suggestions'
      }

      if (personality.conscientiousness > 0.6) {
        systemPrompt += '\n- They value structure - help them create action plans'
      }

      if (personality.extraversion < 0.4) {
        systemPrompt += '\n- They need processing time - don\'t overwhelm with rapid-fire questions'
      }

      if (personality.neuroticism > 0.6) {
        systemPrompt += '\n- Be extra grounding - acknowledge feelings but redirect to action'
      }

      if (personality.agreeableness > 0.7) {
        systemPrompt += '\n- They may avoid conflict - gently push them to assert their needs'
      }
    }

    // Add working memory context
    if (memoryItems && memoryItems.length > 0) {
      systemPrompt += `\n\n## Things ${userName} Has Mentioned Before`
      const grouped: Record<string, string[]> = {}
      memoryItems.forEach((item: { item_type: string; name: string; context: string }) => {
        if (!grouped[item.item_type]) grouped[item.item_type] = []
        grouped[item.item_type].push(`${item.name}${item.context ? ` (${item.context})` : ''}`)
      })
      Object.entries(grouped).forEach(([type, items]) => {
        systemPrompt += `\n- ${type}: ${items.join(', ')}`
      })
      systemPrompt += '\nReference these naturally when relevant to show you remember their life.'
    }

    // Add principles context
    if (principles && principles.length > 0) {
      systemPrompt += `\n\n## ${userName}'s Personal Principles`
      principles.forEach((p: { title: string; description: string }) => {
        systemPrompt += `\n- ${p.title}: ${p.description}`
      })
      systemPrompt += '\nWhen relevant, ask how their current situation aligns with these principles.'
    }

    // Add recent journal context
    if (recentEntries && recentEntries.length > 0) {
      systemPrompt += `\n\n## Recent Journal Context`
      recentEntries.slice(0, 3).forEach((entry: { title: string; mood: string; content: string }) => {
        const preview = entry.content.substring(0, 200)
        systemPrompt += `\n- "${entry.title}" ${entry.mood ? `(feeling: ${entry.mood})` : ''}: ${preview}...`
      })
    }

    // Get conversation history
    let conversationHistory: Array<{role: string, content: string}> = []
    if (conversationId) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: messages } = await (supabase as any)
        .from('messages')
        .select('role, content')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })
        .limit(20)

      if (messages) {
        conversationHistory = messages.map((m: { role: string, content: string }) => ({
          role: m.role === 'user' ? 'user' : 'model',
          content: m.content
        }))
      }
    }

    // Handle session start
    let userMessage = message
    if (message === '__START_SESSION__') {
      const hour = new Date().getHours()
      const timeOfDay = hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening'
      userMessage = `Begin a sacred journaling session. It's ${timeOfDay}. Greet me briefly with grounded warmth—acknowledge the moment, then ask an opening question to help me reflect on what's present in my heart or mind right now. Be like a wise guide creating space for honest reflection.`
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
              parts: [{ text: userMessage }]
            }
          ],
          systemInstruction: {
            parts: [{ text: systemPrompt }]
          },
          generationConfig: {
            temperature: 0.8,
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

    // Store conversation
    let finalConversationId = conversationId
    if (!finalConversationId) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: newConversation } = await (supabase as any)
        .from('conversations')
        .insert({ user_id: user.id, title: 'Voice Journal Session' })
        .select()
        .single()
      finalConversationId = newConversation?.id
    }

    if (finalConversationId && message !== '__START_SESSION__') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase as any).from('messages').insert([
        { conversation_id: finalConversationId, role: 'user', content: message },
        { conversation_id: finalConversationId, role: 'assistant', content: responseText }
      ])
    } else if (finalConversationId) {
      // Just store AI's opening message
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase as any).from('messages').insert([
        { conversation_id: finalConversationId, role: 'assistant', content: responseText }
      ])
    }

    // TODO: Extract entities from user message and update memory_items

    return NextResponse.json({
      response: responseText,
      conversationId: finalConversationId
    })
  } catch (error) {
    console.error('Journal conversation error:', error)
    return NextResponse.json({ error: 'Failed to generate response' }, { status: 500 })
  }
}
