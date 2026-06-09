'use client'
import Link from 'next/link'

interface Location {
  id?: string; town: string; county?: string; slug: string
  image_url?: string; intro?: string; services?: string[]
}

export default function LocationCard({ loc }: { loc: Location }) {
  return (
    <Link href={`/where-we-operate/${loc.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
      <article
        style={{ background: 'var(--card)', border: '1px solid var(--border)', overflow: 'hidden', transition: 'border-color 0.3s, transform 0.3s' }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--orange)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)' }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)' }}
      >
        {loc.image_url ? (
          <div style={{ height: '180px', overflow: 'hidden' }}>
            <img src={loc.image_url} alt={loc.town} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')} />
          </div>
        ) : (
          <div style={{ height: '120px', background: 'linear-gradient(135deg, #1a1a1a 0%, #222 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '3rem', color: 'rgba(255,128,0,0.15)' }}>{loc.town.slice(0, 2).toUpperCase()}</span>
          </div>
        )}
        <div style={{ padding: '1.5rem' }}>
          {loc.county && <p style={{ fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--orange)', marginBottom: '0.4rem' }}>{loc.county}</p>}
          <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.3rem', marginBottom: '0.75rem', color: '#fff' }}>{loc.town}</h2>
          {loc.intro && <p style={{ fontSize: '0.82rem', color: 'var(--muted)', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{loc.intro}</p>}
          <p style={{ marginTop: '1.25rem', fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--orange)', fontFamily: 'var(--font-heading)', fontWeight: 700 }}>Learn more →</p>
        </div>
      </article>
    </Link>
  )
}
