import type { Metadata } from 'next'
import Link from 'next/link'
import PageHero from '@/components/ui/PageHero'
import Testimonials from '@/components/sections/Testimonials'
import Contact from '@/components/sections/Contact'
import LogoStrip from '@/components/ui/LogoStrip'
import { getAboutPage, getTeam, getValues, getStats, getTestimonials, getLogoStrips, getServices } from '@/lib/db'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Rufus Design is a web design and digital marketing agency based in Berkhamsted, Hertfordshire. Est. 2007.',
  alternates: { canonical: '/about' },
}
export const revalidate = 0

export default async function AboutPage() {
  const [aboutPage, team, values, stats, testimonials, logoStrips, services] = await Promise.allSettled([
    getAboutPage(), getTeam(), getValues(), getStats('about'), getTestimonials(), getLogoStrips(), getServices(),
  ]).then(r => r.map(x => x.status === 'fulfilled' ? x.value : null))

  const ap = aboutPage as any
  const teamList = (team as any[]) || []
  const valuesList = (values as any[]) || []
  const statsList = (stats as any[]) || []
  const testimonialsList = (testimonials as any[]) || []
  const logoStripList = (logoStrips as any[]) || []
  const servicesList = (services as any[]) || []

  return (
    <>
      <PageHero
        label="Our story"
        title={ap?.heading || 'About us'}
        intro={ap?.intro || 'A small, focused agency delivering big results since 2007.'}
      />

      {/* Stats */}
      {statsList.length > 0 && (
        <section className="section" style={{ background: 'var(--bg2)', paddingTop: 0 }}>
          <div className="stats-grid">
            {statsList.map((s: any) => (
              <div key={s.id}>
                <div className="stat-num">{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Logo strip — clients */}
      {logoStripList.map((strip: any) => (
        strip.logo_strip_items?.length > 0 && (
          <LogoStrip key={strip.id} strip={strip} />
        )
      ))}

      {/* Team */}
      {teamList.filter((m: any) => m.active).length > 0 && (
        <section className="section">
          <p className="section-label">The team</p>
          <h2 className="section-title">Who we are<span className="dot">.</span></h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '2rem',
            marginTop: '3rem',
          }}>
            {teamList.filter((m: any) => m.active).map((member: any) => (
              <div key={member.id} style={{
                background: 'var(--card)',
                border: '1px solid var(--border)',
                overflow: 'hidden',
              }}>
                {member.photo ? (
                  <div style={{ aspectRatio: '4/3', overflow: 'hidden' }}>
                    <img
                      src={member.photo}
                      alt={member.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                ) : (
                  <div style={{
                    aspectRatio: '4/3',
                    background: 'linear-gradient(135deg, #1a1a1a 0%, #222 100%)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <span style={{ fontSize: '4rem', opacity: 0.2 }}>👤</span>
                  </div>
                )}
                <div style={{ padding: '1.5rem' }}>
                  <h3 style={{
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 800,
                    fontSize: '1.2rem',
                    color: '#fff',
                    marginBottom: '0.25rem',
                  }}>{member.name}</h3>
                  {member.role && (
                    <p style={{ fontSize: '0.8rem', color: 'var(--orange)', marginBottom: '0.75rem', fontWeight: 600 }}>
                      {member.role}
                    </p>
                  )}
                  {member.bio && (
                    <p style={{ fontSize: '0.875rem', color: 'var(--muted)', lineHeight: 1.7 }}>
                      {member.bio}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Values */}
      {valuesList.length > 0 && (
        <section className="section" style={{ background: 'var(--bg2)' }}>
          <p className="section-label">What drives us</p>
          <h2 className="section-title">Our values<span className="dot">.</span></h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '1.5rem',
            marginTop: '3rem',
          }}>
            {valuesList.map((v: any) => (
              <div key={v.id} style={{
                background: 'var(--bg)',
                border: '1px solid var(--border)',
                padding: '2rem',
              }}>
                <p style={{
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 800,
                  fontSize: '2rem',
                  color: 'var(--orange)',
                  marginBottom: '1rem',
                  lineHeight: 1,
                }}>{v.number}</p>
                <h3 style={{
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 800,
                  fontSize: '1.2rem',
                  color: '#fff',
                  marginBottom: '0.75rem',
                }}>{v.title}</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--muted)', lineHeight: 1.7 }}>
                  {v.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Services CTA */}
      {servicesList.length > 0 && (
        <section className="section">
          <p className="section-label">What we offer</p>
          <h2 className="section-title">Our services<span className="dot">.</span></h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '1px',
            background: 'var(--border)',
            border: '1px solid var(--border)',
            marginTop: '3rem',
          }}>
            {servicesList.map((s: any) => (
              <Link key={s.id} href="/contact" style={{ textDecoration: 'none' }}>
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
      )}

      <Testimonials items={testimonialsList} />
      <Contact />
    </>
  )
}
