import type { Metadata } from 'next'
import PageHero from '@/components/ui/PageHero'
import WorkGrid from '@/components/sections/WorkGrid'
import Contact from '@/components/sections/Contact'
import Breadcrumb from '@/components/ui/Breadcrumb'
import { getWork } from '@/lib/db'

export const metadata: Metadata = {
  title: 'Our Work | Rufus Design',
  description: 'From website design to results-driven digital marketing, we help businesses across Hertfordshire and London grow online.',
  alternates: { canonical: '/work' },
}
export const revalidate = 60

export default async function WorkPage() {
  const work = await getWork().catch(() => [])
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.rufusdesign.co.uk'

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Our Work | Rufus Design',
    description: 'Web design and digital marketing projects by Rufus Design, Berkhamsted.',
    url: `${siteUrl}/work`,
    publisher: { '@type': 'Organization', name: 'Rufus Design', url: siteUrl },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Breadcrumb crumbs={[{ label: 'Home', href: '/' }, { label: 'Our Work' }]} />
      <PageHero label="Selected projects" title="Our work" intro="From website design to results-driven digital marketing, we help businesses across Hertfordshire and London grow online." />
      <WorkGrid items={work} />
      <Contact />
    </>
  )
}
