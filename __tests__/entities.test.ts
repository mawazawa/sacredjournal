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
})
