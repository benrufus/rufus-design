import type { Metadata } from 'next'
import SectionRenderer from '@/components/sections/SectionRenderer'
import {
  getHomePage, getWork, getPosts, getTestimonials,
  getServices, getStats, getMarqueeItems, getContactForm,
  getSiteSettings, getPageSections, getLogoStrips, getPageSeo
} from '@/lib/db'

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo('home').catch(() => null)
  return {
    title: {
      absolute: seo?.title || 'Rufus Design | Web Design Berkhamsted'
    },
    description: seo?.description || 'Award-winning web design and digital marketing agency based in Berkhamsted, Hertfordshire. Est. 2007.',
    alternates: { canonical: '/' },
  }
}

export const revalidate = 0

export default async function HomePage() {
  const [sections, homePage, work, posts, testimonials, services, stats, marqueeItems, contactForm, siteSettings, logoStrips] =
    await Promise.allSettled([
      getPageSections('home'),
      getHomePage(),
      getWork(),
      getPosts(),
      getTestimonials(),
      getServices(),
      getStats('home'),
      getMarqueeItems(),
      getContactForm(),
      getSiteSettings(),
      getLogoStrips(),
    ]).then(results => results.map(r => r.status === 'fulfilled' ? r.value : null))

  const data = {
    homePage,
    work: work || [],
    posts: posts || [],
    testimonials: testimonials || [],
    services: services || [],
    stats: stats || [],
    marqueeItems: marqueeItems || [],
    contactForm,
    siteSettings,
    logoStrips: logoStrips || [],
  }

  const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Rufus Design',
  url: 'https://www.rufusdesign.co.uk',
  logo: 'https://www.rufusdesign.co.uk/icon.png',
  foundingDate: '2007',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Friars Field',
    addressLocality: 'Berkhamsted',
    addressRegion: 'Hertfordshire',
    addressCountry: 'GB',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+441442967775',
    contactType: 'customer service',
  },
  sameAs: [
    'https://www.facebook.com/rufusdesign',
    'https://www.instagram.com/rufusdesign',
    'https://www.linkedin.com/company/rufus-design',
  ],
}

return (
  <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    {visibleSections.map(...)}
  </>
)
  
  const visibleSections = ((sections as any[]) || [])
    .filter((s: any) => s.visible)
    .sort((a: any, b: any) => a.sort_order - b.sort_order)

  return (
    <>
      {visibleSections.map((section: any) => (
        <SectionRenderer key={section.id} section={section} data={data} />
      ))}
    </>
  )
}
