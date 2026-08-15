import { redirect } from 'next/navigation'
import { isAdminSession } from '@/lib/session'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { FEATURE_LABELS } from '@/lib/features'
import { approveVenue, rejectVenue, logout } from './actions'
import { RejectButton } from '@/components/admin/RejectButton'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  if (!(await isAdminSession())) redirect('/admin/login')

  const { data, error } = await supabaseAdmin
    .from('venues')
    .select(`*, venue_features(*), venue_images(*)`)
    .eq('is_approved', false)
    .order('created_at', { ascending: false })

  if (error) console.error('Error fetching pending venues:', error)
  const pending = data || []

  return (
    <main className="min-h-screen bg-cream px-6 py-12">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl font-medium text-ink">Pending venue submissions</h1>
          <form action={logout}>
            <button type="submit" className="text-sm text-muted hover:text-plum">Log out</button>
          </form>
        </div>

        {pending.length === 0 ? (
          <p className="mt-8 text-[15px] text-muted">No pending submissions.</p>
        ) : (
          <div className="mt-8 space-y-5">
            {pending.map((venue) => {
              const activeFeatures = venue.venue_features?.[0]
                ? Object.entries(venue.venue_features[0])
                    .filter(([key, val]) => val === true && FEATURE_LABELS[key])
                    .map(([key]) => FEATURE_LABELS[key])
                : []

              return (
                <div key={venue.id} className="rounded-2xl border border-cream-border bg-white p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h2 className="font-display text-lg font-medium text-ink">{venue.name}</h2>
                      <p className="mt-1 text-[13px] text-muted">
                        {venue.address}, {venue.city}, {venue.state} {venue.zip}
                      </p>
                      <p className="mt-1 text-[13px] text-muted">
                        {venue.owner_name} · {venue.owner_email} · {venue.owner_phone}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <form action={approveVenue.bind(null, venue.id)}>
                        <button
                          type="submit"
                          className="rounded-lg bg-plum px-3.5 py-2 text-sm font-medium text-gold-light hover:bg-ink"
                        >
                          Approve
                        </button>
                      </form>
                      <form action={rejectVenue.bind(null, venue.id)}>
                        <RejectButton />
                      </form>
                    </div>
                  </div>

                  {venue.description && (
                    <p className="mt-4 text-[15px] leading-relaxed text-plum-light">{venue.description}</p>
                  )}

                  <div className="mt-4 flex flex-wrap gap-8 text-[13px] text-muted">
                    <span>Capacity: {venue.min_capacity}–{venue.max_capacity}</span>
                    <span>Starting price: {venue.min_price ? `$${Number(venue.min_price).toLocaleString()}` : '—'}</span>
                    <span>Parking: {venue.parking ? 'Yes' : 'No'}</span>
                  </div>

                  {activeFeatures.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {activeFeatures.map((feature) => (
                        <span key={feature} className="rounded-full border border-gold-border bg-gold-pale px-3 py-1 text-[12px] text-gold-ink">
                          {feature}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
