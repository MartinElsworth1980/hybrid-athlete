import { useState, useEffect, useRef } from 'react'
import { Timer, Play, Pause, RotateCcw } from 'lucide-react'

export default function RestTimer({ seconds = 90, autoStart = false }) {
  const [timeLeft, setTimeLeft] = useState(seconds)
  const [isRunning, setIsRunning] = useState(false)
  const intervalRef = useRef(null)

  useEffect(() => {
    if (autoStart) {
      setTimeLeft(seconds)
      setIsRunning(true)
    }
  }, [autoStart, seconds])

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsRunning(false)
            clearInterval(intervalRef.current)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(intervalRef.current)
  }, [isRunning, timeLeft])

  const reset = () => {
    setIsRunning(false)
    setTimeLeft(seconds)
    clearInterval(intervalRef.current)
  }

  const toggle = () => setIsRunning(!isRunning)

  const mins = Math.floor(timeLeft / 60)
  const secs = timeLeft % 60
  const pct = ((seconds - timeLeft) / seconds) * 100

  return (
    <div
      className="flex items-center gap-3 px-3 py-2 rounded-lg"
      style={{ backgroundColor: 'var(--bg-secondary)' }}
    >
      <Timer size={14} style={{ color: timeLeft === 0 ? 'var(--success)' : 'var(--accent)' }} />
      <div className="flex-1">
        <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--border)' }}>
          <div
            className="h-full rounded-full transition-all duration-1000"
            style={{
              width: `${pct}%`,
              backgroundColor: timeLeft === 0 ? 'var(--success)' : 'var(--accent)',
            }}
          />
        </div>
      </div>
      <span
        className="font-mono text-sm font-medium w-12 text-center"
        style={{ color: timeLeft === 0 ? 'var(--success)' : 'var(--text-primary)' }}
      >
        {mins}:{secs.toString().padStart(2, '0')}
      </span>
      <button onClick={toggle} className="p-1 cursor-pointer" style={{ color: 'var(--text-secondary)' }}>
        {isRunning ? <Pause size={14} /> : <Play size={14} />}
      </button>
      <button onClick={reset} className="p-1 cursor-pointer" style={{ color: 'var(--text-muted)' }}>
        <RotateCcw size={14} />
      </button>
    </div>
  )
}
