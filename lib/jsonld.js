const SITE_URL = 'https://www.thedesivenue.com'

// Escapes </script> so JSON embedded in a <script> tag can't break out of it.
export function serializeJsonLd(data) {
  return JSON.stringify(data).replace(/</g, '\\u003c')
}

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'The Desi Venue',
    url: SITE_URL,
    description: "New Jersey's platform for finding Indian-event-ready venues.",
    areaServed: {
      '@type': 'State',
      name: 'New Jersey',
    },
  }
}

export function venueJsonLd(venue, reviews = []) {
  const avgRating = reviews.length ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : null

  const data = {
    '@context': 'https://schema.org',
    '@type': 'EventVenue',
    name: venue.name,
    url: `${SITE_URL}/venues/${venue.id}`,
    description: venue.description || undefined,
    telephone: venue.phone || undefined,
    address: {
      '@type': 'PostalAddress',
      streetAddress: venue.address || undefined,
      addressLocality: venue.city,
      addressRegion: venue.state || 'NJ',
      postalCode: venue.zip || undefined,
      addressCountry: 'US',
    },
    image: (venue.venue_images || []).map((img) => img.url),
    priceRange: venue.min_price ? `From $${Number(venue.min_price).toLocaleString()}` : undefined,
    maximumAttendeeCapacity: venue.max_capacity || undefined,
  }

  if (avgRating) {
    data.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: avgRating.toFixed(1),
      reviewCount: reviews.length,
    }
  }

  return data
}

export function venueListJsonLd(venues, listUrl) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    url: listUrl,
    itemListElement: venues.map((venue, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${SITE_URL}/venues/${venue.id}`,
      name: venue.name,
    })),
  }
}
