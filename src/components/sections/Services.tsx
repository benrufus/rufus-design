'use client'
import { useReveal } from '@/lib/useReveal'

const DEFAULT_SERVICES = [
  { id: '1', name: 'Web Design', description: 'Bespoke websites built to convert. Fast, accessible, and optimised for search from day one.', order_index: 1 },
  { id: '2', name: 'SEO', description: 'Data-driven search engine optimisation that builds lasting organic visibility.', order_index: 2 },
  { id: '3', name: 'PPC', description: 'Google Ads campaigns that deliver measurable ROI. No wasted spend.', order_index: 3 },
  { id: '4', name: 'Managed Hosting', description: 'Fast, secure, UK-based hosting with proactive monitoring and updates.', order_index: 4 },
  { id: '5', name: 'Branding', description: 'Logo and brand identity design that communicates what makes you different.', order_index: 5 },
  { id: '6', name: 'Analytics', description: "Clear reporting dashboards so you always know what's working.", order_index: 6 },
]

interface Service { id: string; name: string; description?: string; order_index: number }
interface ServicesProps { services?: Service[] }

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
            <p className="service-num">{String(i + 1).padStart(2, '0')}</p>
            <h3 className="service-name">{s.name}</h3>
            {s.description && <p className="service-desc">{s.description}</p>}
          </div>
        ))}
      </div>
    </section>
  )
}
