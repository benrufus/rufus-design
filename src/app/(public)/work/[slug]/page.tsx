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

  const gallery: { url: string; alt: string }[] = item.gallery || []
  const results: { metric: string; value: string }[] = item.results || []

  return (
    <>
      <section className="cover-hero">
        {item.cover_image ? (
          <div className="cover-image-wrap">
            <img
              src={item.cover_image}
              alt={item.cover_image_alt || item.title}
              className="cover-image"
            />
            <div className="cover-overlay" />
            <div className="cover-gradient" />
            <div className="cover-content">
              {item.client && (
                <p className="section-eyebrow">
                  {item.client}{item.year ? ` · ${item.year}` : ''}
                </p>
              )}
              {(item.tags?.length ?? 0) > 0 && (
                <div className="cover-tags">
                  {item.tags.map((t: string) => (
                    <span key={t} className="cover-tag">{t}</span>
                  ))}
                </div>
              )}
              <h1 className="cover-title">{item.title}<span className="text-orange">.</span></h1>
              {item.excerpt && <p className="cover-excerpt">{item.excerpt}</p>}
              {item.url && (
                <a href={item.url} target="_blank" rel="noopener noreferrer" className="cover-link">
                  Visit site →
                </a>
              )}
            </div>
          </div>
        ) : (
          <div className="page-hero">
            {item.client && <p className="page-hero-label">{item.client}</p>}
            <h1>{item.title}<span className="dot">.</span></h1>
            {item.excerpt && <p className="page-hero-intro">{item.excerpt}</p>}
          </div>
        )}
      </section>

      {item.body && (
        <section className="section article-body">
          <div dangerouslySetInnerHTML={{ __html: typeof item.body === 'string' ? item.body : JSON.stringify(item.body) }} />
        </section>
      )}

      {item.video_url && (
  <section className="section" style={{ background: 'var(--bg2)' }}>
    <p className="section-label">Project video</p>
    <video
  src={item.video_url}
  autoPlay
  muted
  loop
  playsInline
  className="work-video"
/>
  </section>
)}

      {results.length > 0 && (
        <section className="section" style={{ background: 'var(--bg2)' }}>
          <p className="section-label">The results</p>
          <div className="work-results">
            {results.map((r, i) => (
              <div key={i} className="work-result">
                <p className="work-result-value">{r.value}</p>
                <p className="work-result-metric">{r.metric}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {gallery.length > 0 && (
        <section className="section">
          <p className="section-label">Project images</p>
          <div className="work-gallery">
            {gallery.map((img, i) => (
              <div key={i} className="work-gallery-item">
                <img src={img.url} alt={img.alt || item.title} />
              </div>
            ))}
          </div>
        </section>
      )}

      <Contact />
    </>
  )
}
