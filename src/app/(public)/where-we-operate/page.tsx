import type { Metadata } from 'next'
import Link from 'next/link'
import Contact from '@/components/sections/Contact'
import { getLocations, getSiteSettings } from '@/lib/db'

export const metadata: Metadata = {
  title: 'Where We Operate | Rufus Design',
  description: 'Web design across Hertfordshire, Buckinghamshire and beyond.',
  alternates: { canonical: '/where-we-operate' },
}
export const revalidate = 0

export default async function WhereWeOperatePage() {
  let locationList: any[] = []
  let settings: any = {}
  try {
    const [locations, siteSettings] = await Promise.allSettled([
      getLocations(), getSiteSettings(),
    ]).then(r => r.map(x => x.status === 'fulfilled' ? x.value : null))
    locationList = (locations as any[]) || []
    settings = (siteSettings as any) || {}
  } catch { /* fallback */ }

  return (
    <>
      <section className="page-hero" style={{ background: 'var(--bg)' }}>
        <p className="page-hero-label">Where we work</p>
        <h1>Where we operate<span className="dot">.</span></h1>
        <p className="page-hero-intro">Based in Berkhamsted, we work with businesses across Hertfordshire, Buckinghamshire, and throughout the UK.</p>
      </section>

      <section className="section" style={{ background: 'var(--bg2)' }}>
        {locationList.length > 0 ? (
          <div className="services-grid">
            {locationList.map((loc: any) => (
              <Link key={loc.id} href={`/where-we-operate/${loc.slug}`} style={{ textDecoration: 'none' }}>
                <div className="service-card">
                  <p className="service-num">{loc.county}</p>
                  <h2 className="service-name">{loc.town}</h2>
                  {loc.intro && <p className="service-desc">{loc.intro.slice(0, 100)}…</p>}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p style={{ color: 'var(--muted)' }}>No locations added yet.</p>
        )}
      </section>

      <Contact phone={settings?.phone} email={settings?.email} />
    </>
  )
}
