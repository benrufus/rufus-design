'use client'
import { useState, useEffect } from 'react'
import { createClient } from "@/lib/supabase/client"
import { useToast } from '@/components/ui/Toast'
import { SortableList } from '@/components/ui/SortableList'

interface Section { id: string; section_key: string; label: string; visible: boolean; sort_order: number }
interface Service { id: string; number: string; title: string; description: string; sort_order: number }
interface HomePage { hero_words: string[]; hero_subtext: string; hero_cta1: string; hero_cta2: string; about_heading: string; about_body: string; about_quote: string }

export default function HomePageEditor() {
  const supabase = createClient()
  const { show } = useToast()
  const [page, setPage] = useState<HomePage | null>(null)
  const [sections, setSections] = useState<Section[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [saving, setSaving] = useState(false)
  const [tab, setTab] = useState<'sections' | 'hero' | 'services' | 'about'>('sections')
  const [heroWordInput, setHeroWordInput] = useState('')

  useEffect(() => {
    const load = async () => {
      const [{ data: p }, { data: s }, { data: sv }] = await Promise.all([
        supabase.from('home_page').select('*').single(),
        supabase.from('page_sections').select('*').eq('page', 'home').order('sort_order'),
        supabase.from('services').select('*').order('sort_order'),
      ])
      if (p) setPage(p)
      if (s) setSections(s)
      if (sv) setServices(sv)
    }
    load()
  }, [])

  const saveHomePage = async () => {
    if (!page) return
    setSaving(true)
    const { error } = await supabase.from('home_page').update({ ...page, updated_at: new Date().toISOString() }).eq('id', (page as HomePage & { id: string }).id)
    show(error ? 'Error saving' : 'Home page saved!', error ? 'error' : 'success')
    setSaving(false)
  }

  const saveSections = async () => {
    setSaving(true)
    const updates = sections.map((s, i) => supabase.from('page_sections').update({ sort_order: i, visible: s.visible }).eq('id', s.id))
    await Promise.all(updates)
    show('Section order saved!', 'success')
    setSaving(false)
  }

  const saveServices = async () => {
    setSaving(true)
    const updates = services.map((s, i) => supabase.from('services').update({ number: s.number, title: s.title, description: s.description, sort_order: i }).eq('id', s.id))
    await Promise.all(updates)
    show('Services saved!', 'success')
    setSaving(false)
  }

  const addService = async () => {
    const { data } = await supabase.from('services').insert({ number: `0${services.length + 1}`, title: 'New Service', description: 'Service description', sort_order: services.length }).select().single()
    if (data) setServices(s => [...s, data])
  }

  const deleteService = async (id: string) => {
    await supabase.from('services').delete().eq('id', id)
    setServices(s => s.filter(x => x.id !== id))
    show('Service deleted', 'success')
  }

  const TAB_STYLE = (active: boolean) => ({
    padding: '0.6rem 1.25rem', background: active ? 'rgba(255,128,0,0.15)' : 'transparent',
    border: active ? '1px solid rgba(255,128,0,0.3)' : '1px solid rgba(255,255,255,0.08)',
    color: active ? '#ff8000' : 'rgba(255,255,255,0.5)', cursor: 'pointer', borderRadius: '6px',
    fontSize: '0.85rem', fontWeight: active ? 600 : 400, transition: 'all 0.15s',
  })

  return (
    <div style={{ padding: '2.5rem', maxWidth: '900px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em' }}>🏠 Home Page</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', marginTop: '0.25rem' }}>Edit homepage content and section order</p>
        </div>
        <button className="btn btn-orange" onClick={tab === 'sections' ? saveSections : tab === 'services' ? saveServices : saveHomePage} disabled={saving}>
          {saving ? 'Saving...' : '💾 Save changes'}
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {(['sections', 'hero', 'services', 'about'] as const).map(t => (
          <button key={t} style={TAB_STYLE(tab === t)} onClick={() => setTab(t)}>
            {t === 'sections' ? '⠿ Section Order' : t === 'hero' ? '✦ Hero' : t === 'services' ? '⊞ Services' : '● About'}
          </button>
        ))}
      </div>

      {/* SECTIONS TAB */}
      {tab === 'sections' && (
        <div>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
            Drag to reorder sections. Toggle to show/hide.
          </p>
          <SortableList
            items={sections}
            onChange={setSections}
            renderItem={(section) => (
              <div className="card-sm" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{section.label}</p>
                  <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', marginTop: '0.1rem' }}>{section.section_key}</p>
                </div>
                <label className="toggle">
                  <input type="checkbox" checked={section.visible} onChange={e => setSections(ss => ss.map(s => s.id === section.id ? { ...s, visible: e.target.checked } : s))} />
                  <span className="toggle-slider" />
                </label>
              </div>
            )}
          />
        </div>
      )}

      {/* HERO TAB */}
      {tab === 'hero' && page && (
        <div>
          <div className="field">
            <label>Cycling words (hero headline)</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
              {page.hero_words.map((word, i) => (
                <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255,128,0,0.12)', color: '#ff8000', padding: '0.3em 0.75em', borderRadius: '4px', fontSize: '0.85rem' }}>
                  {word}
                  <button type="button" onClick={() => setPage(p => p ? { ...p, hero_words: p.hero_words.filter((_, j) => j !== i) } : p)} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0, fontSize: '1rem', lineHeight: 1 }}>×</button>
                </span>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input value={heroWordInput} onChange={e => setHeroWordInput(e.target.value)} placeholder="Add a word (e.g. Branding)" onKeyDown={e => { if (e.key === 'Enter' && heroWordInput.trim()) { setPage(p => p ? { ...p, hero_words: [...p.hero_words, heroWordInput.trim()] } : p); setHeroWordInput('') }}}
                style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', padding: '0.65rem 0.9rem', borderRadius: '6px', fontSize: '0.875rem', outline: 'none' }} />
              <button className="btn btn-ghost" onClick={() => { if (heroWordInput.trim()) { setPage(p => p ? { ...p, hero_words: [...p.hero_words, heroWordInput.trim()] } : p); setHeroWordInput('') }}}>Add</button>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', marginTop: '0.5rem' }}>These cycle in the big hero headline. Keep them short — 2–3 words max.</p>
          </div>
          <div className="field">
            <label>Hero subtext</label>
            <textarea value={page.hero_subtext} onChange={e => setPage(p => p ? { ...p, hero_subtext: e.target.value } : p)} rows={3} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="field">
              <label>CTA Button 1</label>
              <input value={page.hero_cta1} onChange={e => setPage(p => p ? { ...p, hero_cta1: e.target.value } : p)} />
            </div>
            <div className="field">
              <label>CTA Button 2</label>
              <input value={page.hero_cta2} onChange={e => setPage(p => p ? { ...p, hero_cta2: e.target.value } : p)} />
            </div>
          </div>
        </div>
      )}

      {/* SERVICES TAB */}
      {tab === 'services' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.85rem' }}>Drag to reorder service cards.</p>
            <button className="btn btn-ghost btn-sm" onClick={addService}>+ Add service</button>
          </div>
          <SortableList
            items={services}
            onChange={setServices}
            renderItem={(service) => (
              <div className="card-sm">
                <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr', gap: '0.75rem', alignItems: 'start' }}>
                  <input value={service.number} onChange={e => setServices(ss => ss.map(s => s.id === service.id ? { ...s, number: e.target.value } : s))}
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#ff8000', padding: '0.5rem', borderRadius: '4px', fontSize: '1.1rem', fontWeight: 800, textAlign: 'center', outline: 'none', width: '100%' }} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <input value={service.title} onChange={e => setServices(ss => ss.map(s => s.id === service.id ? { ...s, title: e.target.value } : s))}
                      placeholder="Service title"
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', padding: '0.5rem 0.75rem', borderRadius: '4px', fontSize: '0.9rem', fontWeight: 600, outline: 'none', width: '100%' }} />
                    <textarea value={service.description} onChange={e => setServices(ss => ss.map(s => s.id === service.id ? { ...s, description: e.target.value } : s))}
                      rows={2}
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)', padding: '0.5rem 0.75rem', borderRadius: '4px', fontSize: '0.825rem', outline: 'none', resize: 'none', width: '100%', fontFamily: 'inherit' }} />
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                  <button className="btn btn-danger btn-sm" onClick={() => deleteService(service.id)}>Delete</button>
                </div>
              </div>
            )}
          />
        </div>
      )}

      {/* ABOUT TAB */}
      {tab === 'about' && page && (
        <div>
          <div className="field">
            <label>About section heading</label>
            <input value={page.about_heading} onChange={e => setPage(p => p ? { ...p, about_heading: e.target.value } : p)} />
          </div>
          <div className="field">
            <label>About body text</label>
            <textarea value={page.about_body} onChange={e => setPage(p => p ? { ...p, about_body: e.target.value } : p)} rows={4} />
          </div>
          <div className="field">
            <label>Pull quote</label>
            <input value={page.about_quote} onChange={e => setPage(p => p ? { ...p, about_quote: e.target.value } : p)} />
            <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', marginTop: '0.35rem' }}>Shown in the orange-bordered box on the homepage.</p>
          </div>
        </div>
      )}
    </div>
  )
}
