'use client'
import { use } from 'react'
import { useState } from 'react'
import Link from 'next/link'

const mockVenues = [
  {
    id: '1',
    name: 'Royal Banquet Hall',
    city: 'Edison',
    address: '123 Oak Tree Rd, Edison, NJ',
    min_capacity: 100,
    max_capacity: 500,
    min_price: 8000,
    description: 'A spacious banquet hall designed for grand Indian celebrations, with a dedicated mandap setup area and full vegetarian kitchen.',
    tags: ['Mandap allowed', 'Veg kitchen', 'Fire ceremony', 'Outside catering', 'Baraat friendly'],
    parking: true,
    indoor: true,
    outdoor: false,
  },
  {
    id: '2',
    name: 'Grand Celebration',
    city: 'Iselin',
    address: '456 Green St, Iselin, NJ',
    min_capacity: 50,
    max_capacity: 300,
    min_price: 5500,
    description: 'An elegant indoor venue perfect for mid-size weddings and cultural events with flexible catering options.',
    tags: ['Fire ceremony', 'Baraat friendly', 'DJ allowed'],
    parking: true,
    indoor: true,
    outdoor: false,
  },
  {
    id: '3',
    name: 'Sapphire Palace',
    city: 'Woodbridge',
    address: '789 Main St, Woodbridge, NJ',
    min_capacity: 200,
    max_capacity: 800,
    min_price: 12000,
    description: 'A premium banquet venue with both indoor and outdoor spaces, ideal for large multi-day wedding celebrations.',
    tags: ['Mandap allowed', 'Outside catering', 'Late night events'],
    parking: true,
    indoor: true,
    outdoor: true,
  },
  {
    id: '4',
    name: 'The Heritage Hall',
    city: 'Piscataway',
    address: '321 River Rd, Piscataway, NJ',
    min_capacity: 80,
    max_capacity: 250,
    min_price: 4000,
    description: 'A warm and intimate venue suited for poojas, engagements, and smaller family gatherings.',
    tags: ['Veg kitchen', 'Multi-day events', 'Mandap allowed'],
    parking: true,
    indoor: true,
    outdoor: false,
  },
]

export default function VenueDetailPage({ params }) {
  const { id } = use(params)
  const venue = mockVenues.find((v) => v.id === id)
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({
    name: '', email: '', phone: '', event_date: '', guest_count: '', message: ''
  })

  if (!venue) {
    return (
      <main style={{ padding: '64px', textAlign: 'center' }}>
        <p>Venue not found.</p>
        <Link href="/venues" style={{ color: '#2d1b69' }}>Back to venues</Link>
      </main>
    )
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // For now just simulate submission - we'll connect Supabase next
    setSubmitted(true)
  }

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
        color: '#9a8aaa', fontSize: '16px'
      }}>
        Venue photos coming soon
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
            {venue.address}
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
                ${venue.min_price.toLocaleString()}
              </p>
            </div>
            <div>
              <p style={{ fontSize: '13px', color: '#9a8aaa' }}>Parking</p>
              <p style={{ fontSize: '16px', fontWeight: 500, color: '#1a0f3c' }}>
                {venue.parking ? 'Available' : 'Not available'}
              </p>
            </div>
          </div>

          <h3 style={{ fontSize: '16px', fontWeight: 500, color: '#1a0f3c', marginBottom: '10px' }}>
            Cultural features
          </h3>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {venue.tags.map((tag) => (
              <span key={tag} style={{
                background: '#f5f0e8', color: '#7a5c2e',
                fontSize: '13px', padding: '6px 12px', borderRadius: '20px',
                border: '0.5px solid #d4b97a'
              }}>
                {tag}
              </span>
            ))}
          </div>
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
                <input
                  name="name" placeholder="Your name" required
                  value={form.name} onChange={handleChange}
                  style={inputStyle}
                />
                <input
                  name="email" type="email" placeholder="Email" required
                  value={form.email} onChange={handleChange}
                  style={inputStyle}
                />
                <input
                  name="phone" placeholder="Phone"
                  value={form.phone} onChange={handleChange}
                  style={inputStyle}
                />
                <input
                  name="event_date" type="date"
                  value={form.event_date} onChange={handleChange}
                  style={inputStyle}
                />
                <input
                  name="guest_count" type="number" placeholder="Number of guests"
                  value={form.guest_count} onChange={handleChange}
                  style={inputStyle}
                />
                <textarea
                  name="message" placeholder="Tell us about your event..."
                  value={form.message} onChange={handleChange}
                  rows={3}
                  style={{ ...inputStyle, resize: 'none' }}
                />
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