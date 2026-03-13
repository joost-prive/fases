import { NavLink } from 'react-router-dom'
import { Home, BookOpen, Clock, Users, Star } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const navItems = [
  { to: '/', icon: Home, key: 'nav.home' },
  { to: '/vragen', icon: BookOpen, key: 'nav.questions' },
  { to: '/tijdreis', icon: Clock, key: 'nav.history' },
  { to: '/kinderen', icon: Users, key: 'nav.children' },
  { to: '/mijlpalen', icon: Star, key: 'nav.milestones' },
]

export default function Navigation() {
  const { t } = useTranslation()
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-border-light z-50 safe-bottom">
      <div className="max-w-lg mx-auto flex items-center justify-around px-2 py-2">
        {navItems.map(({ to, icon: Icon, key }) => (
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
                <span className={`text-[10px] font-medium ${isActive ? 'font-semibold' : ''}`}>{t(key)}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
