'use client'
import { useState } from 'react'
import { useReveal } from '@/lib/useReveal'

interface Testimonial {
  id: string; quote: string; author: string; role?: string; company?: string; stars?: number
}

const DEFAULT_TESTIMONIALS: Testimonial[] = [
  { id: '1', quote: 'Rufus Design transformed our online presence. The new website has increased enquiries significantly and our clients love the design.', author: 'Sarah Johnson', role: 'Director', company: 'Berkhamsted Interiors', stars: 5 },
  { id: '2', quote: 'Professional, responsive and knowledgeable. Ben and the team understand both the technical and marketing side of things.', author: 'Mark Williams', role: 'MD', company: 'Williams Solicitors', stars: 5 },
  { id: '3', quote: 'We\'ve worked with Rufus Design for over 8 years. They look after everything — hosting, updates, SEO. Couldn\'t be happier.', author: 'Claire Davies', role: 'Owner', company: 'Tring Garden Centre', stars: 5 },
]

interface TestimonialsProps { items?: Testimonial[] }

export default function Testimonials({ items = DEFAULT_TESTIMONIALS }: TestimonialsProps) {
  const [current, setCurrent] = useState(0)
  const { ref, visible } = useReveal()

  if (!items.length) return null

  return (
    <section className="section" ref={ref as React.RefObject<HTMLElement>}>
      <div className={`reveal${visible ? ' visible' : ''}`} style={{ marginBottom: '3rem' }}>
        <p className="section-label">What clients say</p>
        <h2 className="section-title">Testimonials<span className="dot">.</span></h2>
      </div>
      <div className={`reveal reveal-delay-2${visible ? ' visible' : ''}`}>
        <div className="testimonial-card" style={{ maxWidth: '800px' }}>
          <div className="testimonial-stars">{'★'.repeat(items[current].stars || 5)}</div>
          <p className="testimonial-quote">"{items[current].quote}"</p>
          <p className="testimonial-author">{items[current].author}</p>
          {(items[current].role || items[current].company) && (
            <p className="testimonial-role">
              {[items[current].role, items[current].company].filter(Boolean).join(', ')}
            </p>
          )}
        </div>
        {items.length > 1 && (
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem' }}>
            {items.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)} style={{ width: i === current ? '2rem' : '0.5rem', height: '0.5rem', background: i === current ? 'var(--orange)' : 'rgba(255,255,255,0.2)', border: 'none', transition: 'all 0.3s', borderRadius: '2px' }} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
