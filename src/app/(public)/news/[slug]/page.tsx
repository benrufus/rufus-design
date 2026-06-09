import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPostBySlug } from '@/lib/db'
import Contact from '@/components/sections/Contact'

export const revalidate = 0
interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug).catch(() => null)
  if (!post) return {}
  return { title: post.title, description: post.excerpt }
}

export default async function NewsSlugPage({ params }: Props) {
  const { slug } = await params
  const post = await getPostBySlug(slug).catch(() => null)
  if (!post) notFound()

  const date = post.published_at
    ? new Date(post.published_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    : null

  return (
    <>
      {/* Hero with cover image inset */}
      <section style={{
        paddingTop: '72px',
        background: 'var(--bg)',
        position: 'relative',
      }}>
        {post.cover_image && (
          <div style={{
            width: '100%',
            maxHeight: '520px',
            overflow: 'hidden',
            position: 'relative',
          }}>
            <img
              src={post.cover_image}
              alt={post.title}
              style={{ width: '100%', maxHeight: '520px', objectFit: 'cover', display: 'block' }}
            />
            {/* Dark overlay at bottom for text readability */}
            <div style={{
              position: 'absolute',
              bottom: 0, left: 0, right: 0,
              height: '60%',
              background: 'linear-gradient(to top, rgba(17,17,17,0.95) 0%, transparent 100%)',
            }} />
            {/* Title overlaid on image */}
            <div style={{
              position: 'absolute',
              bottom: 0, left: 0, right: 0,
              padding: 'clamp(1.5rem, 4vw, 3rem)',
            }}>
              {date && (
                <p style={{
                  fontSize: '0.65rem',
                  letterSpacing: '0.25em',
                  textTransform: 'uppercase',
                  color: 'var(--orange)',
                  marginBottom: '0.75rem',
                }}>{date}</p>
              )}
              {post.category && (
                <span style={{
                  display: 'inline-block',
                  fontSize: '0.65rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  background: 'rgba(255,128,0,0.15)',
                  color: 'var(--orange)',
                  padding: '0.25em 0.75em',
                  marginBottom: '1rem',
                }}>{post.category}</span>
              )}
              <h1 style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: 800,
                fontSize: 'clamp(2rem, 5vw, 4rem)',
                lineHeight: 1.05,
                color: '#fff',
                maxWidth: '800px',
              }}>{post.title}<span style={{ color: 'var(--orange)' }}>.</span></h1>
              {post.excerpt && (
                <p style={{
                  marginTop: '1rem',
                  fontSize: 'clamp(1rem, 1.4vw, 1.1rem)',
                  color: 'rgba(255,255,255,0.7)',
                  maxWidth: '600px',
                  lineHeight: 1.6,
                }}>{post.excerpt}</p>
              )}
            </div>
          </div>
        )}

        {/* No cover image fallback */}
        {!post.cover_image && (
          <div style={{ padding: 'clamp(4rem, 8vw, 7rem) clamp(1.5rem, 4vw, 3rem) 3rem' }}>
            {date && <p style={{ fontSize: '0.65rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--orange)', marginBottom: '1rem' }}>{date}</p>}
            <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'clamp(2.5rem, 6vw, 5rem)', lineHeight: 1.05, color: '#fff' }}>
              {post.title}<span style={{ color: 'var(--orange)' }}>.</span>
            </h1>
            {post.excerpt && <p style={{ marginTop: '1.5rem', fontSize: '1.1rem', color: 'var(--muted)', maxWidth: '600px', lineHeight: 1.7 }}>{post.excerpt}</p>}
          </div>
        )}
      </section>

      {/* Article body */}
      {post.body && (
        <section className="section" style={{ background: 'var(--bg)' }}>
          <div style={{
            maxWidth: '720px',
            lineHeight: 1.9,
            color: 'rgba(255,255,255,0.8)',
            fontSize: '1.05rem',
          }} dangerouslySetInnerHTML={{ __html: post.body }} />
        </section>
      )}

      <Contact />
    </>
  )
}
