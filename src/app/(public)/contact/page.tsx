import type { Metadata } from 'next'
import PageHero from '@/components/ui/PageHero'
import Contact from '@/components/sections/Contact'
import { getContactForm, getSiteSettings } from '@/lib/db'

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with Rufus Design. Based in Berkhamsted, Hertfordshire.',
  alternates: { canonical: '/contact' },
}
export const revalidate = 60

export default async function ContactPage() {
  const [contactForm, siteSettings] = await Promise.allSettled([
    getContactForm(), getSiteSettings(),
  ]).then(r => r.map(x => x.status === 'fulfilled' ? x.value : null))

  return (
    <>
      <PageHero label="Say hello" title="Contact us" intro="Ready to start your project? Get in touch and we'll get back to you within one working day." />
      <Contact
        fields={(contactForm as any)?.fields || undefined}
        phone={(siteSettings as any)?.phone || undefined}
        email={(siteSettings as any)?.email || undefined}
      />
    </>
  )
}
