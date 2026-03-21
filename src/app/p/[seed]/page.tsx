'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'next/navigation'
import { generatePremiumArt } from '@/lib/generative-art-v3'
import { Crown, Gem, Share2, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { isArtworkClaimed } from '@/components/WallOfArt'
import { useRouter } from 'next/navigation'

export default function ArtworkPage() {
  const params = useParams()
  const router = useRouter()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [loading, setLoading] = useState(true)
  const [seed, setSeed] = useState<number | null>(null)
  const [owner, setOwner] = useState<{ name: string; note?: string } | null>(null)

  useEffect(() => {
    const seedParam = params.seed as string
    if (seedParam) {
      const parsedSeed = parseInt(seedParam)
      if (!isNaN(parsedSeed)) {
        setSeed(parsedSeed)
        
        // Check if owned
        const claimInfo = isArtworkClaimed(parsedSeed)
        if (claimInfo) {
          setOwner({ name: claimInfo.ownerName, note: claimInfo.ownerNote })
        }
      }
    }
  }, [params.seed])

  useEffect(() => {
    if (!seed || !canvasRef.current) return

    const canvas = canvasRef.current
    canvas.width = 800
    canvas.height = 800

    const hueSeed = (seed * 17) % 1000000000
    const satSeed = (seed * 31) % 1000000000
    const lightSeed = (seed * 47) % 1000000000
    const styleSeed = (seed * 61) % 1000000000
    const shapeSeed = (seed * 73) % 1000000000
    const positionSeed = (seed * 89) % 1000000000
    const sizeSeed = (seed * 97) % 1000000000

    generatePremiumArt(canvas, hueSeed, satSeed, lightSeed, styleSeed, shapeSeed, positionSeed, sizeSeed)
    setLoading(false)
  }, [seed])

  const handleShare = async () => {
    const url = window.location.href
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: owner ? `Artwork owned by ${owner.name}` : 'Unique Artwork on Pinora',
          text: owner 
            ? `This artwork is owned by ${owner.name}. See it on Pinora!`
            : 'Check out this unique generative artwork!',
          url,
        })
      } catch {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(url)
      alert('Link copied!')
    }
  }

  if (!seed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--bg-primary)]">
        <div className="text-[var(--text-muted)]">Artwork not found</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Header */}
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-[var(--border)] bg-[var(--bg-overlay)] backdrop-blur-lg">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <button 
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">Back to Discover</span>
          </button>
          
          <button onClick={handleShare} className="text-[var(--text-muted)] hover:text-[var(--text-primary)]">
            <Share2 className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-4 pb-16 pt-20">
        {/* Artwork */}
        <div className="relative overflow-hidden rounded-2xl bg-[var(--bg-card)] shadow-xl">
          {/* Canvas */}
          <div className="relative aspect-square">
            <canvas 
              ref={canvasRef} 
              className="h-full w-full"
              style={{ opacity: loading ? 0 : 1, transition: 'opacity 0.5s' }}
            />
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-[var(--bg-tertiary)]">
                <div className="animate-pulse text-[var(--text-muted)]">Loading artwork...</div>
              </div>
            )}

            {/* Owner Badge */}
            {owner && (
              <div className="absolute right-4 top-4 flex items-center gap-2 rounded-full bg-amber-500/90 px-4 py-2 text-sm font-medium text-white shadow-lg">
                <Crown className="h-4 w-4" />
                Owned by {owner.name}
              </div>
            )}

            {/* Seed Badge */}
            <div className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-black/50 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
              <Gem className="h-3 w-3" />
              #{seed.toString().slice(0, 8)}
            </div>
          </div>

          {/* Info */}
          <div className="p-6 text-center">
            {owner ? (
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 px-4 py-2 text-sm font-medium text-amber-600">
                  <Crown className="h-4 w-4" />
                  This artwork is owned
                </div>
                <p className="text-lg text-[var(--text-primary)]">
                  Owned by <span className="font-semibold text-amber-500">{owner.name}</span>
                </p>
                {owner.note && (
                  <p className="rounded-lg bg-[var(--bg-tertiary)] p-3 text-sm italic text-[var(--text-secondary)]">
                    "{owner.note}"
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-[var(--text-secondary)]">
                  This unique artwork is still available!
                </p>
                <Button 
                  onClick={() => router.push(`/?own=${seed}`)}
                  className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                >
                  <Crown className="mr-2 h-4 w-4" />
                  Own This Artwork for $5
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="mt-6 text-center text-sm text-[var(--text-muted)]">
          <p>One of 10^63 unique generative artworks</p>
          <p className="mt-1">Seed: {seed}</p>
        </div>
      </main>
    </div>
  )
}
