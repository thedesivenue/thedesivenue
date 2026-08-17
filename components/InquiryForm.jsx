'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

const inputClass =
  'rounded-sm border border-cream-border bg-cream px-3.5 py-2.5 text-sm text-ink outline-none placeholder:text-muted focus:border-plum'

export function InquiryForm({ venueId, venueName }) {
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [userId, setUserId] = useState(null)
  const [form, setForm] = useState({
    name: '', email: '', phone: '', event_date: '', guest_count: '', message: ''
  })

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUserId(data.user.id)
        setForm((prev) => ({ ...prev, email: prev.email || data.user.email || '' }))
      }
    })
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    // Generated client-side (rather than read back via .select()) since the
    // RLS insert policy on inquiries doesn't grant SELECT, and .insert().select()
    // requires both — chaining .select() there fails the whole insert.
    const inquiryId = crypto.randomUUID()
    const supabase = createClient()
    const { error } = await supabase
      .from('inquiries')
      .insert([{
        id: inquiryId,
        venue_id: venueId,
        user_id: userId,
        name: form.name,
        email: form.email,
        phone: form.phone,
        event_date: form.event_date || null,
        guest_count: form.guest_count ? parseInt(form.guest_count) : null,
        message: form.message
      }])

    setSubmitting(false)
    if (error) {
      console.error('Error submitting inquiry:', error)
      alert('Something went wrong. Please try again.')
    } else {
      setSubmitted(true)
      fetch('/api/notify-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inquiryId }),
      }).catch((err) => console.error('Error triggering inquiry notification:', err))
    }
  }

  if (submitted) {
    return (
      <div className="py-6 text-center">
        <p className="font-display text-lg font-bold text-plum">Inquiry sent ✦</p>
        <p className="mt-2 text-sm text-plum-light">
          {venueName} will reply here or reach out to you directly.
        </p>
        {!userId && (
          <p className="mt-3 text-[13px] text-muted">
            Want to see the reply? <Link href="/login" className="font-medium text-plum hover:underline">We&apos;ll email you a link</Link> to check on it, no password needed.
          </p>
        )}
      </div>
    )
  }

  return (
    <>
      <h3 className="font-display text-lg font-bold text-ink">Send an inquiry</h3>
      <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3">
        <input name="name" placeholder="Your name" required value={form.name} onChange={handleChange} className={inputClass} />
        <input name="email" type="email" placeholder="Email" required value={form.email} onChange={handleChange} className={inputClass} />
        <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} className={inputClass} />
        <input name="event_date" type="date" value={form.event_date} onChange={handleChange} className={inputClass} />
        <input name="guest_count" type="number" placeholder="Number of guests" value={form.guest_count} onChange={handleChange} className={inputClass} />
        <textarea name="message" placeholder="Tell us about your event..." value={form.message} onChange={handleChange} rows={3} className={`${inputClass} resize-none`} />
        <button type="submit" disabled={submitting} className="mt-1 rounded-sm bg-plum py-3.5 text-[12px] font-semibold uppercase tracking-wider text-gold-light transition hover:bg-ink disabled:opacity-60">
          {submitting ? 'Sending…' : 'Send inquiry'}
        </button>
      </form>
    </>
  )
}
