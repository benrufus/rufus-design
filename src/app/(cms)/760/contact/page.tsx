'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/components/ui/Toast'

const FIELD_TYPES = ['text', 'email', 'tel', 'textarea', 'select']

export default function CmsContactPage() {
  const [fields, setFields] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const supabase = createClient()
  const { toast } = useToast()

  useEffect(() => {
    supabase.from('contact_form').select('*').single()
      .then(({ data }) => { if (data?.fields) setFields(data.fields); setLoading(false) })
  }, [])

  function upd(i: number, k: string, v: any) {
    setFields(f => f.map((field, idx) => idx === i ? { ...field, [k]: v } : field))
  }

  function add() {
    setFields(f => [...f, { id: `field-${Date.now()}`, label: 'New Field', field_type: 'text', placeholder: '', required: false }])
  }

  function remove(i: number) { setFields(f => f.filter((_, idx) => idx !== i)) }

  async function save() {
    setSaving(true)
    const { error } = await supabase.from('contact_form').upsert({ id: 1, fields })
    toast(error ? error.message : 'Saved!', error ? 'error' : 'success')
    setSaving(false)
  }

  if (loading) return <div style={{ color: 'var(--muted)' }}>Loading…</div>

  return (
    <>
      <div className="cms-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div><h1>Contact Form<span style={{ color: 'var(--orange)' }}>.</span></h1><p>Edit the fields shown on the contact form</p></div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={add} className="cms-btn-secondary">+ Add field</button>
          <button onClick={save} className="cms-btn" disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
        </div>
      </div>

      {fields.map((field, i) => (
        <div key={field.id} className="cms-card" style={{ marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ fontWeight: 600, color: '#fff' }}>{field.label || 'Field'}</span>
            <button onClick={() => remove(i)} className="cms-btn-danger">Remove</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div className="cms-field" style={{ marginBottom: 0 }}><label>Label</label><input value={field.label || ''} onChange={e => upd(i, 'label', e.target.value)} /></div>
            <div className="cms-field" style={{ marginBottom: 0 }}>
              <label>Field type</label>
              <select value={field.field_type || 'text'} onChange={e => upd(i, 'field_type', e.target.value)}>
                {FIELD_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="cms-field" style={{ marginBottom: 0 }}><label>Placeholder</label><input value={field.placeholder || ''} onChange={e => upd(i, 'placeholder', e.target.value)} /></div>
            <div className="cms-field" style={{ marginBottom: 0, display: 'flex', alignItems: 'flex-end', paddingBottom: '0.2rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginBottom: 0, textTransform: 'none', letterSpacing: 0 }}>
                <input type="checkbox" checked={!!field.required} onChange={e => upd(i, 'required', e.target.checked)} />
                <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem' }}>Required</span>
              </label>
            </div>
          </div>
        </div>
      ))}

      {!fields.length && <div style={{ color: 'var(--muted)', textAlign: 'center', padding: '3rem' }}>No fields yet. Add one above.</div>}
    </>
  )
}
