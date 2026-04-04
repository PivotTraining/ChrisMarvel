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
      className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around"
      style={{
        backgroundColor: 'rgba(15, 17, 23, 0.95)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderTop: '1px solid var(--color-border)',
        padding: '8px 4px',
        paddingBottom: 'max(8px, env(safe-area-inset-bottom))',
      }}
    >
      {tabs.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className="flex flex-col items-center gap-1"
          style={{ textDecoration: 'none', minWidth: '48px', padding: '6px 8px' }}
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
                style={{
                  fontSize: '10px',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? 'var(--color-accent)' : 'var(--color-text-sec)',
                  letterSpacing: '0.1px',
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
