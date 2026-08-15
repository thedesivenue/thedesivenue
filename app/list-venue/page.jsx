'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { supabase } from '@/lib/supabase'
import { Pill } from '@/components/ui/Pill'
import { CULTURAL_FEATURES } from '@/lib/features'

const emptyForm = {
  owner_name: '',
  owner_email: '',
  owner_phone: '',
  name: '',
  address: '',
  city: '',
  state: 'NJ',
  zip: '',
  description: '',
  min_capacity: '',
  max_capacity: '',
  min_price: '',
  parking: false,
}

export default function ListVenuePage() {
  const [form, setForm] = useState(emptyForm)
  const [features, setFeatures] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const toggleFeature = (key) => {
    setFeatures((prev) => (prev.includes(key) ? prev.filter((f) => f !== key) : [...prev, key]))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    const { data: venue, error: venueError } = await supabase
      .from('venues')
      .insert([{
        owner_name: form.owner_name,
        owner_email: form.owner_email,
        owner_phone: form.owner_phone,
        name: form.name,
        address: form.address,
        city: form.city,
        state: form.state,
        zip: form.zip,
        description: form.description,
        min_capacity: form.min_capacity ? parseInt(form.min_capacity) : null,
        max_capacity: form.max_capacity ? parseInt(form.max_capacity) : null,
        min_price: form.min_price ? parseFloat(form.min_price) : null,
        parking: form.parking,
        is_approved: false,
      }])
      .select()
      .single()

    if (venueError) {
      console.error('Error submitting venue:', venueError)
      setError('Something went wrong submitting your venue. Please try again.')
      setSubmitting(false)
      return
    }

    if (features.length > 0) {
      const featureRow = { venue_id: venue.id }
      features.forEach((key) => { featureRow[key] = true })
      const { error: featureError } = await supabase.from('venue_features').insert([featureRow])
      if (featureError) console.error('Error submitting venue features:', featureError)
    }

    setSubmitting(false)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <>
        <Header />
        <main className="flex-1 bg-cream px-6 py-24 text-center">
          <p className="font-display text-2xl font-bold text-plum">Thank you ✦</p>
          <p className="mx-auto mt-3 max-w-md text-[15px] text-plum-light">
            Your venue has been submitted for review. We&apos;ll reach out once it&apos;s approved and live on The Desi Venue.
          </p>
          <Link href="/venues" className="mt-8 inline-block rounded-sm bg-plum px-7 py-3.5 text-[12px] font-semibold uppercase tracking-wider text-gold-light hover:bg-ink">
            Browse venues
          </Link>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="flex-1 bg-cream">
        <section className="border-b border-cream-border bg-white px-6 py-14 text-center">
          <h1 className="font-display text-4xl font-bold text-ink sm:text-5xl">List your venue free</h1>
          <p className="mx-auto mt-3 max-w-lg text-[15px] text-plum-light">
            Reach thousands of Indian families planning events in New Jersey. No listing fees, no commission.
          </p>
        </section>

        <form onSubmit={handleSubmit} className="mx-auto max-w-2xl px-6 py-12">

          <fieldset className="rounded-sm border border-cream-border bg-white p-6">
            <legend className="px-1 text-base font-medium text-ink">Your contact info</legend>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <input name="owner_name" placeholder="Your name" required value={form.owner_name} onChange={handleChange} className={inputClass} />
              <input name="owner_phone" placeholder="Phone" required value={form.owner_phone} onChange={handleChange} className={inputClass} />
              <input name="owner_email" type="email" placeholder="Email" required value={form.owner_email} onChange={handleChange} className={`${inputClass} sm:col-span-2`} />
            </div>
          </fieldset>

          <fieldset className="mt-6 rounded-sm border border-cream-border bg-white p-6">
            <legend className="px-1 text-base font-medium text-ink">Venue details</legend>
            <div className="mt-4 grid gap-4">
              <input name="name" placeholder="Venue name" required value={form.name} onChange={handleChange} className={inputClass} />
              <input name="address" placeholder="Street address" required value={form.address} onChange={handleChange} className={inputClass} />
              <div className="grid grid-cols-3 gap-4">
                <input name="city" placeholder="City" required value={form.city} onChange={handleChange} className={inputClass} />
                <input name="state" placeholder="State" required value={form.state} onChange={handleChange} className={inputClass} />
                <input name="zip" placeholder="ZIP" required value={form.zip} onChange={handleChange} className={inputClass} />
              </div>
              <textarea name="description" placeholder="Describe your venue..." rows={4} value={form.description} onChange={handleChange} className={`${inputClass} resize-none`} />
              <div className="grid grid-cols-3 gap-4">
                <input name="min_capacity" type="number" placeholder="Min guests" value={form.min_capacity} onChange={handleChange} className={inputClass} />
                <input name="max_capacity" type="number" placeholder="Max guests" value={form.max_capacity} onChange={handleChange} className={inputClass} />
                <input name="min_price" type="number" placeholder="Starting price ($)" value={form.min_price} onChange={handleChange} className={inputClass} />
              </div>
              <label className="flex items-center gap-2 text-sm text-plum-light">
                <input name="parking" type="checkbox" checked={form.parking} onChange={handleChange} className="h-4 w-4 accent-plum" />
                On-site parking available
              </label>
            </div>
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
            {submitting ? 'Submitting…' : 'Submit venue for review'}
          </button>
        </form>
      </main>
      <Footer />
    </>
  )
}

const inputClass =
  'w-full rounded-sm border border-cream-border bg-cream px-3.5 py-2.5 text-sm text-ink outline-none placeholder:text-muted focus:border-plum'
