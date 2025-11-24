/**
 * Bug 1: Onboarding - Last answer not included in personality calculation
 *
 * The handleAnswer function calls calculateAndSave() immediately after setAnswers(),
 * but React state updates are async. The last answer won't be in the answers state
 * when calculation runs.
 */

// Import the calculation logic (we'll extract this to a utility)
import { calculatePersonalityScores, questions } from '../lib/utils/personality'

describe('Personality Calculation', () => {
  it('should include the last answer in the calculation', () => {
    // Simulate all 15 answers with value 5 (Strongly Agree)
    const answers: Record<string, number> = {}
    questions.forEach(q => {
      answers[q.id] = 5
    })

    const scores = calculatePersonalityScores(answers)

    // With all 5s, non-reversed questions contribute 5/5 = 1.0
    // Reversed questions contribute (6-5)/5 = 0.2
    // Each trait has 2 normal + 1 reversed OR 1 normal + 2 reversed

    // Openness: o1(5) + o2(1, reversed) + o3(5) = 11 / 15 = 0.733
    expect(scores.openness).toBeCloseTo(0.733, 2)
  })

  it('should calculate correct scores with mixed answers', () => {
    const answers: Record<string, number> = {
      'o1': 4, 'o2': 2, 'o3': 5,  // Openness: 4 + (6-2) + 5 = 13/15 = 0.867
      'c1': 3, 'c2': 3, 'c3': 4,  // Conscientiousness: 3 + (6-3) + 4 = 10/15 = 0.667
      'e1': 2, 'e2': 4, 'e3': 3,  // Extraversion: 2 + (6-4) + 3 = 7/15 = 0.467
      'a1': 5, 'a2': 1, 'a3': 5,  // Agreeableness: 5 + (6-1) + 5 = 15/15 = 1.0
      'n1': 2, 'n2': 4, 'n3': 1,  // Neuroticism: 2 + (6-4) + 1 = 5/15 = 0.333
    }

    const scores = calculatePersonalityScores(answers)

    expect(scores.openness).toBeCloseTo(0.867, 2)
    expect(scores.conscientiousness).toBeCloseTo(0.667, 2)
    expect(scores.extraversion).toBeCloseTo(0.467, 2)
    expect(scores.agreeableness).toBeCloseTo(1.0, 2)
    expect(scores.neuroticism).toBeCloseTo(0.333, 2)
  })

  it('should handle missing answers with default value 3', () => {
    // Only provide first 14 answers, missing the last one (n3)
    const answers: Record<string, number> = {
      'o1': 4, 'o2': 2, 'o3': 5,
      'c1': 3, 'c2': 3, 'c3': 4,
      'e1': 2, 'e2': 4, 'e3': 3,
      'a1': 5, 'a2': 1, 'a3': 5,
      'n1': 2, 'n2': 4, // missing 'n3'
    }

    const scores = calculatePersonalityScores(answers)

    // Neuroticism with missing n3 defaults to 3: 2 + (6-4) + 3 = 7/15 = 0.467
    // This is the BUG - the last answer gets default value instead of actual value
    expect(scores.neuroticism).toBeCloseTo(0.467, 2)
  })

  it('should correctly determine persuasion style', () => {
    const highLogos: Record<string, number> = {
      'o1': 5, 'o2': 1, 'o3': 5,  // Openness high
      'c1': 5, 'c2': 1, 'c3': 5,  // Conscientiousness high
      'e1': 3, 'e2': 3, 'e3': 3,
      'a1': 3, 'a2': 3, 'a3': 3,
      'n1': 3, 'n2': 3, 'n3': 3,
    }

    const scores = calculatePersonalityScores(highLogos)
    expect(scores.persuasion_style).toBe('logos')
  })
})
