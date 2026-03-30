import { createContext, useContext, useCallback, useEffect } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [theme, setTheme] = useLocalStorage('hybrid_theme', 'dark')
  const [startDate, setStartDate] = useLocalStorage('hybrid_start_date', null)
  const [sessionLogs, setSessionLogs] = useLocalStorage('hybrid_session_logs', {})
  const [runLogs, setRunLogs] = useLocalStorage('hybrid_run_logs', {})
  const [macroLogs, setMacroLogs] = useLocalStorage('hybrid_macro_logs', {})
  const [weightLogs, setWeightLogs] = useLocalStorage('hybrid_weight_logs', {})

  // Apply theme to document
  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  }, [setTheme])

  const updateSessionLog = useCallback((date, data) => {
    setSessionLogs(prev => ({ ...prev, [date]: { ...prev[date], ...data } }))
  }, [setSessionLogs])

  const updateRunLog = useCallback((date, data) => {
    setRunLogs(prev => ({ ...prev, [date]: { ...prev[date], ...data } }))
  }, [setRunLogs])

  const updateMacroLog = useCallback((date, data) => {
    setMacroLogs(prev => ({ ...prev, [date]: { ...prev[date], ...data } }))
  }, [setMacroLogs])

  const updateWeightLog = useCallback((date, weight) => {
    setWeightLogs(prev => ({ ...prev, [date]: weight }))
  }, [setWeightLogs])

  const resetAllData = useCallback(() => {
    setStartDate(null)
    setSessionLogs({})
    setRunLogs({})
    setMacroLogs({})
    setWeightLogs({})
  }, [setStartDate, setSessionLogs, setRunLogs, setMacroLogs, setWeightLogs])

  const value = {
    theme,
    toggleTheme,
    startDate,
    setStartDate,
    sessionLogs,
    updateSessionLog,
    runLogs,
    updateRunLog,
    macroLogs,
    updateMacroLog,
    weightLogs,
    updateWeightLog,
    resetAllData,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) throw new Error('useApp must be used within AppProvider')
  return context
}
