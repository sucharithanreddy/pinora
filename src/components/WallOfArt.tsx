'use client'

import React, { useState, useEffect } from 'react'
import { WallArtItem } from '@/types'
import { Crown, Sparkles, ArrowRight } from 'lucide-react'
import { Button } from './ui/button'
import { generatePremiumArt } from '@/lib/generative-art-v3'

const STORAGE_KEY = 'pinora_wall_of_art'

// Load claimed artworks from localStorage
function loadWallOfArt(): WallArtItem[] {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch {
    // Ignore errors
  }
  return []
}

// Save to localStorage
function saveWallOfArt(items: WallArtItem[]) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch {
    // Ignore errors
  }
}

interface WallOfArtProps {
  onViewChange?: (view: 'wall' | 'discover') => void
}

export function WallOfArt({ onViewChange }: WallOfArtProps) {
  const [artworks, setArtworks] = useState<WallArtItem[]>([])
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    const items = loadWallOfArt()
    setArtworks(items)
  }, [])

  const totalCount = artworks.length

  if (totalCount === 0) {
    return (
      <section className="mx-auto max-w-[1600px] px-4 py-8">
        <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--bg-card)] p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--bg-tertiary)]">
            <Crown className="h-8 w-8 text-[var(--text-muted)]" />
          </div>
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">Memory Wall</h3>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            Be the first to own an artwork and be remembered forever!
          </p>
          <p className="mt-1 text-xs text-[var(--text-muted)]">
            Click any artwork and press "Own This Artwork" to make it yours for $1
          </p>
        </div>
      </section>
    )
  }

  // Show compact preview by default
  const displayedArtworks = isExpanded ? artworks : artworks.slice(0, 6)

  return (
    <section className="mx-auto max-w-[1600px] px-4 py-6">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Crown className="h-5 w-5 text-amber-500" />
          <h2 className="font-display text-lg font-bold text-[var(--text-primary)]">
            Wall of Art
          </h2>
          <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-xs font-medium text-amber-600">
            {totalCount} owned
          </span>
        </div>
        {totalCount > 6 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-[var(--text-secondary)]"
          >
            {isExpanded ? 'Show less' : `View all ${totalCount}`}
            <ArrowRight className={`ml-1 h-4 w-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
          </Button>
        )}
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {displayedArtworks.map((artwork) => (
          <WallArtCard key={artwork.id} artwork={artwork} />
        ))}
      </div>

      {/* CTA */}
      {!isExpanded && (
        <div className="mt-4 text-center">
          <p className="text-xs text-[var(--text-muted)]">
            <Sparkles className="mr-1 inline h-3 w-3" />
            Own your unique artwork for just $1
          </p>
        </div>
      )}
    </section>
  )
}

function WallArtCard({ artwork }: { artwork: WallArtItem }) {
  const [canvasRef, setCanvasRef] = useState<HTMLCanvasElement | null>(null)

  useEffect(() => {
    if (!canvasRef) return

    const { seeds } = artwork.artworkData
    canvasRef.width = 200
    canvasRef.height = 200
    generatePremiumArt(
      canvasRef,
      seeds.hueSeed,
      seeds.satSeed,
      seeds.lightSeed,
      seeds.styleSeed,
      seeds.shapeSeed,
      seeds.positionSeed,
      seeds.sizeSeed
    )
  }, [canvasRef, artwork])

  return (
    <div className="group relative overflow-hidden rounded-xl bg-[var(--bg-card)] shadow-[var(--shadow-sm)] transition-all hover:shadow-[var(--shadow-md)]">
      {/* Canvas */}
      <canvas
        ref={setCanvasRef}
        width={200}
        height={200}
        className="aspect-square w-full object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

      {/* Owner Info */}
      <div className="absolute bottom-0 left-0 right-0 p-2">
        <p className="truncate text-xs font-medium text-white">
          {artwork.ownerName}
        </p>
        {artwork.ownerNote && (
          <p className="truncate text-[10px] text-white/70">
            {artwork.ownerNote}
          </p>
        )}
      </div>

      {/* Crown Badge */}
      <div className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500/90">
        <Crown className="h-3 w-3 text-white" />
      </div>
    </div>
  )
}

// Export helper functions for ClaimModal
export function addClaimedArtwork(item: WallArtItem) {
  const items = loadWallOfArt()
  items.unshift(item) // Add to beginning
  saveWallOfArt(items)
  return items
}

export function getWallOfArt() {
  return loadWallOfArt()
}

// Check if an artwork (by seed) is already claimed
export function isArtworkClaimed(seed: number): WallArtItem | null {
  const items = loadWallOfArt()
  return items.find(item => item.artworkData.seed === seed) || null
}

// Get all claimed seeds (for quick lookup)
export function getClaimedSeeds(): Set<number> {
  const items = loadWallOfArt()
  return new Set(items.map(item => item.artworkData.seed))
}
