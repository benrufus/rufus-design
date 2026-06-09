'use client'
import Link from 'next/link'

const QUICK_LINKS = [
  { href: '/760/home', icon: '🏠', label: 'Edit Home Page', desc: 'Hero text, services, about section' },
  { href: '/760/work', icon: '💼', label: 'Add / Edit Projects', desc: 'Case studies and portfolio' },
  { href: '/760/news', icon: '📰', label: 'Write a News Post', desc: 'Blog articles and updates' },
  { href: '/760/testimonials', icon: '⭐', label: 'Edit Testimonials', desc: 'Client reviews and quotes' },
  { href: '/760/about', icon: '👋', label: 'Edit About Page', desc: 'Team, values, company info' },
  { href: '/760/settings', icon: '⚙️', label: 'Site Settings', desc: 'Phone, email, social links' },
]

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

export default function DashboardPage() {
  return (
    <div style={{ padding: '2.5rem' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
          {getGreeting()}<span style={{ color: '#ff8000' }}>.</span>
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.9rem' }}>
          What would you like to update today?
        </p>
      </div>

 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
        {QUICK_LINKS.map(link => (
          <Link key={link.href} href={link.href} style={{ textDecoration: 'none' }}>
            <div className="card" style={{ transition: 'border-color 0.2s, transform 0.2s', cursor: 'pointer' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#ff8000'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)' }}>
              <div style={{ fontSize: '1.75rem', marginBottom: '0.75rem' }}>{link.icon}</div>
              <h3 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.25rem' }}>{link.label}</h3>
              <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>{link.desc}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="card" style={{ marginTop: '2rem', background: 'rgba(255,128,0,0.08)', borderColor: 'rgba(255,128,0,0.2)' }}>
        <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
          <strong style={{ color: '#ff8000' }}>💡 Tip:</strong> Changes save to your database instantly. Your live site updates within 60 seconds automatically.
        </p>
      </div>
    </div>
  )
}