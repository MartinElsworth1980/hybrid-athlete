import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import BottomNav from './BottomNav'
import Header from './Header'

export default function Layout() {
  return (
    <div className="min-h-dvh" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <Sidebar />
      <div
        className="flex flex-col min-h-dvh"
        style={{ marginLeft: 'var(--sidebar-width, 0px)' }}
      >
        <Header />
        <main
          className="flex-1"
          style={{
            padding: '24px',
            paddingBottom: '96px',
            maxWidth: 1200,
            width: '100%',
            margin: '0 auto',
          }}
        >
          <Outlet />
        </main>
      </div>
      <BottomNav />

      {/* Set sidebar width for desktop via media query */}
      <style>{`
        @media (min-width: 768px) {
          :root { --sidebar-width: 240px; }
          main { padding-bottom: 24px !important; }
        }
        @media (max-width: 767px) {
          :root { --sidebar-width: 0px; }
        }
      `}</style>
    </div>
  )
}
