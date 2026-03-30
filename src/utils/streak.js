import { subDays } from 'date-fns'
import { getDateKey } from './dates'
import { weekSchedule } from '../data/program'

export function calculateStreak(sessionLogs, runLogs) {
  let streak = 0
  let date = new Date()
  const dayOfWeek = date.getDay()

  // Check today first — if today has a log, count it
  const todayKey = getDateKey(date)
  const todaySchedule = weekSchedule.find(d => d.dayOfWeek === dayOfWeek)
  const todayHasLog = sessionLogs[todayKey]?.completed || runLogs[todayKey]

  if (todaySchedule?.type === 'rest') {
    // Rest day doesn't break streak, check yesterday
  } else if (todayHasLog) {
    streak++
  } else {
    // Today isn't done yet — don't count it, but don't break streak
    // Start checking from yesterday
  }

  // Walk backwards from yesterday
  for (let i = 1; i <= 365; i++) {
    date = subDays(new Date(), i)
    const key = getDateKey(date)
    const dow = date.getDay()
    const schedule = weekSchedule.find(d => d.dayOfWeek === dow)

    // Rest days (Saturday) don't break the streak
    if (schedule?.type === 'rest') {
      continue
    }

    const hasLog = sessionLogs[key]?.completed || runLogs[key]
    if (hasLog) {
      streak++
    } else {
      break
    }
  }

  return streak
}
