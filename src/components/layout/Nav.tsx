'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

const MENU_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/work', label: 'Work' },
  { href: '/news', label: 'News' },
  { href: '/contact', label: 'Contact' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setOpen(false) }, [pathname])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      <header className={`nav${scrolled ? ' scrolled' : ''}`}>

        {/* Logo — left */}
        <Link href="/" className="nav-logo">
          Rufus<span>.</span>
        </Link>

        {/* Right side — Let's talk + MENU */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <button
            className="nav-hamburger"
            onClick={() => setOpen(o => !o)}
            aria-label="Toggle menu"
          >
            {open ? 'CLOSE' : 'MENU'}
          </button>
        </div>

      </header>

      {/* Fullscreen overlay */}
      <div className={`fullscreen-menu${open ? ' open' : ''}`}>
        <nav>
          {MENU_LINKS.map(l => (
            <Link key={l.href} href={l.href}>
              {l.label}<span style={{ color: 'var(--orange)' }}>.</span>
            </Link>
          ))}
        </nav>
        <div className="menu-dog"><img src="/RufusDoggo.png" alt="Rufus" style={{ width: '250px', height: '250px', objectFit: 'cover'}} /></div>
      </div>
    </>
  )
}
