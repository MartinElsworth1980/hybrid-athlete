import { format, parseISO, differenceInDays, addDays } from 'date-fns'

export function getDateKey(date = new Date()) {
  return format(date, 'yyyy-MM-dd')
}

export function getDayOfProgram(startDate, date = new Date()) {
  const start = typeof startDate === 'string' ? parseISO(startDate) : startDate
  return differenceInDays(date, start)
}

export function getWeekNumber(startDate, date = new Date()) {
  const day = getDayOfProgram(startDate, date)
  return Math.min(Math.floor(day / 7) + 1, 8)
}

export function getWeekDates(startDate, weekNumber) {
  const start = typeof startDate === 'string' ? parseISO(startDate) : startDate
  const weekStart = addDays(start, (weekNumber - 1) * 7)
  return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))
}

export function formatDate(date) {
  return format(typeof date === 'string' ? parseISO(date) : date, 'MMM d')
}

export function formatDateLong(date) {
  return format(typeof date === 'string' ? parseISO(date) : date, 'EEEE, MMMM d')
}
