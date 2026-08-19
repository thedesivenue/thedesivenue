'use client'

import { useMemo, useState } from 'react'
import { VenueCard } from '@/components/VenueCard'
import { Pill } from '@/components/ui/Pill'
import { CULTURAL_FEATURES } from '@/lib/features'

const listFilters = CULTURAL_FEATURES.slice(0, 8)

const sortOptions = [
  { value: '', label: 'Sort: Recommended' },
  { value: 'price-asc', label: 'Price: Low to high' },
  { value: 'price-desc', label: 'Price: High to low' },
  { value: 'capacity-desc', label: 'Capacity: Largest first' },
]

const selectClass =
  'rounded-sm border border-cream-border bg-white px-3.5 py-2.5 text-sm text-ink outline-none focus:border-plum'

export function VenuesBrowser({ venues, showFavorite = false, favoritedIds = [], hideCityFilter = false }) {
  const favoritedSet = new Set(favoritedIds)
  const [activeFilters, setActiveFilters] = useState([])
  const [search, setSearch] = useState('')
  const [city, setCity] = useState('')
  const [minGuests, setMinGuests] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [sortBy, setSortBy] = useState('')

  const cities = useMemo(
    () => [...new Set(venues.map((v) => v.city).filter(Boolean))].sort(),
    [venues]
  )

  const toggleFilter = (key) => {
    setActiveFilters((prev) =>
      prev.includes(key) ? prev.filter((f) => f !== key) : [...prev, key]
    )
  }

  const hasActiveFilters =
    activeFilters.length > 0 || city || minGuests || maxPrice || sortBy

  const clearAll = () => {
    setActiveFilters([])
    setCity('')
    setMinGuests('')
    setMaxPrice('')
    setSortBy('')
  }

  const filtered = venues
    .filter((venue) => {
      const matchesSearch =
        venue.name.toLowerCase().includes(search.toLowerCase()) ||
        venue.city.toLowerCase().includes(search.toLowerCase())

      const matchesFilters =
        activeFilters.length === 0 ||
        activeFilters.every((key) => venue.venue_features?.[0]?.[key] === true)

      const matchesCity = !city || venue.city === city

      const matchesGuests =
        !minGuests || (venue.max_capacity != null && Number(venue.max_capacity) >= Number(minGuests))

      const matchesPrice =
        !maxPrice || (venue.min_price != null && Number(venue.min_price) <= Number(maxPrice))

      return matchesSearch && matchesFilters && matchesCity && matchesGuests && matchesPrice
    })
    .sort((a, b) => {
      const premiumDiff = (b.is_premium ? 1 : 0) - (a.is_premium ? 1 : 0)
      if (premiumDiff !== 0) return premiumDiff
      if (sortBy === 'price-asc') return (a.min_price ?? Infinity) - (b.min_price ?? Infinity)
      if (sortBy === 'price-desc') return (b.min_price ?? -Infinity) - (a.min_price ?? -Infinity)
      if (sortBy === 'capacity-desc') return (b.max_capacity ?? 0) - (a.max_capacity ?? 0)
      return 0
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
          className="w-full max-w-xl rounded-sm border border-cream-border bg-cream px-4 py-3 text-[15px] text-ink outline-none placeholder:text-muted focus:border-plum"
        />
      </section>

      {/* Refine: city, guests, price, sort */}
      <section className="flex flex-wrap items-center gap-3 border-b border-cream-border bg-white px-6 py-4">
        {!hideCityFilter && (
          <select value={city} onChange={(e) => setCity(e.target.value)} className={selectClass}>
            <option value="">All cities</option>
            {cities.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        )}

        <input
          type="number"
          min="0"
          placeholder="Guest count"
          value={minGuests}
          onChange={(e) => setMinGuests(e.target.value)}
          className={`${selectClass} w-32 placeholder:text-muted`}
        />

        <input
          type="number"
          min="0"
          placeholder="Max budget ($)"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className={`${selectClass} w-36 placeholder:text-muted`}
        />

        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className={selectClass}>
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </section>

      {/* Cultural filters */}
      <section className="flex flex-wrap items-center gap-2.5 border-b border-cream-border bg-white px-6 py-4">
        {listFilters.map(({ key, label }) => (
          <Pill key={key} as="button" onClick={() => toggleFilter(key)} active={activeFilters.includes(key)}>
            {label}
          </Pill>
        ))}
        {hasActiveFilters && (
          <button
            onClick={clearAll}
            className="rounded-sm border border-transparent px-3.5 py-1.5 text-[11px] uppercase tracking-wide text-muted hover:text-plum"
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
          filtered.map((venue) => (
            <VenueCard
              key={venue.id}
              venue={venue}
              showFavorite={showFavorite}
              isFavorited={favoritedSet.has(venue.id)}
            />
          ))
        )}
      </section>
    </>
  )
}
