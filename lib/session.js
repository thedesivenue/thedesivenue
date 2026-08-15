import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import crypto from 'crypto'

const COOKIE_NAME = 'admin_session'
const MAX_AGE = 60 * 60 * 24 * 7 // 7 days

function sign(value) {
  const hmac = crypto.createHmac('sha256', process.env.SESSION_SECRET).update(value).digest('hex')
  return `${value}.${hmac}`
}

function verify(signed) {
  if (!signed) return false
  const [value, hmac] = signed.split('.')
  if (!value || !hmac) return false
  const expected = crypto.createHmac('sha256', process.env.SESSION_SECRET).update(value).digest('hex')
  try {
    return crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(expected))
  } catch {
    return false
  }
}

export async function createAdminSession() {
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, sign(String(Date.now())), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: MAX_AGE,
  })
}

export async function destroyAdminSession() {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}

export async function isAdminSession() {
  const cookieStore = await cookies()
  return verify(cookieStore.get(COOKIE_NAME)?.value)
}

export async function requireAdminSession() {
  if (!(await isAdminSession())) redirect('/admin/login')
}
