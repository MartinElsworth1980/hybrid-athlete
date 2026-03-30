import { useNavigate } from 'react-router-dom'
import { Dumbbell, Wind, Sofa, ArrowRight } from 'lucide-react'
import { useCurrentDay } from '../../hooks/useCurrentDay'
import { useApp } from '../../context/AppContext'
import { getDateKey } from '../../utils/dates'

const sessionIcons = { gym: Dumbbell, run: Wind, rest: Sofa }

export default function TodayCard() {
  const navigate = useNavigate()
  const { todaySession, weekConfig, isBeforeStart } = useCurrentDay()
  const { sessionLogs, runLogs } = useApp()

  if (!todaySession) {
    return (
      <div className="card">
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
          Set your start date to begin training.
        </p>
      </div>
    )
  }

  const todayKey = getDateKey()
  const isCompleted = todaySession.type === 'gym'
    ? sessionLogs[todayKey]?.completed
    : todaySession.type === 'run'
      ? !!runLogs[todayKey]
      : false

  const Icon = sessionIcons[todaySession.type] || Dumbbell

  return (
    <div
      className="card card-hover"
      onClick={() => navigate('/today')}
      style={{
        cursor: 'pointer',
        borderColor: isCompleted ? 'var(--success)' : undefined,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <h3 className="font-display" style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-secondary)' }}>
          Today's Session
        </h3>
        {isCompleted && (
          <span
            style={{
              fontSize: 12,
              fontWeight: 500,
              padding: '2px 10px',
              borderRadius: 99,
              backgroundColor: 'var(--success-dim)',
              color: 'var(--success)',
            }}
          >
            Complete
          </span>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'var(--accent-dim)',
          }}
        >
          <Icon size={24} strokeWidth={1.75} style={{ color: 'var(--accent)' }} />
        </div>
        <div style={{ flex: 1 }}>
          <div className="font-display" style={{ fontWeight: 700, fontSize: 18, color: 'var(--text-primary)' }}>
            {todaySession.label}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            Week {weekConfig?.week} — {weekConfig?.phase}
            {weekConfig?.isDeload && ' (Deload)'}
          </div>
        </div>
        <ArrowRight size={20} strokeWidth={1.75} style={{ color: 'var(--text-muted)' }} />
      </div>
    </div>
  )
}
