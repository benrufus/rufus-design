'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/components/ui/Toast'

interface Redirect {
  id: string
  source: string
  destination: string
  type: number
  active: boolean
}

export default function RedirectsPage() {
  const [items, setItems] = useState<Redirect[]>([])
  const [loading, setLoading] = useState(true)
  const [newSource, setNewSource] = useState('')
  const [newDest, setNewDest] = useState('')
  const [newType, setNewType] = useState(301)
  const supabase = createClient()
  const { show } = useToast()

  useEffect(() => {
    supabase.from('redirects').select('*').order('created_at', { ascending: false })
      .then(({ data }) => { setItems(data || []); setLoading(false) })
  }, [])

  async function add() {
    if (!newSource || !newDest) return
    const src = newSource.startsWith('/') ? newSource : '/' + newSource
    const dest = newDest.startsWith('/') ? newDest : newDest
    const { data, error } = await supabase.from('redirects')
      .insert({ source: src, destination: dest, type: newType, active: true })
      .select().single()
    if (error) { show(error.message, 'error'); return }
    setItems(i => [data, ...i])
    setNewSource('')
    setNewDest('')
    show('Redirect added', 'success')
  }

  async function toggle(id: string, active: boolean) {
    await supabase.from('redirects').update({ active }).eq('id', id)
    setItems(i => i.map(r => r.id === id ? { ...r, active } : r))
  }

  async function remove(id: string) {
    if (!confirm('Delete this redirect?')) return
    await supabase.from('redirects').delete().eq('id', id)
    setItems(i => i.filter(r => r.id !== id))
    show('Deleted', 'success')
  }

  if (loading) return <div style={{ padding: '2.5rem', color: 'rgba(255,255,255,0.4)' }}>Loading...</div>

  return (
    <div style={{ padding: '2.5rem', maxWidth: '900px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.25rem' }}>
          Redirects<span style={{ color: '#ff8000' }}>.</span>
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>
          Changes apply instantly — no deployment needed.
        </p>
      </div>

      {/* Add new */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '1.25rem', color: '#fff' }}>Add redirect</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto auto', gap: '0.75rem', alignItems: 'end' }}>
          <div className="field" style={{ margin: 0 }}>
            <label>From (source)</label>
            <input
              value={newSource}
              onChange={e => setNewSource(e.target.value)}
              placeholder="/old-page"
              onKeyDown={e => e.key === 'Enter' && add()}
            />
          </div>
          <div className="field" style={{ margin: 0 }}>
            <label>To (destination)</label>
            <input
              value={newDest}
              onChange={e => setNewDest(e.target.value)}
              placeholder="/new-page"
              onKeyDown={e => e.key === 'Enter' && add()}
            />
          </div>
          <div className="field" style={{ margin: 0 }}>
            <label>Type</label>
            <select value={newType} onChange={e => setNewType(Number(e.target.value))}>
              <option value={301}>301 Permanent</option>
              <option value={302}>302 Temporary</option>
            </select>
          </div>
          <button className="btn btn-orange" onClick={add}>Add</button>
        </div>
      </div>

      {/* List */}
      {items.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'rgba(255,255,255,0.3)' }}>
          No redirects yet. Add one above.
        </div>
      )}

      {items.map(r => (
        <div key={r.id} className="card-sm" style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr auto auto auto',
          gap: '0.75rem',
          alignItems: 'center',
          marginBottom: '0.5rem',
          opacity: r.active ? 1 : 0.5,
        }}>
          <code style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', fontFamily: 'monospace' }}>{r.source}</code>
          <span style={{ color: 'var(--orange)', fontSize: '0.9rem' }}>→</span>
          <code style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', fontFamily: 'monospace' }}>{r.destination}</code>
          <span style={{ fontSize: '0.7rem', background: 'rgba(255,128,0,0.1)', color: 'var(--orange)', padding: '0.2em 0.5em', whiteSpace: 'nowrap' }}>
            {r.type}
          </span>
          <label className="toggle" title={r.active ? 'Active' : 'Inactive'}>
            <input type="checkbox" checked={r.active} onChange={e => toggle(r.id, e.target.checked)} />
            <span className="toggle-slider" />
          </label>
          <button className="btn btn-danger btn-sm" onClick={() => remove(r.id)}>✕</button>
        </div>
      ))}
    </div>
  )
}
