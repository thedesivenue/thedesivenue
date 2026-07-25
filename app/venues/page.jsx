import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { VenuesBrowser } from '@/components/VenuesBrowser'
import { supabase } from '@/lib/supabase'

export const metadata = {
  title: 'Browse Venues',
  description: 'Browse Indian-event-ready venues across New Jersey, filterable by mandap space, fire ceremonies, vegetarian kitchens and more.',
}

export const revalidate = 60

export default async function VenuesPage() {
  const { data, error } = await supabase
    .from('venues')
    .select(`
      *,
      venue_features(*),
      venue_images(*)
    `)
    .eq('is_approved', true)

  if (error) console.error('Error fetching venues:', error)

  return (
    <>
      <Header />
      <main className="flex-1 bg-cream">
        <VenuesBrowser venues={data || []} />
      </main>
      <Footer />
    </>
  )
}
