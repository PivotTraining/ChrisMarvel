import { NavLink } from 'react-router-dom'
import { Home, ClipboardList, Target, User } from 'lucide-react'

const icons = { Home, ClipboardList, Target, User }

const navItems = [
  { label: 'Home', path: '/', icon: 'Home' },
  { label: 'Log', path: '/log', icon: 'ClipboardList' },
  { label: 'Train', path: '/train', icon: 'Target' },
  { label: 'Profile', path: '/profile', icon: 'User' },
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-bg-primary/90 backdrop-blur-xl pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto flex max-w-md items-center justify-around px-2 py-2">
        {navItems.map(({ label, path, icon }) => {
          const Icon = icons[icon]
          return (
            <NavLink
              key={path}
              to={path}
              end={path === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-colors duration-200 ${
                  isActive
                    ? 'text-blue'
                    : 'text-text-muted hover:text-text-secondary'
                }`
              }
            >
              <Icon size={22} />
              <span className="text-[10px] font-medium">{label}</span>
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}
