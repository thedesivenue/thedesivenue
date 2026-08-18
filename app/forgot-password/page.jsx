'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { createClient } from '@/lib/supabase/client'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    const supabase = createClient()
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    if (resetError) {
      setError(resetError.message)
      setSubmitting(false)
      return
    }

    setSent(true)
    setSubmitting(false)
  }

  if (sent) {
    return (
      <>
        <Header />
        <main className="flex-1 bg-cream px-6 py-24 text-center">
          <p className="font-display text-2xl font-bold text-plum">Check your email ✦</p>
          <p className="mx-auto mt-3 max-w-md text-[15px] text-plum-light">
            We sent a password reset link to {email}. Click it to choose a new password.
          </p>
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
          <h1 className="font-display text-4xl font-bold text-ink sm:text-5xl">Reset your password</h1>
          <p className="mx-auto mt-3 max-w-md text-[15px] text-plum-light">
            Enter your email and we&apos;ll send you a link to choose a new password.
          </p>
        </section>

        <form onSubmit={handleSubmit} className="mx-auto max-w-md px-6 py-12">
          <fieldset className="rounded-sm border border-cream-border bg-white p-6">
            <legend className="px-1 text-base font-medium text-ink">Your account</legend>
            <input
              name="email"
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-4 w-full rounded-sm border border-cream-border bg-cream px-3.5 py-2.5 text-sm text-ink outline-none placeholder:text-muted focus:border-plum"
            />
          </fieldset>

          {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="mt-8 w-full rounded-sm bg-plum py-4 text-[12px] font-semibold uppercase tracking-wider text-gold-light transition hover:bg-ink disabled:opacity-60"
          >
            {submitting ? 'Sending…' : 'Send reset link'}
          </button>

          <p className="mt-5 text-center text-sm text-plum-light">
            <Link href="/login" className="font-medium text-plum hover:underline">Back to log in</Link>
          </p>
        </form>
      </main>
      <Footer />
    </>
  )
}
