import Link from 'next/link'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <div className="footer-logo">Rufus<span>.</span></div>
          <p className="footer-tagline">Web design and digital marketing agency based in Berkhamsted, Hertfordshire. Est. 2007.</p>
        </div>
        <div>
          <p className="footer-col-title">Services</p>
          <ul className="footer-links">
            <li><Link href="/work">Web Design</Link></li>
            <li><Link href="/work">Digital Marketing</Link></li>
            <li><Link href="/work">SEO</Link></li>
            <li><Link href="/work">PPC</Link></li>
            <li><Link href="/work">Hosting</Link></li>
          </ul>
        </div>
        <div>
          <p className="footer-col-title">Company</p>
          <ul className="footer-links">
            <li><Link href="/about">About</Link></li>
            <li><Link href="/work">Our Work</Link></li>
            <li><Link href="/news">News</Link></li>
            <li><Link href="/contact">Contact</Link></li>
            <li><Link href="/where-we-operate">Where We Operate</Link></li>
          </ul>
        </div>
        <div>
          <p className="footer-col-title">Contact</p>
          <ul className="footer-links">
            <li><a href="mailto:hello@rufusdesign.co.uk">hello@rufusdesign.co.uk</a></li>
            <li><a href="tel:01442123456">01442 123 456</a></li>
            <li><span>4 Friars Field</span></li>
            <li><span>Berkhamsted</span></li>
            <li><span>Hertfordshire</span></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {year} Rufus Design Ltd. All rights reserved.</span>
        <span>Registered in England &amp; Wales</span>
      </div>
    </footer>
  )
}
