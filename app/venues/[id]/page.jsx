'use client'

import { useState, useEffect, use } from 'react'
import Link from 'next/link'
import { supabase } from '../../../lib/supabase'

export default function VenueDetailPage({ params }) {
  const { id } = use(params)
  const [venue, setVenue] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({
    name: '', email: '', phone: '', event_date: '', guest_count: '', message: ''
  })

  useEffect(() => {
    fetchVenue()
  }, [id])

  const fetchVenue = async () => {
    const { data, error } = await supabase
      .from('venues')
      .select(`
        *,
        venue_features(*),
        venue_images(*)
      `)
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching venue:', error)
    } else {
      setVenue(data)
    }
    setLoading(false)
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { error } = await supabase
      .from('inquiries')
      .insert([{
        venue_id: venue.id,
        name: form.name,
        email: form.email,
        phone: form.phone,
        event_date: form.event_date || null,
        guest_count: form.guest_count ? parseInt(form.guest_count) : null,
        message: form.message
      }])

    if (error) {
      console.error('Error submitting inquiry:', error)
      alert('Something went wrong. Please try again.')
    } else {
      setSubmitted(true)
    }
  }

  const filterKeyMap = {
    mandap_allowed: 'Mandap allowed',
    fire_ceremony: 'Fire ceremony',
    vegetarian_kitchen: 'Veg kitchen',
    outside_catering: 'Outside catering',
    baraat_friendly: 'Baraat friendly',
    separate_bridal_room: 'Separate bridal room',
    multi_day_events: 'Multi-day events',
    late_night_events: 'Late night events',
    dj_allowed: 'DJ allowed',
    alcohol_allowed: 'Alcohol allowed',
  }

  if (loading) {
    return (
      <main style={{ padding: '64px', textAlign: 'center', color: '#9a8aaa' }}>
        Loading venue...
      </main>
    )
  }

  if (!venue) {
    return (
      <main style={{ padding: '64px', textAlign: 'center' }}>
        <p style={{ color: '#9a8aaa', marginBottom: '16px' }}>Venue not found.</p>
        <Link href="/venues" style={{ color: '#2d1b69' }}>← Back to venues</Link>
      </main>
    )
  }

  const activeFeatures = venue.venue_features?.[0]
    ? Object.entries(venue.venue_features[0])
        .filter(([key, val]) => val === true && filterKeyMap[key])
        .map(([key]) => filterKeyMap[key])
    : []

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
        <Link href="/venues" style={{ fontSize: '14px', color: '#6b5e8a', textDecoration: 'none' }}>
          ← Back to venues
        </Link>
      </nav>

      {/* Image */}
      <div style={{
        height: '320px',
        background: 'linear-gradient(135deg, #e8e0f5, #f5e8d5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#9a8aaa', fontSize: '16px', overflow: 'hidden'
      }}>
        {venue.venue_images?.[0] ? (
          <img
            src={venue.venue_images[0].url}
            alt={venue.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : 'Venue photos coming soon'}
      </div>

      <section style={{
        maxWidth: '960px', margin: '0 auto', padding: '32px',
        display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '32px'
      }}>

        {/* Left: Details */}
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 500, color: '#1a0f3c', marginBottom: '6px' }}>
            {venue.name}
          </h1>
          <p style={{ fontSize: '15px', color: '#9a8aaa', marginBottom: '20px' }}>
            {venue.address}, {venue.city}, {venue.state} {venue.zip}
          </p>

          <p style={{ fontSize: '15px', color: '#6b5e8a', lineHeight: 1.7, marginBottom: '24px' }}>
            {venue.description}
          </p>

          <div style={{ display: 'flex', gap: '24px', marginBottom: '24px' }}>
            <div>
              <p style={{ fontSize: '13px', color: '#9a8aaa' }}>Capacity</p>
              <p style={{ fontSize: '16px', fontWeight: 500, color: '#1a0f3c' }}>
                {venue.min_capacity}–{venue.max_capacity} guests
              </p>
            </div>
            <div>
              <p style={{ fontSize: '13px', color: '#9a8aaa' }}>Starting price</p>
              <p style={{ fontSize: '16px', fontWeight: 500, color: '#2d1b69' }}>
                {venue.min_price ? `$${venue.min_price.toLocaleString()}` : 'Contact for pricing'}
              </p>
            </div>
            <div>
              <p style={{ fontSize: '13px', color: '#9a8aaa' }}>Parking</p>
              <p style={{ fontSize: '16px', fontWeight: 500, color: '#1a0f3c' }}>
                {venue.parking ? 'Available' : 'Not available'}
              </p>
            </div>
          </div>

          {activeFeatures.length > 0 && (
            <>
              <h3 style={{ fontSize: '16px', fontWeight: 500, color: '#1a0f3c', marginBottom: '10px' }}>
                Cultural features
              </h3>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {activeFeatures.map((feature) => (
                  <span key={feature} style={{
                    background: '#f5f0e8', color: '#7a5c2e',
                    fontSize: '13px', padding: '6px 12px', borderRadius: '20px',
                    border: '0.5px solid #d4b97a'
                  }}>
                    {feature}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Right: Inquiry Form */}
        <div style={{
          background: '#ffffff', borderRadius: '12px',
          border: '0.5px solid #e8e0d5', padding: '24px',
          height: 'fit-content'
        }}>
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <p style={{ fontSize: '18px', fontWeight: 500, color: '#2d1b69', marginBottom: '8px' }}>
                Inquiry sent! ✦
              </p>
              <p style={{ fontSize: '14px', color: '#6b5e8a' }}>
                {venue.name} will reach out to you directly.
              </p>
            </div>
          ) : (
            <>
              <h3 style={{ fontSize: '18px', fontWeight: 500, color: '#1a0f3c', marginBottom: '16px' }}>
                Send an inquiry
              </h3>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <input name="name" placeholder="Your name" required value={form.name} onChange={handleChange} style={inputStyle} />
                <input name="email" type="email" placeholder="Email" required value={form.email} onChange={handleChange} style={inputStyle} />
                <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} style={inputStyle} />
                <input name="event_date" type="date" value={form.event_date} onChange={handleChange} style={inputStyle} />
                <input name="guest_count" type="number" placeholder="Number of guests" value={form.guest_count} onChange={handleChange} style={inputStyle} />
                <textarea name="message" placeholder="Tell us about your event..." value={form.message} onChange={handleChange} rows={3} style={{ ...inputStyle, resize: 'none' }} />
                <button type="submit" style={{
                  background: '#2d1b69', color: '#e8d5a3',
                  padding: '12px', borderRadius: '8px',
                  fontSize: '15px', fontWeight: 500, border: 'none',
                  cursor: 'pointer', marginTop: '4px'
                }}>
                  Send inquiry
                </button>
              </form>
            </>
          )}
        </div>

      </section>

    </main>
  )
}

const inputStyle = {
  padding: '10px 12px', borderRadius: '8px',
  border: '0.5px solid #e8e0d5', fontSize: '14px',
  background: '#faf8f5', color: '#1a0f3c', outline: 'none'
}