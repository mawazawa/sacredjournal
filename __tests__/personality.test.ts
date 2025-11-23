import { calculatePersonalityScores, questions } from '@/lib/utils/personality'

describe('calculatePersonalityScores', () => {
  describe('questions configuration', () => {
    it('should have 15 questions total', () => {
      expect(questions.length).toBe(15)
    })

    it('should have 3 questions per trait', () => {
      const traits = ['openness', 'conscientiousness', 'extraversion', 'agreeableness', 'neuroticism']
      traits.forEach(trait => {
        const traitQuestions = questions.filter(q => q.trait === trait)
        expect(traitQuestions.length).toBe(3)
      })
    })

    it('should have unique question IDs', () => {
      const ids = questions.map(q => q.id)
      const uniqueIds = new Set(ids)
      expect(uniqueIds.size).toBe(questions.length)
    })

    it('should have at least one reversed question per trait', () => {
      const traits = ['openness', 'conscientiousness', 'extraversion', 'agreeableness', 'neuroticism']
      traits.forEach(trait => {
        const reversedQuestions = questions.filter(q => q.trait === trait && q.reverse)
        expect(reversedQuestions.length).toBeGreaterThan(0)
      })
    })
  })

  describe('score calculation', () => {
    it('should calculate all trait scores', () => {
      const answers: Record<string, number> = {
        o1: 4, o2: 2, o3: 5,
        c1: 3, c2: 3, c3: 3,
        e1: 4, e2: 2, e3: 4,
        a1: 5, a2: 1, a3: 5,
        n1: 2, n2: 4, n3: 2
      }

      const result = calculatePersonalityScores(answers)

      expect(result.openness).toBeDefined()
      expect(result.conscientiousness).toBeDefined()
      expect(result.extraversion).toBeDefined()
      expect(result.agreeableness).toBeDefined()
      expect(result.neuroticism).toBeDefined()
    })

    it('should normalize scores between 0 and 1', () => {
      const answers: Record<string, number> = {
        o1: 5, o2: 1, o3: 5,
        c1: 5, c2: 1, c3: 5,
        e1: 5, e2: 1, e3: 5,
        a1: 5, a2: 1, a3: 5,
        n1: 5, n2: 1, n3: 5
      }

      const result = calculatePersonalityScores(answers)

      expect(result.openness).toBeGreaterThanOrEqual(0)
      expect(result.openness).toBeLessThanOrEqual(1)
      expect(result.conscientiousness).toBeGreaterThanOrEqual(0)
      expect(result.conscientiousness).toBeLessThanOrEqual(1)
    })

    it('should handle all 5s as maximum score', () => {
      const answers: Record<string, number> = {
        o1: 5, o2: 1, o3: 5, // o2 is reversed, so 1 becomes 5
        c1: 5, c2: 1, c3: 5,
        e1: 5, e2: 1, e3: 5,
        a1: 5, a2: 1, a3: 5,
        n1: 5, n2: 1, n3: 5
      }

      const result = calculatePersonalityScores(answers)
      expect(result.openness).toBe(1)
    })

    it('should handle all 1s as minimum score', () => {
      const answers: Record<string, number> = {
        o1: 1, o2: 5, o3: 1, // o2 is reversed, so 5 becomes 1
        c1: 1, c2: 5, c3: 1,
        e1: 1, e2: 5, e3: 1,
        a1: 1, a2: 5, a3: 1,
        n1: 1, n2: 5, n3: 1
      }

      const result = calculatePersonalityScores(answers)
      expect(result.openness).toBe(0.2) // 3/15
    })

    it('should default missing answers to 3 (neutral)', () => {
      const answers: Record<string, number> = {}
      const result = calculatePersonalityScores(answers)

      // All neutral answers should give middle scores
      expect(result.openness).toBeCloseTo(0.6, 1) // (3 + 3 + 3) / 15 = 0.6
    })
  })

  describe('reverse scoring', () => {
    it('should reverse scores for reverse questions', () => {
      // o2 is "I prefer routine over variety" - reverse scored
      const highOpenness: Record<string, number> = {
        o1: 5, o2: 1, o3: 5, // 1 on reverse = 5
        c1: 3, c2: 3, c3: 3,
        e1: 3, e2: 3, e3: 3,
        a1: 3, a2: 3, a3: 3,
        n1: 3, n2: 3, n3: 3
      }

      const lowOpenness: Record<string, number> = {
        o1: 1, o2: 5, o3: 1, // 5 on reverse = 1
        c1: 3, c2: 3, c3: 3,
        e1: 3, e2: 3, e3: 3,
        a1: 3, a2: 3, a3: 3,
        n1: 3, n2: 3, n3: 3
      }

      const highResult = calculatePersonalityScores(highOpenness)
      const lowResult = calculatePersonalityScores(lowOpenness)

      expect(highResult.openness).toBeGreaterThan(lowResult.openness)
    })
  })

  describe('persuasion style determination', () => {
    it('should return logos for high openness and conscientiousness', () => {
      const answers: Record<string, number> = {
        o1: 5, o2: 1, o3: 5, // High openness
        c1: 5, c2: 1, c3: 5, // High conscientiousness
        e1: 3, e2: 3, e3: 3,
        a1: 2, a2: 4, a3: 2, // Low agreeableness
        n1: 3, n2: 3, n3: 3
      }

      const result = calculatePersonalityScores(answers)
      expect(result.persuasion_style).toBe('logos')
    })

    it('should return pathos for high agreeableness', () => {
      const answers: Record<string, number> = {
        o1: 2, o2: 4, o3: 2, // Low openness
        c1: 2, c2: 4, c3: 2, // Low conscientiousness
        e1: 3, e2: 3, e3: 3,
        a1: 5, a2: 1, a3: 5, // High agreeableness
        n1: 3, n2: 3, n3: 3
      }

      const result = calculatePersonalityScores(answers)
      expect(result.persuasion_style).toBe('pathos')
    })

    it('should return ethos as default', () => {
      const answers: Record<string, number> = {
        o1: 2, o2: 4, o3: 2, // Low openness
        c1: 2, c2: 4, c3: 2, // Low conscientiousness
        e1: 3, e2: 3, e3: 3,
        a1: 2, a2: 4, a3: 2, // Low agreeableness
        n1: 3, n2: 3, n3: 3
      }

      const result = calculatePersonalityScores(answers)
      expect(result.persuasion_style).toBe('ethos')
    })

    it('should prioritize logos over pathos when both conditions met', () => {
      const answers: Record<string, number> = {
        o1: 5, o2: 1, o3: 5, // High openness
        c1: 5, c2: 1, c3: 5, // High conscientiousness
        e1: 3, e2: 3, e3: 3,
        a1: 5, a2: 1, a3: 5, // Also high agreeableness
        n1: 3, n2: 3, n3: 3
      }

      const result = calculatePersonalityScores(answers)
      // Logos check comes first in the code
      expect(result.persuasion_style).toBe('logos')
    })
  })

  describe('edge cases', () => {
    it('should handle partial answers', () => {
      const answers: Record<string, number> = {
        o1: 5,
        c1: 4,
        // Missing most answers
      }

      const result = calculatePersonalityScores(answers)

      // Should still return valid scores
      expect(result.openness).toBeDefined()
      expect(typeof result.openness).toBe('number')
      expect(isNaN(result.openness)).toBe(false)
    })

    it('should handle out of range values gracefully', () => {
      const answers: Record<string, number> = {
        o1: 10, o2: -5, o3: 100, // Invalid values
        c1: 3, c2: 3, c3: 3,
        e1: 3, e2: 3, e3: 3,
        a1: 3, a2: 3, a3: 3,
        n1: 3, n2: 3, n3: 3
      }

      // Should not throw, just calculate with the values given
      expect(() => calculatePersonalityScores(answers)).not.toThrow()
    })
  })
})
