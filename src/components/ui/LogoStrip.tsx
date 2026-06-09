'use client'

interface LogoItem {
  id: string
  company_name: string
  logo_url?: string
  link_url?: string
  sort_order: number
}

interface Strip {
  id: string
  name: string
  label?: string
  speed?: number
  logo_strip_items: LogoItem[]
}

export default function LogoStrip({ strip }: { strip: Strip }) {
  const items = strip.logo_strip_items || []
  if (!items.length) return null

  const doubled = [...items, ...items]
  const speed = strip.speed || 30

  return (
    <section style={{
      padding: 'clamp(2rem, 4vw, 3rem) 0',
      background: 'var(--bg2)',
      borderTop: '1px solid var(--border)',
      borderBottom: '1px solid var(--border)',
      overflow: 'hidden',
    }}>
      {strip.label && (
        <p style={{
          textAlign: 'center',
          fontSize: '0.65rem',
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          color: 'var(--muted)',
          marginBottom: '1.5rem',
        }}>{strip.label}</p>
      )}
      <div style={{ overflow: 'hidden' }}>
        <div style={{
          display: 'flex',
          gap: '3rem',
          alignItems: 'center',
          animation: `logoScroll ${speed}s linear infinite`,
          width: 'max-content',
        }}>
          {doubled.map((item, i) => (
            <div key={`${item.id}-${i}`} style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              opacity: 0.5,
              transition: 'opacity 0.2s',
            }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '0.5')}
            >
              {item.logo_url ? (
                <img
                  src={item.logo_url}
                  alt={item.company_name}
                  style={{ height: '32px', width: 'auto', filter: 'brightness(0) invert(1)' }}
                />
              ) : (
                <span style={{
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 800,
                  fontSize: '1rem',
                  color: 'rgba(255,255,255,0.6)',
                  whiteSpace: 'nowrap',
                  letterSpacing: '0.05em',
                }}>
                  {item.company_name}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
      <style>{`
        @keyframes logoScroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  )
}
