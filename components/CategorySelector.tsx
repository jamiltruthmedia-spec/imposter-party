'use client'

import { Category } from '@/lib/game'

const categoryEmoji: Record<Category, string> = {
  Objects: '📦',
  Locations: '🗺️',
  Foods: '🍕',
}

const categoryWordCount: Record<Category, number> = {
  Objects: 100,
  Locations: 80,
  Foods: 70,
}

interface CategorySelectorProps {
  selected: Category
  onChange: (category: Category) => void
}

export default function CategorySelector({ selected, onChange }: CategorySelectorProps) {
  const categories: Category[] = ['Objects', 'Locations', 'Foods']

  return (
    <div className="grid grid-cols-3 gap-3">
      {categories.map((cat) => {
        const isSelected = selected === cat
        return (
          <button
            key={cat}
            onClick={() => onChange(cat)}
            className="flex flex-col items-center justify-center p-4 rounded-2xl transition-all duration-200 active:scale-95"
            style={{
              background: isSelected
                ? 'rgba(0, 212, 255, 0.15)'
                : 'rgba(255, 255, 255, 0.04)',
              border: isSelected
                ? '2px solid #00d4ff'
                : '2px solid rgba(255,255,255,0.08)',
              boxShadow: isSelected ? '0 0 15px rgba(0,212,255,0.3)' : 'none',
            }}
          >
            <span className="text-2xl mb-1">{categoryEmoji[cat]}</span>
            <span
              className="text-sm font-bold"
              style={{ color: isSelected ? '#00d4ff' : 'white' }}
            >
              {cat}
            </span>
            <span
              className="text-xs mt-1 font-medium"
              style={{ color: isSelected ? 'rgba(0,212,255,0.7)' : 'rgba(255,255,255,0.35)' }}
            >
              ● {categoryWordCount[cat]} words
            </span>
          </button>
        )
      })}
    </div>
  )
}
