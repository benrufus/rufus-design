import type { Metadata } from 'next'
import PageHero from '@/components/ui/PageHero'
import News from '@/components/sections/News'
import Contact from '@/components/sections/Contact'
import Breadcrumb from '@/components/ui/Breadcrumb'
import { getPosts } from '@/lib/db'

export const metadata: Metadata = {
  title: 'News & Blog | Rufus Design',
  description: 'Web design tips, digital marketing insights and agency news from Rufus Design in Berkhamsted.',
  alternates: { canonical: '/news' },
}
export const revalidate = 60

export default async function NewsPage() {
  const posts = await getPosts().catch(() => [])
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.rufusdesign.co.uk'

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'News & Blog | Rufus Design',
    description: 'Web design tips, digital marketing insights and agency news from Berkhamsted.',
    url: `${siteUrl}/news`,
    publisher: { '@type': 'Organization', name: 'Rufus Design', url: siteUrl },
    blogPost: posts.slice(0, 10).map((p: any) => ({
      '@type': 'BlogPosting',
      headline: p.title,
      description: p.excerpt || '',
      url: `${siteUrl}/news/${p.slug}`,
      datePublished: p.published_at || '',
      image: p.cover_image || '',
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Breadcrumb crumbs={[{ label: 'Home', href: '/' }, { label: 'News & Blog' }]} />
      <PageHero label="Latest news" title="News & blog" intro="Web design tips, digital marketing insights and agency news from Berkhamsted." />
      <News posts={posts} showTitle={false} />
      <Contact />
    </>
  )
}
