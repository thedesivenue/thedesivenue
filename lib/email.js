import { Resend } from 'resend'
import nodemailer from 'nodemailer'

const RESEND_FROM = 'The Desi Venue <onboarding@resend.dev>'

let resendClient = null
function getResend() {
  if (!process.env.RESEND_API_KEY) return null
  if (!resendClient) resendClient = new Resend(process.env.RESEND_API_KEY)
  return resendClient
}

let gmailTransporter = null
function getGmailTransporter() {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) return null
  if (!gmailTransporter) {
    gmailTransporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD },
    })
  }
  return gmailTransporter
}

async function sendViaResend({ to, subject, html }) {
  const resend = getResend()
  if (!resend) return null
  const { error } = await resend.emails.send({ from: RESEND_FROM, to, subject, html })
  if (error) throw new Error(error.message || 'Resend send failed')
  return { sent: true, provider: 'resend' }
}

async function sendViaGmail({ to, subject, html }) {
  const transporter = getGmailTransporter()
  if (!transporter) return null
  await transporter.sendMail({ from: `The Desi Venue <${process.env.GMAIL_USER}>`, to, subject, html })
  return { sent: true, provider: 'gmail' }
}

// Resend is primary (higher limits, dedicated sending domain); Gmail is the
// fallback for when Resend's free-tier limit (100/day) is hit or its call
// errors for any other reason.
export async function sendEmail({ to, subject, html }) {
  try {
    const result = await sendViaResend({ to, subject, html })
    if (result) return result
  } catch (error) {
    console.warn('[email] Resend failed, falling back to Gmail:', error.message)
  }

  try {
    const result = await sendViaGmail({ to, subject, html })
    if (result) return result
  } catch (error) {
    console.error('[email] Gmail fallback also failed:', error.message)
    return { error: error.message }
  }

  console.warn(`[email] No provider configured — skipped sending "${subject}" to ${to}`)
  return { skipped: true }
}
