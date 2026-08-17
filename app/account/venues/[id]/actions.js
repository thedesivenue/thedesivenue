'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient as createServerSupabase } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { CULTURAL_FEATURES } from '@/lib/features'
import { validateImages, uploadVenueImages, deleteVenueImage } from '@/lib/venueImages'
import { notifyNewReply } from '@/lib/notify'

const FEATURE_KEYS = new Set(CULTURAL_FEATURES.map((f) => f.key))

async function requireOwnedVenue(venueId) {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: venue, error } = await supabaseAdmin.from('venues').select('*').eq('id', venueId).single()
  if (error || !venue || venue.owner_id !== user.id) redirect('/account')

  return { user, venue }
}

export async function updateVenue(formData) {
  const venueId = formData.get('venue_id')
  await requireOwnedVenue(venueId)

  const images = formData.getAll('images').filter((f) => f instanceof File && f.size > 0)
  const imageError = validateImages(images)
  if (imageError) return { error: imageError }

  const updates = {
    name: formData.get('name'),
    address: formData.get('address'),
    city: formData.get('city'),
    state: formData.get('state'),
    zip: formData.get('zip'),
    description: formData.get('description'),
    min_capacity: formData.get('min_capacity') ? parseInt(formData.get('min_capacity')) : null,
    max_capacity: formData.get('max_capacity') ? parseInt(formData.get('max_capacity')) : null,
    min_price: formData.get('min_price') ? parseFloat(formData.get('min_price')) : null,
    parking: formData.get('parking') === 'true',
    is_approved: false, // edits go back for re-review
  }

  const { error: updateError } = await supabaseAdmin.from('venues').update(updates).eq('id', venueId)
  if (updateError) return { error: 'Something went wrong saving your changes.' }

  const selectedFeatures = formData.getAll('features').filter((key) => FEATURE_KEYS.has(key))
  const featureRow = { venue_id: venueId }
  CULTURAL_FEATURES.forEach(({ key }) => { featureRow[key] = selectedFeatures.includes(key) })

  const { data: existingFeatureRow } = await supabaseAdmin
    .from('venue_features')
    .select('id')
    .eq('venue_id', venueId)
    .maybeSingle()

  if (existingFeatureRow) {
    await supabaseAdmin.from('venue_features').update(featureRow).eq('venue_id', venueId)
  } else {
    await supabaseAdmin.from('venue_features').insert([featureRow])
  }

  await uploadVenueImages(venueId, images)

  revalidatePath(`/account/venues/${venueId}`)
  revalidatePath(`/venues/${venueId}`)
  redirect(`/account/venues/${venueId}`)
}

export async function removeVenueImage(venueId, imageId) {
  await requireOwnedVenue(venueId)
  const { data: image } = await supabaseAdmin.from('venue_images').select('*').eq('id', imageId).single()
  if (image) await deleteVenueImage(image)
  revalidatePath(`/account/venues/${venueId}/edit`)
}

export async function sendOwnerReply(prevState, formData) {
  const inquiryId = formData.get('inquiry_id')
  const body = formData.get('body')?.toString().trim()
  if (!body) return { error: 'Message cannot be empty.' }

  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: inquiry } = await supabaseAdmin
    .from('inquiries')
    .select('venue_id, email, venues(owner_id, name)')
    .eq('id', inquiryId)
    .single()

  if (!inquiry || inquiry.venues?.owner_id !== user.id) redirect('/account')

  const { error } = await supabaseAdmin.from('inquiry_messages').insert([{ inquiry_id: inquiryId, sender_id: user.id, body }])
  if (error) return { error: 'Something went wrong sending your reply.' }

  await notifyNewReply({
    toEmail: inquiry.email,
    venueName: inquiry.venues.name,
    replyBody: body,
    accountUrl: '/account',
  })

  revalidatePath(`/account/venues/${inquiry.venue_id}`)
  return { success: true }
}
