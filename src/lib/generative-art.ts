// Generate a unique color in hex format using HSL
function hslToHex(h: number, s: number, l: number): string {
  s /= 100
  l /= 100
  const a = s * Math.min(l, 1 - l)
  const f = (n: number) => {
    const k = (n + h / 30) % 12
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, '0')
  }
  return `#${f(0)}${f(8)}${f(4)}`
}

// Generate a unique palette based on multiple seed dimensions
export function generatePalette(
  hueSeed: number,
  satSeed: number,
  lightSeed: number
): string[] {
  // Base hue: 0-360 degrees (full color wheel)
  const baseHue = (hueSeed * 137.508) % 360 // Golden angle for better distribution
  
  // Saturation: 35-85% (avoiding washed out or oversaturated)
  const baseSat = 45 + (satSeed % 40)
  
  // Lightness: 35-70% (good range for visibility)
  const baseLight = 40 + (lightSeed % 30)
  
  // Generate 3 harmonious colors using color theory
  return [
    // Primary color
    hslToHex(
      baseHue,
      baseSat,
      baseLight
    ),
    // Complementary/Analogous color (30-60 degrees apart)
    hslToHex(
      (baseHue + 30 + (hueSeed % 60)) % 360,
      baseSat + (satSeed % 20) - 10,
      baseLight + (lightSeed % 15)
    ),
    // Triadic color (120 degrees apart)
    hslToHex(
      (baseHue + 120 + (hueSeed % 40)) % 360,
      baseSat + (satSeed % 25) - 12,
      baseLight + (lightSeed % 20) - 10
    ),
  ]
}

// Enhanced seeded random that can handle large seeds
function createSeededRandom(...seeds: number[]): () => number {
  // Combine multiple seeds into one state
  let s = seeds.reduce((acc, seed, i) => {
    return (acc + (seed * (i + 1) * 2654435761)) >>> 0
  }, 0) || 1
  
  return function () {
    s = ((s * 1103515245 + 12345) >>> 0) % 2147483648
    return s / 2147483648
  }
}

// Generate art on canvas with multi-dimensional seeds
export function generateArt(
  canvas: HTMLCanvasElement,
  palette: string[],
  styleSeed: number,
  shapeSeed: number,
  positionSeed: number,
  sizeSeed: number
): void {
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const w = canvas.width
  const h = canvas.height

  // Combine seeds for different aspects
  const bgRandom = createSeededRandom(styleSeed, positionSeed)
  const shapeRandom = createSeededRandom(shapeSeed, sizeSeed, styleSeed)
  const sizeRandom = createSeededRandom(sizeSeed, shapeSeed, positionSeed)

  // Background gradient - unique angle based on seeds
  const grad = ctx.createLinearGradient(0, 0, w * bgRandom(), h)
  grad.addColorStop(0, palette[0])
  grad.addColorStop(0.5, palette[1])
  grad.addColorStop(1, palette[2])
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, w, h)

  // Select art style based on styleSeed (8 styles now)
  const style = styleSeed % 8

  switch (style) {
    case 0:
      drawCircles(ctx, w, h, palette, shapeRandom, sizeRandom)
      break
    case 1:
      drawStripes(ctx, w, h, palette, shapeRandom, sizeRandom)
      break
    case 2:
      drawGridDots(ctx, w, h, palette, shapeRandom, sizeRandom)
      break
    case 3:
      drawRectangles(ctx, w, h, palette, shapeRandom, sizeRandom)
      break
    case 4:
      drawWaves(ctx, w, h, palette, shapeRandom, sizeRandom)
      break
    case 5:
      drawTriangles(ctx, w, h, palette, shapeRandom, sizeRandom)
      break
    case 6:
      drawHexagons(ctx, w, h, palette, shapeRandom, sizeRandom)
      break
    case 7:
      drawMixedShapes(ctx, w, h, palette, shapeRandom, sizeRandom)
      break
  }

  // Optional overlay grain (adds more variation)
  if (bgRandom() > 0.5) {
    ctx.fillStyle = 'rgba(255,255,255,0.03)'
    for (let i = 0; i < 2000; i++) {
      ctx.fillRect(bgRandom() * w, bgRandom() * h, 1, 1)
    }
  }
}

function drawCircles(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  palette: string[],
  random: () => number,
  sizeRandom: () => number
) {
  const count = 4 + Math.floor(random() * 12)
  for (let i = 0; i < count; i++) {
    ctx.beginPath()
    const r = 20 + sizeRandom() * w * 0.4
    ctx.arc(random() * w, random() * h, r, 0, Math.PI * 2)
    ctx.fillStyle =
      palette[Math.floor(random() * 3)] + (random() > 0.5 ? '88' : 'CC')
    ctx.fill()
  }
}

function drawStripes(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  palette: string[],
  random: () => number,
  sizeRandom: () => number
) {
  const stripeW = 8 + sizeRandom() * 50
  const angle = random() * Math.PI
  ctx.save()
  ctx.translate(w / 2, h / 2)
  ctx.rotate(angle)
  for (let x = -w; x < w * 2; x += stripeW * 2) {
    ctx.fillStyle = palette[Math.floor(random() * 3)] + 'AA'
    ctx.fillRect(x, -h, stripeW, h * 3)
  }
  ctx.restore()
}

function drawGridDots(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  palette: string[],
  random: () => number,
  sizeRandom: () => number
) {
  const gap = 15 + sizeRandom() * 35
  const dotR = 2 + sizeRandom() * 10
  for (let x = gap; x < w; x += gap) {
    for (let y = gap; y < h; y += gap) {
      ctx.beginPath()
      ctx.arc(x + random() * 5, y + random() * 5, dotR * random(), 0, Math.PI * 2)
      ctx.fillStyle = palette[Math.floor(random() * 3)]
      ctx.fill()
    }
  }
}

