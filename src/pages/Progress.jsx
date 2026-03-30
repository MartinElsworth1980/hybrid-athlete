import { useMemo } from 'react'
import { useApp } from '../context/AppContext'
import { useCurrentDay } from '../hooks/useCurrentDay'
import { weekSchedule, weekConfigs } from '../data/program'
import { getDateKey } from '../utils/dates'
import { addDays, parseISO, format, isBefore, isToday, startOfDay } from 'date-fns'
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'
import { Check, X, Minus, MapPin, Clock, Gauge, Scale, TrendingUp } from 'lucide-react'

const orderedDays = [1, 2, 3, 4, 5, 6, 0]

function WeekGrid({ startDate, sessionLogs, runLogs }) {
  if (!startDate) return null

  const start = parseISO(startDate)
  const today = startOfDay(new Date())

  return (
    <div className="card">
      <h3 className="font-display font-semibold text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
        56-Day Grid
      </h3>
      <div className="grid grid-cols-7 gap-1.5">
        {/* Header */}
        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
          <div key={i} className="text-center text-[10px] font-medium pb-1" style={{ color: 'var(--text-muted)' }}>{d}</div>
        ))}
        {/* Days */}
        {Array.from({ length: 56 }, (_, i) => {
          const date = addDays(start, i)
          const key = getDateKey(date)
          const dow = date.getDay()
          const schedule = weekSchedule.find(d => d.dayOfWeek === dow)
          const isRest = schedule?.type === 'rest'
          const isPast = isBefore(date, today) && !isToday(date)
          const isTodayDate = isToday(date)
          const isCompleted = isRest
            || (schedule?.type === 'gym' && sessionLogs[key]?.completed)
            || (schedule?.type === 'run' && !!runLogs[key])
          const isMissed = isPast && !isCompleted

          let bgColor = 'var(--bg-secondary)'
          if (isTodayDate) bgColor = 'var(--accent-dim)'
          else if (isCompleted && !isRest) bgColor = 'var(--success-dim)'
          else if (isRest && isPast) bgColor = 'var(--bg-card-hover)'
          else if (isMissed) bgColor = 'var(--error-dim)'

          let borderColor = 'transparent'
          if (isTodayDate) borderColor = 'var(--accent)'

          return (
            <div
              key={i}
              className="aspect-square rounded-md flex items-center justify-center"
              style={{ backgroundColor: bgColor, border: `1.5px solid ${borderColor}` }}
              title={`${format(date, 'MMM d')} — ${schedule?.label || 'Unknown'}`}
            >
              {isCompleted && !isRest && <Check size={10} style={{ color: 'var(--success)' }} />}
              {isMissed && <X size={10} style={{ color: 'var(--error)' }} />}
              {isRest && isPast && <Minus size={8} style={{ color: 'var(--text-muted)' }} />}
            </div>
          )
        })}
      </div>
      {/* Week labels */}
      <div className="flex justify-between mt-2 px-1">
        {Array.from({ length: 8 }, (_, i) => (
          <span key={i} className="text-[9px] font-mono" style={{ color: 'var(--text-muted)' }}>W{i + 1}</span>
        ))}
      </div>
    </div>
  )
}

