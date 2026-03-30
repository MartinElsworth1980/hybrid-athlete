import { Target } from 'lucide-react'
import { useCurrentDay } from '../../hooks/useCurrentDay'

export default function PhaseCard() {
  const { currentWeek, weekConfig } = useCurrentDay()

  if (!weekConfig) return null

  const progressPct = ((currentWeek || 0) / 8) * 100

  return (
    <div className="card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <h3 className="font-display" style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-secondary)' }}>
          Program Progress
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Target size={14} strokeWidth={1.75} style={{ color: 'var(--accent)' }} />
          <span className="font-mono" style={{ fontSize: 12, color: 'var(--accent)' }}>
            Week {currentWeek}/8
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <span className="font-display" style={{ fontWeight: 700, fontSize: 18, color: 'var(--text-primary)' }}>
          {weekConfig.phase}
        </span>
        {weekConfig.isDeload && (
          <span
            style={{
              fontSize: 10,
              fontWeight: 600,
              padding: '2px 8px',
              borderRadius: 99,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              backgroundColor: 'var(--warning-dim)',
              color: 'var(--warning)',
            }}
          >
            Deload
          </span>
        )}
      </div>

      <div style={{ marginBottom: 8 }}>
        <div style={{ height: 8, borderRadius: 99, overflow: 'hidden', backgroundColor: 'var(--bg-secondary)' }}>
          <div
            className="progress-bar"
            style={{ height: '100%', borderRadius: 99, width: `${progressPct}%`, backgroundColor: 'var(--accent)' }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-muted)' }}>
        <span>RPE {weekConfig.rpeTarget}</span>
        <span>{weekConfig.mainLiftSets} sets on main lifts</span>
      </div>
    </div>
  )
}
