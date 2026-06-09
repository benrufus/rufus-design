'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/components/ui/Toast'

export default function CmsAboutPage() {
  const [page, setPage] = useState<any>({ intro: '', headline: '', body: '' })
  const [stats, setStats] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const supabase = createClient()
  const { toast } = useToast()

  useEffect(() => {
    Promise.all([
      supabase.from('about_page').select('*').single(),
      supabase.from('stats').select('*').order('order_index'),
    ]).then(([{ data: p }, { data: s }]) => {
      if (p) setPage(p)
      setStats(s || [])
      setLoading(false)
    })
  }, [])

  async function savePage() {
    setSaving(true)
    const { error } = await supabase.from('about_page').upsert({ id: page.id || 1, ...page })
    toast(error ? error.message : 'Saved!', error ? 'error' : 'success')
    setSaving(false)
  }

  async function saveStat(stat: any) {
    const { error } = await supabase.from('stats').update(stat).eq('id', stat.id)
    toast(error ? 'Error' : 'Stat saved', error ? 'error' : 'success')
  }

  async function addStat() {
    const { data } = await supabase.from('stats').insert({ value: '0', label: 'New stat', order_index: stats.length }).select().single()
    if (data) { setStats([...stats, data]); toast('Added') }
  }

  async function removeStat(id: string) {
    await supabase.from('stats').delete().eq('id', id)
    setStats(stats.filter(s => s.id !== id))
    toast('Deleted')
  }

  function updStat(id: string, k: string, v: string) {
    setStats(stats.map(s => s.id === id ? { ...s, [k]: v } : s))
  }

  if (loading) return <div style={{ color: 'var(--muted)' }}>Loading…</div>

  return (
    <>
      <div className="cms-header">
        <h1>About Page<span style={{ color: 'var(--orange)' }}>.</span></h1>
      </div>

      <div className="cms-card">
        <h2>Page intro (appears under hero)</h2>
        <div className="cms-field"><label>Intro text</label><textarea value={page.intro || ''} onChange={e => setPage((p: any) => ({ ...p, intro: e.target.value }))} rows={2} /></div>
        <div className="cms-field"><label>About headline</label><input value={page.headline || ''} onChange={e => setPage((p: any) => ({ ...p, headline: e.target.value }))} placeholder="A different kind of agency" /></div>
        <div className="cms-field" style={{ marginBottom: 0 }}><label>About body</label><textarea value={page.body || ''} onChange={e => setPage((p: any) => ({ ...p, body: e.target.value }))} rows={6} /></div>
      </div>
      <button className="cms-btn" onClick={savePage} disabled={saving} style={{ marginBottom: '1.5rem' }}>{saving ? 'Saving…' : 'Save page text'}</button>

      <div className="cms-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 style={{ margin: 0 }}>Stats</h2>
          <button className="cms-btn" onClick={addStat} style={{ padding: '0.4rem 1rem', fontSize: '0.7rem' }}>+ Add</button>
        </div>
        {stats.map(stat => (
          <div key={stat.id} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr auto', gap: '0.75rem', marginBottom: '0.75rem', alignItems: 'center' }}>
            <input value={stat.value || ''} onChange={e => updStat(stat.id, 'value', e.target.value)} placeholder="17+" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '0.6rem', fontFamily: 'var(--font-body)' }} />
            <input value={stat.label || ''} onChange={e => updStat(stat.id, 'label', e.target.value)} placeholder="Years in business" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '0.6rem', fontFamily: 'var(--font-body)' }} />
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={() => saveStat(stat)} className="cms-btn" style={{ padding: '0.4rem 0.875rem', fontSize: '0.7rem' }}>Save</button>
              <button onClick={() => removeStat(stat.id)} className="cms-btn-danger">✕</button>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
