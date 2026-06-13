'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const DEFAULT_WORDS = ['Web Design', 'SEO', 'PPC', 'Branding', 'Hosting', 'Analytics']

interface HeroProps {
  words?: string[]
  intro?: string
}

export default function Hero({ words = DEFAULT_WORDS, intro }: HeroProps) {
  const [idx, setIdx] = useState(0)
  const [animating, setAnimating] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setAnimating(true)
      setTimeout(() => {
        setIdx(i => (i + 1) % words.length)
        setAnimating(false)
      }, 400)
    }, 2200)
    return () => clearInterval(timer)
  }, [words.length])

  return (
    <section className="hero">
      <div style={{ maxWidth: '900px' }}>
        <p className="hero-eyebrow">Berkhamsted · Hertfordshire · Est. 2007</p>
        <h1>
          <span className="hero-line1">We do&nbsp;</span>
          <span className="hero-line2">
            <span
              className="hero-word"
              style={{
                transform: animating ? 'translateY(-110%)' : 'translateY(0)',
                opacity: animating ? 0 : 1,
              }}
            >
              {words[idx]}<span style={{ color: '#fff' }}>.</span>
            </span>
          </span>
        </h1>
        <p className="hero-body">
          {intro || 'Based in Berkhamsted, we design and build fast, reliable websites supported by SEO, PPC, managed hosting, and data analytics.'}
        </p>
        <div className="hero-buttons">
          <Link href="/contact" className="btn-primary">Let&apos;s talk</Link>
          <Link href="/work" className="btn-secondary">Our work</Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{
        position: 'absolute',
        bottom: '2.5rem',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.5rem',
      }}>
        <span style={{
          fontSize: '0.6rem',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.3)',
        }}>Scroll</span>
        <div style={{
          width: '1px',
          height: '60px',
          background: 'linear-gradient(to bottom, rgba(255,128,0,0.8), transparent)',
          animation: 'scrollPulse 1.8s ease-in-out infinite',
        }} />
      </div>
    </section>
  )
}
