'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/components/ui/Toast'

interface Redirect {
  id: string
  from: string
  to: string
  permanent: boolean
}

export default function RedirectsPage() {
  const [items, setItems] = useState<Redirect[]>([])
  const [loading, setLoading] = useState(true)
  const [newFrom, setNewFrom] = useState('')
  const [newTo, setNewTo] = useState('')
  const [permanent, setPermanent] = useState(true)
  const supabase = createClient()
  const { show } = useToast()

  useEffect(() => {
    supabase.from('redirects').select('*').order('created_at', { ascending: false })
      .then(({ data }) => { setItems(data || []); setLoading(false) })
  }, [])

  async function add() {
    if (!newFrom || !newTo) return
    const from = newFrom.startsWith('/') ? newFrom : '/' + newFrom
    const { data, error } = await supabase.from('redirects')
      .insert({ from, to: newTo, permanent })
      .select().single()
    if (error) { show(error.message, 'error'); return }
    setItems(i => [data, ...i])
    setNewFrom('')
    setNewTo('')
    show('Redirect added', 'success')
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

      <div className="card" style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '1.25rem', color: '#fff' }}>Add redirect</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto auto', gap: '0.75rem', alignItems: 'end' }}>
          <div className="field" style={{ margin: 0 }}>
            <label>From</label>
            <input value={newFrom} onChange={e => setNewFrom(e.target.value)} placeholder="/old-page" onKeyDown={e => e.key === 'Enter' && add()} />
          </div>
          <div className="field" style={{ margin: 0 }}>
            <label>To</label>
            <input value={newTo} onChange={e => setNewTo(e.target.value)} placeholder="/new-page" onKeyDown={e => e.key === 'Enter' && add()} />
          </div>
          <div className="field" style={{ margin: 0 }}>
            <label>Type</label>
            <select value={permanent ? '301' : '302'} onChange={e => setPermanent(e.target.value === '301')}>
              <option value="301">301 Permanent</option>
              <option value="302">302 Temporary</option>
            </select>
          </div>
          <button className="btn btn-orange" onClick={add}>Add</button>
        </div>
      </div>

      {items.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'rgba(255,255,255,0.3)' }}>
          No redirects yet.
        </div>
      )}

      {items.map(r => (
        <div key={r.id} className="card-sm" style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr auto auto', gap: '0.75rem', alignItems: 'center', marginBottom: '0.5rem' }}>
          <code style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', fontFamily: 'monospace' }}>{r.from}</code>
          <span style={{ color: 'var(--orange)' }}>→</span>
          <code style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', fontFamily: 'monospace' }}>{r.to}</code>
          <span styl
