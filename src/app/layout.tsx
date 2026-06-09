import type { Metadata } from 'next'
import { Raleway, DM_Sans } from 'next/font/google'
import './globals.css'
import CustomCursor from '@/components/ui/CustomCursor'
import GridCanvas from '@/components/ui/GridCanvas'

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

export const metadata: Metadata = {
  title: { default: 'Rufus Design | Web Design Berkhamsted', template: '%s | Rufus Design' },
  description: 'Rufus Design — web design and digital marketing agency based in Berkhamsted, Hertfordshire. Est. 2007.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://www.rufusdesign.co.uk'),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${raleway.variable} ${dmSans.variable}`}>
      <body>
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
