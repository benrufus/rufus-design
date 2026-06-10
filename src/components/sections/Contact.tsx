'use client'
import { useState } from 'react'
import { useReveal } from '@/lib/useReveal'

export default function Contact() {
  const revealRef = useReveal()
  const [form, setForm] = useState({ firstName: '', lastName: '', company: '', email: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      setStatus(res.ok ? 'sent' : 'error')
    } catch { setStatus('error') }
  }

  return (
    <section id="contact" ref={revealRef as React.RefObject<HTMLElement>} className="contact-section reveal">
      <div className="contact-info">
        <p className="section-eyebrow">Get in touch</p>
        <h2 className="contact-heading">Let&apos;s<br /><span className="text-orange">talk.</span></h2>
        <p className="contact-subtext">
          To arrange a meeting, discuss your business goals or even just have a quick cuppa.
        </p>
        <div className="contact-links">
          {[
            ['mailto:hello@rufusdesign.co.uk', 'hello@rufusdesign.co.uk'],
            ['tel:01442967775', '01442 967775'],
            ['https://calendly.com/ben-rufusdesign/30min', 'Book a meeting online'],
          ].map(([href, label]) => (
            <a key={href} href={href} className="contact-link">
              <span className="contact-link-arrow">→</span>{label}
            </a>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="contact-form">
        {status === 'sent' ? (
          <div className="contact-success">
            ✓ Message sent — we&apos;ll be in touch shortly.
          </div>
        ) : (
          <>
            <div className="contact-name-row">
              <div className="contact-field">
                <label className="contact-label">First name</label>
                <input
                  type="text"
                  className="contact-input"
                  placeholder="Jane"
                  value={form.firstName}
                  onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))}
                />
              </div>
              <div className="contact-field">
                <label className="contact-label">Last name</label>
                <input
                  type="text"
                  className="contact-input"
                  placeholder="Smith"
                  value={form.lastName}
                  onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))}
                />
              </div>
            </div>
            <div className="contact-field">
              <label className="contact-label">Company</label>
              <input
                type="text"
                className="contact-input"
                placeholder="Smith & Co Ltd"
                value={form.company}
                onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
              />
            </div>
            <div className="contact-field">
              <label className="contact-label">Email address *</label>
              <input
                type="email"
                className="contact-input"
                placeholder="jane@smithco.com"
                required
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              />
            </div>
            <div className="contact-field">
              <label className="contact-label">Message</label>
              <textarea
                className="contact-input contact-textarea"
                placeholder="Tell us about your project..."
                required
                rows={5}
                value={form.message}
                onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
              />
            </div>
            {status === 'error' && (
              <p className="contact-error">Something went wrong — please email us directly.</p>
            )}
            <button
              type="submit"
              disabled={status === 'sending'}
              className="btn-primary contact-submit"
            >
              {status === 'sending' ? 'Sending...' : 'Send message'}
            </button>
          </>
        )}
      </form>
    </section>
  )
}
