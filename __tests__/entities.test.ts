import { extractEntities } from '@/lib/utils/entities'

describe('extractEntities', () => {
  describe('Bug 1: Family relation patterns should extract the relation, not possessive', () => {
    it('should extract "mom" when user mentions "my mom"', () => {
      const text = 'I talked to my mom today about the situation.'
      const entities = extractEntities(text)

      const personEntities = entities.filter(e => e.type === 'person')
      expect(personEntities.length).toBeGreaterThan(0)
      expect(personEntities.some(e => e.name.toLowerCase() === 'mom')).toBe(true)
    })

    it('should extract "dad" when user mentions "my dad"', () => {
      const text = 'My dad gave me some advice yesterday.'
      const entities = extractEntities(text)

      const personEntities = entities.filter(e => e.type === 'person')
      expect(personEntities.some(e => e.name.toLowerCase() === 'dad')).toBe(true)
    })

    it('should extract "partner" when mentioned', () => {
      const text = 'My partner and I had a difficult conversation.'
      const entities = extractEntities(text)

      const personEntities = entities.filter(e => e.type === 'person')
      expect(personEntities.some(e => e.name.toLowerCase() === 'partner')).toBe(true)
    })
  })

  describe('Person extraction', () => {
    it('should extract named people', () => {
      const text = 'I met with Sarah yesterday and she told me about John.'
      const entities = extractEntities(text)

      const names = entities.filter(e => e.type === 'person').map(e => e.name)
      expect(names).toContain('Sarah')
      expect(names).toContain('John')
    })
  })

  describe('Goal extraction', () => {
    it('should extract goals from "want to" patterns', () => {
      const text = 'I want to start exercising more regularly.'
      const entities = extractEntities(text)

      const goals = entities.filter(e => e.type === 'goal')
      expect(goals.length).toBeGreaterThan(0)
      expect(goals[0].name).toContain('exercising')
    })
  })

  describe('Concern extraction', () => {
    it('should extract concerns from worry patterns', () => {
      const text = 'I am worried about the upcoming deadline.'
      const entities = extractEntities(text)

      const concerns = entities.filter(e => e.type === 'concern')
      expect(concerns.length).toBeGreaterThan(0)
      expect(concerns[0].sentiment).toBe('negative')
    })
  })

  describe('Emotion extraction', () => {
    it('should extract positive emotions', () => {
      const text = 'I feel really happy and grateful today.'
      const entities = extractEntities(text)

      const emotions = entities.filter(e => e.type === 'emotion')
      expect(emotions.some(e => e.name === 'happy')).toBe(true)
      expect(emotions.some(e => e.name === 'grateful')).toBe(true)
    })

    it('should extract negative emotions', () => {
      const text = 'I am feeling stressed and overwhelmed.'
      const entities = extractEntities(text)

      const emotions = entities.filter(e => e.type === 'emotion')
      expect(emotions.some(e => e.name === 'stressed')).toBe(true)
      expect(emotions.some(e => e.name === 'overwhelmed')).toBe(true)
    })
  })

  describe('Deduplication', () => {
    it('should not duplicate entities mentioned multiple times', () => {
      const text = 'Sarah called me. Then Sarah texted. Sarah is so thoughtful.'
      const entities = extractEntities(text)

      const sarahEntities = entities.filter(e => e.name === 'Sarah')
      expect(sarahEntities.length).toBe(1)
    })
  })

  describe('Context extraction', () => {
    it('should extract context around entity', () => {
      const text = 'I was feeling very happy today because of the good news.'
      const entities = extractEntities(text)

      const happyEntity = entities.find(e => e.name === 'happy')
      expect(happyEntity).toBeDefined()
      expect(happyEntity?.context).toContain('happy')
    })
  })

  describe('Sentiment analysis', () => {
    it('should detect positive sentiment from context', () => {
      const text = 'I met with Sarah and it was wonderful and amazing.'
      const entities = extractEntities(text)

      const sarahEntity = entities.find(e => e.name === 'Sarah')
      expect(sarahEntity?.sentiment).toBe('positive')
    })

    it('should detect negative sentiment from context', () => {
      const text = 'I talked to my mom about the terrible situation.'
      const entities = extractEntities(text)

      const momEntity = entities.find(e => e.name.toLowerCase() === 'mom')
      expect(momEntity?.sentiment).toBe('negative')
    })

    it('should default to neutral sentiment', () => {
      const text = 'I talked to Sarah yesterday.'
      const entities = extractEntities(text)

      const sarahEntity = entities.find(e => e.name === 'Sarah')
      expect(sarahEntity?.sentiment).toBe('neutral')
    })
  })

  describe('Activity extraction', () => {
    it('should extract activities from started patterns', () => {
      const text = 'I started learning Spanish last week.'
      const entities = extractEntities(text)

      const activities = entities.filter(e => e.type === 'activity')
      expect(activities.length).toBeGreaterThan(0)
      expect(activities[0].name).toContain('learning')
    })

    it('should extract activities from working on patterns', () => {
      const text = 'I am working on a new project.'
      const entities = extractEntities(text)

      const activities = entities.filter(e => e.type === 'activity')
      expect(activities.length).toBeGreaterThan(0)
    })
  })

  describe('Common word filtering', () => {
    it('should filter out common words like "The"', () => {
      const text = 'The meeting went well.'
      const entities = extractEntities(text)

      const theEntities = entities.filter(e => e.name === 'The')
      expect(theEntities.length).toBe(0)
    })

    it('should filter out "I", "It", "This", etc.', () => {
      const text = 'I think This is important. It matters to What we do.'
      const entities = extractEntities(text)

      const commonEntities = entities.filter(e =>
        ['I', 'It', 'This', 'What'].includes(e.name)
      )
      expect(commonEntities.length).toBe(0)
    })
  })

  describe('Edge cases', () => {
    it('should handle empty text', () => {
      const entities = extractEntities('')
      expect(entities).toEqual([])
    })

    it('should handle text with no entities', () => {
      const text = 'just some random text without any patterns'
      const entities = extractEntities(text)

      // May still extract emotions or other simple patterns
      expect(Array.isArray(entities)).toBe(true)
    })

    it('should handle very long text', () => {
      const text = 'Sarah '.repeat(100) + 'told me about John.'
      const entities = extractEntities(text)

      // Should still extract entities without crashing
      expect(entities.length).toBeGreaterThan(0)
    })

    it('should handle special characters', () => {
      const text = 'I met with Sarah! She\'s so kind... Really? Yes!'
      const entities = extractEntities(text)

      expect(entities.length).toBeGreaterThan(0)
    })
  })

  describe('Goal patterns', () => {
    it('should extract goals from "my goal is" patterns', () => {
      const text = 'My goal is to improve my health.'
      const entities = extractEntities(text)

      const goals = entities.filter(e => e.type === 'goal')
      expect(goals.length).toBeGreaterThan(0)
    })

    it('should extract goals from "need to" patterns', () => {
      const text = 'I need to finish the report by Friday.'
      const entities = extractEntities(text)

      const goals = entities.filter(e => e.type === 'goal')
      expect(goals.length).toBeGreaterThan(0)
    })
  })
})
