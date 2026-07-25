import Link from 'next/link'
import { FEATURE_LABELS } from '@/lib/features'

export function VenueCard({ venue }) {
  const image = venue.venue_images?.[0]?.url
  const activeFeatures = venue.venue_features?.[0]
    ? Object.entries(venue.venue_features[0])
        .filter(([key, val]) => val === true && FEATURE_LABELS[key])
        .slice(0, 3)
    : []

  return (
    <Link
      href={`/venues/${venue.id}`}
      className="group overflow-hidden rounded-2xl border border-cream-border bg-white transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-plum/5"
    >
      <div className="bg-motif relative h-44 overflow-hidden bg-gradient-to-br from-plum-pale to-gold-pale">
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
        <h3 className="font-display text-lg font-medium text-ink">{venue.name}</h3>
        <p className="mt-1 text-[13px] text-muted">
          {venue.city}, NJ · Up to {venue.max_capacity} guests
        </p>

        {activeFeatures.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {activeFeatures.map(([key]) => (
              <span key={key} className="rounded-full bg-gold-pale px-2.5 py-1 text-[11px] text-gold-ink">
                {FEATURE_LABELS[key]}
              </span>
            ))}
          </div>
        )}

        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm font-medium text-plum">
            {venue.min_price ? `From $${Number(venue.min_price).toLocaleString()}` : 'Contact for pricing'}
          </span>
          <span className="text-sm font-medium text-gold-ink group-hover:text-plum">
            View details →
          </span>
        </div>
      </div>
    </Link>
  )
}
