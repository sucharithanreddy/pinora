import { Pin } from '@/types'

// Categories (currently unused, kept for compatibility)
export const CATEGORIES = ['All', 'Generative Art']

const ADJECTIVES = [
  'Serene', 'Vibrant', 'Ethereal', 'Bold', 'Minimal', 'Lush', 'Dreamy', 'Cosmic',
  'Rustic', 'Refined', 'Golden', 'Moody', 'Airy', 'Warm', 'Crisp', 'Sultry',
  'Daring', 'Soft', 'Wild', 'Gentle', 'Mystic', 'Radiant', 'Velvet', 'Amber',
  'Jade', 'Coral', 'Azure', 'Onyx', 'Opal', 'Crystal', 'Prism', 'Echo',
  'Nebula', 'Solstice', 'Zenith', 'Aurora', 'Cascade', 'Meadow', 'Willow', 'Sage',
]

const NOUNS = [
  'Horizon', 'Bloom', 'Haven', 'Echo', 'Drift', 'Glow', 'Muse', 'Vista',
  'Realm', 'Nest', 'Canvas', 'Oasis', 'Pulse', 'Shade', 'Spark', 'Tide',
  'Peak', 'Mist', 'Stone', 'Dusk', 'Aurora', 'Zenith', 'Solstice', 'Equinox',
  'Nebula', 'Cascade', 'Prairie', 'Canyon', 'Reef', 'Summit', 'Orchard', 'Grove',
  'Lagoon', 'Harbor', 'Summit', 'Vertex', 'Apex', 'Eclipse', 'Mirage', 'Phantom',
]

const DESCRIPTIONS = [
  'A study in contrast and harmony, blending organic forms with geometric precision.',
  'Inspired by the golden hour light cascading through ancient alleyways.',
  'Exploring the intersection of texture and negative space in modern composition.',
  'A meditation on color theory applied to everyday objects and scenes.',
  'Capturing the ephemeral beauty of transitional moments in nature.',
  'Drawing from Bauhaus principles to create something entirely contemporary.',
  'The subtle art of imperfection — wabi-sabi meets modern aesthetics.',
  'An homage to brutalist architecture softened by natural elements.',
  'Where minimalism meets maximalism in an unexpected visual dialogue.',
  'Curated chaos: finding patterns in the beautifully random.',
  'A visual symphony composed in the key of chromatic intensity.',
  'Fragmented light refracting through prisms of imagination.',
  'The delicate balance between structure and spontaneity.',
  'Layers of meaning hidden within abstract topographies.',
  'A journey through the spectrum of human emotion.',
  'Decoding the language of shapes and their silent conversations.',
  'Moments frozen in the eternal dance of color and form.',
  'An exploration of boundaries and the spaces between them.',
  'Finding infinity within the confines of a single frame.',
  'The poetry of geometry written in light and shadow.',
  'Rhythms of nature translated into visual harmonies.',
  'Where chaos and order meet in perfect equilibrium.',
  'Abstract narratives told through the language of hue.',
  'Dimensional shifting through planes of color perception.',
  'The architecture of dreams rendered in pigment and light.',
]

// Art style names for tags (matching generative-art-v3.ts)
const ART_STYLES = [
  'FlowField', 'LiquidChrome', 'InkBleed', 'SmokeWisps',
  'Voronoi', 'SacredGeometry', 'ParametricWaves', 'Crystalline',
  'NeuralNetwork', 'DendriteGrowth', 'CoralReef', 'Mycelium',
  'Nebula', 'Aurora', 'StarField', 'CosmicDust',
  'GlitchArt', 'GradientMesh', 'NoiseLandscape', 'ChromaticAberration',
  'Mandala', 'Kaleidoscope', 'FractalTree', 'SacredCircle',
  'IsometricWorld', 'ImpossibleGeometry', 'ArchitecturalLines',
  'ZenGarden', 'DotMatrix', 'BreathingCircles', 'LineHorizon',
]

// Seeded random for deterministic selection
function seededRandom(seed: number): () => number {
  let s = seed
  return function () {
    s = (s * 16807 + 0) % 2147483647
    return (s - 1) / 2147483646
  }
}

