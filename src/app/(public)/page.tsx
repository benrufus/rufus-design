import type { Metadata } from 'next'
import Hero from '@/components/sections/Hero'
import Marquee from '@/components/sections/Marquee'
import Services from '@/components/sections/Services'
import WorkGrid from '@/components/sections/WorkGrid'
import About from '@/components/sections/About'
import Testimonials from '@/components/sections/Testimonials'
import News from '@/components/sections/News'
import Contact from '@/components/sections/Contact'
import { getHomePage, getWork, getPosts, getTestimonials, getServices, getStats, getMarqueeItems, getContactForm, getSiteSettings } from '@/lib/db'

export const metadata: Metadata = {
  title: 'Rufus Design | Web Design Berkhamsted',
  description: 'Award-winning web design and digital marketing agency based in Berkhamsted, Hertfordshire. Est. 2007.',
  alternates: { canonical: '/' },
}
export const revalidate = 60

export default async function HomePage() {
  const [homePage, work, posts, testimonials, services, stats, marqueeItems, contactForm, siteSettings] = await Promise.allSettled([
    getHomePage(), getWork(), getPosts(), getTestimonials(), getServices(), getStats(), getMarqueeItems(), getContactForm(), getSiteSettings(),
  ]).then(results => results.map(r => r.status === 'fulfilled' ? r.value : null))

  return (
    <>
      <Hero
        words={(homePage as any)?.hero_words || undefined}
        intro={(homePage as any)?.hero_intro || undefined}
      />
      <Marquee items={(marqueeItems as any[])?.map((m: any) => m.label) || undefined} />
      <WorkGrid items={(work as any[]) || []} showTitle />
      <Services services={(services as any[]) || undefined} />
      <About
        headline={(homePage as any)?.about_headline || undefined}
        body={(homePage as any)?.about_body || undefined}
        stats={(stats as any[]) || undefined}
      />
      <Testimonials items={(testimonials as any[]) || undefined} />
      <News posts={((posts as any[]) || []).slice(0, 3)} />
      <Contact
        fields={(contactForm as any)?.fields || undefined}
        phone={(siteSettings as any)?.phone || undefined}
        email={(siteSettings as any)?.email || undefined}
      />
    </>
  )
}
