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
      <section className="cover-hero">
        {post.cover_image ? (
          <div className="cover-image-wrap">
            <img src={post.cover_image} alt={post.title} className="cover-image" />
            <div className="cover-overlay" />
            <div className="cover-gradient" />
            <div className="cover-content">
              {date && <p className="section-eyebrow">{date}</p>}
              {post.category && <span className="cover-tag">{post.category}</span>}
              <h1 className="cover-title">{post.title}<span className="text-orange">.</span></h1>
              {post.excerpt && <p className="cover-excerpt">{post.excerpt}</p>}
            </div>
          </div>
        ) : (
          <div className="page-hero">
            {date && <p className="page-hero-label">{date}</p>}
            <h1>{post.title}<span className="dot">.</span></h1>
            {post.excerpt && <p className="page-hero-intro">{post.excerpt}</p>}
          </div>
        )}
      </section>

      {post.body && (
        <section className="section article-body">
          <div dangerouslySetInnerHTML={{ __html: post.body }} />
        </sec
