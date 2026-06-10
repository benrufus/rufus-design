'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ToastProvider } from '@/components/ui/Toast'

const NAV = [
  { section: 'PAGES', items: [
    { href: '/760/home', label: 'Home Page', icon: '🏠' },
    { href: '/760/about', label: 'About Page', icon: '👋' },
    { href: '/760/pages', label: 'Pages & SEO', icon: '📄' },
  ]},
  { section: 'CONTENT', items: [
    { href: '/760/work', label: 'Work / Projects', icon: '💼' },
    { href: '/760/news', label: 'News / Blog', icon: '📰' },
    { href: '/760/testimonials', label: 'Testimonials', icon: '⭐' },
    { href: '/760/locations', label: 'Where We Operate', icon: '📍' },
  ]},
  { section: 'SETTINGS', items: [
    { href: '/760/contact', label: 'Contact Form', icon: '📬' },
    { href: '/760/settings', label: 'Site Settings', icon: '⚙️' },
    { href: '/760/seo', label: 'SEO & Analytics', icon: '🔍' },
    { href: '/760/redirects', label: 'Redirects', icon: '🔀' },
  ]},
]

function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  async function signOut() {
    await supabase.auth.signOut()
    router.push('/760/login')
  }

  return (
    <aside style={{
      width: '220px', minHeight: '100vh', flexShrink: 0,
      background: '#111', borderRight: '1px solid rgba(255,255,255,0.07)',
      display: 'flex', flexDirection: 'column',
      position: 'sticky', top: 0, height: '100vh', overflowY: 'auto',
    }}>
      <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.4rem', color: '#fff' }}>
          Rufus<span style={{ color: '#ff8000' }}>.</span>
        </div>
        <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', marginTop: '0.2rem' }}>Content Manager</div>
      </div>
      <nav style={{ flex: 1, padding: '1.5rem 0' }}>
        {NAV.map(group => (
          <div key={group.section}>
            <div style={{ fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', padding: '0 1.25rem', marginBottom: '0.5rem', marginTop: '1.5rem' }}>{group.section}</div>
            {group.items.map(item => (
              <Link key={item.href} href={item.href} style={{
                display: 'flex', alignItems: 'center', gap: '0.65rem',
                padding: '0.6rem 1.25rem', fontSize: '0.875rem', textDecoration: 'none',
                color: pathname === item.href || pathname.startsWith(item.href + '/') ? '#ff8000' : 'rgba(255,255,255,0.5)',
                background: pathname === item.href || pathname.startsWith(item.href + '/') ? 'rgba(255,128,0,0.1)' : 'transparent',
              }}>
                <span>{item.icon}</span>{item.label}
              </Link>
            ))}
          </div>
        ))}
      </nav>
      <div style={{ padding: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <Link href="/" target="_blank" style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>↗ View live site</Link>
        <button onClick={signOut} style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', background: 'none', border: 'none', textAlign: 'left', padding: 0, cursor: 'pointer' }}>Sign out</button>
      </div>
    </aside>
  )
}

function CmsWrap({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  if (pathname === '/760/login') return <>{children}</>
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0a0a', cursor: 'auto' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '2.5rem', overflowX: 'hidden' }}>{children}</main>
    </div>
  )
}

export const metadata = {
  robots: { index: false, follow: false },
}

export default function CmsLayout({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <CmsWrap>{children}</CmsWrap>
    </ToastProvider>
  )
}
