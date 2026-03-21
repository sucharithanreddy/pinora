'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { Pin, UserProfile, WallArtItem } from '@/types'
import { generatePins } from '@/lib/pin-data'
import { Header } from './Header'
import { MasonryGrid } from './MasonryGrid'
import { PinModal } from './PinModal'
import { ClaimModal } from './ClaimModal'
import { WallOfArt, addClaimedArtwork, getWallOfArt } from './WallOfArt'
import { Toast } from './Toast'
import { SkeletonGrid } from './Skeleton'
import { ArrowUp, Bookmark, Sparkles, Crown } from 'lucide-react'
import { Button } from './ui/button'

// Storage keys
const STORAGE_KEY = 'pinora_user_profile'
const DISCOVERIES_KEY = 'pinora_discoveries'

// Performance: Limit max pins in memory for smooth scrolling
const MAX_PINS_IN_MEMORY = 200

// Load user profile from localStorage
function loadUserProfile(): UserProfile {
  if (typeof window === 'undefined') {
    return { savedPins: [], likedPins: [], likeCounts: {} }
  }
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch {
    // Ignore errors
  }
  return { savedPins: [], likedPins: [], likeCounts: {} }
}

// Save user profile to localStorage
function saveUserProfile(profile: UserProfile) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
  } catch {
    // Ignore errors
  }
}

// Format large numbers
function formatNumber(n: number): string {
  if (n >= 1e12) return (n / 1e12).toFixed(1) + 'T'
  if (n >= 1e9) return (n / 1e9).toFixed(1) + 'B'
  if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M'
  if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K'
  return n.toString()
}

