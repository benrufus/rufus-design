'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/components/ui/Toast'
import ImageUpload from '@/components/ui/ImageUpload'

export default function CmsLocationsPage() {
  const [items, setItems] = useState<any[]>([])
  const [selected, setSelected] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const supabase = createClient()
  const { toast } = useToast()

  useEffect(() => {
    supabase.from('locations').select('*').order('town')
      .then(({ data }) => { setItems(data || []); setLoading(false) })
  }, [])

  function upd(k: string, v: any) { setSelected((s: any) => ({ ...s, [k]: v })) }

  async function save() {
    setSaving(true)
    const { error } = selected.id
      ? await supabase.from('locations').update(selected).eq('id', selected.id)
      : await supabase.from('locations').insert(selected)
    if (!error) {
      const { data } = await supabase.from('locations').select('*').order('town')
      setItems(data || [])
      toast('Saved!')
    } else { toast(error.message, 'error') }
    setSaving(false)
  }

  async function add() {
    setSelected({ town: 'New Town', county: 'Hertfordshire', slug: `new-town-${Date.now()}`, published: false })
  }

  async function remove(id: string) {
    if (!confirm('Delete this location?')) return
    await supabase.from('locations').delete().eq('id', id)
    setItems(items.filter(i => i.id !== id))
    if (selected?.id === id) setSelected(null)
    toast('Deleted')
  }

  if (loading) return <div style={{ color: 'var(--muted)' }}>Loading…</div>

  return (
    <>
      <div className="cms-header">
        <h1>Where We Operate<span style={{ color: 'var(--orange)' }}>.</span></h1>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '1.5rem', alignItems: 'start' }}>
        <div>
          <div className="cms-card" style={{ padding: '0.75rem' }}>
            <button className="cms-btn" onClick={add} style={{ width: '100%', marginBottom: '0.75rem', fontSize: '0.7rem' }}>+ Add location</button>
            {items.map(loc => (
              <div key={loc.id} onClick={() => setSelected(loc)}
                style={{ padding: '0.6rem 0.75rem', cursor: 'pointer', borderRadius: '2px', background: selected?.id === loc.id ? 'rgba(255,128,0,0.1)' : 'transparent', color: selected?.id === loc.id ? 'var(--orange)' : 'rgba(255,255,255,0.6)', fontSize: '0.875rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>{loc.town}</span>
                <button onClick={e => { e.stopPropagation(); remove(loc.id) }} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.2)', fontSize: '0.8rem' }}>✕</button>
              </div>
            ))}
          </div>
        </div>

        {selected ? (
          <div>
            <div className="cms-card">
              <h2>Details</h2>
              <div className="cms-field"><label>Town / City</label><input value={selected.town || ''} onChange={e => upd('town', e.target.value)} /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="cms-field"><label>County</label><input value={selected.county || ''} onChange={e => upd('county', e.target.value)} /></div>
                <div className="cms-field"><label>Slug</label><input value={selected.slug || ''} onChange={e => upd('slug', e.target.value)} /></div>
              </div>
              <div className="cms-field"><label>Intro text</label><textarea value={selected.intro || ''} onChange={e => upd('intro', e.target.value)} rows={3} /></div>
              <div className="cms-field"><label>Body content (HTML)</label><textarea value={selected.body || ''} onChange={e => upd('body', e.target.value)} rows={8} style={{ fontFamily: 'monospace', fontSize: '0.85rem' }} placeholder="<h2>Web Design in {town}</h2><p>…</p>" /></div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', marginBottom: '1rem' }}>
                <input type="checkbox" checked={!!selected.published} onChange={e => upd('published', e.target.checked)} />
                <span style={{ color: '#fff', fontSize: '0.875rem' }}>Published</span>
              </label>
            </div>
            <div className="cms-card">
              <ImageUpload value={selected.image_url} onChange={url => upd('image_url', url)} label="Hero image" />
            </div>
            <div className="cms-card">
              <h2>SEO</h2>
              <div className="cms-field"><label>Meta title</label><input value={selected.meta_title || ''} onChange={e => upd('meta_title', e.target.value)} placeholder={`Web Design ${selected.town} | Rufus Design`} /></div>
              <div className="cms-field" style={{ marginBottom: 0 }}><label>Meta description</label><textarea value={selected.meta_description || ''} onChange={e => upd('meta_description', e.target.value)} rows={2} /></div>
            </div>
            <button className="cms-btn" onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save location'}</button>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px', color: 'var(--muted)' }}>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📍</p>
              <p>Select or add a location</p>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
