import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import WorkGrid from '@/components/sections/WorkGrid'
import Contact from '@/components/sections/Contact'
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
      {/* Hero — full bleed image if available */}
      <section style={{ paddingTop: '72px', background: 'var(--bg)', position: 'relative' }}>
        {location.hero_image ? (
          <div style={{ width: '100%', maxHeight: '500px', overflow: 'hidden', position: 'relative' }}>
            <img
              src={location.hero_image}
              alt={location.town}
              style={{ width: '100%', maxHeight: '500px', objectFit: 'cover', display: 'block' }}
            />
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0, height: '60%',
              background: 'linear-gradient(to top, rgba(17,17,17,0.97) 0%, transparent 100%)',
            }} />
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 'clamp(1.5rem, 4vw, 3rem)' }}>
              {location.county && (
                <p style={{ fontSize: '0.65rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--orange)', marginBottom: '0.75rem' }}>
                  {location.county}
                </p>
              )}
              <h1 style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: 800,
                fontSize: 'clamp(2.5rem, 6vw, 5rem)',
                lineHeight: 1.05,
                color: '#fff',
              }}>
                Web Design {location.town}<span style={{ color: 'var(--orange)' }}>.</span>
              </h1>
              {location.intro && (
                <p style={{ marginTop: '1rem', fontSize: 'clamp(1rem, 1.4vw, 1.1rem)', color: 'rgba(255,255,255,0.7)', maxWidth: '600px', lineHeight: 1.6 }}>
                  {location.intro}
                </p>
              )}
            </div>
          </div>
        ) : (
          <div style={{ padding: 'clamp(4rem, 8vw, 7rem) clamp(1.5rem, 4vw, 3rem) 3rem' }}>
            {location.county && (
              <p style={{ fontSize: '0.65rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--orange)', marginBottom: '1rem' }}>
                {location.county}
              </p>
            )}
            <h1 style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 800,
              fontSize: 'clamp(2.5rem, 6vw, 5rem)',
              lineHeight: 1.05,
              color: '#fff',
            }}>
              Web Design {location.town}<span style={{ color: 'var(--orange)' }}>.</span>
            </h1>
            {location.intro && (
              <p style={{ marginTop: '1.5rem', fontSize: '1.1rem', color: 'var(--muted)', maxWidth: '600px', lineHeight: 1.7 }}>
                {location.intro}
              </p>
            )}
          </div>
        )}
      </section>

      {/* Body content */}
      {location.body && (
        <section className="section" style={{ background: 'var(--bg)' }}>
          <div style={{ maxWidth: '720px', lineHeight: 1.9, color: 'rgba(255,255,255,0.8)', fontSize: '1.05rem' }}
            dangerouslySetInnerHTML={{ __html: typeof location.body === 'string' ? location.body : '' }}
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
                transition: 'background 0.2s',
              }}>
                {service}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Our Work */}
      {workItems.length > 0 && (
        <WorkGrid items={workItems} showTitle />
      )}

      {/* Contact */}
      <Contact phone={settings?.phone} email={settings?.email} />
    </>
  )
}
