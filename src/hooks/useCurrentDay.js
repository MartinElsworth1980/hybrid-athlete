import { useMemo } from 'react'
import { differenceInDays, parseISO } from 'date-fns'
import { weekSchedule, weekConfigs } from '../data/program'
import { useApp } from '../context/AppContext'

export function useCurrentDay() {
  const { startDate } = useApp()

  return useMemo(() => {
    const today = new Date()
    const dayOfWeek = today.getDay() // 0=Sun, 1=Mon, ..., 6=Sat

    // Always resolve today's session from the schedule regardless of start date
    const todaySession = weekSchedule.find(d => d.dayOfWeek === dayOfWeek) || null
    const nutritionType = todaySession?.nutritionType || 'rest'

    if (!startDate) {
      return {
        currentWeek: null,
        dayOfWeek,
        todaySession,
        weekConfig: null,
        daysSinceStart: 0,
        isBeforeStart: true,
        isAfterEnd: false,
        nutritionType,
      }
    }

    const start = parseISO(startDate)
    const daysSinceStart = differenceInDays(today, start)

    if (daysSinceStart < 0) {
      return {
        currentWeek: 1,
        dayOfWeek,
        todaySession,
        weekConfig: weekConfigs[0],
        daysSinceStart,
        isBeforeStart: true,
        isAfterEnd: false,
        nutritionType,
      }
    }

    // Clamp to 8 weeks (56 days, index 0-55)
    const currentWeek = Math.min(Math.floor(daysSinceStart / 7) + 1, 8)
    const isAfterEnd = daysSinceStart >= 56
    const weekConfig = weekConfigs[currentWeek - 1]

    return {
      currentWeek,
      dayOfWeek,
      todaySession,
      weekConfig,
      daysSinceStart,
      isBeforeStart: false,
      isAfterEnd,
      nutritionType,
    }
  }, [startDate])
}
