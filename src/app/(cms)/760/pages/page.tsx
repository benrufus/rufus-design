'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/components/ui/Toast'

interface PageSeo {
  id: string
  page_key: string
  page_label: string
  title: string
  description: string
  og_image: string
  updated_at: string
}

export default function PagesEditor() {
  const supabase = createClient()
  const { show } = useToast()
  const [pages, setPages] = useState<PageSeo[]>([])
  const [selected, setSelected] = useState<PageSeo | null>(null)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('page_seo').select('*').order('page_label')
      .then(({ data }) => {
        setPages(data || [])
        if (data?.length) setSelected(data[0])
        setLoading(false)
      })
  }, [])

  const save = async () => {
    if (!selected) return
    setSaving(true)
    const { error } = await supabase.from('page_seo').update({
      title: selected.title,
      description: selected.description,
      og_image: selected.og_image,
      updated_at: new Date().toISOString(),
    }).eq('id', selected.id)
    if (error) show(error.message, 'error')
    else {
      setPages(ps => ps.map(p => p.id === selected.id ? selected : p))
      show('SEO saved!', 'success')
    }
    setSaving(false)
  }

  if (loading) return <div style={{ padding: '2.5rem', color: 'rgba(255,255,255,0.4)' }}>Loading...</div>

  return (
    <div style={{ padding: '2.5rem', maxWidth: '900px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em' }}>📄 Pages & SEO</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', marginTop: '0.25rem' }}>Edit SEO metadata for each page</p>
        </div>
        <button className="btn btn-orange" onClick={save} disabled={saving || !selected}>
          {saving ? 'Saving...' : '💾 Save'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '2rem', alignItems: 'start' }}>
        {/* Page list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          {pages.map(page => (
            <button
              key={page.id}
              onClick={() => setSelected(page)}
              style={{
                padding: '0.7rem 1rem',
                background: selected?.id === page.id ? 'rgba(255,128,0,0.15)' : 'rgba(255,255,255,0.03)',
                border: selected?.id === page.id ? '1px solid rgba(255,128,0,0.3)' : '1px solid rgba(255,255,255,0.07)',
                color: selected?.id === page.id ? '#ff8000' : 'rgba(255,255,255,0.6)',
                borderRadius: '6px', textAlign: 'left', cursor: 'pointer',
                fontSize: '0.875rem', fontWeight: selected?.id === page.id ? 600 : 400,
                transition: 'all 0.15s',
              }}
            >
              {page.page_label}
            </button>
          ))}
          {pages.length === 0 && (
            <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.3)' }}>
              No pages found. Run the seed SQL from setup.
            </p>
          )}
        </div>

        {/* SEO editor */}
        {selected && (
          <div>
            <div style={{ marginBottom: '1.5rem', padding: '0.75rem 1rem', background: 'rgba(255,128,0,0.08)', border: '1px solid rgba(255,128,0,0.2)', borderRadius: '6px' }}>
              <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>
                Page: <span style={{ color: '#ff8000' }}>{selected.page_label}</span>
                <span style={{ marginLeft: '1rem', color: 'rgba(255,255,255,0.3)' }}>/{selected.page_key === 'home' ? '' : selected.page_key}</span>
              </p>
            </div>

            <div className="field">
              <label>SEO Title</label>
              <input
                value={selected.title || ''}
                onChange={e => setSelected(s => s ? { ...s, title: e.target.value } : s)}
                placeholder="Page title — Rufus Design"
              />
              <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', marginTop: '0.25rem' }}>
                {(selected.title || '').length}/60 chars
              </p>
            </div>

            <div className="field">
              <label>Meta Description</label>
              <textarea
                value={selected.description || ''}
                onChange={e => setSelected(s => s ? { ...s, description: e.target.value } : s)}
                rows={3}
                placeholder="A concise description of this page for search engines..."
              />
              <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', marginTop: '0.25rem' }}>
                {(selected.description || '').length}/160 chars
              </p>
            </div>

            <div className="field">
              <label>Open Graph Image URL</label>
              <input
                value={selected.og_image || ''}
                onChange={e => setSelected(s => s ? { ...s, og_image: e.target.value } : s)}
                placeholder="https://..."
              />
              <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', marginTop: '0.25rem' }}>
                Shown when shared on social media. Recommended: 1200×630px.
              </p>
            </div>

            {/* Preview */}
            <div style={{ marginTop: '2rem', padding: '1.25rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '8px' }}>
              <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', marginBottom: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Google preview</p>
              <p style={{ fontSize: '0.9rem', color: '#8ab4f8', marginBottom: '0.2rem' }}>{selected.title || 'Page title'}</p>
              <p style={{ fontSize: '0.75rem', color: '#4caf50', marginBottom: '0.3rem' }}>rufusdesign.co.uk › {selected.page_key === 'home' ? '' : selected.page_key}</p>
              <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>{selected.description || 'No description set.'}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
