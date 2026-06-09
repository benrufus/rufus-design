'use client'
import { useReveal } from '@/lib/useReveal'

interface Stat { id: string; value: string; label: string }

interface AboutProps {
  headline?: string
  body?: string
  quote?: string
  stats?: Stat[]
}

const DEFAULT_STATS: Stat[] = [
  { id: '1', value: '18+', label: 'Years in business' },
  { id: '2', value: '40+', label: 'Client websites managed' },
  { id: '3', value: '4.9★', label: 'Google rating' },
  { id: '4', value: '<20ms', label: 'Hosting response times' },
]

export default function About({ headline, body, quote, stats = DEFAULT_STATS }: AboutProps) {
  const { ref, visible } = useReveal()
  const items = stats?.length ? stats : DEFAULT_STATS

  return (
    <section className="section" ref={ref as React.RefObject<HTMLElement>} style={{ background: 'var(--bg2)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(3rem, 6vw, 6rem)', alignItems: 'start' }}>
        <div>
          <div className={`reveal${visible ? ' visible' : ''}`}>
            <p className="section-label">About us</p>
            <h2 className="section-title">
              {headline || 'Helping businesses grow since 2007'}<span className="dot">.</span>
            </h2>
          </div>
          <div className="stats-grid">
            {items.map((s, i) => (
              <div key={s.id} className={`reveal reveal-delay-${Math.min(i + 1, 4)}${visible ? ' visible' : ''}`}>
                <div className="stat-num">{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className={`reveal reveal-delay-2${visible ? ' visible' : ''}`} style={{ paddingTop: '2rem' }}>
          <p style={{ fontSize: 'clamp(1rem, 1.4vw, 1.2rem)', lineHeight: 1.8, color: 'rgba(255,255,255,0.7)' }}>
            {body || "We're a small, expert team based in Berkhamsted. No account managers, no middlemen. Just experienced people who care about the work."}
          </p>
          {quote && (
            <blockquote style={{
              marginTop: '2rem', padding: '1.5rem',
              borderLeft: '3px solid var(--orange)',
              background: 'rgba(255,128,0,0.05)',
              fontStyle: 'italic',
              color: 'rgba(255,255,255,0.6)',
              fontSize: '1rem',
              lineHeight: 1.7,
            }}>
              {quote}
            </blockquote>
          )}
        </div>
      </div>
    </section>
  )
}
