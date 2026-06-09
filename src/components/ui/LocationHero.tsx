'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import GridCanvas from '@/components/ui/GridCanvas'

const SERVICE_WORDS = ['Web Design', 'Development', 'SEO & PPC', 'Branding', 'IT Support']

interface Props {
  town: string
  intro?: string
}

export default function LocationHero({ town, intro }: Props) {
  const [current, setCurrent] = useState(0)
  const [exiting, setExiting] = useState(false)
  const glowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const t = setInterval(() => {
      setExiting(true)
      setTimeout(() => { setCurrent(c => (c + 1) % SERVICE_WORDS.length); setExiting(false) }, 380)
    }, 2800)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    const onScroll = () => {
      if (glowRef.current) glowRef.current.style.transform = `translateY(${window.scrollY * 0.15}px)`
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      justifyContent: 'flex-end',
      padding: 'clamp(6rem,10vw,9rem) clamp(1.5rem,4vw,3rem) clamp(3rem,5vw,5rem)',
      position: 'relative',
    }}>
      <GridCanvas style={{ zIndex: 0 }} />
      <div ref={glowRef} style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1, willChange: 'transform',
        background: 'radial-gradient(ellipse 65% 55% at 68% 42%, rgba(255,128,0,0.12) 0%, transparent 65%)',
      }} />
      <div style={{ position: 'relative', zIndex: 2 }}>
        <p style={{ fontSize: '0.65rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#ff8000', marginBottom: '1.5rem' }}>
          {town}, Hertfordshire · Est. 2007
        </p>
        <h1 style={{ fontFamily: 'var(--font-raleway)', fontWeight: 800, fontSize: 'clamp(3rem, 9vw, 9rem)', lineHeight: 0.95, letterSpacing: '-0.03em', maxWidth: '1100px' }}>
          <span style={{ display: 'block', height: '1.05em', overflow: 'hidden', position: 'relative' }}>
            <span style={{
              position: 'absolute', top: 0, left: 0, display: 'block',
              color: '#ff8000', whiteSpace: 'nowrap',
              transform: exiting ? 'translateY(-110%)' : 'translateY(0)',
              opacity: exiting ? 0 : 1,
              transition: 'transform 0.42s cubic-bezier(0.76,0,0.24,1), opacity 0.3s',
            }}>{SERVICE_WORDS[current]}</span>
          </span>
          <span style={{ display: 'block' }}>{town}.</span>
        </h1>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: '2.5rem', gap: '2rem', flexWrap: 'wrap' }}>
          <p style={{ maxWidth: '420px', color: 'rgba(255,255,255,0.5)', fontSize: '1rem', lineHeight: 1.75, fontWeight: 300 }}>
            {intro || `Professional web design and digital marketing services in ${town}, Hertfordshire.`}
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexShrink: 0 }}>
            <Link href="/contact" className="btn-primary">Let&apos;s talk</Link>
            <Link href="/work" className="btn-outline">Our work</Link>
          </div>
        </div>
      </div>
      <div className="hero-scroll-indicator" style={{ position: 'absolute', bottom: '3rem', right: '3rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', zIndex: 2 }}>
        <span style={{ fontSize: '0.7rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', writingMode: 'vertical-rl' }}>Scroll</span>
        <div className="scroll-line" />
      </div>
    </section>
  )
}
