import { User, Trophy, Star, ChevronRight } from 'lucide-react'
import PageShell from '../components/ui/PageShell'
import SectionHeader from '../components/ui/SectionHeader'
import Card from '../components/ui/Card'
import StatCard from '../components/ui/StatCard'

export default function Profile() {
  return (
    <PageShell>
      <div className="flex flex-col gap-8">
        <SectionHeader
          title="Profile"
          subtitle="Your player info and achievements."
        />

        {/* Avatar & Name */}
        <Card className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-blue/10 border border-blue-border flex items-center justify-center shrink-0">
            <User size={28} className="text-blue" />
          </div>
          <div className="space-y-1 min-w-0">
            <p className="text-lg font-bold text-text-primary">Player</p>
            <p className="text-sm text-text-secondary">Level 1 — 0 XP</p>
          </div>
        </Card>

        {/* Stats */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider">
            Totals
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <StatCard label="Games" value="0" icon={Trophy} />
            <StatCard label="Badges" value="0" icon={Star} />
          </div>
        </section>

        {/* Menu */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider">
            Settings
          </h2>
          <div className="space-y-3">
          {['Edit Profile', 'Notifications', 'About CourtIQ'].map((item) => (
            <Card key={item} className="flex items-center justify-between cursor-pointer card-hover">
              <span className="text-sm font-medium text-text-primary">{item}</span>
              <ChevronRight size={16} className="text-text-muted" />
            </Card>
          ))}
          </div>
        </section>
      </div>
    </PageShell>
  )
}
