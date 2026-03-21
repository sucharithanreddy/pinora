'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Pin } from '@/types'
import { generatePremiumArt } from '@/lib/generative-art-v3'
import {
  Dialog,
  DialogContent,
  DialogClose,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { X, Bookmark, Share2, Download, Gem, Heart, Check, Crown, Lock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatNumber } from '@/lib/utils'
import { isArtworkClaimed } from './WallOfArt'
import { WallArtItem } from '@/types'

interface PinModalProps {
  pin: Pin | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (id: string) => void
  onLike: (id: string) => void
  onClaim?: (pin: Pin) => void
}

export function PinModal({ pin, open, onOpenChange, onSave, onLike, onClaim }: PinModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [copied, setCopied] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [claimedBy, setClaimedBy] = useState<WallArtItem | null>(null)

  useEffect(() => {
    if (!pin || !open) return

    // Check if artwork is already claimed
    const claimInfo = isArtworkClaimed(pin.seed)
    setClaimedBy(claimInfo)

    // Small delay to ensure canvas is mounted in the DOM (portal timing)
    const timeoutId = setTimeout(() => {
      if (canvasRef.current) {
        const canvas = canvasRef.current
        canvas.width = 800
        canvas.height = Math.round(pin.height * (800 / 300))

        // Use 7-dimensional seed system for 10^63 uniqueness
        const seed = pin.seed
        const hueSeed = (seed * 17) % 1000000000
        const satSeed = (seed * 31) % 1000000000
        const lightSeed = (seed * 47) % 1000000000
        const styleSeed = (seed * 61) % 1000000000
        const shapeSeed = (seed * 73) % 1000000000
        const positionSeed = (seed * 89) % 1000000000
        const sizeSeed = (seed * 97) % 1000000000

        generatePremiumArt(canvas, hueSeed, satSeed, lightSeed, styleSeed, shapeSeed, positionSeed, sizeSeed)
      }
    }, 50)

    return () => clearTimeout(timeoutId)
  }, [pin, open])

  const handleDownload = async () => {
    if (!canvasRef.current || !pin) return
    
    setDownloading(true)
    try {
      const canvas = canvasRef.current
      const link = document.createElement('a')
      link.download = `pinora-${pin.seed.toString().slice(0, 6)}.png`
      link.href = canvas.toDataURL('image/png', 1.0)
      link.click()
    } finally {
      setDownloading(false)
    }
  }

  const handleShare = async () => {
    if (!pin) return
    
    const shareText = `"${pin.title}" on The Infinite Canvas - 10^63 unique generative artworks`
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: pin.title,
          text: shareText,
          url: window.location.href,
        })
      } catch {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(`${shareText}\n${window.location.href}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (!pin) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] w-full max-w-[900px] flex-col overflow-hidden rounded-[var(--radius-lg)] bg-[var(--bg-card)] p-0 sm:flex-row">
        {/* Close Button */}
        <DialogClose asChild>
          <button className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/70">
            <X className="h-5 w-5" />
          </button>
        </DialogClose>

        {/* Image Section */}
        <div className="flex min-w-0 flex-1 items-center justify-center overflow-hidden bg-[var(--bg-secondary)] p-4 sm:rounded-l-[var(--radius-lg)]">
          <canvas
            ref={canvasRef}
            className="block h-auto max-h-[50vh] w-auto max-w-full rounded-lg shadow-lg sm:max-h-[70vh]"
            style={{ imageRendering: 'crisp-edges' }}
          />
        </div>

        {/* Content Section */}
        <div className="flex min-w-[280px] flex-1 flex-col overflow-y-auto p-6 sm:p-8">
          {/* Seed Badge */}
          <div className="mb-2 inline-flex w-fit items-center gap-1.5 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 px-3 py-1 text-xs font-medium text-purple-600 dark:text-purple-400">
            <Gem className="h-3 w-3" />
            Unique #{pin.seed.toString().slice(0, 8)}
          </div>

          <h2 className="font-display text-xl font-bold text-[var(--text-primary)] sm:text-2xl">
            {pin.title}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
            {pin.description}
          </p>

          {/* Tags */}
          <div className="mt-4 flex flex-wrap gap-1.5">
            {pin.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs font-medium text-[var(--accent)]"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Stats */}
          <div className="mt-5 flex items-center gap-4 border-t border-[var(--border)] pt-5">
            <button
              onClick={() => onLike(pin.id)}
              className={cn(
                'flex items-center gap-2 text-sm transition-colors',
                pin.liked ? 'text-[var(--accent)]' : 'text-[var(--text-muted)] hover:text-[var(--accent)]'
              )}
            >
              <Heart className="h-5 w-5" fill={pin.liked ? 'currentColor' : 'none'} />
              {formatNumber(pin.likes)} likes
            </button>
          </div>

          {/* Actions */}
          <div className="mt-5 space-y-2">
            {/* Save & Share */}
            <div className="flex gap-2">
              <Button
                onClick={() => onSave(pin.id)}
                variant={pin.saved ? 'saved' : 'default'}
                className="flex-1"
              >
                <Bookmark className="h-4 w-4" fill={pin.saved ? 'currentColor' : 'none'} />
                {pin.saved ? 'Saved' : 'Save'}
              </Button>
              <Button
                variant="secondary"
                className="flex-1"
                onClick={handleShare}
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Share2 className="h-4 w-4" />
                    Share
                  </>
                )}
              </Button>
            </div>

            {/* Download */}
            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={handleDownload}
              disabled={downloading}
            >
              <Download className="h-4 w-4" />
              {downloading ? 'Downloading...' : 'Download PNG'}
            </Button>

            {/* Own - or Already Owned */}
            {claimedBy ? (
              <div className="w-full rounded-lg border border-amber-500/30 bg-gradient-to-r from-amber-500/10 to-orange-500/10 p-3">
                <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                  <Lock className="h-4 w-4" />
                  <span className="text-sm font-medium">Owned</span>
                </div>
                <p className="mt-1 text-xs text-[var(--text-muted)]">
                  This artwork belongs to <span className="font-semibold text-amber-600 dark:text-amber-400">{claimedBy.ownerName}</span>
                </p>
                {claimedBy.ownerNote && (
                  <p className="mt-0.5 truncate text-xs italic text-[var(--text-muted)]">
                    "{claimedBy.ownerNote}"
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <Button 
                  onClick={() => onClaim?.(pin)}
                  className="w-full gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                >
                  <Crown className="h-4 w-4" />
                  Own This Artwork - $1
                </Button>
                <p className="text-center text-xs text-[var(--text-muted)]">
                  This unique artwork will be exclusively yours forever
                </p>
              </div>
            )}
          </div>

          {/* Info */}
          <p className="mt-4 text-center text-xs text-[var(--text-muted)]">
            One of 10^63 unique algorithmically generated artworks.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
