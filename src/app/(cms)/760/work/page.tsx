'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/components/ui/Toast'

export default function CmsWorkPage() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  const { toast } = useToast()

  useEffect(() => {
    supabase.from('work').select('*').order('order_index').then(({ data }) => {
      setItems(data || [])
      setLoading(false)
    })
  }, [])

  async function toggle(id: string, field: 'published' | 'featured', val: boolean) {
    await supabase.from('work').update({ [field]: val }).eq('id', id)
    setItems(items.map(i => i.id === id ? { ...i, [field]: val } : i))
    toast('Updated')
  }

  async function addNew() {
    const slug = `project-${Date.now()}`
    const { data } = await supabase.from('work').insert({ title: 'New Project', slug, published: false, order_index: items.length }).select().single()
    if (data) { setItems([...items, data]); toast('Created') }
  }

  async function remove(id: string) {
    if (!confirm('Delete this project?')) return
    await supabase.from('work').delete().eq('id', id)
    setItems(items.filter(i => i.id !== id))
    toast('Deleted')
  }

  if (loading) return <div style={{ color: 'var(--muted)' }}>Loading…</div>

  return (
    <>
      <div className="cms-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h1>Work / Projects<span style={{ color: 'var(--orange)' }}>.</span></h1>
          <p>{items.length} projects</p>
        </div>
        <button className="cms-btn" onClick={addNew}>+ New project</button>
      </div>

      {items.map(item => (
        <div key={item.id} className="cms-list-item">
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, color: '#fff', marginBottom: '0.2rem' }}>{item.title}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{item.client || '—'} · /{item.slug}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--muted)', cursor: 'pointer' }}>
              <input type="checkbox" checked={!!item.featured} onChange={e => toggle(item.id, 'featured', e.target.checked)} />
              Featured
            </label>
            <span className={`cms-badge ${item.published ? 'cms-badge-published' : 'cms-badge-draft'}`}>{item.published ? 'Live' : 'Draft'}</span>
            <button onClick={() => toggle(item.id, 'published', !item.published)} className="cms-btn-secondary" style={{ padding: '0.4rem 0.875rem', fontSize: '0.7rem' }}>
              {item.published ? 'Unpublish' : 'Publish'}
            </button>
            <Link href={`/760/work/${item.id}`} className="cms-btn" style={{ padding: '0.4rem 0.875rem', fontSize: '0.7rem', textDecoration: 'none' }}>Edit</Link>
            <button onClick={() => remove(item.id)} className="cms-btn-danger">✕</button>
          </div>
        </div>
      ))}

      {!items.length && <div style={{ color: 'var(--muted)', padding: '3rem', textAlign: 'center' }}>No projects yet. Add one above.</div>}
    </>
  )
}
