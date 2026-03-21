'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Pin } from '@/types'
import { generatePremiumArt } from '@/lib/generative-art-v3'
import { formatNumber, cn } from '@/lib/utils'
import { Heart, Gem, Bookmark } from 'lucide-react'

// Cache for rendered canvas images
const imageCache = new Map<number, string>()

interface PinCardProps {
  pin: Pin
  index: number
  onLike: (id: string) => void
  onSave: (id: string) => void
  onClick: () => void
}

export function PinCard({ pin, index, onLike, onSave, onClick }: PinCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  // Lazy load canvas when in viewport
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
            observer.unobserve(entry.target)
          }
        })
      },
      {
        rootMargin: '200px', // Start loading before visible
        threshold: 0.01,
      }
    )

    observer.observe(container)

    return () => {
      observer.disconnect()
    }
  }, [])

  // Render canvas when visible
  useEffect(() => {
    if (!isVisible || !canvasRef.current) return

    const canvas = canvasRef.current
    
    // Check cache first
    const cachedImage = imageCache.get(pin.seed)
    if (cachedImage) {
      // Use cached image
      const ctx = canvas.getContext('2d')
      if (ctx) {
        const img = new Image()
        img.onload = () => {
          canvas.width = 300
          canvas.height = pin.height
          ctx.drawImage(img, 0, 0, 300, pin.height)
          setIsLoaded(true)
        }
        img.src = cachedImage
      }
      return
    }

    // Generate new artwork
    canvas.width = 300
    canvas.height = pin.height

    const seed = pin.seed
    const hueSeed = (seed * 17) % 1000000000
    const satSeed = (seed * 31) % 1000000000
    const lightSeed = (seed * 47) % 1000000000
    const styleSeed = (seed * 61) % 1000000000
    const shapeSeed = (seed * 73) % 1000000000
    const positionSeed = (seed * 89) % 1000000000
    const sizeSeed = (seed * 97) % 1000000000

    generatePremiumArt(canvas, hueSeed, satSeed, lightSeed, styleSeed, shapeSeed, positionSeed, sizeSeed)
    
    // Cache the rendered image
    try {
      const dataUrl = canvas.toDataURL('image/png', 0.8)
      imageCache.set(pin.seed, dataUrl)
    } catch (e) {
      // Ignore caching errors
    }
    
    setIsLoaded(true)
  }, [isVisible, pin])

  return (
    <div
      ref={containerRef}
      className="pin-card group cursor-pointer rounded-xl bg-[var(--bg-card)] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
      style={{ animationDelay: `${(index % 20) * 0.04}s` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Image Container */}
      <div className="relative overflow-hidden rounded-xl">
        {/* Placeholder while loading */}
        {!isLoaded && (
          <div 
            className="w-full animate-pulse bg-gradient-to-br from-[var(--bg-tertiary)] to-[var(--bg-secondary)]"
            style={{ height: pin.height }}
          />
        )}
        
        <canvas 
          ref={canvasRef} 
          className={cn(
            "block w-full transition-opacity duration-300",
            isLoaded ? "opacity-100" : "opacity-0 absolute inset-0"
          )}
        />

        {/* Hover Overlay */}
        <div
          className={cn(
            'absolute inset-0 flex items-end justify-between p-3 transition-opacity duration-300',
            'bg-gradient-to-t from-black/40 to-transparent',
            isHovered ? 'opacity-100' : 'opacity-0'
          )}
        >
          {/* Save Button */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              onSave(pin.id)
            }}
            className={cn(
              'flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium backdrop-blur-sm transition-all',
              pin.saved
                ? 'bg-[var(--accent)] text-white'
                : 'bg-white/90 text-gray-700 hover:bg-white'
            )}
          >
            <Bookmark className="h-4 w-4" fill={pin.saved ? 'currentColor' : 'none'} />
          </button>

          {/* Like Button */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              onLike(pin.id)
            }}
            className={cn(
              'flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium backdrop-blur-sm transition-all',
              pin.liked
                ? 'bg-red-500 text-white'
                : 'bg-white/90 text-gray-700 hover:bg-white'
            )}
          >
            <Heart className="h-4 w-4" fill={pin.liked ? 'currentColor' : 'none'} />
            {formatNumber(pin.likes)}
          </button>
        </div>

        {/* Seed Badge */}
        <div className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-black/50 px-2 py-1 text-[10px] font-medium text-white backdrop-blur-sm">
          <Gem className="h-3 w-3" />
          #{pin.seed.toString().slice(0, 6)}
        </div>
      </div>
    </div>
  )
}
