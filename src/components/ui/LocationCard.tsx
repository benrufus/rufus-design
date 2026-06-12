import Link from 'next/link'

interface Location {
  id?: string
  town: string
  county?: string
  slug: string
  hero_image?: string
  intro?: string
}

export default function LocationCard({ loc }: { loc: Location }) {
  return (
    <Link href={`/where-we-operate/${loc.slug}`} className="location-card">
      {loc.hero_image && (
        <div className="location-card-bg" style={{ backgroundImage: `url(${loc.hero_image})` }} />
      )}
      <div className="location-card-content">
        {loc.county && <p className="location-card-county">{loc.county}</p>}
        <h2 className="location-card-town">{loc.town}</h2>
        {loc.intro && <p className="location-card-intro">{loc.intro}</p>}
      </div>
    </Link>
  )
}
