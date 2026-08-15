import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
// Falls back to a placeholder so the build doesn't crash when the real key isn't configured yet
// (e.g. local dev before .env.local is filled in). Calls will simply fail auth until it's set.
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'missing-supabase-service-role-key'

// Server-only client that bypasses RLS — never import this from a Client Component.
export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
})
