'use client'

import { useActionState } from 'react'
import { login } from '../actions'

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState(login, undefined)

  return (
    <main className="flex min-h-screen items-center justify-center bg-cream px-6">
      <form action={formAction} className="w-full max-w-sm rounded-2xl border border-cream-border bg-white p-8">
        <h1 className="font-display text-2xl font-medium text-ink">Admin login</h1>
        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          autoFocus
          className="mt-6 w-full rounded-lg border border-cream-border bg-cream px-3.5 py-2.5 text-sm text-ink outline-none placeholder:text-muted focus:border-plum"
        />
        {state?.error && <p className="mt-3 text-sm text-red-600">{state.error}</p>}
        <button
          type="submit"
          disabled={pending}
          className="mt-5 w-full rounded-lg bg-plum py-3 text-sm font-medium text-gold-light transition hover:bg-ink disabled:opacity-60"
        >
          {pending ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </main>
  )
}
