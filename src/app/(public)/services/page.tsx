import type { Metadata } from 'next'
import Link from 'next/link'
import PageHero from '@/components/ui/PageHero'
import Contact from '@/components/sections/Contact'
import { getServicesPages, getSiteSettings } from '@/lib/db'

export const metadata: Metadata = {
  title: 'Our Services | Rufus Design',
  description: 'Web design, SEO, PPC, managed hosting and digital marketing services from Rufus Design, Berkhamsted.',
  alternates: { canonical: '/services' },
}
export const revalidate = 0

export default async function ServicesPage() {
  const [servicesList, siteSettings] = await Promise.allSettled([
    getServicesPages(), getSiteSettings(),
  ]).then(r => r.map(x => x.status === 'fulfilled' ? x.value : null))

  const services = (servicesList as any[]) || []
  const settings = siteSettings as any

  return (
    <>
      <PageHero
        label="What we do"
        title="Our services"
        intro="From web design and development to SEO, PPC and managed hosting — everything your business needs to grow online."
      />

      {services.length > 0 ? (
        <section className="section" style={{ background: 'var(--bg2)' }}>
          <div className="services-grid">
            {services.map((s: any, i: number) => (
              <Link key={s.id} href={`/services/${s.slug}`} style={{ textDecoration: 'none' }}>
                <div className="service-card">
                  <p className="service-num">0{i + 1}</p>
                  <h2 className="service-name">{s.title}</h2>
                  {s.excerpt && <p className="service-desc">{s.excerpt}</p>}
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
