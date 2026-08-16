'use client'

import { useState, useTransition } from 'react'
import { toggleFavorite } from '@/app/venues/[id]/actions'

export function FavoriteButton({ venueId, initialFavorited, className = '' }) {
  const [favorited, setFavorited] = useState(initialFavorited)
  const [pending, startTransition] = useTransition()

  const handleClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const next = !favorited
    setFavorited(next)
    startTransition(async () => {
      const result = await toggleFavorite(venueId)
      if (result?.error) setFavorited(!next)
    })
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      aria-label={favorited ? 'Remove from saved venues' : 'Save venue'}
      aria-pressed={favorited}
      className={`flex h-9 w-9 items-center justify-center rounded-sm text-lg transition ${className}`}
    >
      <span aria-hidden className={favorited ? 'text-plum' : 'text-plum/30'}>
        {favorited ? '♥' : '♡'}
      </span>
    </button>
  )
}
