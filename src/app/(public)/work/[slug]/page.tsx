import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getWorkBySlug } from '@/lib/db'
import Contact from '@/components/sections/Contact'

export const revalidate = 0
interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const item = await getWorkBySlug(slug).catch(() => null)
  if (!item) return {}
  return { title: item.title, description: item.excerpt }
}

export default async function WorkSlugPage({ params }: Props) {
  const { slug } = await params
  const item = await getWorkBySlug(slug).catch(() => null)
  if (!item) notFound()

  return (
    <>
      {/* Hero with cover image */}
      <section style={{ paddingTop: '72px', background: 'var(--bg)', position: 'relative' }}>
        {item.cover_image && (
          <div style={{ width: '100%', maxHeight: '600px', overflow: 'hidden', position: 'relative' }}>
            <img
              src={item.cover_image}
              alt={item.title}
              style={{ width: '100%', maxHeight: '600px', objectFit: 'cover', display: 'block' }}
            />
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0, height: '65%',
              background: 'linear-gradient(to top, rgba(17,17,17,0.97) 0%, transparent 100%)',
            }} />
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 'clamp(1.5rem, 4vw, 3rem)' }}>
              {item.client && (
                <p style={{ fontSize: '0.65rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--orange)', marginBottom: '0.75rem' }}>
                  {item.client}{item.year ? ` · ${item.year}` : ''}
                </p>
              )}
              {item.tags?.length > 0 && (
                <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                  {item.tags.slice(0, 4).map((t: string) => (
                    <span key={t} style={{ fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase', background: 'rgba(255,128,0,0.15)', color: 'var(--orange)', padding: '0.25em 0.75em' }}>{t}</span>
                  ))}
                </div>
              )}
              <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'clamp(2rem, 5vw, 4.5rem)', lineHeight: 1.05, color: '#fff', maxWidth: '800px' }}>
                {item.title}<span style={{ color: 'var(--orange)' }}>.</span>
              </h1>
              {item.excerpt && (
                <p style={{ marginTop: '1rem', fontSize: 'clamp(1rem, 1.4vw, 1.1rem)', color: 'rgba(255,255,255,0.7)', maxWidth: '600px', lineHeight: 1.6 }}>
                  {item.excerpt}
                </p>
              )}
              {item.url && (
                <a href={item.url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', marginTop: '1.25rem', fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--orange)', fontFamily: 'var(--font-heading)', fontWeight: 700 }}>
                  Visit site →
                </a>
              )}
            </div>
          </div>
        )}

        {!item.cover_image && (
          <div style={{ padding: 'clamp(4rem, 8vw, 7rem) clamp(1.5rem, 4vw, 3rem) 3rem' }}>
            {item.client && <p style={{ fontSize: '0.65rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--orange)', marginBottom: '1rem' }}>{item.client}</p>}
            <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'clamp(2.5rem, 6vw, 5rem)', lineHeight: 1.05, color: '#fff' }}>
              {item.title}<span style={{ color: 'var(--orange)' }}>.</span>
            </h1>
            {item.excerpt && <p style={{ marginTop: '1.5rem', fontSize: '1.1rem', color: 'var(--muted)', maxWidth: '600px', lineHeight: 1.7 }}>{item.excerpt}</p>}
          </div>
        )}
      </section>

      {/* Body */}
      {item.body && (
        <section className="section" style={{ background: 'var(--bg)' }}>
          <div style={{ maxWidth: '720px', lineHeight: 1.9, color: 'rgba(255,255,255,0.8)', fontSize: '1.05rem' }}
            dangerouslySetInnerHTML={{ __html: typeof item.body === 'string' ? item.body : JSON.stringify(item.body) }} />
        </section>
      )}

      <Contact />
    </>
  )
}
