'use client'
import { useState } from 'react'
import { useReveal } from '@/lib/useReveal'

interface Testimonial {
  id: string
  name: string
  role?: string
  company?: string
  quote: string
  rating?: number
}

interface TestimonialsProps { items?: Testimonial[] }

const DEFAULT: Testimonial[] = [
  { id: '1', name: 'Sarah C.', role: 'Director', company: 'CHSO Events', quote: 'Rufus Design transformed our online presence completely. The new site loads incredibly fast, looks stunning, and has genuinely driven more enquiries through the door.', rating: 5 },
  { id: '2', name: 'James M.', role: 'Owner', company: 'The Lab Gym', quote: 'Ben and the team are brilliant — they actually understand your business, not just the tech. Our Google ranking went from page three to page one within four months.', rating: 5 },
]

export default function Testimonials({ items }: TestimonialsProps) {
  const [current, setCurrent] = useState(0)
  const { ref, visible } = useReveal()
  const list = items?.length ? items : DEFAULT

  const t = list[current]

  return (
    <section className="section" ref={ref as React.RefObject<HTMLElement>} style={{ background: 'var(--bg)' }}>
      <div className={`reveal${visible ? ' visible' : ''}`} style={{ marginBottom: '3rem' }}>
        <p className="section-label">What clients say</p>
        <h2 className="section-title">Testimonials<span className="dot">.</span></h2>
      </div>
      <div className={`reveal reveal-delay-2${visible ? ' visible' : ''}`}>
        <div className="testimonial-card" style={{ maxWidth: '800px' }}>
          <div className="testimonial-stars">{'★'.repeat(t.rating || 5)}</div>
          <p className="testimonial-quote">"{t.quote}"</p>
          <p className="testimonial-author">{t.name}</p>
          {(t.role || t.company) && (
            <p className="testimonial-role">{[t.role, t.company].filter(Boolean).join(', ')}</p>
          )}
        </div>
        {list.length > 1 && (
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem' }}>
            {list.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                style={{
                  width: i === current ? '2rem' : '0.5rem',
                  height: '0.5rem',
                  background: i === current ? 'var(--orange)' : 'rgba(255,255,255,0.2)',
                  border: 'none',
                  transition: 'all 0.3s',
                  borderRadius: '2px',
                }}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
