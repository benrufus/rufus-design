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

  // On homepage show max 6, on work page show all
  const displayItems = showTitle ? items.slice(0, 6) : items

  return (
    <section className="section" ref={ref as React.RefObject<HTMLElement>} style={{ background: 'var(--bg2)' }}>
      {showTitle && (
        <div className={`reveal${visible ? ' visible' : ''}`} style={{ marginBottom: '3rem' }}>
          <p className="section-label">Selected projects</p>
          <h2 className="section-title">Our work<span className="dot">.</span></h2>
        </div>
      )}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
        gap: '1.5rem',
      }}>
        {displayItems.map((item, i) => (
          <Link
            key={item.id}
            href={`/work/${item.slug}`}
            className={`reveal reveal-delay-${Math.min(i + 1, 4)}${visible ? ' visible' : ''}`}
            style={{ textDecoration: 'none', display: 'block' }}
          >
            <article style={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              overflow: 'hidden',
              transition: 'border-color 0.3s, transform 0.3s',
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--orange)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)' }}
            >
              {/* Image */}
              <div style={{ aspectRatio: '16/9', overflow: 'hidden', background: '#1a1a1a' }}>
                {item.cover_image ? (
                  <img
  src={item.cover_image}
  alt={item.title}
  loading={i === 0 ? 'eager' : 'lazy'}
  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
  onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
  onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
/>
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '3rem', color: 'rgba(255,128,0,0.1)' }}>R.</span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div style={{ padding: '1.25rem' }}>
                {(item.tags?.length ?? 0) > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '0.6rem' }}>
                    {(item.tags ?? []).slice(0, 3).map(t => (
                      <span key={t} style={{ fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', background: 'rgba(255,128,0,0.1)', color: 'var(--orange)', padding: '0.2em 0.5em' }}>{t}</span>
                    ))}
                  </div>
                )}
                <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.1rem', color: '#fff', marginBottom: '0.25rem' }}>{item.title}</h3>
                {item.client && <p style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>{item.client}</p>}
              </div>
            </article>
          </Link>
        ))}
      </div>

      {showTitle && items.length > 6 && (
        <div style={{ marginTop: '2.5rem' }}>
          <Link href="/work" className="btn-secondary">View all work</Link>
        </div>
      )}
    </section>
  )
}
