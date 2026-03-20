import { ClipboardList, Plus } from 'lucide-react'
import PageShell from '../components/ui/PageShell'
import SectionHeader from '../components/ui/SectionHeader'
import EmptyState from '../components/ui/EmptyState'
import Button from '../components/ui/Button'

export default function Log() {
  return (
    <PageShell>
      <div className="flex flex-col gap-8">
        <SectionHeader
          title="Game Log"
          subtitle="Record and review your games."
          action={
            <Button size="sm" variant="secondary">
              <Plus size={16} />
              Add
            </Button>
          }
        />

        <EmptyState
          icon={ClipboardList}
          title="No games logged"
          description="After you log a game, your stats and history will show up here."
          action={
            <Button size="sm">
              <Plus size={16} />
              Log Your First Game
            </Button>
          }
        />
      </div>
    </PageShell>
  )
}
