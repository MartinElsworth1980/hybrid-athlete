import { Flame } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { calculateStreak } from '../../utils/streak'

export default function StreakBadge() {
  const { sessionLogs, runLogs } = useApp()
  const streak = calculateStreak(sessionLogs, runLogs)

  return (
    <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: streak > 0 ? 'var(--accent-dim)' : 'var(--bg-secondary)',
        }}
      >
        <Flame
          size={24}
          strokeWidth={1.75}
          style={{ color: streak > 0 ? 'var(--accent)' : 'var(--text-muted)' }}
        />
      </div>
      <div>
        <div className="font-mono" style={{ fontSize: 28, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>
          {streak}
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
          day streak
        </div>
      </div>
    </div>
  )
}
