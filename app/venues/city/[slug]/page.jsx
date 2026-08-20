import { notFound } from 'next/navigation'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { VenuesBrowser } from '@/components/VenuesBrowser'
import { BackLink } from '@/components/ui/BackLink'
import { JsonLd } from '@/components/JsonLd'
import { supabase } from '@/lib/supabase'
import { createClient as createServerSupabase } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { citySlug, slugToCityFilter } from '@/lib/cities'
import { venueListJsonLd } from '@/lib/jsonld'

export const revalidate = 3600

async function getCityVenues(slug) {
  const { data, error } = await supabase
    .from('venues')
    .select('*, venue_features(*), venue_images(*), reviews(rating)')
    .eq('is_approved', true)
    .ilike('city', slugToCityFilter(slug))

  if (error) {
    console.error('Error fetching city venues:', error)
    return []
  }
  return data || []
}

export async function generateStaticParams() {
  const { data } = await supabase.from('venues').select('city').eq('is_approved', true)
  const cities = [...new Set((data || []).map((v) => v.city).filter(Boolean))]
  return cities.map((city) => ({ slug: citySlug(city) }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const venues = await getCityVenues(slug)
  if (venues.length === 0) return { title: 'City not found' }

  const cityName = venues[0].city
  return {
    title: `Indian Wedding & Event Venues in ${cityName}, NJ`,
    description: `Browse Indian-event-ready venues in ${cityName}, New Jersey. Filter by mandap space, fire ceremonies, vegetarian kitchens, baraat access and more, with transparent pricing and direct inquiries.`,
  }
}

export default async function CityVenuesPage({ params }) {
  const { slug } = await params
  const venues = await getCityVenues(slug)

  if (venues.length === 0) notFound()

  const cityName = venues[0].city

  const serverSupabase = await createServerSupabase()
  const { data: { user } } = await serverSupabase.auth.getUser()

  let favoritedIds = []
  if (user) {
    const { data: favorites } = await supabaseAdmin.from('favorites').select('venue_id').eq('user_id', user.id)
    favoritedIds = (favorites || []).map((f) => f.venue_id)
  }

  return (
    <>
      <JsonLd data={venueListJsonLd(venues, `https://www.thedesivenue.com/venues/city/${slug}`)} />
      <Header />
      <main className="flex-1 bg-cream">
        <div className="px-6 pt-6">
          <BackLink href="/venues">Back to all venues</BackLink>
        </div>

        <section className="border-b border-cream-border bg-white px-6 py-14 text-center">
          <h1 className="font-display text-4xl font-bold text-ink sm:text-5xl">
            Indian Event Venues in {cityName}, NJ
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-[15px] text-plum-light">
            {venues.length} venue{venues.length !== 1 ? 's' : ''} in {cityName} ready for mandap ceremonies,
            baraats, and vegetarian catering, with transparent pricing.
          </p>
        </section>

        <VenuesBrowser
          venues={venues}
          showFavorite={!!user}
          favoritedIds={favoritedIds}
          hideCityFilter
        />
      </main>
      <Footer />
    </>
  )
}
