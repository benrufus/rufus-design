'use client'
import { useState, useEffect } from 'react'
import { createClient } from "@/lib/supabase/client"
import { useToast } from '@/components/ui/Toast'
import { SortableList } from '@/components/ui/SortableList'

interface Testimonial { id: string; name: string; role: string; company: string; quote: string; rating: number; active: boolean; sort_order: number }

export default function TestimonialsPage() {
  const supabase = createClient()
  const { show } = useToast()
  const [items, setItems] = useState<Testimonial[]>([])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    supabase.from('testimonials').select('*').order('sort_order').then(({ data }) => { if (data) setItems(data) })
  }, [])

  const save = async () => {
    setSaving(true)
    const updates = items.map((t, i) => supabase.from('testimonials').update({ ...t, sort_order: i }).eq('id', t.id))
    await Promise.all(updates)
    show('Testimonials saved!', 'success')
    setSaving(false)
  }

  const add = async () => {
    const { data } = await supabase.from('testimonials').insert({ name: 'New Client', role: '', company: '', quote: 'Add their testimonial here.', rating: 5, sort_order: items.length, active: true }).select().single()
    if (data) setItems(t => [...t, data])
  }

  const remove = async (id: string) => {
    await supabase.from('testimonials').delete().eq('id', id)
    setItems(t => t.filter(x => x.id !== id))
    show('Deleted', 'success')
  }

  const update = (id: string, field: keyof Testimonial, value: unknown) => {
    setItems(ts => ts.map(t => t.id === id ? { ...t, [field]: value } : t))
  }

  return (
    <div style={{ padding: '2.5rem', maxWidth: '900px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em' }}>⭐ Testimonials</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', marginTop: '0.25rem' }}>Drag to reorder. Toggle to show/hide.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-ghost" onClick={add}>+ Add testimonial</button>
          <button className="btn btn-orange" onClick={save} disabled={saving}>{saving ? 'Saving...' : '💾 Save'}</button>
        </div>
      </div>

      <SortableList
        items={items}
        onChange={setItems}
        renderItem={(t) => (
          <div className="card">
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '1rem' }}>
              <label className="toggle">
                <input type="checkbox" checked={t.active} onChange={e => update(t.id, 'active', e.target.checked)} />
                <span className="toggle-slider" />
              </label>
              <span style={{ fontSize: '0.75rem', color: t.active ? '#4ade80' : 'rgba(255,255,255,0.3)' }}>{t.active ? 'Visible' : 'Hidden'}</span>
              <div style={{ marginLeft: 'auto' }}>
                {'★★★★★'.split('').map((_, i) => (
                  <button key={i} type="button" onClick={() => update(t.id, 'rating', i + 1)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: i < t.rating ? '#ff8000' : 'rgba(255,255,255,0.2)', fontSize: '1.1rem' }}>★</button>
                ))}
              </div>
              <button className="btn btn-danger btn-sm" onClick={() => remove(t.id)}>Delete</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div className="field" style={{ margin: 0 }}>
                <label>Name</label>
                <input value={t.name} onChange={e => update(t.id, 'name', e.target.value)} />
              </div>
              <div className="field" style={{ margin: 0 }}>
                <label>Role</label>
                <input value={t.role || ''} onChange={e => update(t.id, 'role', e.target.value)} />
              </div>
              <div className="field" style={{ margin: 0 }}>
                <label>Company</label>
                <input value={t.company || ''} onChange={e => update(t.id, 'company', e.target.value)} />
              </div>
            </div>
            <div className="field" style={{ margin: 0 }}>
              <label>Quote</label>
              <textarea value={t.quote} onChange={e => update(t.id, 'quote', e.target.value)} rows={3} />
            </div>
          </div>
        )}
      />
    </div>
  )
}
