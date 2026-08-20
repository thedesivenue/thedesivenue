'use client'

import { useState } from 'react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { BackLink } from '@/components/ui/BackLink'

const inputClass =
  'w-full rounded-sm border border-cream-border bg-cream px-3.5 py-2.5 text-sm text-ink outline-none placeholder:text-muted focus:border-plum'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '', company: '' })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const result = await res.json().catch(() => ({}))
        setError(result.error || 'Something went wrong. Please try again.')
        setSubmitting(false)
        return
      }
      setSubmitted(true)
    } catch {
      setError('Something went wrong. Please try again.')
    }
    setSubmitting(false)
  }

  return (
    <>
      <Header />
      <main className="flex-1 bg-cream">
        <div className="px-6 pt-6">
          <BackLink href="/">Back to home</BackLink>
        </div>

        <section className="border-b border-cream-border bg-white px-6 py-14 text-center">
          <h1 className="font-display text-4xl font-bold text-ink sm:text-5xl">Get in touch</h1>
          <p className="mx-auto mt-3 max-w-lg text-[15px] text-plum-light">
            Questions about a listing, your account, or The Desi Venue in general? Send us a message.
          </p>
        </section>

        <div className="mx-auto max-w-lg px-6 py-12">
          {submitted ? (
            <div className="rounded-sm border border-cream-border bg-white p-8 text-center">
              <p className="font-display text-lg font-bold text-plum">Message sent ✦</p>
              <p className="mt-2 text-sm text-plum-light">We&apos;ll get back to you as soon as we can.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="rounded-sm border border-cream-border bg-white p-6">
              <div className="flex flex-col gap-4">
                <input name="name" placeholder="Your name" required value={form.name} onChange={handleChange} className={inputClass} />
                <input name="email" type="email" placeholder="Email" required value={form.email} onChange={handleChange} className={inputClass} />
                <textarea name="message" placeholder="How can we help?" required rows={5} value={form.message} onChange={handleChange} className={`${inputClass} resize-none`} />

                {/* Honeypot — hidden from real visitors, bots tend to fill every field */}
                <input
                  type="text"
                  name="company"
                  value={form.company}
                  onChange={handleChange}
                  autoComplete="off"
                  tabIndex={-1}
                  aria-hidden="true"
                  className="absolute left-[-9999px] h-0 w-0 opacity-0"
                />
              </div>

              {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

              <button
                type="submit"
                disabled={submitting}
                className="mt-6 w-full rounded-sm bg-plum py-3.5 text-[12px] font-semibold uppercase tracking-wider text-gold-light transition hover:bg-ink disabled:opacity-60"
              >
                {submitting ? 'Sending…' : 'Send message'}
              </button>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
