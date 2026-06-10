'use client'
import { useReveal } from '@/lib/useReveal'

interface Stat { value: string; label: string }
interface AboutProps { heading?: string; body?: string; stats?: Stat[]; quote?: string }

const DEFAULT_STATS: Stat[] = [
  { value: '18+', label: 'Years in business' },
  { value: '40+', label: 'Client websites managed' },
  { value: '4.9★', label: 'Google rating' },
  { value: '<20ms', label: 'Hosting response times' },
]

export default function About({ heading, body, stats, quote }: AboutProps) {
  const { ref, visible } = useReveal()
  const displayStats = stats?.length ? stats : DEFAULT_STATS

  return (
    <section ref={ref as React.RefObject<HTMLElement>} className={`about-section${visible ? ' visible' : ''}`}>
      <div className="about-left">
        <p className="section-eyebrow">About Rufus</p>
        <h2 className="about-heading">
          {heading || <>Helping businesses grow <span className="text-orange">since 2007.</span></>}
        </h2>
        <p className="about-body">
          {body || "We're a small, expert team based in Berkhamsted. No account managers, no middlemen — just direct access to experienced designers and developers who care about results."}
        </p>
        <a href="/contact" className="btn-primary">Start a project</a>
      </div>
      <div className="about-right">
        <div className="about-stats">
          {displayStats.map(s => (
            <div key={s.label} className="about-stat">
              <p className="about-stat-value">{s.value}</p>
              <p className="about-stat-label">{s.label}</p>
            </div>
          ))}
        </div>
        {quote && (
          <blockquote className="about-quote">
            &ldquo;{quote}&rdquo;
          </blockquote>
        )}
      </div>
    </section>
  )
}
