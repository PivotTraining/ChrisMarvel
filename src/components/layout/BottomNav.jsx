import { NavLink } from 'react-router-dom'
import { Home, BookOpen, Target, Crosshair, Trophy, BookHeart } from 'lucide-react'

const tabs = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/training', icon: BookOpen, label: 'Train' },
  { to: '/drills', icon: Target, label: 'Drills' },
  { to: '/shots', icon: Crosshair, label: 'Shots' },
  { to: '/games', icon: Trophy, label: 'Games' },
  { to: '/journal', icon: BookHeart, label: 'Journal' },
]

export default function BottomNav() {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around glass-card"
      style={{
        borderRadius: 0,
        borderBottom: 'none',
        borderLeft: 'none',
        borderRight: 'none',
        borderTop: '1px solid var(--color-border)',
        padding: 'var(--space-1) 4px',
        paddingBottom: 'max(var(--space-1), env(safe-area-inset-bottom))',
      }}
    >
      {tabs.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className="flex flex-col items-center gap-1"
          style={{ textDecoration: 'none', minWidth: '48px', padding: '6px var(--space-1)' }}
        >
          {({ isActive }) => (
            <>
              <Icon
                size={22}
                className="transition-colors duration-200"
                style={{
                  color: isActive ? 'var(--color-accent)' : 'var(--color-text-sec)',
                  fill: isActive ? 'var(--color-accent)' : 'none',
                }}
              />
              <span
                className="t-caption"
                style={{
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? 'var(--color-accent)' : 'var(--color-text-sec)',
                  opacity: isActive ? 1 : 0.8,
                }}
              >
                {label}
              </span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
