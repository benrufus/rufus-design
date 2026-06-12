import type { Metadata } from 'next'
import Link from 'next/link'
import PageHero from '@/components/ui/PageHero'
import Breadcrumb from '@/components/ui/Breadcrumb'
import Testimonials from '@/components/sections/Testimonials'
import Contact from '@/components/sections/Contact'
import LogoStrip from '@/components/ui/LogoStrip'
import {
  getAboutPage, getTeam, getValues, getStats, getTestimonials,
  getLogoStrips, getServices, getPageSections, getSiteSettings, getPageSeo
} from '@/lib/db'

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo('about').catch(() => null)
  return {
    title: seo?.title || 'About Us',
    description: seo?.description || 'Rufus Design is a web design and digital marketing agency based in Berkhamsted, Hertfordshire. Est. 2007.',
    alternates: { canonical: '/about' },
  }
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
  {s.image && <div className="service-card-bg" style={{ backgroundImage: `url(${s.image})` }} />}
  <p className="service-num">{s.number}</p>
  <h3 className="service-name">{s.title}</h3>
  {s.description && <p className="service-desc">{s.description}</p>}
</div>
                </Link>
              ))}
            </div>
            <div className="services-cta" style={{ marginTop: '2.5rem', display: 'flex', gap: '1rem' }}>
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
        <div className="about-story-grid">
          <div>
            <p className="section-label">Est. 2007</p>
            <h2>Our story<span className="dot">.</span></h2>
            <p style={{ marginTop: '1.5rem', color: 'var(--muted)', lineHeight: 1.9 }}>
              Rufus Design is a small yet mighty digital agency based in Berkhamsted, Hertfordshire. Founded in 2007, we help businesses grow through website design and development, SEO, paid advertising, social media marketing, branding, hosting, IT support and bespoke digital solutions.
              </p>
            <p style={{ color: 'var(--muted)', lineHeight: 1.9 }}>
              The company was named after Rufus, the owner's first dog, a Giant Schnauzer with a larger-than-life personality. What started as a freelance web design business has grown into a trusted digital partner for businesses across Hertfordshire, Buckinghamshire, London and the wider UK.
              </p>
              <p style={{ color: 'var(--muted)', lineHeight: 1.9 }}>
              Over the years, we've worked with organisations of all sizes, from global brands including Sony, Butlin's and Duarte, through to SMEs such as Simon Taylor Furniture, KDA Accountants and Reborne Longevity. We believe every client deserves the same level of care and attention, regardless of their size.
              </p>
          </div>
          <div>
            <p style={{ color: 'var(--muted)', lineHeight: 1.9 }}>
              Many of our clients have been with us for years. Simon Taylor Furniture, for example, has trusted us since 2010. We see this as one of our biggest achievements and a reflection of the relationships we build with our clients.
              </p>
            <p style={{ color: 'var(--muted)', lineHeight: 1.9 }}>
              We're also passionate about supporting our local community and regularly work with charities and not-for-profit organisations. Current projects include supporting Castle Fields and other organisations looking to make a bigger impact online.
              </p>
              <p style={{ color: 'var(--muted)', lineHeight: 1.9 }}>
              If you're considering working with Rufus Design, we encourage you to read our testimonials and reviews. They provide an honest reflection of the way we work: straightforward advice, reliable service, and digital solutions that deliver real results.
              </p>
            <blockquote style={{ marginTop: '2rem' }}>
              We don't just build websites. We help businesses grow, evolve and succeed online. And unlike Thanos, we have absolutely no intention of making half your traffic disappear. (Sorry Marvel Reference)
            </blockquote>
          </div>
        </div>
      </section>

      {sectionsToRender}
      <Contact phone={settings?.phone} email={settings?.email} />
    </>
  )
}
