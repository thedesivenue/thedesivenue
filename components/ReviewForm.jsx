'use client'

import { useActionState, useState } from 'react'
import { submitReview } from '@/app/venues/[id]/actions'

export function ReviewForm({ venueId, existingReview }) {
  const [state, formAction, pending] = useActionState(submitReview, undefined)
  const [rating, setRating] = useState(existingReview?.rating || 0)
  const [hover, setHover] = useState(0)

  return (
    <form action={formAction} className="rounded-sm border border-cream-border bg-white p-5">
      <input type="hidden" name="venue_id" value={venueId} />
      <input type="hidden" name="rating" value={rating} />

      <p className="text-[11px] font-semibold uppercase tracking-wider text-ink">
        {existingReview ? 'Update your review' : 'Leave a review'}
      </p>

      <div className="mt-3 flex gap-1 text-2xl leading-none text-gold">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setRating(n)}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            className={n <= (hover || rating) ? '' : 'text-cream-border'}
            aria-label={`${n} star${n > 1 ? 's' : ''}`}
          >
            ★
          </button>
        ))}
      </div>

      <textarea
        name="comment"
        defaultValue={existingReview?.comment || ''}
        placeholder="Share your experience..."
        rows={3}
        className="mt-3 w-full resize-none rounded-sm border border-cream-border bg-cream px-3.5 py-2.5 text-sm text-ink outline-none placeholder:text-muted focus:border-plum"
      />

      {state?.error && <p className="mt-2 text-sm text-red-600">{state.error}</p>}
      {state?.success && <p className="mt-2 text-sm text-plum">✓ Review saved.</p>}

      <button
        type="submit"
        disabled={pending || rating === 0}
        className="mt-3 rounded-sm bg-plum px-5 py-2.5 text-[12px] font-semibold uppercase tracking-wider text-gold-light transition hover:bg-ink disabled:opacity-60"
      >
        {pending ? 'Submitting…' : existingReview ? 'Update review' : 'Submit review'}
      </button>
    </form>
  )
}
