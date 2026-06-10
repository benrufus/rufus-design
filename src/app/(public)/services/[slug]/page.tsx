import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import WorkGrid from '@/components/sections/WorkGrid'
import Contact from '@/components/sections/Contact'
import { getServicesPageBySlug, getWork, getSiteSettings } from '@/lib/db'

export const revalidate = 0
interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const service = await getServicesPageBySlug(slug).catch(() => null)
  if (!service) return {}
  return {
    title: service.meta_title || `${service.title} | Rufus Design`,
    description: service.meta_description || service.excerpt || `${service.title} services from Rufus Design, Berkhamsted.`,
    alternates: { canonical: `/services/${slug}` },
  }
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params
  const [service, work, siteSettings] = await Promise.allSettled([
    getServicesPageBySlug(slug), getWork(), getSiteSettings(),
  ]).then(r => r.map(x => x.status === 'fulfilled' ? x.value : null))

  if (!service) notFound()

  const s = service as any
  const workItems = (work as any[]) || []
  const settings = siteSettings as any

  return (
    <>
      {/* Hero */}
      <section style={{ paddingTop: '72px', background: 'var(--bg)', position: 'relative' }}>
        {s.hero_image ? (
          <div style={{ width: '100%', maxHeight: '500px', overflow: 'hidden', position: 'relative' }}>
            <img src={s.hero_image} alt={s.title} style={{ width: '100%', maxHeight: '500px', objectFit: 'cover', display: 'block' }} />
            <div className="cover-overlay" />
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 'clamp(1.5rem, 4vw, 3rem)' }}>
              <p className="section-label">Our services</p>
              <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'clamp(2.5rem, 6vw, 5rem)', lineHeight: 1.05, color: '#fff' }}>
                {s.title}<span style={{ color: 'var(--orange)' }}>.</span>
              </h1>
              {s.intro && <p style={{ marginTop: '1rem', fontSize: 'clamp(1rem, 1.4vw, 1.1rem)', color: 'rgba(255,255,255,0.7)', maxWidth: '600px', lineHeight: 1.6 }}>{s.intro}</p>}
            </div>
          </div>
        ) : (
          <div className="page-hero">
            <p className="page-hero-label">Our services</p>
            <h1>{s.title}<span className="dot">.</span></h1>
            {s.intro && <p className="page-hero-intro">{s.intro}</p>}
          </div>
        )}
      </section>

      {/* Body */}
      {s.body && (
        <section className="section" style={{ background: 'var(--bg)' }}>
          <div style={{ maxWidth: '720px', lineHeight: 1.9, color: 'rgba(255,255,255,0.8)', fontSize: '1.05rem' }}
            dangerouslySetInnerHTML={{ __html: s.body }} />
        </section>
      )}

      {/* CTA */}
      <section className="section" style={{ background: 'var(--bg2)', paddingTop: '3rem', paddingBottom: '3rem' }}>
        <p className="section-label">Ready to get started?</p>
        <h2 className="section-title">{s.title} for your business<span className="dot">.</span></h2>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', flexWrap: 'wrap' }}>
          <Link href="/contact" className="btn-primary">Get in touch</Link>
          <Link href="/services" className="btn-secondary">All services</Link>
        </div>
      </section>

      {/* Our work */}
      {workItems.length > 0 && <WorkGrid items={workItems} showTitle />}

      <Contact phone={settings?.phone} email={settings?.email} />
    </>
  )
}
