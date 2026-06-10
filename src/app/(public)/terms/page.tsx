import type { Metadata } from 'next'
import PageHero from '@/components/ui/PageHero'

export const metadata: Metadata = {
  title: 'Terms & Conditions | Rufus Design',
  description: 'Terms and Conditions for Rufus Design Limited.',
  robots: { index: false, follow: false },
}

export default function TermsPage() {
  return (
    <>
      <PageHero label="Legal" title="Terms &amp; Conditions" intro="Last updated: June 2026" />
      <section className="section" style={{ background: 'var(--bg)' }}>
        <div style={{ maxWidth: '720px', lineHeight: 1.9, color: 'rgba(255,255,255,0.75)', fontSize: '1rem' }}>

          <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.4rem', color: '#fff', marginBottom: '1rem', marginTop: '2.5rem' }}>1. Introduction</h2>
          <p>These terms and conditions govern your use of the Rufus Design Limited website and the services we provide. By using our website or engaging our services, you accept these terms in full. Rufus Design Limited is registered in England and Wales.</p>

          <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.4rem', color: '#fff', marginBottom: '1rem', marginTop: '2.5rem' }}>2. Services</h2>
          <p>Rufus Design Limited provides web design, development, digital marketing, SEO, PPC, and managed hosting services. The specific scope, deliverables, timelines and fees for each project are agreed in writing prior to commencement.</p>

          <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.4rem', color: '#fff', marginBottom: '1rem', marginTop: '2.5rem' }}>3. Payment terms</h2>
          <p>Unless otherwise agreed in writing:</p>
          <ul style={{ paddingLeft: '1.5rem', marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <li>A deposit of 50% is required before work commences on any project</li>
            <li>The remaining balance is due on completion, prior to launch</li>
            <li>Ongoing retainer services are invoiced monthly in advance</li>
            <li>Invoices are payable within 14 days of issue</li>
            <li>Late payments may incur interest at 8% above the Bank of England base rate</li>
          </ul>

          <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.4rem', color: '#fff', marginBottom: '1rem', marginTop: '2.5rem' }}>4. Intellectual property</h2>
          <p>Upon receipt of full payment, the client owns the final delivered work product. Rufus Design Limited retains the right to display the work in our portfolio unless otherwise agreed. We retain ownership of any tools, frameworks, or underlying code libraries used in delivery.</p>

          <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.4rem', color: '#fff', marginBottom: '1rem', marginTop: '2.5rem' }}>5. Client responsibilities</h2>
          <p>The client is responsible for:</p>
          <ul style={{ paddingLeft: '1.5rem', marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <li>Providing accurate content, assets and feedback in a timely manner</li>
            <li>Ensuring they have the right to use any content or images supplied to us</li>
            <li>Reviewing and approving work at agreed milestones</li>
            <li>Maintaining the security of their own login credentials</li>
          </ul>

          <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.4rem', color: '#fff', marginBottom: '1rem', marginTop: '2.5rem' }}>6. Limitation of liability</h2>
          <p>Rufus Design Limited shall not be liable for any indirect, incidental or consequential loss arising from use of our services or website. Our total liability in any matter shall not exceed the fees paid by the client for the relevant project.</p>

          <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.4rem', color: '#fff', marginBottom: '1rem', marginTop: '2.5rem' }}>7. Termination</h2>
          <p>Either party may terminate a project with 30 days written notice. In the event of termination, the client shall pay for all work completed to date. The deposit is non-refundable once work has commenced.</p>

          <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.4rem', color: '#fff', marginBottom: '1rem', marginTop: '2.5rem' }}>8. Governing law</h2>
          <p>These terms are governed by the laws of England and Wales. Any disputes shall be subject to the exclusive jurisdiction of the courts of England and Wales.</p>

          <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.4rem', color: '#fff', marginBottom: '1rem', marginTop: '2.5rem' }}>9. Contact</h2>
          <p>
            Rufus Design Limited<br />
            6 Puller Road, Hemel Hempstead, Hertfordshire<br />
            <a href="mailto:hello@rufusdesign.co.uk" style={{ color: 'var(--orange)' }}>hello@rufusdesign.co.uk</a>
          </p>
        </div>
      </section>
    </>
  )
}
