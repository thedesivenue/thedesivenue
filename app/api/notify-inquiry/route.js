import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { notifyNewInquiry } from '@/lib/notify'

export async function POST(request) {
  const { inquiryId } = await request.json()
  if (!inquiryId) return NextResponse.json({ error: 'Missing inquiryId' }, { status: 400 })

  const { data: inquiry } = await supabaseAdmin
    .from('inquiries')
    .select('*, venues(id, name, owner_id, owner_email)')
    .eq('id', inquiryId)
    .single()

  if (!inquiry || !inquiry.venues) return NextResponse.json({ ok: false })

  let ownerEmail = inquiry.venues.owner_email
  if (inquiry.venues.owner_id) {
    const { data } = await supabaseAdmin.auth.admin.getUserById(inquiry.venues.owner_id)
    if (data?.user?.email) ownerEmail = data.user.email
  }
  // Unclaimed listings added from directory research use a placeholder address.
  if (ownerEmail === 'unclaimed@thedesivenue.com') ownerEmail = null

  await notifyNewInquiry({
    ownerEmail,
    venueName: inquiry.venues.name,
    venueId: inquiry.venues.id,
    senderName: inquiry.name,
    message: inquiry.message,
  })

  return NextResponse.json({ ok: true })
}
