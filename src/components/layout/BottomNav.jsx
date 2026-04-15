import { NavLink } from 'react-router-dom'
import { Home, Target, Zap, BarChart3 } from 'lucide-react'

// Four primary tabs. Game Log was removed because all game stats now flow
// directly into My IQ — having a separate log made the UI feel duplicative
// and was confusing users about where their data actually lived.
const tabs = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/gametime', icon: Zap, label: 'Gametime' },
  { to: '/drills', icon: Target, label: 'Drills' },
  { to: '/shots', icon: BarChart3, label: 'My IQ' },
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
