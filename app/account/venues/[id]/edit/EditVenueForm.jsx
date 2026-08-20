'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Pill } from '@/components/ui/Pill'
import { CULTURAL_FEATURES, FEATURE_LABELS } from '@/lib/features'
import { MAX_IMAGES, MAX_FILE_SIZE } from '@/lib/venueImages'
import { updateVenue, removeVenueImage } from '../actions'

export function EditVenueForm({ venue }) {
  const formRef = useRef(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const initialFeatures = venue.venue_features?.[0]
    ? Object.entries(venue.venue_features[0]).filter(([key, val]) => val === true && FEATURE_LABELS[key]).map(([key]) => key)
    : []
  const [features, setFeatures] = useState(initialFeatures)
  const [newImages, setNewImages] = useState([])

  const toggleFeature = (key) => {
    setFeatures((prev) => (prev.includes(key) ? prev.filter((f) => f !== key) : [...prev, key]))
  }

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files)
    e.target.value = ''
    const totalCount = venue.venue_images.length + newImages.length + files.length
    if (totalCount > MAX_IMAGES) {
      setError(`Please keep it to at most ${MAX_IMAGES} photos total.`)
      return
    }
    const oversized = files.find((f) => f.size > MAX_FILE_SIZE)
    if (oversized) {
      setError(`${oversized.name} is larger than 5MB.`)
      return
    }
    setError('')
    setNewImages((prev) => [...prev, ...files.map((file) => ({ file, preview: URL.createObjectURL(file) }))])
  }

  const removeNewImage = (index) => {
    setNewImages((prev) => {
      URL.revokeObjectURL(prev[index].preview)
      return prev.filter((_, i) => i !== index)
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    const formData = new FormData(formRef.current)
    features.forEach((key) => formData.append('features', key))
    newImages.forEach(({ file }) => formData.append('images', file))

    const result = await updateVenue(formData)
    if (result?.error) {
      setError(result.error)
      setSubmitting(false)
    }
    // On success the server action redirects, so no further state change needed here.
  }

  return (
    <>
      <Header />
      <main className="flex-1 bg-cream">
        <div className="mx-auto max-w-2xl px-6 pt-6">
          <Link href={`/account/venues/${venue.id}`} className="inline-flex items-center gap-1.5 text-sm text-plum-light hover:text-plum">
            <span aria-hidden>←</span> Back to venue
          </Link>
        </div>

        <section className="px-6 py-8 text-center">
          <h1 className="font-display text-3xl font-bold text-ink sm:text-4xl">Edit venue</h1>
          <p className="mx-auto mt-2 max-w-md text-[14px] text-plum-light">
            Saving changes sends this listing back for review before it&apos;s live again.
          </p>
        </section>

        <form ref={formRef} onSubmit={handleSubmit} className="mx-auto max-w-2xl px-6 pb-12">
          <input type="hidden" name="venue_id" value={venue.id} />

          <fieldset className="rounded-sm border border-cream-border bg-white p-6">
            <legend className="px-1 text-base font-medium text-ink">Venue details</legend>
            <div className="mt-4 grid gap-4">
              <input name="name" placeholder="Venue name" required defaultValue={venue.name} className={inputClass} />
              <input name="address" placeholder="Street address" required defaultValue={venue.address} className={inputClass} />
              <div className="grid grid-cols-3 gap-4">
                <input name="city" placeholder="City" required defaultValue={venue.city} className={inputClass} />
                <input name="state" placeholder="State" required defaultValue={venue.state} className={inputClass} />
                <input name="zip" placeholder="ZIP" required defaultValue={venue.zip} className={inputClass} />
              </div>
              <textarea name="description" placeholder="Describe your venue..." rows={4} defaultValue={venue.description} className={`${inputClass} resize-none`} />
              <div className="grid grid-cols-3 gap-4">
                <input name="min_capacity" type="number" placeholder="Min guests" defaultValue={venue.min_capacity ?? ''} className={inputClass} />
                <input name="max_capacity" type="number" placeholder="Max guests" defaultValue={venue.max_capacity ?? ''} className={inputClass} />
                <input name="min_price" type="number" placeholder="Starting price ($)" defaultValue={venue.min_price ?? ''} className={inputClass} />
              </div>
              <label className="flex items-center gap-2 text-sm text-plum-light">
                <input name="parking" type="checkbox" value="true" defaultChecked={venue.parking} className="h-4 w-4 accent-plum" />
                On-site parking available
              </label>
            </div>
          </fieldset>

          <fieldset className="mt-6 rounded-sm border border-cream-border bg-white p-6">
            <legend className="px-1 text-base font-medium text-ink">Photos</legend>

            {venue.venue_images.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
                {venue.venue_images.map((img) => (
                  <div key={img.id} className="group relative h-24 overflow-hidden rounded-sm border border-cream-border">
                    <Image src={img.url} alt="" fill sizes="120px" className="object-cover" />
                    <button
                      type="button"
                      onClick={() => removeVenueImage(venue.id, img.id)}
                      className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-sm bg-ink/70 text-[11px] text-white opacity-0 transition group-hover:opacity-100"
                      aria-label="Remove photo"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            {newImages.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
                {newImages.map((img, i) => (
                  <div key={img.preview} className="group relative h-24 overflow-hidden rounded-sm border border-plum">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img.preview} alt="" className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeNewImage(i)}
                      className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-sm bg-ink/70 text-[11px] text-white opacity-0 transition group-hover:opacity-100"
                      aria-label="Remove photo"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            {venue.venue_images.length + newImages.length < MAX_IMAGES && (
              <label className="mt-4 flex cursor-pointer items-center justify-center rounded-sm border border-dashed border-cream-border py-6 text-[13px] text-muted hover:border-plum-light hover:text-plum-light">
                <input type="file" accept="image/*" multiple onChange={handleImageSelect} className="hidden" />
                Click to add photos
              </label>
            )}
          </fieldset>

          <fieldset className="mt-6 rounded-sm border border-cream-border bg-white p-6">
            <legend className="px-1 text-base font-medium text-ink">Cultural features</legend>
            <div className="mt-4 flex flex-wrap gap-2">
              {CULTURAL_FEATURES.map(({ key, label }) => (
                <Pill key={key} as="button" type="button" onClick={() => toggleFeature(key)} active={features.includes(key)}>
                  {label}
                </Pill>
              ))}
            </div>
          </fieldset>

          {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="mt-8 w-full rounded-sm bg-plum py-4 text-[12px] font-semibold uppercase tracking-wider text-gold-light transition hover:bg-ink disabled:opacity-60"
          >
            {submitting ? 'Saving…' : 'Save changes'}
          </button>
        </form>
      </main>
      <Footer />
    </>
  )
}

const inputClass =
  'w-full rounded-sm border border-cream-border bg-cream px-3.5 py-2.5 text-sm text-ink outline-none placeholder:text-muted focus:border-plum'
