import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { BackLink } from '@/components/ui/BackLink'

export const metadata = {
  title: 'Privacy Policy',
  description: 'How The Desi Venue collects, uses, and protects your information.',
}

const sections = [
  {
    title: '1. Information we collect',
    body: `We collect information you give us directly: your name, email, and phone number when you create an
    account, submit an inquiry to a venue, list a venue, leave a review, or contact us. If you list a venue, we
    also collect the venue's details (address, capacity, pricing, photos, and cultural-event features). We do
    not collect payment information — there is no paid transaction on the platform today.`,
  },
  {
    title: '2. How we use your information',
    body: `We use your information to operate the platform: connecting event planners with venues, sending
    inquiry notifications to venue owners, verifying venue-claim requests, and communicating with you about your
    account. We do not sell your information to third parties.`,
  },
  {
    title: '3. Who we share it with',
    body: `Your information is shared with the specific venue you contact, so they can respond to your inquiry.
    We use third-party service providers to run the platform: Supabase (database, authentication, and file
    storage), Resend and Gmail (transactional email), and Vercel (hosting). These providers only process data on
    our behalf and don't use it for their own purposes.`,
  },
  {
    title: '4. Cookies and analytics',
    body: `We use a small number of essential cookies to keep you signed in. We may use privacy-friendly,
    cookieless analytics to understand overall site traffic; this does not track you individually across other
    websites.`,
  },
  {
    title: '5. Unclaimed venue listings',
    body: `Some venue listings are added from public directory research to help event planners discover options,
    and are marked as pending verification until the venue owner claims and confirms the details. If you own a
    venue listed this way and want it corrected or removed, contact us.`,
  },
  {
    title: '6. Your rights',
    body: `You can access, correct, or delete your account information at any time from your account page, or by
    contacting us. If you'd like a copy of the data we hold about you, or want it deleted entirely, email us and
    we'll take care of it.`,
  },
  {
    title: '7. Children’s privacy',
    body: `The Desi Venue is not directed at children, and we do not knowingly collect information from anyone
    under 13.`,
  },
  {
    title: '8. Changes to this policy',
    body: `If we make material changes to this policy, we'll update the date below and, where appropriate, note
    it on the site.`,
  },
  {
    title: '9. Contact us',
    body: `Questions about this policy? Reach us through our contact page.`,
  },
]

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-cream">
        <div className="px-6 pt-6">
          <BackLink href="/">Back to home</BackLink>
        </div>

        <section className="mx-auto max-w-2xl px-6 py-14">
          <h1 className="font-display text-4xl font-bold text-ink">Privacy Policy</h1>
          <p className="mt-2 text-[13px] uppercase tracking-wide text-muted">Last updated August 2026</p>

          <div className="mt-10 space-y-8">
            {sections.map((s) => (
              <div key={s.title}>
                <h2 className="font-display text-lg font-bold text-plum">{s.title}</h2>
                <p className="mt-2 text-[15px] leading-relaxed text-plum-light">{s.body}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
