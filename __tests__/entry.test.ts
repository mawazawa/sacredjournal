import { handleEntrySave } from '@/lib/utils/entry'

describe('handleEntrySave', () => {
  describe('successful save', () => {
    it('should return success with word count', async () => {
      const mockSupabase = {
        from: jest.fn().mockReturnValue({
          update: jest.fn().mockReturnValue({
            eq: jest.fn().mockResolvedValue({ error: null })
          })
        })
      }

      const result = await handleEntrySave(
        mockSupabase,
        'entry-123',
        'Test Title',
        'This is test content with five words'
      )

      expect(result.success).toBe(true)
      expect(result.error).toBeNull()
      expect(result.wordCount).toBe(7)
    })

    it('should calculate word count correctly', async () => {
      const mockSupabase = {
        from: jest.fn().mockReturnValue({
          update: jest.fn().mockReturnValue({
            eq: jest.fn().mockResolvedValue({ error: null })
          })
        })
      }

      const result = await handleEntrySave(
        mockSupabase,
        'entry-123',
        'Title',
        'one two three'
      )

      expect(result.wordCount).toBe(3)
    })

    it('should handle empty content', async () => {
      const mockSupabase = {
        from: jest.fn().mockReturnValue({
          update: jest.fn().mockReturnValue({
            eq: jest.fn().mockResolvedValue({ error: null })
          })
        })
      }

      const result = await handleEntrySave(
        mockSupabase,
        'entry-123',
        'Title',
        ''
      )

      expect(result.wordCount).toBe(0)
      expect(result.success).toBe(true)
    })

    it('should handle whitespace-only content', async () => {
      const mockSupabase = {
        from: jest.fn().mockReturnValue({
          update: jest.fn().mockReturnValue({
            eq: jest.fn().mockResolvedValue({ error: null })
          })
        })
      }

      const result = await handleEntrySave(
        mockSupabase,
        'entry-123',
        'Title',
        '   \n\t   '
      )

      expect(result.wordCount).toBe(0)
    })

    it('should handle multiple spaces between words', async () => {
      const mockSupabase = {
        from: jest.fn().mockReturnValue({
          update: jest.fn().mockReturnValue({
            eq: jest.fn().mockResolvedValue({ error: null })
          })
        })
      }

      const result = await handleEntrySave(
        mockSupabase,
        'entry-123',
        'Title',
        'word1    word2     word3'
      )

      expect(result.wordCount).toBe(3)
    })
  })

  describe('error handling', () => {
    it('should return error when database fails', async () => {
      const mockSupabase = {
        from: jest.fn().mockReturnValue({
          update: jest.fn().mockReturnValue({
            eq: jest.fn().mockResolvedValue({
              error: { message: 'Database connection failed' }
            })
          })
        })
      }

      const result = await handleEntrySave(
        mockSupabase,
        'entry-123',
        'Title',
        'content'
      )

      expect(result.success).toBe(false)
      expect(result.error).toBe('Database connection failed')
    })

    it('should still calculate word count on error', async () => {
      const mockSupabase = {
        from: jest.fn().mockReturnValue({
          update: jest.fn().mockReturnValue({
            eq: jest.fn().mockResolvedValue({
              error: { message: 'Error' }
            })
          })
        })
      }

      const result = await handleEntrySave(
        mockSupabase,
        'entry-123',
        'Title',
        'one two three four'
      )

      expect(result.wordCount).toBe(4)
    })
  })

  describe('database interaction', () => {
    it('should call supabase with correct parameters', async () => {
      const mockEq = jest.fn().mockResolvedValue({ error: null })
      const mockUpdate = jest.fn().mockReturnValue({ eq: mockEq })
      const mockFrom = jest.fn().mockReturnValue({ update: mockUpdate })
      const mockSupabase = { from: mockFrom }

      await handleEntrySave(
        mockSupabase,
        'entry-456',
        'My Title',
        'My content here'
      )

      expect(mockFrom).toHaveBeenCalledWith('entries')
      expect(mockUpdate).toHaveBeenCalledWith({
        title: 'My Title',
        content: 'My content here',
        word_count: 3
      })
      expect(mockEq).toHaveBeenCalledWith('id', 'entry-456')
    })
  })
})
