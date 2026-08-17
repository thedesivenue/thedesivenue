'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient as createServerSupabase } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { notifyNewReply } from '@/lib/notify'

export async function sendPlannerReply(prevState, formData) {
  const inquiryId = formData.get('inquiry_id')
  const body = formData.get('body')?.toString().trim()
  if (!body) return { error: 'Message cannot be empty.' }

  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: inquiry } = await supabaseAdmin
    .from('inquiries')
    .select('user_id, venue_id, venues(id, name, owner_id, owner_email)')
    .eq('id', inquiryId)
    .single()

  if (!inquiry || inquiry.user_id !== user.id) redirect('/account')

  const { error } = await supabaseAdmin.from('inquiry_messages').insert([{ inquiry_id: inquiryId, sender_id: user.id, body }])
  if (error) return { error: 'Something went wrong sending your reply.' }

  if (inquiry.venues) {
    let ownerEmail = inquiry.venues.owner_email
    if (inquiry.venues.owner_id) {
      const { data } = await supabaseAdmin.auth.admin.getUserById(inquiry.venues.owner_id)
      if (data?.user?.email) ownerEmail = data.user.email
    }
    if (ownerEmail === 'unclaimed@thedesivenue.com') ownerEmail = null

    await notifyNewReply({
      toEmail: ownerEmail,
      venueName: inquiry.venues.name,
      replyBody: body,
      accountUrl: `/account/venues/${inquiry.venues.id}`,
    })
  }

  revalidatePath('/account')
  return { success: true }
}