function drawRectangles(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  palette: string[],
  random: () => number,
  sizeRandom: () => number
) {
  const count = 3 + Math.floor(random() * 8)
  for (let i = 0; i < count; i++) {
    ctx.save()
    ctx.translate(random() * w, random() * h)
    ctx.rotate(random() * Math.PI * 0.5)
    ctx.fillStyle =
      palette[Math.floor(random() * 3)] + (random() > 0.4 ? '99' : 'DD')
    const rw = 30 + sizeRandom() * w * 0.6
    const rh = 30 + sizeRandom() * h * 0.4
    ctx.fillRect(-rw / 2, -rh / 2, rw, rh)
    ctx.restore()
  }
}

function drawWaves(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  palette: string[],
  random: () => number,
  sizeRandom: () => number
) {
  const waveCount = 3 + Math.floor(random() * 6)
  for (let i = 0; i < waveCount; i++) {
    ctx.beginPath()
    const yBase = (h / (waveCount + 1)) * (i + 1)
    ctx.moveTo(0, yBase)
    for (let x = 0; x <= w; x += 5) {
      const y =
        yBase + Math.sin((x + i * 50) * 0.02 * (1 + sizeRandom())) * (20 + sizeRandom() * 50)
      ctx.lineTo(x, y)
    }
    ctx.lineTo(w, h)
    ctx.lineTo(0, h)
    ctx.closePath()
    ctx.fillStyle = palette[i % 3] + '77'
    ctx.fill()
  }
}

function drawTriangles(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  palette: string[],
  random: () => number,
  sizeRandom: () => number
) {
  const count = 5 + Math.floor(random() * 10)
  for (let i = 0; i < count; i++) {
    ctx.beginPath()
    const cx = random() * w
    const cy = random() * h
    const size = 30 + sizeRandom() * 120
    ctx.moveTo(cx, cy - size)
    ctx.lineTo(cx - size * 0.87, cy + size * 0.5)
    ctx.lineTo(cx + size * 0.87, cy + size * 0.5)
    ctx.closePath()
    ctx.fillStyle =
      palette[Math.floor(random() * 3)] + (random() > 0.3 ? 'AA' : 'EE')
    ctx.fill()
  }
}

// Hexagons pattern
function drawHexagons(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  palette: string[],
  random: () => number,
  sizeRandom: () => number
) {
  const count = 4 + Math.floor(random() * 10)
  for (let i = 0; i < count; i++) {
    const cx = random() * w
    const cy = random() * h
    const size = 20 + sizeRandom() * 80
    
    ctx.beginPath()
    for (let j = 0; j < 6; j++) {
      const angle = (Math.PI / 3) * j - Math.PI / 6
      const x = cx + size * Math.cos(angle)
      const y = cy + size * Math.sin(angle)
      if (j === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.closePath()
    ctx.fillStyle = palette[Math.floor(random() * 3)] + (random() > 0.4 ? 'AA' : 'DD')
    ctx.fill()
  }
}

// Mixed shapes for more variety
function drawMixedShapes(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  palette: string[],
  random: () => number,
  sizeRandom: () => number
) {
  const count = 8 + Math.floor(random() * 12)
  const shapes = ['circle', 'rect', 'triangle', 'hexagon']
  
  for (let i = 0; i < count; i++) {
    const shape = shapes[Math.floor(random() * shapes.length)]
    const cx = random() * w
    const cy = random() * h
    const size = 20 + sizeRandom() * 70
    const color = palette[Math.floor(random() * 3)] + (random() > 0.5 ? 'AA' : 'DD')
    
    ctx.fillStyle = color
    
    switch (shape) {
      case 'circle':
        ctx.beginPath()
        ctx.arc(cx, cy, size, 0, Math.PI * 2)
        ctx.fill()
        break
      case 'rect':
        ctx.save()
        ctx.translate(cx, cy)
        ctx.rotate(random() * Math.PI)
        ctx.fillRect(-size / 2, -size / 2, size * 1.5, size)
        ctx.restore()
        break
      case 'triangle':
        ctx.beginPath()
        ctx.moveTo(cx, cy - size)
        ctx.lineTo(cx - size * 0.87, cy + size * 0.5)
        ctx.lineTo(cx + size * 0.87, cy + size * 0.5)
        ctx.closePath()
        ctx.fill()
        break
      case 'hexagon':
        ctx.beginPath()
        for (let j = 0; j < 6; j++) {
          const angle = (Math.PI / 3) * j - Math.PI / 6
          const x = cx + size * Math.cos(angle)
          const y = cy + size * Math.sin(angle)
          if (j === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.closePath()
        ctx.fill()
        break
    }
  }
}

// Generate avatar SVG - unique based on seed
export function generateAvatarSVG(seed: number): string {
  let s = seed
  function sr() {
    s = (s * 16807 + 0) % 2147483647
    return (s - 1) / 2147483646
  }
  const hue = Math.floor(sr() * 360)
  const bg = `hsl(${hue}, 55%, 65%)`
  const fg = `hsl(${(hue + 40) % 360}, 40%, 90%)`
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect width="40" height="40" fill="${bg}"/><circle cx="20" cy="16" r="8" fill="${fg}"/><ellipse cx="20" cy="38" rx="14" ry="12" fill="${fg}"/></svg>`
}
