'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/components/ui/Toast'

export default function CmsHomePage() {
  const [data, setData] = useState<any>({ hero_words: [], hero_intro: '', about_headline: '', about_body: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [wordInput, setWordInput] = useState('')
  const supabase = createClient()
  const { toast } = useToast()

  useEffect(() => {
    supabase.from('home_page').select('*').single()
      .then(({ data }) => { if (data) setData(data); setLoading(false) })
  }, [])

  async function save() {
    setSaving(true)
    const { error } = await supabase.from('home_page').upsert({ id: data.id || 1, ...data })
    toast(error ? error.message : 'Saved!', error ? 'error' : 'success')
    setSaving(false)
  }

  function addWord() {
    if (!wordInput.trim()) return
    setData((d: any) => ({ ...d, hero_words: [...(d.hero_words || []), wordInput.trim()] }))
    setWordInput('')
  }

  function removeWord(i: number) {
    setData((d: any) => ({ ...d, hero_words: d.hero_words.filter((_: any, idx: number) => idx !== i) }))
  }

  if (loading) return <div style={{ color: 'var(--muted)' }}>Loading…</div>

  return (
    <>
      <div className="cms-header">
        <h1>Home Page<span style={{ color: 'var(--orange)' }}>.</span></h1>
        <p>Edit hero words, intro text and about section</p>
      </div>

      <div className="cms-card">
        <h2>Hero cycling words</h2>
        <p style={{ fontSize: '0.8rem', color: 'var(--muted)', marginBottom: '1rem' }}>These cycle in the orange line of the hero (e.g. "Web Design", "SEO", "PPC")</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
          {(data.hero_words || []).map((w: string, i: number) => (
            <span key={i} style={{ background: 'rgba(255,128,0,0.12)', color: 'var(--orange)', padding: '0.3em 0.75em', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {w}
              <button onClick={() => removeWord(i)} style={{ background: 'none', border: 'none', color: 'var(--orange)', fontSize: '0.9rem', lineHeight: 1 }}>×</button>
            </span>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input value={wordInput} onChange={e => setWordInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && addWord()} placeholder="Add word…" style={{ flex: 1, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '0.6rem 0.875rem', fontFamily: 'var(--font-body)' }} />
          <button className="cms-btn" onClick={addWord}>Add</button>
        </div>
      </div>

      <div className="cms-card">
        <h2>Hero intro text</h2>
        <div className="cms-field" style={{ marginBottom: 0 }}>
          <textarea value={data.hero_intro || ''} onChange={e => setData((d: any) => ({ ...d, hero_intro: e.target.value }))} rows={3} placeholder="Based in Berkhamsted, we design and build fast, reliable websites…" />
        </div>
      </div>

      <div className="cms-card">
        <h2>About section</h2>
        <div className="cms-field">
          <label>Headline</label>
          <input value={data.about_headline || ''} onChange={e => setData((d: any) => ({ ...d, about_headline: e.target.value }))} placeholder="A different kind of agency" />
        </div>
        <div className="cms-field" style={{ marginBottom: 0 }}>
          <label>Body text</label>
          <textarea value={data.about_body || ''} onChange={e => setData((d: any) => ({ ...d, about_body: e.target.value }))} rows={5} placeholder="We've been building websites since 2007…" />
        </div>
      </div>

      <button className="cms-btn" onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save changes'}</button>
    </>
  )
}
