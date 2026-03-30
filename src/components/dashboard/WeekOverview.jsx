import { Dumbbell, Wind, Sofa, Check } from 'lucide-react'
import { useCurrentDay } from '../../hooks/useCurrentDay'
import { useApp } from '../../context/AppContext'
import { weekSchedule } from '../../data/program'
import { getDateKey } from '../../utils/dates'
import { addDays, startOfWeek } from 'date-fns'

const typeIcons = { gym: Dumbbell, run: Wind, rest: Sofa }
const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export default function WeekOverview() {
  const { dayOfWeek } = useCurrentDay()
  const { sessionLogs, runLogs, startDate } = useApp()

  if (!startDate) return null

  const today = new Date()
  const monday = startOfWeek(today, { weekStartsOn: 1 })
  const orderedDays = [1, 2, 3, 4, 5, 6, 0]

  return (
    <div className="card">
      <h3
        className="font-display"
        style={{ fontWeight: 600, fontSize: 14, marginBottom: 16, color: 'var(--text-secondary)' }}
      >
        This Week
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8 }}>
        {orderedDays.map((dow, idx) => {
          const schedule = weekSchedule.find(d => d.dayOfWeek === dow)
          const date = addDays(monday, idx)
          const dateKey = getDateKey(date)
          const isToday = dow === dayOfWeek
          const isPast = date < new Date() && !isToday
          const isCompleted = schedule?.type === 'gym'
            ? sessionLogs[dateKey]?.completed
            : schedule?.type === 'run'
              ? !!runLogs[dateKey]
              : schedule?.type === 'rest'

          const Icon = typeIcons[schedule?.type] || Sofa

          return (
            <div
              key={dow}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 6,
                padding: '8px 0',
                borderRadius: 8,
                backgroundColor: isToday ? 'var(--accent-dim)' : 'transparent',
                border: isToday ? '1px solid var(--accent)' : '1px solid transparent',
              }}
            >
              <span style={{ fontSize: 10, fontWeight: 500, color: 'var(--text-muted)' }}>
                {dayLabels[idx]}
              </span>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: isCompleted ? 'var(--success-dim)' : 'var(--bg-secondary)',
                }}
              >
                {isCompleted ? (
                  <Check size={14} style={{ color: 'var(--success)' }} />
                ) : (
                  <Icon
                    size={14}
                    strokeWidth={1.75}
                    style={{
                      color: isToday ? 'var(--accent)' : isPast ? 'var(--text-muted)' : 'var(--text-secondary)',
                    }}
                  />
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
