import type { Metadata } from 'next'
import SectionRenderer from '@/components/sections/SectionRenderer'
import {
  getHomePage, getWork, getPosts, getTestimonials,
  getServices, getStats, getMarqueeItems, getContactForm,
  getSiteSettings, getPageSections
} from '@/lib/db'

export const metadata: Metadata = {
  title: 'Rufus Design | Web Design Berkhamsted',
  description: 'Award-winning web design and digital marketing agency based in Berkhamsted, Hertfordshire. Est. 2007.',
  alternates: { canonical: '/' },
}

export const revalidate = 0

export default async function HomePage() {
  const [sections, homePage, work, posts, testimonials, services, stats, marqueeItems, contactForm, siteSettings] =
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
