import { supabase } from '@/lib/supabase'
import { citySlug } from '@/lib/cities'

const SITE_URL = 'https://www.thedesivenue.com'

export default async function sitemap() {
  const { data: venues } = await supabase
    .from('venues')
    .select('id, city, created_at')
    .eq('is_approved', true)

  const cities = [...new Set((venues || []).map((v) => v.city).filter(Boolean))]

  const staticRoutes = ['', '/venues', '/list-venue', '/login', '/signup', '/contact', '/privacy', '/terms'].map((path) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: path === '' || path === '/venues' ? 'daily' : 'monthly',
    priority: path === '' ? 1 : 0.6,
  }))

  const cityRoutes = cities.map((city) => ({
    url: `${SITE_URL}/venues/city/${citySlug(city)}`,
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  const venueRoutes = (venues || []).map((venue) => ({
    url: `${SITE_URL}/venues/${venue.id}`,
    lastModified: venue.created_at,
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  return [...staticRoutes, ...cityRoutes, ...venueRoutes]
}
