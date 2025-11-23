/**
 * Bug 2: Dashboard - User greeting shows "undefined" when profile is null
 *
 * When profile fetch fails or returns null, the greeting tries to access
 * user?.email?.split('@')[0] which returns undefined, showing "Good morning, undefined"
 */

import { getDisplayName } from '../lib/utils/user'

describe('Dashboard User Display', () => {
  it('should display full name when available', () => {
    const user = {
      id: '123',
      email: 'john@example.com',
      full_name: 'John Doe',
      avatar_url: null,
      personality_profile: null,
      onboarded: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    expect(getDisplayName(user)).toBe('John Doe')
  })

  it('should display email username when full_name is null', () => {
    const user = {
      id: '123',
      email: 'john@example.com',
      full_name: null,
      avatar_url: null,
      personality_profile: null,
      onboarded: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    expect(getDisplayName(user)).toBe('john')
  })

  it('should display fallback when user is null', () => {
    // This is the BUG - when user is null, we get "undefined" instead of a fallback
    expect(getDisplayName(null)).toBe('there')
  })

  it('should display fallback when email is malformed', () => {
    const user = {
      id: '123',
      email: 'invalid-email',
      full_name: null,
      avatar_url: null,
      personality_profile: null,
      onboarded: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    // Should return the whole email if no @ sign
    expect(getDisplayName(user)).toBe('invalid-email')
  })
})
