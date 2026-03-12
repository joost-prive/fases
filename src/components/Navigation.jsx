import { NavLink } from 'react-router-dom'
import { Home, BookOpen, Clock, Users, Star } from 'lucide-react'

const navItems = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/vragen', icon: BookOpen, label: 'Vragen' },
  { to: '/tijdreis', icon: Clock, label: 'Tijdreis' },
  { to: '/kinderen', icon: Users, label: 'Kinderen' },
  { to: '/mijlpalen', icon: Star, label: 'Mijlpalen' },
]

export default function Navigation() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-border-light z-50 safe-bottom">
      <div className="max-w-lg mx-auto flex items-center justify-around px-2 py-2">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-2xl transition-all duration-200 min-w-[52px] ${
                isActive
                  ? 'text-primary'
                  : 'text-text-muted hover:text-text-dark'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`p-1.5 rounded-xl transition-all duration-200 ${isActive ? 'bg-primary/10' : ''}`}>
                  <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
                </div>
                <span className={`text-[10px] font-medium ${isActive ? 'font-semibold' : ''}`}>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
