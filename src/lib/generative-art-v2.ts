// ═══════════════════════════════════════════════════════════════════════════════
// 🎨 PREMIUM GENERATIVE ART ENGINE v2.0
// Infinite unique artworks - 10^63 possibilities
// Gallery-worthy algorithmic masterpieces
// ═══════════════════════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────────────────────
// COLOR THEORY ENGINE
// ─────────────────────────────────────────────────────────────────────────────

interface Color {
  h: number;
  s: number;
  l: number;
}

// Advanced seeded random generator
function createSeededRandom(...seeds: number[]): () => number {
  let s = seeds.reduce((acc, seed, i) => {
    return (acc + (seed * (i + 1) * 2654435761)) >>> 0;
  }, 1);

  return function () {
    s = ((s * 1103515245 + 12345) >>> 0) % 2147483648;
    return s / 2147483648;
  };
}

// HSL to Hex conversion
function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

// HSL to RGBA string
function hslToRgba(h: number, s: number, l: number, a: number = 1): string {
  s /= 100;
  l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const f = (n: number) => l - (s * Math.min(l, 1 - l)) * Math.max(Math.min(k(n) - 3, 9 - k(n), 1), -1);
  return `rgba(${Math.round(255 * f(0))},${Math.round(255 * f(8))},${Math.round(255 * f(4))},${a})`;
}

// Color harmony palettes
type HarmonyType =
  | 'complementary'
  | 'analogous'
  | 'triadic'
  | 'tetradic'
  | 'splitComplementary'
  | 'square'
  | 'monochromatic'
  | 'compound';

function generateHarmonyPalette(
  baseHue: number,
  baseSat: number,
  baseLight: number,
  harmony: HarmonyType,
  random: () => number
): Color[] {
  const colors: Color[] = [];

  const addColor = (h: number, s: number, l: number) => {
    colors.push({
      h: ((h % 360) + 360) % 360,
      s: Math.max(20, Math.min(90, s + (random() * 10 - 5))),
      l: Math.max(25, Math.min(75, l + (random() * 10 - 5)))
    });
  };

  addColor(baseHue, baseSat, baseLight); // Base color

  switch (harmony) {
    case 'complementary':
      addColor(baseHue + 180, baseSat, baseLight);
      addColor(baseHue + 10, baseSat - 10, baseLight + 15);
      addColor(baseHue + 170, baseSat - 10, baseLight + 15);
      break;

    case 'analogous':
      addColor(baseHue + 30, baseSat, baseLight);
      addColor(baseHue - 30, baseSat, baseLight);
      addColor(baseHue + 15, baseSat - 15, baseLight + 10);
      break;

    case 'triadic':
      addColor(baseHue + 120, baseSat, baseLight);
      addColor(baseHue + 240, baseSat, baseLight);
      break;

    case 'tetradic':
      addColor(baseHue + 90, baseSat, baseLight);
      addColor(baseHue + 180, baseSat, baseLight);
      addColor(baseHue + 270, baseSat, baseLight);
      break;

    case 'splitComplementary':
      addColor(baseHue + 150, baseSat, baseLight);
      addColor(baseHue + 210, baseSat, baseLight);
      addColor(baseHue + 15, baseSat - 20, baseLight + 20);
      break;

    case 'square':
      addColor(baseHue + 90, baseSat, baseLight);
      addColor(baseHue + 180, baseSat, baseLight);
      addColor(baseHue + 270, baseSat, baseLight);
      break;

    case 'monochromatic':
      addColor(baseHue, baseSat - 20, baseLight + 20);
      addColor(baseHue, baseSat + 10, baseLight - 15);
      addColor(baseHue, baseSat - 10, baseLight + 30);
      break;

    case 'compound':
      addColor(baseHue + 30, baseSat, baseLight);
      addColor(baseHue + 180, baseSat, baseLight);
      addColor(baseHue + 210, baseSat - 15, baseLight + 10);
      break;
  }

  return colors;
}

// Generate premium palette based on mood
function generatePremiumPalette(random: () => number): { colors: Color[]; harmony: HarmonyType } {
  const harmonies: HarmonyType[] = [
    'complementary', 'analogous', 'triadic', 'tetradic',
    'splitComplementary', 'square', 'monochromatic', 'compound'
  ];

  const harmony = harmonies[Math.floor(random() * harmonies.length)];
  const baseHue = random() * 360;
  const baseSat = 50 + random() * 35;
  const baseLight = 40 + random() * 25;

  const colors = generateHarmonyPalette(baseHue, baseSat, baseLight, harmony, random);

  return { colors, harmony };
}

// ─────────────────────────────────────────────────────────────────────────────
// PERLIN NOISE & FLOW FIELDS
// ─────────────────────────────────────────────────────────────────────────────

class PerlinNoise {
  private permutation: number[];

  constructor(seed: number) {
    const random = createSeededRandom(seed);
    this.permutation = [];
    for (let i = 0; i < 256; i++) this.permutation[i] = i;
    for (let i = 255; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [this.permutation[i], this.permutation[j]] = [this.permutation[j], this.permutation[i]];
    }
    this.permutation = [...this.permutation, ...this.permutation];
  }

