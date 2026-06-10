'use client'
import { useReveal } from '@/lib/useReveal'
import { useParallax } from '@/lib/useParallax'
import AnimatedHeading from '@/components/ui/AnimatedHeading'

interface Stat { value: string; label: string }
interface AboutProps { heading?: string; body?: string; stats?: Stat[]; quote?: string }

const DEFAULT_STATS: Stat[] = [
  { value: '18+', label: 'Years in business' },
  { value: '40+', label: 'Client websites managed' },
  { value: '4.9★', label: 'Google rating' },
  { value: '<20ms', label: 'Hosting response times' },
]

export default function About({ heading, body, stats, quote }: AboutProps) {
  const sectionRef = useReveal()
  const bgRef = useParallax(0.14)
  const displayStats = stats?.length ? stats : DEFAULT_STATS

  return (
    <section ref={sectionRef as React.RefObject<HTMLElement>} className="about-section reveal">
      <div ref={bgRef} className="about-bg-glow" />
      <div className="about-left">
        <p className="section-eyebrow">About Rufus</p>
        <AnimatedHeading className="about-heading">
          {heading || <>Helping businesses grow <span className="text-orange">since 2007.</span></>}
        </AnimatedHeading>
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
        <blockquote className="about-quote">
          &ldquo;{quote || 'Everything we do is focused on clarity, performance and long-term results.'}&rdquo;
        </blockquote>
      </div>
    </section>
  )
}
