import { useState } from 'react'
import { Wind, MapPin, Clock, Gauge } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { getDateKey } from '../../utils/dates'

export default function RunSession({ weekConfig, sessionKey }) {
  const { runLogs, updateRunLog } = useApp()
  const todayKey = getDateKey()
  const existingLog = runLogs[todayKey]

  // Get run details from weekConfig
  let runData = null
  if (sessionKey === 'easy_run') runData = weekConfig?.easyRun
  else if (sessionKey === 'quality_run') runData = weekConfig?.qualityRun
  else if (sessionKey === 'long_run') runData = weekConfig?.longRun

  const [distance, setDistance] = useState(existingLog?.distance || '')
  const [time, setTime] = useState(existingLog?.time || '')
  const [notes, setNotes] = useState(existingLog?.notes || '')

  const calculatePace = () => {
    if (!distance || !time) return null
    const parts = time.split(':')
    if (parts.length < 2) return null
    const totalMinutes = parseInt(parts[0]) * 60 + parseInt(parts[1])
    const paceSeconds = (totalMinutes * 60) / parseFloat(distance)
    const paceMins = Math.floor(paceSeconds / 60)
    const paceSecs = Math.round(paceSeconds % 60)
    return `${paceMins}:${paceSecs.toString().padStart(2, '0')}`
  }

  const handleSave = () => {
    const pace = calculatePace()
    updateRunLog(todayKey, {
      distance: parseFloat(distance),
      time,
      pace: pace || '',
      notes,
      sessionKey,
    })
  }

  const pace = calculatePace()

  return (
    <div className="space-y-4">
      {/* Run target */}
      <div className="card" style={{ borderColor: 'var(--accent)' }}>
        <div className="flex items-center gap-3 mb-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: 'var(--accent-dim)' }}
          >
            <Wind size={20} style={{ color: 'var(--accent)' }} />
          </div>
          <div>
            <h3 className="font-display font-bold" style={{ color: 'var(--text-primary)' }}>
              {runData?.km || '?'} km Target
            </h3>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Week {weekConfig?.week} — {weekConfig?.phase}
            </p>
          </div>
        </div>
        {runData?.description && (
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            {runData.description}
          </p>
        )}
      </div>

      {/* Log run */}
      <div className="card">
        <h3 className="font-display font-semibold text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
          {existingLog ? 'Run Logged' : 'Log Your Run'}
        </h3>

        <div className="space-y-3">
          <div>
            <label className="flex items-center gap-2 text-xs mb-1.5" style={{ color: 'var(--text-muted)' }}>
              <MapPin size={12} /> Distance (km)
            </label>
            <input
              type="number"
              step="0.1"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
              placeholder={String(runData?.km || 0)}
              className="w-full px-3 py-2.5 rounded-lg text-sm font-mono"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
                color: 'var(--text-primary)',
              }}
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-xs mb-1.5" style={{ color: 'var(--text-muted)' }}>
              <Clock size={12} /> Time (mm:ss)
            </label>
            <input
              type="text"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              placeholder="35:00"
              className="w-full px-3 py-2.5 rounded-lg text-sm font-mono"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
                color: 'var(--text-primary)',
              }}
            />
          </div>

          {pace && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ backgroundColor: 'var(--accent-dim)' }}>
              <Gauge size={14} style={{ color: 'var(--accent)' }} />
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Pace:</span>
              <span className="font-mono font-semibold text-sm" style={{ color: 'var(--accent)' }}>
                {pace} /km
              </span>
            </div>
          )}

          <div>
            <label className="text-xs mb-1.5 block" style={{ color: 'var(--text-muted)' }}>
              Notes (optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="How did it feel?"
              rows={2}
              className="w-full px-3 py-2.5 rounded-lg text-sm resize-none"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
                color: 'var(--text-primary)',
              }}
            />
          </div>

          <button
            onClick={handleSave}
            disabled={!distance}
            className="w-full py-3 rounded-lg font-display font-semibold text-sm cursor-pointer transition-opacity"
            style={{
              backgroundColor: existingLog ? 'var(--success)' : 'var(--accent)',
              color: '#000',
              opacity: distance ? 1 : 0.4,
            }}
          >
            {existingLog ? 'Update Run' : 'Save Run'}
          </button>
        </div>
      </div>
    </div>
  )
}
