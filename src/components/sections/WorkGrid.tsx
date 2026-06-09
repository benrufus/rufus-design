'use client'
import Link from 'next/link'
import { useReveal } from '@/lib/useReveal'

interface WorkItem {
  id: string; title: string; client?: string; slug: string
  cover_image?: string; tags?: string[]; featured?: boolean
}

interface WorkGridProps {
  items: WorkItem[]
  showTitle?: boolean
}

export default function WorkGrid({ items, showTitle = false }: WorkGridProps) {
  const { ref, visible } = useReveal()

  if (!items.length) return null

  return (
    <section className="section" ref={ref as React.RefObject<HTMLElement>}>
      {showTitle && (
        <div className={`reveal${visible ? ' visible' : ''}`} style={{ marginBottom: '3rem' }}>
          <p className="section-label">Selected projects</p>
          <h2 className="section-title">Our work<span className="dot">.</span></h2>
        </div>
      )}
      <div className="work-grid">
        {items.map((item, i) => (
          <Link
            key={item.id}
            href={`/work/${item.slug}`}
            className={`work-card reveal reveal-delay-${Math.min(i + 1, 5)}${visible ? ' visible' : ''}`}
            style={{ textDecoration: 'none', display: 'block' }}
          >
            <div className="work-card-img">
              {item.cover_image ? (
                <img src={item.cover_image} alt={item.title} />
              ) : (
                <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #1a1a1a 0%, #222 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '200px' }}>
                  <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '4rem', color: 'rgba(255,128,0,0.1)' }}>R.</span>
                </div>
              )}
            </div>
            <div className="work-card-info">
              {item.tags?.length && (
                <div className="work-card-tags">
                  {item.tags.slice(0, 3).map(t => <span key={t} className="work-card-tag">{t}</span>)}
                </div>
              )}
              <h3>{item.title}</h3>
              {item.client && <p className="work-card-client">{item.client}</p>}
            </div>
            <div className="work-card-overlay"><span>View project →</span></div>
          </Link>
        ))}
      </div>
    </section>
  )
}
