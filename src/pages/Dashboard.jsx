import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { useCurrentDay } from '../hooks/useCurrentDay'
import TodayCard from '../components/dashboard/TodayCard'
import WeekOverview from '../components/dashboard/WeekOverview'
import StreakBadge from '../components/dashboard/StreakBadge'
import MacroRings from '../components/dashboard/MacroRings'
import PhaseCard from '../components/dashboard/PhaseCard'
import { CalendarDays, RotateCcw } from 'lucide-react'

function Onboarding() {
  const { setStartDate } = useApp()
  const [date, setDate] = useState('')

  const handleStart = () => {
    if (date) setStartDate(date)
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <div className="card" style={{ maxWidth: 420, width: '100%', textAlign: 'center' }}>
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
            backgroundColor: 'var(--accent-dim)',
          }}
        >
          <CalendarDays size={32} style={{ color: 'var(--accent)' }} />
        </div>
        <h2
          className="font-display"
          style={{ fontWeight: 700, fontSize: 24, marginBottom: 8, color: 'var(--text-primary)' }}
        >
          Start Your Program
        </h2>
        <p style={{ fontSize: 14, marginBottom: 24, color: 'var(--text-secondary)' }}>
          Choose the Monday your 8-week hybrid athlete program begins.
        </p>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="font-mono"
          style={{
            width: '100%',
            padding: '12px 16px',
            borderRadius: 8,
            fontSize: 14,
            marginBottom: 16,
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border)',
            color: 'var(--text-primary)',
          }}
        />
        <button
          onClick={handleStart}
          disabled={!date}
          className="font-display"
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: 8,
            fontWeight: 600,
            fontSize: 14,
            border: 'none',
            cursor: date ? 'pointer' : 'default',
            backgroundColor: 'var(--accent)',
            color: '#000',
            opacity: date ? 1 : 0.4,
          }}
        >
          Begin Program
        </button>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { startDate, resetAllData } = useApp()
  const { currentWeek, weekConfig, isAfterEnd } = useCurrentDay()
  const [showReset, setShowReset] = useState(false)

  if (!startDate) return <Onboarding />

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {isAfterEnd && (
        <div className="card" style={{ borderColor: 'var(--success)' }}>
          <p className="font-display" style={{ fontWeight: 700, fontSize: 18, color: 'var(--success)' }}>
            Program Complete!
          </p>
          <p style={{ fontSize: 14, marginTop: 4, color: 'var(--text-secondary)' }}>
            You've completed the 8-week hybrid athlete program. Check your progress or reset to start again.
          </p>
        </div>
      )}

      <TodayCard />

      <div className="dashboard-grid-2col">
        <WeekOverview />
        <MacroRings />
      </div>

      <div className="dashboard-grid-2col">
        <PhaseCard />
        <StreakBadge />
      </div>

      {weekConfig?.notes && (
        <div className="card">
          <h3 className="font-display" style={{ fontWeight: 600, fontSize: 14, marginBottom: 8, color: 'var(--text-secondary)' }}>
            Coach's Note — Week {currentWeek}
          </h3>
          <p style={{ fontSize: 14, color: 'var(--text-primary)' }}>
            {weekConfig.notes}
          </p>
        </div>
      )}

      <div style={{ paddingTop: 16 }}>
        {!showReset ? (
          <button
            onClick={() => setShowReset(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 12,
              cursor: 'pointer',
              color: 'var(--text-muted)',
              background: 'none',
              border: 'none',
            }}
          >
            <RotateCcw size={12} />
            Reset Program
          </button>
        ) : (
          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 12, borderColor: 'var(--error)' }}>
            <p style={{ fontSize: 14, flex: 1, color: 'var(--text-secondary)' }}>
              This will erase all logs and reset the program. Are you sure?
            </p>
            <button
              onClick={() => { resetAllData(); setShowReset(false) }}
              style={{
                padding: '8px 16px',
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                border: 'none',
                backgroundColor: 'var(--error)',
                color: '#fff',
              }}
            >
              Yes, Reset
            </button>
            <button
              onClick={() => setShowReset(false)}
              style={{
                padding: '8px 16px',
                borderRadius: 8,
                fontSize: 12,
                cursor: 'pointer',
                border: 'none',
                backgroundColor: 'var(--bg-secondary)',
                color: 'var(--text-secondary)',
              }}
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      <style>{`
        .dashboard-grid-2col {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
        }
        @media (min-width: 768px) {
          .dashboard-grid-2col {
            grid-template-columns: 1fr 1fr;
          }
        }
      `}</style>
    </div>
  )
}