  private fade(t: number): number {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  private lerp(a: number, b: number, t: number): number {
    return a + t * (b - a);
  }

  private grad(hash: number, x: number, y: number): number {
    const h = hash & 3;
    const u = h < 2 ? x : y;
    const v = h < 2 ? y : x;
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
  }

  noise(x: number, y: number): number {
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;
    x -= Math.floor(x);
    y -= Math.floor(y);
    const u = this.fade(x);
    const v = this.fade(y);
    const A = this.permutation[X] + Y;
    const B = this.permutation[X + 1] + Y;
    return this.lerp(
      this.lerp(this.grad(this.permutation[A], x, y), this.grad(this.permutation[B], x - 1, y), u),
      this.lerp(this.grad(this.permutation[A + 1], x, y - 1), this.grad(this.permutation[B + 1], x - 1, y - 1), u),
      v
    );
  }

  fbm(x: number, y: number, octaves: number = 4): number {
    let value = 0;
    let amplitude = 1;
    let frequency = 1;
    let maxValue = 0;
    for (let i = 0; i < octaves; i++) {
      value += amplitude * this.noise(x * frequency, y * frequency);
      maxValue += amplitude;
      amplitude *= 0.5;
      frequency *= 2;
    }
    return value / maxValue;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// PREMIUM ART STYLES (20+)
// ─────────────────────────────────────────────────────────────────────────────

type ArtStyle =
  // Flowing
  | 'flowField'
  | 'liquidChrome'
  | 'inkBleed'
  | 'smokeWisps'
  // Geometric
  | 'voronoi'
  | 'sacredGeometry'
  | 'parametricWaves'
  | 'crystalline'
  // Organic
  | 'neuralNetwork'
  | 'dendriteGrowth'
  | 'coralReef'
  | 'mycelium'
  // Cosmic
  | 'nebula'
  | 'aurora'
  | 'starField'
  | 'cosmicDust'
  // Abstract
  | 'glitchArt'
  | 'gradientMesh'
  | 'noiseLandscape'
  | 'chromaticAberration'
  // Symmetric
  | 'mandala'
  | 'kaleidoscope'
  | 'fractalTree'
  | 'sacredCircle'
  // Architectural
  | 'isometricWorld'
  | 'impossibleGeometry'
  | 'architecturalLines'
  // Minimalist
  | 'zenGarden'
  | 'dotMatrix'
  | 'breathingCircles'
  | 'lineHorizon';

const ART_STYLES: ArtStyle[] = [
  'flowField', 'liquidChrome', 'inkBleed', 'smokeWisps',
  'voronoi', 'sacredGeometry', 'parametricWaves', 'crystalline',
  'neuralNetwork', 'dendriteGrowth', 'coralReef', 'mycelium',
  'nebula', 'aurora', 'starField', 'cosmicDust',
  'glitchArt', 'gradientMesh', 'noiseLandscape', 'chromaticAberration',
  'mandala', 'kaleidoscope', 'fractalTree', 'sacredCircle',
  'isometricWorld', 'impossibleGeometry', 'architecturalLines',
  'zenGarden', 'dotMatrix', 'breathingCircles', 'lineHorizon'
];

// ─────────────────────────────────────────────────────────────────────────────
// STYLE IMPLEMENTATIONS
// ─────────────────────────────────────────────────────────────────────────────

// FLOW FIELD - Elegant flowing lines
function drawFlowField(
  ctx: CanvasRenderingContext2D,
  w: number, h: number,
  colors: Color[],
  random: () => number,
  perlin: PerlinNoise
) {
  // Background gradient
  const bgGrad = ctx.createLinearGradient(0, 0, w, h);
  bgGrad.addColorStop(0, hslToHex(colors[0].h, colors[0].s, colors[0].l - 15));
  bgGrad.addColorStop(1, hslToHex(colors[1].h, colors[1].s, colors[1].l - 15));
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, w, h);

  const scale = 0.005 + random() * 0.01;
  const lineCount = 500 + Math.floor(random() * 1000);
  const maxLength = 50 + random() * 150;

  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  for (let i = 0; i < lineCount; i++) {
    let x = random() * w;
    let y = random() * h;

    ctx.beginPath();
    ctx.moveTo(x, y);

    const colorIdx = Math.floor(random() * colors.length);
    const alpha = 0.1 + random() * 0.4;
    ctx.strokeStyle = hslToRgba(colors[colorIdx].h, colors[colorIdx].s, colors[colorIdx].l, alpha);
    ctx.lineWidth = 0.5 + random() * 2;

    for (let j = 0; j < maxLength; j++) {
      const angle = perlin.fbm(x * scale, y * scale, 3) * Math.PI * 4;
      x += Math.cos(angle) * 2;
      y += Math.sin(angle) * 2;

      if (x < 0 || x > w || y < 0 || y > h) break;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
}

// LIQUID CHROME - Metallic flowing effect
function drawLiquidChrome(
  ctx: CanvasRenderingContext2D,
  w: number, h: number,
  colors: Color[],
  random: () => number,
  perlin: PerlinNoise
) {
  const imageData = ctx.createImageData(w, h);
  const data = imageData.data;

  const scale = 0.003 + random() * 0.005;
  const baseHue = colors[0].h;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const n1 = perlin.fbm(x * scale, y * scale, 4);
      const n2 = perlin.fbm(x * scale * 2, y * scale * 2, 3);

      const hue = (baseHue + n1 * 60 + n2 * 30) % 360;
      const sat = 20 + Math.abs(n1) * 30;
      const light = 40 + Math.abs(n2) * 40;

      const { r, g, b } = hslToRgb(hue, sat, light);
      const idx = (y * w + x) * 4;
      data[idx] = r;
      data[idx + 1] = g;
      data[idx + 2] = b;
      data[idx + 3] = 255;
    }
  }

  ctx.putImageData(imageData, 0, 0);
}

// Helper: HSL to RGB
function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  s /= 100;
  l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return {
    r: Math.round(255 * f(0)),
    g: Math.round(255 * f(8)),
    b: Math.round(255 * f(4))
  };
}

// INK BLEED - Watercolor effect
function drawInkBleed(
  ctx: CanvasRenderingContext2D,
  w: number, h: number,
  colors: Color[],
  random: () => number
) {
  ctx.fillStyle = '#f8f6f3';
  ctx.fillRect(0, 0, w, h);

  const blotches = 15 + Math.floor(random() * 25);

  for (let i = 0; i < blotches; i++) {
    const color = colors[Math.floor(random() * colors.length)];
    const x = random() * w;
    const y = random() * h;
    const radius = 30 + random() * 150;

    // Multiple layers for bleeding effect
    for (let layer = 0; layer < 5; layer++) {
      const layerRadius = radius * (1 + layer * 0.3);
      const alpha = 0.03 + random() * 0.05;

      const gradient = ctx.createRadialGradient(x, y, 0, x, y, layerRadius);
      gradient.addColorStop(0, hslToRgba(color.h, color.s, color.l, alpha));
      gradient.addColorStop(0.5, hslToRgba(color.h, color.s - 10, color.l + 10, alpha * 0.5));
      gradient.addColorStop(1, hslToRgba(color.h, color.s - 20, color.l + 20, 0));

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x + (random() - 0.5) * 20, y + (random() - 0.5) * 20, layerRadius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Add subtle paper texture
  ctx.globalAlpha = 0.02;
  for (let i = 0; i < 5000; i++) {
    ctx.fillStyle = random() > 0.5 ? '#000' : '#fff';
    ctx.fillRect(random() * w, random() * h, 1, 1);
  }
  ctx.globalAlpha = 1;
}

// SMOKE WISPS
function drawSmokeWisps(
  ctx: CanvasRenderingContext2D,
  w: number, h: number,
  colors: Color[],
  random: () => number,
  perlin: PerlinNoise
) {
  const bgGrad = ctx.createRadialGradient(w/2, h/2, 0, w/2, h/2, Math.max(w, h));
  bgGrad.addColorStop(0, hslToHex(colors[0].h, colors[0].s - 20, colors[0].l - 20));
  bgGrad.addColorStop(1, hslToHex(colors[1].h, colors[1].s - 30, colors[1].l - 30));
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, w, h);

  const wispCount = 8 + Math.floor(random() * 12);

  for (let i = 0; i < wispCount; i++) {
    const baseX = random() * w;
    const baseY = h + 50;
    const color = colors[Math.floor(random() * colors.length)];

    ctx.beginPath();

    let x = baseX;
    let y = baseY;
    const points: { x: number; y: number }[] = [{ x, y }];

    for (let j = 0; j < 100; j++) {
      const noise = perlin.fbm(x * 0.01, y * 0.01, 3);
      x += Math.cos(noise * Math.PI * 2) * 5 + (random() - 0.5) * 3;
      y -= 3 + random() * 2;
      points.push({ x, y });
    }

    ctx.moveTo(points[0].x, points[0].y);
    for (let j = 1; j < points.length; j++) {
      ctx.lineTo(points[j].x, points[j].y);
    }

    ctx.strokeStyle = hslToRgba(color.h, color.s - 20, color.l + 30, 0.1 + random() * 0.15);
    ctx.lineWidth = 20 + random() * 40;
    ctx.lineCap = 'round';
    ctx.filter = `blur(${5 + random() * 10}px)`;
    ctx.stroke();
    ctx.filter = 'none';
  }
}

// VORONOI DIAGRAM
function drawVoronoi(
  ctx: CanvasRenderingContext2D,
  w: number, h: number,
  colors: Color[],
  random: () => number
) {
  const pointCount = 20 + Math.floor(random() * 40);
  const points: { x: number; y: number; color: Color }[] = [];

  for (let i = 0; i < pointCount; i++) {
    points.push({
      x: random() * w,
      y: random() * h,
      color: colors[Math.floor(random() * colors.length)]
    });
  }

  // Color each pixel based on nearest point
  const imageData = ctx.createImageData(w, h);
  const data = imageData.data;

  // Simplified voronoi with larger cells
  const cellSize = Math.ceil(w / 40);
  for (let cy = 0; cy < h; cy += cellSize) {
    for (let cx = 0; cx < w; cx += cellSize) {
      let minDist = Infinity;
      let nearestPoint = points[0];

      for (const point of points) {
        const dist = Math.sqrt((cx - point.x) ** 2 + (cy - point.y) ** 2);
        if (dist < minDist) {
          minDist = dist;
          nearestPoint = point;
        }
      }

      const { r, g, b } = hslToRgb(nearestPoint.color.h, nearestPoint.color.s, nearestPoint.color.l);

      for (let dy = 0; dy < cellSize && cy + dy < h; dy++) {
        for (let dx = 0; dx < cellSize && cx + dx < w; dx++) {
          const idx = ((cy + dy) * w + (cx + dx)) * 4;
          data[idx] = r;
          data[idx + 1] = g;
          data[idx + 2] = b;
          data[idx + 3] = 255;
        }
      }
    }
  }

  ctx.putImageData(imageData, 0, 0);

  // Draw cell borders
  ctx.strokeStyle = hslToRgba(colors[0].h, colors[0].s - 30, colors[0].l - 20, 0.3);
  ctx.lineWidth = 1;

  for (const point of points) {
    ctx.beginPath();
    ctx.arc(point.x, point.y, 3, 0, Math.PI * 2);
    ctx.fillStyle = hslToHex(point.color.h, point.color.s, point.color.l - 20);
    ctx.fill();
  }
}

// SACRED GEOMETRY
function drawSacredGeometry(
  ctx: CanvasRenderingContext2D,
  w: number, h: number,
  colors: Color[],
  random: () => number
) {
  ctx.fillStyle = hslToHex(colors[0].h, colors[0].s - 30, colors[0].l - 30);
  ctx.fillRect(0, 0, w, h);

  const cx = w / 2;
  const cy = h / 2;
  const maxRadius = Math.min(w, h) * 0.45;

  // Flower of Life base
  const layers = 3 + Math.floor(random() * 3);
  const color = colors[1];

  ctx.strokeStyle = hslToRgba(color.h, color.s, color.l, 0.4 + random() * 0.3);
  ctx.lineWidth = 1 + random() * 2;

  // Central circle
  ctx.beginPath();
  ctx.arc(cx, cy, maxRadius / 3, 0, Math.PI * 2);
  ctx.stroke();

  // Surrounding circles
  for (let layer = 1; layer <= layers; layer++) {
    const radius = (maxRadius / 3) * layer;
    const count = 6 * layer;

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + (layer % 2 === 0 ? Math.PI / count : 0);
      const x = cx + Math.cos(angle) * radius * 0.5;
      const y = cy + Math.sin(angle) * radius * 0.5;

      ctx.beginPath();
      ctx.arc(x, y, maxRadius / 3, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  // Inner geometric patterns
  const innerLayers = 2 + Math.floor(random() * 3);
  for (let i = 0; i < innerLayers; i++) {
    const radius = maxRadius * (0.2 + i * 0.15);
    const sides = 6;

    ctx.beginPath();
    for (let j = 0; j <= sides; j++) {
      const angle = (j / sides) * Math.PI * 2 - Math.PI / 2;
      const x = cx + Math.cos(angle) * radius;
      const y = cy + Math.sin(angle) * radius;
      if (j === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = hslToRgba(colors[(i + 1) % colors.length].h, colors[(i + 1) % colors.length].s, colors[(i + 1) % colors.length].l, 0.5);
    ctx.stroke();
  }
}

// PARAMETRIC WAVES
function drawParametricWaves(
  ctx: CanvasRenderingContext2D,
  w: number, h: number,
  colors: Color[],
  random: () => number
) {
  const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
  bgGrad.addColorStop(0, hslToHex(colors[0].h, colors[0].s - 20, colors[0].l - 20));
  bgGrad.addColorStop(1, hslToHex(colors[1].h, colors[1].s - 20, colors[1].l - 20));
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, w, h);

  const waveCount = 5 + Math.floor(random() * 10);
  const amplitude = 20 + random() * 50;
  const frequency = 0.005 + random() * 0.02;

  for (let i = 0; i < waveCount; i++) {
    const yBase = (h / (waveCount + 1)) * (i + 1);
    const color = colors[i % colors.length];
    const phase = random() * Math.PI * 2;

    ctx.beginPath();
    ctx.moveTo(0, yBase);

    for (let x = 0; x <= w; x += 2) {
      const y = yBase + Math.sin(x * frequency + phase) * amplitude * Math.sin(x * frequency * 0.3);
      ctx.lineTo(x, y);
    }

    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.closePath();

    const gradient = ctx.createLinearGradient(0, yBase - amplitude, 0, yBase + amplitude * 2);
    gradient.addColorStop(0, hslToRgba(color.h, color.s, color.l, 0.3 + random() * 0.3));
    gradient.addColorStop(1, hslToRgba(color.h, color.s - 20, color.l + 20, 0.1));
    ctx.fillStyle = gradient;
    ctx.fill();
  }
}

// CRYSTALLINE
function drawCrystalline(
  ctx: CanvasRenderingContext2D,
  w: number, h: number,
  colors: Color[],
  random: () => number
) {
  ctx.fillStyle = hslToHex(colors[0].h, colors[0].s - 30, colors[0].l - 25);
  ctx.fillRect(0, 0, w, h);

  const crystals = 15 + Math.floor(random() * 25);

  for (let i = 0; i < crystals; i++) {
    const cx = random() * w;
    const cy = random() * h;
    const size = 20 + random() * 80;
    const sides = 4 + Math.floor(random() * 4);
    const color = colors[Math.floor(random() * colors.length)];

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(random() * Math.PI * 2);

    // Crystal shape
    ctx.beginPath();
    for (let j = 0; j < sides * 2; j++) {
      const radius = j % 2 === 0 ? size : size * 0.5;
      const angle = (j / (sides * 2)) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      if (j === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();

    // Gradient fill
    const gradient = ctx.createLinearGradient(-size, -size, size, size);
    gradient.addColorStop(0, hslToRgba(color.h, color.s, color.l + 20, 0.6 + random() * 0.3));
    gradient.addColorStop(0.5, hslToRgba(color.h, color.s - 10, color.l, 0.4));
    gradient.addColorStop(1, hslToRgba(color.h, color.s - 20, color.l - 10, 0.2));

    ctx.fillStyle = gradient;
    ctx.fill();

    ctx.strokeStyle = hslToRgba(color.h, color.s, color.l + 30, 0.5);
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.restore();
  }
}

// NEURAL NETWORK
function drawNeuralNetwork(
  ctx: CanvasRenderingContext2D,
  w: number, h: number,
  colors: Color[],
  random: () => number
) {
  ctx.fillStyle = hslToHex(colors[0].h, colors[0].s - 40, colors[0].l - 30);
  ctx.fillRect(0, 0, w, h);

  const nodeCount = 30 + Math.floor(random() * 50);
  const nodes: { x: number; y: number; size: number; color: Color }[] = [];

  for (let i = 0; i < nodeCount; i++) {
    nodes.push({
      x: random() * w,
      y: random() * h,
      size: 3 + random() * 8,
      color: colors[Math.floor(random() * colors.length)]
    });
  }

  // Draw connections
  for (let i = 0; i < nodes.length; i++) {
    const connections = 2 + Math.floor(random() * 4);
    for (let j = 0; j < connections; j++) {
      const target = Math.floor(random() * nodes.length);
      if (target !== i) {
        const gradient = ctx.createLinearGradient(
          nodes[i].x, nodes[i].y,
          nodes[target].x, nodes[target].y
        );
        gradient.addColorStop(0, hslToRgba(nodes[i].color.h, nodes[i].color.s, nodes[i].color.l, 0.3));
        gradient.addColorStop(1, hslToRgba(nodes[target].color.h, nodes[target].color.s, nodes[target].color.l, 0.1));

        ctx.beginPath();
        ctx.moveTo(nodes[i].x, nodes[i].y);
        ctx.lineTo(nodes[target].x, nodes[target].y);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 0.5 + random() * 1.5;
        ctx.stroke();
      }
    }
  }

  // Draw nodes
  for (const node of nodes) {
    const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, node.size * 2);
    gradient.addColorStop(0, hslToRgba(node.color.h, node.color.s, node.color.l + 20, 1));
    gradient.addColorStop(0.5, hslToRgba(node.color.h, node.color.s, node.color.l, 0.8));
    gradient.addColorStop(1, hslToRgba(node.color.h, node.color.s, node.color.l, 0));

    ctx.beginPath();
    ctx.arc(node.x, node.y, node.size * 2, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
    ctx.fillStyle = hslToHex(node.color.h, node.color.s, node.color.l + 20);
    ctx.fill();
  }
}

// DENDRITE GROWTH
function drawDendriteGrowth(
  ctx: CanvasRenderingContext2D,
  w: number, h: number,
  colors: Color[],
  random: () => number
) {
  ctx.fillStyle = '#0a0a0a';
  ctx.fillRect(0, 0, w, h);

  const seeds = 3 + Math.floor(random() * 5);
  type Branch = { x: number; y: number; angle: number; depth: number; color: Color };
  const branches: Branch[] = [];

  for (let i = 0; i < seeds; i++) {
    const angle = random() * Math.PI * 2;
    branches.push({
      x: random() * w,
      y: random() * h,
      angle: angle,
      depth: 0,
      color: colors[Math.floor(random() * colors.length)]
    });
  }

  const maxDepth = 8;
  const branchLength = 15 + random() * 20;

  function grow(branchList: Branch[]) {
    const newBranches: Branch[] = [];

    for (const branch of branchList) {
      if (branch.depth >= maxDepth) continue;

      const length = branchLength * (1 - branch.depth / maxDepth);
      const endX = branch.x + Math.cos(branch.angle) * length;
      const endY = branch.y + Math.sin(branch.angle) * length;

      ctx.beginPath();
      ctx.moveTo(branch.x, branch.y);
      ctx.lineTo(endX, endY);
      ctx.strokeStyle = hslToRgba(branch.color.h, branch.color.s, branch.color.l, 0.5 + (1 - branch.depth / maxDepth) * 0.5);
      ctx.lineWidth = Math.max(0.5, 3 * (1 - branch.depth / maxDepth));
      ctx.stroke();

      // Branch out
      if (random() > 0.3) {
        newBranches.push({
          x: endX,
          y: endY,
          angle: branch.angle + (random() - 0.5) * 1.2,
          depth: branch.depth + 1,
          color: branch.color
        });
      }
      if (random() > 0.5) {
        newBranches.push({
          x: endX,
          y: endY,
          angle: branch.angle + (random() - 0.5) * 1.2,
          depth: branch.depth + 1,
          color: branch.color
        });
      }
    }

    if (newBranches.length > 0 && newBranches[0].depth < maxDepth) {
      grow(newBranches);
    }
  }

  grow(branches);
}

// CORAL REEF
function drawCoralReef(
  ctx: CanvasRenderingContext2D,
  w: number, h: number,
  colors: Color[],
  random: () => number
) {
  const gradient = ctx.createLinearGradient(0, 0, 0, h);
  gradient.addColorStop(0, hslToHex(200, 60, 15));
  gradient.addColorStop(1, hslToHex(210, 70, 8));
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, w, h);

  const corals = 8 + Math.floor(random() * 12);

  for (let i = 0; i < corals; i++) {
    const x = random() * w;
    const baseY = h - 20 - random() * 50;
    const color = colors[Math.floor(random() * colors.length)];
    const type = Math.floor(random() * 3);

    if (type === 0) {
      // Branching coral
      drawCoralBranch(ctx, x, baseY, 30 + random() * 50, color, random);
    } else if (type === 1) {
      // Fan coral
      drawCoralFan(ctx, x, baseY, 40 + random() * 60, color, random);
    } else {
      // Tube coral
      drawCoralTube(ctx, x, baseY, 20 + random() * 40, color, random);
    }
  }

  // Add bubbles
  ctx.fillStyle = 'rgba(255,255,255,0.1)';
  for (let i = 0; i < 50; i++) {
    ctx.beginPath();
    ctx.arc(random() * w, random() * h, 1 + random() * 3, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawCoralBranch(
  ctx: CanvasRenderingContext2D,
  x: number, y: number,
  size: number,
  color: Color,
  random: () => number
) {
  const branches = 3 + Math.floor(random() * 4);

  for (let i = 0; i < branches; i++) {
    const angle = -Math.PI / 2 + (random() - 0.5) * 0.8;
    const length = size * (0.6 + random() * 0.4);

    ctx.beginPath();
    ctx.moveTo(x, y);

    const endX = x + Math.cos(angle) * length;
    const endY = y + Math.sin(angle) * length;

    ctx.quadraticCurveTo(
      x + Math.cos(angle) * length * 0.5 + (random() - 0.5) * 20,
      y + Math.sin(angle) * length * 0.5,
      endX,
      endY
    );

    ctx.strokeStyle = hslToRgba(color.h, color.s, color.l, 0.8);
    ctx.lineWidth = 2 + random() * 4;
    ctx.lineCap = 'round';
    ctx.stroke();

    if (size > 20) {
      drawCoralBranch(ctx, endX, endY, size * 0.6, color, random);
    }
  }
}

function drawCoralFan(
  ctx: CanvasRenderingContext2D,
  x: number, y: number,
  size: number,
  color: Color,
  random: () => number
) {
  const lines = 15 + Math.floor(random() * 15);

  for (let i = 0; i < lines; i++) {
    const angle = -Math.PI / 2 + (i / lines - 0.5) * 1.2;
    const length = size * (0.5 + random() * 0.5);

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.cos(angle) * length, y + Math.sin(angle) * length);
    ctx.strokeStyle = hslToRgba(color.h, color.s, color.l, 0.4 + random() * 0.3);
    ctx.lineWidth = 1 + random() * 2;
    ctx.stroke();
  }
}

function drawCoralTube(
  ctx: CanvasRenderingContext2D,
  x: number, y: number,
  size: number,
  color: Color,
  random: () => number
) {
  const tubes = 5 + Math.floor(random() * 8);

  for (let i = 0; i < tubes; i++) {
    const tubeX = x + (random() - 0.5) * size;
    const tubeY = y;
    const height = size * (0.5 + random() * 0.5);
    const width = 5 + random() * 10;

    const gradient = ctx.createLinearGradient(tubeX - width/2, tubeY, tubeX + width/2, tubeY);
    gradient.addColorStop(0, hslToRgba(color.h, color.s, color.l - 10, 0.9));
    gradient.addColorStop(0.5, hslToRgba(color.h, color.s, color.l + 10, 1));
    gradient.addColorStop(1, hslToRgba(color.h, color.s, color.l - 10, 0.9));

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.ellipse(tubeX, tubeY - height, width/2, height, 0, 0, Math.PI * 2);
    ctx.fill();
  }
}

// MYCELIUM
function drawMycelium(
  ctx: CanvasRenderingContext2D,
  w: number, h: number,
  colors: Color[],
  random: () => number,
  perlin: PerlinNoise
) {
  ctx.fillStyle = '#0d0d0d';
  ctx.fillRect(0, 0, w, h);

  const startingPoints = 5 + Math.floor(random() * 10);

  for (let i = 0; i < startingPoints; i++) {
    let x = random() * w;
    let y = random() * h;
    const color = colors[Math.floor(random() * colors.length)];

    for (let j = 0; j < 200; j++) {
      const noise = perlin.fbm(x * 0.01, y * 0.01, 3);
      const angle = noise * Math.PI * 4;

      const newX = x + Math.cos(angle) * 3;
      const newY = y + Math.sin(angle) * 3;

      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(newX, newY);
      ctx.strokeStyle = hslToRgba(color.h, color.s, color.l, 0.3 + random() * 0.4);
      ctx.lineWidth = 0.5 + random() * 1.5;
      ctx.stroke();

      x = newX;
      y = newY;

      if (x < 0 || x > w || y < 0 || y > h) break;
    }
  }

  // Add spore nodes
  const nodes = 20 + Math.floor(random() * 30);
  for (let i = 0; i < nodes; i++) {
    const x = random() * w;
    const y = random() * h;
    const size = 2 + random() * 5;
    const color = colors[Math.floor(random() * colors.length)];

    const gradient = ctx.createRadialGradient(x, y, 0, x, y, size);
    gradient.addColorStop(0, hslToRgba(color.h, color.s, color.l + 20, 1));
    gradient.addColorStop(1, hslToRgba(color.h, color.s, color.l, 0));

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }
}

// NEBULA
function drawNebula(
  ctx: CanvasRenderingContext2D,
  w: number, h: number,
  colors: Color[],
  random: () => number,
  perlin: PerlinNoise
) {
  const imageData = ctx.createImageData(w, h);
  const data = imageData.data;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const nx = x / w;
      const ny = y / h;

      // Multiple noise layers
      const n1 = perlin.fbm(x * 0.003, y * 0.003, 4);
      const n2 = perlin.fbm(x * 0.008, y * 0.008, 3);

      // Distance from center for radial gradient
      const dx = nx - 0.5;
      const dy = ny - 0.5;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Combine noise with distance
      const intensity = Math.max(0, 1 - dist * 1.5) * (0.5 + n1 * 0.5) * (0.5 + n2 * 0.5);

      // Color mixing
      const colorIdx = Math.floor((n1 + 1) * 0.5 * colors.length) % colors.length;
      const color = colors[colorIdx];

      const { r, g, b } = hslToRgb(color.h, color.s * intensity, color.l * intensity + (1 - intensity) * 5);

      const idx = (y * w + x) * 4;
      data[idx] = r;
      data[idx + 1] = g;
      data[idx + 2] = b;
      data[idx + 3] = 255;
    }
  }

  ctx.putImageData(imageData, 0, 0);

  // Add stars
  ctx.fillStyle = '#fff';
  for (let i = 0; i < 100; i++) {
    const x = random() * w;
    const y = random() * h;
    const size = random() * 2;
    ctx.globalAlpha = random() * 0.8 + 0.2;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

// AURORA
function drawAurora(
  ctx: CanvasRenderingContext2D,
  w: number, h: number,
  colors: Color[],
  random: () => number,
  perlin: PerlinNoise
) {
  // Dark sky
  ctx.fillStyle = '#0a0a15';
  ctx.fillRect(0, 0, w, h);

  const auroraLayers = 3 + Math.floor(random() * 4);

  for (let layer = 0; layer < auroraLayers; layer++) {
    const color = colors[layer % colors.length];
    const yOffset = h * 0.2 + layer * h * 0.15;

    ctx.beginPath();
    ctx.moveTo(0, yOffset);

    for (let x = 0; x <= w; x += 5) {
      const noise = perlin.fbm(x * 0.005 + layer, layer * 0.5, 3);
      const y = yOffset + Math.sin(x * 0.01 + layer) * 30 + noise * 80;
      ctx.lineTo(x, y);
    }

    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.closePath();

    const gradient = ctx.createLinearGradient(0, yOffset - 50, 0, h);
    gradient.addColorStop(0, hslToRgba(color.h, color.s, color.l + 20, 0.4 + random() * 0.3));
    gradient.addColorStop(0.3, hslToRgba(color.h, color.s - 20, color.l, 0.2));
    gradient.addColorStop(1, hslToRgba(color.h, color.s - 40, color.l - 20, 0));

    ctx.fillStyle = gradient;
    ctx.fill();
  }

  // Stars
  for (let i = 0; i < 50; i++) {
    const x = random() * w;
    const y = random() * h * 0.6;
    const size = random() * 1.5;

    ctx.fillStyle = `rgba(255,255,255,${random() * 0.7 + 0.3})`;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }
}

// STAR FIELD
function drawStarField(
  ctx: CanvasRenderingContext2D,
  w: number, h: number,
  colors: Color[],
  random: () => number
) {
  // Deep space gradient
  const gradient = ctx.createRadialGradient(w/2, h/2, 0, w/2, h/2, Math.max(w, h));
  gradient.addColorStop(0, '#0a0a20');
  gradient.addColorStop(0.5, '#050510');
  gradient.addColorStop(1, '#000005');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, w, h);

  // Background stars
  for (let i = 0; i < 500; i++) {
    const x = random() * w;
    const y = random() * h;
    const size = random() * 1.5;
    const brightness = random();

    ctx.fillStyle = `rgba(255,255,255,${brightness * 0.5})`;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }

  // Bright stars with glow
  const brightStars = 20 + Math.floor(random() * 30);
  for (let i = 0; i < brightStars; i++) {
    const x = random() * w;
    const y = random() * h;
    const size = 1 + random() * 3;
    const color = colors[Math.floor(random() * colors.length)];

    // Glow
    const glow = ctx.createRadialGradient(x, y, 0, x, y, size * 10);
    glow.addColorStop(0, hslToRgba(color.h, color.s - 20, color.l + 30, 0.3));
    glow.addColorStop(1, hslToRgba(color.h, color.s, color.l, 0));
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(x, y, size * 10, 0, Math.PI * 2);
    ctx.fill();

    // Star core
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }
}

// COSMIC DUST
function drawCosmicDust(
  ctx: CanvasRenderingContext2D,
  w: number, h: number,
  colors: Color[],
  random: () => number,
  perlin: PerlinNoise
) {
  ctx.fillStyle = '#05050a';
  ctx.fillRect(0, 0, w, h);

  const particles = 2000;

  for (let i = 0; i < particles; i++) {
    const x = random() * w;
    const y = random() * h;
    const noise = perlin.fbm(x * 0.005, y * 0.005, 2);
    const size = 0.5 + random() * 2;
    const color = colors[Math.floor((noise + 1) * 0.5 * colors.length)];

    ctx.fillStyle = hslToRgba(color.h, color.s, color.l + 20, 0.3 + noise * 0.4);
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }

  // Add larger glowing particles
  for (let i = 0; i < 30; i++) {
    const x = random() * w;
    const y = random() * h;
    const size = 5 + random() * 15;
    const color = colors[Math.floor(random() * colors.length)];

    const gradient = ctx.createRadialGradient(x, y, 0, x, y, size);
    gradient.addColorStop(0, hslToRgba(color.h, color.s, color.l + 30, 0.8));
    gradient.addColorStop(0.5, hslToRgba(color.h, color.s, color.l, 0.3));
    gradient.addColorStop(1, hslToRgba(color.h, color.s, color.l, 0));

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }
}

// GLITCH ART
function drawGlitchArt(
  ctx: CanvasRenderingContext2D,
  w: number, h: number,
  colors: Color[],
  random: () => number
) {
  // Base gradient
  const gradient = ctx.createLinearGradient(0, 0, w, h);
  gradient.addColorStop(0, hslToHex(colors[0].h, colors[0].s, colors[0].l));
  gradient.addColorStop(0.5, hslToHex(colors[1].h, colors[1].s, colors[1].l));
  gradient.addColorStop(1, hslToHex(colors[2]?.h || colors[0].h, colors[2]?.s || colors[0].s, colors[2]?.l || colors[0].l));
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, w, h);

  // Glitch slices
  const slices = 10 + Math.floor(random() * 20);

  for (let i = 0; i < slices; i++) {
    const y = random() * h;
    const height = 2 + random() * 30;
    const offset = (random() - 0.5) * 50;

    const imageData = ctx.getImageData(0, y, w, height);
    ctx.putImageData(imageData, offset, y);
  }

  // RGB split
  const rgbSplit = ctx.getImageData(0, 0, w, h);
  const data = rgbSplit.data;
  const shift = Math.floor(2 + random() * 8);

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w - shift; x++) {
      const idx = (y * w + x) * 4;
      const shiftedIdx = (y * w + x + shift) * 4;
      data[idx] = data[shiftedIdx]; // Red channel shift
    }
  }

  ctx.putImageData(rgbSplit, 0, 0);

  // Scan lines
  ctx.fillStyle = 'rgba(0,0,0,0.1)';
  for (let y = 0; y < h; y += 2) {
    ctx.fillRect(0, y, w, 1);
  }
}

// GRADIENT MESH
function drawGradientMesh(
  ctx: CanvasRenderingContext2D,
  w: number, h: number,
  colors: Color[],
  random: () => number
) {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, w, h);

  const gridSize = 4 + Math.floor(random() * 4);
  const cellW = w / gridSize;
  const cellH = h / gridSize;

  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      const x = i * cellW;
      const y = j * cellH;
      const color = colors[(i + j) % colors.length];

      // Each cell has a radial gradient
      const gradient = ctx.createRadialGradient(
        x + cellW / 2 + (random() - 0.5) * cellW * 0.5,
        y + cellH / 2 + (random() - 0.5) * cellH * 0.5,
        0,
        x + cellW / 2,
        y + cellH / 2,
        Math.max(cellW, cellH)
      );

      gradient.addColorStop(0, hslToRgba(color.h, color.s, color.l + 20, 0.9));
      gradient.addColorStop(0.5, hslToRgba(color.h, color.s - 10, color.l, 0.6));
      gradient.addColorStop(1, hslToRgba(color.h, color.s - 20, color.l - 10, 0.3));

      ctx.fillStyle = gradient;
      ctx.fillRect(x, y, cellW, cellH);
    }
  }

  // Blend overlay
  ctx.globalCompositeOperation = 'overlay';
  const overlay = ctx.createLinearGradient(0, 0, w, h);
  overlay.addColorStop(0, 'rgba(255,255,255,0.1)');
  overlay.addColorStop(0.5, 'rgba(0,0,0,0)');
  overlay.addColorStop(1, 'rgba(255,255,255,0.1)');
  ctx.fillStyle = overlay;
  ctx.fillRect(0, 0, w, h);
  ctx.globalCompositeOperation = 'source-over';
}

// NOISE LANDSCAPE
function drawNoiseLandscape(
  ctx: CanvasRenderingContext2D,
  w: number, h: number,
  colors: Color[],
  random: () => number,
  perlin: PerlinNoise
) {
  // Sky gradient
  const skyGrad = ctx.createLinearGradient(0, 0, 0, h * 0.6);
  skyGrad.addColorStop(0, hslToHex(colors[0].h, colors[0].s - 20, colors[0].l - 20));
  skyGrad.addColorStop(1, hslToHex(colors[0].h, colors[0].s - 10, colors[0].l));
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, w, h);

