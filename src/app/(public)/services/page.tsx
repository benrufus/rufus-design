import type { Metadata } from 'next'
import Link from 'next/link'
import PageHero from '@/components/ui/PageHero'
import Contact from '@/components/sections/Contact'
import Breadcrumb from '@/components/ui/Breadcrumb'
import { getServicesPages, getSiteSettings, getPageSeo } from '@/lib/db'

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo('services').catch(() => null)
  return {
    title: seo?.title || 'Our Services',
    description: seo?.description || 'Web design, SEO, PPC, managed hosting and digital marketing services from Rufus Design, Berkhamsted.',
    alternates: { canonical: '/services' },
  }
}
export const revalidate = 0

export default async function ServicesPage() {
  const [servicesList, siteSettings] = await Promise.allSettled([
    getServicesPages(), getSiteSettings(),
  ]).then(r => r.map(x => x.status === 'fulfilled' ? x.value : null))

  const services = (servicesList as any[]) || []
  const settings = siteSettings as any
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.rufusdesign.co.uk'

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Services | Rufus Design',
    url: `${siteUrl}/services`,
    itemListElement: services.map((s: any, i: number) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: s.title,
      description: s.excerpt || '',
      url: `${siteUrl}/services/${s.slug}`,
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Breadcrumb crumbs={[{ label: 'Home', href: '/' }, { label: 'Services' }]} />
      <PageHero
        label="What we do"
        title="Our services"
        intro="Websites, digital marketing, IT support, payment services and managed hosting. Everything your business needs under one roof, backed by expert advice and reliable support.
"
      />

      {services.length > 0 ? (
        <section className="section" style={{ background: 'var(--bg2)' }}>
          <div className="services-grid">
            {services.map((s: any, i: number) => (
              <Link key={s.id} href={`/services/${s.slug}`} style={{ textDecoration: 'none' }}>
                <div className="service-card ...">
  {s.image && (
    <div className="service-card-bg" style={{ backgroundImage: `url(${s.image})` }} />
  )}
  <p className="service-num">{s.number}</p>
  <h3 className="service-name">{s.title}</h3>
  {s.description && <p className="service-desc">{s.description}</p>}
</div>
              </Link>
            ))}
          </div>
        </section>
      ) : (
        <section className="section" style={{ background: 'var(--bg2)' }}>
          <p style={{ color: 'var(--muted)' }}>No services added yet.</p>
        </section>
      )}

      <Contact phone={settings?.phone} email={settings?.email} />
    </>
  )
}
