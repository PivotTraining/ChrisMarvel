import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Users, Plus, LogIn, Copy, Check, Trophy, Crown, Shield, User, ChevronRight, Trash2, LogOut as LogOutIcon } from 'lucide-react'
import { useTeams } from '../hooks/useTeams'
import { useToast } from '../contexts/ToastContext'
import { useAuth } from '../contexts/AuthContext'
import PageShell from '../components/ui/PageShell'
import SectionHeader from '../components/ui/SectionHeader'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

const ROLE_CONFIG = {
  owner: { icon: Crown, color: 'text-gold', label: 'Owner' },
  coach: { icon: Shield, color: 'text-blue', label: 'Coach' },
  player: { icon: User, color: 'text-text-secondary', label: 'Player' },
}

export default function Team() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { teams, loading, createTeam, joinTeam, leaveTeam, deleteTeam } = useTeams()
  const toast = useToast()

  const [mode, setMode] = useState(null) // null | 'create' | 'join'
  const [teamName, setTeamName] = useState('')
  const [teamDesc, setTeamDesc] = useState('')
  const [joinCode, setJoinCode] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [copiedCode, setCopiedCode] = useState(null)

  async function handleCreate(e) {
    e.preventDefault()
    if (!teamName.trim()) return
    setSubmitting(true)
    const { data, error } = await createTeam(teamName.trim(), teamDesc.trim())
    setSubmitting(false)
    if (error) {
      toast(error.message || 'Failed to create team')
    } else {
      toast('Team created!')
      setMode(null)
      setTeamName('')
      setTeamDesc('')
    }
  }

  async function handleJoin(e) {
    e.preventDefault()
    if (!joinCode.trim()) return
    setSubmitting(true)
    const { error } = await joinTeam(joinCode.trim())
    setSubmitting(false)
    if (error) {
      toast(error.message || 'Failed to join team')
    } else {
      toast('Joined team!')
      setMode(null)
      setJoinCode('')
    }
  }

  function copyCode(code) {
    navigator.clipboard.writeText(code).then(() => {
      setCopiedCode(code)
      setTimeout(() => setCopiedCode(null), 2000)
    })
  }

  async function handleLeave(teamId) {
    const { error } = await leaveTeam(teamId)
    if (!error) toast('Left team')
  }

  async function handleDelete(teamId) {
    const { error } = await deleteTeam(teamId)
    if (!error) toast('Team deleted')
  }

  return (
    <PageShell>
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-xl bg-bg-card border border-border flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft size={20} />
          </button>
          <SectionHeader
            title="Teams"
            subtitle="Create or join a team to compare stats."
          />
        </div>

        {/* Action Buttons */}
        {!mode && (
          <div className="grid grid-cols-2 gap-3">
            <Button variant="secondary" fullWidth onClick={() => setMode('create')}>
              <Plus size={16} />
              Create Team
            </Button>
            <Button variant="secondary" fullWidth onClick={() => setMode('join')}>
              <LogIn size={16} />
              Join Team
            </Button>
          </div>
        )}

        {/* Create Form */}
        {mode === 'create' && (
          <Card className="space-y-4">
            <h2 className="text-sm font-semibold text-text-primary">Create a Team</h2>
            <form onSubmit={handleCreate} className="space-y-3">
              <input
                type="text"
                value={teamName}
                onChange={e => setTeamName(e.target.value)}
                placeholder="Team name"
                maxLength={40}
                className="w-full rounded-xl bg-bg-section border border-border px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-blue-border transition-colors"
              />
              <input
                type="text"
                value={teamDesc}
                onChange={e => setTeamDesc(e.target.value)}
                placeholder="Description (optional)"
                maxLength={100}
                className="w-full rounded-xl bg-bg-section border border-border px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-blue-border transition-colors"
              />
              <div className="flex gap-2">
                <Button type="submit" fullWidth disabled={submitting || !teamName.trim()}>
                  {submitting ? 'Creating...' : 'Create'}
                </Button>
                <Button type="button" variant="ghost" onClick={() => setMode(null)}>Cancel</Button>
              </div>
            </form>
          </Card>
        )}

        {/* Join Form */}
        {mode === 'join' && (
          <Card className="space-y-4">
            <h2 className="text-sm font-semibold text-text-primary">Join a Team</h2>
            <form onSubmit={handleJoin} className="space-y-3">
              <input
                type="text"
                value={joinCode}
                onChange={e => setJoinCode(e.target.value.toUpperCase())}
                placeholder="Enter 6-letter team code"
                maxLength={6}
                className="w-full rounded-xl bg-bg-section border border-border px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-blue-border transition-colors tracking-widest text-center font-mono text-lg"
              />
              <div className="flex gap-2">
                <Button type="submit" fullWidth disabled={submitting || joinCode.trim().length < 6}>
                  {submitting ? 'Joining...' : 'Join'}
                </Button>
                <Button type="button" variant="ghost" onClick={() => setMode(null)}>Cancel</Button>
              </div>
            </form>
          </Card>
        )}

        {/* Team List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-6 h-6 border-2 border-blue border-t-transparent rounded-full animate-spin" />
          </div>
        ) : teams.length === 0 && !mode ? (
          <Card>
            <div className="flex flex-col items-center py-10 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-blue/10 border border-blue-border flex items-center justify-center">
                <Users size={24} className="text-blue" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-text-primary">No teams yet</p>
                <p className="text-xs text-text-muted">Create a team or join one with a code to compare stats with teammates.</p>
              </div>
            </div>
          </Card>
        ) : (
          <section className="space-y-4">
            <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider">Your Teams</h2>
            {teams.map(team => {
              const roleConfig = ROLE_CONFIG[team.role] || ROLE_CONFIG.player
              const RoleIcon = roleConfig.icon
              const isOwner = team.role === 'owner'

              return (
                <Card key={team.id} className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-blue/10 border border-blue-border flex items-center justify-center shrink-0">
                        <Users size={18} className="text-blue" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-text-primary truncate">{team.name}</p>
                        <div className="flex items-center gap-1.5">
                          <RoleIcon size={10} className={roleConfig.color} />
                          <span className="text-[10px] text-text-muted">{roleConfig.label}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => navigate(`/team/${team.id}`)}
                      className="p-2 rounded-lg text-text-muted hover:text-text-primary transition-colors"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>

                  {/* Team Code */}
                  <div className="flex items-center justify-between bg-bg-section rounded-lg px-3 py-2">
                    <div>
                      <p className="text-[10px] text-text-muted uppercase">Team Code</p>
                      <p className="text-sm font-mono font-bold text-text-primary tracking-widest">{team.code}</p>
                    </div>
                    <button
                      onClick={() => copyCode(team.code)}
                      className="p-2 rounded-lg text-text-muted hover:text-blue transition-colors"
                      aria-label="Copy code"
                    >
                      {copiedCode === team.code ? <Check size={14} className="text-success" /> : <Copy size={14} />}
                    </button>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button size="sm" variant="secondary" className="flex-1" onClick={() => navigate(`/team/${team.id}`)}>
                      <Trophy size={14} />
                      Leaderboard
                    </Button>
                    {isOwner ? (
                      <Button size="sm" variant="danger" onClick={() => handleDelete(team.id)}>
                        <Trash2 size={14} />
                      </Button>
                    ) : (
                      <Button size="sm" variant="ghost" onClick={() => handleLeave(team.id)}>
                        <LogOutIcon size={14} />
                      </Button>
                    )}
                  </div>
                </Card>
              )
            })}
          </section>
        )}
      </div>
    </PageShell>
  )
}
