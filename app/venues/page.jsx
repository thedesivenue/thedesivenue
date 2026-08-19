import Link from 'next/link'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { VenuesBrowser } from '@/components/VenuesBrowser'
import { BackLink } from '@/components/ui/BackLink'
import { supabase } from '@/lib/supabase'
import { citySlug } from '@/lib/cities'
import { createClient as createServerSupabase } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export const metadata = {
  title: 'Browse Venues',
  description: 'Browse Indian-event-ready venues across New Jersey, filterable by mandap space, fire ceremonies, vegetarian kitchens and more.',
}

export const dynamic = 'force-dynamic'

export default async function VenuesPage() {
  const { data, error } = await supabase
    .from('venues')
    .select(`
      *,
      venue_features(*),
      venue_images(*),
      reviews(rating)
    `)
    .eq('is_approved', true)

  if (error) console.error('Error fetching venues:', error)

  const serverSupabase = await createServerSupabase()
  const { data: { user } } = await serverSupabase.auth.getUser()

  let favoritedIds = []
  if (user) {
    const { data: favorites } = await supabaseAdmin.from('favorites').select('venue_id').eq('user_id', user.id)
    favoritedIds = (favorites || []).map((f) => f.venue_id)
  }

  const cities = [...new Set((data || []).map((v) => v.city).filter(Boolean))].sort()

  return (
    <>
      <Header />
      <main className="flex-1 bg-cream">
        <div className="px-6 pt-6">
          <BackLink href="/">Back to home</BackLink>
        </div>

        {cities.length > 0 && (
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 px-6 pt-4 text-[13px] text-plum-light">
            <span className="text-muted">Browse by city:</span>
            {cities.map((city, i) => (
              <span key={city}>
                <Link href={`/venues/city/${citySlug(city)}`} className="hover:text-plum hover:underline">
                  {city}
                </Link>
                {i < cities.length - 1 && <span className="text-muted">,</span>}
              </span>
            ))}
          </div>
        )}

        <VenuesBrowser venues={data || []} showFavorite={!!user} favoritedIds={favoritedIds} />
      </main>
      <Footer />
    </>
  )
}
