import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { createClient as createServerSupabase } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export const dynamic = 'force-dynamic'

export default async function OwnerVenueDetailPage({ params }) {
  const { id } = await params

  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: venue } = await supabaseAdmin.from('venues').select('*').eq('id', id).single()
  if (!venue || venue.owner_id !== user.id) redirect('/account')

  const { data: inquiries } = await supabaseAdmin
    .from('inquiries')
    .select('*')
    .eq('venue_id', id)
    .order('created_at', { ascending: false })

  return (
    <>
      <Header />
      <main className="flex-1 bg-cream">
        <div className="mx-auto max-w-3xl px-6 pt-6">
          <Link href="/account" className="inline-flex items-center gap-1.5 text-sm text-plum-light hover:text-plum">
            <span aria-hidden>←</span> Back to your venues
          </Link>
        </div>

        <div className="mx-auto max-w-3xl px-6 py-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h1 className="font-display text-3xl font-bold text-ink">{venue.name}</h1>
            <div className="flex items-center gap-3">
              <span className={venue.is_approved ? approvedPill : pendingPill}>
                {venue.is_approved ? 'Live' : 'Pending review'}
              </span>
              <Link
                href={`/account/venues/${venue.id}/edit`}
                className="rounded-sm border border-plum px-4 py-2 text-[12px] font-semibold uppercase tracking-wider text-plum hover:bg-plum hover:text-gold-light"
              >
                Edit
              </Link>
            </div>
          </div>
          <p className="mt-1.5 text-[15px] text-muted">
            {venue.address}, {venue.city}, {venue.state} {venue.zip}
          </p>

          <h2 className="mt-10 text-[11px] font-semibold uppercase tracking-wider text-ink">
            Inquiries {inquiries?.length ? `(${inquiries.length})` : ''}
          </h2>

          {(!inquiries || inquiries.length === 0) ? (
            <p className="mt-4 text-[15px] text-muted">No inquiries yet.</p>
          ) : (
            <div className="mt-4 space-y-4">
              {inquiries.map((inquiry) => (
                <div key={inquiry.id} className="rounded-sm border border-cream-border bg-white p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-medium text-ink">{inquiry.name}</p>
                    <span className="text-[11px] uppercase tracking-wide text-muted">
                      {new Date(inquiry.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="mt-1 text-[13px] text-muted">{inquiry.email} · {inquiry.phone}</p>
                  {inquiry.event_date && (
                    <p className="mt-1 text-[13px] text-muted">Event date: {inquiry.event_date}</p>
                  )}
                  {inquiry.guest_count && (
                    <p className="mt-1 text-[13px] text-muted">Guests: {inquiry.guest_count}</p>
                  )}
                  {inquiry.message && <p className="mt-3 text-[14px] text-plum-light">{inquiry.message}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}

const approvedPill = 'rounded-sm border border-gold-border px-3 py-1 text-[11px] uppercase tracking-wide text-gold-ink'
const pendingPill = 'rounded-sm border border-cream-border px-3 py-1 text-[11px] uppercase tracking-wide text-muted'
