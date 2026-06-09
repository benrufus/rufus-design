'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/components/ui/Toast'
import ImageUpload from '@/components/ui/ImageUpload'

const PAGES = [
  { key: 'home', label: 'Home', path: '/' },
  { key: 'work', label: 'Work', path: '/work' },
  { key: 'news', label: 'News / Blog', path: '/news' },
  { key: 'about', label: 'About', path: '/about' },
  { key: 'contact', label: 'Contact', path: '/contact' },
  { key: 'where-we-operate', label: 'Where We Operate', path: '/where-we-operate' },
]

export default function CmsPagesPage() {
  const [selected, setSelected] = useState('home')
  const [records, setRecords] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const supabase = createClient()
  const { toast } = useToast()

  useEffect(() => {
    supabase.from('page_seo').select('*')
      .then(({ data }) => {
        const map: Record<string, any> = {}
        ;(data || []).forEach((r: any) => { map[r.page] = r })
        setRecords(map)
        setLoading(false)
      })
  }, [])

  const current = records[selected] || { page: selected, title: '', description: '', og_image: '' }

  function upd(k: string, v: string) {
    setRecords(r => ({ ...r, [selected]: { ...current, [k]: v } }))
  }

  async function save() {
    setSaving(true)
    const { error } = await supabase.from('page_seo').upsert({ ...current, page: selected })
    toast(error ? error.message : 'Saved!', error ? 'error' : 'success')
    setSaving(false)
  }

  if (loading) return <div style={{ color: 'var(--muted)' }}>Loading…</div>

  return (
    <>
      <div className="cms-header"><h1>Pages & SEO<span style={{ color: 'var(--orange)' }}>.</span></h1><p>Edit meta titles, descriptions and OG images per page</p></div>

      <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '1.5rem', alignItems: 'start' }}>
        <div className="cms-card" style={{ padding: '0.5rem' }}>
          {PAGES.map(p => (
            <button key={p.key} onClick={() => setSelected(p.key)}
              style={{ display: 'block', width: '100%', textAlign: 'left', padding: '0.6rem 0.75rem', background: selected === p.key ? 'rgba(255,128,0,0.1)' : 'transparent', color: selected === p.key ? 'var(--orange)' : 'rgba(255,255,255,0.6)', border: 'none', fontSize: '0.875rem', cursor: 'pointer' }}>
              {p.label}
            </button>
          ))}
        </div>

        <div>
          <div className="cms-card">
            <h2>{PAGES.find(p => p.key === selected)?.label} — SEO</h2>
            <div className="cms-field"><label>Meta title</label><input value={current.title || ''} onChange={e => upd('title', e.target.value)} placeholder="Page title | Rufus Design" /></div>
            <div className="cms-field"><label>Meta description</label><textarea value={current.description || ''} onChange={e => upd('description', e.target.value)} rows={3} maxLength={160} placeholder="160 characters max…" /></div>
            <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginBottom: '1rem', marginTop: '-0.75rem' }}>{(current.description || '').length}/160 characters</div>
            <ImageUpload value={current.og_image} onChange={url => upd('og_image', url)} label="OG image (1200×630px)" />
          </div>

          {/* Google preview */}
          <div className="cms-card">
            <h2>Google preview</h2>
            <div style={{ background: '#fff', padding: '1rem', borderRadius: '4px' }}>
              <div style={{ fontSize: '0.75rem', color: '#202124', marginBottom: '0.2rem', fontFamily: 'Arial, sans-serif' }}>
                rufusdesign.co.uk{PAGES.find(p => p.key === selected)?.path}
              </div>
              <div style={{ fontSize: '1.1rem', color: '#1a0dab', fontFamily: 'Arial, sans-serif', marginBottom: '0.2rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {current.title || 'Page Title | Rufus Design'}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#4d5156', fontFamily: 'Arial, sans-serif', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {current.description || 'Meta description will appear here…'}
              </div>
            </div>
          </div>

          <button className="cms-btn" onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
        </div>
      </div>
    </>
  )
}
