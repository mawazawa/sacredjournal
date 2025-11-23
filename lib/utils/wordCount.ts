/**
 * Calculate word count from text, handling edge cases
 */
export function calculateWordCount(text: string | null | undefined): number {
  if (!text || typeof text !== 'string') {
    return 0
  }

  const trimmed = text.trim()
  if (trimmed === '') {
    return 0
  }

  // Split by whitespace and filter out empty strings
  return trimmed.split(/\s+/).filter(word => word.length > 0).length
}

/**
 * Format word count for display
 */
export function formatWordCount(count: number): string {
  if (count === 0) {
    return '0 words'
  }
  if (count === 1) {
    return '1 word'
  }
  return `${count} words`
}
