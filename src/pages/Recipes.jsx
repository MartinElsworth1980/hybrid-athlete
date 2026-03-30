import { useState, useMemo } from 'react'
import { Search, SlidersHorizontal } from 'lucide-react'
import { recipes } from '../data/recipes'
import RecipeCard from '../components/recipes/RecipeCard'
import RecipeModal from '../components/recipes/RecipeModal'

const categories = ['all', 'breakfast', 'lunch', 'snack']
const sortOptions = [
  { value: 'name', label: 'Name' },
  { value: 'protein', label: 'Protein' },
  { value: 'calories', label: 'Calories' },
  { value: 'prepMinutes', label: 'Prep Time' },
  { value: 'mealPrepRating', label: 'Meal Prep' },
]

export default function Recipes() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [sortBy, setSortBy] = useState('name')
  const [selectedRecipe, setSelectedRecipe] = useState(null)

  const filtered = useMemo(() => {
    let result = recipes

    if (category !== 'all') {
      result = result.filter(r => r.category === category)
    }

    if (search) {
      const q = search.toLowerCase()
      result = result.filter(r =>
        r.name.toLowerCase().includes(q) ||
        r.description?.toLowerCase().includes(q) ||
        r.tags?.some(t => t.toLowerCase().includes(q))
      )
    }

    result = [...result].sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      if (sortBy === 'protein') return b.macros.protein - a.macros.protein
      if (sortBy === 'calories') return a.calories - b.calories
      if (sortBy === 'prepMinutes') return a.prepMinutes - b.prepMinutes
      if (sortBy === 'mealPrepRating') return b.mealPrepRating - a.mealPrepRating
      return 0
    })

    return result
  }, [search, category, sortBy])

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2"
          style={{ color: 'var(--text-muted)' }}
        />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search recipes..."
          className="w-full pl-10 pr-4 py-3 rounded-xl text-sm"
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border)',
            color: 'var(--text-primary)',
          }}
        />
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 overflow-x-auto pb-1">
        <div className="flex gap-1.5">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className="px-3 py-1.5 rounded-full text-xs font-medium capitalize whitespace-nowrap cursor-pointer transition-colors"
              style={{
                backgroundColor: category === cat ? 'var(--accent-dim)' : 'var(--bg-card)',
                color: category === cat ? 'var(--accent)' : 'var(--text-secondary)',
                border: `1px solid ${category === cat ? 'var(--accent)' : 'var(--border)'}`,
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-1.5">
          <SlidersHorizontal size={12} style={{ color: 'var(--text-muted)' }} />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-xs py-1 px-2 rounded-lg cursor-pointer"
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border)',
              color: 'var(--text-secondary)',
            }}
          >
            {sortOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Results count */}
      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
        {filtered.length} recipe{filtered.length !== 1 ? 's' : ''}
      </p>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(recipe => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            onClick={() => setSelectedRecipe(recipe)}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <p style={{ color: 'var(--text-muted)' }}>No recipes found.</p>
        </div>
      )}

      {/* Modal */}
      {selectedRecipe && (
        <RecipeModal
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
        />
      )}
    </div>
  )
}
