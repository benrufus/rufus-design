'use client'
import { useReveal } from '@/lib/useReveal'

interface PageHeroProps {
  label?: string
  title: string
  intro?: string
}

export default function PageHero({ label, title, intro }: PageHeroProps) {
  const { ref, visible } = useReveal(0.1)

  return (
    <section className="page-hero" ref={ref as React.RefObject<HTMLElement>}>
      <div className={`reveal${visible ? ' visible' : ''}`}>
        {label && <p className="page-hero-label">{label}</p>}
        <h1>
          {title.replace(/\.$/, '')}<span className="dot">.</span>
        </h1>
        {intro && <p className="page-hero-intro">{intro}</p>}
      </div>
    </section>
  )
}