  // Terrain layers
  const layers = 5 + Math.floor(random() * 5);
  const scale = 0.005 + random() * 0.01;

  for (let layer = 0; layer < layers; layer++) {
    const baseY = h * (0.3 + layer * 0.12);
    const amplitude = 30 + random() * 50;
    const color = colors[layer % colors.length];

    ctx.beginPath();
    ctx.moveTo(0, h);

    for (let x = 0; x <= w; x += 3) {
      const noise = perlin.fbm(x * scale + layer * 100, layer, 3);
      const y = baseY + noise * amplitude;
      ctx.lineTo(x, y);
    }

    ctx.lineTo(w, h);
    ctx.closePath();

    const gradient = ctx.createLinearGradient(0, baseY - amplitude, 0, h);
    gradient.addColorStop(0, hslToHex(color.h, color.s, color.l));
    gradient.addColorStop(1, hslToHex(color.h, color.s - 20, color.l - 20));

    ctx.fillStyle = gradient;
    ctx.fill();
  }
}

// CHROMATIC ABERRATION
function drawChromaticAberration(
  ctx: CanvasRenderingContext2D,
  w: number, h: number,
  colors: Color[],
  random: () => number
) {
  ctx.fillStyle = '#111';
  ctx.fillRect(0, 0, w, h);

  const shapes = 5 + Math.floor(random() * 10);

  for (let i = 0; i < shapes; i++) {
    const cx = random() * w;
    const cy = random() * h;
    const size = 30 + random() * 100;
    const shape = Math.floor(random() * 3);

    // Draw shape with chromatic offset
    const offsets = [
      { color: 'red', dx: -3, dy: 0 },
      { color: 'green', dx: 0, dy: 0 },
      { color: 'blue', dx: 3, dy: 0 }
    ];

    for (const offset of offsets) {
      ctx.save();
      ctx.translate(cx + offset.dx, cy + offset.dy);

      ctx.beginPath();
      if (shape === 0) {
        // Circle
        ctx.arc(0, 0, size, 0, Math.PI * 2);
      } else if (shape === 1) {
        // Square
        ctx.rect(-size, -size, size * 2, size * 2);
      } else {
        // Triangle
        ctx.moveTo(0, -size);
        ctx.lineTo(size, size);
        ctx.lineTo(-size, size);
        ctx.closePath();
      }

      ctx.strokeStyle = offset.color;
      ctx.lineWidth = 2 + random() * 4;
      ctx.globalAlpha = 0.7;
      ctx.stroke();
      ctx.restore();
    }
  }

  ctx.globalAlpha = 1;
}

