'use client'
interface MarqueeItem { id: string; text: string; sort_order: number; active: boolean }
interface MarqueeProps { items?: MarqueeItem[] }

const DEFAULT_ITEMS = [
  'Web Design', 'SEO', 'PPC', 'Digital Marketing',
  'WordPress', 'Branding', 'Analytics', 'Managed Hosting'
]

export default function Marquee({ items }: MarqueeProps) {
  const labels = items?.length ? items.map(i => i.text) : DEFAULT_ITEMS
  const doubled = [...labels, ...labels]
  return (
    <div className="marquee-wrap">
      <div className="marquee-track">
        {doubled.map((item, i) => (
          <span key={i} className="marquee-item">{item}</span>
        ))}
      </div>
    </div>
  )
}
