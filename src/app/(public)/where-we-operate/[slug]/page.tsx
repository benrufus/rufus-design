import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import WorkGrid from '@/components/sections/WorkGrid'
import Contact from '@/components/sections/Contact'
import LocationHero from '@/components/ui/LocationHero'
import { getLocationBySlug, getWork, getSiteSettings } from '@/lib/db'

export const revalidate = 0
interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const loc = await getLocationBySlug(slug).catch(() => null)
  if (!loc) return {}
  return {
    title: loc.meta_title || `Web Design ${loc.town} | Rufus Design`,
    description: loc.meta_description || `Professional web design in ${loc.town}. Rufus Design — Est. 2007.`,
    alternates: { canonical: `/where-we-operate/${slug}` },
  }
}

export default async function LocationPage({ params }: Props) {
  const { slug } = await params
  const [loc, work, siteSettings] = await Promise.allSettled([
    getLocationBySlug(slug), getWork(), getSiteSettings(),
  ]).then(r => r.map(x => x.status === 'fulfilled' ? x.value : null))

  if (!loc) notFound()
  const location = loc as any
  const workItems = (work as any[]) || []
  const settings = siteSettings as any

  return (
    <>
      <LocationHero
        town={location.town}
        intro={location.intro}
      />

      {location.services?.length > 0 && (
        <section className="section" style={{ background: 'var(--bg2)', paddingTop: '2rem', paddingBottom: '2rem' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {location.services.map((s: string) => (
              <span key={s} style={{ fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', background: 'rgba(255,128,0,0.15)', color: 'var(--orange)', border: '1px solid rgba(255,128,0,0.3)', padding: '0.35em 0.85em', fontFamily: 'var(--font-heading)', fontWeight: 700 }}>{s}</span>
            ))}
          </div>
        </section>
      )}

      {workItems.length > 0 && <WorkGrid items={workItems} showTitle />}

      <Contact phone={settings?.phone} email={settings?.email} />
    </>
  )
}
