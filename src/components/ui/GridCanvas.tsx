'use client'
import { useEffect, useRef } from 'react'

export default function GridCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const GRID = 80
    const ORANGE = '#ff8000'

    let pulses: Array<{
      x: number; y: number; axis: 'h' | 'v'
      progress: number; speed: number; length: number; opacity: number
    }> = []

    let animId: number
    let cols: number, rows: number

    function resize() {
      canvas!.width = window.innerWidth
      canvas!.height = window.innerHeight
      cols = Math.ceil(canvas!.width / GRID) + 1
      rows = Math.ceil(canvas!.height / GRID) + 1
    }

    function spawnPulse() {
      const axis = Math.random() > 0.5 ? 'h' : 'v'
      if (axis === 'h') {
        const row = Math.floor(Math.random() * rows)
        pulses.push({ x: 0, y: row * GRID, axis, progress: 0, speed: 0.003 + Math.random() * 0.004, length: 80 + Math.random() * 120, opacity: 0.6 + Math.random() * 0.4 })
      } else {
        const col = Math.floor(Math.random() * cols)
        pulses.push({ x: col * GRID, y: 0, axis, progress: 0, speed: 0.003 + Math.random() * 0.004, length: 80 + Math.random() * 120, opacity: 0.6 + Math.random() * 0.4 })
      }
    }

    function draw() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height)

      // Grid lines
      ctx!.strokeStyle = 'rgba(255,255,255,0.025)'
      ctx!.lineWidth = 1
      for (let x = 0; x <= cols * GRID; x += GRID) {
        ctx!.beginPath(); ctx!.moveTo(x, 0); ctx!.lineTo(x, canvas!.height); ctx!.stroke()
      }
      for (let y = 0; y <= rows * GRID; y += GRID) {
        ctx!.beginPath(); ctx!.moveTo(0, y); ctx!.lineTo(canvas!.width, y); ctx!.stroke()
      }

      // Pulses
      pulses = pulses.filter(p => p.progress < 1)
      pulses.forEach(p => {
        p.progress += p.speed
        const maxDist = p.axis === 'h' ? canvas!.width : canvas!.height
        const head = p.progress * maxDist
        const tail = Math.max(0, head - p.length)
        const grad = p.axis === 'h'
          ? ctx!.createLinearGradient(tail, 0, head, 0)
          : ctx!.createLinearGradient(0, tail, 0, head)
        grad.addColorStop(0, 'rgba(255,128,0,0)')
        grad.addColorStop(0.5, `rgba(255,128,0,${p.opacity * 0.4})`)
        grad.addColorStop(1, `rgba(255,128,0,${p.opacity})`)
        ctx!.strokeStyle = grad
        ctx!.lineWidth = 1.5
        ctx!.beginPath()
        if (p.axis === 'h') { ctx!.moveTo(tail, p.y); ctx!.lineTo(head, p.y) }
        else { ctx!.moveTo(p.x, tail); ctx!.lineTo(p.x, head) }
        ctx!.stroke()
      })

      if (Math.random() < 0.025 && pulses.length < 12) spawnPulse()
      animId = requestAnimationFrame(draw)
    }

    resize()
    window.addEventListener('resize', resize)
    spawnPulse(); spawnPulse()
    draw()

    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize) }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', display: 'block' }}
    />
  )
}
