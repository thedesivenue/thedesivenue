'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient as createServerSupabase } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function sendPlannerReply(prevState, formData) {
  const inquiryId = formData.get('inquiry_id')
  const body = formData.get('body')?.toString().trim()
  if (!body) return { error: 'Message cannot be empty.' }

  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: inquiry } = await supabaseAdmin.from('inquiries').select('user_id').eq('id', inquiryId).single()
  if (!inquiry || inquiry.user_id !== user.id) redirect('/account')

  const { error } = await supabaseAdmin.from('inquiry_messages').insert([{ inquiry_id: inquiryId, sender_id: user.id, body }])
  if (error) return { error: 'Something went wrong sending your reply.' }

  revalidatePath('/account')
  return { success: true }
}
