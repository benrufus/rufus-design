import type { Metadata } from 'next'
import PageHero from '@/components/ui/PageHero'
import News from '@/components/sections/News'
import Contact from '@/components/sections/Contact'
import { getPosts } from '@/lib/db'

export const metadata: Metadata = {
  title: 'News & Blog',
  description: 'Web design tips, digital marketing insights and agency news from Rufus Design in Berkhamsted.',
  alternates: { canonical: '/news' },
}
export const revalidate = 60

export default async function NewsPage() {
  const posts = await getPosts().catch(() => [])
  return (
    <>
      <PageHero label="Latest news" title="News & blog" intro="Web design tips, digital marketing insights and agency news from Berkhamsted." />
      <News posts={posts} showTitle={false} />
      <Contact />
    </>
  )
}
