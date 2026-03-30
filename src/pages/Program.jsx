import { useState } from 'react'
import { useCurrentDay } from '../hooks/useCurrentDay'
import { useApp } from '../context/AppContext'
import { weekConfigs, weekSchedule, exercises as exerciseData } from '../data/program'
import { getDateKey } from '../utils/dates'
import { addDays, parseISO, format } from 'date-fns'
import { ChevronDown, ChevronUp, Dumbbell, Wind, Sofa, Check, Calendar } from 'lucide-react'

const typeIcons = { gym: Dumbbell, run: Wind, rest: Sofa }
const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const orderedDays = [1, 2, 3, 4, 5, 6, 0] // Mon-Sun

function WeekRow({ weekConfig, startDate, isCurrentWeek, sessionLogs, runLogs }) {
  const [expanded, setExpanded] = useState(isCurrentWeek)
  const weekStart = addDays(parseISO(startDate), (weekConfig.week - 1) * 7)

  // Count completed sessions this week
  const completedCount = orderedDays.reduce((count, dow, idx) => {
    const date = addDays(weekStart, idx)
    const key = getDateKey(date)
    const schedule = weekSchedule.find(d => d.dayOfWeek === dow)
    if (schedule?.type === 'rest') return count + 1
    if (schedule?.type === 'gym' && sessionLogs[key]?.completed) return count + 1
    if (schedule?.type === 'run' && runLogs[key]) return count + 1
    return count
  }, 0)

  return (
    <div className="card">
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center font-mono font-bold text-sm"
            style={{
              backgroundColor: isCurrentWeek ? 'var(--accent-dim)' : 'var(--bg-secondary)',
              color: isCurrentWeek ? 'var(--accent)' : 'var(--text-secondary)',
            }}
          >
            W{weekConfig.week}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                {weekConfig.phase}
              </span>
              {weekConfig.isDeload && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ backgroundColor: 'var(--warning-dim)', color: 'var(--warning)' }}>
                  Deload
                </span>
              )}
            </div>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {format(weekStart, 'MMM d')} — RPE {weekConfig.rpeTarget}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>
            {completedCount}/7
          </span>
          {expanded ? <ChevronUp size={16} style={{ color: 'var(--text-muted)' }} /> : <ChevronDown size={16} style={{ color: 'var(--text-muted)' }} />}
        </div>
      </div>

      {expanded && (
        <div className="mt-4 space-y-2">
          {orderedDays.map((dow, idx) => {
            const schedule = weekSchedule.find(d => d.dayOfWeek === dow)
            const date = addDays(weekStart, idx)
            const key = getDateKey(date)
            const Icon = typeIcons[schedule?.type] || Sofa
            const isCompleted = schedule?.type === 'gym'
              ? sessionLogs[key]?.completed
              : schedule?.type === 'run'
                ? !!runLogs[key]
                : schedule?.type === 'rest'

            // Get run details for this week
            let detail = ''
            if (schedule?.type === 'run') {
              if (schedule.sessionKey === 'long_run') detail = `${weekConfig.longRun.km} km`
              else if (schedule.sessionKey === 'easy_run') detail = `${weekConfig.easyRun.km} km`
              else if (schedule.sessionKey === 'quality_run') detail = `${weekConfig.qualityRun.km} km`
            } else if (schedule?.type === 'gym') {
              detail = `${weekConfig.mainLiftSets} sets • RPE ${weekConfig.rpeTarget}`
            }

            return (
              <div
                key={dow}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg"
                style={{ backgroundColor: 'var(--bg-secondary)' }}
              >
                <span className="text-xs font-medium w-8" style={{ color: 'var(--text-muted)' }}>
                  {dayLabels[idx]}
                </span>
                <Icon size={14} style={{ color: isCompleted ? 'var(--success)' : 'var(--text-secondary)' }} />
                <span className="flex-1 text-sm" style={{ color: 'var(--text-primary)' }}>
                  {schedule?.label}
                </span>
                {detail && (
                  <span className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>
                    {detail}
                  </span>
                )}
                {isCompleted && <Check size={14} style={{ color: 'var(--success)' }} />}
              </div>
            )
          })}

          {/* Week notes */}
          {weekConfig.notes && (
            <p className="text-xs px-3 pt-2" style={{ color: 'var(--text-muted)' }}>
              {weekConfig.notes}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export default function Program() {
  const { currentWeek } = useCurrentDay()
  const { startDate, sessionLogs, runLogs } = useApp()

  if (!startDate) {
    return (
      <div className="card text-center py-12">
        <Calendar size={32} style={{ color: 'var(--text-muted)' }} className="mx-auto mb-3" />
        <p style={{ color: 'var(--text-secondary)' }}>Set your start date on the Dashboard to see your program.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {weekConfigs.map(wc => (
        <WeekRow
          key={wc.week}
          weekConfig={wc}
          startDate={startDate}
          isCurrentWeek={wc.week === currentWeek}
          sessionLogs={sessionLogs}
          runLogs={runLogs}
        />
      ))}
    </div>
  )
}
