'use client'

import React from 'react'
import { Search, Bookmark, Heart, Crown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface HeaderProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  savedCount: number
  likedCount: number
  onShowSaved: () => void
  showSaved: boolean
  onShowWall: () => void
  showWall: boolean
  onShowLiked: () => void
  showLiked: boolean
}

export function Header({ 
  searchQuery, 
  onSearchChange, 
  savedCount, 
  likedCount,
  onShowSaved,
  showSaved,
  onShowWall,
  showWall,
  onShowLiked,
  showLiked
}: HeaderProps) {
  return (
    <nav className="sticky top-0 z-[100] border-b border-[var(--border)] bg-[var(--nav-blur)] px-4 backdrop-blur-xl sm:px-6">
      <div className="mx-auto flex h-14 max-w-[1600px] items-center gap-3 sm:h-16 sm:gap-5">
        {/* Logo */}
        <div className="flex flex-shrink-0 items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--accent)] to-orange-500">
            <span className="text-lg font-bold text-white">∞</span>
          </div>
          <span className="font-display text-xl font-extrabold tracking-tight text-[var(--text-primary)] sm:text-2xl">
            Pinora
          </span>
        </div>

        {/* Search */}
        <div className="relative flex-1 max-w-[500px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)] sm:left-4" />
          <input
            type="text"
            placeholder="Search by name, style, #ID, or owner..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-9 w-full rounded-full border-none bg-[var(--search-bg)] py-2 pl-9 pr-3 text-sm text-[var(--search-text)] placeholder:text-[var(--search-placeholder)] outline-none transition-all focus:bg-[var(--bg-card)] focus:ring-2 focus:ring-[var(--accent)] sm:h-11 sm:pl-11 sm:pr-4 sm:text-base"
          />
        </div>

        {/* Actions */}
        <div className="flex flex-shrink-0 items-center gap-1 sm:gap-2">
          {/* Wall of Art Button */}
          <button
            onClick={onShowWall}
            className={cn(
              'flex h-9 items-center gap-1.5 rounded-full px-3 text-sm font-medium transition-all sm:h-10 sm:px-4',
              showWall 
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white' 
                : 'bg-[var(--cat-bg)] text-[var(--text-secondary)] hover:bg-amber-500/20 hover:text-amber-600'
            )}
          >
            <Crown className="h-4 w-4" />
            <span className="hidden sm:inline">Wall of Art</span>
          </button>

          {/* Saved Button */}
          <button
            onClick={onShowSaved}
            className={cn(
              'flex h-9 items-center gap-1.5 rounded-full px-3 text-sm font-medium transition-all sm:h-10 sm:px-4',
              showSaved 
                ? 'bg-[var(--accent)] text-white' 
                : 'bg-[var(--cat-bg)] text-[var(--text-secondary)] hover:bg-[var(--accent-soft)] hover:text-[var(--accent)]'
            )}
          >
            <Bookmark className="h-4 w-4" fill={showSaved ? 'currentColor' : 'none'} />
            <span className="hidden sm:inline">{savedCount}</span>
          </button>

          {/* Liked Button */}
          <button
            onClick={onShowLiked}
            className={cn(
              'flex h-9 items-center gap-1.5 rounded-full px-3 text-sm font-medium transition-all sm:h-10 sm:px-4',
              showLiked 
                ? 'bg-red-500 text-white' 
                : 'bg-[var(--cat-bg)] text-[var(--text-secondary)] hover:bg-red-500/20 hover:text-red-500'
            )}
          >
            <Heart className="h-4 w-4" fill={showLiked ? 'currentColor' : 'none'} />
            <span className="hidden sm:inline">{likedCount}</span>
          </button>
        </div>
      </div>
    </nav>
  )
}
