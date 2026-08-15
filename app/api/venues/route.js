import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { CULTURAL_FEATURES } from '@/lib/features'

const BUCKET = 'venue-images'
const MAX_IMAGES = 6
const MAX_FILE_SIZE = 5 * 1024 * 1024
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const FEATURE_KEYS = new Set(CULTURAL_FEATURES.map((f) => f.key))

async function ensureBucket() {
  const { data, error } = await supabaseAdmin.storage.getBucket(BUCKET)
  if (data) return
  if (error && !/not found/i.test(error.message)) throw error
  const { error: createError } = await supabaseAdmin.storage.createBucket(BUCKET, { public: true })
  if (createError && !/already exists/i.test(createError.message)) throw createError
}

export async function POST(request) {
  const formData = await request.formData()

  const images = formData.getAll('images').filter((f) => f instanceof File && f.size > 0)
  if (images.length > MAX_IMAGES) {
    return NextResponse.json({ error: `Please upload at most ${MAX_IMAGES} photos.` }, { status: 400 })
  }
  for (const file of images) {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: `${file.name} isn't a supported image type.` }, { status: 400 })
    }
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: `${file.name} is larger than 5MB.` }, { status: 400 })
    }
  }

  const venuePayload = {
    owner_name: formData.get('owner_name'),
    owner_email: formData.get('owner_email'),
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
  }

  if (!venuePayload.owner_name || !venuePayload.owner_email || !venuePayload.owner_phone || !venuePayload.name) {
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

  if (images.length > 0) {
    try {
      await ensureBucket()
    } catch (bucketError) {
      console.error('Error ensuring storage bucket:', bucketError)
      return NextResponse.json({ id: venue.id, warning: 'Venue submitted, but photos could not be uploaded.' })
    }

    const imageRows = []
    for (const file of images) {
      const ext = file.name.split('.').pop()
      const path = `${venue.id}/${crypto.randomUUID()}.${ext}`
      const { error: uploadError } = await supabaseAdmin.storage
        .from(BUCKET)
        .upload(path, file, { contentType: file.type })

      if (uploadError) {
        console.error('Error uploading image:', uploadError)
        continue
      }
      const { data: publicUrl } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(path)
      imageRows.push({ venue_id: venue.id, url: publicUrl.publicUrl })
    }

    if (imageRows.length > 0) {
      const { error: imagesError } = await supabaseAdmin.from('venue_images').insert(imageRows)
      if (imagesError) console.error('Error inserting venue images:', imagesError)
    }
  }

  return NextResponse.json({ id: venue.id })
}
