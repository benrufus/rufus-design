'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from "@/lib/supabase/client"
import { useToast } from '@/components/ui/Toast'

interface WorkItem { id: string; title: string; client: string; tags: string[]; featured: boolean; published: boolean; created_at: string }

export default function WorkPage() {
  const supabase = createClient()
  const { show } = useToast()
  const [items, setItems] = useState<WorkItem[]>([])

  useEffect(() => {
    supabase.from('work').select('id,title,client,tags,featured,published,created_at').order('sort_order').then(({ data }) => { if (data) setItems(data) })
  }, [])

  const toggleFeatured = async (id: string, featured: boolean) => {
    await supabase.from('work').update({ featured }).eq('id', id)
    setItems(w => w.map(x => x.id === id ? { ...x, featured } : x))
  }

  const togglePublished = async (id: string, published: boolean) => {
    await supabase.from('work').update({ published }).eq('id', id)
    setItems(w => w.map(x => x.id === id ? { ...x, published } : x))
  }

  const remove = async (id: string) => {
    if (!confirm('Delete this project?')) return
    await supabase.from('work').delete().eq('id', id)
    setItems(w => w.filter(x => x.id !== id))
    show('Project deleted', 'success')
  }

  return (
    <div style={{ padding: '2.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em' }}>💼 Work / Projects</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', marginTop: '0.25rem' }}>{items.length} projects</p>
        </div>
        <Link href="/760/work/new" className="btn btn-orange">+ New project</Link>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="table">
          <thead>
            <tr>
              <th>Project</th>
              <th>Client</th>
              <th>Services</th>
              <th>Featured</th>
              <th>Live</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 && (
              <tr><td colSpan={6} style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', padding: '3rem' }}>No projects yet — add your first one</td></tr>
            )}
            {items.map(item => (
              <tr key={item.id}>
                <td>
                  <Link href={`/760/work/${item.id}`} style={{ color: '#fff', textDecoration: 'none', fontWeight: 600 }}>{item.title}</Link>
                </td>
                <td style={{ color: 'rgba(255,255,255,0.5)' }}>{item.client || '—'}</td>
                <td>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                    {item.tags?.slice(0, 2).map(t => <span key={t} className="badge badge-orange">{t}</span>)}
                    {(item.tags?.length || 0) > 2 && <span className="badge badge-gray">+{item.tags.length - 2}</span>}
                  </div>
                </td>
                <td>
                  <label className="toggle">
                    <input type="checkbox" checked={item.featured} onChange={e => toggleFeatured(item.id, e.target.checked)} />
                    <span className="toggle-slider" />
                  </label>
                </td>
                <td>
                  <label className="toggle">
                    <input type="checkbox" checked={item.published} onChange={e => togglePublished(item.id, e.target.checked)} />
                    <span className="toggle-slider" />
                  </label>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Link href={`/760/work/${item.id}`} className="btn btn-ghost btn-sm">Edit</Link>
                    <button className="btn btn-danger btn-sm" onClick={() => remove(item.id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
