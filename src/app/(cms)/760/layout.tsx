'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ToastProvider } from '@/components/ui/Toast'

const NAV = [
  { section: 'PAGES', items: [
    { href: '/760/pages', label: 'Pages & SEO', icon: '📄' },
    { href: '/760/home', label: 'Home Page', icon: '🏠' },
    { href: '/760/about', label: 'About Page', icon: '👋' },
  ]},
  { section: 'CONTENT', items: [
    { href: '/760/work', label: 'Work / Projects', icon: '🗂️' },
    { href: '/760/news', label: 'News / Blog', icon: '📰' },
    { href: '/760/testimonials', label: 'Testimonials', icon: '⭐' },
    { href: '/760/locations', label: 'Where We Operate', icon: '📍' },
  ]},
  { section: 'SETTINGS', items: [
    { href: '/760/contact', label: 'Contact Form', icon: '📬' },
    { href: '/760/settings', label: 'Site Settings', icon: '⚙️' },
    { href: '/760/seo', label: 'SEO & Analytics', icon: '🔍' },
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
    <aside className="cms-sidebar">
      <div className="cms-sidebar-logo">
        <div className="cms-sidebar-logo-text">Rufus<span>.</span></div>
        <div className="cms-sidebar-sub">Content Manager</div>
      </div>
      <nav className="cms-nav">
        {NAV.map(group => (
          <div key={group.section}>
            <div className="cms-nav-section">{group.section}</div>
            {group.items.map(item => (
              <Link key={item.href} href={item.href} className={pathname === item.href || pathname.startsWith(item.href + '/') ? 'active' : ''}>
                <span className="icon">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </div>
        ))}
      </nav>
      <div className="cms-sidebar-footer">
        <Link href="/" target="_blank">↗ View live site</Link>
        <button onClick={signOut}>Sign out</button>
      </div>
    </aside>
  )
}

export default function CmsLayout({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <div className="cms-wrap">
        <Sidebar />
        <main className="cms-main">{children}</main>
      </div>
    </ToastProvider>
  )
}
