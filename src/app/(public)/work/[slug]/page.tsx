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
      <section className="cover-hero">
        {item.cover_image ? (
          <div className="cover-image-wrap">
            <img src={item.cover_image} alt={item.title} className="cover-image" />
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
                  {item.tags.slice(0, 4).map((t: string) => (
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

      <Contact />
    </>
  )
}
