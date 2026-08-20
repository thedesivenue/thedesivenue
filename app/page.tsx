import Link from 'next/link'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Pill } from '@/components/ui/Pill'
import { Reveal } from '@/components/ui/Reveal'
import { StatCounter } from '@/components/ui/StatCounter'
import { VenueCard } from '@/components/VenueCard'
import { SearchIcon, ScaleIcon, MessageIcon, FilterIcon, TagIcon, MailIcon } from '@/components/icons'
import { supabase } from '@/lib/supabase'

const culturalFilters = [
  'Mandap allowed',
  'Fire ceremony',
  'Veg kitchen',
  'Outside catering',
  'Baraat friendly',
  'Multi-day events',
]

const steps = [
  {
    title: 'Search & filter',
    desc: 'Browse NJ venues and filter by the cultural essentials. Mandap space, fire ceremony clearance, vegetarian kitchens, baraat access.',
    icon: SearchIcon,
  },
  {
    title: 'Compare openly',
    desc: 'See real capacity and starting pricing up front, side by side. No calls required just to get a ballpark.',
    icon: ScaleIcon,
  },
  {
    title: 'Inquire directly',
    desc: 'Send your event details straight to the venue. No middleman, no booking fees, no delays.',
    icon: MessageIcon,
  },
]

const features = [
  { title: 'Cultural filters', desc: 'Filter by mandap, fire ceremony, vegetarian kitchen and more', icon: FilterIcon },
  { title: 'Transparent pricing', desc: 'See real pricing upfront, no surprises or hidden fees', icon: TagIcon },
  { title: 'Direct inquiries', desc: 'Contact venues directly, no middleman, no delays', icon: MailIcon },
]

