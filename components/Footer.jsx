import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-cream-border bg-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 sm:grid-cols-3">
        <div>
          <p className="font-display text-lg font-medium text-plum">The Desi Venue</p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-plum-light">
            New Jersey&apos;s directory of Indian-event-ready venues — mandap space,
            fire ceremonies, vegetarian kitchens and more, all searchable in one place.
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-ink">Explore</p>
          <ul className="mt-3 space-y-2 text-sm text-plum-light">
            <li><Link href="/venues" className="hover:text-plum">Browse venues</Link></li>
            <li><Link href="/list-venue" className="hover:text-plum">List your venue</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-medium text-ink">Serving</p>
          <p className="mt-3 text-sm text-plum-light">
            Edison · Iselin · Jersey City · Newark · Princeton · and the rest of New Jersey
          </p>
        </div>
      </div>
      <div className="border-t border-cream-border px-6 py-5 text-center text-xs text-muted">
        © {new Date().getFullYear()} The Desi Venue · Built for the Indian community in NJ
      </div>
    </footer>
  )
}
