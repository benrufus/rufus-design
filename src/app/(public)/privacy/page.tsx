import type { Metadata } from 'next'
import PageHero from '@/components/ui/PageHero'

export const metadata: Metadata = {
  title: 'Privacy Policy | Rufus Design',
  description: 'Privacy Policy for Rufus Design Limited.',
  robots: { index: false, follow: false },
}

export default function PrivacyPage() {
  return (
    <>
      <PageHero label="Legal" title="Privacy Policy" intro="Last updated: June 2026" />
      <section className="section" style={{ background: 'var(--bg)' }}>
        <div style={{ maxWidth: '720px', lineHeight: 1.9, color: 'rgba(255,255,255,0.75)', fontSize: '1rem' }}>

          <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.4rem', color: '#fff', marginBottom: '1rem', marginTop: '2.5rem' }}>Who we are</h2>
          <p>Rufus Design Limited ("we", "us", "our") is a web design and digital marketing agency registered in England and Wales. Our registered office is 4 Friars Field, Berkhamsted, Hertfordshire.</p>
          <p style={{ marginTop: '0.75rem' }}>This privacy policy explains how we collect, use and protect your personal data when you use our website or contact us.</p>

          <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.4rem', color: '#fff', marginBottom: '1rem', marginTop: '2.5rem' }}>What data we collect</h2>
          <p>We may collect the following information:</p>
          <ul style={{ paddingLeft: '1.5rem', marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <li>Name and contact information (email, phone number)</li>
            <li>Information you provide via our contact form</li>
            <li>Technical data such as IP address, browser type and operating system (via analytics)</li>
            <li>Usage data about how you interact with our website</li>
          </ul>

          <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.4rem', color: '#fff', marginBottom: '1rem', marginTop: '2.5rem' }}>How we use your data</h2>
          <p>We use the information we collect to:</p>
          <ul style={{ paddingLeft: '1.5rem', marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <li>Respond to enquiries submitted through our contact form</li>
            <li>Improve our website and services</li>
            <li>Send occasional marketing communications (only with your consent)</li>
            <li>Comply with legal obligations</li>
          </ul>

          <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.4rem', color: '#fff', marginBottom: '1rem', marginTop: '2.5rem' }}>Cookies</h2>
          <p>Our website uses cookies and similar tracking technologies to improve your browsing experience and to analyse site traffic. You can control cookie settings through your browser preferences. We use Google Analytics to understand how visitors use our site — this data is anonymised and aggregated.</p>

          <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.4rem', color: '#fff', marginBottom: '1rem', marginTop: '2.5rem' }}>Data storage and security</h2>
          <p>Your data is stored securely using Supabase (hosted on AWS EU infrastructure). We do not sell, trade or transfer your personal information to third parties without your consent, except where required by law.</p>
          <p style={{ marginTop: '0.75rem' }}>Contact form submissions are stored in our secure database and may also be forwarded to our email via Brevo.</p>

          <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.4rem', color: '#fff', marginBottom: '1rem', marginTop: '2.5rem' }}>Your rights</h2>
          <p>Under UK GDPR, you have the right to:</p>
          <ul style={{ paddingLeft: '1.5rem', marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <li>Access the personal data we hold about you</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Object to or restrict processing of your data</li>
            <li>Data portability</li>
          </ul>
          <p style={{ marginTop: '0.75rem' }}>To exercise any of these rights, contact us at <a href="mailto:hello@rufusdesign.co.uk" style={{ color: 'var(--orange)' }}>hello@rufusdesign.co.uk</a>.</p>

          <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.4rem', color: '#fff', marginBottom: '1rem', marginTop: '2.5rem' }}>Contact us</h2>
          <p>If you have any questions about this privacy policy or your personal data, please contact:</p>
          <p style={{ marginTop: '0.75rem' }}>
            Rufus Design Limited<br />
            4 Friars Field, Berkhamsted, Hertfordshire<br />
            <a href="mailto:hello@rufusdesign.co.uk" style={{ color: 'var(--orange)' }}>hello@rufusdesign.co.uk</a>
          </p>
        </div>
      </section>
    </>
  )
}
