export interface Pin {
  id: string
  title: string
  category: string
  description: string
  seed: number
  height: number
  likes: number
  liked: boolean
  saved: boolean
  tags: string[]
  createdAt: Date
}

export interface Category {
  name: string
  count?: number
}

export type SortOption = 'recent' | 'popular' | 'trending'

// User's saved pins stored in localStorage
export interface UserProfile {
  savedPins: string[]
  likedPins: string[]
  likeCounts: Record<string, number>
}

// Claimed artwork for the Wall of Art
export interface ClaimedArtwork {
  id: string
  pinId: string
  ownerName: string
  ownerNote?: string // Optional short note
  claimedAt: Date
  seed: number
  hueSeed: number
  satSeed: number
  lightSeed: number
  styleSeed: number
  shapeSeed: number
  positionSeed: number
  sizeSeed: number
  artStyle: string
  paymentId?: string // Stripe payment ID
}

// Wall of Art gallery item
export interface WallArtItem {
  id: string
  ownerName: string
  ownerNote?: string
  claimedAt: string
  artworkData: {
    seed: number
    seeds: {
      hueSeed: number
      satSeed: number
      lightSeed: number
      styleSeed: number
      shapeSeed: number
      positionSeed: number
      sizeSeed: number
    }
    artStyle: string
    title?: string
    tags?: string[]
  }
}