// MANDALA
function drawMandala(
  ctx: CanvasRenderingContext2D,
  w: number, h: number,
  colors: Color[],
  random: () => number
) {
  ctx.fillStyle = hslToHex(colors[0].h, colors[0].s - 40, colors[0].l - 30);
  ctx.fillRect(0, 0, w, h);

  const cx = w / 2;
  const cy = h / 2;
  const maxRadius = Math.min(w, h) * 0.45;
  const layers = 4 + Math.floor(random() * 4);
  const segments = 6 + Math.floor(random() * 6) * 2;

  ctx.save();
  ctx.translate(cx, cy);

  for (let layer = 0; layer < layers; layer++) {
    const radius = maxRadius * ((layer + 1) / layers);
    const innerRadius = maxRadius * (layer / layers);
    const color = colors[layer % colors.length];

    for (let i = 0; i < segments; i++) {
      ctx.save();
      ctx.rotate((i / segments) * Math.PI * 2);

      // Petal shape
      ctx.beginPath();
      ctx.moveTo(innerRadius, 0);
      ctx.quadraticCurveTo(
        (innerRadius + radius) / 2,
        (radius - innerRadius) * 0.3,
        radius,
        0
      );
      ctx.quadraticCurveTo(
        (innerRadius + radius) / 2,
        -(radius - innerRadius) * 0.3,
        innerRadius,
        0
      );

      ctx.fillStyle = hslToRgba(color.h, color.s, color.l, 0.6 + random() * 0.2);
      ctx.fill();
      ctx.strokeStyle = hslToRgba(color.h, color.s - 20, color.l + 10, 0.8);
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.restore();
    }

    // Center dot
    if (layer === 0) {
      ctx.beginPath();
      ctx.arc(0, 0, maxRadius * 0.1, 0, Math.PI * 2);
      ctx.fillStyle = hslToHex(colors[0].h, colors[0].s, colors[0].l + 20);
      ctx.fill();
    }
  }

  ctx.restore();
}

