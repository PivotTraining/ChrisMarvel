import { useState, useCallback } from 'react'
import { Share2, Check } from 'lucide-react'

/*
 * GameShareCard — a branded, screenshot-ready card showing the box score of
 * a single game. Designed for Instagram stories / Twitter sharing.
 *
 * Props:
 *   player:   { full_name, position }
 *   game:     { opponent, points, rebounds, assists, steals, blocks,
 *               turnovers, field_goals_made, field_goals_attempted,
 *               three_pointers_made, three_pointers_attempted,
 *               free_throws_made, free_throws_attempted, game_date }
 *   onClose:  () => void
 */

function pct(made, attempted) {
  if (!attempted) return 0
  return Math.round((made / attempted) * 100)
}

export default function GameShareCard({ player, game, onClose }) {
  const [copied, setCopied] = useState(false)

  const playerName = player?.full_name || 'Player'
  const position = player?.position || ''

  const opponent = game?.opponent || 'Opponent'
  const pts = game?.points || 0
  const reb = game?.rebounds || 0
  const ast = game?.assists || 0
  const stl = game?.steals || 0
  const blk = game?.blocks || 0
  const to = game?.turnovers || 0
  const fgm = game?.field_goals_made || 0
  const fga = game?.field_goals_attempted || 0
  const tpm = game?.three_pointers_made || 0
  const tpa = game?.three_pointers_attempted || 0
  const ftm = game?.free_throws_made || 0
  const fta = game?.free_throws_attempted || 0

  const fgPct = pct(fgm, fga)
  const tpPct = pct(tpm, tpa)
  const ftPct = pct(ftm, fta)

  // Highlight badge based on scoring performance
  const vibe =
    pts >= 40 ? 'DROPPED 40' :
    pts >= 30 ? 'CAREER NIGHT' :
    pts >= 20 ? 'BUCKET' :
    pts >= 10 ? 'BALLER' : 'GRIND'

  const vibeColor =
    pts >= 40 ? '#FBBF24' :
    pts >= 30 ? '#FF6B35' :
    pts >= 20 ? '#22C55E' :
    pts >= 10 ? '#3B82F6' : '#8B8FAB'

  const gameDate = game?.game_date
    ? new Date(game.game_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

  const shareText = `${playerName} vs ${opponent}
${pts} PTS · ${reb} REB · ${ast} AST
${stl} STL · ${blk} BLK · ${to} TO
FG: ${fgm}/${fga} (${fgPct}%) · 3PT: ${tpm}/${tpa} · FT: ${ftm}/${fta}

Tracked with CourtIQ 🏀
#CourtIQ #HoopStats`

  const handleShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${playerName} vs ${opponent}`,
          text: shareText,
        })
        return
      } catch { /* user cancelled */ }
    }
    try {
      await navigator.clipboard.writeText(shareText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = shareText
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [shareText, playerName, opponent])

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 80,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(16px)',
        padding: '24px',
        overflowY: 'auto',
      }}
    >
      {/* The Card */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '340px',
          borderRadius: '28px',
          overflow: 'hidden',
          animation: 'modalIn 0.3s ease',
        }}
      >
        <div
          style={{
            background: 'linear-gradient(160deg, #0F1117 0%, #1A1D2E 40%, #0F1117 100%)',
            padding: '28px 24px 24px',
            position: 'relative',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '28px',
          }}
        >
          {/* Decorative glow */}
          <div
            style={{
              position: 'absolute',
              top: '-40px',
              right: '-40px',
              width: '180px',
              height: '180px',
              borderRadius: '50%',
              background: `radial-gradient(circle, ${vibeColor}20, transparent 70%)`,
              pointerEvents: 'none',
            }}
          />

          {/* Header: Brand + Vibe badge */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <p style={{ fontSize: '14px', fontWeight: 900, letterSpacing: '1.5px', color: 'rgba(255,255,255,0.4)', margin: 0 }}>
              COURT<span style={{ color: '#FF6B35' }}>IQ</span>
            </p>
            <div
              style={{
                padding: '4px 14px',
                borderRadius: '8px',
                background: `${vibeColor}20`,
                border: `1px solid ${vibeColor}40`,
              }}
            >
              <span style={{ fontSize: '10px', fontWeight: 900, color: vibeColor, letterSpacing: '1.5px' }}>
                {vibe}
              </span>
            </div>
          </div>

          {/* Matchup: Player vs Opponent */}
          <div style={{ marginBottom: '22px' }}>
            <h2 style={{ fontSize: '26px', fontWeight: 900, letterSpacing: '-0.5px', color: '#F0F1F5', lineHeight: 1.1, margin: 0 }}>
              {playerName}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px', flexWrap: 'wrap' }}>
              {position && (
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#FF6B35', padding: '2px 8px', borderRadius: '6px', background: 'rgba(255,107,53,0.12)' }}>
                  {position}
                </span>
              )}
              <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)', fontWeight: 600 }}>
                vs
              </span>
              <span style={{ fontSize: '14px', color: '#F0F1F5', fontWeight: 800 }}>
                {opponent}
              </span>
            </div>
            <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)', fontWeight: 600, marginTop: '4px', margin: '4px 0 0', letterSpacing: '0.5px' }}>
              {gameDate}
            </p>
          </div>

          {/* Hero PTS */}
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <div style={{ fontSize: '68px', fontWeight: 900, color: vibeColor, letterSpacing: '-3px', lineHeight: 1 }}>
              {pts}
            </div>
            <div style={{ fontSize: '11px', fontWeight: 800, color: 'rgba(255,255,255,0.45)', letterSpacing: '2px', marginTop: '4px' }}>
              POINTS
            </div>
          </div>

          {/* REB / AST / STL / BLK row */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '14px 10px',
              borderRadius: '14px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.06)',
              marginBottom: '14px',
            }}
          >
            {[
              { value: reb, label: 'REB', color: '#3B82F6' },
              { value: ast, label: 'AST', color: '#22C55E' },
              { value: stl, label: 'STL', color: '#A78BFA' },
              { value: blk, label: 'BLK', color: '#F59E0B' },
            ].map((s) => (
              <div key={s.label} style={{ textAlign: 'center', flex: 1 }}>
                <div style={{ fontSize: '22px', fontWeight: 900, color: s.color, letterSpacing: '-0.5px', lineHeight: 1 }}>
                  {s.value}
                </div>
                <div style={{ fontSize: '9px', fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: '1px', marginTop: '4px' }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          {/* Shooting splits */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '12px 16px',
              borderRadius: '14px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.06)',
              marginBottom: '16px',
            }}
          >
            {[
              { value: `${fgm}/${fga}`, pct: `${fgPct}%`, label: 'FG' },
              { value: `${tpm}/${tpa}`, pct: `${tpPct}%`, label: '3PT' },
              { value: `${ftm}/${fta}`, pct: `${ftPct}%`, label: 'FT' },
            ].map((s) => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '14px', fontWeight: 900, color: '#F0F1F5', letterSpacing: '-0.3px' }}>
                  {s.value}
                </div>
                <div style={{ fontSize: '10px', fontWeight: 700, color: vibeColor, marginTop: '2px' }}>
                  {s.pct}
                </div>
                <div style={{ fontSize: '9px', fontWeight: 600, color: 'rgba(255,255,255,0.3)', letterSpacing: '1px', marginTop: '2px' }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <p style={{ fontSize: '9px', color: 'rgba(255,255,255,0.2)', fontWeight: 600, letterSpacing: '0.5px', margin: 0 }}>
              getcourtiq.com
            </p>
            <p style={{ fontSize: '9px', color: 'rgba(255,255,255,0.2)', fontWeight: 600, margin: 0 }}>
              {to} TO
            </p>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ display: 'flex', gap: '12px', marginTop: '20px' }}
      >
        <button
          onClick={handleShare}
          style={{
            padding: '14px 28px',
            borderRadius: '16px',
            border: 'none',
            background: copied ? 'rgba(34,197,94,0.2)' : 'linear-gradient(135deg, #FF6B35, #E85A2A)',
            color: copied ? '#22C55E' : '#fff',
            fontSize: '15px',
            fontWeight: 800,
            cursor: 'pointer',
            fontFamily: 'inherit',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: copied ? 'none' : '0 4px 16px rgba(255,107,53,0.35)',
          }}
        >
          {copied ? <Check size={18} /> : <Share2 size={18} />}
          {copied ? 'Copied!' : 'Share Game'}
        </button>

        <button
          onClick={onClose}
          style={{
            padding: '14px 20px',
            borderRadius: '16px',
            border: '1px solid rgba(255,255,255,0.1)',
            background: 'rgba(255,255,255,0.05)',
            color: 'rgba(255,255,255,0.6)',
            fontSize: '15px',
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: 'inherit',
            backdropFilter: 'blur(8px)',
          }}
        >
          Done
        </button>
      </div>

      <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginTop: '12px', textAlign: 'center' }}>
        Screenshot the card to post on socials
      </p>
    </div>
  )
}
