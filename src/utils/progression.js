/**
 * Progressive overload: look up last logged weight for an exercise
 * and suggest an increase based on muscle group.
 */
export function getSuggestedWeight(exerciseId, sessionLogs) {
  let lastWeight = null
  let lastDate = null

  // Walk through all session logs to find the most recent entry for this exercise
  for (const [date, log] of Object.entries(sessionLogs)) {
    if (!log.exercises) continue
    const exerciseLog = log.exercises.find(e => e.exerciseId === exerciseId)
    if (exerciseLog?.weight && (!lastDate || date > lastDate)) {
      lastWeight = exerciseLog.weight
      lastDate = date
    }
  }

  return lastWeight
}

export function getWeightIncrement(muscleGroup) {
  const upper = ['chest', 'back', 'shoulders']
  const lower = ['quads', 'hamstrings', 'glutes']

  if (upper.includes(muscleGroup)) return 2.5
  if (lower.includes(muscleGroup)) return 2.5
  return 1.25 // isolation: biceps, triceps, calves, rear delts, core
}

/**
 * Adjust exercise sets/RPE based on the current week config.
 * Main lifts use weekConfig.mainLiftSets; accessories drop to 2 on deload.
 */
export function getAdjustedExercise(exercise, weekConfig) {
  if (!weekConfig) return exercise

  const sets = exercise.isMainLift
    ? weekConfig.mainLiftSets
    : weekConfig.isDeload ? 2 : exercise.sets

  return {
    ...exercise,
    sets,
    rpe: weekConfig.rpeTarget,
  }
}
