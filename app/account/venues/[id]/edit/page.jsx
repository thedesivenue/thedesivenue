import { redirect } from 'next/navigation'
import { createClient as createServerSupabase } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { EditVenueForm } from './EditVenueForm'

export const dynamic = 'force-dynamic'

export default async function EditOwnerVenuePage({ params }) {
  const { id } = await params

  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: venue } = await supabaseAdmin
    .from('venues')
    .select('*, venue_features(*), venue_images(*)')
    .eq('id', id)
    .single()

  if (!venue || venue.owner_id !== user.id) redirect('/account')

  return <EditVenueForm venue={venue} />
}
