import type { MetadataRoute } from 'next'
import { getWork, getPosts, getLocations } from '@/lib/db'

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.rufusdesign.co.uk'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [work, posts, locations] = await Promise.allSettled([
    getWork(), getPosts(), getLocations(),
  ]).then(r => r.map(x => (x.status === 'fulfilled' ? x.value : []))) as any[][]

  const statics: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE}/work`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE}/news`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/where-we-operate`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
  ]

  const workUrls: MetadataRoute.Sitemap = (work || []).map((w: any) => ({
    url: `${BASE}/work/${w.slug}`, lastModified: new Date(w.updated_at || Date.now()), changeFrequency: 'monthly', priority: 0.7,
  }))
  const postUrls: MetadataRoute.Sitemap = (posts || []).map((p: any) => ({
    url: `${BASE}/news/${p.slug}`, lastModified: new Date(p.updated_at || p.published_at || Date.now()), changeFrequency: 'monthly', priority: 0.6,
  }))
  const locationUrls: MetadataRoute.Sitemap = (locations || []).map((l: any) => ({
    url: `${BASE}/where-we-operate/${l.slug}`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6,
  }))

  return [...statics, ...workUrls, ...postUrls, ...locationUrls]
}
