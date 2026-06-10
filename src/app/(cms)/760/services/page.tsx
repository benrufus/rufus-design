'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/components/ui/Toast'

interface ServicePage {
  id: string
  title: string
  slug: string
  excerpt: string
  published: boolean
  sort_order: number
}

export default function ServicesEditor() {
  const supabase = createClient()
  const { show } = useToast()
  const [items, setItems] = useState<ServicePage[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('services_pages').select('*').order('sort_order')
      .then(({ data }) => { setItems(data || []); setLoading(false) })
  }, [])

  async function togglePublished(id: string, published: boolean) {
    await supabase.from('services_pages').update({ published }).eq('id', id)
    setItems(i => i.map(s => s.id === id ? { ...s, published } : s))
  }

  async function remove(id: string) {
    if (!confirm('Delete this service page?')) return
    await supabase.from('services_pages').delete().eq('id', id)
    setItems(i => i.filter(s => s.id !== id))
    show('Deleted', 'success')
  }

  async function addNew() {
    const title = prompt('Service title?')
    if (!title) return
    const slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    const { data, error } = await supabase.from('services_pages')
      .insert({ title, slug, published: false, sort_order: items.length })
      .select().single()
    if (error) { show(error.message, 'error'); return }
    setItems(i => [...i, data])
    show('Created — click to edit', 'success')
  }

  if (loading) return <div style={{ padding: '2.5rem', color: 'var(--muted)' }}>Loading...</div>

  return (
    <div style={{ padding: '2.5rem', maxWidth: '900px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
            🛠 Services<span style={{ color: 'var(--orange)' }}>.</span>
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
            Manage individual service pages
          </p>
        </div>
        <button className="btn btn-orange" onClick={addNew}>+ Add service</button>
      </div>

      {items.length === 0 ? (
        <div style={{ padding: '3rem', textAlign: 'center', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '8px', color: 'var(--muted)' }}>
          No service pages yet. Click "+ Add service" to create one.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {items.map(s => (
            <div key={s.id} className="card-sm" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontWeight: 600, fontSize: '0.9rem', color: '#fff' }}>{s.title}</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '0.1rem' }}>/services/{s.slug}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
                <label className="toggle" title={s.published ? 'Published' : 'Draft'}>
                  <input type="checkbox" checked={s.published}
                    onChange={e => togglePublished(s.id, e.target.checked)} />
                  <span className="toggle-slider" />
                </label>
                <Link href={`/760/services/${s.id}`} className="btn btn-ghost btn-sm">Edit</Link>
                <a href={`/services/${s.slug}`} target="_blank" className="btn btn-ghost btn-sm">↗</a>
                <button className="btn btn-danger btn-sm" onClick={() => remove(s.id)}>✕</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
