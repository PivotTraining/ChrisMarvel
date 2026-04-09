import { useState, useRef, useCallback } from 'react'
import { Share2, Download, X, Copy, Check } from 'lucide-react'

/*
 * SeasonShareCard — a branded, screenshot-ready card showing a player's
 * season stats. Designed to look fire on Instagram stories / Twitter.
 *
 * Usage: <SeasonShareCard player={...} stats={...} onClose={() => {}} />
 */

export default function SeasonShareCard({ player, stats, onClose }) {
  const [copied, setCopied] = useState(false)
  const cardRef = useRef(null)

  const {
    gamesPlayed = 0,
    ppg = 0,
    rpg = 0,
    apg = 0,
    spg = 0,
    bpg = 0,
    fgPct = 0,
    threePct = 0,
    ftPct = 0,
    winPct = 0,
  } = stats || {}

  const playerName = player?.full_name || 'Player'
  const position = player?.position || ''
  const level = player?.level || 1
  const streak = player?.streak_count || player?.current_streak || 0

  // Determine vibe
  const vibe =
    ppg >= 25 ? 'BUCKET' :
    ppg >= 18 ? 'HOOPER' :
    ppg >= 12 ? 'BALLER' :
    ppg >= 6 ? 'GRINDER' : 'ROOKIE'

  const vibeColor =
    vibe === 'BUCKET' ? '#FBBF24' :
    vibe === 'HOOPER' ? '#FF6B35' :
    vibe === 'BALLER' ? '#22C55E' :
    vibe === 'GRINDER' ? '#3B82F6' : '#8B8FAB'

  const shareText = `${playerName} | ${position} | Season Stats
${ppg} PPG / ${rpg} RPG / ${apg} APG
${fgPct}% FG / ${threePct}% 3PT
${gamesPlayed} Games | ${winPct}% Win Rate
Level ${level} | ${streak} Day Streak

#CourtIQ #HoopStats #BallIsLife`

  const handleShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: `${playerName} — CourtIQ Season Card`, text: shareText })
        return
      } catch { /* user cancelled */ }
    }
    try {
      await navigator.clipboard.writeText(shareText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback: textarea copy
      const ta = document.createElement('textarea')
      ta.value = shareText
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [shareText, playerName])

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
      }}
    >
      {/* The Card */}
      <div
        ref={cardRef}
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
            padding: '32px 24px 28px',
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
              width: '160px',
              height: '160px',
              borderRadius: '50%',
              background: `radial-gradient(circle, ${vibeColor}15, transparent 70%)`,
              pointerEvents: 'none',
            }}
          />

          {/* Header: Brand + Vibe badge */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <p style={{ fontSize: '14px', fontWeight: 900, letterSpacing: '1.5px', color: 'rgba(255,255,255,0.4)' }}>
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
              <span style={{ fontSize: '11px', fontWeight: 900, color: vibeColor, letterSpacing: '2px' }}>
                {vibe}
              </span>
            </div>
          </div>

          {/* Player name + position */}
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 900, letterSpacing: '-0.5px', color: '#F0F1F5', lineHeight: 1.1 }}>
              {playerName}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
              {position && (
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#FF6B35', padding: '2px 8px', borderRadius: '6px', background: 'rgba(255,107,53,0.12)' }}>
                  {position}
                </span>
              )}
              <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>
                Lv {level}
              </span>
              {streak > 0 && (
                <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>
                  {streak} day streak
                </span>
              )}
            </div>
          </div>

          {/* Hero stats: PTS / REB / AST */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            {[
              { value: ppg, label: 'PPG', color: '#FF6B35' },
              { value: rpg, label: 'RPG', color: '#3B82F6' },
              { value: apg, label: 'APG', color: '#22C55E' },
            ].map((s) => (
              <div key={s.label} style={{ textAlign: 'center', flex: 1 }}>
                <div style={{ fontSize: '36px', fontWeight: 900, color: s.color, letterSpacing: '-1.5px', lineHeight: 1 }}>
                  {s.value}
                </div>
                <div style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: '1.5px', marginTop: '4px' }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          {/* Shooting splits bar */}
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
              { value: `${fgPct}%`, label: 'FG' },
              { value: `${threePct}%`, label: '3PT' },
              { value: `${ftPct}%`, label: 'FT' },
              { value: `${winPct}%`, label: 'WIN' },
            ].map((s) => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '16px', fontWeight: 900, color: '#F0F1F5', letterSpacing: '-0.5px' }}>
                  {s.value}
                </div>
                <div style={{ fontSize: '9px', fontWeight: 600, color: 'rgba(255,255,255,0.3)', letterSpacing: '1px' }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          {/* Defensive line */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '20px' }}>
            {[
              { value: spg, label: 'SPG' },
              { value: bpg, label: 'BPG' },
              { value: gamesPlayed, label: 'GP' },
            ].map((s) => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '14px', fontWeight: 800, color: 'rgba(255,255,255,0.7)' }}>{s.value}</span>
                <span style={{ fontSize: '10px', fontWeight: 600, color: 'rgba(255,255,255,0.3)', marginLeft: '4px' }}>{s.label}</span>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <p style={{ fontSize: '9px', color: 'rgba(255,255,255,0.2)', fontWeight: 600, letterSpacing: '0.5px' }}>
              courtiq.app
            </p>
            <p style={{ fontSize: '9px', color: 'rgba(255,255,255,0.2)', fontWeight: 600 }}>
              {new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} Season
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
          {copied ? 'Copied!' : 'Share Stats'}
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
          Close
        </button>
      </div>

      <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginTop: '12px' }}>
        Screenshot the card to post on socials
      </p>
    </div>
  )
}
