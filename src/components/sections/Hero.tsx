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
          <span className="hero-line1">We do</span>
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
    </section>
  )
}
