import { useState, useEffect } from 'react'
import { ChevronDown, ChevronUp, TrendingUp } from 'lucide-react'
import SetRow from './SetRow'
import RestTimer from './RestTimer'
import { getSuggestedWeight, getWeightIncrement } from '../../utils/progression'
import { useApp } from '../../context/AppContext'

export default function ExerciseCard({ exercise, weekConfig, onSetsChange, initialSets }) {
  const { sessionLogs } = useApp()
  const [expanded, setExpanded] = useState(true)
  const [lastCompletedSet, setLastCompletedSet] = useState(-1)

  // Adjust sets based on week
  const numSets = exercise.isMainLift
    ? weekConfig?.mainLiftSets || exercise.sets
    : weekConfig?.isDeload ? 2 : exercise.sets

  const [sets, setSets] = useState(() => {
    if (initialSets && initialSets.length > 0) return initialSets
    const lastWeight = getSuggestedWeight(exercise.id, sessionLogs)
    return Array.from({ length: numSets }, () => ({
      weight: lastWeight || 0,
      reps: 0,
      done: false,
    }))
  })

  useEffect(() => {
    onSetsChange?.(sets)
  }, [sets])

  const handleSetUpdate = (idx, updates) => {
    setSets(prev => {
      const next = [...prev]
      const wasDone = next[idx].done
      next[idx] = { ...next[idx], ...updates }
      if (!wasDone && next[idx].done) {
        setLastCompletedSet(idx)
      }
      return next
    })
  }

  const lastWeight = getSuggestedWeight(exercise.id, sessionLogs)
  const increment = getWeightIncrement(exercise.muscleGroup)
  const completedSets = sets.filter(s => s.done).length

  return (
    <div className="card">
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-display font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
              {exercise.name}
            </h4>
            {completedSets === numSets && numSets > 0 && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ backgroundColor: 'var(--success-dim)', color: 'var(--success)' }}>
                Done
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>
            <span className="font-mono">{numSets} × {exercise.repRange}</span>
            <span>RPE {weekConfig?.rpeTarget || exercise.rpe}</span>
            <span>Rest {exercise.restSeconds >= 60 ? `${Math.round(exercise.restSeconds / 60)}min` : `${exercise.restSeconds}s`}</span>
          </div>
        </div>
        <div style={{ color: 'var(--text-muted)' }}>
          {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </div>

      {expanded && (
        <div className="mt-4 space-y-2">
          {lastWeight > 0 && (
            <div className="flex items-center gap-2 text-xs px-1 mb-2" style={{ color: 'var(--text-secondary)' }}>
              <TrendingUp size={12} style={{ color: 'var(--accent)' }} />
              <span>
                Last: <span className="font-mono">{lastWeight}kg</span> — Try <span className="font-mono font-semibold" style={{ color: 'var(--accent)' }}>{lastWeight + increment}kg</span>
              </span>
            </div>
          )}

          {exercise.notes && (
            <p className="text-xs px-1 mb-2" style={{ color: 'var(--text-muted)' }}>
              {exercise.notes}
            </p>
          )}

          {sets.map((set, idx) => (
            <SetRow
              key={idx}
              setIndex={idx}
              weight={set.weight}
              reps={set.reps}
              done={set.done}
              onUpdate={(updates) => handleSetUpdate(idx, updates)}
            />
          ))}

          <RestTimer
            seconds={exercise.restSeconds}
            autoStart={lastCompletedSet >= 0 && lastCompletedSet < numSets - 1}
          />
        </div>
      )}
    </div>
  )
}
