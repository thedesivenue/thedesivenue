'use server'

import { revalidatePath } from 'next/cache'
import { createClient as createServerSupabase } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function submitReview(prevState, formData) {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Please log in to leave a review.' }

  const venueId = formData.get('venue_id')
  const rating = parseInt(formData.get('rating'))
  const comment = formData.get('comment')?.toString().trim() || null

  if (!rating || rating < 1 || rating > 5) {
    return { error: 'Please select a rating.' }
  }

  const { error } = await supabaseAdmin
    .from('reviews')
    .upsert([{ venue_id: venueId, user_id: user.id, rating, comment }], { onConflict: 'venue_id,user_id' })

  if (error) {
    console.error('Error submitting review:', error)
    return { error: 'Something went wrong submitting your review.' }
  }

  revalidatePath(`/venues/${venueId}`)
  return { success: true }
}
