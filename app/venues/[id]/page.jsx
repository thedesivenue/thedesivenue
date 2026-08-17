import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { InquiryForm } from '@/components/InquiryForm'
import { BackLink } from '@/components/ui/BackLink'
import { ImageGallery } from '@/components/ImageGallery'
import { StarRating } from '@/components/ui/StarRating'
import { ReviewForm } from '@/components/ReviewForm'
import { FavoriteButton } from '@/components/FavoriteButton'
import { ClaimForm } from '@/components/ClaimForm'
import { supabase } from '@/lib/supabase'
import { createClient as createServerSupabase } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { getOrCreateProfile } from '@/lib/profile'
import { FEATURE_LABELS } from '@/lib/features'

export const dynamic = 'force-dynamic'

async function getVenue(id) {
  const { data, error } = await supabase
    .from('venues')
    .select(`
      *,
      venue_features(*),
      venue_images(*),
      reviews(*)
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
    description: venue.description || `${venue.name} in ${venue.city}, NJ. An Indian-event-ready venue on The Desi Venue.`,
  }
}

export default async function VenueDetailPage({ params }) {
  const { id } = await params
  const venue = await getVenue(id)

  if (!venue) notFound()

  await supabaseAdmin.rpc('increment_venue_views', { venue_id_input: venue.id })

  const activeFeatures = venue.venue_features?.[0]
    ? Object.entries(venue.venue_features[0])
        .filter(([key, val]) => val === true && FEATURE_LABELS[key])
        .map(([key]) => FEATURE_LABELS[key])
    : []

  const reviews = [...(venue.reviews || [])].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  const avgRating = reviews.length ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0

  const serverSupabase = await createServerSupabase()
  const { data: { user } } = await serverSupabase.auth.getUser()
  const existingReview = user ? reviews.find((r) => r.user_id === user.id) : null

  let isFavorited = false
  if (user) {
    const { data: favorite } = await supabaseAdmin
      .from('favorites')
      .select('id')
      .eq('user_id', user.id)
      .eq('venue_id', venue.id)
      .maybeSingle()
    isFavorited = !!favorite
  }

  let showClaimForm = false
  let alreadyClaimed = false
  if (user && !venue.owner_id) {
    const profile = await getOrCreateProfile(user)
    if (profile.role === 'venue_owner') {
      showClaimForm = true
      const { data: claim } = await supabaseAdmin
        .from('venue_claims')
        .select('status')
        .eq('venue_id', venue.id)
        .eq('user_id', user.id)
        .maybeSingle()
      alreadyClaimed = !!claim && claim.status !== 'rejected'
    }
  }

  return (
    <>
      <Header />
      <main className="flex-1 bg-cream">

        <div className="mx-auto max-w-5xl px-6 pt-6">
          <BackLink href="/venues">Back to venues</BackLink>
        </div>

        <ImageGallery images={venue.venue_images} name={venue.name} />

        <section className="mx-auto grid max-w-5xl gap-10 px-6 py-12 lg:grid-cols-[1.5fr_1fr]">

          {/* Left: Details */}
          <div>
            <div className="flex items-start justify-between gap-4">
              <h1 className="font-display text-4xl font-bold text-ink">{venue.name}</h1>
              {user && (
                <FavoriteButton
                  venueId={venue.id}
                  initialFavorited={isFavorited}
                  className="mt-1 flex-none border border-cream-border hover:border-plum-light"
                />
              )}
            </div>
            <p className="mt-1.5 text-[15px] text-muted">
              {venue.address}, {venue.city}, {venue.state} {venue.zip}
            </p>

            {reviews.length > 0 && (
              <div className="mt-3 flex items-center gap-2">
                <StarRating value={avgRating} size="text-base" />
                <span className="text-[13px] text-muted">
                  {avgRating.toFixed(1)} ({reviews.length} review{reviews.length !== 1 ? 's' : ''})
                </span>
              </div>
            )}

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
                <h3 className="mt-10 text-[11px] font-semibold uppercase tracking-wider text-ink">Cultural features</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {activeFeatures.map((feature) => (
                    <span key={feature} className="rounded-sm border border-gold-border px-3 py-1.5 text-[11px] uppercase tracking-wide text-gold-ink">
                      {feature}
                    </span>
                  ))}
                </div>
              </>
            )}

            <h3 className="mt-10 text-[11px] font-semibold uppercase tracking-wider text-ink">
              Reviews {reviews.length > 0 ? `(${reviews.length})` : ''}
            </h3>

            {reviews.length === 0 && (
              <p className="mt-3 text-[15px] text-muted">No reviews yet.</p>
            )}

            {reviews.length > 0 && (
              <div className="mt-4 space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="rounded-sm border border-cream-border bg-white p-4">
                    <div className="flex items-center justify-between">
                      <StarRating value={review.rating} />
                      <span className="text-[11px] uppercase tracking-wide text-muted">
                        {new Date(review.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    {review.comment && <p className="mt-2 text-[14px] text-plum-light">{review.comment}</p>}
                  </div>
                ))}
              </div>
            )}

            <div className="mt-5">
              {user ? (
                <ReviewForm venueId={venue.id} existingReview={existingReview} />
              ) : (
                <p className="text-sm text-plum-light">
                  <Link href="/login" className="font-medium text-plum hover:underline">Log in</Link> to leave a review.
                </p>
              )}
            </div>
          </div>

          {/* Right: Inquiry Form */}
          <div className="h-fit space-y-5 lg:sticky lg:top-24">
            <div className="rounded-sm border border-cream-border bg-white p-6">
              <InquiryForm venueId={venue.id} venueName={venue.name} />
            </div>
            {showClaimForm && (
              <div className="bg-white">
                <ClaimForm venueId={venue.id} alreadyClaimed={alreadyClaimed} />
              </div>
            )}
          </div>

        </section>

      </main>
      <Footer />
    </>
  )
}
