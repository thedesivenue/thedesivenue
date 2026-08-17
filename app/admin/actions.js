'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createAdminSession, destroyAdminSession, requireAdminSession } from '@/lib/session'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { notifyClaimApproved } from '@/lib/notify'

export async function login(prevState, formData) {
  const password = formData.get('password')
  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return { error: 'Incorrect password' }
  }
  await createAdminSession()
  redirect('/admin')
}

export async function logout() {
  await destroyAdminSession()
  redirect('/admin/login')
}

export async function approveVenue(id) {
  await requireAdminSession()
  const { error } = await supabaseAdmin.from('venues').update({ is_approved: true }).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin')
  revalidatePath('/venues')
}

export async function rejectVenue(id) {
  await requireAdminSession()
  const { error } = await supabaseAdmin.from('venues').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin')
}

export async function unpublishVenue(id) {
  await requireAdminSession()
  const { error } = await supabaseAdmin.from('venues').update({ is_approved: false }).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin')
  revalidatePath('/venues')
}

export async function deleteVenue(id) {
  await requireAdminSession()
  const { error } = await supabaseAdmin.from('venues').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin')
  revalidatePath('/venues')
}

export async function approveClaim(claimId) {
  await requireAdminSession()

  const { data: claim } = await supabaseAdmin.from('venue_claims').select('*').eq('id', claimId).single()
  if (!claim) return

  const [{ data: profile }, { data: authUser }] = await Promise.all([
    supabaseAdmin.from('profiles').select('full_name, phone').eq('id', claim.user_id).maybeSingle(),
    supabaseAdmin.auth.admin.getUserById(claim.user_id),
  ])

  const { data: venue } = await supabaseAdmin
    .from('venues')
    .update({
      owner_id: claim.user_id,
      owner_name: profile?.full_name || 'Verified owner',
      owner_email: authUser?.user?.email || null,
      owner_phone: profile?.phone || 'Not provided',
    })
    .eq('id', claim.venue_id)
    .select()
    .single()

  await supabaseAdmin.from('venue_claims').update({ status: 'approved' }).eq('id', claimId)
  // Any other pending claims on the same venue are now moot.
  await supabaseAdmin.from('venue_claims').update({ status: 'rejected' }).eq('venue_id', claim.venue_id).neq('id', claimId)

  if (venue && authUser?.user?.email) {
    await notifyClaimApproved({ toEmail: authUser.user.email, venueName: venue.name, venueId: venue.id })
  }

  revalidatePath('/admin')
  revalidatePath(`/venues/${claim.venue_id}`)
}

export async function rejectClaim(claimId) {
  await requireAdminSession()
  const { error } = await supabaseAdmin.from('venue_claims').update({ status: 'rejected' }).eq('id', claimId)
  if (error) throw new Error(error.message)
  revalidatePath('/admin')
}
