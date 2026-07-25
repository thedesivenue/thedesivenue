'use client'

import { useState } from 'react'
import { VenueCard } from '@/components/VenueCard'
import { CULTURAL_FEATURES } from '@/lib/features'

const listFilters = CULTURAL_FEATURES.slice(0, 8)

export function VenuesBrowser({ venues }) {
  const [activeFilters, setActiveFilters] = useState([])
  const [search, setSearch] = useState('')

  const toggleFilter = (key) => {
    setActiveFilters((prev) =>
      prev.includes(key) ? prev.filter((f) => f !== key) : [...prev, key]
    )
  }

  const filtered = venues.filter((venue) => {
    const matchesSearch =
      venue.name.toLowerCase().includes(search.toLowerCase()) ||
      venue.city.toLowerCase().includes(search.toLowerCase())

    const matchesFilters =
      activeFilters.length === 0 ||
      activeFilters.every((key) => venue.venue_features?.[0]?.[key] === true)

    return matchesSearch && matchesFilters
  })

  return (
    <>
      {/* Search */}
      <section className="border-b border-cream-border bg-white px-6 py-6">
        <input
          type="text"
          placeholder="Search by venue name or city..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-xl rounded-lg border border-gold-border bg-cream px-4 py-3 text-[15px] text-ink outline-none placeholder:text-muted focus:border-plum"
        />
      </section>

      {/* Filters */}
      <section className="flex flex-wrap items-center gap-2.5 border-b border-cream-border bg-white px-6 py-4">
        {listFilters.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => toggleFilter(key)}
            className={
              activeFilters.includes(key)
                ? 'rounded-full border border-plum bg-plum px-3.5 py-1.5 text-[13px] text-gold-light'
                : 'rounded-full border border-gold-border bg-gold-pale px-3.5 py-1.5 text-[13px] text-gold-ink hover:border-plum-light'
            }
          >
            {label}
          </button>
        ))}
        {activeFilters.length > 0 && (
          <button
            onClick={() => setActiveFilters([])}
            className="rounded-full border border-cream-border px-3.5 py-1.5 text-[13px] text-muted hover:text-plum"
          >
            Clear all
          </button>
        )}
      </section>

      {/* Results count */}
      <section className="px-6 py-4">
        <p className="text-sm text-muted">
          {filtered.length} venue{filtered.length !== 1 ? 's' : ''} found
        </p>
      </section>

      {/* Cards */}
      <section className="grid grid-cols-1 gap-6 px-6 pb-16 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.length === 0 ? (
          <p className="col-span-full text-[15px] text-muted">
            No venues found. Try removing some filters.
          </p>
        ) : (
          filtered.map((venue) => <VenueCard key={venue.id} venue={venue} />)
        )}
      </section>
    </>
  )
}
