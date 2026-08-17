'use client'

import { useActionState } from 'react'
import { submitClaim } from '@/app/venues/[id]/actions'

export function ClaimForm({ venueId, alreadyClaimed }) {
  const [state, formAction, pending] = useActionState(submitClaim, undefined)

  if (state?.success || alreadyClaimed) {
    return (
      <div className="rounded-sm border border-gold-border p-5">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-gold-ink">Claim submitted</p>
        <p className="mt-2 text-[13px] text-plum-light">
          We&apos;ll review your claim and get back to you. Once approved, this listing will move to your account.
        </p>
      </div>
    )
  }

  return (
    <form action={formAction} className="rounded-sm border border-cream-border p-5">
      <input type="hidden" name="venue_id" value={venueId} />
      <p className="text-[11px] font-semibold uppercase tracking-wider text-ink">Is this your venue?</p>
      <p className="mt-2 text-[13px] text-plum-light">
        This listing hasn&apos;t been claimed yet. If it&apos;s yours, claim it to manage details, photos, and inquiries.
      </p>
      <textarea
        name="message"
        placeholder="Anything that helps us verify this is your venue (optional)"
        rows={2}
        className="mt-3 w-full resize-none rounded-sm border border-cream-border bg-cream px-3.5 py-2.5 text-sm text-ink outline-none placeholder:text-muted focus:border-plum"
      />
      {state?.error && <p className="mt-2 text-sm text-red-600">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="mt-3 rounded-sm border border-plum px-4 py-2.5 text-[12px] font-semibold uppercase tracking-wider text-plum transition hover:bg-plum hover:text-gold-light disabled:opacity-60"
      >
        {pending ? 'Submitting…' : 'Claim this listing'}
      </button>
    </form>
  )
}
