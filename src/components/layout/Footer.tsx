'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Settings {
  phone?: string
  email?: string
  address?: string
  facebook_url?: string
  instagram_url?: string
  linkedin_url?: string
}

export default function Footer() {
  const [settings, setSettings] = useState<Settings>({})

  useEffect(() => {
    createClient().from('site_settings').select('phone,email,address,facebook_url,instagram_url,linkedin_url')
      .single().then(({ data }) => { if (data) setSettings(data) })
  }, [])

  const email = settings.email || 'hello@rufusdesign.co.uk'
  const phone = settings.phone || ''
  const address = settings.address || ''

  const socials = [
    settings.facebook_url && { label: 'Facebook', href: settings.facebook_url },
    settings.instagram_url && { label: 'Instagram', href: settings.instagram_url },
    settings.linkedin_url && { label: 'LinkedIn', href: settings.linkedin_url },
  ].filter(Boolean) as { label: string; href: string }[]

  return (
    <footer className="footer">
      <div className="footer-grid">
        {/* Brand col */}
        <div>
          <Link href="/" className="footer-logo">Rufus<span>.</span></Link>
          <p className="footer-tagline">Award-winning web design &amp; digital marketing. Berkhamsted, Hertfordshire. Est. 2007.</p>
          {socials.length > 0 && (
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              {socials.map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                  style={{ fontSize: '0.75rem', color: 'var(--muted)', fontFamily: 'var(--font-heading)', fontWeight: 700, letterSpacing: '0.05em', transition: 'color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}
                >
                  {s.label}
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Services col */}
        <div>
          <p className="footer-col-title">Services</p>
          <ul className="footer-links">
            {['Web Design', 'Digital Marketing', 'SEO', 'PPC', 'Hosting'].map(s => (
              <li key={s}><Link href="/contact">{s}</Link></li>
            ))}
          </ul>
        </div>

        {/* Company col */}
        <div>
          <p className="footer-col-title">Company</p>
          <ul className="footer-links">
            <li><Link href="/about">About</Link></li>
            <li><Link href="/work">Our Work</Link></li>
            <li><Link href="/news">News</Link></li>
            <li><Link href="/contact">Contact</Link></li>
            <li><Link href="/where-we-operate">Where We Operate</Link></li>
          </ul>
        </div>

        {/* Contact col */}
        <div>
          <p className="footer-col-title">Contact</p>
          <ul className="footer-links">
            <li>
              <a href={`mailto:${email}`} style={{ color: 'var(--muted)', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}
              >{email}</a>
            </li>
            {phone && (
              <li>
                <a href={`tel:${phone}`} style={{ color: 'var(--muted)', transition: 'color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}
                >{phone}</a>
              </li>
            )}
            {address && (
              <li style={{ color: 'var(--muted)', fontSize: '0.875rem', lineHeight: 1.7, marginTop: '0.25rem' }}>
                {address.split(',').map((part, i) => (
                  <span key={i} style={{ display: 'block', color: 'var(--muted)' }}>{part.trim()}</span>
                ))}
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Rufus Design Limited. All rights reserved.</p>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <Link href="/privacy" style={{ color: 'var(--muted)', fontSize: '0.8rem', transition: 'color 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}
          >Privacy Policy</Link>
          <Link href="/terms" style={{ color: 'var(--muted)', fontSize: '0.8rem', transition: 'color 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}
          >Terms &amp; Conditions</Link>
        </div>
      </div>
    </footer>
  )
}
