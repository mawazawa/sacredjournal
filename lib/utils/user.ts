import type { Database } from '@/lib/supabase/client'

type User = Database['public']['Tables']['users']['Row']

export function getDisplayName(user: User | null): string {
  // FIX: Handle null user with fallback
  if (!user) {
    return 'there'
  }

  if (user.full_name) {
    return user.full_name
  }

  if (!user.email) {
    return 'there'
  }

  return user.email.split('@')[0] || user.email
}
