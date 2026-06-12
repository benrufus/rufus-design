'use client'
import { useState, useEffect } from 'react'
import { createClient } from "@/lib/supabase/client"
import { useToast } from '@/components/ui/Toast'
import ImageUpload from '@/components/ui/ImageUpload'
import RichTextEditor from '@/components/ui/RichTextEditor'

interface Location { id: string; town: string; slug: string; county: string; hero_image: string; intro: string; body: string; services: string[]; featured: boolean; meta_title: string; meta_description: string }

const ALL_SERVICES = ['Web Design', 'Web Development', 'SEO', 'PPC', 'Managed Hosting', 'Branding', 'Data Analytics']
const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

export default function LocationsPage() {
  const supabase = createClient()
  const { show } = useToast()
  const [locations, setLocations] = useState<Location[]>([])
  const [editing, setEditing] = useState<Location | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    supabase.from('locations').select('*').order('sort_order').then(({ data }) => { if (data) setLocations(data) })
  }, [])

  const save = async () => {
    if (!editing) return
    setSaving(true)
    if (editing.id.startsWith('new-')) {
      const { data, error } = await supabase.from('locations').insert({ ...editing, id: undefined }).select().single()
      if (error) { show('Error: ' + error.message, 'error'); setSaving(false); return }
      setLocations(ls => [...ls.filter(l => l.id !== editing.id), data])
      setEditing(data)
      show('Location created!', 'success')
    } else {
      const { error } = await supabase.from('locations').update(editing).eq('id', editing.id)
      setLocations(ls => ls.map(l => l.id === editing.id ? editing : l))
      show(error ? 'Error saving' : 'Saved!', error ? 'error' : 'success')
    }
    setSaving(false)
  }

  const remove = async (id: string) => {
    if (!confirm('Delete this location?')) return
    await supabase.from('locations').delete().eq('id', id)
    setLocations(ls => ls.filter(l => l.id !== id))
    if (editing?.id === id) setEditing(null)
    show('Deleted', 'success')
  }

  const addLocation = () => {
    const loc: Location = { id: `new-${Date.now()}`, town: 'New Town', slug: 'new-town', county: 'Hertfordshire', hero_image: '', intro: '', body: '', services: [], featured: true, meta_title: '', meta_description: '' }
    setLocations(ls => [...ls, loc])
    setEditing(loc)
  }

  const set = (f: keyof Location, v: unknown) => setEditing(e => e ? { ...e, [f]: v } : e)
  const toggleService = (svc: string) => set('services', editing?.services?.includes(svc) ? editing.services.filter(s => s !== svc) : [...(editing?.services || []), svc])

  return (
    <div style={{ padding: '2.5rem', display: 'grid', gridTemplateColumns: '240px 1fr', gap: '2rem', alignItems: 'start', maxWidth: '1100px' }}>
      {/* Location list */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h1 style={{ fontSize: '1.1rem', fontWeight: 800 }}>📍 Locations</h1>
          <button className="btn btn-ghost btn-sm" onClick={addLocation}>+</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          {locations.map(loc => (
            <button key={loc.id} onClick={() => setEditing(loc)}
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem 0.875rem', background: editing?.id === loc.id ? 'rgba(255,128,0,0.12)' : 'rgba(255,255,255,0.03)', border: editing?.id === loc.id ? '1px solid rgba(255,128,0,0.3)' : '1px solid transparent', borderRadius: '6px', cursor: 'pointer', textAlign: 'left', width: '100%', transition: 'all 0.15s' }}>
              <span style={{ fontSize: '0.875rem', color: editing?.id === loc.id ? '#ff8000' : '#fff', fontWeight: editing?.id === loc.id ? 600 : 400 }}>{loc.town}</span>
              <button type="button" onClick={e => { e.stopPropagation(); remove(loc.id) }} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.25)', cursor: 'pointer', fontSize: '0.9rem' }}>✕</button>
            </button>
          ))}
        </div>
      </div>

      {/* Editor */}
      {editing ? (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{editing.town}</h2>
            <button className="btn btn-orange" onClick={save} disabled={saving}>{saving ? 'Saving...' : '💾 Save'}</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
            <div className="field"><label>Town name</label><input value={editing.town} onChange={e => { set('town', e.target.value); set('slug', slugify(e.target.value)) }} /></div>
            <div className="field"><label>Slug</label><input value={editing.slug} onChange={e => set('slug', e.target.value)} /></div>
            <div className="field"><label>County</label><input value={editing.county || ''} onChange={e => set('county', e.target.value)} /></div>
          </div>
          <div className="field"><label>Intro paragraph</label><textarea value={editing.intro || ''} onChange={e => set('intro', e.target.value)} rows={3} /></div>
          <div className="field">
            <label>Services offered</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {ALL_SERVICES.map(svc => (
                <button type="button" key={svc} onClick={() => toggleService(svc)}
                  style={{ padding: '0.3em 0.75em', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s', background: editing.services?.includes(svc) ? 'rgba(255,128,0,0.2)' : 'rgba(255,255,255,0.05)', border: editing.services?.includes(svc) ? '1px solid rgba(255,128,0,0.5)' : '1px solid rgba(255,255,255,0.1)', color: editing.services?.includes(svc) ? '#ff8000' : 'rgba(255,255,255,0.5)' }}>
                  {svc}
                </button>
              ))}
            </div>
          </div>
          <ImageUpload value={editing.hero_image || ''} onChange={url => set('hero_image', url)} folder="locations" label="Hero image" />
          <div className="field">
  <label>Page body (HTML)</label>
  <textarea
    value={editing.body || ''}
    onChange={e => set('body', e.target.value)}
    rows={15}
    style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}
    placeholder="<h2>Section heading</h2>&#10;<p>Your paragraph text here...</p>"
  />
</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '0.5rem' }}>
            <div className="field"><label>SEO title</label><input value={editing.meta_title || ''} onChange={e => set('meta_title', e.target.value)} /></div>
            <div className="field"><label>SEO description</label><input value={editing.meta_description || ''} onChange={e => set('meta_description', e.target.value)} /></div>
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>
            <label className="toggle"><input type="checkbox" checked={editing.featured} onChange={e => set('featured', e.target.checked)} /><span className="toggle-slider" /></label>
            Show on overview page
          </label>
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px', color: 'rgba(255,255,255,0.3)', fontSize: '0.875rem' }}>
          Select a location to edit
        </div>
      )}
    </div>
  )
}
