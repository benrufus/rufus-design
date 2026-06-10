'use client'
import Link from 'next/link'
import { useReveal } from '@/lib/useReveal'

interface Post {
  id: string; title: string; slug: string; excerpt?: string
  cover_image?: string; published_at?: string
}
interface NewsProps { posts: Post[]; showTitle?: boolean }

export default function News({ posts, showTitle = true }: NewsProps) {
  const { ref, visible } = useReveal()
  if (!posts.length) return null
  return (
    <section className="section" ref={ref as React.RefObject<HTMLElement>} style={{ background: 'var(--bg2)' }}>
      {showTitle && (
        <div className={`reveal${visible ? ' visible' : ''}`} style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <p className="section-label">Latest news</p>
            <h2 className="section-title">From the blog<span className="dot">.</span></h2>
          </div>
          <Link href="/news" className="btn-secondary">View all news</Link>
        </div>
      )}
      <div className="news-grid">
        {posts.map((post, i) => (
          <Link key={post.id} href={`/news/${post.slug}`} className={`news-card reveal reveal-delay-${Math.min(i + 1, 4)}${visible ? ' visible' : ''}`} style={{ display: 'block' }}>
            <div className="news-card-img">
              {post.cover_image && <img src={post.cover_image} alt={post.title} />}
            </div>
            <div className="news-card-body">
              {post.published_at && (
                <p className="news-card-date">{new Date(post.published_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              )}
              <h3>{post.title}</h3>
              {post.excerpt && <p>{post.excerpt}</p>}
              <span className="news-card-link">Read more →</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
