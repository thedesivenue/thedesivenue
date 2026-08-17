import { redirect } from 'next/navigation'
import { isAdminSession } from '@/lib/session'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { FEATURE_LABELS } from '@/lib/features'
import { approveVenue, rejectVenue, unpublishVenue, deleteVenue, approveClaim, rejectClaim, logout } from './actions'
import { RejectButton } from '@/components/admin/RejectButton'
import { ConfirmButton } from '@/components/admin/ConfirmButton'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  if (!(await isAdminSession())) redirect('/admin/login')

  const [{ data: pending }, { data: live }, { data: claims }] = await Promise.all([
    supabaseAdmin.from('venues').select('*, venue_features(*), venue_images(*)').eq('is_approved', false).order('created_at', { ascending: false }),
    supabaseAdmin.from('venues').select('*').eq('is_approved', true).order('name'),
    supabaseAdmin.from('venue_claims').select('*, venues(id, name)').eq('status', 'pending').order('created_at', { ascending: false }),
  ])

  const claimUserIds = [...new Set((claims || []).map((c) => c.user_id))]
  const claimUsers = {}
  for (const id of claimUserIds) {
    const { data } = await supabaseAdmin.auth.admin.getUserById(id)
    if (data?.user) claimUsers[id] = data.user
  }

  return (
    <main className="min-h-screen bg-cream px-6 py-12">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl font-bold text-ink">Admin</h1>
          <form action={logout}>
            <button type="submit" className="text-sm text-muted hover:text-plum">Log out</button>
          </form>
        </div>

        {/* ---------- Pending claims ---------- */}
        <h2 className="mt-10 text-[11px] font-semibold uppercase tracking-wider text-ink">
          Pending claims {claims?.length ? `(${claims.length})` : ''}
        </h2>
        {(!claims || claims.length === 0) ? (
          <p className="mt-4 text-[15px] text-muted">No pending claims.</p>
        ) : (
          <div className="mt-4 space-y-4">
            {claims.map((claim) => {
              const claimant = claimUsers[claim.user_id]
              return (
                <div key={claim.id} className="rounded-sm border border-cream-border bg-white p-5">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="font-medium text-ink">{claim.venues?.name || 'Venue no longer listed'}</p>
                      <p className="mt-1 text-[13px] text-muted">Claimed by {claimant?.email || claim.user_id}</p>
                      {claim.message && <p className="mt-2 text-[14px] text-plum-light">{claim.message}</p>}
                    </div>
                    <div className="flex gap-2">
                      <form action={approveClaim.bind(null, claim.id)}>
                        <button type="submit" className="rounded-sm bg-plum px-3.5 py-2 text-sm font-medium text-gold-light hover:bg-ink">
                          Approve
                        </button>
                      </form>
                      <form action={rejectClaim.bind(null, claim.id)}>
                        <button type="submit" className="rounded-sm border border-red-200 px-3.5 py-2 text-sm font-medium text-red-600 hover:bg-red-50">
                          Reject
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* ---------- Pending venues ---------- */}
        <h2 className="mt-12 text-[11px] font-semibold uppercase tracking-wider text-ink">
          Pending venue submissions {pending?.length ? `(${pending.length})` : ''}
        </h2>

        {(!pending || pending.length === 0) ? (
          <p className="mt-4 text-[15px] text-muted">No pending submissions.</p>
        ) : (
          <div className="mt-4 space-y-5">
            {pending.map((venue) => {
              const activeFeatures = venue.venue_features?.[0]
                ? Object.entries(venue.venue_features[0])
                    .filter(([key, val]) => val === true && FEATURE_LABELS[key])
                    .map(([key]) => FEATURE_LABELS[key])
                : []

              return (
                <div key={venue.id} className="rounded-sm border border-cream-border bg-white p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h3 className="font-display text-lg font-medium text-ink">{venue.name}</h3>
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
                          className="rounded-sm bg-plum px-3.5 py-2 text-sm font-medium text-gold-light hover:bg-ink"
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
                        <span key={feature} className="rounded-sm border border-gold-border px-3 py-1 text-[11px] uppercase tracking-wide text-gold-ink">
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

        {/* ---------- Live venues ---------- */}
        <h2 className="mt-12 text-[11px] font-semibold uppercase tracking-wider text-ink">
          Live venues {live?.length ? `(${live.length})` : ''}
        </h2>

        {(!live || live.length === 0) ? (
          <p className="mt-4 text-[15px] text-muted">No live venues yet.</p>
        ) : (
          <div className="mt-4 space-y-2">
            {live.map((venue) => (
              <div key={venue.id} className="flex flex-wrap items-center justify-between gap-3 rounded-sm border border-cream-border bg-white px-5 py-3">
                <div>
                  <p className="font-medium text-ink">{venue.name}</p>
                  <p className="text-[12px] text-muted">
                    {venue.city}, {venue.state} · {venue.view_count || 0} views · {venue.owner_id ? 'Claimed' : 'Unclaimed'}
                  </p>
                </div>
                <div className="flex gap-2">
                  <form action={unpublishVenue.bind(null, venue.id)}>
                    <button type="submit" className="rounded-sm border border-cream-border px-3 py-1.5 text-[12px] text-muted hover:text-plum">
                      Unpublish
                    </button>
                  </form>
                  <form action={deleteVenue.bind(null, venue.id)}>
                    <ConfirmButton
                      confirmText={`Permanently delete "${venue.name}"?`}
                      className="rounded-sm border border-red-200 px-3 py-1.5 text-[12px] text-red-600 hover:bg-red-50"
                    >
                      Delete
                    </ConfirmButton>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
