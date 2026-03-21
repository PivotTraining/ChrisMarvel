import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Eye, EyeOff, Save, User, MapPin, School, Hash, Ruler, Weight, GraduationCap, Video, Globe, Copy, Check, ExternalLink } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useGames } from '../hooks/useGames'
import { useDrills } from '../hooks/useDrills'
import { useShots } from '../hooks/useShots'
import { useToast } from '../contexts/ToastContext'
import { supabase } from '../lib/supabase'
import SkillRadar from '../components/SkillRadar'
import PageShell from '../components/ui/PageShell'
import SectionHeader from '../components/ui/SectionHeader'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

function generateSlug(name) {
  return (name || 'player')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    + '-' + Math.random().toString(36).slice(2, 6)
}

export default function RecruitingProfile() {
  const navigate = useNavigate()
  const { profile, refreshProfile } = useAuth()
  const { games } = useGames()
  const { sessions } = useDrills()
  const { shots } = useShots()
  const toast = useToast()

  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [copied, setCopied] = useState(false)

  const [form, setForm] = useState({
    height: profile?.height || '',
    weight: profile?.weight || '',
    graduation_year: profile?.graduation_year || '',
    school: profile?.school || '',
    city: profile?.city || '',
    state: profile?.state || '',
    jersey_number: profile?.jersey_number || '',
    highlight_video_url: profile?.highlight_video_url || '',
    recruiting_bio: profile?.recruiting_bio || '',
    recruiting_profile_public: profile?.recruiting_profile_public || false,
  })

  function set(field) {
    return (e) => setForm(prev => ({ ...prev, [field]: e.target ? e.target.value : e }))
  }

  async function handleSave() {
    setSaving(true)
    const updates = { ...form }
    if (form.recruiting_profile_public && !profile?.recruiting_slug) {
      updates.recruiting_slug = generateSlug(profile?.full_name)
    }
    if (form.graduation_year) {
      updates.graduation_year = parseInt(form.graduation_year) || null
    }

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', profile.id)

    setSaving(false)
    if (error) {
      toast(error.message || 'Failed to save')
    } else {
      toast('Profile updated!')
      refreshProfile()
      setEditing(false)
    }
  }

  async function togglePublic() {
    const newVal = !form.recruiting_profile_public
    setForm(prev => ({ ...prev, recruiting_profile_public: newVal }))
    const updates = { recruiting_profile_public: newVal }
    if (newVal && !profile?.recruiting_slug) {
      updates.recruiting_slug = generateSlug(profile?.full_name)
    }
    await supabase.from('profiles').update(updates).eq('id', profile.id)
    refreshProfile()
    toast(newVal ? 'Profile is now public' : 'Profile is now private')
  }

  function copyLink() {
    const slug = profile?.recruiting_slug
    if (!slug) return
    const url = `${window.location.origin}${import.meta.env.BASE_URL}recruit/${slug}`
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  // Career stats
  const careerStats = useMemo(() => {
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
      bestGame: Math.max(...games.map(g => g.points || 0)),
    }
  }, [games])

  // Top 3 games
  const topGames = useMemo(() => {
    return [...games].sort((a, b) => (b.points || 0) - (a.points || 0)).slice(0, 3)
  }, [games])

  const isPublic = form.recruiting_profile_public

  return (
    <PageShell>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => navigate(-1)} className="w-10 h-10 rounded-xl bg-bg-card border border-border flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors" aria-label="Go back">
            <ArrowLeft size={20} />
          </button>
          <SectionHeader
            title="Recruiting Profile"
            subtitle={isPublic ? 'Visible to coaches' : 'Private'}
          />
        </div>

        {/* Visibility toggle */}
        <Card className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isPublic ? <Eye size={18} className="text-success" /> : <EyeOff size={18} className="text-text-muted" />}
            <div>
              <p className="text-sm font-semibold text-text-primary">{isPublic ? 'Public' : 'Private'}</p>
              <p className="text-[10px] text-text-muted">{isPublic ? 'Coaches can view your profile' : 'Only you can see this'}</p>
            </div>
          </div>
          <button
            onClick={togglePublic}
            className={`w-10 h-6 rounded-full flex items-center px-0.5 transition-colors ${isPublic ? 'bg-success' : 'bg-bg-section border border-border'}`}
          >
            <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${isPublic ? 'translate-x-4' : 'translate-x-0'}`} />
          </button>
        </Card>

        {/* Share link */}
        {isPublic && profile?.recruiting_slug && (
          <Card className="flex items-center gap-3">
            <Globe size={16} className="text-blue shrink-0" />
            <p className="text-xs text-text-muted truncate flex-1 font-mono">
              /recruit/{profile.recruiting_slug}
            </p>
            <button onClick={copyLink} className="p-2 rounded-lg text-text-muted hover:text-blue transition-colors shrink-0">
              {copied ? <Check size={14} className="text-success" /> : <Copy size={14} />}
            </button>
          </Card>
        )}

        {/* Player Card Preview */}
        <Card className="space-y-4 border-blue-border/20">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-blue/10 border border-blue-border flex items-center justify-center shrink-0">
              {profile?.jersey_number || form.jersey_number ? (
                <span className="text-2xl font-black text-blue">#{profile?.jersey_number || form.jersey_number}</span>
              ) : (
                <User size={28} className="text-blue" />
              )}
            </div>
            <div className="space-y-1 min-w-0">
              <p className="text-lg font-bold text-text-primary">{profile?.full_name || 'Player'}</p>
              <div className="flex items-center gap-2 flex-wrap text-xs text-text-muted">
                {profile?.position && <span className="font-semibold text-blue">{profile.position}</span>}
                {(profile?.height || form.height) && <span>{profile?.height || form.height}</span>}
                {(profile?.weight || form.weight) && <span>{profile?.weight || form.weight} lbs</span>}
              </div>
              <div className="flex items-center gap-2 flex-wrap text-[10px] text-text-muted">
                {(profile?.school || form.school) && (
                  <span className="flex items-center gap-0.5"><School size={9} />{profile?.school || form.school}</span>
                )}
                {(profile?.graduation_year || form.graduation_year) && (
                  <span className="flex items-center gap-0.5"><GraduationCap size={9} />Class of {profile?.graduation_year || form.graduation_year}</span>
                )}
                {(profile?.city || form.city) && (
                  <span className="flex items-center gap-0.5"><MapPin size={9} />{profile?.city || form.city}{profile?.state || form.state ? `, ${profile?.state || form.state}` : ''}</span>
                )}
              </div>
            </div>
          </div>

          {(profile?.recruiting_bio || form.recruiting_bio) && (
            <p className="text-xs text-text-secondary leading-relaxed">{profile?.recruiting_bio || form.recruiting_bio}</p>
          )}
        </Card>

        {/* Edit form */}
        {editing ? (
          <Card className="space-y-4">
            <h2 className="text-sm font-semibold text-text-primary">Edit Info</h2>
            <div className="grid grid-cols-2 gap-3">
              <InputField icon={Ruler} label="Height" placeholder="6'2&quot;" value={form.height} onChange={set('height')} />
              <InputField icon={Weight} label="Weight" placeholder="175" value={form.weight} onChange={set('weight')} />
              <InputField icon={Hash} label="Jersey #" placeholder="23" value={form.jersey_number} onChange={set('jersey_number')} />
              <InputField icon={GraduationCap} label="Grad Year" placeholder="2027" value={form.graduation_year} onChange={set('graduation_year')} type="number" />
              <InputField icon={School} label="School" placeholder="Lincoln HS" value={form.school} onChange={set('school')} className="col-span-2" />
              <InputField icon={MapPin} label="City" placeholder="Los Angeles" value={form.city} onChange={set('city')} />
              <InputField icon={MapPin} label="State" placeholder="CA" value={form.state} onChange={set('state')} />
              <div className="col-span-2">
                <InputField icon={Video} label="Highlight Video URL" placeholder="https://youtube.com/..." value={form.highlight_video_url} onChange={set('highlight_video_url')} />
              </div>
            </div>
            <div className="space-y-1.5">
              <p className="text-xs text-text-muted">Bio</p>
              <textarea
                value={form.recruiting_bio}
                onChange={set('recruiting_bio')}
                placeholder="Tell coaches about your game, leadership, and goals..."
                rows={3}
                maxLength={500}
                className="w-full rounded-xl bg-bg-section border border-border px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-blue-border resize-none transition-colors"
              />
              <p className="text-[10px] text-text-muted text-right">{(form.recruiting_bio || '').length}/500</p>
            </div>
            <div className="flex gap-2">
              <Button fullWidth onClick={handleSave} disabled={saving}>
                <Save size={14} />
                {saving ? 'Saving...' : 'Save'}
              </Button>
              <Button variant="ghost" onClick={() => setEditing(false)}>Cancel</Button>
            </div>
          </Card>
        ) : (
          <Button variant="secondary" fullWidth onClick={() => setEditing(true)}>
            Edit Recruiting Info
          </Button>
        )}

        {/* Career Stats */}
        {careerStats && (
          <Card className="space-y-4">
            <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider">Career Averages</h2>
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: 'PPG', value: careerStats.ppg },
                { label: 'RPG', value: careerStats.rpg },
                { label: 'APG', value: careerStats.apg },
                { label: 'FG%', value: `${careerStats.fgPct}%` },
                { label: 'SPG', value: careerStats.spg },
                { label: 'BPG', value: careerStats.bpg },
                { label: 'GP', value: careerStats.gp },
                { label: 'Win%', value: `${careerStats.winPct}%` },
              ].map(({ label, value }) => (
                <div key={label} className="text-center space-y-0.5">
                  <p className="text-lg font-bold text-text-primary">{value}</p>
                  <p className="text-[9px] text-text-muted uppercase">{label}</p>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Skill Radar */}
        <Card>
          <SkillRadar games={games} drills={sessions} shots={shots} />
        </Card>

        {/* Top Games */}
        {topGames.length > 0 && (
          <Card className="space-y-3">
            <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider">Top Performances</h2>
            {topGames.map((g, i) => {
              const d = new Date(g.game_date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
              return (
                <div key={g.id} className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                    i === 0 ? 'bg-gold/10 text-gold' : i === 1 ? 'bg-bg-section text-text-secondary' : 'bg-bg-section text-text-muted'
                  }`}>
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-text-primary">
                      {g.points} PTS
                      {g.rebounds >= 5 ? ` / ${g.rebounds} REB` : ''}
                      {g.assists >= 5 ? ` / ${g.assists} AST` : ''}
                    </p>
                    <p className="text-[10px] text-text-muted">{g.opponent ? `vs ${g.opponent} · ` : ''}{d}</p>
                  </div>
                  {g.result && (
                    <span className={`text-[10px] font-bold ${g.result === 'Win' ? 'text-success' : 'text-danger'}`}>{g.result[0]}</span>
                  )}
                </div>
              )
            })}
          </Card>
        )}

        {/* Highlight video */}
        {(profile?.highlight_video_url || form.highlight_video_url) && (
          <Card className="flex items-center gap-3">
            <Video size={18} className="text-blue shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-text-primary">Highlight Video</p>
              <p className="text-[10px] text-text-muted truncate">{profile?.highlight_video_url || form.highlight_video_url}</p>
            </div>
            <a
              href={profile?.highlight_video_url || form.highlight_video_url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg text-blue hover:bg-blue/10 transition-colors shrink-0"
            >
              <ExternalLink size={14} />
            </a>
          </Card>
        )}
      </div>
    </PageShell>
  )
}

function InputField({ icon: Icon, label, className = '', ...props }) {
  return (
    <div className={`space-y-1 ${className}`}>
      <p className="text-[10px] text-text-muted flex items-center gap-1">{Icon && <Icon size={9} />}{label}</p>
      <input
        {...props}
        className="w-full rounded-lg bg-bg-section border border-border px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-blue-border transition-colors"
      />
    </div>
  )
}