// KALEIDOSCOPE
function drawKaleidoscope(
  ctx: CanvasRenderingContext2D,
  w: number, h: number,
  colors: Color[],
  random: () => number
) {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, w, h);

  const cx = w / 2;
  const cy = h / 2;
  const segments = 6 + Math.floor(random() * 8);
  const shapesPerSegment = 3 + Math.floor(random() * 5);

  for (let s = 0; s < segments; s++) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate((s / segments) * Math.PI * 2);

    for (let i = 0; i < shapesPerSegment; i++) {
      const distance = 50 + random() * Math.min(w, h) * 0.35;
      const size = 10 + random() * 40;
      const color = colors[Math.floor(random() * colors.length)];

      ctx.beginPath();
      ctx.moveTo(distance, 0);
      ctx.lineTo(distance + size, size / 2);
      ctx.lineTo(distance + size, -size / 2);
      ctx.closePath();

      ctx.fillStyle = hslToRgba(color.h, color.s, color.l, 0.5 + random() * 0.3);
      ctx.fill();
    }

    ctx.restore();
  }

  // Mirror the other half
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(1, -1);
  ctx.globalAlpha = 0.7;

  for (let s = 0; s < segments; s++) {
    ctx.save();
    ctx.rotate((s / segments) * Math.PI * 2);

    for (let i = 0; i < shapesPerSegment; i++) {
      const distance = 50 + random() * Math.min(w, h) * 0.35;
      const size = 10 + random() * 40;
      const color = colors[Math.floor(random() * colors.length)];

      ctx.beginPath();
      ctx.moveTo(distance, 0);
      ctx.lineTo(distance + size, size / 2);
      ctx.lineTo(distance + size, -size / 2);
      ctx.closePath();

      ctx.fillStyle = hslToRgba(color.h, color.s, color.l, 0.4 + random() * 0.2);
      ctx.fill();
    }

    ctx.restore();
  }

  ctx.restore();
}

