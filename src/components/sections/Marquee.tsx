const DEFAULT_ITEMS = ['Web Design', 'SEO', 'PPC', 'Digital Marketing', 'WordPress', 'Branding', 'Analytics', 'Managed Hosting']

interface MarqueeProps { items?: string[] }

export default function Marquee({ items = DEFAULT_ITEMS }: MarqueeProps) {
  const doubled = [...items, ...items]
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
