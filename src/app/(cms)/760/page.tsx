'use client'
import Link from 'next/link'

export default function CmsDashboard() {
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  const tiles = [
    { href: '/760/home', icon: '🏠', label: 'Home Page', desc: 'Hero words, services, about text' },
    { href: '/760/work', icon: '🗂️', label: 'Work / Projects', desc: 'Add and manage case studies' },
    { href: '/760/news', icon: '📰', label: 'News / Blog', desc: 'Write and publish posts' },
    { href: '/760/testimonials', icon: '⭐', label: 'Testimonials', desc: 'Manage client reviews' },
    { href: '/760/about', icon: '👋', label: 'About Page', desc: 'Team, values and stats' },
    { href: '/760/locations', icon: '📍', label: 'Where We Operate', desc: 'Location pages' },
    { href: '/760/contact', icon: '📬', label: 'Contact Form', desc: 'Edit form fields' },
    { href: '/760/settings', icon: '⚙️', label: 'Site Settings', desc: 'Phone, email, socials' },
    { href: '/760/seo', icon: '🔍', label: 'SEO & Analytics', desc: 'GA4, GTM, meta tags' },
  ]

  return (
    <>
      <div className="cms-header">
        <h1>{greeting}<span style={{ color: 'var(--orange)' }}>.</span></h1>
        <p>Rufus Design — Content Manager</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
        {tiles.map(t => (
          <Link key={t.href} href={t.href} style={{ display: 'block', textDecoration: 'none' }}>
            <div className="cms-card" style={{ cursor: 'pointer', transition: 'border-color 0.2s', marginBottom: 0 }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(255,128,0,0.4)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)')}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>{t.icon}</div>
              <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, color: '#fff', marginBottom: '0.3rem' }}>{t.label}</div>
              <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.35)' }}>{t.desc}</div>
            </div>
          </Link>
        ))}
      </div>
    </>
  )
}
