'use client'
import { useReveal } from '@/lib/useReveal'

interface Stat { id: string; value: string; label: string }
interface AboutProps {
  headline?: string
  body?: string
  stats?: Stat[]
}

const DEFAULT_STATS: Stat[] = [
  { id: '1', value: '17+', label: 'Years in business' },
  { id: '2', value: '200+', label: 'Projects delivered' },
  { id: '3', value: '30+', label: 'Active clients' },
  { id: '4', value: '98%', label: 'Client retention' },
]

export default function About({ headline, body, stats = DEFAULT_STATS }: AboutProps) {
  const { ref, visible } = useReveal()

  return (
    <section className="section" ref={ref as React.RefObject<HTMLElement>} style={{ background: 'var(--bg2)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(3rem, 6vw, 6rem)', alignItems: 'start' }}>
        <div>
          <div className={`reveal${visible ? ' visible' : ''}`}>
            <p className="section-label">About us</p>
            <h2 className="section-title">
              {headline || 'A different kind of agency'}<span className="dot">.</span>
            </h2>
          </div>
          <div className="stats-grid">
            {stats.map((s, i) => (
              <div key={s.id} className={`reveal reveal-delay-${Math.min(i + 1, 4)}${visible ? ' visible' : ''}`}>
                <div className="stat-num">{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className={`reveal reveal-delay-2${visible ? ' visible' : ''}`} style={{ paddingTop: '2rem' }}>
          <p style={{ fontSize: 'clamp(1rem, 1.4vw, 1.2rem)', lineHeight: 1.8, color: 'rgba(255,255,255,0.7)' }}>
            {body || "We've been building websites since 2007 — before WordPress was cool, before mobile-first was a thing, and long before every agency claimed to do 'strategy'. We're a small, focused team. No account managers, no juniors, no bullshit. Just experienced people who care about the work."}
          </p>
          <p style={{ marginTop: '1.5rem', fontSize: '1rem', color: 'var(--muted)', lineHeight: 1.8 }}>
            Based in Berkhamsted, we work with businesses across Hertfordshire, Buckinghamshire, and London.
          </p>
        </div>
      </div>
    </section>
  )
}
