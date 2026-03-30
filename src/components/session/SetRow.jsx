import { Check } from 'lucide-react'

export default function SetRow({ setIndex, weight, reps, done, onUpdate }) {
  return (
    <div
      className="flex items-center gap-3 py-2 px-3 rounded-lg"
      style={{
        backgroundColor: done ? 'var(--success-dim)' : 'var(--bg-secondary)',
      }}
    >
      <span
        className="font-mono text-xs w-6 text-center"
        style={{ color: 'var(--text-muted)' }}
      >
        {setIndex + 1}
      </span>

      <div className="flex items-center gap-1.5 flex-1">
        <input
          type="number"
          value={weight || ''}
          onChange={(e) => onUpdate({ weight: parseFloat(e.target.value) || 0 })}
          placeholder="kg"
          className="w-16 px-2 py-1.5 rounded text-sm font-mono text-center"
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border)',
            color: 'var(--text-primary)',
          }}
        />
        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>kg</span>
      </div>

      <div className="flex items-center gap-1.5">
        <input
          type="number"
          value={reps || ''}
          onChange={(e) => onUpdate({ reps: parseInt(e.target.value) || 0 })}
          placeholder="reps"
          className="w-14 px-2 py-1.5 rounded text-sm font-mono text-center"
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border)',
            color: 'var(--text-primary)',
          }}
        />
        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>reps</span>
      </div>

      <button
        onClick={() => onUpdate({ done: !done })}
        className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-colors"
        style={{
          backgroundColor: done ? 'var(--success)' : 'var(--bg-card)',
          border: done ? 'none' : '1px solid var(--border)',
        }}
      >
        <Check size={14} style={{ color: done ? '#fff' : 'var(--text-muted)' }} />
      </button>
    </div>
  )
}
