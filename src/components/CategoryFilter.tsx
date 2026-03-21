'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { CATEGORIES } from '@/lib/pin-data'

interface CategoryFilterProps {
  activeCategory: string
  onCategoryChange: (category: string) => void
}

export function CategoryFilter({
  activeCategory,
  onCategoryChange,
}: CategoryFilterProps) {
  return (
    <div className="px-6 py-4">
      <div className="category-scroll max-w-[1600px] mx-auto flex gap-2 overflow-x-auto">
        {CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={cn(
              'whitespace-nowrap rounded-full px-5 py-2 text-sm font-medium transition-all',
              activeCategory === category
                ? 'bg-[var(--cat-active-bg)] text-[var(--cat-active-text)]'
                : 'bg-[var(--cat-bg)] text-[var(--cat-text)] hover:bg-[var(--accent-soft)] hover:text-[var(--accent)]'
            )}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  )
}
