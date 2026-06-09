'use client'
import { useState, useRef } from 'react'

interface Props {
  value?: string
  onChange: (url: string) => void
  folder?: string
  label?: string
}

export default function ImageUpload({ value, onChange, folder = 'general', label = 'Image' }: Props) {
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = async (file: File) => {
    setUploading(true)
    const form = new FormData()
    form.append('file', file)
    form.append('folder', folder)
    const res = await fetch('/api/upload', { method: 'POST', body: form })
    const data = await res.json()
    if (data.url) onChange(data.url)
    setUploading(false)
  }

  return (
    <div className="field">
      <label>{label}</label>
      <div
        className="image-upload"
        onClick={() => inputRef.current?.click()}
        onDragOver={e => e.preventDefault()}
        onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f) }}
      >
        {uploading ? (
          <p style={{ color: 'rgba(255,255,255,0.4)' }}>Uploading...</p>
        ) : value ? (
          <div>
            <img src={value} alt="Preview" />
            <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.75rem' }}>Click to replace</p>
          </div>
        ) : (
          <div>
            <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📸</p>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem' }}>Click or drag to upload</p>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', marginTop: '0.25rem' }}>PNG, JPG, SVG, WebP</p>
          </div>
        )}
      </div>
      {value && (
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
          <input
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder="Or paste URL"
            style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', padding: '0.5rem 0.75rem', borderRadius: '6px', fontSize: '0.8rem', outline: 'none' }}
          />
          <button type="button" onClick={() => onChange('')} className="btn btn-danger btn-sm">Remove</button>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
      />
    </div>
  )
}
