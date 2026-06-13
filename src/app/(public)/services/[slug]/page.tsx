import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import WorkGrid from '@/components/sections/WorkGrid'
import Contact from '@/components/sections/Contact'
import Breadcrumb from '@/components/ui/Breadcrumb'
import PageHero from '@/components/ui/PageHero'
import { getServicesPageBySlug, getWork, getSiteSettings } from '@/lib/db'

export const revalidate = 0
interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const service = await getServicesPageBySlug(slug).catch(() => null)
  if (!service) return {}
  return {
    title: service.meta_title || `${service.title}`,
    description: service.meta_description || service.excerpt,
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
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.rufusdesign.co.uk'

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: s.title,
    description: s.excerpt || s.intro || '',
    provider: { '@type': 'Organization', name: 'Rufus Design', url: siteUrl },
    url: `${siteUrl}/services/${slug}`,
    image: s.hero_image || '',
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Breadcrumb crumbs={[{ label: 'Home', href: '/' }, { label: 'Services', href: '/services' }, { label: s.title }]} />

      {s.hero_image ? (
        <section className="cover-hero">
          <div className="cover-image-wrap cover-image-wrap--news">
            <img src={s.hero_image} alt={s.title} className="cover-image cover-image--news" />
            <div className="cover-overlay" />
            <div className="cover-gradient" />
            <div className="cover-content">
              <p className="section-eyebrow">Our services</p>
              <h1 className="cover-title">{s.title}<span className="text-orange">.</span></h1>
              {s.intro && <p className="cover-excerpt">{s.intro}</p>}
            </div>
          </div>
        </section>
      ) : (
        <PageHero label="Our services" title={s.title} intro={s.intro} />
      )}

      {s.body && (
        <section className="section article-body">
          <div dangerouslySetInnerHTML={{ __html: s.body }} />
        </section>
      )}

      <section className="section" style={{ background: 'var(--bg2)', paddingTop: '3rem', paddingBottom: '3rem' }}>
        <p className="section-label">Ready to get started?</p>
        <p>Whether you need a new website, help improving your Google / AI rankings, better hosting or support with digital marketing, we'd love to hear about your project. Complete the form below and we'll be in touch as soon as possible.</p>
        <h2 className="section-title" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', marginBottom: '2rem' }}>{s.title} for your business<span className="dot">.</span></h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link href="/about" className="btn-primary">About Rufus</Link>
          <Link href="/services" className="btn-secondary">All services</Link>
        </div>
      </section>

      {workItems.length > 0 && <WorkGrid items={workItems} showTitle />}
      <Contact phone={settings?.phone} email={settings?.email} />
    </>
  )
}
