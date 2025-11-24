/**
 * Bug 3: Entry Detail - No error feedback when save fails
 *
 * The handleSave function doesn't show any error to the user if the update fails.
 * The error is silently ignored.
 */

import { handleEntrySave } from '../lib/utils/entry'

describe('Entry Save Operation', () => {
  it('should return success when save succeeds', async () => {
    const mockSupabase = {
      from: () => ({
        update: () => ({
          eq: () => Promise.resolve({ error: null })
        })
      })
    }

    const result = await handleEntrySave(
      mockSupabase as any,
      'entry-123',
      'New Title',
      'New content here'
    )

    expect(result.success).toBe(true)
    expect(result.error).toBeNull()
    expect(result.wordCount).toBe(3)
  })

  it('should return error message when save fails', async () => {
    const mockSupabase = {
      from: () => ({
        update: () => ({
          eq: () => Promise.resolve({
            error: { message: 'Database connection failed' }
          })
        })
      })
    }

    // This is the BUG - errors should be returned to show user feedback
    const result = await handleEntrySave(
      mockSupabase as any,
      'entry-123',
      'New Title',
      'New content here'
    )

    expect(result.success).toBe(false)
    expect(result.error).toBe('Database connection failed')
  })

  it('should calculate word count correctly', async () => {
    const mockSupabase = {
      from: () => ({
        update: () => ({
          eq: () => Promise.resolve({ error: null })
        })
      })
    }

    const result = await handleEntrySave(
      mockSupabase as any,
      'entry-123',
      'Title',
      'This is a test with seven words total'
    )

    expect(result.wordCount).toBe(8)
  })

  it('should handle empty content', async () => {
    const mockSupabase = {
      from: () => ({
        update: () => ({
          eq: () => Promise.resolve({ error: null })
        })
      })
    }

    const result = await handleEntrySave(
      mockSupabase as any,
      'entry-123',
      'Title',
      '   '
    )

    expect(result.wordCount).toBe(0)
  })
})
