import Link from 'next/link'
import { FEATURE_LABELS } from '@/lib/features'
import { StarRating } from '@/components/ui/StarRating'
import { FavoriteButton } from '@/components/FavoriteButton'

export function VenueCard({ venue, showFavorite = false, isFavorited = false }) {
  const image = venue.venue_images?.[0]?.url
  const activeFeatures = venue.venue_features?.[0]
    ? Object.entries(venue.venue_features[0])
        .filter(([key, val]) => val === true && FEATURE_LABELS[key])
        .slice(0, 3)
    : []
  const reviews = venue.reviews || []
  const avgRating = reviews.length ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0

  return (
    <div className="group relative overflow-hidden rounded-sm border border-cream-border bg-white transition hover:border-plum-light hover:shadow-lg hover:shadow-plum/5">
      {showFavorite && (
        <FavoriteButton
          venueId={venue.id}
          initialFavorited={isFavorited}
          className="absolute right-3 top-3 z-10 bg-white/90 shadow-sm backdrop-blur hover:bg-white"
        />
      )}

      <Link href={`/venues/${venue.id}`}>
        <div className="bg-motif relative h-44 overflow-hidden">
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={image} alt={venue.name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <span className="font-display text-3xl text-plum/20">✦</span>
            </div>
          )}
        </div>

        <div className="p-5">
          <h3 className="font-display text-lg font-bold text-ink">{venue.name}</h3>
          <p className="mt-1.5 text-[11px] uppercase tracking-wide text-muted">
            {venue.city}, NJ · Up to {venue.max_capacity} guests
          </p>

          {reviews.length > 0 && (
            <div className="mt-2 flex items-center gap-1.5">
              <StarRating value={avgRating} size="text-xs" />
              <span className="text-[11px] text-muted">{avgRating.toFixed(1)} ({reviews.length})</span>
            </div>
          )}

          {activeFeatures.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {activeFeatures.map(([key]) => (
                <span key={key} className="rounded-sm border border-gold-border px-2.5 py-1 text-[10px] uppercase tracking-wide text-gold-ink">
                  {FEATURE_LABELS[key]}
                </span>
              ))}
            </div>
          )}

          <div className="mt-4 flex items-center justify-between border-t border-cream-border pt-3.5">
            <span className="text-[15px] font-bold text-plum">
              {venue.min_price ? `From $${Number(venue.min_price).toLocaleString()}` : 'Contact for pricing'}
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-wide text-gold-ink group-hover:text-plum">
              View details →
            </span>
          </div>
        </div>
      </Link>
    </div>
  )
}
