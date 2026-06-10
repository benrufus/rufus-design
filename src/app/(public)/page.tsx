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
    title: seo?.title || 'Web Design Berkhamsted',
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
