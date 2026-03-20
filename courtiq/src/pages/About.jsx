import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Activity, Shield, Heart, ExternalLink } from 'lucide-react'
import PageShell from '../components/ui/PageShell'
import SectionHeader from '../components/ui/SectionHeader'
import Card from '../components/ui/Card'

const VERSION = '1.0.0'

export default function About() {
  const navigate = useNavigate()

  return (
    <PageShell>
      <div className="flex flex-col gap-8">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-xl bg-bg-card border border-border flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <SectionHeader title="About" subtitle="CourtIQ Basketball Training" />
        </div>

        {/* Logo & Version */}
        <Card className="flex flex-col items-center text-center py-8 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-blue/10 border border-blue-border flex items-center justify-center">
            <Activity size={28} className="text-blue" />
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-text-primary">CourtIQ</h2>
            <p className="text-xs text-text-muted">Version {VERSION}</p>
          </div>
          <p className="text-sm text-text-secondary max-w-xs leading-relaxed">
            Your personal basketball development platform. Track games, log drills, analyze performance, and level up your game.
          </p>
        </Card>

        {/* Info Cards */}
        <div className="space-y-3">
          <Card className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-success/10 flex items-center justify-center shrink-0">
              <Shield size={16} className="text-success" />
            </div>
            <div>
              <p className="text-sm font-medium text-text-primary">Privacy First</p>
              <p className="text-xs text-text-muted mt-0.5">
                Your data stays yours. All information is stored securely and never shared with third parties.
              </p>
            </div>
          </Card>

          <Card className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-danger/10 flex items-center justify-center shrink-0">
              <Heart size={16} className="text-danger" />
            </div>
            <div>
              <p className="text-sm font-medium text-text-primary">Built for Players</p>
              <p className="text-xs text-text-muted mt-0.5">
                Designed by basketball players, for basketball players. From youth development to college recruiting.
              </p>
            </div>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center space-y-2 pt-4">
          <p className="text-[10px] text-text-muted">
            Made with passion for the game.
          </p>
          <p className="text-[10px] text-text-muted">
            &copy; {new Date().getFullYear()} CourtIQ. All rights reserved.
          </p>
        </div>
      </div>
    </PageShell>
  )
}
