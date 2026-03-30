import { useApp } from '../../context/AppContext'
import { useCurrentDay } from '../../hooks/useCurrentDay'
import { nutritionTargets } from '../../data/nutrition'
import { getDateKey } from '../../utils/dates'
import { macroPercentage } from '../../utils/macros'

function Ring({ value, max, color, radius }) {
  const circumference = 2 * Math.PI * radius
  const pct = macroPercentage(value, max)
  const offset = circumference - (pct / 100) * circumference

  return (
    <g>
      <circle
        cx="60"
        cy="60"
        r={radius}
        fill="none"
        stroke="var(--border)"
        strokeWidth="6"
      />
      <circle
        cx="60"
        cy="60"
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform="rotate(-90 60 60)"
        style={{
          '--ring-circumference': circumference,
          '--ring-offset': offset,
        }}
        className="ring-animated"
      />
    </g>
  )
}

export default function MacroRings() {
  const { macroLogs } = useApp()
  const { nutritionType } = useCurrentDay()
  const targets = nutritionTargets[nutritionType] || nutritionTargets.rest
  const todayKey = getDateKey()
  const todayLog = macroLogs[todayKey] || { protein: 0, carbs: 0, fat: 0 }

  const macros = [
    { key: 'protein', label: 'Protein', color: 'var(--accent)', radius: 52, value: todayLog.protein, max: targets.protein },
    { key: 'carbs', label: 'Carbs', color: 'var(--success)', radius: 42, value: todayLog.carbs, max: targets.carbs },
    { key: 'fat', label: 'Fat', color: 'var(--warning)', radius: 32, value: todayLog.fat, max: targets.fat },
  ]

  const totalCals = Math.round(todayLog.protein * 4 + todayLog.carbs * 4 + todayLog.fat * 9)

  return (
    <div className="card">
      <h3
        className="font-display"
        style={{ fontWeight: 600, fontSize: 14, marginBottom: 16, color: 'var(--text-secondary)' }}
      >
        Today's Macros
      </h3>
      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        <svg width="120" height="120" viewBox="0 0 120 120">
          {macros.map(m => (
            <Ring key={m.key} {...m} />
          ))}
          <text x="60" y="56" textAnchor="middle" fill="var(--text-primary)" className="font-mono" style={{ fontSize: 14, fontWeight: 600 }}>
            {totalCals}
          </text>
          <text x="60" y="72" textAnchor="middle" fill="var(--text-muted)" style={{ fontSize: 10 }}>
            / {targets.calories}
          </text>
        </svg>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {macros.map(m => (
            <div key={m.key} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: m.color }} />
              <span style={{ color: 'var(--text-secondary)' }}>{m.label}</span>
              <span className="font-mono" style={{ color: 'var(--text-primary)' }}>
                {m.value}/{m.max}g
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
