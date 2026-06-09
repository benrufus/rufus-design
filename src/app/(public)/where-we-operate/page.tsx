import { Metadata } from 'next'
import { client, LOCATIONS_QUERY } from '@/lib/sanity'
import Nav from '@/components/layout/Nav'
import Footer from '@/components/layout/Footer'
import Hero from '@/components/sections/Hero'
import Contact from '@/components/sections/Contact'
import LocationCard from '@/components/ui/LocationCard'

export const metadata: Metadata = {
  title: 'Where We Operate',
  description: 'Rufus Design provides web design and digital marketing services across Hertfordshire and London, including Berkhamsted, Tring, Hemel Hempstead, St Albans, Watford and more.',
  alternates: { canonical: '/where-we-operate' },
}
export const revalidate = 60

const FALLBACK_LOCATIONS = [
  { town: 'Berkhamsted', county: 'Hertfordshire', slug: { current: 'berkhamsted' } },
  { town: 'Tring', county: 'Hertfordshire', slug: { current: 'tring' } },
  { town: 'Hemel Hempstead', county: 'Hertfordshire', slug: { current: 'hemel-hempstead' } },
  { town: 'St Albans', county: 'Hertfordshire', slug: { current: 'st-albans' } },
  { town: 'Watford', county: 'Hertfordshire', slug: { current: 'watford' } },
  { town: 'Aylesbury', county: 'Buckinghamshire', slug: { current: 'aylesbury' } },
  { town: 'Harpenden', county: 'Hertfordshire', slug: { current: 'harpenden' } },
  { town: 'Chesham', county: 'Buckinghamshire', slug: { current: 'chesham' } },
  { town: 'London', county: 'London', slug: { current: 'london' } },
]

export default async function WhereWeOperatePage() {
  const locations = await client.fetch(LOCATIONS_QUERY).catch(() => [])
  const list = locations.length ? locations : FALLBACK_LOCATIONS

  // Use town names as the cycling words in the hero
  const townWords = list.map((l: { town: string }) => l.town)

  return (
    <>
      <Nav />
      <main>
        <Hero
          words={townWords}
          subtext="Based in Berkhamsted, we work with businesses across Hertfordshire, Buckinghamshire and London. Click your area to find out more."
          cta1="Let's talk"
          cta2="Our work"
        />

        <section style={{ padding: 'clamp(3rem,6vw,6rem) clamp(1.5rem,4vw,3rem)', background: 'var(--bg)' }}>
          <p style={{ fontSize: '0.65rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#ff8000', marginBottom: '1.25rem' }}>
            Service areas
          </p>
          <h2 style={{ fontFamily: 'var(--font-raleway)', fontWeight: 800, fontSize: 'clamp(2rem,5vw,4rem)', letterSpacing: '-0.03em', marginBottom: '3rem' }}>
            Where we work<span style={{ color: '#ff8000' }}>.</span>
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {list.map((loc: { _id?: string; town: string; county: string; slug: { current: string }; heroImage?: object; intro?: string; services?: string[] }) => (
              <LocationCard key={loc._id || loc.town} loc={loc} />
            ))}
          </div>
        </section>

        <Contact />
      </main>
      <Footer />
    </>
  )
}
