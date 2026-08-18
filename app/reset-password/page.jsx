'use client'

import { useEffect, useState } from 'react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { createClient } from '@/lib/supabase/client'

export default function ResetPasswordPage() {
  const [ready, setReady] = useState(false)
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    // AuthHashHandler (mounted globally) processes the recovery link's hash
    // and establishes the session before redirecting here — just confirm
    // there's actually a session by the time this page is interactive.
    supabase.auth.getSession().then(({ data }) => setReady(!!data.session))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    setSubmitting(true)
    setError('')

    const supabase = createClient()
    const { error: updateError } = await supabase.auth.updateUser({ password })

    if (updateError) {
      setError(updateError.message)
      setSubmitting(false)
      return
    }

    setDone(true)
    setSubmitting(false)
  }

  if (done) {
    return (
      <>
        <Header />
        <main className="flex-1 bg-cream px-6 py-24 text-center">
          <p className="font-display text-2xl font-bold text-plum">Password updated ✦</p>
          <p className="mx-auto mt-3 max-w-md text-[15px] text-plum-light">
            You&apos;re all set — you can now log in with your new password.
          </p>
          <a href="/account" className="mt-8 inline-block rounded-sm bg-plum px-7 py-3.5 text-[12px] font-semibold uppercase tracking-wider text-gold-light hover:bg-ink">
            Go to your account
          </a>
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
          <h1 className="font-display text-4xl font-bold text-ink sm:text-5xl">Choose a new password</h1>
        </section>

        <form onSubmit={handleSubmit} className="mx-auto max-w-md px-6 py-12">
          {!ready && (
            <p className="mb-4 text-sm text-plum-light">
              Waiting to confirm your reset link…
            </p>
          )}
          <fieldset className="rounded-sm border border-cream-border bg-white p-6">
            <legend className="px-1 text-base font-medium text-ink">New password</legend>
            <div className="mt-4 grid gap-4">
              <input
                type="password"
                placeholder="New password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-sm border border-cream-border bg-cream px-3.5 py-2.5 text-sm text-ink outline-none placeholder:text-muted focus:border-plum"
              />
              <input
                type="password"
                placeholder="Confirm new password"
                required
                minLength={6}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="w-full rounded-sm border border-cream-border bg-cream px-3.5 py-2.5 text-sm text-ink outline-none placeholder:text-muted focus:border-plum"
              />
            </div>
          </fieldset>

          {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={submitting || !ready}
            className="mt-8 w-full rounded-sm bg-plum py-4 text-[12px] font-semibold uppercase tracking-wider text-gold-light transition hover:bg-ink disabled:opacity-60"
          >
            {submitting ? 'Saving…' : 'Save new password'}
          </button>
        </form>
      </main>
      <Footer />
    </>
  )
}
