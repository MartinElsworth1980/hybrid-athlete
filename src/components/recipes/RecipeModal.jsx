import { X, Clock, Flame, Star, ChefHat } from 'lucide-react'
import { useEffect } from 'react'

export default function RecipeModal({ recipe, onClose }) {
  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleEsc)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = ''
    }
  }, [onClose])

  if (!recipe) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }} />

      {/* Modal */}
      <div
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-t-2xl md:rounded-2xl"
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between p-5 pb-3" style={{ backgroundColor: 'var(--bg-card)', borderBottom: '1px solid var(--border)' }}>
          <h2 className="font-display font-bold text-lg pr-8" style={{ color: 'var(--text-primary)' }}>
            {recipe.name}
          </h2>
          <button
            onClick={onClose}
            className="absolute right-4 top-4 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer"
            style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-5 pt-3 space-y-5">
          {/* Quick stats */}
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-1.5" style={{ color: 'var(--text-secondary)' }}>
              <Flame size={14} style={{ color: 'var(--accent)' }} />
              <span className="font-mono font-semibold">{recipe.calories}</span> cal
            </div>
            <div className="flex items-center gap-1.5" style={{ color: 'var(--text-secondary)' }}>
              <Clock size={14} />
              {recipe.prepMinutes} min
            </div>
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }, (_, i) => (
                <Star key={i} size={12} fill={i < recipe.mealPrepRating ? 'var(--accent)' : 'none'} style={{ color: i < recipe.mealPrepRating ? 'var(--accent)' : 'var(--text-muted)' }} />
              ))}
            </div>
          </div>

          {/* Macros */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Protein', value: recipe.macros.protein, color: 'var(--accent)' },
              { label: 'Carbs', value: recipe.macros.carbs, color: 'var(--success)' },
              { label: 'Fat', value: recipe.macros.fat, color: 'var(--warning)' },
            ].map(m => (
              <div key={m.label} className="text-center p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                <div className="font-mono font-bold text-lg" style={{ color: m.color }}>{m.value}g</div>
                <div className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{m.label}</div>
              </div>
            ))}
          </div>

          {/* Description */}
          {recipe.description && (
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {recipe.description}
            </p>
          )}

          {/* Meal prep notes */}
          {recipe.mealPrepNotes && (
            <div className="flex items-start gap-2 p-3 rounded-lg" style={{ backgroundColor: 'var(--accent-dim)' }}>
              <ChefHat size={14} style={{ color: 'var(--accent)', marginTop: 2 }} />
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                {recipe.mealPrepNotes}
              </p>
            </div>
          )}

          {/* Ingredients */}
          {recipe.ingredients && recipe.ingredients.length > 0 && (
            <div>
              <h3 className="font-display font-semibold text-sm mb-2" style={{ color: 'var(--text-primary)' }}>
                Ingredients
              </h3>
              <ul className="space-y-1.5">
                {recipe.ingredients.map((ing, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: 'var(--accent)' }} />
                    {ing}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Method */}
          {recipe.method && recipe.method.length > 0 && (
            <div>
              <h3 className="font-display font-semibold text-sm mb-2" style={{ color: 'var(--text-primary)' }}>
                Method
              </h3>
              <ol className="space-y-2">
                {recipe.method.map((step, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    <span
                      className="font-mono text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                      style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-muted)' }}
                    >
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Tags */}
          {recipe.tags && recipe.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {recipe.tags.map(tag => (
                <span
                  key={tag}
                  className="text-[10px] px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-muted)' }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