function RunHistory({ runLogs }) {
  const entries = useMemo(() =>
    Object.entries(runLogs)
      .sort(([a], [b]) => b.localeCompare(a))
      .slice(0, 20),
    [runLogs]
  )

  if (entries.length === 0) {
    return (
      <div className="card">
        <h3 className="font-display font-semibold text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>Run Log</h3>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No runs logged yet.</p>
      </div>
    )
  }

  return (
    <div className="card">
      <h3 className="font-display font-semibold text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
        Run Log
      </h3>
      <div className="space-y-2">
        {entries.map(([date, log]) => (
          <div key={date} className="flex items-center gap-3 px-3 py-2 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <span className="font-mono text-xs w-16" style={{ color: 'var(--text-muted)' }}>
              {format(parseISO(date), 'MMM d')}
            </span>
            <div className="flex items-center gap-1">
              <MapPin size={11} style={{ color: 'var(--accent)' }} />
              <span className="font-mono text-sm" style={{ color: 'var(--text-primary)' }}>{log.distance} km</span>
            </div>
            {log.time && (
              <div className="flex items-center gap-1">
                <Clock size={11} style={{ color: 'var(--text-muted)' }} />
                <span className="font-mono text-xs" style={{ color: 'var(--text-secondary)' }}>{log.time}</span>
              </div>
            )}
            {log.pace && (
              <div className="flex items-center gap-1">
                <Gauge size={11} style={{ color: 'var(--success)' }} />
                <span className="font-mono text-xs" style={{ color: 'var(--text-secondary)' }}>{log.pace}/km</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function LiftHistory({ sessionLogs }) {
  const lifts = useMemo(() => {
    const byExercise = {}
    for (const [date, log] of Object.entries(sessionLogs)) {
      if (!log.exercises) continue
      for (const ex of log.exercises) {
        if (!byExercise[ex.name]) byExercise[ex.name] = []
        const maxWeight = ex.sets
          ? Math.max(...ex.sets.filter(s => s.done).map(s => s.weight || 0), 0)
          : ex.weight || 0
        if (maxWeight > 0) {
          byExercise[ex.name].push({ date, weight: maxWeight })
        }
      }
    }
    return byExercise
  }, [sessionLogs])

  const exerciseNames = Object.keys(lifts)

  if (exerciseNames.length === 0) {
    return (
      <div className="card">
        <h3 className="font-display font-semibold text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>Lift Log</h3>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No lifts logged yet.</p>
      </div>
    )
  }

  return (
    <div className="card">
      <h3 className="font-display font-semibold text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
        <TrendingUp size={14} className="inline mr-1.5" />
        Lift Progression
      </h3>
      <div className="space-y-2">
        {exerciseNames.map(name => {
          const entries = lifts[name].sort((a, b) => a.date.localeCompare(b.date))
          const latest = entries[entries.length - 1]
          const first = entries[0]
          const diff = latest.weight - first.weight

          return (
            <div key={name} className="flex items-center justify-between px-3 py-2 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
              <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{name}</span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {latest.weight}kg
                </span>
                {entries.length > 1 && diff !== 0 && (
                  <span className="font-mono text-xs" style={{ color: diff > 0 ? 'var(--success)' : 'var(--error)' }}>
                    {diff > 0 ? '+' : ''}{diff}kg
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function BodyWeightChart({ weightLogs }) {
  const data = useMemo(() =>
    Object.entries(weightLogs)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, weight]) => ({
        date: format(parseISO(date), 'MMM d'),
        weight,
      })),
    [weightLogs]
  )

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display font-semibold text-sm" style={{ color: 'var(--text-secondary)' }}>
          <Scale size={14} className="inline mr-1.5" />
          Body Weight
        </h3>
      </div>

      {data.length === 0 ? (
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No weight entries yet.</p>
      ) : (
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10, fill: 'var(--text-muted)' }}
                tickLine={false}
                axisLine={{ stroke: 'var(--border)' }}
              />
              <YAxis
                domain={['dataMin - 1', 'dataMax + 1']}
                tick={{ fontSize: 10, fill: 'var(--text-muted)' }}
                tickLine={false}
                axisLine={{ stroke: 'var(--border)' }}
                width={35}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: 8,
                  fontSize: 12,
                  color: 'var(--text-primary)',
                }}
              />
              <Line
                type="monotone"
                dataKey="weight"
                stroke="var(--accent)"
                strokeWidth={2}
                dot={{ fill: 'var(--accent)', r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Weight entry form */}
      <WeightEntry />
    </div>
  )
}

function WeightEntry() {
  const { updateWeightLog } = useApp()
  const todayKey = getDateKey()

  const handleSubmit = (e) => {
    e.preventDefault()
    const weight = parseFloat(e.target.weight.value)
    if (weight > 0) {
      updateWeightLog(todayKey, weight)
      e.target.reset()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mt-3">
      <input
        name="weight"
        type="number"
        step="0.1"
        placeholder="Today's weight (kg)"
        className="flex-1 px-3 py-2 rounded-lg text-sm font-mono"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border)',
          color: 'var(--text-primary)',
        }}
      />
      <button
        type="submit"
        className="px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer"
        style={{ backgroundColor: 'var(--accent)', color: '#000' }}
      >
        Log
      </button>
    </form>
  )
}

export default function Progress() {
  const { startDate, sessionLogs, runLogs, weightLogs } = useApp()

  if (!startDate) {
    return (
      <div className="card text-center py-12">
        <p style={{ color: 'var(--text-secondary)' }}>Set your start date on the Dashboard to track progress.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <WeekGrid startDate={startDate} sessionLogs={sessionLogs} runLogs={runLogs} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <RunHistory runLogs={runLogs} />
        <LiftHistory sessionLogs={sessionLogs} />
      </div>
      <BodyWeightChart weightLogs={weightLogs} />
    </div>
  )
}
