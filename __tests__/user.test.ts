import { getDisplayName } from '@/lib/utils/user'

describe('getDisplayName', () => {
  describe('null/undefined handling', () => {
    it('should return "there" for null user', () => {
      expect(getDisplayName(null)).toBe('there')
    })
  })

  describe('full_name handling', () => {
    it('should return full_name when available', () => {
      const user = {
        id: '1',
        email: 'test@example.com',
        full_name: 'John Doe',
        personality_profile: null,
        onboarded: true,
        created_at: new Date().toISOString()
      }
      expect(getDisplayName(user)).toBe('John Doe')
    })

    it('should prioritize full_name over email', () => {
      const user = {
        id: '1',
        email: 'test@example.com',
        full_name: 'Jane Smith',
        personality_profile: null,
        onboarded: true,
        created_at: new Date().toISOString()
      }
      expect(getDisplayName(user)).toBe('Jane Smith')
    })
  })

  describe('email fallback', () => {
    it('should extract username from email when no full_name', () => {
      const user = {
        id: '1',
        email: 'testuser@example.com',
        full_name: null,
        personality_profile: null,
        onboarded: true,
        created_at: new Date().toISOString()
      }
      expect(getDisplayName(user)).toBe('testuser')
    })

    it('should handle emails with dots in username', () => {
      const user = {
        id: '1',
        email: 'john.doe@example.com',
        full_name: null,
        personality_profile: null,
        onboarded: true,
        created_at: new Date().toISOString()
      }
      expect(getDisplayName(user)).toBe('john.doe')
    })

    it('should return "there" when email is null', () => {
      const user = {
        id: '1',
        email: null,
        full_name: null,
        personality_profile: null,
        onboarded: true,
        created_at: new Date().toISOString()
      }
      expect(getDisplayName(user)).toBe('there')
    })

    it('should return full email if no @ symbol', () => {
      const user = {
        id: '1',
        email: 'invalid-email',
        full_name: null,
        personality_profile: null,
        onboarded: true,
        created_at: new Date().toISOString()
      }
      expect(getDisplayName(user)).toBe('invalid-email')
    })

    it('should return email if username part is empty', () => {
      const user = {
        id: '1',
        email: '@domain.com',
        full_name: null,
        personality_profile: null,
        onboarded: true,
        created_at: new Date().toISOString()
      }
      // split('@')[0] returns empty string, so fallback to full email
      expect(getDisplayName(user)).toBe('@domain.com')
    })
  })

  describe('empty string handling', () => {
    it('should handle empty full_name as falsy', () => {
      const user = {
        id: '1',
        email: 'test@example.com',
        full_name: '',
        personality_profile: null,
        onboarded: true,
        created_at: new Date().toISOString()
      }
      expect(getDisplayName(user)).toBe('test')
    })
  })
})
