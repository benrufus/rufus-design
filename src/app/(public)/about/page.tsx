import type { Metadata } from 'next'
import PageHero from '@/components/ui/PageHero'
import About from '@/components/sections/About'
import Testimonials from '@/components/sections/Testimonials'
import Contact from '@/components/sections/Contact'
import { getAboutPage, getTeam, getValues, getStats, getTestimonials } from '@/lib/db'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Rufus Design is a web design and digital marketing agency based in Berkhamsted, Hertfordshire. Est. 2007.',
  alternates: { canonical: '/about' },
}
export const revalidate = 60

export default async function AboutPage() {
  const [aboutPage, team, values, stats, testimonials] = await Promise.allSettled([
    getAboutPage(), getTeam(), getValues(), getStats(), getTestimonials(),
  ]).then(r => r.map(x => x.status === 'fulfilled' ? x.value : null))

  return (
    <>
      <PageHero label="Our story" title="About us" intro={(aboutPage as any)?.intro || 'A small, focused agency delivering big results since 2007.'} />
      <About
        headline={(aboutPage as any)?.headline || undefined}
        body={(aboutPage as any)?.body || undefined}
        stats={(stats as any[]) || undefined}
      />
      <Testimonials items={(testimonials as any[]) || undefined} />
      <Contact />
    </>
  )
}
