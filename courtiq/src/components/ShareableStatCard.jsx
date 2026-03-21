import { useRef, useState, useEffect } from 'react'
import { Share2, Download, Check } from 'lucide-react'

function drawStatCard(canvas, data, theme) {
  const ctx = canvas.getContext('2d')
  const w = 600
  const h = 400
  canvas.width = w * 2
  canvas.height = h * 2
  ctx.scale(2, 2)

  const isDark = theme === 'dark'

  // Background
  const bg = ctx.createLinearGradient(0, 0, w, h)
  if (isDark) {
    bg.addColorStop(0, '#0a0a12')
    bg.addColorStop(1, '#050510')
  } else {
    bg.addColorStop(0, '#f0f0f5')
    bg.addColorStop(1, '#e8e8f0')
  }
  ctx.fillStyle = bg
  roundRect(ctx, 0, 0, w, h, 20)
  ctx.fill()

  // Accent glow
  ctx.fillStyle = 'rgba(0,163,255,0.06)'
  ctx.beginPath()
  ctx.arc(w * 0.8, h * 0.2, 120, 0, Math.PI * 2)
  ctx.fill()

  // Top bar
  const accent = '#00A3FF'
  ctx.fillStyle = accent
  roundRect(ctx, 0, 0, w, 4, 0)
  ctx.fill()

  // Player name
  ctx.fillStyle = isDark ? '#ffffff' : '#1a1a2e'
  ctx.font = 'bold 22px Inter, sans-serif'
  ctx.fillText(data.playerName || 'Player', 32, 48)

  // Subtitle
  ctx.fillStyle = isDark ? '#8a8a9a' : '#555566'
  ctx.font = '13px Inter, sans-serif'
  ctx.fillText(data.subtitle || 'Season Stats', 32, 70)

  // Stats grid
  const stats = data.stats || []
  const cols = Math.min(stats.length, 3)
  const startY = 110
  const colW = (w - 64) / cols

  stats.forEach((stat, i) => {
    const x = 32 + (i % cols) * colW
    const row = Math.floor(i / cols)
    const y = startY + row * 90

    // Value
    ctx.fillStyle = accent
    ctx.font = 'bold 36px Inter, sans-serif'
    ctx.fillText(stat.value, x, y)

    // Label
    ctx.fillStyle = isDark ? '#5a5a6a' : '#888899'
    ctx.font = '12px Inter, sans-serif'
    ctx.fillText(stat.label, x, y + 22)
  })

  // Footer / branding
  const footY = h - 30
  ctx.fillStyle = isDark ? '#3a3a4a' : '#aaaabb'
  ctx.font = '11px Inter, sans-serif'
  ctx.fillText('CourtIQ', 32, footY)

  // Date
  const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  ctx.textAlign = 'right'
  ctx.fillText(dateStr, w - 32, footY)
  ctx.textAlign = 'left'
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

export default function ShareableStatCard({ playerName, subtitle, stats = [], theme = 'dark' }) {
  const canvasRef = useRef(null)
  const [copied, setCopied] = useState(false)

  function generate() {
    if (!canvasRef.current) return
    drawStatCard(canvasRef.current, { playerName, subtitle, stats }, theme)
  }

  // Auto-render on mount and when data changes
  useEffect(() => { generate() }, [playerName, subtitle, stats, theme])

  async function handleShare() {
    generate()
    const canvas = canvasRef.current
    if (!canvas) return

    try {
      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'))
      if (navigator.share && navigator.canShare?.({ files: [new File([blob], 'stats.png', { type: 'image/png' })] })) {
        await navigator.share({
          title: `${playerName} — CourtIQ Stats`,
          files: [new File([blob], 'courtiq-stats.png', { type: 'image/png' })],
        })
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }
    } catch {
      // Fallback: download
      handleDownload()
    }
  }

  function handleDownload() {
    generate()
    const canvas = canvasRef.current
    if (!canvas) return
    const link = document.createElement('a')
    link.download = `courtiq-stats-${Date.now()}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider">Share Stats</h2>
        <div className="flex gap-2">
          <button
            onClick={handleDownload}
            className="p-2 rounded-lg bg-bg-section border border-border text-text-secondary hover:text-text-primary transition-colors"
            aria-label="Download stat card"
          >
            <Download size={14} />
          </button>
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue text-white text-xs font-semibold hover:bg-blue-dark transition-colors"
          >
            {copied ? <Check size={14} /> : <Share2 size={14} />}
            {copied ? 'Copied!' : 'Share'}
          </button>
        </div>
      </div>
      <div className="rounded-xl overflow-hidden border border-border">
        <canvas
          ref={canvasRef}
          className="w-full"
          style={{ aspectRatio: '3/2' }}
        />
      </div>
      <p className="text-[10px] text-text-muted text-center">Tap Share to send or Download to save as image.</p>
    </div>
  )
}

export { drawStatCard }
