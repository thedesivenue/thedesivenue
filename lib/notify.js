import { sendEmail } from '@/lib/email'

const SITE_URL = 'https://www.thedesivenue.com'

const wrapper = (title, bodyHtml) => `
  <div style="font-family:-apple-system,Helvetica,Arial,sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;">
    <p style="font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#a9812f;margin:0 0 16px;">The Desi Venue</p>
    <h1 style="font-size:20px;color:#2a1245;margin:0 0 16px;">${title}</h1>
    ${bodyHtml}
  </div>
`

export async function notifyNewInquiry({ ownerEmail, venueName, venueId, senderName, message }) {
  if (!ownerEmail) return
  return sendEmail({
    to: ownerEmail,
    subject: `New inquiry for ${venueName}`,
    html: wrapper('You have a new inquiry', `
      <p style="color:#2c1f3b;font-size:15px;line-height:1.6;">
        ${senderName} sent an inquiry about <strong>${venueName}</strong>:
      </p>
      <p style="color:#6f6478;font-size:14px;line-height:1.6;border-left:2px solid #e7e3ea;padding-left:12px;">${message || '(no message)'}</p>
      <p style="margin-top:24px;">
        <a href="${SITE_URL}/account/venues/${venueId}" style="color:#2a1245;font-size:13px;">Reply on The Desi Venue →</a>
      </p>
    `),
  })
}

export async function notifyNewReply({ toEmail, venueName, replyBody, accountUrl }) {
  if (!toEmail) return
  return sendEmail({
    to: toEmail,
    subject: `New reply about ${venueName}`,
    html: wrapper('You have a new reply', `
      <p style="color:#2c1f3b;font-size:15px;line-height:1.6;">
        Regarding <strong>${venueName}</strong>:
      </p>
      <p style="color:#6f6478;font-size:14px;line-height:1.6;border-left:2px solid #e7e3ea;padding-left:12px;">${replyBody}</p>
      <p style="margin-top:24px;">
        <a href="${SITE_URL}${accountUrl}" style="color:#2a1245;font-size:13px;">View the conversation →</a>
      </p>
    `),
  })
}

export async function notifyClaimApproved({ toEmail, venueName, venueId }) {
  if (!toEmail) return
  return sendEmail({
    to: toEmail,
    subject: `Your claim on ${venueName} was approved`,
    html: wrapper('Your listing is now yours', `
      <p style="color:#2c1f3b;font-size:15px;line-height:1.6;">
        Your claim on <strong>${venueName}</strong> has been approved. You can now edit its details, manage photos, and reply to inquiries from your account.
      </p>
      <p style="margin-top:24px;">
        <a href="${SITE_URL}/account/venues/${venueId}" style="color:#2a1245;font-size:13px;">Manage your venue →</a>
      </p>
    `),
  })
}
