'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { createClient } from '@/lib/supabase/client'

export default function SignupPage() {
  const [role, setRole] = useState('user')
  const [form, setForm] = useState({ full_name: '', email: '', phone: '', password: '' })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [awaitingConfirmation, setAwaitingConfirmation] = useState(false)

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    const supabase = createClient()
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: { role, full_name: form.full_name, phone: form.phone },
      },
    })

    if (signUpError) {
      setError(signUpError.message)
      setSubmitting(false)
      return
    }

    if (data.session) {
      window.location.href = '/account'
      return
    }

    setAwaitingConfirmation(true)
    setSubmitting(false)
  }

  if (awaitingConfirmation) {
    return (
      <>
        <Header />
        <main className="flex-1 bg-cream px-6 py-24 text-center">
          <p className="font-display text-2xl font-bold text-plum">Check your email ✦</p>
          <p className="mx-auto mt-3 max-w-md text-[15px] text-plum-light">
            We sent a confirmation link to {form.email}. Click it to activate your account, then log in.
          </p>
          <Link href="/login" className="mt-8 inline-block rounded-sm bg-plum px-7 py-3.5 text-[12px] font-semibold uppercase tracking-wider text-gold-light hover:bg-ink">
            Go to login
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
          <h1 className="font-display text-4xl font-bold text-ink sm:text-5xl">Create an account</h1>
          <p className="mx-auto mt-3 max-w-lg text-[15px] text-plum-light">
            Track your inquiries, or manage your venue listings as an owner or representative.
          </p>
        </section>

        <form onSubmit={handleSubmit} className="mx-auto max-w-md px-6 py-12">
          <fieldset className="rounded-sm border border-cream-border bg-white p-6">
            <legend className="px-1 text-base font-medium text-ink">I am a...</legend>
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => setRole('user')}
                className={role === 'user' ? activeToggle : inactiveToggle}
              >
                Event planner
              </button>
              <button
                type="button"
                onClick={() => setRole('venue_owner')}
                className={role === 'venue_owner' ? activeToggle : inactiveToggle}
              >
                Venue owner / rep
              </button>
            </div>
          </fieldset>

          <fieldset className="mt-6 rounded-sm border border-cream-border bg-white p-6">
            <legend className="px-1 text-base font-medium text-ink">Your details</legend>
            <div className="mt-4 grid gap-4">
              <input name="full_name" placeholder="Full name" required value={form.full_name} onChange={handleChange} className={inputClass} />
              <input name="email" type="email" placeholder="Email" required value={form.email} onChange={handleChange} className={inputClass} />
              <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} className={inputClass} />
              <input name="password" type="password" placeholder="Password" required minLength={6} value={form.password} onChange={handleChange} className={inputClass} />
            </div>
          </fieldset>

          {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="mt-8 w-full rounded-sm bg-plum py-4 text-[12px] font-semibold uppercase tracking-wider text-gold-light transition hover:bg-ink disabled:opacity-60"
          >
            {submitting ? 'Creating account…' : 'Create account'}
          </button>

          <p className="mt-5 text-center text-sm text-plum-light">
            Already have an account? <Link href="/login" className="font-medium text-plum hover:underline">Log in</Link>
          </p>
        </form>
      </main>
      <Footer />
    </>
  )
}

const inputClass =
  'w-full rounded-sm border border-cream-border bg-cream px-3.5 py-2.5 text-sm text-ink outline-none placeholder:text-muted focus:border-plum'

const activeToggle = 'flex-1 rounded-sm border border-plum bg-plum px-4 py-2.5 text-[12px] font-semibold uppercase tracking-wide text-gold-light'
const inactiveToggle = 'flex-1 rounded-sm border border-cream-border px-4 py-2.5 text-[12px] font-semibold uppercase tracking-wide text-plum-light hover:border-plum-light'
