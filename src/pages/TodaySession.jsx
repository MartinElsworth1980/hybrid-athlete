import { useState, useCallback } from 'react'
import { useCurrentDay } from '../hooks/useCurrentDay'
import { useApp } from '../context/AppContext'
import { exercises as exerciseData } from '../data/program'
import { getDateKey } from '../utils/dates'
import { getAdjustedExercise } from '../utils/progression'
import ExerciseCard from '../components/session/ExerciseCard'
import RunSession from '../components/session/RunSession'
import RestDayCard from '../components/session/RestDayCard'
import { CheckCircle2 } from 'lucide-react'

export default function TodaySession() {
  const { todaySession, weekConfig, isBeforeStart } = useCurrentDay()
  const { sessionLogs, updateSessionLog } = useApp()
  const todayKey = getDateKey()
  const existingLog = sessionLogs[todayKey]

  // Track set data for each exercise
  const [exerciseSets, setExerciseSets] = useState({})

  const handleSetsChange = useCallback((exerciseId, sets) => {
    setExerciseSets(prev => ({ ...prev, [exerciseId]: sets }))
  }, [])

  if (!todaySession || !weekConfig) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '48px 20px' }}>
        <p style={{ color: 'var(--text-secondary)' }}>
          Set your start date on the Dashboard to begin.
        </p>
      </div>
    )
  }

  // Rest day
  if (todaySession.type === 'rest') {
    return <RestDayCard />
  }

  // Run session
  if (todaySession.type === 'run') {
    return (
      <RunSession
        weekConfig={weekConfig}
        sessionKey={todaySession.sessionKey}
      />
    )
  }

  // Gym session
  const sessionExercises = exerciseData[todaySession.sessionKey] || []
  const adjustedExercises = sessionExercises.map(ex =>
    getAdjustedExercise(ex, weekConfig)
  )

  const handleComplete = () => {
    const exerciseEntries = adjustedExercises.map(ex => ({
      exerciseId: ex.id,
      name: ex.name,
      weight: exerciseSets[ex.id]?.[0]?.weight || 0,
      sets: exerciseSets[ex.id] || [],
    }))

    updateSessionLog(todayKey, {
      completed: true,
      sessionKey: todaySession.sessionKey,
      exercises: exerciseEntries,
    })
  }

  const isCompleted = existingLog?.completed

  return (
    <div className="space-y-4">
      {/* Session header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-bold text-lg" style={{ color: 'var(--text-primary)' }}>
            {todaySession.label}
          </h2>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Week {weekConfig?.week} — {weekConfig?.phase}
            {weekConfig?.isDeload && ' (Deload)'}
          </p>
        </div>
        {isCompleted && (
          <div className="flex items-center gap-1.5" style={{ color: 'var(--success)' }}>
            <CheckCircle2 size={18} />
            <span className="text-sm font-semibold">Complete</span>
          </div>
        )}
      </div>

      {/* Exercises */}
      {adjustedExercises.map(exercise => (
        <ExerciseCard
          key={exercise.id}
          exercise={exercise}
          weekConfig={weekConfig}
          initialSets={existingLog?.exercises?.find(e => e.exerciseId === exercise.id)?.sets}
          onSetsChange={(sets) => handleSetsChange(exercise.id, sets)}
        />
      ))}

      {/* Complete button */}
      {!isCompleted && (
        <button
          onClick={handleComplete}
          className="w-full py-4 rounded-xl font-display font-bold text-base cursor-pointer transition-transform active:scale-[0.98]"
          style={{
            backgroundColor: 'var(--accent)',
            color: '#000',
          }}
        >
          Complete Session
        </button>
      )}
    </div>
  )
}
