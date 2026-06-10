import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getPostBySlug, getPosts } from '@/lib/db'
import Contact from '@/components/sections/Contact'
import Breadcrumb from '@/components/ui/Breadcrumb'

export const revalidate = 0
interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug).catch(() => null)
  if (!post) return {}
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.published_at,
      images: post.cover_image ? [{ url: post.cover_image }] : [],
    },
  }
}

export default async function NewsSlugPage({ params }: Props) {
  const { slug } = await params
  const [post, allPosts] = await Promise.allSettled([
    getPostBySlug(slug), getPosts(),
  ]).then(r => r.map(x => x.status === 'fulfilled' ? x.value : null))

  if (!post) notFound()

  const p = post as any
  const related = ((allPosts as any[]) || []).filter((r: any) => r.slug !== slug).slice(0, 3)
  const date = p.published_at
    ? new Date(p.published_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    : null

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.rufusdesign.co.uk'
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: p.title,
    description: p.excerpt || '',
    image: p.cover_image ? [p.cover_image] : [],
    datePublished: p.published_at || '',
    dateModified: p.updated_at || p.published_at || '',
    author: { '@type': 'Organization', name: 'Rufus Design', url: siteUrl },
    publisher: { '@type': 'Organization', name: 'Rufus Design', url: siteUrl },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${siteUrl}/news/${slug}` },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Breadcrumb crumbs={[{ label: 'Home', href: '/' }, { label: 'News', href: '/news' }, { label: p.title }]} />

      <section className="cover-hero">
        {p.cover_image ? (
          <div className="cover-image-wrap">
            <img src={p.cover_image} alt={p.cover_image_alt || p.title} className="cover-image" />
            <div className="cover-overlay" />
            <div className="cover-gradient" />
            <div className="cover-content">
              {date && <p className="section-eyebrow">{date}</p>}
              {p.category && <span className="cover-tag">{p.category}</span>}
              <h1 className="cover-title">{p.title}<span className="text-orange">.</span></h1>
              {p.excerpt && <p className="cover-excerpt">{p.excerpt}</p>}
            </div>
          </div>
        ) : (
          <div className="page-hero">
            {date && <p className="page-hero-label">{date}</p>}
            <h1>{p.title}<span className="dot">.</span></h1>
            {p.excerpt && <p className="page-hero-intro">{p.excerpt}</p>}
          </div>
        )}
      </section>

      {p.body && (
        <section className="section article-body">
          <div dangerouslySetInnerHTML={{ __html: p.body }} />
        </section>
      )}

      <section className="section" style={{ background: 'var(--bg2)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <p className="section-label">Keep reading</p>
            <h2 className="section-title" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', marginBottom: 0 }}>More from the blog<span className="dot">.</span></h2>
          </div>
          <Link href="/news" className="btn-secondary">View all news</Link>
        </div>
        {related.length > 0 ? (
          <div className="news-grid">
            {related.map((rel: any) => (
              <Link key={rel.id} href={`/news/${rel.slug}`} style={{ textDecoration: 'none' }}>
                <article className="news-card">
                  {rel.cover_image && <div className="news-card-img"><img src={rel.cover_image} alt={rel.cover_image_alt || rel.title} /></div>}
                  <div className="news-card-body">
                    {rel.published_at && <p className="news-card-date">{new Date(rel.published_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>}
                    <h3>{rel.title}</h3>
                    {rel.excerpt && <p>{rel.excerpt.slice(0, 100)}…</p>}
                    <span className="news-card-link">Read more →</span>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        ) : (
          <p style={{ color: 'var(--muted)' }}>No other posts yet.</p>
        )}
      </section>

      <Contact />
    </>
  )
}
