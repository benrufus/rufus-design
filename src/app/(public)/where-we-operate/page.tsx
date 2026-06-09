import type { Metadata } from 'next'
import Link from 'next/link'
import PageHero from '@/components/ui/PageHero'
import Contact from '@/components/sections/Contact'
import { getLocations, getSiteSettings } from '@/lib/db'

export const metadata: Metadata = {
  title: 'Where We Operate | Rufus Design',
  description: 'Rufus Design provides web design and digital marketing services across Hertfordshire, Buckinghamshire and beyond.',
  alternates: { canonical: '/where-we-operate' },
}
export const revalidate = 0

export default async function WhereWeOperatePage() {
  const [locations, siteSettings] = await Promise.allSettled([
    getLocations(), getSiteSettings(),
  ]).then(r => r.map(x => x.status === 'fulfilled' ? x.value : null))

  const locationList = (locations as any[]) || []
  const settings = siteSettings as any

  return (
    <>
      <PageHero
        label="Our reach"
        title="Where we operate"
        intro="Based in Berkhamsted, we work with businesses across Hertfordshire, Buckinghamshire, and throughout the UK."
      />

      {locationList.length > 0 && (
        <section className="section" style={{ background: 'var(--bg2)' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1px',
            background: 'var(--border)',
            border: '1px solid var(--border)',
          }}>
            {locationList.map((loc: any) => (
              <Link key={loc.id} href={`/where-we-operate/${loc.slug}`} style={{ textDecoration: 'none' }}>
                <div style={{
                  background: 'var(--bg)',
                  padding: '2rem',
                  transition: 'background 0.3s',
                  height: '100%',
                }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,128,0,0.06)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'var(--bg)')}
                >
                  {loc.hero_image && (
                    <div style={{ aspectRatio: '16/9', overflow: 'hidden', marginBottom: '1.25rem' }}>
                      <img src={loc.hero_image} alt={loc.town} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  )}
                  <h2 style={{
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 800,
                    fontSize: '1.3rem',
                    color: '#fff',
                    marginBottom: '0.25rem',
                  }}>{loc.town}</h2>
                  {loc.county && (
                    <p style={{ fontSize: '0.75rem', color: 'var(--orange)', fontWeight: 600, letterSpacing: '0.05em', marginBottom: '0.75rem' }}>{loc.county}</p>
                  )}
                  {loc.intro && (
                    <p style={{ fontSize: '0.875rem', color: 'var(--muted)', lineHeight: 1.6 }}>
                      {loc.intro.length > 120 ? loc.intro.slice(0, 120) + '…' : loc.intro}
                    </p>
                  )}
                  <p style={{ marginTop: '1rem', fontSize: '0.75rem', color: 'var(--orange)', fontFamily: 'var(--font-heading)', fontWeight: 700, letterSpacing: '0.05em' }}>
                    Learn more →
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <Contact phone={settings?.phone} email={settings?.email} />
    </>
  )
}
