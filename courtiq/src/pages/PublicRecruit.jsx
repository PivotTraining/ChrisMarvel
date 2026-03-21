import { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { User, MapPin, School, GraduationCap, Video, ExternalLink, BarChart3, Trophy, Star } from 'lucide-react'
import { supabase } from '../lib/supabase'

export default function PublicRecruit() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function load() {
      setLoading(true)
      // Fetch profile by slug
      const { data: p, error: pErr } = await supabase
        .from('profiles')
        .select('*')
        .eq('recruiting_slug', slug)
        .eq('recruiting_profile_public', true)
        .single()

      if (pErr || !p) {
        setError('Profile not found')
        setLoading(false)
        return
      }
      setProfile(p)

      // Fetch their games
      const { data: g } = await supabase
        .from('games')
        .select('*')
        .eq('user_id', p.id)
        .order('game_date', { ascending: false })
        .limit(50)

      setGames(g || [])
      setLoading(false)
    }
    load()
  }, [slug])

  const stats = useMemo(() => {
    if (games.length === 0) return null
    const t = games.reduce((a, g) => ({
      pts: a.pts + (g.points || 0),
      reb: a.reb + (g.rebounds || 0),
      ast: a.ast + (g.assists || 0),
      stl: a.stl + (g.steals || 0),
      blk: a.blk + (g.blocks || 0),
      fgm: a.fgm + (g.fg_made || 0),
      fga: a.fga + (g.fg_attempted || 0),
      wins: a.wins + (g.result === 'Win' ? 1 : 0),
    }), { pts: 0, reb: 0, ast: 0, stl: 0, blk: 0, fgm: 0, fga: 0, wins: 0 })
    const n = games.length
    return {
      gp: n,
      ppg: (t.pts / n).toFixed(1),
      rpg: (t.reb / n).toFixed(1),
      apg: (t.ast / n).toFixed(1),
      spg: (t.stl / n).toFixed(1),
      bpg: (t.blk / n).toFixed(1),
      fgPct: t.fga > 0 ? Math.round((t.fgm / t.fga) * 100) : 0,
      winPct: Math.round((t.wins / n) * 100),
      best: Math.max(...games.map(g => g.points || 0)),
    }
  }, [games])

  const topGames = useMemo(() => {
    return [...games].sort((a, b) => (b.points || 0) - (a.points || 0)).slice(0, 5)
  }, [games])

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center p-6">
        <div className="text-center space-y-3">
          <p className="text-lg font-bold text-text-primary">Profile Not Found</p>
          <p className="text-sm text-text-muted">This recruiting profile doesn't exist or is private.</p>
          <button onClick={() => navigate('/welcome')} className="text-sm text-blue font-medium">Go to CourtIQ</button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Hero */}
      <div className="bg-gradient-to-b from-blue/10 to-transparent pt-12 pb-8 px-6">
        <div className="max-w-lg mx-auto text-center space-y-4">
          <div className="w-20 h-20 rounded-2xl bg-blue/10 border-2 border-blue-border mx-auto flex items-center justify-center">
            {profile.jersey_number ? (
              <span className="text-3xl font-black text-blue">#{profile.jersey_number}</span>
            ) : (
              <User size={36} className="text-blue" />
            )}
          </div>
          <div>
            <h1 className="text-2xl font-black text-text-primary">{profile.full_name || 'Player'}</h1>
            <div className="flex items-center justify-center gap-3 mt-1 flex-wrap text-sm text-text-secondary">
              {profile.position && <span className="font-bold text-blue">{profile.position}</span>}
              {profile.height && <span>{profile.height}</span>}
              {profile.weight && <span>{profile.weight} lbs</span>}
            </div>
            <div className="flex items-center justify-center gap-3 mt-1 flex-wrap text-xs text-text-muted">
              {profile.school && <span className="flex items-center gap-1"><School size={11} />{profile.school}</span>}
              {profile.graduation_year && <span className="flex items-center gap-1"><GraduationCap size={11} />'{String(profile.graduation_year).slice(-2)}</span>}
              {profile.city && <span className="flex items-center gap-1"><MapPin size={11} />{profile.city}{profile.state ? `, ${profile.state}` : ''}</span>}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-6 pb-12 space-y-6">
        {/* Bio */}
        {profile.recruiting_bio && (
          <div className="rounded-xl bg-bg-card border border-border p-4">
            <p className="text-sm text-text-secondary leading-relaxed">{profile.recruiting_bio}</p>
          </div>
        )}

        {/* Career Stats */}
        {stats && (
          <div className="rounded-xl bg-bg-card border border-border p-5 space-y-4">
            <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider flex items-center gap-2">
              <BarChart3 size={14} className="text-blue" />
              Career Averages ({stats.gp} games)
            </h2>
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: 'PPG', value: stats.ppg, highlight: true },
                { label: 'RPG', value: stats.rpg },
                { label: 'APG', value: stats.apg },
                { label: 'FG%', value: `${stats.fgPct}%` },
                { label: 'SPG', value: stats.spg },
                { label: 'BPG', value: stats.bpg },
                { label: 'Win%', value: `${stats.winPct}%` },
                { label: 'Career High', value: stats.best },
              ].map(({ label, value, highlight }) => (
                <div key={label} className="text-center">
                  <p className={`text-xl font-bold ${highlight ? 'text-blue' : 'text-text-primary'}`}>{value}</p>
                  <p className="text-[9px] text-text-muted uppercase">{label}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Top Performances */}
        {topGames.length > 0 && (
          <div className="rounded-xl bg-bg-card border border-border p-5 space-y-3">
            <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider flex items-center gap-2">
              <Trophy size={14} className="text-gold" />
              Top Performances
            </h2>
            {topGames.map((g, i) => {
              const d = new Date(g.game_date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
              return (
                <div key={g.id} className="flex items-center gap-3 py-1">
                  <div className={`w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold ${
                    i === 0 ? 'bg-gold/10 text-gold' : 'bg-bg-section text-text-muted'
                  }`}>
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-text-primary">
                      {g.points} PTS / {g.rebounds} REB / {g.assists} AST
                    </p>
                    <p className="text-[10px] text-text-muted">
                      {g.opponent ? `vs ${g.opponent} · ` : ''}{d}
                      {g.result ? ` · ${g.result}` : ''}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Highlight Video */}
        {profile.highlight_video_url && (
          <a
            href={profile.highlight_video_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-xl bg-bg-card border border-border p-4 hover:border-blue-border transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-danger/10 flex items-center justify-center shrink-0">
              <Video size={18} className="text-danger" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-text-primary">Watch Highlights</p>
              <p className="text-[10px] text-text-muted truncate">{profile.highlight_video_url}</p>
            </div>
            <ExternalLink size={16} className="text-text-muted shrink-0" />
          </a>
        )}

        {/* Footer */}
        <div className="text-center pt-4">
          <p className="text-[10px] text-text-muted">
            Powered by <span className="font-semibold text-blue">CourtIQ</span>
          </p>
        </div>
      </div>
    </div>
  )
}
