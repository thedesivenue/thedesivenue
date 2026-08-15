import { supabaseAdmin } from '@/lib/supabaseAdmin'

const BUCKET = 'venue-images'
export const MAX_IMAGES = 6
export const MAX_FILE_SIZE = 5 * 1024 * 1024
export const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

export function validateImages(images) {
  if (images.length > MAX_IMAGES) return `Please upload at most ${MAX_IMAGES} photos.`
  for (const file of images) {
    if (!ALLOWED_TYPES.includes(file.type)) return `${file.name} isn't a supported image type.`
    if (file.size > MAX_FILE_SIZE) return `${file.name} is larger than 5MB.`
  }
  return null
}

async function ensureBucket() {
  const { data, error } = await supabaseAdmin.storage.getBucket(BUCKET)
  if (data) return
  if (error && !/not found/i.test(error.message)) throw error
  const { error: createError } = await supabaseAdmin.storage.createBucket(BUCKET, { public: true })
  if (createError && !/already exists/i.test(createError.message)) throw createError
}

// Uploads each file to storage under `${venueId}/...` and inserts the
// resulting rows into venue_images. Returns the number of images stored.
export async function uploadVenueImages(venueId, images) {
  if (images.length === 0) return 0
  await ensureBucket()

  const imageRows = []
  for (const file of images) {
    const ext = file.name.split('.').pop()
    const path = `${venueId}/${crypto.randomUUID()}.${ext}`
    const { error: uploadError } = await supabaseAdmin.storage
      .from(BUCKET)
      .upload(path, file, { contentType: file.type })

    if (uploadError) {
      console.error('Error uploading image:', uploadError)
      continue
    }
    const { data: publicUrl } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(path)
    imageRows.push({ venue_id: venueId, url: publicUrl.publicUrl })
  }

  if (imageRows.length > 0) {
    const { error: imagesError } = await supabaseAdmin.from('venue_images').insert(imageRows)
    if (imagesError) console.error('Error inserting venue images:', imagesError)
  }
  return imageRows.length
}

export async function deleteVenueImage(image) {
  const path = image.url.split(`/${BUCKET}/`)[1]
  if (path) {
    const { error: removeError } = await supabaseAdmin.storage.from(BUCKET).remove([path])
    if (removeError) console.error('Error removing image from storage:', removeError)
  }
  const { error } = await supabaseAdmin.from('venue_images').delete().eq('id', image.id)
  if (error) throw error
}
