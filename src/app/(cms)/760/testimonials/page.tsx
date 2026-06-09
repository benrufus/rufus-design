'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/components/ui/Toast'
import SortableList from '@/components/ui/SortableList'

export default function CmsTestimonialsPage() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  const { toast } = useToast()

  useEffect(() => {
    supabase.from('testimonials').select('*').order('order_index')
      .then(({ data }) => { setItems(data || []); setLoading(false) })
  }, [])

  async function save(item: any) {
    const { error } = await supabase.from('testimonials').update(item).eq('id', item.id)
    toast(error ? error.message : 'Saved', error ? 'error' : 'success')
  }

  async function add() {
    const { data } = await supabase.from('testimonials').insert({ quote: 'New testimonial…', author: 'Client Name', published: true, stars: 5, order_index: items.length }).select().single()
    if (data) { setItems([...items, data]); toast('Added') }
  }

  async function remove(id: string) {
    if (!confirm('Delete?')) return
    await supabase.from('testimonials').delete().eq('id', id)
    setItems(items.filter(i => i.id !== id))
    toast('Deleted')
  }

  function upd(id: string, k: string, v: any) {
    setItems(items.map(i => i.id === id ? { ...i, [k]: v } : i))
  }

  if (loading) return <div style={{ color: 'var(--muted)' }}>Loading…</div>

  return (
    <>
      <div className="cms-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div><h1>Testimonials<span style={{ color: 'var(--orange)' }}>.</span></h1><p>Drag to reorder</p></div>
        <button className="cms-btn" onClick={add}>+ Add testimonial</button>
      </div>

      <SortableList
        items={items}
        onReorder={async (reordered) => {
          setItems(reordered)
          await Promise.all(reordered.map((item, i) => supabase.from('testimonials').update({ order_index: i }).eq('id', item.id)))
        }}
        renderItem={(item) => (
          <div className="cms-card" style={{ marginBottom: '0.75rem', cursor: 'grab' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>⠿ Drag to reorder</span>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--muted)', cursor: 'pointer' }}>
                  <input type="checkbox" checked={!!item.published} onChange={e => { upd(item.id, 'published', e.target.checked); save({ ...item, published: e.target.checked }) }} />
                  Visible
                </label>
                <button onClick={() => remove(item.id)} className="cms-btn-danger">✕</button>
              </div>
            </div>
            <div className="cms-field">
              <label>Stars (1–5)</label>
              <select value={item.stars || 5} onChange={e => upd(item.id, 'stars', Number(e.target.value))}>
                {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} ★</option>)}
              </select>
            </div>
            <div className="cms-field">
              <label>Quote</label>
              <textarea value={item.quote || ''} onChange={e => upd(item.id, 'quote', e.target.value)} rows={3} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div className="cms-field" style={{ marginBottom: 0 }}><label>Author name</label><input value={item.author || ''} onChange={e => upd(item.id, 'author', e.target.value)} /></div>
              <div className="cms-field" style={{ marginBottom: 0 }}><label>Role / company</label><input value={item.role || ''} onChange={e => upd(item.id, 'role', e.target.value)} /></div>
            </div>
            <div style={{ marginTop: '1rem' }}>
              <button onClick={() => save(item)} className="cms-btn" style={{ padding: '0.5rem 1.25rem', fontSize: '0.7rem' }}>Save</button>
            </div>
          </div>
        )}
      />
    </>
  )
}
