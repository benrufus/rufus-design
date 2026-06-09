import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getWorkBySlug } from '@/lib/db'
import PageHero from '@/components/ui/PageHero'
import Contact from '@/components/sections/Contact'

export const revalidate = 60

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const item = await getWorkBySlug(slug).catch(() => null)
  if (!item) return {}
  return { title: item.title, description: item.excerpt || item.description }
}

export default async function WorkSlugPage({ params }: Props) {
  const { slug } = await params
  const item = await getWorkBySlug(slug).catch(() => null)
  if (!item) notFound()

  return (
    <>
      <PageHero label={item.client || 'Case study'} title={item.title} intro={item.excerpt || item.description} />
      {item.cover_image && (
        <section style={{ padding: '0 clamp(1.5rem, 4vw, 3rem) clamp(3rem, 6vw, 5rem)' }}>
          <img src={item.cover_image} alt={item.title} style={{ width: '100%', maxHeight: '600px', objectFit: 'cover' }} />
        </section>
      )}
      {item.body && (
        <section className="section">
          <div style={{ maxWidth: '720px' }} dangerouslySetInnerHTML={{ __html: item.body }} />
        </section>
      )}
      <Contact />
    </>
  )
}
