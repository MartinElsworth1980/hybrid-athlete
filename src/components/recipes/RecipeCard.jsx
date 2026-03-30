import { Clock, Star, Flame } from 'lucide-react'

const categoryColors = {
  breakfast: { bg: 'var(--accent-dim)', text: 'var(--accent)' },
  lunch: { bg: 'var(--success-dim)', text: 'var(--success)' },
  snack: { bg: 'var(--warning-dim)', text: 'var(--warning)' },
}

export default function RecipeCard({ recipe, onClick }) {
  const colors = categoryColors[recipe.category] || categoryColors.snack

  return (
    <div className="card card-hover cursor-pointer" onClick={onClick}>
      <div className="flex items-start justify-between mb-3">
        <span
          className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full"
          style={{ backgroundColor: colors.bg, color: colors.text }}
        >
          {recipe.category}
        </span>
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }, (_, i) => (
            <Star
              key={i}
              size={10}
              fill={i < recipe.mealPrepRating ? 'var(--accent)' : 'none'}
              style={{ color: i < recipe.mealPrepRating ? 'var(--accent)' : 'var(--text-muted)' }}
            />
          ))}
        </div>
      </div>

      <h4 className="font-display font-semibold text-sm mb-2" style={{ color: 'var(--text-primary)' }}>
        {recipe.name}
      </h4>

      <div className="flex items-center gap-3 text-xs mb-3" style={{ color: 'var(--text-muted)' }}>
        <span className="flex items-center gap-1">
          <Flame size={11} />
          <span className="font-mono">{recipe.calories}</span> cal
        </span>
        <span className="flex items-center gap-1">
          <Clock size={11} />
          {recipe.prepMinutes} min
        </span>
      </div>

      <div className="flex gap-3 text-xs">
        <div>
          <span style={{ color: 'var(--accent)' }} className="font-mono font-semibold">{recipe.macros.protein}g</span>
          <span style={{ color: 'var(--text-muted)' }}> P</span>
        </div>
        <div>
          <span style={{ color: 'var(--success)' }} className="font-mono font-semibold">{recipe.macros.carbs}g</span>
          <span style={{ color: 'var(--text-muted)' }}> C</span>
        </div>
        <div>
          <span style={{ color: 'var(--warning)' }} className="font-mono font-semibold">{recipe.macros.fat}g</span>
          <span style={{ color: 'var(--text-muted)' }}> F</span>
        </div>
      </div>
    </div>
  )
}
