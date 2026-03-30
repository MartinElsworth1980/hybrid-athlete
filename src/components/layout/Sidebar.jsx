import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Calendar, Dumbbell, Apple, ChefHat, TrendingUp } from 'lucide-react'
import ThemeToggle from './ThemeToggle'

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/program', icon: Calendar, label: 'Program' },
  { to: '/today', icon: Dumbbell, label: 'Today' },
  { to: '/nutrition', icon: Apple, label: 'Nutrition' },
  { to: '/recipes', icon: ChefHat, label: 'Recipes' },
  { to: '/progress', icon: TrendingUp, label: 'Progress' },
]

export default function Sidebar() {
  return (
    <>
      <aside
        className="sidebar-desktop"
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          height: '100%',
          width: 240,
          backgroundColor: 'var(--bg-secondary)',
          borderRight: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 40,
        }}
      >
        <div style={{ padding: 24 }}>
          <h1
            className="font-display"
            style={{
              fontSize: 20,
              fontWeight: 700,
              letterSpacing: '-0.025em',
              color: 'var(--text-primary)',
            }}
          >
            <span style={{ color: 'var(--accent)' }}>HYBRID</span> ATHLETE
          </h1>
          <p style={{ fontSize: 12, marginTop: 4, color: 'var(--text-muted)' }}>
            8-Week Program
          </p>
        </div>

        <nav style={{ flex: 1, padding: '0 12px' }}>
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px 16px',
                borderRadius: 8,
                marginBottom: 4,
                textDecoration: 'none',
                transition: 'background-color 150ms ease',
                backgroundColor: isActive ? 'var(--accent-dim)' : 'transparent',
                color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
              })}
            >
              <Icon size={20} strokeWidth={1.75} />
              <span style={{ fontSize: 14, fontWeight: 500 }}>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div style={{ padding: 16, borderTop: '1px solid var(--border)' }}>
          <ThemeToggle />
        </div>
      </aside>

      <style>{`
        @media (max-width: 767px) {
          .sidebar-desktop { display: none !important; }
        }
      `}</style>
    </>
  )
}
