import type { Metadata } from 'next'
import PageHero from '@/components/ui/PageHero'
import Contact from '@/components/sections/Contact'
import Breadcrumb from '@/components/ui/Breadcrumb'
import { getSiteSettings, getPageSeo } from '@/lib/db'

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo('contact').catch(() => null)
  return {
    title: seo?.title || 'Contact Us',
    description: seo?.description || 'Get in touch with Rufus Design. Based in Berkhamsted, Hertfordshire.',
    alternates: { canonical: '/contact' },
  }
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
      <PageHero label="Say hello" title="Got a project, problem or half-finished idea? Let's talk." intro="We've been helping businesses grow online since 2007, and we still prefer conversations over sales pitches." />
      <Contact phone={settings?.phone} email={settings?.email} />
    </>
  )
}
