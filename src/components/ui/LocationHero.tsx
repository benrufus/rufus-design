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
        <div className="hero-bottom">
          <p className="hero-body">
            {intro || `Professional web design and digital marketing services in ${town}, Hertfordshire.`}
          </p>
          <div className="hero-buttons">
            <Link href="/contact" className="btn-primary">Let&apos;s talk</Link>
            <Link href="/work" className="btn-outline">Our work</Link>
          </div>
        </div>
      </div>
      <div className="hero-scroll-indicator">
        <span className="hero-scroll-label">Scroll</span>
        <div className="scroll-line" />
      </div>
    </section>
  )
}
