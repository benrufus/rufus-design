import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import WorkGrid from '@/components/sections/WorkGrid'
import Contact from '@/components/sections/Contact'
import LocationHero from '@/components/ui/LocationHero'
import { getLocationBySlug, getWork, getSiteSettings } from '@/lib/db'

export const revalidate = 0

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const loc = await getLocationBySlug(slug).catch(() => null)
  if (!loc) return {}
  return {
    title: loc.meta_title || `Web Design ${loc.town} | Rufus Design`,
    description: loc.meta_description || `Professional web design and digital marketing in ${loc.town}, ${loc.county}. Rufus Design — Est. 2007.`,
    alternates: { canonical: `/where-we-operate/${slug}` },
  }
}

export default async function LocationPage({ params }: Props) {
  const { slug } = await params
  const [loc, work, siteSettings] = await Promise.allSettled([
    getLocationBySlug(slug),
    getWork(),
    getSiteSettings(),
  ]).then(r => r.map(x => x.status === 'fulfilled' ? x.value : null))

  if (!loc) notFound()

  const location = loc as any
  const workItems = (work as any[]) || []
  const settings = siteSettings as any

  return (
    <>
      {/* Hero — same cycling effect but static for this town */}
      <LocationHero
        prefix="Web design in"
        words={[location.town]}
        staticWord={location.town}
        intro={location.intro || `Professional web design and digital marketing services in ${location.town}, ${location.county || 'Hertfordshire'}.`}
      />

      {/* Body content */}
      {location.body && typeof location.body === 'string' && location.body.trim() && (
        <section className="section" style={{ background: 'var(--bg)' }}>
          <div style={{ maxWidth: '720px', lineHeight: 1.9, color: 'rgba(255,255,255,0.8)', fontSize: '1.05rem' }}
            dangerouslySetInnerHTML={{ __html: location.body }}
          />
        </section>
      )}

      {/* Services offered in this area */}
      {location.services?.length > 0 && (
        <section className="section" style={{ background: 'var(--bg2)' }}>
          <p className="section-label">What we offer in {location.town}</p>
          <h2 className="section-title">Our services<span className="dot">.</span></h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '2rem' }}>
            {location.services.map((service: string) => (
              <Link key={service} href="/contact" style={{
                display: 'inline-block',
                padding: '0.6rem 1.25rem',
                background: 'rgba(255,128,0,0.1)',
                border: '1px solid rgba(255,128,0,0.25)',
                color: 'var(--orange)',
                fontSize: '0.8rem',
                fontFamily: 'var(--font-heading)',
                fontWeight: 700,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                transition: 'background 0.2s, border-color 0.2s',
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,128,0,0.2)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,128,0,0.1)' }}
              >
                {service}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Our work — same grid as homepage */}
      {workItems.length > 0 && <WorkGrid items={workItems} showTitle />}

      {/* Contact */}
      <Contact phone={settings?.phone} email={settings?.email} />
    </>
  )
}