// FRACTAL TREE
function drawFractalTree(
  ctx: CanvasRenderingContext2D,
  w: number, h: number,
  colors: Color[],
  random: () => number
) {
  ctx.fillStyle = hslToHex(colors[0].h, colors[0].s - 40, colors[0].l - 30);
  ctx.fillRect(0, 0, w, h);

  const startX = w / 2;
  const startY = h - 20;
  const trunkLength = h * 0.25;
  const color = colors[1];

  function drawBranch(x: number, y: number, length: number, angle: number, depth: number) {
    if (depth > 10 || length < 3) return;

    const endX = x + Math.cos(angle) * length;
    const endY = y + Math.sin(angle) * length;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(endX, endY);

    const hueShift = depth * 10;
    ctx.strokeStyle = hslToRgba(
      (color.h + hueShift) % 360,
      color.s,
      Math.min(color.l + depth * 3, 70),
      0.8
    );
    ctx.lineWidth = Math.max(1, 8 - depth);
    ctx.stroke();

    // Branch out
    const branchAngle = 0.3 + random() * 0.4;
    const lengthRatio = 0.65 + random() * 0.15;

    drawBranch(endX, endY, length * lengthRatio, angle - branchAngle, depth + 1);
    drawBranch(endX, endY, length * lengthRatio, angle + branchAngle, depth + 1);

    // Sometimes add a third branch
    if (random() > 0.7) {
      drawBranch(endX, endY, length * lengthRatio * 0.8, angle + (random() - 0.5) * 0.3, depth + 1);
    }
  }

  drawBranch(startX, startY, trunkLength, -Math.PI / 2, 0);
}

// SACRED CIRCLE
function drawSacredCircle(
  ctx: CanvasRenderingContext2D,
  w: number, h: number,
  colors: Color[],
  random: () => number
) {
  ctx.fillStyle = '#0a0a0a';
  ctx.fillRect(0, 0, w, h);

  const cx = w / 2;
  const cy = h / 2;
  const maxRadius = Math.min(w, h) * 0.45;

  // Concentric rings
  const rings = 8 + Math.floor(random() * 8);

  for (let i = rings; i >= 0; i--) {
    const radius = maxRadius * (i / rings);
    const color = colors[i % colors.length];

    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.strokeStyle = hslToRgba(color.h, color.s, color.l, 0.5 + random() * 0.3);
    ctx.lineWidth = 1 + random() * 3;
    ctx.stroke();

    // Add dots on some rings
    if (i % 2 === 0 && i > 0) {
      const dots = i * 3;
      for (let j = 0; j < dots; j++) {
        const angle = (j / dots) * Math.PI * 2;
        const x = cx + Math.cos(angle) * radius;
        const y = cy + Math.sin(angle) * radius;

        ctx.beginPath();
        ctx.arc(x, y, 2 + random() * 3, 0, Math.PI * 2);
        ctx.fillStyle = hslToHex(color.h, color.s, color.l + 20);
        ctx.fill();
      }
    }
  }

  // Central pattern
  const innerRadius = maxRadius * 0.15;
  ctx.beginPath();
  ctx.arc(cx, cy, innerRadius, 0, Math.PI * 2);
  const centerGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, innerRadius);
  centerGrad.addColorStop(0, hslToHex(colors[0].h, colors[0].s, colors[0].l + 30));
  centerGrad.addColorStop(1, hslToHex(colors[0].h, colors[0].s - 20, colors[0].l));
  ctx.fillStyle = centerGrad;
  ctx.fill();
}

