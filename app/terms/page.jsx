import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { BackLink } from '@/components/ui/BackLink'

export const metadata = {
  title: 'Terms of Service',
  description: 'The terms that govern your use of The Desi Venue.',
}

const sections = [
  {
    title: '1. Using the platform',
    body: `The Desi Venue lets event planners browse and inquire about Indian-event-ready venues in New Jersey,
    and lets venue owners list and manage their venues. You must provide accurate information when creating an
    account, submitting an inquiry, or listing a venue.`,
  },
  {
    title: '2. Venue listings and accuracy',
    body: `Some listings are added from public directory research and marked as pending verification; their
    capacity, pricing, and policies have not been independently confirmed. Claimed listings are maintained by the
    venue owner, who is responsible for their accuracy. We don't guarantee the accuracy of any listing and
    recommend confirming details directly with the venue before booking.`,
  },
  {
    title: '3. No booking or payment through the platform',
    body: `The Desi Venue is a discovery and inquiry tool. We don't process bookings or payments, and we're not a
    party to any agreement you make with a venue. Any deposit, contract, or payment happens directly between you
    and the venue.`,
  },
  {
    title: '4. User content',
    body: `Reviews, messages, and venue descriptions you submit must be honest and lawful. We may remove content
    that's false, abusive, spam, or otherwise violates these terms.`,
  },
  {
    title: '5. Venue claims',
    body: `Claiming a venue is meant for its actual owner or an authorized representative. We review claim
    requests before approving them; submitting a false claim may result in account termination.`,
  },
  {
    title: '6. Prohibited conduct',
    body: `Don't misuse the platform: no scraping, no impersonating a venue you don't represent, no submitting
    fake inquiries or reviews, and no attempting to bypass the platform's security.`,
  },
  {
    title: '7. Disclaimer and limitation of liability',
    body: `The platform is provided "as is," without warranties of any kind. To the fullest extent permitted by
    law, The Desi Venue is not liable for any damages arising from your use of the platform or your dealings with
    a venue found through it.`,
  },
  {
    title: '8. Changes to these terms',
    body: `We may update these terms from time to time; the date below reflects the most recent version.`,
  },
  {
    title: '9. Governing law',
    body: `These terms are governed by the laws of the State of New Jersey, USA.`,
  },
  {
    title: '10. Contact us',
    body: `Questions about these terms? Reach us through our contact page.`,
  },
]

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-cream">
        <div className="px-6 pt-6">
          <BackLink href="/">Back to home</BackLink>
        </div>

        <section className="mx-auto max-w-2xl px-6 py-14">
          <h1 className="font-display text-4xl font-bold text-ink">Terms of Service</h1>
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
