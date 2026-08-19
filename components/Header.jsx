'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const navLinkClass = 'text-[12px] uppercase tracking-wider text-plum-light hover:text-plum'
const mobileLinkClass = 'block py-3 text-[13px] uppercase tracking-wider text-plum-light hover:text-plum'

export function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const [session, setSession] = useState(undefined)
  const [menuOpen, setMenuOpen] = useState(false)
  const [menuPathname, setMenuPathname] = useState(pathname)

  if (pathname !== menuPathname) {
    setMenuPathname(pathname)
    setMenuOpen(false)
  }

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => setSession(session))
    return () => listener.subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const links = (onNavigate, linkClass) => (
    <>
      {pathname !== '/' && (
        <Link href="/" className={linkClass} onClick={onNavigate}>Home</Link>
      )}
      {pathname !== '/venues' && (
        <Link href="/venues" className={linkClass} onClick={onNavigate}>Browse Venues</Link>
      )}

      {session === undefined ? null : session ? (
        <>
          {pathname !== '/account' && (
            <Link href="/account" className={linkClass} onClick={onNavigate}>My Account</Link>
          )}
          <button
            onClick={() => { onNavigate?.(); handleLogout() }}
            className={linkClass}
          >
            Log Out
          </button>
        </>
      ) : (
        <>
          {pathname !== '/login' && (
            <Link href="/login" className={linkClass} onClick={onNavigate}>Log In</Link>
          )}
          {pathname !== '/list-venue' && (
            <Link
              href="/list-venue"
              className="block rounded-sm bg-plum px-5 py-2.5 text-center text-[12px] font-semibold uppercase tracking-wider text-gold-light transition hover:bg-ink"
              onClick={onNavigate}
            >
              List Your Venue
            </Link>
          )}
        </>
      )}
    </>
  )

  return (
    <header className="sticky top-0 z-40 border-b border-cream-border bg-cream/95 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <Link href="/" className="flex items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="The Desi Venue" className="h-14 w-auto md:h-24" />
        </Link>

        <div className="hidden items-center gap-6 md:flex lg:gap-8">
          {links(null, navLinkClass)}
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          className="flex h-9 w-9 flex-none flex-col items-center justify-center gap-1.5 md:hidden"
        >
          <span className={`block h-px w-5 bg-ink transition ${menuOpen ? 'translate-y-[3.5px] rotate-45' : ''}`} />
          <span className={`block h-px w-5 bg-ink transition ${menuOpen ? '-translate-y-[3.5px] -rotate-45' : ''}`} />
        </button>
      </nav>

      {menuOpen && (
        <div className="border-t border-cream-border bg-cream px-6 pb-5 md:hidden">
          {links(() => setMenuOpen(false), mobileLinkClass)}
        </div>
      )}
    </header>
  )
}
