'use client'
import { useState } from 'react'
import { useReveal } from '@/lib/useReveal'

interface ContactField {
  id: string; label: string; field_type: string; placeholder?: string; required?: boolean; options?: string[]
}

interface ContactProps {
  fields?: ContactField[]
  phone?: string
  email?: string
}

const DEFAULT_FIELDS: ContactField[] = [
  { id: '1', label: 'Name', field_type: 'text', placeholder: 'Your name', required: true },
  { id: '2', label: 'Email', field_type: 'email', placeholder: 'your@email.com', required: true },
  { id: '3', label: 'Phone', field_type: 'tel', placeholder: 'Your phone number', required: false },
  { id: '4', label: 'Message', field_type: 'textarea', placeholder: 'Tell us about your project…', required: true },
]

export default function Contact({ fields = DEFAULT_FIELDS, phone, email }: ContactProps) {
  const { ref, visible } = useReveal()
  const [values, setValues] = useState<Record<string, string>>({})
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      setStatus(res.ok ? 'sent' : 'error')
    } catch { setStatus('error') }
  }

  return (
    <section className="section" ref={ref as React.RefObject<HTMLElement>} style={{ background: 'var(--bg2)' }} id="contact">
      <div className="contact-grid">
        <div className={`reveal${visible ? ' visible' : ''}`}>
          <p className="section-label">Get in touch</p>
          <h2 className="section-title">Let&apos;s talk<span className="dot">.</span></h2>
          <p style={{ color: 'var(--muted)', marginTop: '1.5rem', lineHeight: 1.7, maxWidth: '400px' }}>
            Ready to start your project? Get in touch and we&apos;ll get back to you within one working day.
          </p>
          <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {email && <a href={`mailto:${email}`} style={{ color: 'var(--orange)', fontFamily: 'var(--font-heading)', fontWeight: 700 }}>{email}</a>}
            {phone && <a href={`tel:${phone}`} style={{ color: 'rgba(255,255,255,0.6)' }}>{phone}</a>}
            {!email && <a href="mailto:hello@rufusdesign.co.uk" style={{ color: 'var(--orange)', fontFamily: 'var(--font-heading)', fontWeight: 700 }}>hello@rufusdesign.co.uk</a>}
          </div>
        </div>

        <div className={`reveal reveal-delay-2${visible ? ' visible' : ''}`}>
          {status === 'sent' ? (
            <div style={{ padding: '3rem', background: 'rgba(0,200,100,0.05)', border: '1px solid rgba(0,200,100,0.2)', textAlign: 'center' }}>
              <p style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>✓</p>
              <p style={{ color: '#00c864', fontFamily: 'var(--font-heading)', fontWeight: 700 }}>Message sent!</p>
              <p style={{ color: 'var(--muted)', marginTop: '0.5rem', fontSize: '0.875rem' }}>We&apos;ll be in touch within one working day.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {fields.map(field => (
                <div key={field.id} className="contact-form-group">
                  <label htmlFor={field.id}>{field.label}{field.required && ' *'}</label>
                  {field.field_type === 'textarea' ? (
                    <textarea
                      id={field.id}
                      placeholder={field.placeholder}
                      rows={5}
                      required={field.required}
                      value={values[field.id] || ''}
                      onChange={e => setValues(v => ({ ...v, [field.id]: e.target.value }))}
                    />
                  ) : field.field_type === 'select' ? (
                    <select
                      id={field.id}
                      required={field.required}
                      value={values[field.id] || ''}
                      onChange={e => setValues(v => ({ ...v, [field.id]: e.target.value }))}
                    >
                      <option value="">Select…</option>
                      {field.options?.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  ) : (
                    <input
                      id={field.id}
                      type={field.field_type}
                      placeholder={field.placeholder}
                      required={field.required}
                      value={values[field.id] || ''}
                      onChange={e => setValues(v => ({ ...v, [field.id]: e.target.value }))}
                    />
                  )}
                </div>
              ))}
              <button type="submit" className="btn-primary" disabled={status === 'sending'} style={{ width: '100%', textAlign: 'center', opacity: status === 'sending' ? 0.7 : 1 }}>
                {status === 'sending' ? 'Sending…' : status === 'error' ? 'Error — try again' : 'Send message'}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
