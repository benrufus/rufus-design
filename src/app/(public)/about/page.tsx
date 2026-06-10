import type { Metadata } from 'next'
import Link from 'next/link'
import PageHero from '@/components/ui/PageHero'
import Breadcrumb from '@/components/ui/Breadcrumb'
import Testimonials from '@/components/sections/Testimonials'
import Contact from '@/components/sections/Contact'
import LogoStrip from '@/components/ui/LogoStrip'
import {
  getAboutPage, getTeam, getValues, getStats, getTestimonials,
  getLogoStrips, getServices, getPageSections, getSiteSettings
} from '@/lib/db'

export const metadata: Metadata = {
  title: 'About Us | Rufus Design',
  description: 'Rufus Design is a small yet mighty digital agency based in Berkhamsted, Hertfordshire. Since 2007 we have helped businesses of all sizes grow online.',
  alternates: { canonical: '/about' },
}
export const revalidate = 0

export default async function AboutPage() {
  const [aboutPage, sections, team, values, stats, testimonials, logoStrips, services, siteSettings] =
    await Promise.allSettled([
      getAboutPage(), getPageSections('about'), getTeam(), getValues(),
      getStats('about'), getTestimonials(), getLogoStrips(), getServices(), getSiteSettings(),
    ]).then(r => r.map(x => x.status === 'fulfilled' ? x.value : null))

  const ap = aboutPage as any
  const sectionList = ((sections as any[]) || []).filter((s: any) => s.visible).sort((a: any, b: any) => a.sort_order - b.sort_order)
  const teamList = (team as any[]) || []
  const valuesList = (values as any[]) || []
  const statsList = (stats as any[]) || []
  const testimonialsList = (testimonials as any[]) || []
  const logoStripList = (logoStrips as any[]) || []
  const servicesList = (services as any[]) || []
  const settings = siteSettings as any

  function renderSection(key: string) {
    switch (key) {
      case 'stats':
        return statsList.length > 0 ? (
          <section key="stats" className="section" style={{ background: 'var(--bg2)', paddingTop: '3rem', paddingBottom: '3rem' }}>
            <div className="stats-grid">
              {statsList.map((s: any) => (
                <div key={s.id}>
                  <div className="stat-num">{s.value}</div>
                  <div className="stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </section>
        ) : null

      case 'logos':
        return logoStripList.filter((s: any) => s.logo_strip_items?.length > 0).map((strip: any) => (
          <LogoStrip key={strip.id} strip={strip} />
        ))

      case 'team':
        return teamList.filter((m: any) => m.active).length > 0 ? (
          <section key="team" className="section">
            <p className="section-label">The team</p>
            <h2 className="section-title">Who we are<span className="dot">.</span></h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem', marginTop: '3rem' }}>
              {teamList.filter((m: any) => m.active).map((member: any) => (
                <div key={member.id} style={{ background: 'var(--card)', border: '1px solid var(--border)', overflow: 'hidden' }}>
                  {member.photo ? (
                    <div style={{ aspectRatio: '4/3', overflow: 'hidden' }}>
                      <img src={member.photo} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  ) : (
                    <div style={{ aspectRatio: '4/3', background: 'linear-gradient(135deg, #1a1a1a 0%, #222 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '3rem', color: 'rgba(255,128,0,0.15)' }}>R.</span>
                    </div>
                  )}
                  <div style={{ padding: '1.5rem' }}>
                    <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.2rem', color: '#fff', marginBottom: '0.25rem' }}>{member.name}</h3>
                    {member.role && <p style={{ fontSize: '0.8rem', color: 'var(--orange)', marginBottom: '0.75rem', fontWeight: 600 }}>{member.role}</p>}
                    {member.bio && <p style={{ fontSize: '0.875rem', color: 'var(--muted)', lineHeight: 1.7 }}>{member.bio}</p>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : null

      case 'values':
        return valuesList.length > 0 ? (
          <section key="values" className="section" style={{ background: 'var(--bg2)' }}>
            <p className="section-label">What drives us</p>
            <h2 className="section-title">Our values<span className="dot">.</span></h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem', marginTop: '3rem' }}>
              {valuesList.map((v: any) => (
                <div key={v.id} style={{ background: 'var(--bg)', border: '1px solid var(--border)', padding: '2rem' }}>
                  <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '2rem', color: 'var(--orange)', marginBottom: '1rem', lineHeight: 1 }}>{v.number}</p>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.2rem', color: '#fff', marginBottom: '0.75rem' }}>{v.title}</h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--muted)', lineHeight: 1.7 }}>{v.description}</p>
                </div>
              ))}
            </div>
          </section>
        ) : null

      case 'services':
        return servicesList.length > 0 ? (
          <section key="services" className="section">
            <p className="section-label">What we offer</p>
            <h2 className="section-title">Our services<span className="dot">.</span></h2>
            <div className="services-grid" style={{ marginTop: '3rem' }}>
              {servicesList.map((s: any) => (
                <Link key={s.id} href={s.slug ? `/services/${s.slug}` : '/services'} style={{ textDecoration: 'none' }}>
                  <div className="service-card">
                    <p className="service-num">{s.number}</p>
                    <h3 className="service-name">{s.title}</h3>
                    {s.description && <p className="service-desc">{s.description}</p>}
                  </div>
                </Link>
              ))}
            </div>
            <div style={{ marginTop: '2.5rem', display: 'flex', gap: '1rem' }}>
              <Link href="/work" className="btn-primary">See our work</Link>
              <Link href="/contact" className="btn-secondary">Get in touch</Link>
            </div>
          </section>
        ) : null

      case 'testimonials':
        return <Testimonials key="testimonials" items={testimonialsList} />

      default:
        return null
    }
  }

  const sectionsToRender = sectionList.length > 0
    ? sectionList.map((s: any) => renderSection(s.section_key))
    : ['stats', 'logos', 'team', 'values', 'services', 'testimonials'].map(renderSection)

  return (
    <>
      <Breadcrumb crumbs={[{ label: 'Home', href: '/' }, { label: 'About us' }]} />
      <PageHero
        label="Our story"
        title={ap?.heading || 'About us'}
        intro={ap?.intro || 'A small, focused agency delivering big results since 2007.'}
      />

      {/* Our Story */}
      <section className="section article-body" style={{ background: 'var(--bg)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(3rem, 6vw, 6rem)', alignItems: 'start', maxWidth: '1100px' }}>
          <div>
            <p className="section-label">Est. 2007</p>
            <h2>Our story<span className="dot">.</span></h2>
            <p style={{ marginTop: '1.5rem', color: 'var(--muted)', lineHeight: 1.9 }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
            <p style={{ color: 'var(--muted)', lineHeight: 1.9 }}>
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
            <Link href="/contact" className="btn-primary" style={{ marginTop: '2rem', display: 'inline-block' }}>Work with us</Link>
          </div>
          <div>
            <p style={{ color: 'var(--muted)', lineHeight: 1.9 }}>
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
            </p>
            <p style={{ color: 'var(--muted)', lineHeight: 1.9 }}>
              Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet.
            </p>
            <blockquote style={{ marginTop: '2rem' }}>
              We don&apos;t just build websites. We build digital foundations that businesses grow on for years.
            </blockquote>
          </div>
        </div>
      </section>

      {sectionsToRender}
      <Contact phone={settings?.phone} email={settings?.email} />
    </>
  )
}
