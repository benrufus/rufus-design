import type { Metadata } from 'next'
import PageHero from '@/components/ui/PageHero'
import LocationCard from '@/components/ui/LocationCard'
import Contact from '@/components/sections/Contact'
import { getLocations } from '@/lib/db'

export const metadata: Metadata = {
  title: 'Where We Operate',
  description: 'Rufus Design provides web design and digital marketing across Hertfordshire, Buckinghamshire and London.',
  alternates: { canonical: '/where-we-operate' },
}
export const revalidate = 60

const FALLBACK: { town: string; county: string; slug: string }[] = [
  { town: 'Berkhamsted', county: 'Hertfordshire', slug: 'berkhamsted' },
  { town: 'Tring', county: 'Hertfordshire', slug: 'tring' },
  { town: 'Hemel Hempstead', county: 'Hertfordshire', slug: 'hemel-hempstead' },
  { town: 'St Albans', county: 'Hertfordshire', slug: 'st-albans' },
  { town: 'Watford', county: 'Hertfordshire', slug: 'watford' },
  { town: 'Aylesbury', county: 'Buckinghamshire', slug: 'aylesbury' },
  { town: 'Harpenden', county: 'Hertfordshire', slug: 'harpenden' },
  { town: 'Chesham', county: 'Buckinghamshire', slug: 'chesham' },
  { town: 'London', county: 'London', slug: 'london' },
]

export default async function WhereWeOperatePage() {
  const locations = await getLocations().catch(() => [])
  const list = locations.length ? locations : FALLBACK

  return (
    <>
      <PageHero label="Service areas" title="Where we operate" intro="Based in Berkhamsted, we work with businesses across Hertfordshire, Buckinghamshire and London." />
      <section className="section">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {list.map((loc: any) => (
            <LocationCard key={loc.id || loc.town} loc={{ id: loc.id, town: loc.town, county: loc.county, slug: loc.slug, image_url: loc.image_url, intro: loc.intro }} />
          ))}
        </div>
      </section>
      <Contact />
    </>
  )
}
