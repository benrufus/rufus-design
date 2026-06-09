import Link from 'next/link'

export default function NotFound() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontSize: '0.65rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--orange)', marginBottom: '1rem' }}>404</p>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'clamp(3rem, 8vw, 6rem)', lineHeight: 1, color: '#fff', marginBottom: '1.5rem' }}>
          Page not found<span style={{ color: 'var(--orange)' }}>.</span>
        </h1>
        <p style={{ color: 'var(--muted)', marginBottom: '2.5rem', fontSize: '1.1rem' }}>The page you're looking for doesn't exist.</p>
        <Link href="/" className="btn-primary">Back to home</Link>
      </div>
    </div>
  )
}
