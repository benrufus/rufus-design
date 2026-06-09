import { createClient } from './supabase/server'

export async function getSiteSettings() {
  const sb = await createClient()
  const { data } = await sb.from('site_settings').select('*').single()
  return data
}

export async function getHomePage() {
  const sb = await createClient()
  const { data } = await sb.from('home_page').select('*').single()
  return data
}

export async function getAboutPage() {
  const sb = await createClient()
  const { data } = await sb.from('about_page').select('*').single()
  return data
}

export async function getContactForm() {
  const sb = await createClient()
  const { data } = await sb.from('contact_form').select('*').single()
  return data
}

export async function getSeoSettings() {
  const sb = await createClient()
  const { data } = await sb.from('seo_settings').select('*').single()
  return data
}

export async function getPageSeo(page: string) {
  const sb = await createClient()
  const { data } = await sb.from('page_seo').select('*').eq('page', page).single()
  return data
}

export async function getWork(publishedOnly = true) {
  const sb = await createClient()
  let q = sb.from('work').select('*').order('order_index')
  if (publishedOnly) q = q.eq('published', true)
  const { data } = await q
  return data || []
}

export async function getWorkBySlug(slug: string) {
  const sb = await createClient()
  const { data } = await sb.from('work').select('*').eq('slug', slug).single()
  return data
}

export async function getPosts(publishedOnly = true) {
  const sb = await createClient()
  let q = sb.from('posts').select('*').order('published_at', { ascending: false })
  if (publishedOnly) q = q.eq('published', true)
  const { data } = await q
  return data || []
}

export async function getPostBySlug(slug: string) {
  const sb = await createClient()
  const { data } = await sb.from('posts').select('*').eq('slug', slug).single()
  return data
}

export async function getTestimonials() {
  const sb = await createClient()
  const { data } = await sb.from('testimonials').select('*').eq('published', true).order('order_index')
  return data || []
}

export async function getTeam() {
  const sb = await createClient()
  const { data } = await sb.from('team').select('*').eq('published', true).order('order_index')
  return data || []
}

export async function getServices() {
  const sb = await createClient()
  const { data } = await sb.from('services').select('*').eq('published', true).order('order_index')
  return data || []
}

export async function getStats() {
  const sb = await createClient()
  const { data } = await sb.from('stats').select('*').order('order_index')
  return data || []
}

export async function getValues() {
  const sb = await createClient()
  const { data } = await sb.from('values_items').select('*').order('order_index')
  return data || []
}

export async function getMarqueeItems() {
  const sb = await createClient()
  const { data } = await sb.from('marquee_items').select('*').eq('published', true).order('order_index')
  return data || []
}

export async function getLogoStrips() {
  const sb = await createClient()
  const { data } = await sb.from('logo_strips').select('*, logo_strip_items(*)').eq('published', true).order('order_index')
  return data || []
}

export async function getLocations() {
  const sb = await createClient()
  const { data } = await sb.from('locations').select('*').eq('published', true).order('town')
  return data || []
}

export async function getLocationBySlug(slug: string) {
  const sb = await createClient()
  const { data } = await sb.from('locations').select('*').eq('slug', slug).single()
  return data
}
