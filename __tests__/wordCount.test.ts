import { calculateWordCount, formatWordCount } from '@/lib/utils/wordCount'

describe('calculateWordCount', () => {
  describe('Bug 3: Word count should handle edge cases', () => {
    it('should return 0 for null input', () => {
      expect(calculateWordCount(null)).toBe(0)
    })

    it('should return 0 for undefined input', () => {
      expect(calculateWordCount(undefined)).toBe(0)
    })

    it('should return 0 for empty string', () => {
      expect(calculateWordCount('')).toBe(0)
    })

    it('should return 0 for whitespace only', () => {
      expect(calculateWordCount('   ')).toBe(0)
      expect(calculateWordCount('\n\t  ')).toBe(0)
    })

    it('should count single word correctly', () => {
      expect(calculateWordCount('hello')).toBe(1)
    })

    it('should count multiple words correctly', () => {
      expect(calculateWordCount('hello world')).toBe(2)
      expect(calculateWordCount('one two three four five')).toBe(5)
    })

    it('should handle multiple spaces between words', () => {
      expect(calculateWordCount('hello    world')).toBe(2)
    })

    it('should handle newlines and tabs', () => {
      expect(calculateWordCount('hello\nworld\tthere')).toBe(3)
    })

    it('should handle leading and trailing whitespace', () => {
      expect(calculateWordCount('  hello world  ')).toBe(2)
    })
  })
})

describe('formatWordCount', () => {
  it('should format zero correctly', () => {
    expect(formatWordCount(0)).toBe('0 words')
  })

  it('should format singular correctly', () => {
    expect(formatWordCount(1)).toBe('1 word')
  })

  it('should format plural correctly', () => {
    expect(formatWordCount(5)).toBe('5 words')
    expect(formatWordCount(100)).toBe('100 words')
  })
})
