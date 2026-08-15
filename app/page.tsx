import Link from 'next/link'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Pill } from '@/components/ui/Pill'

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
    desc: 'Browse NJ venues and filter by the cultural essentials — mandap space, fire ceremony clearance, vegetarian kitchens, baraat access.',
  },
  {
    title: 'Compare openly',
    desc: 'See real capacity and starting pricing up front, side by side — no calls required just to get a ballpark.',
  },
  {
    title: 'Inquire directly',
    desc: 'Send your event details straight to the venue. No middleman, no booking fees, no delays.',
  },
]

const features = [
  { title: 'Cultural filters', desc: 'Filter by mandap, fire ceremony, vegetarian kitchen and more' },
  { title: 'Transparent pricing', desc: 'See real pricing upfront — no surprises or hidden fees' },
  { title: 'Direct inquiries', desc: 'Contact venues directly — no middleman, no delays' },
]

export default function Home() {
  return (
    <>
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
              Mandap-ready halls, cultural filters, transparent pricing — all in one place.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/venues"
                className="rounded-sm bg-plum px-8 py-3.5 text-[12px] font-semibold uppercase tracking-wider text-gold-light transition hover:bg-ink"
              >
                Browse Venues
              </Link>
              <Link
                href="/list-venue"
                className="rounded-sm border border-ink px-8 py-3.5 text-[12px] font-semibold uppercase tracking-wider text-ink transition hover:bg-ink hover:text-gold-light"
              >
                List Your Venue Free
              </Link>
            </div>
          </div>
        </section>

        {/* Cultural filters strip */}
        <section className="flex flex-wrap justify-center gap-2.5 border-b border-cream-border bg-white px-6 py-5">
          {culturalFilters.map((filter) => (
            <Pill key={filter}>{filter}</Pill>
          ))}
        </section>

        {/* How it works */}
        <section className="mx-auto max-w-5xl px-6 py-20">
          <h2 className="text-center font-display text-3xl font-bold text-ink">
            How it works
          </h2>
          <div className="mt-12 grid gap-10 sm:grid-cols-3">
            {steps.map((step, i) => (
              <div key={step.title} className="text-center sm:text-left">
                <span className="font-display text-2xl text-gold">0{i + 1}</span>
                <h3 className="mt-2 font-display text-lg font-bold text-plum">{step.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-plum-light">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="border-t border-cream-border bg-white px-6 py-20">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-center font-display text-3xl font-bold text-ink">
              Built for Indian events
            </h2>
            <div className="mt-12 grid gap-6 sm:grid-cols-3">
              {features.map((f) => (
                <div key={f.title} className="rounded-sm border border-cream-border p-7 transition hover:border-plum-light">
                  <h3 className="font-display text-lg font-bold text-plum">{f.title}</h3>
                  <p className="mt-2.5 text-[15px] leading-relaxed text-plum-light">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-plum px-6 py-20 text-center text-gold-light">
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
        </section>

      </main>
      <Footer />
    </>
  )
}
