import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Calendar, Dumbbell, Apple, ChefHat, TrendingUp } from 'lucide-react'

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Home' },
  { to: '/program', icon: Calendar, label: 'Program' },
  { to: '/today', icon: Dumbbell, label: 'Today' },
  { to: '/nutrition', icon: Apple, label: 'Nutrition' },
  { to: '/recipes', icon: ChefHat, label: 'Recipes' },
  { to: '/progress', icon: TrendingUp, label: 'Progress' },
]

export default function BottomNav() {
  return (
    <>
      <nav
        className="bottom-nav-mobile"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          height: 64,
          backgroundColor: 'var(--bg-secondary)',
          borderTop: '1px solid var(--border)',
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
      >
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            style={({ isActive }) => ({
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
              padding: '4px 8px',
              textDecoration: 'none',
              color: isActive ? 'var(--accent)' : 'var(--text-muted)',
            })}
          >
            <Icon size={20} strokeWidth={1.75} />
            <span style={{ fontSize: 10, fontWeight: 500 }}>{label}</span>
          </NavLink>
        ))}
      </nav>

      <style>{`
        @media (min-width: 768px) {
          .bottom-nav-mobile { display: none !important; }
        }
      `}</style>
    </>
  )
}