export function PinoraApp() {
  const [allPins, setAllPins] = useState<Pin[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPin, setSelectedPin] = useState<Pin | null>(null)
  const [toastMessage, setToastMessage] = useState('')
  const [showToast, setShowToast] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showFab, setShowFab] = useState(false)
  const [showSaved, setShowSaved] = useState(false)
  const [showLiked, setShowLiked] = useState(false)
  const [showWall, setShowWall] = useState(false)
  const [claimingPin, setClaimingPin] = useState<Pin | null>(null)
  const [refreshWall, setRefreshWall] = useState(0)
  
  // User profile state (real persistence)
  const [userProfile, setUserProfile] = useState<UserProfile>({
    savedPins: [],
    likedPins: [],
    likeCounts: {},
  })

  // Stats
  const [totalDiscoveries, setTotalDiscoveries] = useState(0)

  // Load data on mount
  useEffect(() => {
    const profile = loadUserProfile()
    setUserProfile(profile)
    
    const savedDiscoveries = localStorage.getItem(DISCOVERIES_KEY)
    if (savedDiscoveries) setTotalDiscoveries(parseInt(savedDiscoveries))

    // Generate initial pins
    const pins = generatePins(60)
    setAllPins(pins)
    setTotalDiscoveries(prev => {
      const updated = prev + pins.length
      localStorage.setItem(DISCOVERIES_KEY, updated.toString())
      return updated
    })
  }, [])

  // Save profile on changes
  useEffect(() => {
    saveUserProfile(userProfile)
  }, [userProfile])

  // Apply user's likes and saves to pins (real-time)
  const pinsWithUserData = useMemo(() => {
    return allPins.map(pin => ({
      ...pin,
      liked: userProfile.likedPins.includes(pin.id),
      saved: userProfile.savedPins.includes(pin.id),
      likes: (userProfile.likeCounts[pin.id] || 0),
    }))
  }, [allPins, userProfile])

  // Filter pins based on search, saved, and liked view
  const filteredPins = useMemo(() => {
    let pins = pinsWithUserData
    
    if (showSaved) {
      pins = pins.filter(pin => pin.saved)
    }
    
    if (showLiked) {
      pins = pins.filter(pin => pin.liked)
    }
    
    const query = searchQuery.toLowerCase().trim()
    if (query) {
      // Get claimed artworks for owner name search
      const claimedArtworks = getWallOfArt()
      
      // First, filter existing pins
      const matchingPins = pins.filter(pin => {
        // Search by seed number (e.g., "123456" or "#123456")
        const seedStr = pin.seed.toString()
        const seedMatch = seedStr.includes(query) || 
                          query.replace('#', '') === seedStr.slice(0, query.replace('#', '').length)
        
        // Search by title
        const titleMatch = pin.title.toLowerCase().includes(query)
        
        // Search by tags (art style)
        const tagMatch = pin.tags.some(t => t.toLowerCase().includes(query))
        
        // Search by owner name (if claimed)
        const claimedInfo = claimedArtworks.find(a => a.artworkData.seed === pin.seed)
        const ownerMatch = claimedInfo?.ownerName.toLowerCase().includes(query) || false
        
        // Search by owner note (if claimed)
        const noteMatch = claimedInfo?.ownerNote?.toLowerCase().includes(query) || false
        
        return seedMatch || titleMatch || tagMatch || ownerMatch || noteMatch
      })
      
      // Also find claimed artworks that match but aren't in current pins
      const currentPinSeeds = new Set(pins.map(p => p.seed))
      const matchingClaimedNotInView = claimedArtworks.filter(claimed => {
        // Skip if already in view
        if (currentPinSeeds.has(claimed.artworkData.seed)) return false
        
        // Search by owner name
        if (claimed.ownerName.toLowerCase().includes(query)) return true
        
        // Search by owner note
        if (claimed.ownerNote?.toLowerCase().includes(query)) return true
        
        // Search by seed
        if (claimed.artworkData.seed.toString().includes(query)) return true
        
        // Search by title (if stored)
        if (claimed.artworkData.title?.toLowerCase().includes(query)) return true
        
        // Search by art style (if stored)
        if (claimed.artworkData.artStyle?.toLowerCase().includes(query)) return true
        
        return false
      }).map(claimed => ({
        id: `claimed-${claimed.id}`,
        title: claimed.artworkData.title || `Artwork #${claimed.artworkData.seed.toString().slice(0, 6)}`,
        category: 'Generative Art',
        description: `Owned by ${claimed.ownerName}`,
        seed: claimed.artworkData.seed,
        height: 250,
        likes: 0,
        liked: false,
        saved: false,
        tags: claimed.artworkData.tags || [claimed.artworkData.artStyle || 'FlowField'],
        createdAt: new Date(claimed.claimedAt),
      })) as Pin[]
      
      return [...matchingPins, ...matchingClaimedNotInView]
    }
    
    return pins
  }, [pinsWithUserData, searchQuery, showSaved, showLiked])

  // Scroll listener (throttled for performance)
  useEffect(() => {
    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setShowFab(window.scrollY > 600)
          ticking = false
        })
        ticking = true
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Infinite scroll with sliding window
  useEffect(() => {
    let ticking = false
    const handleScroll = () => {
      if (loading || ticking) return
      
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 600
      ) {
        ticking = true
        setLoading(true)
        
        // Use requestAnimationFrame for smoother rendering
        requestAnimationFrame(() => {
          setTimeout(() => {
            const newPins = generatePins(20)
            setAllPins((prev) => {
              // Sliding window: Keep only the most recent pins
              const combined = [...prev, ...newPins]
              if (combined.length > MAX_PINS_IN_MEMORY) {
                // Keep saved/liked pins + recent pins
                const savedIds = new Set(userProfile.savedPins)
                const likedIds = new Set(userProfile.likedPins)
                const important = combined.filter(p => savedIds.has(p.id) || likedIds.has(p.id))
                const recent = combined.filter(p => !savedIds.has(p.id) && !likedIds.has(p.id)).slice(-MAX_PINS_IN_MEMORY + important.length)
                return [...important, ...recent]
              }
              return combined
            })
            setTotalDiscoveries((prev) => {
              const updated = prev + 20
              localStorage.setItem(DISCOVERIES_KEY, updated.toString())
              return updated
            })
            setLoading(false)
            ticking = false
          }, 300)
        })
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [loading, userProfile.savedPins, userProfile.likedPins])

  // Show toast
  const showToastMessage = useCallback((message: string) => {
    setToastMessage(message)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 2500)
  }, [])

  // Handle like (REAL with localStorage persistence)
  const handleLike = useCallback((id: string) => {
    setUserProfile(prev => {
      const isLiked = prev.likedPins.includes(id)
      const currentCount = prev.likeCounts[id] || 0
      
      return {
        savedPins: prev.savedPins,
        likedPins: isLiked 
          ? prev.likedPins.filter(pid => pid !== id)
          : [...prev.likedPins, id],
        likeCounts: {
          ...prev.likeCounts,
          [id]: isLiked ? Math.max(0, currentCount - 1) : currentCount + 1,
        },
      }
    })
    
    // Update selected pin if modal is open
    setSelectedPin(prev => {
      if (!prev || prev.id !== id) return prev
      const newLiked = !prev.liked
      return {
        ...prev,
        liked: newLiked,
        likes: newLiked ? prev.likes + 1 : Math.max(0, prev.likes - 1),
      }
    })
  }, [])

  // Handle save (REAL with localStorage persistence)
  const handleSave = useCallback((id: string) => {
    setUserProfile(prev => {
      const isSaved = prev.savedPins.includes(id)
      return {
        ...prev,
        savedPins: isSaved 
          ? prev.savedPins.filter(pid => pid !== id)
          : [...prev.savedPins, id],
      }
    })
    
    // Update selected pin if modal is open
    setSelectedPin(prev => {
      if (!prev || prev.id !== id) return prev
      const newSaved = !prev.saved
      return { ...prev, saved: newSaved }
    })
    
    const pin = allPins.find(p => p.id === id)
    const isCurrentlySaved = userProfile.savedPins.includes(id)
    showToastMessage(isCurrentlySaved ? 'Removed from saved' : 'Saved to your collection!')
  }, [allPins, userProfile.savedPins, showToastMessage])

  // Handle claim (for Wall of Art)
  const handleClaim = useCallback((pin: Pin) => {
    setClaimingPin(pin)
  }, [])

  // Handle claim submission
  const handleClaimSubmit = useCallback(async (pinId: string, ownerName: string, ownerNote: string, ownerEmail: string) => {
    const pin = allPins.find(p => p.id === pinId)
    if (!pin) return

    // Recreate the seeds from the pin's seed
    const seed = pin.seed
    const seeds = {
      hueSeed: (seed * 17) % 1000000000,
      satSeed: (seed * 31) % 1000000000,
      lightSeed: (seed * 47) % 1000000000,
      styleSeed: (seed * 61) % 1000000000,
      shapeSeed: (seed * 73) % 1000000000,
      positionSeed: (seed * 89) % 1000000000,
      sizeSeed: (seed * 97) % 1000000000,
    }

    const wallItem: WallArtItem = {
      id: `claimed-${Date.now()}-${pin.seed}`,
      ownerName,
      ownerNote: ownerNote || undefined,
      claimedAt: new Date().toISOString(),
      artworkData: {
        seed: pin.seed,
        seeds,
        artStyle: pin.tags?.[0] || 'FlowField',
        title: pin.title,
        tags: pin.tags,
      },
    }

    addClaimedArtwork(wallItem)
    setRefreshWall(prev => prev + 1)
    
    // Send email with artwork
    try {
      await fetch('/api/send-artwork-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: ownerEmail,
          ownerName,
          ownerNote,
          artworkTitle: pin.title,
          artworkSeed: pin.seed,
          artworkStyle: pin.tags?.[0] || 'Generative',
          seeds,
        }),
      })
    } catch (err) {
      console.error('Failed to send email:', err)
    }
    
    showToastMessage(`🎉 Congratulations ${ownerName}! Check your email for your artwork!`)
  }, [allPins, showToastMessage])

  // Scroll to top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const savedCount = userProfile.savedPins.length
  const likedCount = userProfile.likedPins.length

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Header */}
      <Header 
        searchQuery={searchQuery} 
        onSearchChange={setSearchQuery}
        savedCount={savedCount}
        likedCount={likedCount}
        onShowSaved={() => setShowSaved(!showSaved)}
        showSaved={showSaved}
        onShowWall={() => setShowWall(!showWall)}
        showWall={showWall}
        onShowLiked={() => setShowLiked(!showLiked)}
        showLiked={showLiked}
      />

      {/* Hero - Only show on main discover view */}
      {!showWall && (
        <section className="relative mx-auto max-w-[800px] px-6 pb-4 pt-8 text-center sm:pt-10">
          {/* Badge */}
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs font-medium text-[var(--accent)] sm:mb-4 sm:px-4 sm:py-1.5 sm:text-sm">
            <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
            10^63 Unique Artworks
          </div>
          
          <h1 className="font-display text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            <span className="bg-gradient-to-br from-[var(--accent)] via-orange-400 to-amber-500 bg-clip-text text-transparent">
              The Infinite Canvas
            </span>
          </h1>
          <p className="mx-auto mt-3 max-w-[500px] text-sm leading-relaxed text-[var(--text-secondary)] sm:mt-4 sm:text-base">
            Scroll through infinite unique generative artworks. Each piece is algorithmically created and will never repeat.
          </p>

          {/* Wall of Art Promo */}
          <button
            onClick={() => setShowWall(true)}
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 px-4 py-2 text-sm font-medium text-amber-600 transition-all hover:from-amber-500/30 hover:to-orange-500/30 dark:text-amber-400"
          >
            <Crown className="h-4 w-4" />
            Be part of the Memory Wall forever — own for $1
          </button>

          {/* Stats Bar */}
          <div className="mt-5 flex flex-wrap justify-center gap-3 sm:mt-6 sm:gap-4">
            <div className="rounded-xl bg-[var(--bg-card)] px-4 py-2 shadow-[var(--shadow-sm)] sm:rounded-2xl sm:px-6 sm:py-3 sm:shadow-[var(--shadow-md)]">
              <div className="text-lg font-bold text-[var(--accent)] sm:text-2xl">{formatNumber(totalDiscoveries)}</div>
              <div className="text-[10px] text-[var(--text-muted)] sm:text-xs">Discovered</div>
            </div>
            <div className="rounded-xl bg-[var(--bg-card)] px-4 py-2 shadow-[var(--shadow-sm)] sm:rounded-2xl sm:px-6 sm:py-3 sm:shadow-[var(--shadow-md)]">
              <div className="text-lg font-bold text-[var(--text-primary)] sm:text-2xl">∞</div>
              <div className="text-[10px] text-[var(--text-muted)] sm:text-xs">Possible</div>
            </div>
            <button 
              onClick={() => setShowSaved(!showSaved)}
              className="rounded-xl bg-[var(--bg-card)] px-4 py-2 shadow-[var(--shadow-sm)] transition-all hover:shadow-[var(--shadow-md)] sm:rounded-2xl sm:px-6 sm:py-3"
            >
              <div className="flex items-center gap-1.5 text-lg font-bold text-[var(--text-primary)] sm:text-2xl">
                <Bookmark className="h-4 w-4 sm:h-5 sm:w-5" fill={showSaved ? 'var(--accent)' : 'none'} />
                {savedCount}
              </div>
              <div className="text-[10px] text-[var(--text-muted)] sm:text-xs">Saved</div>
            </button>
          </div>
        </section>
      )}

      {/* Wall of Art Header */}
      {showWall && (
        <section className="relative mx-auto max-w-[800px] px-6 pb-2 pt-8 text-center sm:pt-10">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 px-4 py-1.5 text-sm font-medium text-amber-600 dark:text-amber-400">
            <Crown className="h-4 w-4" />
            Forever Remembered
          </div>
          <h1 className="font-display text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
            <span className="bg-gradient-to-br from-amber-500 to-orange-500 bg-clip-text text-transparent">
              Memory Wall
            </span>
          </h1>
          <p className="mx-auto mt-3 max-w-[500px] text-sm leading-relaxed text-[var(--text-secondary)] sm:mt-4 sm:text-base">
            Be part of the Memory Wall forever. Own any artwork for $1 — it becomes exclusively yours, displayed here for eternity.
          </p>
        </section>
      )}

      {/* Saved View Indicator */}
      {showSaved && (
        <div className="mx-auto max-w-[1600px] px-4 py-2">
          <div className="flex items-center justify-between rounded-lg bg-[var(--accent-soft)] px-4 py-2">
            <span className="text-sm font-medium text-[var(--accent)]">
              {filteredPins.length} saved {filteredPins.length === 1 ? 'artwork' : 'artworks'}
            </span>
            <button 
              onClick={() => setShowSaved(false)}
              className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Liked View Indicator */}
      {showLiked && (
        <div className="mx-auto max-w-[1600px] px-4 py-2">
          <div className="flex items-center justify-between rounded-lg bg-red-500/10 px-4 py-2">
            <span className="text-sm font-medium text-red-500">
              {filteredPins.length} liked {filteredPins.length === 1 ? 'artwork' : 'artworks'}
            </span>
            <button 
              onClick={() => setShowLiked(false)}
              className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Wall of Art View OR Main Grid */}
      {showWall ? (
        <WallOfArt key={refreshWall} />
      ) : (
        <>
          {/* Grid */}
          {filteredPins.length > 0 ? (
            <MasonryGrid
              pins={filteredPins}
              onLike={handleLike}
              onSave={handleSave}
              onPinClick={setSelectedPin}
            />
          ) : (
            <div className="py-20 text-center text-[var(--text-muted)]">
              <Bookmark className="mx-auto mb-4 h-12 w-12 opacity-50" />
              <p className="text-sm sm:text-base">
                {showSaved ? 'No saved artworks yet. Click the bookmark icon on any artwork to save it!' : showLiked ? 'No liked artworks yet. Click the heart icon on any artwork to like it!' : 'No artworks found. Try a different search.'}
              </p>
            </div>
          )}

          {/* Loading Skeletons */}
          {loading && <SkeletonGrid count={6} />}
        </>
      )}

      {/* Modal */}
      <PinModal
        pin={selectedPin}
        open={!!selectedPin}
        onOpenChange={(open) => !open && setSelectedPin(null)}
        onSave={handleSave}
        onLike={handleLike}
        onClaim={handleClaim}
      />

      {/* Claim Modal */}
      {claimingPin && (
        <ClaimModal
          pin={claimingPin}
          open={!!claimingPin}
          onOpenChange={(open) => !open && setClaimingPin(null)}
          onClaim={handleClaimSubmit}
        />
      )}

      {/* Toast */}
      <Toast message={toastMessage} visible={showToast} />

      {/* FAB */}
      {showFab && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 h-12 w-12 rounded-full shadow-[var(--shadow-lg)] transition-transform hover:scale-110 hover:shadow-[var(--shadow-xl)] sm:h-14 sm:w-14"
          size="icon"
        >
          <ArrowUp className="h-5 w-5" />
        </Button>
      )}
    </div>
  )
}
