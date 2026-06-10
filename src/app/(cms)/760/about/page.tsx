'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/components/ui/Toast'
import { SortableList } from '@/components/ui/SortableList'
import ImageUpload from '@/components/ui/ImageUpload'

interface Section { id: string; section_key: string; label: string; visible: boolean; sort_order: number }
interface Stat { id: string; value: string; label: string; sort_order: number; page: string }
interface Value { id: string; number: string; title: string; description: string; sort_order: number }
interface TeamMember { id: string; name: string; role: string; bio: string; photo: string; sort_order: number; active: boolean }
interface AboutPage { id: string; heading: string; intro: string }

export default function AboutEditor() {
  const supabase = createClient()
  const { show } = useToast()
  const [about, setAbout] = useState<AboutPage | null>(null)
  const [sections, setSections] = useState<Section[]>([])
  const [stats, setStats] = useState<Stat[]>([])
  const [values, setValues] = useState<Value[]>([])
  const [team, setTeam] = useState<TeamMember[]>([])
  const [saving, setSaving] = useState(false)
  const [tab, setTab] = useState<'sections' | 'page' | 'stats' | 'values' | 'team'>('sections')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      supabase.from('about_page').select('*').maybeSingle(),
      supabase.from('page_sections').select('*').eq('page', 'about').order('sort_order'),
      supabase.from('stats').select('*').eq('page', 'about').order('sort_order'),
      supabase.from('values_items').select('*').order('sort_order'),
      supabase.from('team').select('*').order('sort_order'),
    ]).then(([{ data: a }, { data: s }, { data: st }, { data: v }, { data: t }]) => {
      setAbout(a || { id: '', heading: 'About us', intro: '' })
      if (s) setSections(s)
      if (st) setStats(st)
      if (v) setValues(v)
      if (t) setTeam(t)
      setLoading(false)
    })
  }, [])

  const save = async () => {
    setSaving(true)
    try {
      if (tab === 'sections') {
        for (const [i, s] of sections.entries()) {
          await supabase.from('page_sections').update({ sort_order: i, visible: s.visible }).eq('id', s.id)
        }
        show('Sections saved!', 'success')
      } else if (tab === 'page' && about) {
        if (about.id) {
          await supabase.from('about_page').update({ heading: about.heading, intro: about.intro }).eq('id', about.id)
        } else {
          const { data } = await supabase.from('about_page').insert({ heading: about.heading, intro: about.intro }).select().single()
          if (data) setAbout(data)
        }
        show('Page copy saved!', 'success')
      } else if (tab === 'stats') {
        for (const [i, s] of stats.entries()) {
          if (s.id) {
            await supabase.from('stats').update({ value: s.value, label: s.label, sort_order: i }).eq('id', s.id)
          }
        }
        show('Stats saved!', 'success')
      } else if (tab === 'values') {
        for (const [i, v] of values.entries()) {
          await supabase.from('values_items').update({ number: v.number, title: v.title, description: v.description, sort_order: i }).eq('id', v.id)
        }
        show('Values saved!', 'success')
      } else if (tab === 'team') {
        for (const [i, t] of team.entries()) {
          await supabase.from('team').update({ name: t.name, role: t.role, bio: t.bio, photo: t.photo, sort_order: i, active: t.active }).eq('id', t.id)
        }
        show('Team saved!', 'success')
      }
    } catch (e: any) {
      show('Error saving: ' + e.message, 'error')
    }
    setSaving(false)
  }

  const addStat = async () => {
    const { data } = await supabase.from('stats').insert({ value: '0', label: 'New stat', page: 'about', sort_order: stats.length }).select().single()
    if (data) setStats(s => [...s, data])
  }

  const removeStat = async (id: string) => {
    await supabase.from('stats').delete().eq('id', id)
    setStats(s => s.filter(x => x.id !== id))
    show('Deleted', 'success')
  }

  const addValue = async () => {
    const { data } = await supabase.from('values_items').insert({ number: `0${values.length + 1}`, title: 'New value', description: '', sort_order: values.length }).select().single()
    if (data) setValues(v => [...v, data])
  }

  const removeValue = async (id: string) => {
    await supabase.from('values_items').delete().eq('id', id)
    setValues(v => v.filter(x => x.id !== id))
  }

  const addTeamMember = async () => {
    const { data } = await supabase.from('team').insert({ name: 'New Team Member', role: '', bio: '', sort_order: team.length, active: true }).select().single()
    if (data) setTeam(t => [...t, data])
  }

  const removeTeamMember = async (id: string) => {
    await supabase.from('team').delete().eq('id', id)
    setTeam(t => t.filter(x => x.id !== id))
  }

  const TAB = (t: typeof tab) => ({
    padding: '0.5rem 1rem',
    background: tab === t ? 'rgba(255,128,0,0.15)' : 'transparent',
    border: tab === t ? '1px solid rgba(255,128,0,0.3)' : '1px solid rgba(255,255,255,0.08)',
    color: tab === t ? '#ff8000' : 'rgba(255,255,255,0.5)',
    cursor: 'pointer', borderRadius: '6px', fontSize: '0.825rem',
    fontWeight: tab === t ? 600 : 400,
  })

  if (loading) return <div style={{ padding: '2.5rem', color: 'rgba(255,255,255,0.4)' }}>Loading...</div>

  return (
    <div style={{ padding: '2.5rem', maxWidth: '900px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em' }}>👋 About Page</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', marginTop: '0.25rem' }}>Edit about page content</p>
        </div>
        <button className="btn btn-orange" onClick={save} disabled={saving}>{saving ? 'Saving...' : '💾 Save'}</button>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <button style={TAB('sections')} onClick={() => setTab('sections')}>⠿ Sections</button>
        <button style={TAB('page')} onClick={() => setTab('page')}>📝 Page copy</button>
        <button style={TAB('stats')} onClick={() => setTab('stats')}>📊 Stats</button>
        <button style={TAB('values')} onClick={() => setTab('values')}>⊞ Values</button>
        <button style={TAB('team')} onClick={() => setTab('team')}>👤 Team</button>
      </div>

      {tab === 'sections' && (
        <div>
          {sections.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'rgba(255,255,255,0.3)', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '8px' }}>
              <p style={{ marginBottom: '1rem' }}>No sections found. Run this SQL in Supabase:</p>
              <pre style={{ padding: '1rem', background: 'rgba(0,0,0,0.3)', borderRadius: '6px', fontSize: '0.75rem', textAlign: 'left', color: 'rgba(255,255,255,0.6)', overflowX: 'auto' }}>{`INSERT INTO page_sections (page, section_key, label, sort_order, visible) VALUES
('about', 'stats', 'Stats', 0, true),
('about', 'logos', 'Client Logos', 1, true),
('about', 'team', 'Team', 2, true),
('about', 'values', 'Our Values', 3, true),
('about', 'services', 'Services', 4, true),
('about', 'testimonials', 'Testimonials', 5, true);`}</pre>
            </div>
          ) : (
            <>
              <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>Drag to reorder. Toggle to show/hide.</p>
              <SortableList items={sections} onChange={setSections} renderItem={(section) => (
                <div className="card-sm" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{section.label}</p>
                    <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', marginTop: '0.1rem' }}>{section.section_key}</p>
                  </div>
                  <label className="toggle">
                    <input type="checkbox" checked={section.visible}
                      onChange={e => setSections(ss => ss.map(s => s.id === section.id ? { ...s, visible: e.target.checked } : s))} />
                    <span className="toggle-slider" />
                  </label>
                </div>
              )} />
            </>
          )}
        </div>
      )}

      {tab === 'page' && (
        <div>
          <div className="field">
            <label>Page heading</label>
            <input value={about?.heading || ''} onChange={e => setAbout(a => a ? { ...a, heading: e.target.value } : a)} placeholder="About us" />
          </div>
          <div className="field">
            <label>Intro paragraph</label>
            <textarea value={about?.intro || ''} onChange={e => setAbout(a => a ? { ...a, intro: e.target.value } : a)} rows={4} placeholder="A short intro shown in the hero..." />
          </div>
        </div>
      )}

      {tab === 'stats' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.85rem' }}>Shown on the about page.</p>
            <button className="btn btn-ghost btn-sm" onClick={addStat}>+ Add stat</button>
          </div>
          {stats.length === 0 && <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem' }}>No stats yet.</p>}
          <SortableList items={stats} onChange={setStats} renderItem={(stat) => (
            <div className="card-sm">
              <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr auto', gap: '0.75rem', alignItems: 'end' }}>
                <div className="field" style={{ margin: 0 }}>
                  <label>Value</label>
                  <input value={stat.value} onChange={e => setStats(ss => ss.map(s => s.id === stat.id ? { ...s, value: e.target.value } : s))} placeholder="18+" />
                </div>
                <div className="field" style={{ margin: 0 }}>
                  <label>Label</label>
                  <input value={stat.label} onChange={e => setStats(ss => ss.map(s => s.id === stat.id ? { ...s, label: e.target.value } : s))} placeholder="Years in business" />
                </div>
                <button className="btn btn-danger btn-sm" onClick={() => removeStat(stat.id)}>✕</button>
              </div>
            </div>
          )} />
        </div>
      )}

      {tab === 'values' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.85rem' }}>Drag to reorder.</p>
            <button className="btn btn-ghost btn-sm" onClick={addValue}>+ Add value</button>
          </div>
          <SortableList items={values} onChange={setValues} renderItem={(value) => (
            <div className="card-sm">
              <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr auto', gap: '0.75rem', marginBottom: '0.5rem', alignItems: 'end' }}>
                <div className="field" style={{ margin: 0 }}><label>Number</label><input value={value.number} onChange={e => setValues(vs => vs.map(v => v.id === value.id ? { ...v, number: e.target.value } : v))} /></div>
                <div className="field" style={{ margin: 0 }}><label>Title</label><input value={value.title} onChange={e => setValues(vs => vs.map(v => v.id === value.id ? { ...v, title: e.target.value } : v))} /></div>
                <button className="btn btn-danger btn-sm" onClick={() => removeValue(value.id)}>✕</button>
              </div>
              <div className="field" style={{ margin: 0 }}><label>Description</label><textarea value={value.description} onChange={e => setValues(vs => vs.map(v => v.id === value.id ? { ...v, description: e.target.value } : v))} rows={2} /></div>
            </div>
          )} />
        </div>
      )}

      {tab === 'team' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
            <button className="btn btn-ghost btn-sm" onClick={addTeamMember}>+ Add team member</button>
          </div>
          <SortableList items={team} onChange={setTeam} renderItem={(member) => (
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>
                  <label className="toggle"><input type="checkbox" checked={member.active} onChange={e => setTeam(ts => ts.map(t => t.id === member.id ? { ...t, active: e.target.checked } : t))} /><span className="toggle-slider" /></label>
                  Visible on site
                </label>
                <button className="btn btn-danger btn-sm" onClick={() => removeTeamMember(member.id)}>Delete</button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div className="field" style={{ margin: 0 }}><label>Name</label><input value={member.name} onChange={e => setTeam(ts => ts.map(t => t.id === member.id ? { ...t, name: e.target.value } : t))} /></div>
                <div className="field" style={{ margin: 0 }}><label>Role</label><input value={member.role || ''} onChange={e => setTeam(ts => ts.map(t => t.id === member.id ? { ...t, role: e.target.value } : t))} /></div>
              </div>
              <div className="field" style={{ margin: 0, marginBottom: '0.75rem' }}><label>Bio</label><textarea value={member.bio || ''} onChange={e => setTeam(ts => ts.map(t => t.id === member.id ? { ...t, bio: e.target.value } : t))} rows={3} /></div>
              <ImageUpload value={member.photo || ''} onChange={url => setTeam(ts => ts.map(t => t.id === member.id ? { ...t, photo: url } : t))} folder="team" label="Photo" />
            </div>
          )} />
        </div>
      )}
    </div>
  )
}
