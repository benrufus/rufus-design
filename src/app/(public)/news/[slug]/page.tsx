import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPostBySlug } from '@/lib/db'
import PageHero from '@/components/ui/PageHero'
import Contact from '@/components/sections/Contact'

export const revalidate = 60
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

  const date = post.published_at ? new Date(post.published_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : null

  return (
    <>
      <PageHero label={date || 'News'} title={post.title} intro={post.excerpt} />
      {post.cover_image && (
        <section style={{ padding: '0 clamp(1.5rem, 4vw, 3rem) 2rem' }}>
          <img src={post.cover_image} alt={post.title} style={{ width: '100%', maxHeight: '500px', objectFit: 'cover' }} />
        </section>
      )}
      {post.body && (
        <section className="section">
          <div style={{ maxWidth: '720px', lineHeight: 1.8, color: 'rgba(255,255,255,0.75)' }} dangerouslySetInnerHTML={{ __html: post.body }} />
        </section>
      )}
      <Contact />
    </>
  )
}
