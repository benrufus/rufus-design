'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

const SERVICE_WORDS = ['Web Design', 'Development', 'SEO & PPC', 'Branding', 'IT Support']

interface Props {
  town: string
  intro?: string
}

export default function LocationHero({ town, intro }: Props) {
  const words = [town, ...SERVICE_WORDS]
  const [current, setCurrent] = useState(0)
  const [exiting, setExiting] = useState(false)

  useEffect(() => {
    const t = setInterval(() => {
      setExiting(true)
      setTimeout(() => {
        setCurrent(c => (c + 1) % words.length)
        setExiting(false)
      }, 380)
    }, 2800)
    return () => clearInterval(t)
  }, [words.length])

  return (
    <section className="hero">
      <div style={{ maxWidth: '1100px', width: '100%' }}>
        <p className="hero-eyebrow">Berkhamsted, Hertfordshire · Est. 2007</p>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'clamp(3rem, 9vw, 9rem)', lineHeight: 0.95, letterSpacing: '-0.03em', maxWidth: '1100px' }}>
          <span style={{ display: 'block', height: '1.05em', overflow: 'hidden', position: 'relative' }}>
            <span style={{
              position: 'absolute', top: 0, left: 0, display: 'block',
              color: 'var(--orange)', whiteSpace: 'nowrap',
              transform: exiting ? 'translateY(-110%)' : 'translateY(0)',
              opacity: exiting ? 0 : 1,
              transition: 'transform 0.42s cubic-bezier(0.76,0,0.24,1), opacity 0.3s',
            }}>{words[current]}</span>
          </span>
          <span style={{ display: 'block', color: 'rgba(255,255,255,0.35)', fontWeight: 300, fontStyle: 'italic' }}>in</span>
          <span style={{ display: 'block' }}>{town}.</span>
        </h1>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: '2.5rem', gap: '2rem', flexWrap: 'wrap' }}>
          <p style={{ maxWidth: '420px', color: 'rgba(255,255,255,0.5)', fontSize: '1rem', lineHeight: 1.75, fontWeight: 300 }}>
            {intro || `Professional web design and digital marketing services in ${town}, Hertfordshire.`}
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexShrink: 0 }}>
            <Link href="/contact" className="btn-primary">Let&apos;s talk</Link>
            <Link href="/work" className="btn-secondary">Our work</Link>
          </div>
        </div>
      </div>
    </section>
  )
}
