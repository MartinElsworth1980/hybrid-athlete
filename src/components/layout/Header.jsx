import { useLocation } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'

const pageTitles = {
  '/': 'Dashboard',
  '/program': 'Program',
  '/today': 'Today\'s Session',
  '/nutrition': 'Nutrition',
  '/recipes': 'Recipes',
  '/progress': 'Progress',
}

export default function Header() {
  const location = useLocation()
  const title = pageTitles[location.pathname] || 'Dashboard'

  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 24px',
        backgroundColor: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border)',
        position: 'sticky',
        top: 0,
        zIndex: 30,
      }}
    >
      <h1
        className="font-display"
        style={{
          fontSize: 24,
          fontWeight: 700,
          color: 'var(--text-primary)',
          margin: 0,
        }}
      >
        {title}
      </h1>
      <div className="header-theme-toggle">
        <ThemeToggle />
      </div>

      <style>{`
        @media (max-width: 767px) {
          .header-theme-toggle { display: none; }
        }
      `}</style>
    </header>
  )
}
