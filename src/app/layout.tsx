import type { Metadata } from 'next'
import { Raleway, DM_Sans } from 'next/font/google'
import './globals.css'
import CustomCursor from '@/components/ui/CustomCursor'
import GridCanvas from '@/components/ui/GridCanvas'
import { getSeoSettings, getSiteSettings } from '@/lib/db'

const raleway = Raleway({
  subsets: ['latin'],
  weight: ['400', '700', '800', '900'],
  variable: '--font-raleway',
  display: 'swap',
})
const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-dm-sans',
  display: 'swap',
})

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings().catch(() => null) as any
  return {
    title: { default: 'Rufus Design | Web Design Berkhamsted', template: '%s | Rufus Design' },
    description: 'Rufus Design — web design and digital marketing agency based in Berkhamsted, Hertfordshire. Est. 2007.',
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://www.rufusdesign.co.uk'),
    icons: {
      icon: settings?.favicon_url || '/icon.png',
      shortcut: settings?.favicon_url || '/icon.png',
      apple: settings?.favicon_url || '/icon.png',
    },
    openGraph: {
  url: 'https://www.rufusdesign.co.uk',
  images: settings?.og_image_url ? [{ url: settings.og_image_url, width: 1200, height: 630 }] : [],
},
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const seo = await getSeoSettings().catch(() => null) as any

  return (
    <html lang="en" className={`${raleway.variable} ${dmSans.variable}`}>
      <head>
        <link rel="alternate" type="text/plain" href="/llms.txt" title="LLMs.txt" />
        {seo?.google_verification && (
          <meta name="google-site-verification" content={seo.google_verification} />
        )}
      </head>
      <body>
        {seo?.head_scripts && (
          <div dangerouslySetInnerHTML={{ __html: seo.head_scripts }} />
        )}
        {seo?.body_scripts && (
          <div dangerouslySetInnerHTML={{ __html: seo.body_scripts }} />
        )}
        <CustomCursor />
        <div className="grid-canvas-wrap">
          <GridCanvas />
        </div>
        <div className="site-wrap">
          {children}
        </div>
      </body>
    </html>
  )
}
