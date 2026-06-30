import Link from 'next/link'

export default function Home() {
  return (
    <main style={{ minHeight: '100vh', background: '#faf8f5' }}>

      {/* Nav */}
      <nav style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '14px 32px', background: '#ffffff',
        borderBottom: '0.5px solid #e8e0d5'
      }}>
        <span style={{ fontSize: '18px', fontWeight: 500, color: '#2d1b69', letterSpacing: '0.3px' }}>
          The Desi Venue
        </span>
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

      {/* Hero */}
      <section style={{
        background: '#faf8f5', padding: '64px 32px',
        textAlign: 'center', borderBottom: '0.5px solid #e8e0d5'
      }}>
        <div style={{
          display: 'inline-block', background: '#f5f0e8', color: '#9a7d3a',
          fontSize: '13px', padding: '5px 16px', borderRadius: '20px',
          border: '0.5px solid #d4b97a', marginBottom: '20px'
        }}>
          ✦ New Jersey's Indian venue platform
        </div>
        <h1 style={{
          fontSize: '48px', fontWeight: 500, color: '#1a0f3c',
          lineHeight: 1.2, marginBottom: '16px'
        }}>
          Find the perfect venue<br />for your Indian event
        </h1>
        <p style={{ fontSize: '18px', color: '#6b5e8a', marginBottom: '32px', maxWidth: '560px', margin: '0 auto 32px' }}>
          Mandap-ready halls, cultural filters, transparent pricing — all in one place
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <Link href="/venues" style={{
            background: '#2d1b69', color: '#e8d5a3',
            padding: '12px 28px', borderRadius: '8px',
            fontSize: '16px', textDecoration: 'none', fontWeight: 500
          }}>
            Browse Venues
          </Link>
          <Link href="/list-venue" style={{
            background: '#ffffff', color: '#2d1b69',
            padding: '12px 28px', borderRadius: '8px',
            fontSize: '16px', textDecoration: 'none',
            border: '0.5px solid #2d1b69'
          }}>
            List Your Venue Free
          </Link>
        </div>
      </section>

      {/* Cultural Filters Strip */}
      <section style={{
        display: 'flex', gap: '10px', padding: '16px 32px',
        background: '#ffffff', borderBottom: '0.5px solid #e8e0d5',
        flexWrap: 'wrap'
      }}>
        {['Mandap allowed', 'Fire ceremony', 'Veg kitchen', 'Outside catering', 'Baraat friendly', 'Multi-day events'].map((filter) => (
          <span key={filter} style={{
            background: '#f5f0e8', color: '#7a5c2e',
            fontSize: '13px', padding: '6px 14px',
            borderRadius: '20px', border: '0.5px solid #d4b97a'
          }}>
            {filter}
          </span>
        ))}
      </section>

      {/* Features */}
      <section style={{ padding: '64px 32px', maxWidth: '960px', margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontSize: '32px', fontWeight: 500, color: '#1a0f3c', marginBottom: '48px' }}>
          Built for Indian events
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
          {[
            { title: 'Cultural filters', desc: 'Filter by mandap, fire ceremony, vegetarian kitchen and more' },
            { title: 'Transparent pricing', desc: 'See real pricing upfront — no surprises or hidden fees' },
            { title: 'Direct inquiries', desc: 'Contact venues directly — no middleman, no delays' },
          ].map((f) => (
            <div key={f.title} style={{
              background: '#ffffff', borderRadius: '12px',
              border: '0.5px solid #e8e0d5', padding: '28px 24px'
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: 500, color: '#2d1b69', marginBottom: '10px' }}>
                {f.title}
              </h3>
              <p style={{ fontSize: '15px', color: '#6b5e8a', lineHeight: 1.6 }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{
        background: '#2d1b69', color: '#e8d5a3',
        textAlign: 'center', padding: '64px 32px'
      }}>
        <h2 style={{ fontSize: '32px', fontWeight: 500, marginBottom: '12px' }}>
          Own a venue?
        </h2>
        <p style={{ fontSize: '18px', opacity: 0.85, marginBottom: '32px' }}>
          List your venue for free and get discovered by thousands of Indian families in NJ
        </p>
        <Link href="/list-venue" style={{
          background: '#c9a84c', color: '#1a0f3c',
          padding: '12px 32px', borderRadius: '8px',
          fontSize: '16px', fontWeight: 500, textDecoration: 'none'
        }}>
          List your venue free
        </Link>
      </section>

      {/* Footer */}
      <footer style={{
        textAlign: 'center', padding: '24px',
        borderTop: '0.5px solid #e8e0d5', color: '#9a8aaa', fontSize: '14px'
      }}>
        © 2025 The Desi Venue · Built for the Indian community in NJ
      </footer>

    </main>
  )
}