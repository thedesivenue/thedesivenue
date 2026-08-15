'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createAdminSession, destroyAdminSession, requireAdminSession } from '@/lib/session'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

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
