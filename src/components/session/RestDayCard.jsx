import { Coffee, Heart, Moon } from 'lucide-react'

const tips = [
  { icon: Coffee, text: "Light walking or foam rolling only. No structured training." },
  { icon: Heart, text: "Focus on 8+ hours of sleep tonight for optimal recovery." },
  { icon: Moon, text: "Use today to meal prep for the week ahead." },
]

export default function RestDayCard() {
  return (
    <div className="card">
      <div className="text-center mb-6">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
          style={{ backgroundColor: 'var(--success-dim)' }}
        >
          <Coffee size={32} style={{ color: 'var(--success)' }} />
        </div>
        <h2 className="font-display font-bold text-xl" style={{ color: 'var(--text-primary)' }}>
          Rest Day
        </h2>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
          Recovery is when adaptation happens. Earn tomorrow's session.
        </p>
      </div>

      <div className="space-y-3">
        {tips.map((tip, i) => {
          const Icon = tip.icon
          return (
            <div key={i} className="flex items-start gap-3 p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
              <Icon size={16} style={{ color: 'var(--text-muted)', marginTop: 2 }} />
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{tip.text}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
