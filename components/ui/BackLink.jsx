import Link from 'next/link'

export function BackLink({ href, children }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 text-sm text-plum-light transition hover:text-plum"
    >
      <span aria-hidden>←</span>
      {children}
    </Link>
  )
}
