import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { client, LOCATIONS_QUERY, LOCATION_SLUG_QUERY, urlFor } from '@/lib/sanity'
import { PortableText, PortableTextComponents } from 'next-sanity'
import Nav from '@/components/layout/Nav'
import Footer from '@/components/layout/Footer'
import Hero from '@/components/sections/Hero'
import Contact from '@/components/sections/Contact'
import WorkGrid from '@/components/sections/WorkGrid'
import { WORK_QUERY } from '@/lib/sanity'

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const locs = await client.fetch(LOCATIONS_QUERY).catch(() => [])
  return locs.map((l: { slug: { current: string } }) => ({ slug: l.slug.current }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const loc = await client.fetch(LOCATION_SLUG_QUERY, { slug }).catch(() => null)
  if (!loc) return {}
  return {
    title: loc.seo?.metaTitle || `Web Design ${loc.town} | Rufus Design`,
    description: loc.seo?.metaDescription || `Rufus Design provides web design and digital marketing services in ${loc.town}, ${loc.county}.`,
    alternates: { canonical: `/where-we-operate/${slug}` },
  }
}

export const revalidate = 60

const components: PortableTextComponents = {
  block: {
    h2: ({ children }) => <h2 style={{ fontFamily: 'var(--font-raleway)', fontWeight: 800, fontSize: 'clamp(1.4rem,3vw,2rem)', letterSpacing: '-0.02em', margin: '2.5rem 0 1rem', color: '#fff' }}>{children}</h2>,
    h3: ({ children }) => <h3 style={{ fontFamily: 'var(--font-raleway)', fontWeight: 700, fontSize: '1.15rem', margin: '2rem 0 0.75rem', color: '#fff' }}>{children}</h3>,
    normal: ({ children }) => <p style={{ marginBottom: '1.4rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.85 }}>{children}</p>,
    blockquote: ({ children }) => <blockquote style={{ borderLeft: '3px solid #ff8000', paddingLeft: '1.5rem', margin: '2rem 0', fontStyle: 'italic', color: 'rgba(255,255,255,0.65)', lineHeight: 1.7 }}>{children}</blockquote>,
  },
  marks: {
    strong: ({ children }) => <strong style={{ color: '#fff', fontWeight: 700 }}>{children}</strong>,
    link: ({ value, children }) => <a href={value?.href} target={value?.blank ? '_blank' : undefined} rel="noopener noreferrer" style={{ color: '#ff8000', textDecoration: 'underline', textUnderlineOffset: '3px' }}>{children}</a>,
  },
  types: {
    image: ({ value }) => (
      <figure style={{ margin: '2rem 0' }}>
        <img src={urlFor(value).width(800).url()} alt={value.alt || ''} style={{ width: '100%', display: 'block' }} />
        {value.caption && <figcaption style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.35)', marginTop: '0.5rem', textAlign: 'center' }}>{value.caption}</figcaption>}
      </figure>
    ),
  },
}

// Services that cycle in the hero for each location page
const SERVICE_WORDS = ['Web Design', 'Development', 'SEO & PPC', 'Branding', 'IT Support']

export default async function LocationPage({ params }: Props) {
  const { slug } = await params

  const [loc, workItems] = await Promise.all([
    client.fetch(LOCATION_SLUG_QUERY, { slug }).catch(() => null),
    client.fetch(WORK_QUERY).catch(() => []),
  ])

  if (!loc) notFound()

  // Hero words: town name first, then services cycle
  const heroWords = [loc.town, ...SERVICE_WORDS]

  return (
    <>
      <Nav />
      <main>
        {/* Hero — cycles town name then services */}
        <Hero
          words={heroWords}
          subtext={loc.intro || `Professional web design and digital marketing services in ${loc.town}, ${loc.county}.`}
          cta1="Let's talk"
          cta2="Our work"
        />

        {/* Services tags */}
        {loc.services?.length > 0 && (
          <section style={{
            padding: '3rem clamp(1.5rem,4vw,3rem)',
            background: 'var(--bg)',
            borderTop: '1px solid rgba(255,255,255,0.06)',
          }}>
            <p style={{ fontSize: '0.65rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#ff8000', marginBottom: '1.25rem' }}>
              Services in {loc.town}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
              {loc.services.map((s: string) => (
                <a key={s} href="/contact" style={{
                  display: 'inline-block',
                  padding: '0.6rem 1.25rem',
                  background: 'rgba(255,128,0,0.1)',
                  border: '1px solid rgba(255,128,0,0.25)',
                  color: '#ff8000',
                  fontSize: '0.8rem',
                  fontFamily: 'var(--font-raleway)',
                  fontWeight: 700,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                }}>
                  {s}
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Body content */}
        {loc.body?.length > 0 && (
          <article style={{ padding: '3rem clamp(1.5rem,4vw,3rem) 4rem', maxWidth: '780px' }}>
            <PortableText value={loc.body} components={components} />
            <a href="/contact" className="btn-primary" style={{ display: 'inline-block', marginTop: '2rem' }}>
              Get in touch
            </a>
          </article>
        )}

        {/* Our work */}
        {workItems.length > 0 && <WorkGrid items={workItems} showTitle />}

        {/* Back link */}
        <div style={{ padding: '0 clamp(1.5rem,4vw,3rem) 2rem' }}>
          <a href="/where-we-operate" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', transition: 'color 0.25s', textDecoration: 'none' }}>
            ← All areas
          </a>
        </div>

        <Contact />
      </main>
      <Footer />
    </>
  )
}
