import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { createClient as createServerSupabase } from '@/lib/supabase/server'
import { getOrCreateProfile } from '@/lib/profile'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export const dynamic = 'force-dynamic'

export default async function AccountPage() {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const profile = await getOrCreateProfile(user)

  return (
    <>
      <Header />
      <main className="flex-1 bg-cream">
        {profile.role === 'venue_owner' ? (
          <OwnerDashboard userId={user.id} />
        ) : (
          <UserInquiries userId={user.id} />
        )}
      </main>
      <Footer />
    </>
  )
}

async function OwnerDashboard({ userId }) {
  const { data: venues, error } = await supabaseAdmin
    .from('venues')
    .select('*')
    .eq('owner_id', userId)
    .order('created_at', { ascending: false })

  if (error) console.error('Error fetching owner venues:', error)

  return (
    <div className="mx-auto max-w-4xl px-6 py-14">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-3xl font-bold text-ink">Your venues</h1>
        <Link
          href="/account/venues/new"
          className="rounded-sm bg-plum px-5 py-2.5 text-[12px] font-semibold uppercase tracking-wider text-gold-light hover:bg-ink"
        >
          Add a venue
        </Link>
      </div>

      {(!venues || venues.length === 0) ? (
        <p className="mt-8 text-[15px] text-muted">You haven&apos;t listed any venues yet.</p>
      ) : (
        <div className="mt-8 space-y-4">
          {venues.map((venue) => (
            <Link
              key={venue.id}
              href={`/account/venues/${venue.id}`}
              className="flex items-center justify-between rounded-sm border border-cream-border bg-white p-5 transition hover:border-plum-light"
            >
              <div>
                <p className="font-display text-lg font-bold text-ink">{venue.name}</p>
                <p className="mt-1 text-[13px] text-muted">{venue.city}, {venue.state}</p>
              </div>
              <span className={venue.is_approved ? approvedPill : pendingPill}>
                {venue.is_approved ? 'Live' : 'Pending review'}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

async function UserInquiries({ userId }) {
  const { data: inquiries, error } = await supabaseAdmin
    .from('inquiries')
    .select('*, venues(id, name, city)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) console.error('Error fetching user inquiries:', error)

  return (
    <div className="mx-auto max-w-3xl px-6 py-14">
      <h1 className="font-display text-3xl font-bold text-ink">Your inquiries</h1>

      {(!inquiries || inquiries.length === 0) ? (
        <p className="mt-8 text-[15px] text-muted">
          You haven&apos;t contacted any venues yet. <Link href="/venues" className="text-plum hover:underline">Browse venues →</Link>
        </p>
      ) : (
        <div className="mt-8 space-y-4">
          {inquiries.map((inquiry) => (
            <div key={inquiry.id} className="rounded-sm border border-cream-border bg-white p-5">
              <div className="flex items-center justify-between">
                {inquiry.venues ? (
                  <Link href={`/venues/${inquiry.venues.id}`} className="font-display text-lg font-bold text-plum hover:underline">
                    {inquiry.venues.name}
                  </Link>
                ) : (
                  <p className="font-display text-lg font-bold text-ink">Venue no longer listed</p>
                )}
                <span className="text-[11px] uppercase tracking-wide text-muted">
                  {new Date(inquiry.created_at).toLocaleDateString()}
                </span>
              </div>
              {inquiry.message && <p className="mt-2 text-[14px] text-plum-light">{inquiry.message}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const approvedPill = 'rounded-sm border border-gold-border px-3 py-1 text-[11px] uppercase tracking-wide text-gold-ink'
const pendingPill = 'rounded-sm border border-cream-border px-3 py-1 text-[11px] uppercase tracking-wide text-muted'
