'use client'
import Link from 'next/link'
import { useReveal } from '@/lib/useReveal'

interface Service {
  id: string
  number: string
  title: string
  description: string
  sort_order: number
  active: boolean
  slug?: string
  image?: string
}

interface ServicesProps { services?: Service[] }

const DEFAULT_SERVICES: Service[] = [
  { id: '1', number: '01', title: 'Web Design & Development', description: 'Bespoke websites built for performance, conversion, and long-term reliability. From concept through to launch.', sort_order: 0, active: true, slug: 'web-design' },
  { id: '2', number: '02', title: 'SEO & PPC', description: 'Results-driven search campaigns — organic rankings and paid advertising that deliver qualified leads.', sort_order: 1, active: true, slug: 'seo-ppc' },
  { id: '3', number: '03', title: 'Managed Hosting', description: 'Fast, secure, UK-based hosting with proactive monitoring. Sub-20ms response times as standard.', sort_order: 2, active: true, slug: 'managed-hosting' },
  { id: '4', number: '04', title: 'Brand & Analytics', description: 'Graphic design, data dashboards, and payment gateway integration — a complete digital ecosystem.', sort_order: 3, active: true, slug: 'brand-analytics' },
]

export default function Services({ services }: ServicesProps) {
  const { ref, visible } = useReveal()
  const items = services?.length ? services : DEFAULT_SERVICES

  return (
    <section className="section" ref={ref as React.RefObject<HTMLElement>} style={{ background: 'var(--bg2)' }}>
      <div className={`reveal${visible ? ' visible' : ''}`} style={{ marginBottom: '3rem' }}>
        <p className="section-label">What we do</p>
        <h2 className="section-title">Our services<span className="dot">.</span></h2>
      </div>
      <div className="services-grid">
        {items.map((s, i) => (
          <Link key={s.id} href={s.slug ? `/services/${s.slug}` : '/services'} style={{ textDecoration: 'none' }}>
            <div className={`service-card reveal reveal-delay-${Math.min(i + 1, 5)}${visible ? ' visible' : ''}`}>
              {s.image && <div className="service-card-bg" style={{ backgroundImage: `url(${s.image})` }} />}
              <p className="service-num">{s.number}</p>
              <h3 className="service-name">{s.title}</h3>
              {s.description && <p className="service-desc">{s.description}</p>}
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
