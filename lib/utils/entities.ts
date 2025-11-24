import { createSupabaseServerClient } from '@/lib/supabase/server'

interface Entity {
  name: string
  type: 'person' | 'goal' | 'concern' | 'place' | 'activity' | 'emotion'
  context: string
  sentiment: 'positive' | 'negative' | 'neutral'
}

/**
 * Extract entities from text using pattern matching and keyword analysis
 */
export function extractEntities(text: string): Entity[] {
  const entities: Entity[] = []
  const lowerText = text.toLowerCase()

  // Person patterns - names are capitalized words in various contexts
  const personPatterns = [
    /(?:my|with|told|asked|met|saw|called|texted|emailed)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/g,
    /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)\s+(?:said|told|asked|thinks|believes|wants|called|texted|is|and)/g,
    /(?:about|and|from|to)\s+([A-Z][a-z]+)(?:\s|$|\.)/g,
    /(?:Then)\s+([A-Z][a-z]+)\s/g,
    /(?:mom|dad|mother|father|brother|sister|wife|husband|partner|boss|colleague|friend)/gi
  ]

  personPatterns.forEach(pattern => {
    // Reset lastIndex for global patterns
    pattern.lastIndex = 0
    let match
    while ((match = pattern.exec(text)) !== null) {
      const name = match[1] || match[0]
      if (name && name.length > 1 && !isCommonWord(name)) {
        entities.push({
          name: name.trim(),
          type: 'person',
          context: extractContext(text, match.index),
          sentiment: analyzeSentiment(extractContext(text, match.index))
        })
      }
    }
  })

  // Goal patterns
  const goalPatterns = [
    /(?:want to|need to|plan to|going to|trying to|hope to|aim to)\s+([^.!?]+)/gi,
    /(?:my goal|my objective|my target)\s+(?:is|:)\s*([^.!?]+)/gi
  ]

  goalPatterns.forEach(pattern => {
    let match
    while ((match = pattern.exec(text)) !== null) {
      if (match[1]) {
        entities.push({
          name: match[1].trim().substring(0, 50),
          type: 'goal',
          context: extractContext(text, match.index),
          sentiment: 'positive'
        })
      }
    }
  })

  // Concern/worry patterns
  const concernPatterns = [
    /(?:worried about|anxious about|stressed about|concerned about|afraid of)\s+([^.!?]+)/gi,
    /(?:can't stop thinking about|keeps bothering me)\s+([^.!?]+)/gi
  ]

  concernPatterns.forEach(pattern => {
    let match
    while ((match = pattern.exec(text)) !== null) {
      if (match[1]) {
        entities.push({
          name: match[1].trim().substring(0, 50),
          type: 'concern',
          context: extractContext(text, match.index),
          sentiment: 'negative'
        })
      }
    }
  })

  // Emotion patterns
  const emotionKeywords = {
    positive: ['happy', 'excited', 'grateful', 'proud', 'hopeful', 'peaceful', 'content', 'joyful', 'relieved'],
    negative: ['sad', 'angry', 'frustrated', 'anxious', 'worried', 'stressed', 'overwhelmed', 'disappointed', 'hurt'],
    neutral: ['confused', 'uncertain', 'curious', 'thoughtful', 'reflective']
  }

  Object.entries(emotionKeywords).forEach(([sentiment, keywords]) => {
    keywords.forEach(keyword => {
      if (lowerText.includes(keyword)) {
        entities.push({
          name: keyword,
          type: 'emotion',
          context: extractContext(text, lowerText.indexOf(keyword)),
          sentiment: sentiment as Entity['sentiment']
        })
      }
    })
  })

  // Activity patterns
  const activityPatterns = [
    /(?:started|began|doing|working on|practicing|learning)\s+([^.!?]+)/gi
  ]

  activityPatterns.forEach(pattern => {
    let match
    while ((match = pattern.exec(text)) !== null) {
      if (match[1]) {
        entities.push({
          name: match[1].trim().substring(0, 50),
          type: 'activity',
          context: extractContext(text, match.index),
          sentiment: 'positive'
        })
      }
    }
  })

  // Deduplicate by name
  const seen = new Set<string>()
  return entities.filter(entity => {
    const key = `${entity.type}:${entity.name.toLowerCase()}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

function extractContext(text: string, position: number): string {
  const start = Math.max(0, position - 30)
  const end = Math.min(text.length, position + 70)
  return text.substring(start, end).trim()
}

function analyzeSentiment(context: string): Entity['sentiment'] {
  const lower = context.toLowerCase()
  const positiveWords = ['good', 'great', 'happy', 'love', 'enjoy', 'excited', 'wonderful', 'amazing', 'thankful']
  const negativeWords = ['bad', 'sad', 'angry', 'hate', 'worried', 'stressed', 'frustrated', 'terrible', 'awful']

  const positiveCount = positiveWords.filter(w => lower.includes(w)).length
  const negativeCount = negativeWords.filter(w => lower.includes(w)).length

  if (positiveCount > negativeCount) return 'positive'
  if (negativeCount > positiveCount) return 'negative'
  return 'neutral'
}

function isCommonWord(word: string): boolean {
  const common = ['I', 'The', 'This', 'That', 'When', 'What', 'How', 'Why', 'Where', 'It', 'They', 'We', 'He', 'She', 'My', 'Your', 'Today', 'Tomorrow', 'Yesterday']
  return common.includes(word)
}

/**
 * Save extracted entities to memory_items table
 */
export async function saveEntitiesToMemory(userId: string, entities: Entity[]): Promise<void> {
  if (entities.length === 0) return

  const supabase = await createSupabaseServerClient()

  for (const entity of entities) {
    // Check if entity already exists
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: existing } = await (supabase as any)
      .from('memory_items')
      .select('id, mention_count')
      .eq('user_id', userId)
      .eq('name', entity.name)
      .eq('item_type', entity.type)
      .single()

    if (existing) {
      // Update existing entity
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase as any)
        .from('memory_items')
        .update({
          context: entity.context,
          sentiment: entity.sentiment,
          mention_count: (existing.mention_count || 1) + 1,
          last_mentioned: new Date().toISOString()
        })
        .eq('id', existing.id)
    } else {
      // Insert new entity
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase as any)
        .from('memory_items')
        .insert({
          user_id: userId,
          name: entity.name,
          item_type: entity.type,
          context: entity.context,
          sentiment: entity.sentiment,
          mention_count: 1,
          last_mentioned: new Date().toISOString()
        })
    }
  }
}
