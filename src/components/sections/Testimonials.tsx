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
  { id: '3', name: 'Alex T.', role: 'Founder', company: 'Simon Taylor Furniture', quote: "We've worked with Rufus for years. They feel less like an agency and more like part of the team. Reliable, creative, and they always deliver on time.", rating: 5 },
]

export default function Testimonials({ items }: TestimonialsProps) {
  const [current, setCurrent] = useState(0)
  const { ref, visible } = useReveal()
  const list = items?.length ? items : DEFAULT
  const t = list[current]

  function prev() { setCurrent(i => (i - 1 + list.length) % list.length) }
  function next() { setCurrent(i => (i + 1) % list.length) }

  return (
    <section className="section" ref={ref as React.RefObject<HTMLElement>} style={{ background: 'var(--bg)' }}>
      <div className={`reveal${visible ? ' visible' : ''}`} style={{ marginBottom: '3rem' }}>
        <p className="section-label">What clients say</p>
        <h2 className="section-title">Testimonials<span className="dot">.</span></h2>
      </div>

      <div className={`reveal reveal-delay-2${visible ? ' visible' : ''}`}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '2rem', alignItems: 'start', maxWidth: '900px' }}>

          {/* Quote card */}
          <div className="testimonial-card">
            <div className="testimonial-stars">{'★'.repeat(t.rating || 5)}</div>
            <p className="testimonial-quote">"{t.quote}"</p>
            <p className="testimonial-author">{t.name}</p>
            {(t.role || t.company) && (
              <p className="testimonial-role">{[t.role, t.company].filter(Boolean).join(', ')}</p>
            )}
          </div>

          {/* Navigation */}
          {list.length > 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', paddingTop: '1rem' }}>
              <button
                onClick={prev}
                aria-label="Previous testimonial"
                style={{
                  width: '44px', height: '44px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.1rem',
                  cursor: 'pointer',
                  transition: 'background 0.2s, border-color 0.2s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,128,0,0.15)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--orange)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.12)' }}
              >↑</button>
              <span style={{ fontSize: '0.75rem', color: 'var(--muted)', fontFamily: 'var(--font-heading)', fontWeight: 700, letterSpacing: '0.05em' }}>
                {current + 1}/{list.length}
              </span>
              <button
                onClick={next}
                aria-label="Next testimonial"
                style={{
                  width: '44px', height: '44px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.1rem',
                  cursor: 'pointer',
                  transition: 'background 0.2s, border-color 0.2s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,128,0,0.15)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--orange)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.12)' }}
              >↓</button>
            </div>
          )}
        </div>

        {/* Dot indicators */}
        {list.length > 1 && (
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem' }}>
            {list.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                aria-label={`Go to testimonial ${i + 1}`}
                style={{
                  width: i === current ? '2rem' : '0.5rem',
                  height: '0.5rem',
                  background: i === current ? 'var(--orange)' : 'rgba(255,255,255,0.2)',
                  border: 'none',
                  transition: 'all 0.3s',
                  borderRadius: '2px',
                  cursor: 'pointer',
                }}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
