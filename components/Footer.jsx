import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-cream-border bg-cream">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 sm:grid-cols-3">
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="The Desi Venue" className="h-20 w-auto" />
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-plum-light">
            New Jersey&apos;s platform for finding the perfect venue for your Indian
            event. Mandap space, fire ceremonies, vegetarian kitchens and more,
            all searchable in one place.
          </p>
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-ink">Explore</p>
          <ul className="mt-4 space-y-2.5 text-sm text-plum-light">
            <li><Link href="/venues" className="hover:text-plum">Browse venues</Link></li>
            <li><Link href="/list-venue" className="hover:text-plum">List your venue</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-ink">Serving</p>
          <p className="mt-4 text-sm text-plum-light">
            Edison · Iselin · Jersey City · Newark · Princeton · and the rest of New Jersey
          </p>
        </div>
      </div>
      <div className="bg-plum px-6 py-4 text-center text-[11px] uppercase tracking-wider text-gold-light/80">
        © {new Date().getFullYear()} The Desi Venue · Built for the Indian community in NJ
      </div>
    </footer>
  )
}
