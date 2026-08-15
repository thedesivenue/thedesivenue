'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function Header() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-40 border-b border-cream-border bg-cream/95 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link href="/" className="font-display text-xl font-bold tracking-tight text-plum">
          The Desi Venue <span aria-hidden className="text-gold">✦</span>
        </Link>
        <div className="flex items-center gap-6 sm:gap-8">
          {pathname !== '/' && (
            <Link href="/" className="text-[12px] uppercase tracking-wider text-plum-light hover:text-plum">
              Home
            </Link>
          )}
          {pathname !== '/venues' && (
            <Link href="/venues" className="text-[12px] uppercase tracking-wider text-plum-light hover:text-plum">
              Browse Venues
            </Link>
          )}
          {pathname !== '/list-venue' && (
            <Link
              href="/list-venue"
              className="rounded-sm bg-plum px-5 py-2.5 text-[12px] font-semibold uppercase tracking-wider text-gold-light transition hover:bg-ink"
            >
              List Your Venue
            </Link>
          )}
        </div>
      </nav>
    </header>
  )
}