export default async function Home() {
  const [{ data: featuredVenues }, { data: allVenues, count: venueCount }] = await Promise.all([
    supabase
      .from('venues')
      .select('*, venue_features(*), venue_images(*), reviews(rating)')
      .eq('is_approved', true)
      .eq('is_premium', true)
      .limit(3),
    supabase
      .from('venues')
      .select('city', { count: 'exact' })
      .eq('is_approved', true),
  ])

  const cityCount = new Set((allVenues || []).map((v) => v.city).filter(Boolean)).size

  const stats = [
    { value: venueCount || 0, label: 'Venues listed' },
    { value: cityCount, label: 'NJ cities covered', suffix: '+' },
    { value: 10, label: 'Cultural filters', suffix: '+' },
  ]

  return (
    <>
      <div className="bg-plum px-6 py-2.5 text-center text-[11px] font-semibold uppercase tracking-wider text-gold-light">
        ✦ Coming soon. We&apos;re putting the finishing touches on The Desi Venue
      </div>
      <Header />
      <main className="flex-1 bg-cream">

        {/* Hero */}
        <section className="bg-motif border-b border-cream-border px-6 py-24 text-center sm:py-32">
          <div className="mx-auto max-w-2xl">
            <span className="inline-block border-t border-b border-gold px-1 py-1.5 text-[11px] uppercase tracking-[0.2em] text-gold-ink">
              New Jersey&apos;s Indian Venue Platform
            </span>
            <h1 className="mx-auto mt-7 max-w-xl font-display text-5xl font-bold leading-[1.05] tracking-tight text-ink sm:text-6xl lg:text-7xl">
              Find the perfect venue for your Indian event
            </h1>
            <p className="mx-auto mt-6 max-w-lg text-lg text-plum-light">
              Mandap-ready halls, cultural filters, transparent pricing, all in one place.
            </p>

            <form action="/venues" method="GET" className="mx-auto mt-9 flex max-w-md flex-col gap-2.5 sm:flex-row">
              <input
                type="text"
                name="q"
                placeholder="Search by venue name or city..."
                className="w-full rounded-sm border border-cream-border bg-white px-4 py-3.5 text-sm text-ink outline-none placeholder:text-muted focus:border-plum"
              />
              <button
                type="submit"
                className="whitespace-nowrap rounded-sm bg-plum px-6 py-3.5 text-[12px] font-semibold uppercase tracking-wider text-gold-light transition hover:bg-ink"
              >
                Search
              </button>
            </form>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[12px] uppercase tracking-wider">
              <Link href="/venues" className="text-plum-light underline decoration-gold-border underline-offset-4 hover:text-plum">
                Browse all venues
              </Link>
              <Link href="/list-venue" className="text-plum-light underline decoration-gold-border underline-offset-4 hover:text-plum">
                List your venue free
              </Link>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="border-b border-cream-border bg-white px-6 py-10">
          <div className="mx-auto grid max-w-3xl grid-cols-3 gap-6 text-center">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="font-display text-3xl font-bold text-plum sm:text-4xl">
                  <StatCounter value={stat.value} suffix={stat.suffix || ''} />
                </p>
                <p className="mt-1 text-[11px] uppercase tracking-wider text-muted">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Cultural filters strip */}
        <section className="flex flex-wrap justify-center gap-2.5 border-b border-cream-border bg-white px-6 py-5">
          {culturalFilters.map((filter) => (
            <Pill key={filter}>{filter}</Pill>
          ))}
        </section>

        {/* Featured venues */}
        {featuredVenues && featuredVenues.length > 0 && (
          <section className="border-b border-cream-border bg-white px-6 py-20">
            <div className="mx-auto max-w-5xl">
              <Reveal>
                <h2 className="text-center font-display text-3xl font-bold text-ink">
                  Featured venues
                </h2>
              </Reveal>
              <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {featuredVenues.map((venue, i) => (
                  <Reveal key={venue.id} delay={i * 80}>
                    <VenueCard venue={venue} />
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* How it works */}
        <section className="mx-auto max-w-5xl px-6 py-20">
          <Reveal>
            <h2 className="text-center font-display text-3xl font-bold text-ink">
              How it works
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-10 sm:grid-cols-3">
            {steps.map((step, i) => (
              <Reveal key={step.title} delay={i * 100} className="text-center sm:text-left">
                <div className="flex items-center justify-center gap-2.5 sm:justify-start">
                  <step.icon className="h-5 w-5 text-gold" />
                  <span className="font-display text-2xl text-gold">0{i + 1}</span>
                </div>
                <h3 className="mt-2 font-display text-lg font-bold text-plum">{step.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-plum-light">{step.desc}</p>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="border-t border-cream-border bg-white px-6 py-20">
          <div className="mx-auto max-w-5xl">
            <Reveal>
              <h2 className="text-center font-display text-3xl font-bold text-ink">
                Built for Indian events
              </h2>
            </Reveal>
            <div className="mt-12 grid gap-6 sm:grid-cols-3">
              {features.map((f, i) => (
                <Reveal key={f.title} delay={i * 100}>
                  <div className="h-full rounded-sm border border-cream-border p-7 transition hover:border-plum-light hover:shadow-md hover:shadow-plum/5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-plum-pale">
                      <f.icon className="h-5 w-5 text-plum" />
                    </div>
                    <h3 className="mt-4 font-display text-lg font-bold text-plum">{f.title}</h3>
                    <p className="mt-2.5 text-[15px] leading-relaxed text-plum-light">{f.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-plum px-6 py-20 text-center text-gold-light">
          <Reveal>
            <h2 className="font-display text-3xl font-bold">Own a venue?</h2>
            <p className="mx-auto mt-3 max-w-md text-lg text-gold-light/85">
              List your venue for free and get discovered by thousands of Indian families in NJ
            </p>
            <Link
              href="/list-venue"
              className="mt-8 inline-block rounded-sm bg-gold px-8 py-3.5 text-[12px] font-semibold uppercase tracking-wider text-ink transition hover:bg-gold-light"
            >
              List your venue free
            </Link>
          </Reveal>
        </section>

      </main>
      <Footer />
    </>
  )
}
