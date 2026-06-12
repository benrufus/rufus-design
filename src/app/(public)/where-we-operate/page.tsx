import type { Metadata } from 'next'
import Link from 'next/link'
import Contact from '@/components/sections/Contact'
import Breadcrumb from '@/components/ui/Breadcrumb'
import { getLocations, getSiteSettings, getPageSeo } from '@/lib/db'
import GridCanvas from '@/components/ui/GridCanvas'

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo('where-we-operate').catch(() => null)
  return {
    title: seo?.title || 'Where We Operate',
    description: seo?.description || 'Web design across Hertfordshire, Buckinghamshire and beyond.',
    alternates: { canonical: '/where-we-operate' },
  }
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

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.rufusdesign.co.uk'

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Where We Operate | Rufus Design',
    url: `${siteUrl}/where-we-operate`,
    itemListElement: locationList.map((loc: any, i: number) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: `Web Design ${loc.town}`,
      url: `${siteUrl}/where-we-operate/${loc.slug}`,
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Breadcrumb crumbs={[{ label: 'Home', href: '/' }, { label: 'Where We Operate' }]} />

      <section className="page-hero" style={{ background: 'var(--bg)', position: 'relative' }}>
  <GridCanvas />
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
