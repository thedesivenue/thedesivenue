import { NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email'

export async function POST(request) {
  const body = await request.json()
  const { name, email, message, company } = body

  // Honeypot: real visitors never see or fill this field.
  if (company) {
    return NextResponse.json({ ok: true })
  }

  if (!name || !email || !message) {
    return NextResponse.json({ error: 'Please fill in all fields.' }, { status: 400 })
  }

  const result = await sendEmail({
    to: process.env.GMAIL_USER,
    subject: `Contact form: ${name}`,
    html: `
      <div style="font-family:-apple-system,Helvetica,Arial,sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;">
        <p style="font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#a9812f;margin:0 0 16px;">The Desi Venue</p>
        <h1 style="font-size:20px;color:#2a1245;margin:0 0 16px;">New contact form message</h1>
        <p style="color:#2c1f3b;font-size:15px;line-height:1.6;"><strong>${name}</strong> (${email}) wrote:</p>
        <p style="color:#6f6478;font-size:14px;line-height:1.6;border-left:2px solid #e7e3ea;padding-left:12px;">${message}</p>
      </div>
    `,
  })

  if (result?.error) {
    return NextResponse.json({ error: 'Something went wrong sending your message.' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