// Additional styles (simplified for space)
function drawIsometricWorld(
  ctx: CanvasRenderingContext2D,
  w: number, h: number,
  colors: Color[],
  random: () => number
) {
  ctx.fillStyle = hslToHex(colors[0].h, colors[0].s - 40, colors[0].l - 30);
  ctx.fillRect(0, 0, w, h);

  const gridSize = 20;
  const cubeSize = Math.min(w, h) / gridSize;

  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      if (random() > 0.3) continue;

      const x = (i - j) * cubeSize * 0.866 + w / 2;
      const y = (i + j) * cubeSize * 0.5 + h * 0.2;
      const height = 0.5 + random() * 2;
      const color = colors[Math.floor(random() * colors.length)];

      // Top face
      ctx.beginPath();
      ctx.moveTo(x, y - height * cubeSize);
      ctx.lineTo(x + cubeSize * 0.866, y + cubeSize * 0.5 - height * cubeSize);
      ctx.lineTo(x, y + cubeSize - height * cubeSize);
      ctx.lineTo(x - cubeSize * 0.866, y + cubeSize * 0.5 - height * cubeSize);
      ctx.closePath();
      ctx.fillStyle = hslToHex(color.h, color.s, color.l + 15);
      ctx.fill();

      // Left face
      ctx.beginPath();
      ctx.moveTo(x - cubeSize * 0.866, y + cubeSize * 0.5 - height * cubeSize);
      ctx.lineTo(x, y + cubeSize - height * cubeSize);
      ctx.lineTo(x, y + cubeSize);
      ctx.lineTo(x - cubeSize * 0.866, y + cubeSize * 0.5);
      ctx.closePath();
      ctx.fillStyle = hslToHex(color.h, color.s - 10, color.l - 10);
      ctx.fill();

      // Right face
      ctx.beginPath();
      ctx.moveTo(x + cubeSize * 0.866, y + cubeSize * 0.5 - height * cubeSize);
      ctx.lineTo(x, y + cubeSize - height * cubeSize);
      ctx.lineTo(x, y + cubeSize);
      ctx.lineTo(x + cubeSize * 0.866, y + cubeSize * 0.5);
      ctx.closePath();
      ctx.fillStyle = hslToHex(color.h, color.s - 20, color.l - 20);
      ctx.fill();
    }
  }
}

function drawImpossibleGeometry(
  ctx: CanvasRenderingContext2D,
  w: number, h: number,
  colors: Color[],
  random: () => number
) {
  ctx.fillStyle = '#f5f5f0';
  ctx.fillRect(0, 0, w, h);

  const shapes = 3 + Math.floor(random() * 4);
  const cx = w / 2;
  const cy = h / 2;

  for (let i = 0; i < shapes; i++) {
    const x = cx + (random() - 0.5) * w * 0.5;
    const y = cy + (random() - 0.5) * h * 0.5;
    const size = 50 + random() * 100;
    const color = colors[i % colors.length];
    const type = Math.floor(random() * 3);

    ctx.strokeStyle = hslToHex(color.h, color.s, color.l);
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';

    if (type === 0) {
      // Impossible triangle
      ctx.beginPath();
      ctx.moveTo(x, y - size);
      ctx.lineTo(x + size * 0.866, y + size * 0.5);
      ctx.lineTo(x - size * 0.866, y + size * 0.5);
      ctx.lineTo(x - size * 0.3, y);
      ctx.lineTo(x, y + size * 0.3);
      ctx.lineTo(x + size * 0.3, y);
      ctx.lineTo(x, y - size * 0.5);
      ctx.moveTo(x, y - size);
      ctx.lineTo(x + size * 0.5, y);
      ctx.stroke();
    } else if (type === 1) {
      // Impossible cube
      ctx.strokeRect(x - size/2, y - size/2, size, size);
      ctx.strokeRect(x - size/3, y - size/3, size, size);
      ctx.beginPath();
      ctx.moveTo(x - size/2, y - size/2);
      ctx.lineTo(x - size/3, y - size/3);
      ctx.moveTo(x + size/2, y - size/2);
      ctx.lineTo(x + size/3, y - size/3);
      ctx.moveTo(x - size/2, y + size/2);
      ctx.lineTo(x - size/3, y + size/3);
      ctx.stroke();
    } else {
      // Penrose stairs (simplified)
      const steps = 6;
      for (let s = 0; s < steps; s++) {
        const sx = x + s * size * 0.15;
        const sy = y + s * size * 0.1;
        ctx.strokeRect(sx, sy, size * 0.2, size * 0.1);
      }
    }
  }
}

function drawArchitecturalLines(
  ctx: CanvasRenderingContext2D,
  w: number, h: number,
  colors: Color[],
  random: () => number,
  perlin: PerlinNoise
) {
  ctx.fillStyle = '#f8f6f0';
  ctx.fillRect(0, 0, w, h);

  ctx.strokeStyle = hslToRgba(colors[0].h, colors[0].s - 20, colors[0].l - 20, 0.6);
  ctx.lineWidth = 0.5;

  // Grid
  const gridSize = 30 + Math.floor(random() * 20);
  for (let x = 0; x < w; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }
  for (let y = 0; y < h; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }

  // Architectural elements
  const elements = 5 + Math.floor(random() * 8);
  ctx.lineWidth = 2;

  for (let i = 0; i < elements; i++) {
    const x = random() * w;
    const y = random() * h;
    const width = 50 + random() * 150;
    const height = 50 + random() * 150;
    const color = colors[Math.floor(random() * colors.length)];

    ctx.strokeStyle = hslToHex(color.h, color.s - 20, color.l - 20);
    ctx.strokeRect(x, y, width, height);

    // Cross lines
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + width, y + height);
    ctx.moveTo(x + width, y);
    ctx.lineTo(x, y + height);
    ctx.stroke();

    // Dotted center line
    ctx.setLineDash([2, 4]);
    ctx.beginPath();
    ctx.moveTo(x + width/2, y);
    ctx.lineTo(x + width/2, y + height);
    ctx.moveTo(x, y + height/2);
    ctx.lineTo(x + width, y + height/2);
    ctx.stroke();
    ctx.setLineDash([]);
  }
}

function drawZenGarden(
  ctx: CanvasRenderingContext2D,
  w: number, h: number,
  colors: Color[],
  random: () => number
) {
  // Sand base
  ctx.fillStyle = '#e8e4d9';
  ctx.fillRect(0, 0, w, h);

  // Raked lines
  ctx.strokeStyle = 'rgba(0,0,0,0.1)';
  ctx.lineWidth = 1;

  const lineSpacing = 8 + Math.floor(random() * 6);
  for (let y = 0; y < h; y += lineSpacing) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    for (let x = 0; x <= w; x += 10) {
      const wave = Math.sin(x * 0.02) * 3;
      ctx.lineTo(x, y + wave);
    }
    ctx.stroke();
  }

  // Rocks
  const rocks = 3 + Math.floor(random() * 4);
  for (let i = 0; i < rocks; i++) {
    const x = random() * w;
    const y = random() * h;
    const size = 20 + random() * 40;

    // Rock shadow
    ctx.fillStyle = 'rgba(0,0,0,0.05)';
    ctx.beginPath();
    ctx.ellipse(x + 5, y + 5, size, size * 0.7, random() * Math.PI, 0, Math.PI * 2);
    ctx.fill();

    // Rock
    const rockGrad = ctx.createRadialGradient(x - size/3, y - size/3, 0, x, y, size);
    rockGrad.addColorStop(0, '#8a8a8a');
    rockGrad.addColorStop(1, '#4a4a4a');
    ctx.fillStyle = rockGrad;
    ctx.beginPath();
    ctx.ellipse(x, y, size, size * 0.7, random() * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawDotMatrix(
  ctx: CanvasRenderingContext2D,
  w: number, h: number,
  colors: Color[],
  random: () => number
) {
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, w, h);

  const dotSize = 3 + Math.floor(random() * 5);
  const spacing = dotSize * 3;

  for (let y = spacing; y < h - spacing; y += spacing) {
    for (let x = spacing; x < w - spacing; x += spacing) {
      const noise = random();
      if (noise > 0.3) {
        const color = colors[Math.floor(random() * colors.length)];
        const size = dotSize * (0.5 + noise * 0.5);

        ctx.fillStyle = hslToHex(color.h, color.s, color.l);
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
}

function drawBreathingCircles(
  ctx: CanvasRenderingContext2D,
  w: number, h: number,
  colors: Color[],
  random: () => number
) {
  ctx.fillStyle = '#fafafa';
  ctx.fillRect(0, 0, w, h);

  const circles = 5 + Math.floor(random() * 8);
  const cx = w / 2;
  const cy = h / 2;
  const maxRadius = Math.min(w, h) * 0.4;

  for (let i = 0; i < circles; i++) {
    const progress = i / circles;
    const radius = maxRadius * progress;
    const color = colors[i % colors.length];

    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.strokeStyle = hslToRgba(color.h, color.s, color.l, 0.3 + progress * 0.4);
    ctx.lineWidth = 1 + random() * 3;
    ctx.stroke();

    // Breathing effect - some circles are filled
    if (random() > 0.5) {
      ctx.fillStyle = hslToRgba(color.h, color.s, color.l, 0.05);
      ctx.fill();
    }
  }

  // Center dot
  ctx.beginPath();
  ctx.arc(cx, cy, 5 + random() * 10, 0, Math.PI * 2);
  ctx.fillStyle = hslToHex(colors[0].h, colors[0].s, colors[0].l);
  ctx.fill();
}

function drawLineHorizon(
  ctx: CanvasRenderingContext2D,
  w: number, h: number,
  colors: Color[],
  random: () => number
) {
  // Sky
  ctx.fillStyle = hslToHex(colors[0].h, colors[0].s - 30, colors[0].l - 20);
  ctx.fillRect(0, 0, w, h / 2);

  // Ground
  ctx.fillStyle = hslToHex(colors[1].h, colors[1].s - 30, colors[1].l - 30);
  ctx.fillRect(0, h / 2, w, h / 2);

  // Horizon line
  ctx.strokeStyle = hslToHex(colors[2]?.h || colors[0].h, colors[2]?.s || colors[0].s, colors[2]?.l || colors[0].l);
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, h / 2);
  ctx.lineTo(w, h / 2);
  ctx.stroke();

  // Minimal elements
  const elements = 2 + Math.floor(random() * 4);
  for (let i = 0; i < elements; i++) {
    const x = random() * w;
    const y = h / 2 + (random() - 0.5) * 20;
    const width = 30 + random() * 100;
    const color = colors[Math.floor(random() * colors.length)];

    ctx.fillStyle = hslToRgba(color.h, color.s, color.l, 0.3);
    ctx.fillRect(x, y, width, 2 + random() * 4);
  }

  // Sun or moon
  const celestialY = h * 0.3;
  ctx.beginPath();
  ctx.arc(w * 0.7, celestialY, 20 + random() * 20, 0, Math.PI * 2);
  ctx.fillStyle = hslToRgba(colors[2]?.h || 50, 30, 90, 0.9);
  ctx.fill();
}

// ─────────────────────────────────────────────────────────────────────────────
// TEXTURE & POST-PROCESSING
// ─────────────────────────────────────────────────────────────────────────────

function addGrain(ctx: CanvasRenderingContext2D, w: number, h: number, intensity: number = 0.03) {
  const imageData = ctx.getImageData(0, 0, w, h);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 255 * intensity;
    data[i] = Math.max(0, Math.min(255, data[i] + noise));
    data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise));
    data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise));
  }

  ctx.putImageData(imageData, 0, 0);
}

