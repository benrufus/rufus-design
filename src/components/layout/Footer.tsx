'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useCookieConsent } from '@/components/ui/CookieConsent'

interface Settings {
  phone?: string
  email?: string
  address?: string
  facebook_url?: string
  instagram_url?: string
  linkedin_url?: string
}

const FacebookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
)

const InstagramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <circle cx="12" cy="12" r="4"/>
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
  </svg>
)

const LinkedInIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect x="2" y="9" width="4" height="12"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
)

const WhatsAppIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.117.554 4.103 1.523 5.83L.057 23.86l6.198-1.438A11.934 11.934 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 0 1-5.006-1.371l-.36-.214-3.68.853.88-3.574-.234-.373A9.818 9.818 0 1 1 12 21.818z"/>
  </svg>
)

const MONITORS = [
  { id: 41, name: 'Rufus THOR', location: 'Berkhamsted / AI' },
  { id: 42, name: 'Rufus IRONMAN', location: 'Worcester / Legacy' },
  { id: 43, name: 'Rufus HAWKEYE', location: 'Amsterdam / Analytics' },
  { id: 44, name: 'Rufus BLACKWIDOW', location: 'Heathrow / Hosting' },
  { id: 45, name: 'Rufus HULK', location: 'Heathrow / Hosting' },
]

export default function Footer() {
  const [settings, setSettings] = useState<Settings>({})
  const { openPreferences } = useCookieConsent()

  useEffect(() => {
    createClient().from('site_settings').select('phone,email,address,facebook_url,instagram_url,linkedin_url')
      .single().then(({ data }) => { if (data) setSettings(data) })
  }, [])

  const email = settings.email || 'hello@rufusdesign.co.uk'
  const phone = settings.phone || ''
  const address = settings.address || ''

  const socials = [
    settings.facebook_url && { label: 'Facebook', href: settings.facebook_url, Icon: FacebookIcon },
    settings.instagram_url && { label: 'Instagram', href: settings.instagram_url, Icon: InstagramIcon },
    settings.linkedin_url && { label: 'LinkedIn', href: settings.linkedin_url, Icon: LinkedInIcon },
    { label: 'WhatsApp', href: 'https://api.whatsapp.com/send?phone=441442967775&text=Help%20Please', Icon: WhatsAppIcon },
  ].filter(Boolean) as { label: string; href: string; Icon: () => React.ReactElement }[]

  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <Link href="/" className="footer-logo">Rufus<span>.</span></Link>
          <p className="footer-tagline">Web design, Web development &amp; digital marketing. Berkhamsted, Hertfordshire. Est. 2007.</p>
          <p className="footer-tagline">We operate in Berkhamsted, Hemel Hempstead, Tring, Aylesbury, Chesham, St Albans, Watford, Hertfordshire, Buckinghamshire, London</p>
          {socials.length > 0 && (
            <div className="footer-socials">
              {socials.map(({ label, href, Icon }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                  aria-label={label} className="footer-social-icon">
                  <Icon />
                </a>
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="footer-col-title">Services</p>
          <ul className="footer-links">
            <li><Link href="/services/web-design">Web Design</Link></li>
            <li><Link href="/services/web-development">Web Development</Link></li>
            <li><Link href="/services/seo-and-ppc">SEO & PPC</Link></li>
            <li><Link href="/services/managed-hosting">Managed Hosting</Link></li>
            <li><Link href="/services/graphic-design">Graphic Design</Link></li>
            <li><Link href="/services">All Services</Link></li>
          </ul>
        </div>

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

        <div>
          <p className="footer-col-title">Contact</p>
          <ul className="footer-links">
            <li><a href={`mailto:${email}`} className="footer-link-muted">{email}</a></li>
            {phone && <li><a href={`tel:${phone}`} className="footer-link-muted">{phone}</a></li>}
            {address && (
              <li>
                <address className="footer-address" style={{ fontStyle: 'normal' }}>
                  {address.split(',').map((part, i) => (
                    <span key={i}>{part.trim()}</span>
                  ))}
                </address>
              </li>
            )}
          </ul>
        </div>

        <div className="menu-dog">
          <img src="/RufusDoggo.png" alt="Rufus" style={{ width: '150px', height: '150px', objectFit: 'contain' }} />
        </div>
      </div>

      {/* Status section */}
      <div className="footer-status">
        <p className="footer-col-title" style={{ marginBottom: '1.25rem' }}>Current super-hero operational status</p>
        <div className="footer-status-grid">
          {MONITORS.map((monitor, i) => (
            <div key={i} className="footer-status-item">
              <p className="footer-status-name">{monitor.name}</p>
              <img
                src={`https://monitor.rufusdesign.co.uk/api/badge/${monitor.id}/uptime`}
                alt={`${monitor.name} uptime`}
                className="footer-status-badge"
                width="138"
                height="20"
              />
              <p className="footer-status-location">{monitor.location}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Rufus Design Limited. All rights reserved.</p>
        <div className="footer-legal">
          <Link href="/privacy" className="footer-link-muted">Privacy Policy</Link>
          <Link href="/terms" className="footer-link-muted">Terms &amp; Conditions</Link>
          <button
            onClick={openPreferences}
            className="footer-link-muted"
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              font: 'inherit',
              fontSize: 'inherit',
            }}
          >
            Cookie preferences
          </button>
        </div>
      </div>
    </footer>
  )
}
