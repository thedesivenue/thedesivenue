'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    const supabase = createClient()
    const { error: signInError } = await supabase.auth.signInWithPassword(form)

    if (signInError) {
      setError(signInError.message)
      setSubmitting(false)
      return
    }

    window.location.href = '/account'
  }

  return (
    <>
      <Header />
      <main className="flex-1 bg-cream">
        <section className="border-b border-cream-border bg-white px-6 py-14 text-center">
          <h1 className="font-display text-4xl font-bold text-ink sm:text-5xl">Log in</h1>
        </section>

        <form onSubmit={handleSubmit} className="mx-auto max-w-md px-6 py-12">
          <fieldset className="rounded-sm border border-cream-border bg-white p-6">
            <legend className="px-1 text-base font-medium text-ink">Your account</legend>
            <div className="mt-4 grid gap-4">
              <input name="email" type="email" placeholder="Email" required value={form.email} onChange={handleChange} className={inputClass} />
              <input name="password" type="password" placeholder="Password" required value={form.password} onChange={handleChange} className={inputClass} />
            </div>
          </fieldset>

          {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="mt-8 w-full rounded-sm bg-plum py-4 text-[12px] font-semibold uppercase tracking-wider text-gold-light transition hover:bg-ink disabled:opacity-60"
          >
            {submitting ? 'Logging in…' : 'Log in'}
          </button>

          <p className="mt-5 text-center text-sm text-plum-light">
            No account yet? <Link href="/signup" className="font-medium text-plum hover:underline">Sign up</Link>
          </p>
        </form>
      </main>
      <Footer />
    </>
  )
}

const inputClass =
  'w-full rounded-sm border border-cream-border bg-cream px-3.5 py-2.5 text-sm text-ink outline-none placeholder:text-muted focus:border-plum'