function addVignette(ctx: CanvasRenderingContext2D, w: number, h: number, intensity: number = 0.3) {
  const gradient = ctx.createRadialGradient(w/2, h/2, 0, w/2, h/2, Math.max(w, h) * 0.7);
  gradient.addColorStop(0, 'rgba(0,0,0,0)');
  gradient.addColorStop(1, `rgba(0,0,0,${intensity})`);

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, w, h);
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN GENERATION FUNCTION
// ─────────────────────────────────────────────────────────────────────────────

export function generatePremiumArt(
  canvas: HTMLCanvasElement,
  hueSeed: number,
  satSeed: number,
  lightSeed: number,
  styleSeed: number,
  shapeSeed: number,
  positionSeed: number,
  sizeSeed: number
): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const w = canvas.width;
  const h = canvas.height;

  // Create random generators
  const hueRandom = createSeededRandom(hueSeed);
  const satRandom = createSeededRandom(satSeed);
  const lightRandom = createSeededRandom(lightSeed);
  const styleRandom = createSeededRandom(styleSeed);
  const shapeRandom = createSeededRandom(shapeSeed);
  const positionRandom = createSeededRandom(positionSeed);
  const sizeRandom = createSeededRandom(sizeSeed);

  // Combined random for general use
  const combinedRandom = createSeededRandom(hueSeed, satSeed, lightSeed, styleSeed);

  // Generate premium color palette
  const { colors } = generatePremiumPalette(combinedRandom);

  // Select art style
  const styleIndex = Math.floor(styleRandom() * ART_STYLES.length);
  const style = ART_STYLES[styleIndex];

  // Create perlin noise for styles that need it
  const perlin = new PerlinNoise(hueSeed + satSeed + lightSeed);

  // Draw based on style
  switch (style) {
    // Flowing
    case 'flowField':
      drawFlowField(ctx, w, h, colors, combinedRandom, perlin);
      break;
    case 'liquidChrome':
      drawLiquidChrome(ctx, w, h, colors, combinedRandom, perlin);
      break;
    case 'inkBleed':
      drawInkBleed(ctx, w, h, colors, combinedRandom);
      break;
    case 'smokeWisps':
      drawSmokeWisps(ctx, w, h, colors, combinedRandom, perlin);
      break;

    // Geometric
    case 'voronoi':
      drawVoronoi(ctx, w, h, colors, combinedRandom);
      break;
    case 'sacredGeometry':
      drawSacredGeometry(ctx, w, h, colors, combinedRandom);
      break;
    case 'parametricWaves':
      drawParametricWaves(ctx, w, h, colors, combinedRandom);
      break;
    case 'crystalline':
      drawCrystalline(ctx, w, h, colors, combinedRandom);
      break;

    // Organic
    case 'neuralNetwork':
      drawNeuralNetwork(ctx, w, h, colors, combinedRandom);
      break;
    case 'dendriteGrowth':
      drawDendriteGrowth(ctx, w, h, colors, combinedRandom);
      break;
    case 'coralReef':
      drawCoralReef(ctx, w, h, colors, combinedRandom);
      break;
    case 'mycelium':
      drawMycelium(ctx, w, h, colors, combinedRandom, perlin);
      break;

    // Cosmic
    case 'nebula':
      drawNebula(ctx, w, h, colors, combinedRandom, perlin);
      break;
    case 'aurora':
      drawAurora(ctx, w, h, colors, combinedRandom, perlin);
      break;
    case 'starField':
      drawStarField(ctx, w, h, colors, combinedRandom);
      break;
    case 'cosmicDust':
      drawCosmicDust(ctx, w, h, colors, combinedRandom, perlin);
      break;

    // Abstract
    case 'glitchArt':
      drawGlitchArt(ctx, w, h, colors, combinedRandom);
      break;
    case 'gradientMesh':
      drawGradientMesh(ctx, w, h, colors, combinedRandom);
      break;
    case 'noiseLandscape':
      drawNoiseLandscape(ctx, w, h, colors, combinedRandom, perlin);
      break;
    case 'chromaticAberration':
      drawChromaticAberration(ctx, w, h, colors, combinedRandom);
      break;

    // Symmetric
    case 'mandala':
      drawMandala(ctx, w, h, colors, combinedRandom);
      break;
    case 'kaleidoscope':
      drawKaleidoscope(ctx, w, h, colors, combinedRandom);
      break;
    case 'fractalTree':
      drawFractalTree(ctx, w, h, colors, combinedRandom);
      break;
    case 'sacredCircle':
      drawSacredCircle(ctx, w, h, colors, combinedRandom);
      break;

    // Architectural
    case 'isometricWorld':
      drawIsometricWorld(ctx, w, h, colors, combinedRandom);
      break;
    case 'impossibleGeometry':
      drawImpossibleGeometry(ctx, w, h, colors, combinedRandom);
      break;
    case 'architecturalLines':
      drawArchitecturalLines(ctx, w, h, colors, combinedRandom, perlin);
      break;

    // Minimalist
    case 'zenGarden':
      drawZenGarden(ctx, w, h, colors, combinedRandom);
      break;
    case 'dotMatrix':
      drawDotMatrix(ctx, w, h, colors, combinedRandom);
      break;
    case 'breathingCircles':
      drawBreathingCircles(ctx, w, h, colors, combinedRandom);
      break;
    case 'lineHorizon':
      drawLineHorizon(ctx, w, h, colors, combinedRandom);
      break;

    default:
      drawFlowField(ctx, w, h, colors, combinedRandom, perlin);
  }

  // Post-processing
  if (combinedRandom() > 0.5) {
    addGrain(ctx, w, h, 0.02 + combinedRandom() * 0.03);
  }
  if (combinedRandom() > 0.3) {
    addVignette(ctx, w, h, 0.1 + combinedRandom() * 0.2);
  }
}

// Export for backward compatibility
export { ART_STYLES as PREMIUM_STYLES };
export type { ArtStyle, Color, HarmonyType };
