import { useState } from 'react'
import { useCurrentDay } from '../hooks/useCurrentDay'
import { useApp } from '../context/AppContext'
import { nutritionTargets, mealTimingTemplates } from '../data/nutrition'
import { recipes } from '../data/recipes'
import { getDateKey } from '../utils/dates'
import { macroPercentage } from '../utils/macros'
import { Plus, Utensils, X } from 'lucide-react'

function MacroBar({ label, current, target, color }) {
  const pct = macroPercentage(current, target)
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>{label}</span>
        <span className="font-mono text-xs" style={{ color: 'var(--text-primary)' }}>
          {current} / {target}g
        </span>
      </div>
      <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <div className="h-full rounded-full progress-bar" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
    </div>
  )
}

export default function Nutrition() {
  const { nutritionType } = useCurrentDay()
  const { macroLogs, updateMacroLog } = useApp()
  const todayKey = getDateKey()
  const todayLog = macroLogs[todayKey] || { protein: 0, carbs: 0, fat: 0, entries: [] }
  const targets = nutritionTargets[nutritionType] || nutritionTargets.rest
  const mealSlots = mealTimingTemplates[nutritionType] || mealTimingTemplates.rest

  const [showAdd, setShowAdd] = useState(false)
  const [addMode, setAddMode] = useState('custom') // 'custom' | 'recipe'
  const [customMacros, setCustomMacros] = useState({ label: '', protein: '', carbs: '', fat: '' })
  const [recipeSearch, setRecipeSearch] = useState('')

  const totalCals = Math.round(todayLog.protein * 4 + todayLog.carbs * 4 + todayLog.fat * 9)

  const addEntry = (entry) => {
    const entries = [...(todayLog.entries || []), entry]
    const protein = entries.reduce((sum, e) => sum + (e.protein || 0), 0)
    const carbs = entries.reduce((sum, e) => sum + (e.carbs || 0), 0)
    const fat = entries.reduce((sum, e) => sum + (e.fat || 0), 0)
    updateMacroLog(todayKey, { protein, carbs, fat, entries })
    setShowAdd(false)
    setCustomMacros({ label: '', protein: '', carbs: '', fat: '' })
  }

  const removeEntry = (index) => {
    const entries = (todayLog.entries || []).filter((_, i) => i !== index)
    const protein = entries.reduce((sum, e) => sum + (e.protein || 0), 0)
    const carbs = entries.reduce((sum, e) => sum + (e.carbs || 0), 0)
    const fat = entries.reduce((sum, e) => sum + (e.fat || 0), 0)
    updateMacroLog(todayKey, { protein, carbs, fat, entries })
  }

  const handleAddCustom = () => {
    if (!customMacros.protein && !customMacros.carbs && !customMacros.fat) return
    addEntry({
      label: customMacros.label || 'Custom entry',
      protein: parseInt(customMacros.protein) || 0,
      carbs: parseInt(customMacros.carbs) || 0,
      fat: parseInt(customMacros.fat) || 0,
    })
  }

  const filteredRecipes = recipeSearch
    ? recipes.filter(r => r.name.toLowerCase().includes(recipeSearch.toLowerCase()))
    : recipes.slice(0, 8)

  return (
    <div className="space-y-4">
      {/* Day type banner */}
      <div className="card" style={{ borderColor: 'var(--accent)' }}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display font-bold" style={{ color: 'var(--text-primary)' }}>
              {targets.label}
            </h3>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
              {targets.description}
            </p>
          </div>
          <div className="text-right">
            <div className="font-mono font-bold text-xl" style={{ color: 'var(--accent)' }}>
              {targets.calories}
            </div>
            <div className="text-[10px] uppercase" style={{ color: 'var(--text-muted)' }}>kcal target</div>
          </div>
        </div>
      </div>

      {/* Macro progress */}
      <div className="card space-y-3">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-display font-semibold text-sm" style={{ color: 'var(--text-secondary)' }}>
            Today's Progress
          </h3>
          <span className="font-mono text-sm" style={{ color: 'var(--text-primary)' }}>
            {totalCals} / {targets.calories} cal
          </span>
        </div>
        <MacroBar label="Protein" current={todayLog.protein} target={targets.protein} color="var(--accent)" />
        <MacroBar label="Carbs" current={todayLog.carbs} target={targets.carbs} color="var(--success)" />
        <MacroBar label="Fat" current={todayLog.fat} target={targets.fat} color="var(--warning)" />
      </div>

      {/* Logged entries */}
      {todayLog.entries && todayLog.entries.length > 0 && (
        <div className="card">
          <h3 className="font-display font-semibold text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
            Logged Meals
          </h3>
          <div className="space-y-2">
            {todayLog.entries.map((entry, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-2 px-3 rounded-lg"
                style={{ backgroundColor: 'var(--bg-secondary)' }}
              >
                <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{entry.label}</span>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>
                    P:{entry.protein} C:{entry.carbs} F:{entry.fat}
                  </span>
                  <button
                    onClick={() => removeEntry(i)}
                    className="p-1 cursor-pointer"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    <X size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add meal */}
      {!showAdd ? (
        <button
          onClick={() => setShowAdd(true)}
          className="w-full py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2 cursor-pointer"
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border)',
            color: 'var(--text-secondary)',
          }}
        >
          <Plus size={16} />
          Add Meal
        </button>
      ) : (
        <div className="card">
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setAddMode('custom')}
              className="px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer"
              style={{
                backgroundColor: addMode === 'custom' ? 'var(--accent-dim)' : 'var(--bg-secondary)',
                color: addMode === 'custom' ? 'var(--accent)' : 'var(--text-secondary)',
              }}
            >
              Custom
            </button>
            <button
              onClick={() => setAddMode('recipe')}
              className="px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer"
              style={{
                backgroundColor: addMode === 'recipe' ? 'var(--accent-dim)' : 'var(--bg-secondary)',
                color: addMode === 'recipe' ? 'var(--accent)' : 'var(--text-secondary)',
              }}
            >
              From Recipe
            </button>
          </div>

          {addMode === 'custom' ? (
            <div className="space-y-2">
              <input
                type="text"
                value={customMacros.label}
                onChange={e => setCustomMacros(prev => ({ ...prev, label: e.target.value }))}
                placeholder="Meal name"
                className="w-full px-3 py-2 rounded-lg text-sm"
                style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
              />
              <div className="grid grid-cols-3 gap-2">
                <input type="number" value={customMacros.protein} onChange={e => setCustomMacros(prev => ({ ...prev, protein: e.target.value }))} placeholder="Protein (g)" className="px-3 py-2 rounded-lg text-sm font-mono" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
                <input type="number" value={customMacros.carbs} onChange={e => setCustomMacros(prev => ({ ...prev, carbs: e.target.value }))} placeholder="Carbs (g)" className="px-3 py-2 rounded-lg text-sm font-mono" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
                <input type="number" value={customMacros.fat} onChange={e => setCustomMacros(prev => ({ ...prev, fat: e.target.value }))} placeholder="Fat (g)" className="px-3 py-2 rounded-lg text-sm font-mono" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
              </div>
              <div className="flex gap-2">
                <button onClick={handleAddCustom} className="flex-1 py-2 rounded-lg text-sm font-semibold cursor-pointer" style={{ backgroundColor: 'var(--accent)', color: '#000' }}>
                  Add
                </button>
                <button onClick={() => setShowAdd(false)} className="px-4 py-2 rounded-lg text-sm cursor-pointer" style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <input
                type="text"
                value={recipeSearch}
                onChange={e => setRecipeSearch(e.target.value)}
                placeholder="Search recipes..."
                className="w-full px-3 py-2 rounded-lg text-sm"
                style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
              />
              <div className="max-h-48 overflow-y-auto space-y-1">
                {filteredRecipes.map(recipe => (
                  <button
                    key={recipe.id}
                    onClick={() => addEntry({
                      label: recipe.name,
                      protein: recipe.macros.protein,
                      carbs: recipe.macros.carbs,
                      fat: recipe.macros.fat,
                    })}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-left cursor-pointer"
                    style={{ backgroundColor: 'var(--bg-secondary)' }}
                  >
                    <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{recipe.name}</span>
                    <span className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>
                      P:{recipe.macros.protein} C:{recipe.macros.carbs} F:{recipe.macros.fat}
                    </span>
                  </button>
                ))}
              </div>
              <button onClick={() => setShowAdd(false)} className="w-full py-2 rounded-lg text-sm cursor-pointer" style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>
                Cancel
              </button>
            </div>
          )}
        </div>
      )}

      {/* Meal timing guide */}
      <div className="card">
        <h3 className="font-display font-semibold text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
          <Utensils size={14} className="inline mr-1.5" />
          Suggested Meal Timing
        </h3>
        <div className="space-y-2">
          {mealSlots.map((slot, i) => (
            <div
              key={i}
              className="flex items-center justify-between py-2 px-3 rounded-lg"
              style={{ backgroundColor: 'var(--bg-secondary)' }}
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs" style={{ color: 'var(--accent)' }}>{slot.time}</span>
                <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{slot.label}</span>
              </div>
              <span className="font-mono text-[10px]" style={{ color: 'var(--text-muted)' }}>
                {slot.macroSuggestion}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
