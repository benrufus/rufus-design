import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getLocationBySlug } from '@/lib/db'
import PageHero from '@/components/ui/PageHero'
import Contact from '@/components/sections/Contact'

export const revalidate = 60
interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const loc = await getLocationBySlug(slug).catch(() => null)
  if (!loc) return {}
  return {
    title: loc.meta_title || `Web Design ${loc.town} | Rufus Design`,
    description: loc.meta_description || `Professional web design and digital marketing in ${loc.town}, ${loc.county}.`,
  }
}

export default async function LocationSlugPage({ params }: Props) {
  const { slug } = await params
  const loc = await getLocationBySlug(slug).catch(() => null)
  if (!loc) notFound()

  return (
    <>
      <PageHero label={loc.county || 'Service area'} title={`Web Design ${loc.town}`} intro={loc.intro || `Professional web design and digital marketing services in ${loc.town}.`} />
      {loc.image_url && (
        <section style={{ padding: '0 clamp(1.5rem,4vw,3rem) 2rem' }}>
          <img src={loc.image_url} alt={loc.town} style={{ width: '100%', maxHeight: '500px', objectFit: 'cover' }} />
        </section>
      )}
      {loc.body && (
        <section className="section">
          <div style={{ maxWidth: '720px', lineHeight: 1.8, color: 'rgba(255,255,255,0.75)' }} dangerouslySetInnerHTML={{ __html: loc.body }} />
        </section>
      )}
      <Contact />
    </>
  )
}