// Track used combinations to ensure uniqueness
const usedCombinations = new Set<string>()

function getUniqueSeeds(): {
  hueSeed: number
  satSeed: number
  lightSeed: number
  styleSeed: number
  shapeSeed: number
  positionSeed: number
  sizeSeed: number
} {
  let combination: string
  let attempts = 0
  let seeds: {
    hueSeed: number
    satSeed: number
    lightSeed: number
    styleSeed: number
    shapeSeed: number
    positionSeed: number
    sizeSeed: number
  }

  do {
    seeds = {
      hueSeed: Math.floor(Math.random() * 1000000000),
      satSeed: Math.floor(Math.random() * 1000000000),
      lightSeed: Math.floor(Math.random() * 1000000000),
      styleSeed: Math.floor(Math.random() * 1000000000),
      shapeSeed: Math.floor(Math.random() * 1000000000),
      positionSeed: Math.floor(Math.random() * 1000000000),
      sizeSeed: Math.floor(Math.random() * 1000000000),
    }

    combination = `${seeds.hueSeed}-${seeds.satSeed}-${seeds.lightSeed}-${seeds.styleSeed}-${seeds.shapeSeed}-${seeds.positionSeed}-${seeds.sizeSeed}`
    
    attempts++
    if (attempts > 100000) {
      const ts = Date.now()
      seeds = {
        hueSeed: (ts * 7) % 1000000000,
        satSeed: (ts * 13) % 1000000000,
        lightSeed: (ts * 17) % 1000000000,
        styleSeed: (ts * 23) % 1000000000,
        shapeSeed: (ts * 29) % 1000000000,
        positionSeed: (ts * 31) % 1000000000,
        sizeSeed: (ts * 37) % 1000000000,
      }
      combination = `${seeds.hueSeed}-${seeds.satSeed}-${seeds.lightSeed}-${seeds.styleSeed}-${seeds.shapeSeed}-${seeds.positionSeed}-${seeds.sizeSeed}`
    }
  } while (usedCombinations.has(combination))

  usedCombinations.add(combination)
  return seeds
}

export function generatePins(count: number): Pin[] {
  const pins: Pin[] = []
  const timestamp = Date.now()

  for (let i = 0; i < count; i++) {
    const seeds = getUniqueSeeds()
    
    const combinedSeed = seeds.hueSeed + seeds.satSeed * 2 + seeds.lightSeed * 3
    const random = seededRandom(combinedSeed)

    // Random art style
    const styleIndex = Math.floor(seededRandom(seeds.styleSeed)() * ART_STYLES.length)
    const style = ART_STYLES[styleIndex]

    // Height
    const height = 180 + Math.floor(seededRandom(seeds.sizeSeed)() * 200)

    // Title
    const adjIndex = Math.floor(seededRandom(seeds.positionSeed)() * ADJECTIVES.length)
    const nounIndex = Math.floor(seededRandom(seeds.positionSeed * 7)() * NOUNS.length)
    const title = `${ADJECTIVES[adjIndex]} ${NOUNS[nounIndex]}`

    // Description
    const descIndex = Math.floor(random() * DESCRIPTIONS.length)

    // Primary seed
    const seed = seeds.hueSeed

    // Tags (include style name)
    const tags = [style, ADJECTIVES[adjIndex].toLowerCase(), NOUNS[nounIndex].toLowerCase()]

    pins.push({
      id: `${timestamp}-${i}-${seeds.hueSeed}`,
      title,
      category: 'Generative Art', // Single unified category
      description: DESCRIPTIONS[descIndex],
      seed,
      height,
      likes: 0,
      liked: false,
      saved: false,
      tags,
      createdAt: new Date(),
    })
  }

  return pins
}

// Clear used combinations (for testing)
export function clearUsedCombinations(): void {
  usedCombinations.clear()
}

// Get stats about unique combinations
export function getUniqueStats(): { used: number; remaining: string } {
  const used = usedCombinations.size
  const remaining = '10^63 (Octillion)'
  return { used, remaining }
}
