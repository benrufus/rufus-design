import type { Metadata } from 'next'
import PageHero from '@/components/ui/PageHero'
import Contact from '@/components/sections/Contact'
import Breadcrumb from '@/components/ui/Breadcrumb'
import { getSiteSettings } from '@/lib/db'

export const metadata: Metadata = {
  title: 'Contact Us | Rufus Design',
  description: 'Get in touch with Rufus Design. Based in Berkhamsted, Hertfordshire.',
  alternates: { canonical: '/contact' },
}
export const revalidate = 60

export default async function ContactPage() {
  const settings = await getSiteSettings().catch(() => null) as any
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.rufusdesign.co.uk'

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact Rufus Design',
    url: `${siteUrl}/contact`,
    mainEntity: {
      '@type': 'Organization',
      name: 'Rufus Design',
      url: siteUrl,
      telephone: settings?.phone || '',
      email: settings?.email || 'hello@rufusdesign.co.uk',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '4 Friars Field',
        addressLocality: 'Berkhamsted',
        addressRegion: 'Hertfordshire',
        addressCountry: 'GB',
      },
    },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Breadcrumb crumbs={[{ label: 'Home', href: '/' }, { label: 'Contact' }]} />
      <PageHero label="Say hello" title="Contact us" intro="Ready to start your project? Get in touch and we'll get back to you within one working day." />
      <Contact phone={settings?.phone} email={settings?.email} />
    </>
  )
}
