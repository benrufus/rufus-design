import Hero from './Hero'
import Marquee from './Marquee'
import Services from './Services'
import WorkGrid from './WorkGrid'
import About from './About'
import Testimonials from './Testimonials'
import News from './News'
import Contact from './Contact'
import LogoStrip from '@/components/ui/LogoStrip'

interface Section {
  id: string
  section_key: string
  label: string
  visible: boolean
  sort_order: number
}

interface SectionRendererProps {
  section: Section
  data: Record<string, any>
}

export default function SectionRenderer({ section, data }: SectionRendererProps) {
  switch (section.section_key) {
    case 'hero':
      return (
        <Hero
          words={data.homePage?.hero_words || undefined}
          intro={data.homePage?.hero_subtext || undefined}
        />
      )
    case 'marquee':
      return <Marquee items={data.marqueeItems || []} />
    case 'logos':
      return (
        <>
          {(data.logoStrips || []).map((strip: any) =>
            strip.logo_strip_items?.length > 0
              ? <LogoStrip key={strip.id} strip={strip} />
              : null
          )}
        </>
      )
    case 'services':
      return <Services services={data.services || []} />
    case 'work':
      return <WorkGrid items={data.work || []} showTitle />
    case 'about':
      return (
        <About
          heading={data.homePage?.about_heading || undefined}
          body={data.homePage?.about_body || undefined}
          quote={data.homePage?.about_quote || undefined}
          stats={data.stats || []}
        />
      )
    case 'testimonials':
      return <Testimonials items={data.testimonials || []} />
    case 'news':
      return <News posts={(data.posts || []).slice(0, 3)} />
    case 'contact':
      return (
        <Contact
          fields={data.contactForm?.fields || undefined}
          phone={data.siteSettings?.phone || undefined}
          email={data.siteSettings?.email || undefined}
        />
      )
    default:
      return null
  }
}
