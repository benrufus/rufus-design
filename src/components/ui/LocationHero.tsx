'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import GridCanvas from '@/components/ui/GridCanvas'

const SERVICE_WORDS = ['Web Design', 'Development', 'SEO & PPC', 'Branding', 'IT Support']

interface Props {
  town: string
  intro?: string
  coverImage?: string
  body?: string
}

export default function LocationHero({ town, intro, coverImage, body }: Props) {
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

  if (coverImage) {
    return (
      <section className="cover-hero">
        <div className="cover-image-wrap" style={{ minHeight: '60vh' }}>
          <img src={coverImage} alt={`Web design in ${town}`} className="cover-image" style={{ minHeight: '60vh' }} />
          <div className="cover-overlay" />
          <div className="cover-gradient" />
          <div className="cover-content">
            <p className="section-eyebrow">{town}, Hertfordshire · Est. 2007</p>
            <h1 className="cover-title">
              <span style={{ display: 'block', height: '1.1em', overflow: 'hidden', position: 'relative' }}>
                <span style={{
                  position: 'absolute', top: 0, left: 0,
                  color: 'var(--orange)',
                  transform: exiting ? 'translateY(-110%)' : 'translateY(0)',
                  opacity: exiting ? 0 : 1,
                  transition: 'transform 0.42s cubic-bezier(0.76,0,0.24,1), opacity 0.3s',
                  whiteSpace: 'nowrap',
                }}>
                  {SERVICE_WORDS[current]}
                </span>
              </span>
              {town}<span className="text-orange">.</span>
            </h1>
            {intro && <p className="cover-excerpt">{intro}</p>}
            <div className="hero-buttons" style={{ marginTop: '1.5rem' }}>
              <Link href="/contact" className="btn-primary">Let&apos;s talk</Link>
              <Link href="/about" className="btn-secondary">About Rufus</Link>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="hero">
      <GridCanvas />
      <div ref={glowRef} className="hero-glow" />
      <div className="hero-content">
        <p className="hero-eyebrow">{town}, Hertfordshire · Est. 2007</p>
        <h1 className="hero-heading">
          <span className="hero-cycle">
            <span className={`hero-cycle-word${exiting ? ' exiting' : ''}`}>
              {SERVICE_WORDS[current]}
            </span>
          </span>
          <span className="hero-static">{town}.</span>
        </h1>
        <p className="hero-body">
          {intro || `Professional web design and digital marketing services in ${town}, Hertfordshire.`}
        </p>
        <div className="hero-buttons">
          <Link href="/contact" className="btn-primary">Let&apos;s talk</Link>
          <Link href="/work" className="btn-secondary">Our work</Link>
        </div>
      </div>
      <div className="hero-scroll-indicator">
        <span className="hero-scroll-label">Scroll</span>
        <div className="scroll-line" />
      </div>
    </section>
  )
}
