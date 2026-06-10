'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Submission {
  id: string
  data: Record<string, string>
  created_at: string
}

export default function SubmissionsPage() {
  const supabase = createClient()
  const [items, setItems] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Submission | null>(null)

  useEffect(() => {
    supabase.from('contact_submissions')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => { setItems(data || []); setLoading(false) })
  }, [])

  async function remove(id: string) {
    if (!confirm('Delete this submission?')) return
    await supabase.from('contact_submissions').delete().eq('id', id)
    setItems(i => i.filter(s => s.id !== id))
    if (selected?.id === id) setSelected(null)
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('en-GB', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    })
  }

  if (loading) return <div style={{ padding: '2.5rem', color: 'rgba(255,255,255,0.4)' }}>Loading...</div>

  return (
    <div style={{ padding: '2.5rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
          📬 Enquiries<span style={{ color: 'var(--orange)' }}>.</span>
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
          {items.length} submission{items.length !== 1 ? 's' : ''} total
        </p>
      </div>

      {items.length === 0 ? (
        <div style={{ padding: '3rem', textAlign: 'center', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '8px', color: 'rgba(255,255,255,0.3)' }}>
          No enquiries yet.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 1fr' : '1fr', gap: '1.5rem', alignItems: 'start' }}>
          {/* List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {items.map(item => {
              const name = item.data?.['First name']
                ? `${item.data['First name']} ${item.data['Last name'] || ''}`.trim()
                : item.data?.firstName
                ? `${item.data.firstName} ${item.data.lastName || ''}`.trim()
                : 'Unknown'
              const email = item.data?.['Email address'] || item.data?.email || item.data?.Email || '—'
              const company = item.data?.Company || item.data?.company || ''
              return (
                <div
                  key={item.id}
                  onClick={() => setSelected(selected?.id === item.id ? null : item)}
                  style={{
                    padding: '1rem 1.25rem',
                    background: selected?.id === item.id ? 'rgba(255,128,0,0.1)' : 'rgba(255,255,255,0.03)',
                    border: selected?.id === item.id ? '1px solid rgba(255,128,0,0.3)' : '1px solid rgba(255,255,255,0.07)',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '1rem',
                  }}
                  onMouseEnter={e => { if (selected?.id !== item.id) (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.15)' }}
                  onMouseLeave={e => { if (selected?.id !== item.id) (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)' }}
                >
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontWeight: 600, fontSize: '0.9rem', color: '#fff' }}>{name}</p>
                    <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.1rem' }}>
                      {email}{company ? ` · ${company}` : ''}
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
                    <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)' }}>{formatDate(item.created_at)}</p>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={e => { e.stopPropagation(); remove(item.id) }}
                    >✕</button>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Detail panel */}
          {selected && (
            <div className="card" style={{ position: 'sticky', top: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontWeight: 700, fontSize: '1rem', color: '#fff' }}>Enquiry detail</h2>
                <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '1rem' }}>✕</button>
              </div>
              <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', marginBottom: '1.5rem' }}>
                Received {formatDate(selected.created_at)}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {Object.entries(selected.data).map(([key, value]) => {
                  if (!value || key === 'recaptchaToken' || key === '_honey') return null
                  return (
                    <div key={key}>
                      <p style={{ fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: '0.3rem' }}>{key}</p>
                      <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.85)', lineHeight: 1.6, wordBreak: 'break-word' }}>{String(value)}</p>
                    </div>
                  )
                })}
              </div>
              {selected.data?.['Email address'] || selected.data?.email ? (
                <a
                  href={`mailto:${selected.data['Email address'] || selected.data.email}`}
                  className="btn btn-orange"
                  style={{ marginTop: '1.5rem', display: 'inline-flex' }}
                >
                  Reply by email
                </a>
              ) : null}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
