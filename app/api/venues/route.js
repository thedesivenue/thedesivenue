import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { createClient as createServerSupabase } from '@/lib/supabase/server'
import { CULTURAL_FEATURES } from '@/lib/features'
import { validateImages, uploadVenueImages } from '@/lib/venueImages'

const FEATURE_KEYS = new Set(CULTURAL_FEATURES.map((f) => f.key))

export async function POST(request) {
  const formData = await request.formData()

  // Honeypot: real visitors never see or fill this field.
  if (formData.get('company')) {
    return NextResponse.json({ id: null })
  }

  const images = formData.getAll('images').filter((f) => f instanceof File && f.size > 0)
  const imageError = validateImages(images)
  if (imageError) return NextResponse.json({ error: imageError }, { status: 400 })

  // Logged-in venue owners skip re-entering their own contact info and the
  // venue gets linked to their account.
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()

  const venuePayload = {
    owner_name: formData.get('owner_name'),
    owner_email: formData.get('owner_email') || user?.email || null,
    owner_phone: formData.get('owner_phone'),
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
    is_approved: false,
    owner_id: user?.id || null,
  }

  if (!venuePayload.name || !venuePayload.owner_name || !venuePayload.owner_email || !venuePayload.owner_phone) {
    return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 })
  }

  const { data: venue, error: venueError } = await supabaseAdmin
    .from('venues')
    .insert([venuePayload])
    .select()
    .single()

  if (venueError) {
    console.error('Error inserting venue:', venueError)
    return NextResponse.json({ error: 'Something went wrong submitting your venue.' }, { status: 500 })
  }

  const features = formData.getAll('features').filter((key) => FEATURE_KEYS.has(key))
  if (features.length > 0) {
    const featureRow = { venue_id: venue.id }
    features.forEach((key) => { featureRow[key] = true })
    const { error: featureError } = await supabaseAdmin.from('venue_features').insert([featureRow])
    if (featureError) console.error('Error inserting venue features:', featureError)
  }

  try {
    await uploadVenueImages(venue.id, images)
  } catch (bucketError) {
    console.error('Error uploading venue images:', bucketError)
    return NextResponse.json({ id: venue.id, warning: 'Venue submitted, but photos could not be uploaded.' })
  }

  return NextResponse.json({ id: venue.id })
}
