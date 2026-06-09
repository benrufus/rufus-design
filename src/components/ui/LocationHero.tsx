'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

interface LocationHeroProps {
  prefix?: string
  words: string[]
  intro?: string
  cta1?: string
  cta2?: string
  staticWord?: string
}

const FALLBACK_WORDS = ['Berkhamsted', 'Hemel Hempstead', 'St Albans', 'Tring', 'Harpenden']

export default function LocationHero({
  prefix = 'Web design in',
  words,
  intro,
  cta1 = "Let's talk",
  cta2 = 'Our work',
  staticWord,
}: LocationHeroProps) {
  const safeWords = words?.length > 0 ? words : FALLBACK_WORDS
  const [index, setIndex] = useState(0)
  const [animating, setAnimating] = useState(false)

  useEffect(() => {
    if (staticWord || safeWords.length <= 1) return
    const interval = setInterval(() => {
      setAnimating(true)
      setTimeout(() => {
        setIndex(i => (i + 1) % safeWords.length)
        setAnimating(false)
      }, 400)
    }, 2800)
    return () => clearInterval(interval)
  }, [safeWords.length, staticWord])

  const displayWord = staticWord || safeWords[index]

  return (
    <section className="hero">
      <div style={{ maxWidth: '1100px', width: '100%' }}>
        <p className="hero-eyebrow">Rufus Design · Est. 2007</p>
        <h1>
          <span className="hero-line1">{prefix}</span>
          <span className="hero-line2">
            <span
              className="hero-word"
              style={{
                transform: animating ? 'translateY(-100%)' : 'translateY(0)',
                opacity: animating ? 0 : 1,
              }}
            >
              {displayWord}<span style={{ color: '#fff' }}>.</span>
            </span>
          </span>
        </h1>
        {intro && <p className="hero-body">{intro}</p>}
        <div className="hero-buttons">
          <Link href="/contact" className="btn-primary">{cta1}</Link>
          <Link href="/work" className="btn-secondary">{cta2}</Link>
        </div>
      </div>

      {/* Scroll indicator — direct child of section so position:absolute works */}
      <div style={{
        position: 'absolute',
        bottom: '2.5rem',
        left: 'clamp(1.5rem, 4vw, 3rem)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
      }}>
        <div style={{ width: '1px', height: '40px', background: 'rgba(255,255,255,0.2)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'var(--orange)', animation: 'scrollPulse 1.8s ease-in-out infinite' }} />
        </div>
        <span style={{ fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)' }}>Scroll</span>
      </div>
    </section>
  )
}
