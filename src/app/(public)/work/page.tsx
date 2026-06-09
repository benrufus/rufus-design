import type { Metadata } from 'next'
import PageHero from '@/components/ui/PageHero'
import WorkGrid from '@/components/sections/WorkGrid'
import Contact from '@/components/sections/Contact'
import { getWork } from '@/lib/db'

export const metadata: Metadata = {
  title: 'Our Work',
  description: 'From website design to results-driven digital marketing, we help businesses across Hertfordshire and London grow online.',
  alternates: { canonical: '/work' },
}
export const revalidate = 60

export default async function WorkPage() {
  const work = await getWork().catch(() => [])
  return (
    <>
      <PageHero label="Selected projects" title="Our work" intro="From website design to results-driven digital marketing, we help businesses across Hertfordshire and London grow online." />
      <WorkGrid items={work} />
      <Contact />
    </>
  )
}
