export function sumMacros(entries) {
  return entries.reduce(
    (acc, entry) => ({
      protein: acc.protein + (entry.protein || 0),
      carbs: acc.carbs + (entry.carbs || 0),
      fat: acc.fat + (entry.fat || 0),
      calories: acc.calories + (entry.calories || 0),
    }),
    { protein: 0, carbs: 0, fat: 0, calories: 0 }
  )
}

export function macroPercentage(logged, target) {
  if (!target || target === 0) return 0
  return Math.min(Math.round((logged / target) * 100), 100)
}
