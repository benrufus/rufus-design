'use client'
import { useReveal } from '@/lib/useReveal'

interface Service { id: string; number: string; title: string; description: string; sort_order: number; active: boolean }
interface ServicesProps { services?: Service[] }

const DEFAULT_SERVICES: Service[] = [
  { id: '1', number: '01', title: 'Web Design', description: 'Bespoke websites built to convert. Fast, accessible, and optimised for search from day one.', sort_order: 1, active: true },
  { id: '2', number: '02', title: 'SEO', description: 'Data-driven search engine optimisation that builds lasting organic visibility.', sort_order: 2, active: true },
  { id: '3', number: '03', title: 'PPC', description: 'Google Ads campaigns that deliver measurable ROI. No wasted spend.', sort_order: 3, active: true },
  { id: '4', number: '04', title: 'Managed Hosting', description: 'Fast, secure, UK-based hosting with proactive monitoring and updates.', sort_order: 4, active: true },
]

export default function Services({ services = DEFAULT_SERVICES }: ServicesProps) {
  const { ref, visible } = useReveal()

  return (
    <section className="section" ref={ref as React.RefObject<HTMLElement>} style={{ background: 'var(--bg2)' }}>
      <div className={`reveal${visible ? ' visible' : ''}`} style={{ marginBottom: '3rem' }}>
        <p className="section-label">What we do</p>
        <h2 className="section-title">Our services<span className="dot">.</span></h2>
      </div>
      <div className="services-grid">
        {services.map((s, i) => (
          <div key={s.id} className={`service-card reveal reveal-delay-${Math.min(i + 1, 5)}${visible ? ' visible' : ''}`}>
            <p className="service-num">{s.number}</p>
            <h3 className="service-name">{s.title}</h3>
            {s.description && <p className="service-desc">{s.description}</p>}
          </div>
        ))}
      </div>
    </section>
  )
}
