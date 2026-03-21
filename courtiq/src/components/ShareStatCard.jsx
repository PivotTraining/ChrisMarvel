import { useRef } from 'react'
import { Share2, Download } from 'lucide-react'
import { useToast } from '../contexts/ToastContext'

export default function ShareStatCard({ game }) {
  const toast = useToast()
  const cardRef = useRef(null)

  if (!game) return null

  const date = new Date(game.game_date + 'T12:00:00').toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  })
  const fgPct = game.fg_attempted > 0 ? Math.round((game.fg_made / game.fg_attempted) * 100) : null

  async function generateImage() {
    const canvas = document.createElement('canvas')
    canvas.width = 600
    canvas.height = 400
    const ctx = canvas.getContext('2d')

    // Background
    ctx.fillStyle = '#0d0d12'
    ctx.fillRect(0, 0, 600, 400)

    // Border
    ctx.strokeStyle = '#1a1a2e'
    ctx.lineWidth = 2
    ctx.strokeRect(1, 1, 598, 398)

    // Title
    ctx.fillStyle = '#00A3FF'
    ctx.font = 'bold 14px Inter, system-ui, sans-serif'
    ctx.fillText('COURTIQ', 30, 40)

    // Date
    ctx.fillStyle = '#5a5a6a'
    ctx.font = '13px Inter, system-ui, sans-serif'
    ctx.fillText(date, 30, 65)

    // Opponent
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 24px Inter, system-ui, sans-serif'
    ctx.fillText(game.opponent ? `vs ${game.opponent}` : 'Game Day', 30, 100)

    // Result
    if (game.result) {
      ctx.fillStyle = game.result === 'Win' ? '#22C55E' : game.result === 'Loss' ? '#EF4444' : '#EAB308'
      ctx.font = 'bold 18px Inter, system-ui, sans-serif'
      ctx.fillText(game.result.toUpperCase(), 500, 100)
    }

    // Divider
    ctx.fillStyle = '#1a1a2e'
    ctx.fillRect(30, 120, 540, 1)

    // Stats
    const stats = [
      { label: 'PTS', value: game.points },
      { label: 'REB', value: game.rebounds },
      { label: 'AST', value: game.assists },
      { label: 'STL', value: game.steals },
      { label: 'BLK', value: game.blocks },
      { label: 'FG%', value: fgPct != null ? `${fgPct}%` : '—' },
    ]

    stats.forEach((stat, i) => {
      const x = 30 + (i % 3) * 190
      const y = i < 3 ? 170 : 270
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 36px Inter, system-ui, sans-serif'
      ctx.fillText(String(stat.value), x, y)
      ctx.fillStyle = '#5a5a6a'
      ctx.font = 'bold 11px Inter, system-ui, sans-serif'
      ctx.fillText(stat.label, x, y + 20)
    })

    // Footer
    ctx.fillStyle = '#5a5a6a'
    ctx.font = '11px Inter, system-ui, sans-serif'
    ctx.fillText('Made with CourtIQ', 30, 380)

    return canvas
  }

  async function handleShare() {
    try {
      const canvas = await generateImage()
      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'))

      if (navigator.share && navigator.canShare?.({ files: [new File([blob], 'stats.png', { type: 'image/png' })] })) {
        await navigator.share({
          title: `Game Stats - ${date}`,
          files: [new File([blob], 'courtiq-stats.png', { type: 'image/png' })],
        })
        toast('Shared!')
      } else {
        // Fallback: download
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `courtiq-${game.game_date}.png`
        a.click()
        URL.revokeObjectURL(url)
        toast('Image downloaded!')
      }
    } catch {
      toast('Could not share', 'error')
    }
  }

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-bg-card border border-border text-xs font-medium text-text-secondary hover:text-text-primary transition-colors"
      aria-label="Share stats"
    >
      <Share2 size={14} />
      Share
    </button>
  )
}
