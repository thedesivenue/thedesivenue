import Link from 'next/link'

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-cream-border/80 bg-cream/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-baseline gap-1.5 font-display text-xl font-medium tracking-tight text-plum">
          The Desi Venue
          <span aria-hidden className="text-gold">✦</span>
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/venues" className="hidden text-sm text-plum-light hover:text-plum sm:inline">
            Browse Venues
          </Link>
          <Link
            href="/list-venue"
            className="rounded-lg bg-plum px-4 py-2 text-sm font-medium text-gold-light transition hover:bg-ink"
          >
            List Your Venue
          </Link>
        </div>
      </nav>
    </header>
  )
}
