import { notFound } from 'next/navigation'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { InquiryForm } from '@/components/InquiryForm'
import { BackLink } from '@/components/ui/BackLink'
import { supabase } from '@/lib/supabase'
import { FEATURE_LABELS } from '@/lib/features'

async function getVenue(id) {
  const { data, error } = await supabase
    .from('venues')
    .select(`
      *,
      venue_features(*),
      venue_images(*)
    `)
    .eq('id', id)
    .single()

  if (error) return null
  return data
}

export async function generateMetadata({ params }) {
  const { id } = await params
  const venue = await getVenue(id)
  if (!venue) return { title: 'Venue not found' }
  return {
    title: venue.name,
    description: venue.description || `${venue.name} in ${venue.city}, NJ — an Indian-event-ready venue on The Desi Venue.`,
  }
}

export default async function VenueDetailPage({ params }) {
  const { id } = await params
  const venue = await getVenue(id)

  if (!venue) notFound()

  const activeFeatures = venue.venue_features?.[0]
    ? Object.entries(venue.venue_features[0])
        .filter(([key, val]) => val === true && FEATURE_LABELS[key])
        .map(([key]) => FEATURE_LABELS[key])
    : []

  return (
    <>
      <Header />
      <main className="flex-1 bg-cream">

        <div className="mx-auto max-w-5xl px-6 pt-6">
          <BackLink href="/venues">Back to venues</BackLink>
        </div>

        {/* Image */}
        <div className="bg-motif flex h-64 items-center justify-center overflow-hidden bg-gradient-to-br from-plum-pale to-gold-pale sm:h-80">
          {venue.venue_images?.[0] ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={venue.venue_images[0].url}
              alt={venue.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="font-display text-4xl text-plum/20">✦</span>
          )}
        </div>

        <section className="mx-auto grid max-w-5xl gap-10 px-6 py-12 lg:grid-cols-[1.5fr_1fr]">

          {/* Left: Details */}
          <div>
            <h1 className="font-display text-3xl font-medium text-ink">{venue.name}</h1>
            <p className="mt-1.5 text-[15px] text-muted">
              {venue.address}, {venue.city}, {venue.state} {venue.zip}
            </p>

            <p className="mt-6 text-[15px] leading-relaxed text-plum-light">
              {venue.description}
            </p>

            <div className="mt-8 flex flex-wrap gap-8">
              <div>
                <p className="text-[13px] text-muted">Capacity</p>
                <p className="mt-1 text-base font-medium text-ink">
                  {venue.min_capacity}–{venue.max_capacity} guests
                </p>
              </div>
              <div>
                <p className="text-[13px] text-muted">Starting price</p>
                <p className="mt-1 text-base font-medium text-plum">
                  {venue.min_price ? `$${Number(venue.min_price).toLocaleString()}` : 'Contact for pricing'}
                </p>
              </div>
              <div>
                <p className="text-[13px] text-muted">Parking</p>
                <p className="mt-1 text-base font-medium text-ink">
                  {venue.parking ? 'Available' : 'Not available'}
                </p>
              </div>
            </div>

            {activeFeatures.length > 0 && (
              <>
                <h3 className="mt-10 text-base font-medium text-ink">Cultural features</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {activeFeatures.map((feature) => (
                    <span key={feature} className="rounded-full border border-gold-border bg-gold-pale px-3 py-1.5 text-[13px] text-gold-ink">
                      {feature}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Right: Inquiry Form */}
          <div className="h-fit rounded-2xl border border-cream-border bg-white p-6 lg:sticky lg:top-24">
            <InquiryForm venueId={venue.id} venueName={venue.name} />
          </div>

        </section>

      </main>
      <Footer />
    </>
  )
}
