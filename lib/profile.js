import { supabaseAdmin } from '@/lib/supabaseAdmin'

// Supabase Auth requires email confirmation on this project, so a `profiles`
// row can't be reliably created right after signUp() — the user may not be
// authenticated again until they click the confirmation link. Instead, the
// role/name/phone chosen at signup are stashed in auth user_metadata, and
// the profile row is created lazily the first time we see an authenticated
// user who doesn't have one yet.
export async function getOrCreateProfile(user) {
  const { data: existing, error: fetchError } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle()

  if (fetchError) throw fetchError
  if (existing) return existing

  const meta = user.user_metadata || {}
  const { data: created, error: insertError } = await supabaseAdmin
    .from('profiles')
    .insert([{
      id: user.id,
      role: meta.role === 'venue_owner' ? 'venue_owner' : 'user',
      full_name: meta.full_name || null,
      phone: meta.phone || null,
    }])
    .select()
    .single()

  if (insertError) throw insertError
  return created
}
