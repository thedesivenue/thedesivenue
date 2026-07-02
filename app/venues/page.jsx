'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '../../lib/supabase'

const filters = [
  'Mandap allowed',
  'Fire ceremony',
  'Veg kitchen',
  'Outside catering',
  'Baraat friendly',
  'Multi-day events',
  'Late night events',
  'DJ allowed',
]

export default function VenuesPage() {
  const [venues, setVenues] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeFilters, setActiveFilters] = useState([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchVenues()
  }, [])

  const fetchVenues = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('venues')
      .select(`
        *,
        venue_features(*),
        venue_images(*)
      `)
      .eq('is_approved', true)

    if (error) {
      console.error('Error fetching venues:', error)
    } else {
      setVenues(data || [])
    }
    setLoading(false)
  }

  const toggleFilter = (filter) => {
    setActiveFilters((prev) =>
      prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]
    )
  }

  const filterKeyMap = {
    'Mandap allowed': 'mandap_allowed',
    'Fire ceremony': 'fire_ceremony',
    'Veg kitchen': 'vegetarian_kitchen',
    'Outside catering': 'outside_catering',
    'Baraat friendly': 'baraat_friendly',
    'Multi-day events': 'multi_day_events',
    'Late night events': 'late_night_events',
    'DJ allowed': 'dj_allowed',
  }

  const filtered = venues.filter((venue) => {
    const matchesSearch =
      venue.name.toLowerCase().includes(search.toLowerCase()) ||
      venue.city.toLowerCase().includes(search.toLowerCase())

    const matchesFilters =
      activeFilters.length === 0 ||
      activeFilters.every((f) => {
        const key = filterKeyMap[f]
        return venue.venue_features?.[0]?.[key] === true
      })

    return matchesSearch && matchesFilters
  })

  return (
    <main style={{ minHeight: '100vh', background: '#faf8f5' }}>

      {/* Nav */}
      <nav style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '14px 32px', background: '#ffffff',
        borderBottom: '0.5px solid #e8e0d5'
      }}>
        <Link href="/" style={{ fontSize: '18px', fontWeight: 500, color: '#2d1b69', textDecoration: 'none' }}>
          The Desi Venue
        </Link>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <Link href="/venues" style={{ fontSize: '14px', color: '#6b5e8a', textDecoration: 'none' }}>
            Browse Venues
          </Link>
          <Link href="/list-venue" style={{
            background: '#2d1b69', color: '#e8d5a3',
            padding: '8px 18px', borderRadius: '8px',
            fontSize: '14px', textDecoration: 'none'
          }}>
            List Your Venue
          </Link>
        </div>
      </nav>

      {/* Search */}
      <section style={{
        background: '#ffffff', padding: '24px 32px',
        borderBottom: '0.5px solid #e8e0d5'
      }}>
        <input
          type="text"
          placeholder="Search by venue name or city..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: '100%', maxWidth: '560px',
            padding: '12px 16px', borderRadius: '8px',
            border: '0.5px solid #d4b97a', fontSize: '15px',
            background: '#faf8f5', color: '#1a0f3c', outline: 'none'
          }}
        />
      </section>

      {/* Filters */}
      <section style={{
        display: 'flex', gap: '10px', padding: '16px 32px',
        background: '#ffffff', borderBottom: '0.5px solid #e8e0d5',
        flexWrap: 'wrap'
      }}>
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => toggleFilter(filter)}
            style={{
              background: activeFilters.includes(filter) ? '#2d1b69' : '#f5f0e8',
              color: activeFilters.includes(filter) ? '#e8d5a3' : '#7a5c2e',
              fontSize: '13px', padding: '6px 14px', borderRadius: '20px',
              border: activeFilters.includes(filter) ? '0.5px solid #2d1b69' : '0.5px solid #d4b97a',
              cursor: 'pointer'
            }}
          >
            {filter}
          </button>
        ))}
        {activeFilters.length > 0 && (
          <button
            onClick={() => setActiveFilters([])}
            style={{
              background: 'transparent', color: '#9a8aaa',
              fontSize: '13px', padding: '6px 14px', borderRadius: '20px',
              border: '0.5px solid #e8e0d5', cursor: 'pointer'
            }}
          >
            Clear all
          </button>
        )}
      </section>

      {/* Results */}
      <section style={{ padding: '16px 32px' }}>
        <p style={{ fontSize: '14px', color: '#9a8aaa' }}>
          {loading ? 'Loading venues...' : `${filtered.length} venue${filtered.length !== 1 ? 's' : ''} found`}
        </p>
      </section>

      {/* Cards */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '24px', padding: '0 32px 48px'
      }}>
        {loading ? (
          <p style={{ color: '#9a8aaa', fontSize: '15px' }}>Loading...</p>
        ) : filtered.length === 0 ? (
          <p style={{ color: '#9a8aaa', fontSize: '15px', gridColumn: '1/-1' }}>
            No venues found. Try removing some filters.
          </p>
        ) : (
          filtered.map((venue) => (
            <div key={venue.id} style={{
              background: '#ffffff', borderRadius: '12px',
              border: '0.5px solid #e8e0d5', overflow: 'hidden'
            }}>
              <div style={{
                height: '180px',
                background: 'linear-gradient(135deg, #e8e0f5, #f5e8d5)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#9a8aaa', fontSize: '14px'
              }}>
                {venue.venue_images?.[0] ? (
                  <img src={venue.venue_images[0].url} alt={venue.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : 'Venue photo'}
              </div>

              <div style={{ padding: '16px' }}>
                <h3 style={{ fontSize: '17px', fontWeight: 500, color: '#1a0f3c', marginBottom: '4px' }}>
                  {venue.name}
                </h3>
                <p style={{ fontSize: '13px', color: '#9a8aaa', marginBottom: '12px' }}>
                  {venue.city}, NJ · Up to {venue.max_capacity} guests
                </p>

                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>
                  {venue.venue_features?.[0] && Object.entries(venue.venue_features[0])
                    .filter(([key, val]) => val === true && key !== 'id' && key !== 'venue_id')
                    .slice(0, 3)
                    .map(([key]) => (
                      <span key={key} style={{
                        background: '#f5f0e8', color: '#7a5c2e',
                        fontSize: '11px', padding: '3px 8px', borderRadius: '10px'
                      }}>
                        {Object.keys(filterKeyMap).find(k => filterKeyMap[k] === key) || key}
                      </span>
                    ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', fontWeight: 500, color: '#2d1b69' }}>
                    {venue.min_price ? `From $${venue.min_price.toLocaleString()}` : 'Contact for pricing'}
                  </span>
                  <Link href={`/venues/${venue.id}`} style={{
                    background: '#2d1b69', color: '#e8d5a3',
                    padding: '7px 14px', borderRadius: '8px',
                    fontSize: '13px', textDecoration: 'none'
                  }}>
                    View details
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </section>

    </main>
  )
}