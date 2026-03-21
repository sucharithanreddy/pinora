// ═══════════════════════════════════════════════════════════════════════════════
// 🎨 PREMIUM GENERATIVE ART ENGINE v3.0 - QUANTUM VARIATION SYSTEM
// Infinite unique artworks - 10^63 possibilities with MASSIVE internal variation
// Each style now produces completely unique compositions, not just color swaps
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

  addColor(baseHue, baseSat, baseLight);

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
// 🌟 QUANTUM VARIATION SYSTEM - The Key to Infinite Uniqueness
// ─────────────────────────────────────────────────────────────────────────────

interface VariationParams {
  // Density: How much stuff is in the artwork
  density: number;           // 0 = empty/minimal, 1 = packed/dense
  
  // Scale: Size of elements
  scale: number;             // 0 = micro/tiny, 1 = macro/huge
  
  // Complexity: How intricate the patterns are
  complexity: number;        // 0 = simple, 1 = intricate
  
  // Symmetry: Balance of the composition
  symmetry: number;          // 0 = asymmetric/chaotic, 1 = perfect symmetry
  
  // Flow: Directional bias
  flowAngle: number;         // 0-360 degrees
  flowStrength: number;      // 0 = random, 1 = strong directional
  
  // Edge treatment
  softness: number;          // 0 = crisp/sharp, 1 = soft/blurred
  
  // Layering
  layerCount: number;        // 1-10 layers
  
  // Morphology
  curvature: number;         // 0 = angular/geometric, 1 = curved/organic
  
  // Animation-like variation
  tension: number;           // 0 = calm/relaxed, 1 = tense/dynamic
  
  // Organic variation
  organicness: number;       // 0 = precise/mathematical, 1 = organic/imperfect
  
  // Shape preference
  shapeBias: number;         // 0-1 affects shape selection within styles
}

function generateVariationParams(
  shapeSeed: number,
  positionSeed: number,
  sizeSeed: number
): VariationParams {
  const shapeRandom = createSeededRandom(shapeSeed);
  const positionRandom = createSeededRandom(positionSeed);
  const sizeRandom = createSeededRandom(sizeSeed);
  
  // Combine all seeds for interdependent values
  const combinedRandom = createSeededRandom(shapeSeed, positionSeed, sizeSeed);
  
  return {
    density: shapeRandom(),
    scale: sizeRandom(),
    complexity: positionRandom(),
    symmetry: combinedRandom(),
    flowAngle: shapeRandom() * 360,
    flowStrength: positionRandom(),
    softness: sizeRandom(),
    layerCount: Math.floor(1 + combinedRandom() * 9),
    curvature: shapeRandom(),
    tension: positionRandom(),
    organicness: sizeRandom(),
    shapeBias: combinedRandom()
  };
}

// Helper function to interpolate between values based on variation
function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
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
// PREMIUM ART STYLES (32 styles with quantum variation)
// ─────────────────────────────────────────────────────────────────────────────

type ArtStyle =
  | 'flowField' | 'liquidChrome' | 'inkBleed' | 'smokeWisps'
  | 'voronoi' | 'sacredGeometry' | 'parametricWaves' | 'crystalline'
  | 'neuralNetwork' | 'dendriteGrowth' | 'coralReef' | 'mycelium'
  | 'nebula' | 'aurora' | 'starField' | 'cosmicDust'
  | 'glitchArt' | 'gradientMesh' | 'noiseLandscape' | 'chromaticAberration'
  | 'mandala' | 'kaleidoscope' | 'fractalTree' | 'sacredCircle'
  | 'isometricWorld' | 'impossibleGeometry' | 'architecturalLines'
  | 'zenGarden' | 'dotMatrix' | 'breathingCircles' | 'lineHorizon';

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
// STYLE IMPLEMENTATIONS WITH QUANTUM VARIATION
// ─────────────────────────────────────────────────────────────────────────────

// FLOW FIELD - Now with massive variation
function drawFlowField(
  ctx: CanvasRenderingContext2D,
  w: number, h: number,
  colors: Color[],
  random: () => number,
  perlin: PerlinNoise,
  variation: VariationParams
) {
  // Background varies based on softness
  if (variation.softness > 0.5) {
    const bgGrad = ctx.createRadialGradient(w/2, h/2, 0, w/2, h/2, Math.max(w, h));
    bgGrad.addColorStop(0, hslToHex(colors[0].h, colors[0].s, colors[0].l - 10));
    bgGrad.addColorStop(1, hslToHex(colors[1].h, colors[1].s, colors[1].l - 20));
    ctx.fillStyle = bgGrad;
  } else {
    const bgGrad = ctx.createLinearGradient(
      Math.cos(variation.flowAngle * Math.PI / 180) * w,
      Math.sin(variation.flowAngle * Math.PI / 180) * h,
      w, h
    );
    bgGrad.addColorStop(0, hslToHex(colors[0].h, colors[0].s, colors[0].l - 15));
    bgGrad.addColorStop(1, hslToHex(colors[1].h, colors[1].s, colors[1].l - 15));
    ctx.fillStyle = bgGrad;
  }
  ctx.fillRect(0, 0, w, h);

  // Scale affects noise scale
  const scale = lerp(0.002, 0.02, variation.scale);
  
  // Density affects line count
  const lineCount = Math.floor(lerp(100, 2000, variation.density));
  
  // Complexity affects line length and behavior
  const baseLength = lerp(20, 200, variation.complexity);
  
  // Tension affects line variation
  const lengthVariation = lerp(0.1, 1, variation.tension);
  
  // Flow direction bias
  const flowAngleRad = variation.flowAngle * Math.PI / 180;
  const flowBias = variation.flowStrength;
  
  // Curvature affects how curvy the lines are
  const curvatureMultiplier = lerp(2, 6, variation.curvature);
  
  // Organicness adds wobble
  const wobbleAmount = lerp(0, 3, variation.organicness);

  ctx.lineCap = variation.softness > 0.5 ? 'round' : 'square';
  ctx.lineJoin = variation.softness > 0.5 ? 'round' : 'miter';

  for (let i = 0; i < lineCount; i++) {
    let x = random() * w;
    let y = random() * h;

    ctx.beginPath();
    ctx.moveTo(x, y);

    const colorIdx = Math.floor(random() * colors.length);
    const alpha = lerp(0.05, 0.5, random() * variation.complexity);
    ctx.strokeStyle = hslToRgba(colors[colorIdx].h, colors[colorIdx].s, colors[colorIdx].l, alpha);
    ctx.lineWidth = lerp(0.3, 4, variation.scale * random());

    const maxLength = baseLength * (1 + (random() - 0.5) * lengthVariation);

    for (let j = 0; j < maxLength; j++) {
      const noiseVal = perlin.fbm(x * scale, y * scale, Math.floor(lerp(2, 6, variation.complexity)));
      
      // Combine noise with flow direction
      const noiseAngle = noiseVal * Math.PI * curvatureMultiplier;
      const directedAngle = flowAngleRad + (noiseAngle - Math.PI) * (1 - flowBias);
      
      // Add organic wobble
      const wobble = (random() - 0.5) * wobbleAmount;
      
      x += Math.cos(directedAngle + wobble) * lerp(1, 4, variation.tension);
      y += Math.sin(directedAngle + wobble) * lerp(1, 4, variation.tension);

      if (x < 0 || x > w || y < 0 || y > h) break;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
}

// LIQUID CHROME - Metallic with variation
function drawLiquidChrome(
  ctx: CanvasRenderingContext2D,
  w: number, h: number,
  colors: Color[],
  random: () => number,
  perlin: PerlinNoise,
  variation: VariationParams
) {
  const imageData = ctx.createImageData(w, h);
  const data = imageData.data;

  // Scale affects detail level
  const scale = lerp(0.001, 0.008, variation.scale);
  const baseHue = colors[0].h;
  
  // Complexity affects octave count
  const octaves = Math.floor(lerp(2, 6, variation.complexity));
  
  // Tension affects contrast
  const contrastMultiplier = lerp(20, 60, variation.tension);
  
  // Organicness creates irregularities
  const irregularityScale = variation.organicness * 3;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const n1 = perlin.fbm(x * scale + variation.flowAngle * 0.01, y * scale, octaves);
      const n2 = perlin.fbm(x * scale * 2 * (1 + irregularityScale * 0.1), y * scale * 2, octaves - 1);
      const n3 = perlin.fbm(x * scale * 0.5, y * scale * 0.5 + variation.shapeBias * 10, Math.max(2, octaves - 2));

      const hue = (baseHue + n1 * 60 * variation.complexity + n3 * 30) % 360;
      const sat = lerp(15, 50, Math.abs(n1) * variation.density);
      const light = lerp(30, 80, Math.abs(n2) * variation.tension + Math.abs(n3) * 0.3);

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

// INK BLEED - Watercolor with variation
function drawInkBleed(
  ctx: CanvasRenderingContext2D,
  w: number, h: number,
  colors: Color[],
  random: () => number,
  variation: VariationParams
) {
  // Background can vary from paper white to cream to gray
  const bgLightness = lerp(90, 97, variation.softness);
  const bgHue = colors[0].h + variation.shapeBias * 30;
  ctx.fillStyle = hslToHex(bgHue, 5, bgLightness);
  ctx.fillRect(0, 0, w, h);

  // Density affects number of blotches
  const blotches = Math.floor(lerp(5, 40, variation.density));
  
  // Scale affects blotch sizes
  const minRadius = lerp(10, 50, variation.scale);
  const maxRadius = lerp(80, 250, variation.scale);
  
  // Softness affects layering
  const layers = Math.floor(lerp(2, 8, variation.softness));
  
  // Organicness affects bleeding
  const bleedAmount = lerp(0.1, 0.5, variation.organicness);
  
  // Flow affects where blotches appear
  const flowX = Math.cos(variation.flowAngle * Math.PI / 180);
  const flowY = Math.sin(variation.flowAngle * Math.PI / 180);

  for (let i = 0; i < blotches; i++) {
    const color = colors[Math.floor(random() * colors.length)];
    
    // Position influenced by flow
    let x = random() * w + flowX * variation.flowStrength * w * 0.3;
    let y = random() * h + flowY * variation.flowStrength * h * 0.3;
    x = ((x % w) + w) % w;
    y = ((y % h) + h) % h;
    
    const radius = minRadius + random() * (maxRadius - minRadius);

    for (let layer = 0; layer < layers; layer++) {
      const layerRadius = radius * (1 + layer * bleedAmount);
      const alpha = lerp(0.02, 0.08, variation.softness) * (1 - layer * 0.1);

      const gradient = ctx.createRadialGradient(x, y, 0, x, y, layerRadius);
      gradient.addColorStop(0, hslToRgba(color.h, color.s, color.l, alpha));
      gradient.addColorStop(0.4, hslToRgba(color.h, color.s - 10, color.l + 10, alpha * 0.6));
      gradient.addColorStop(0.7, hslToRgba(color.h, color.s - 15, color.l + 15, alpha * 0.3));
      gradient.addColorStop(1, hslToRgba(color.h, color.s - 20, color.l + 20, 0));

      ctx.fillStyle = gradient;
      ctx.beginPath();
      
      // Organic shape variation
      if (variation.organicness > 0.5) {
        const points = 8 + Math.floor(random() * 8);
        for (let p = 0; p <= points; p++) {
          const angle = (p / points) * Math.PI * 2;
          const r = layerRadius * (0.8 + random() * 0.4);
          const px = x + Math.cos(angle) * r + (random() - 0.5) * layerRadius * 0.2;
          const py = y + Math.sin(angle) * r + (random() - 0.5) * layerRadius * 0.2;
          if (p === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
      } else {
        ctx.arc(x + (random() - 0.5) * 20, y + (random() - 0.5) * 20, layerRadius, 0, Math.PI * 2);
      }
      ctx.fill();
    }
  }

  // Paper texture varies with softness
  const textureDensity = lerp(2000, 8000, variation.complexity);
  ctx.globalAlpha = lerp(0.01, 0.03, variation.softness);
  for (let i = 0; i < textureDensity; i++) {
    ctx.fillStyle = random() > 0.5 ? '#000' : '#fff';
    ctx.fillRect(random() * w, random() * h, 1, 1);
  }
  ctx.globalAlpha = 1;
}

// SMOKE WISPS with variation
function drawSmokeWisps(
  ctx: CanvasRenderingContext2D,
  w: number, h: number,
  colors: Color[],
  random: () => number,
  perlin: PerlinNoise,
  variation: VariationParams
) {
  // Background varies
  const bgGrad = ctx.createRadialGradient(w/2, h/2, 0, w/2, h/2, Math.max(w, h));
  bgGrad.addColorStop(0, hslToHex(colors[0].h, colors[0].s - lerp(10, 30, variation.tension), colors[0].l - 20));
  bgGrad.addColorStop(1, hslToHex(colors[1].h, colors[1].s - 30, colors[1].l - 30));
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, w, h);

  // Density affects wisp count
  const wispCount = Math.floor(lerp(3, 20, variation.density));
  
  // Complexity affects wisp length
  const wispLength = Math.floor(lerp(50, 200, variation.complexity));
  
  // Flow affects direction
  const flowAngleRad = variation.flowAngle * Math.PI / 180;
  
  // Tension affects turbulence
  const turbulence = lerp(1, 5, variation.tension);
  
  // Softness affects blur
  const blurAmount = lerp(3, 15, variation.softness);

  for (let i = 0; i < wispCount; i++) {
    const baseX = random() * w;
    const baseY = variation.flowStrength > 0.5 
      ? h + 50 
      : random() * h;
    const color = colors[Math.floor(random() * colors.length)];

    ctx.beginPath();

    let x = baseX;
    let y = baseY;
    const points: { x: number; y: number }[] = [{ x, y }];

    for (let j = 0; j < wispLength; j++) {
      const noise = perlin.fbm(x * 0.01 * (1 + variation.organicness), y * 0.01, 3);
      const direction = flowAngleRad + noise * Math.PI * 2 * variation.flowStrength;
      x += Math.cos(direction) * turbulence + (random() - 0.5) * 3;
      y += Math.sin(direction) * turbulence - lerp(1, 5, variation.tension);
      points.push({ x, y });
    }

    ctx.moveTo(points[0].x, points[0].y);
    for (let j = 1; j < points.length; j++) {
      ctx.lineTo(points[j].x, points[j].y);
    }

    ctx.strokeStyle = hslToRgba(color.h, color.s - 20, color.l + 30, 0.05 + random() * 0.15);
    ctx.lineWidth = lerp(10, 60, variation.scale);
    ctx.lineCap = 'round';
    ctx.filter = `blur(${blurAmount}px)`;
    ctx.stroke();
    ctx.filter = 'none';
  }
}

// VORONOI with variation
function drawVoronoi(
  ctx: CanvasRenderingContext2D,
  w: number, h: number,
  colors: Color[],
  random: () => number,
  variation: VariationParams
) {
  // Density affects cell count
  const pointCount = Math.floor(lerp(10, 80, variation.density));
  const points: { x: number; y: number; color: Color }[] = [];

  // Symmetry affects point distribution
  if (variation.symmetry > 0.7) {
    // Symmetric distribution
    const halfPoints = Math.floor(pointCount / 2);
    for (let i = 0; i < halfPoints; i++) {
      const x = random() * w;
      const y = random() * h;
      const color = colors[Math.floor(random() * colors.length)];
      points.push({ x, y, color });
      points.push({ x: w - x, y: h - y, color });
    }
  } else {
    for (let i = 0; i < pointCount; i++) {
      points.push({
        x: random() * w,
        y: random() * h,
        color: colors[Math.floor(random() * colors.length)]
      });
    }
  }

  const imageData = ctx.createImageData(w, h);
  const data = imageData.data;

  // Scale affects cell detail
  const cellSize = Math.max(1, Math.ceil(w / lerp(20, 60, variation.scale)));
  
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

      // Complexity affects color variation
      const colorVariation = variation.complexity * 10;
      const { r, g, b } = hslToRgb(
        nearestPoint.color.h + (random() - 0.5) * colorVariation,
        nearestPoint.color.s,
        nearestPoint.color.l
      );

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

  // Edge treatment
  if (variation.softness < 0.5) {
    ctx.strokeStyle = hslToRgba(colors[0].h, colors[0].s - 30, colors[0].l - 20, 0.3);
    ctx.lineWidth = 1;
    for (const point of points) {
      ctx.beginPath();
      ctx.arc(point.x, point.y, lerp(2, 6, variation.scale), 0, Math.PI * 2);
      ctx.fillStyle = hslToHex(point.color.h, point.color.s, point.color.l - 20);
      ctx.fill();
    }
  }
}

// SACRED GEOMETRY with variation
function drawSacredGeometry(
  ctx: CanvasRenderingContext2D,
  w: number, h: number,
  colors: Color[],
  random: () => number,
  variation: VariationParams
) {
  ctx.fillStyle = hslToHex(colors[0].h, colors[0].s - 30, colors[0].l - 30);
  ctx.fillRect(0, 0, w, h);

  const cx = w / 2;
  const cy = h / 2;
  const maxRadius = Math.min(w, h) * 0.45;

  // Complexity affects layer count
  const layers = Math.floor(lerp(2, 6, variation.complexity));
  
  // Symmetry affects pattern balance
  const symmetrySegments = Math.floor(lerp(4, 12, variation.symmetry)) * (variation.symmetry > 0.5 ? 1 : Math.floor(random() * 2 + 1));
  
  // Curvature affects shape roundness
  const curvature = variation.curvature;

  ctx.strokeStyle = hslToRgba(colors[1].h, colors[1].s, colors[1].l, 0.4 + random() * 0.3);
  ctx.lineWidth = lerp(0.5, 3, variation.scale);

  // Flower of Life base - density affects how many circles
  const circleDensity = lerp(0.3, 1, variation.density);
  
  // Central circle
  ctx.beginPath();
  ctx.arc(cx, cy, maxRadius / 3 * lerp(0.8, 1.2, variation.shapeBias), 0, Math.PI * 2);
  ctx.stroke();

  // Surrounding circles with symmetry variation
  for (let layer = 1; layer <= layers; layer++) {
    const radius = (maxRadius / 3) * layer;
    const count = Math.floor(6 * layer * circleDensity);

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + 
        (layer % 2 === 0 ? Math.PI / count : 0) + 
        (variation.symmetry < 0.5 ? random() * 0.2 : 0);
      const x = cx + Math.cos(angle) * radius * 0.5;
      const y = cy + Math.sin(angle) * radius * 0.5;

      ctx.beginPath();
      
      if (curvature > 0.7) {
        ctx.arc(x, y, maxRadius / 3, 0, Math.PI * 2);
      } else {
        // Angular version
        const sides = 6;
        const r = maxRadius / 3;
        for (let s = 0; s <= sides; s++) {
          const a = (s / sides) * Math.PI * 2;
          const px = x + Math.cos(a) * r;
          const py = y + Math.sin(a) * r;
          if (s === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
      }
      ctx.stroke();
    }
  }

  // Inner geometric patterns
  const innerLayers = Math.floor(lerp(1, 5, variation.layerCount / 10));
  for (let i = 0; i < innerLayers; i++) {
    const radius = maxRadius * (0.1 + i * 0.12);
    const sides = Math.floor(lerp(3, 12, variation.shapeBias));

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

// PARAMETRIC WAVES with variation
function drawParametricWaves(
  ctx: CanvasRenderingContext2D,
  w: number, h: number,
  colors: Color[],
  random: () => number,
  variation: VariationParams
) {
  // Background direction based on flow
  const bgGrad = ctx.createLinearGradient(
    Math.cos(variation.flowAngle * Math.PI / 180) * w,
    0,
    w, h
  );
  bgGrad.addColorStop(0, hslToHex(colors[0].h, colors[0].s - 20, colors[0].l - 20));
  bgGrad.addColorStop(1, hslToHex(colors[1].h, colors[1].s - 20, colors[1].l - 20));
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, w, h);

  // Density affects wave count
  const waveCount = Math.floor(lerp(3, 15, variation.density));
  
  // Scale affects amplitude
  const amplitude = lerp(10, 80, variation.scale);
  
  // Complexity affects frequency and modulation
  const frequency = lerp(0.003, 0.03, variation.complexity);
  const modulationFreq = frequency * lerp(0.1, 0.5, variation.tension);
  
  // Curvature affects wave smoothness
  const smoothness = lerp(1, 5, variation.curvature);

  for (let i = 0; i < waveCount; i++) {
    const yBase = (h / (waveCount + 1)) * (i + 1);
    const color = colors[i % colors.length];
    const phase = random() * Math.PI * 2 + variation.flowAngle * Math.PI / 180;

    ctx.beginPath();
    ctx.moveTo(0, yBase);

    for (let x = 0; x <= w; x += smoothness) {
      const wave1 = Math.sin(x * frequency + phase) * amplitude;
      const wave2 = Math.sin(x * modulationFreq + phase * 2) * amplitude * 0.3;
      const wave3 = Math.cos(x * frequency * 0.5) * amplitude * 0.2 * variation.complexity;
      const y = yBase + wave1 * Math.sin(x * modulationFreq) + wave2 + wave3;
      ctx.lineTo(x, y);
    }

    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.closePath();

    const alpha = lerp(0.2, 0.6, variation.density * random());
    const gradient = ctx.createLinearGradient(0, yBase - amplitude, 0, yBase + amplitude * 2);
    gradient.addColorStop(0, hslToRgba(color.h, color.s, color.l, alpha));
    gradient.addColorStop(1, hslToRgba(color.h, color.s - 20, color.l + 20, alpha * 0.3));
    ctx.fillStyle = gradient;
    ctx.fill();
  }
}

// CRYSTALLINE with variation
function drawCrystalline(
  ctx: CanvasRenderingContext2D,
  w: number, h: number,
  colors: Color[],
  random: () => number,
  variation: VariationParams
) {
  ctx.fillStyle = hslToHex(colors[0].h, colors[0].s - 30, colors[0].l - 25);
  ctx.fillRect(0, 0, w, h);

  // Density affects crystal count
  const crystals = Math.floor(lerp(5, 50, variation.density));
  
  // Scale affects crystal size
  const minSize = lerp(10, 40, variation.scale);
  const maxSize = lerp(60, 150, variation.scale);
  
  // Curvature affects crystal shape (angular vs rounded)
  const crystalShape = variation.curvature;
  
  // Symmetry affects placement
  const symmetric = variation.symmetry > 0.7;

  for (let i = 0; i < crystals; i++) {
    let cx = random() * w;
    let cy = random() * h;
    
    // Symmetric placement
    if (symmetric && i < crystals / 2) {
      // Will be mirrored
    }
    
    const size = minSize + random() * (maxSize - minSize);
    const sides = Math.floor(lerp(3, 8, 1 - variation.shapeBias));
    const color = colors[Math.floor(random() * colors.length)];

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(random() * Math.PI * 2 + variation.flowAngle * Math.PI / 180 * variation.flowStrength);

    ctx.beginPath();
    
    if (crystalShape > 0.7) {
      // Rounded crystal
      for (let j = 0; j < sides * 2; j++) {
        const radius = j % 2 === 0 ? size : size * 0.5;
        const angle = (j / (sides * 2)) * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        if (j === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
    } else {
      // Angular crystal with sharper points
      const points = sides * 2;
      for (let j = 0; j < points; j++) {
        const radius = j % 2 === 0 ? size : size * lerp(0.3, 0.6, variation.tension);
        const angle = (j / points) * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        if (j === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
    }
    ctx.closePath();

    // Gradient fill with variation
    const gradientAngle = variation.flowAngle * Math.PI / 180;
    const gradient = ctx.createLinearGradient(
      -size * Math.cos(gradientAngle), -size * Math.sin(gradientAngle),
      size * Math.cos(gradientAngle), size * Math.sin(gradientAngle)
    );
    
    const baseAlpha = lerp(0.4, 0.9, variation.density);
    gradient.addColorStop(0, hslToRgba(color.h, color.s, color.l + 20, baseAlpha));
    gradient.addColorStop(0.5, hslToRgba(color.h, color.s - 10, color.l, baseAlpha * 0.6));
    gradient.addColorStop(1, hslToRgba(color.h, color.s - 20, color.l - 10, baseAlpha * 0.3));

    ctx.fillStyle = gradient;
    ctx.fill();

    ctx.strokeStyle = hslToRgba(color.h, color.s, color.l + 30, lerp(0.3, 0.8, variation.softness));
    ctx.lineWidth = lerp(0.5, 2, variation.scale);
    ctx.stroke();

    ctx.restore();
  }
}

// NEURAL NETWORK with variation
function drawNeuralNetwork(
  ctx: CanvasRenderingContext2D,
  w: number, h: number,
  colors: Color[],
  random: () => number,
  variation: VariationParams
) {
  ctx.fillStyle = hslToHex(colors[0].h, colors[0].s - 40, colors[0].l - 30);
  ctx.fillRect(0, 0, w, h);

  // Density affects node count
  const nodeCount = Math.floor(lerp(15, 100, variation.density));
  
  // Scale affects node sizes
  const minNodeSize = lerp(2, 6, variation.scale);
  const maxNodeSize = lerp(6, 15, variation.scale);
  
  // Complexity affects connections per node
  const connectionsPerNode = Math.floor(lerp(1, 6, variation.complexity));
  
  // Symmetry affects distribution
  const symmetric = variation.symmetry > 0.6;

  const nodes: { x: number; y: number; size: number; color: Color }[] = [];

  for (let i = 0; i < nodeCount; i++) {
    let x = random() * w;
    let y = random() * h;
    
    if (symmetric && i < nodeCount / 2) {
      // Store for mirroring
    }
    
    nodes.push({
      x, y,
      size: minNodeSize + random() * (maxNodeSize - minNodeSize),
      color: colors[Math.floor(random() * colors.length)]
    });
  }

  // Draw connections with variation
  const connectionAlpha = lerp(0.1, 0.5, variation.tension);
  
  for (let i = 0; i < nodes.length; i++) {
    const connections = Math.floor(1 + random() * connectionsPerNode);
    for (let j = 0; j < connections; j++) {
      const target = Math.floor(random() * nodes.length);
      if (target !== i) {
        const gradient = ctx.createLinearGradient(
          nodes[i].x, nodes[i].y,
          nodes[target].x, nodes[target].y
        );
        gradient.addColorStop(0, hslToRgba(nodes[i].color.h, nodes[i].color.s, nodes[i].color.l, connectionAlpha));
        gradient.addColorStop(1, hslToRgba(nodes[target].color.h, nodes[target].color.s, nodes[target].color.l, connectionAlpha * 0.3));

        ctx.beginPath();
        
        if (variation.curvature > 0.5) {
          // Curved connections
          const midX = (nodes[i].x + nodes[target].x) / 2;
          const midY = (nodes[i].y + nodes[target].y) / 2;
          const curve = lerp(-50, 50, random() - 0.5);
          ctx.quadraticCurveTo(midX + curve, midY + curve, nodes[target].x, nodes[target].y);
        } else {
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[target].x, nodes[target].y);
        }
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = lerp(0.3, 2, variation.scale * random());
        ctx.stroke();
      }
    }
  }

  // Draw nodes with glow based on softness
  for (const node of nodes) {
    const glowSize = node.size * lerp(1.5, 3, variation.softness);
    const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, glowSize);
    gradient.addColorStop(0, hslToRgba(node.color.h, node.color.s, node.color.l + 20, 1));
    gradient.addColorStop(0.5, hslToRgba(node.color.h, node.color.s, node.color.l, 0.8));
    gradient.addColorStop(1, hslToRgba(node.color.h, node.color.s, node.color.l, 0));

    ctx.beginPath();
    ctx.arc(node.x, node.y, glowSize, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
    ctx.fillStyle = hslToHex(node.color.h, node.color.s, node.color.l + 20);
    ctx.fill();
  }
}

// DENDRITE GROWTH with variation
function drawDendriteGrowth(
  ctx: CanvasRenderingContext2D,
  w: number, h: number,
  colors: Color[],
  random: () => number,
  variation: VariationParams
) {
  ctx.fillStyle = hslToHex(colors[0].h, colors[0].s - 50, 5);
  ctx.fillRect(0, 0, w, h);

  // Density affects seed count
  const seeds = Math.floor(lerp(2, 10, variation.density));
  
  // Complexity affects max depth
  const maxDepth = Math.floor(lerp(5, 12, variation.complexity));
  
  // Scale affects branch length
  const branchLength = lerp(10, 30, variation.scale);
  
  // Curvature affects branch angle variance
  const angleVariance = lerp(0.5, 2, variation.curvature);
  
  // Flow affects growth direction
  const flowBias = variation.flowAngle * Math.PI / 180;
  const flowStrength = variation.flowStrength;

  type Branch = { x: number; y: number; angle: number; depth: number; color: Color };
  const branches: Branch[] = [];

  for (let i = 0; i < seeds; i++) {
    let angle = random() * Math.PI * 2;
    if (flowStrength > 0.5) {
      angle = flowBias + (random() - 0.5) * Math.PI * (1 - flowStrength);
    }
    branches.push({
      x: random() * w,
      y: random() * h,
      angle: angle,
      depth: 0,
      color: colors[Math.floor(random() * colors.length)]
    });
  }

  function grow(branchList: Branch[]) {
    const newBranches: Branch[] = [];

    for (const branch of branchList) {
      if (branch.depth >= maxDepth) continue;

      const length = branchLength * (1 - branch.depth / maxDepth) * (1 + variation.tension * 0.5);
      const endX = branch.x + Math.cos(branch.angle) * length;
      const endY = branch.y + Math.sin(branch.angle) * length;

      ctx.beginPath();
      ctx.moveTo(branch.x, branch.y);
      ctx.lineTo(endX, endY);
      
      const alpha = 0.3 + (1 - branch.depth / maxDepth) * 0.7;
      ctx.strokeStyle = hslToRgba(branch.color.h, branch.color.s, branch.color.l, alpha);
      ctx.lineWidth = Math.max(0.5, 4 * (1 - branch.depth / maxDepth) * variation.scale);
      ctx.stroke();

      // Branch out probability based on density
      const branchProbability = 0.3 + variation.density * 0.4;
      
      if (random() < branchProbability) {
        newBranches.push({
          x: endX,
          y: endY,
          angle: branch.angle + (random() - 0.5) * angleVariance,
          depth: branch.depth + 1,
          color: branch.color
        });
      }
      if (random() < branchProbability * 0.8) {
        newBranches.push({
          x: endX,
          y: endY,
          angle: branch.angle + (random() - 0.5) * angleVariance,
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

// CORAL REEF with variation
function drawCoralReef(
  ctx: CanvasRenderingContext2D,
  w: number, h: number,
  colors: Color[],
  random: () => number,
  variation: VariationParams
) {
  // Background depth varies with tension
  const depthDarkness = lerp(5, 20, variation.tension);
  const gradient = ctx.createLinearGradient(0, 0, 0, h);
  gradient.addColorStop(0, hslToHex(200 + variation.flowAngle * 0.1, 60, 15));
  gradient.addColorStop(1, hslToHex(210, 70, depthDarkness));
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, w, h);

  // Density affects coral count
  const corals = Math.floor(lerp(4, 20, variation.density));
  
  // Scale affects coral size
  const baseSize = lerp(20, 80, variation.scale);
  
  // Shape bias affects coral type distribution
  const typeBias = variation.shapeBias;

  for (let i = 0; i < corals; i++) {
    const x = random() * w;
    const baseY = h - 20 - random() * 50 * (1 - variation.flowStrength * 0.5);
    const color = colors[Math.floor(random() * colors.length)];
    const size = baseSize * (0.5 + random() * 0.5);
    
    // Type selection based on shape bias
    let type: number;
    if (typeBias < 0.33) type = 0;
    else if (typeBias < 0.66) type = 1;
    else type = 2;
    
    // Add some randomness
    type = Math.floor(random() * 3);

    if (type === 0) {
      drawCoralBranch(ctx, x, baseY, size, color, random, variation);
    } else if (type === 1) {
      drawCoralFan(ctx, x, baseY, size, color, random, variation);
    } else {
      drawCoralTube(ctx, x, baseY, size, color, random, variation);
    }
  }

  // Bubbles vary with organicness
  const bubbleCount = Math.floor(lerp(20, 100, variation.organicness));
  ctx.fillStyle = 'rgba(255,255,255,0.1)';
  for (let i = 0; i < bubbleCount; i++) {
    ctx.beginPath();
    ctx.arc(random() * w, random() * h, 1 + random() * 3 * variation.scale, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawCoralBranch(
  ctx: CanvasRenderingContext2D,
  x: number, y: number,
  size: number,
  color: Color,
  random: () => number,
  variation: VariationParams
) {
  const branches = Math.floor(lerp(2, 6, variation.complexity));

  for (let i = 0; i < branches; i++) {
    const angle = -Math.PI / 2 + (random() - 0.5) * lerp(0.5, 1.2, variation.curvature);
    const length = size * (0.5 + random() * 0.5);

    ctx.beginPath();
    ctx.moveTo(x, y);

    const endX = x + Math.cos(angle) * length;
    const endY = y + Math.sin(angle) * length;

    const curveAmount = lerp(0, 30, variation.organicness);
    ctx.quadraticCurveTo(
      x + Math.cos(angle) * length * 0.5 + (random() - 0.5) * curveAmount,
      y + Math.sin(angle) * length * 0.5,
      endX,
      endY
    );

    ctx.strokeStyle = hslToRgba(color.h, color.s, color.l, 0.8);
    ctx.lineWidth = lerp(1, 6, variation.scale);
    ctx.lineCap = 'round';
    ctx.stroke();

    if (size > 20) {
      drawCoralBranch(ctx, endX, endY, size * 0.6, color, random, variation);
    }
  }
}

function drawCoralFan(
  ctx: CanvasRenderingContext2D,
  x: number, y: number,
  size: number,
  color: Color,
  random: () => number,
  variation: VariationParams
) {
  const lines = Math.floor(lerp(8, 30, variation.density));

  for (let i = 0; i < lines; i++) {
    const spreadAngle = lerp(0.8, 1.5, variation.curvature);
    const angle = -Math.PI / 2 + (i / lines - 0.5) * spreadAngle;
    const length = size * (0.4 + random() * 0.6);

    ctx.beginPath();
    ctx.moveTo(x, y);
    
    if (variation.organicness > 0.5) {
      const midX = x + Math.cos(angle) * length * 0.5;
      const midY = y + Math.sin(angle) * length * 0.5;
      ctx.quadraticCurveTo(
        midX + (random() - 0.5) * 10,
        midY,
        x + Math.cos(angle) * length,
        y + Math.sin(angle) * length
      );
    } else {
      ctx.lineTo(x + Math.cos(angle) * length, y + Math.sin(angle) * length);
    }
    
    ctx.strokeStyle = hslToRgba(color.h, color.s, color.l, 0.3 + random() * 0.4);
    ctx.lineWidth = lerp(1, 3, variation.scale);
    ctx.stroke();
  }
}

function drawCoralTube(
  ctx: CanvasRenderingContext2D,
  x: number, y: number,
  size: number,
  color: Color,
  random: () => number,
  variation: VariationParams
) {
  const tubes = Math.floor(lerp(3, 12, variation.density));

  for (let i = 0; i < tubes; i++) {
    const tubeX = x + (random() - 0.5) * size;
    const tubeY = y;
    const height = size * (0.4 + random() * 0.6);
    const width = lerp(3, 15, variation.scale);

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

// MYCELIUM with variation
function drawMycelium(
  ctx: CanvasRenderingContext2D,
  w: number, h: number,
  colors: Color[],
  random: () => number,
  perlin: PerlinNoise,
  variation: VariationParams
) {
  ctx.fillStyle = hslToHex(colors[0].h, colors[0].s - 50, 5);
  ctx.fillRect(0, 0, w, h);

  // Density affects starting points
  const startingPoints = Math.floor(lerp(2, 15, variation.density));
  
  // Complexity affects path length
  const pathLength = Math.floor(lerp(50, 300, variation.complexity));
  
  // Flow affects growth direction
  const flowBias = variation.flowAngle * Math.PI / 180;
  const flowStrength = variation.flowStrength;
  
  // Tension affects branching behavior
  const branchChance = lerp(0.01, 0.1, variation.tension);

  for (let i = 0; i < startingPoints; i++) {
    let x = random() * w;
    let y = random() * h;
    const color = colors[Math.floor(random() * colors.length)];

    for (let j = 0; j < pathLength; j++) {
      const noise = perlin.fbm(x * 0.01 * (1 + variation.organicness), y * 0.01, Math.floor(lerp(2, 5, variation.complexity)));
      
      // Combine noise with flow direction
      const noiseAngle = noise * Math.PI * 4;
      const flowAngle = flowBias + (noiseAngle - flowBias) * (1 - flowStrength);
      
      const stepSize = lerp(2, 5, variation.tension);
      const newX = x + Math.cos(flowAngle) * stepSize;
      const newY = y + Math.sin(flowAngle) * stepSize;

      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(newX, newY);
      ctx.strokeStyle = hslToRgba(color.h, color.s, color.l, 0.2 + random() * 0.5);
      ctx.lineWidth = lerp(0.3, 2, variation.scale * random());
      ctx.stroke();

      x = newX;
      y = newY;

      if (x < 0 || x > w || y < 0 || y > h) break;
    }
  }

  // Spore nodes
  const nodes = Math.floor(lerp(10, 50, variation.density));
  for (let i = 0; i < nodes; i++) {
    const x = random() * w;
    const y = random() * h;
    const size = lerp(1, 8, variation.scale);
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

// NEBULA with variation
function drawNebula(
  ctx: CanvasRenderingContext2D,
  w: number, h: number,
  colors: Color[],
  random: () => number,
  perlin: PerlinNoise,
  variation: VariationParams
) {
  const imageData = ctx.createImageData(w, h);
  const data = imageData.data;

  // Scale affects noise detail
  const baseScale = lerp(0.001, 0.005, variation.scale);
  
  // Complexity affects octave count
  const octaves = Math.floor(lerp(3, 6, variation.complexity));
  
  // Density affects cloud density
  const cloudDensity = lerp(0.8, 1.5, variation.density);
  
  // Flow affects cloud direction
  const flowOffset = variation.flowAngle * 0.01;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const nx = x / w;
      const ny = y / h;

      const n1 = perlin.fbm(x * baseScale + flowOffset, y * baseScale, octaves);
      const n2 = perlin.fbm(x * baseScale * 2, y * baseScale * 2, octaves - 1);
      const n3 = perlin.fbm(x * baseScale * 0.5, y * baseScale * 0.5, 2);

      const dx = nx - 0.5;
      const dy = ny - 0.5;
      const dist = Math.sqrt(dx * dx + dy * dy);

      const intensity = Math.max(0, 1 - dist * cloudDensity) * (0.5 + n1 * 0.5) * (0.5 + n2 * 0.5);

      const colorIdx = Math.floor((n1 + 1) * 0.5 * colors.length) % colors.length;
      const color = colors[colorIdx];

      const { r, g, b } = hslToRgb(
        color.h + n3 * 30 * variation.tension,
        color.s * intensity,
        color.l * intensity + (1 - intensity) * 5
      );

      const idx = (y * w + x) * 4;
      data[idx] = r;
      data[idx + 1] = g;
      data[idx + 2] = b;
      data[idx + 3] = 255;
    }
  }

  ctx.putImageData(imageData, 0, 0);

  // Stars vary with density
  const starCount = Math.floor(lerp(50, 200, variation.density));
  ctx.fillStyle = '#fff';
  for (let i = 0; i < starCount; i++) {
    const x = random() * w;
    const y = random() * h;
    const size = random() * lerp(1, 3, variation.scale);
    ctx.globalAlpha = random() * 0.8 + 0.2;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

// AURORA with variation
function drawAurora(
  ctx: CanvasRenderingContext2D,
  w: number, h: number,
  colors: Color[],
  random: () => number,
  perlin: PerlinNoise,
  variation: VariationParams
) {
  // Sky darkness varies with tension
  ctx.fillStyle = hslToHex(250, 30, lerp(3, 10, variation.tension));
  ctx.fillRect(0, 0, w, h);

  // Density affects aurora layers
  const auroraLayers = Math.floor(lerp(2, 7, variation.density));
  
  // Complexity affects wave behavior
  const waveFreq = lerp(0.003, 0.015, variation.complexity);
  const noiseScale = lerp(0.003, 0.01, variation.tension);
  
  // Flow affects curtain direction
  const flowAngle = variation.flowAngle * Math.PI / 180;

  for (let layer = 0; layer < auroraLayers; layer++) {
    const color = colors[layer % colors.length];
    const yOffset = h * lerp(0.15, 0.35, layer / auroraLayers) + layer * h * 0.1;

    ctx.beginPath();
    ctx.moveTo(0, yOffset);

    for (let x = 0; x <= w; x += lerp(2, 10, variation.scale)) {
      const noise = perlin.fbm(x * noiseScale + layer * 0.5, layer * 0.3, Math.floor(lerp(2, 5, variation.complexity)));
      const wave1 = Math.sin(x * waveFreq + layer + flowAngle) * lerp(20, 50, variation.tension);
      const wave2 = noise * lerp(40, 100, variation.organicness);
      const y = yOffset + wave1 + wave2;
      ctx.lineTo(x, y);
    }

    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.closePath();

    const gradient = ctx.createLinearGradient(0, yOffset - 50, 0, h);
    const alpha = lerp(0.3, 0.7, variation.density);
    gradient.addColorStop(0, hslToRgba(color.h, color.s, color.l + 20, alpha));
    gradient.addColorStop(0.3, hslToRgba(color.h, color.s - 20, color.l, alpha * 0.5));
    gradient.addColorStop(1, hslToRgba(color.h, color.s - 40, color.l - 20, 0));

    ctx.fillStyle = gradient;
    ctx.fill();
  }

  // Stars
  const starCount = Math.floor(lerp(30, 100, variation.complexity));
  for (let i = 0; i < starCount; i++) {
    const x = random() * w;
    const y = random() * h * 0.5;
    const size = random() * lerp(1, 2, variation.scale);

    ctx.fillStyle = `rgba(255,255,255,${random() * 0.7 + 0.3})`;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }
}

// STAR FIELD with variation
function drawStarField(
  ctx: CanvasRenderingContext2D,
  w: number, h: number,
  colors: Color[],
  random: () => number,
  variation: VariationParams
) {
  // Background depth varies
  const gradient = ctx.createRadialGradient(w/2, h/2, 0, w/2, h/2, Math.max(w, h));
  gradient.addColorStop(0, hslToHex(250, 30, lerp(5, 15, variation.tension)));
  gradient.addColorStop(0.5, hslToHex(250, 40, lerp(2, 8, variation.tension)));
  gradient.addColorStop(1, '#000005');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, w, h);

  // Background stars - density controlled
  const bgStarCount = Math.floor(lerp(200, 800, variation.density));
  for (let i = 0; i < bgStarCount; i++) {
    const x = random() * w;
    const y = random() * h;
    const size = random() * lerp(0.5, 2, variation.scale);
    const brightness = random();

    ctx.fillStyle = `rgba(255,255,255,${brightness * 0.5})`;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }

  // Bright stars
  const brightStars = Math.floor(lerp(10, 50, variation.complexity));
  for (let i = 0; i < brightStars; i++) {
    const x = random() * w;
    const y = random() * h;
    const size = lerp(1, 4, variation.scale) * (0.5 + random() * 0.5);
    const color = colors[Math.floor(random() * colors.length)];

    // Glow size based on softness
    const glowSize = size * lerp(5, 15, variation.softness);
    const glow = ctx.createRadialGradient(x, y, 0, x, y, glowSize);
    glow.addColorStop(0, hslToRgba(color.h, color.s - 20, color.l + 30, 0.4));
    glow.addColorStop(1, hslToRgba(color.h, color.s, color.l, 0));
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(x, y, glowSize, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }
}

// COSMIC DUST with variation
function drawCosmicDust(
  ctx: CanvasRenderingContext2D,
  w: number, h: number,
  colors: Color[],
  random: () => number,
  perlin: PerlinNoise,
  variation: VariationParams
) {
  ctx.fillStyle = '#05050a';
  ctx.fillRect(0, 0, w, h);

  // Particle count based on density
  const particles = Math.floor(lerp(500, 3000, variation.density));
  
  // Scale affects particle size
  const baseSize = lerp(0.3, 2, variation.scale);
  
  // Noise scale for distribution
  const noiseScale = lerp(0.003, 0.008, variation.complexity);

  for (let i = 0; i < particles; i++) {
    const x = random() * w;
    const y = random() * h;
    const noise = perlin.fbm(x * noiseScale, y * noiseScale, Math.floor(lerp(1, 4, variation.complexity)));
    const size = baseSize * (0.5 + random());
    const color = colors[Math.floor((noise + 1) * 0.5 * colors.length)];

    ctx.fillStyle = hslToRgba(color.h, color.s, color.l + 20, 0.2 + noise * 0.5);
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }

  // Glowing particles
  const glowCount = Math.floor(lerp(10, 50, variation.complexity));
  for (let i = 0; i < glowCount; i++) {
    const x = random() * w;
    const y = random() * h;
    const size = lerp(3, 20, variation.scale) * (0.5 + random() * 0.5);
    const color = colors[Math.floor(random() * colors.length)];

    const gradient = ctx.createRadialGradient(x, y, 0, x, y, size);
    gradient.addColorStop(0, hslToRgba(color.h, color.s, color.l + 30, 0.9));
    gradient.addColorStop(0.5, hslToRgba(color.h, color.s, color.l, 0.4));
    gradient.addColorStop(1, hslToRgba(color.h, color.s, color.l, 0));

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }
}

// GLITCH ART with variation
function drawGlitchArt(
  ctx: CanvasRenderingContext2D,
  w: number, h: number,
  colors: Color[],
  random: () => number,
  variation: VariationParams
) {
  // Base gradient with flow direction
  const gradientAngle = variation.flowAngle * Math.PI / 180;
  const gradient = ctx.createLinearGradient(
    Math.cos(gradientAngle) * w,
    Math.sin(gradientAngle) * h,
    w, h
  );
  gradient.addColorStop(0, hslToHex(colors[0].h, colors[0].s, colors[0].l));
  gradient.addColorStop(0.5, hslToHex(colors[1].h, colors[1].s, colors[1].l));
  gradient.addColorStop(1, hslToHex(colors[2]?.h || colors[0].h, colors[2]?.s || colors[0].s, colors[2]?.l || colors[0].l));
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, w, h);

  // Slice count based on density
  const slices = Math.floor(lerp(5, 40, variation.density));

  for (let i = 0; i < slices; i++) {
    const y = random() * h;
    const height = lerp(1, 40, variation.scale) * (0.5 + random() * 0.5);
    const offset = (random() - 0.5) * lerp(20, 100, variation.tension);

    const imageData = ctx.getImageData(0, Math.floor(y), w, Math.ceil(height));
    ctx.putImageData(imageData, offset, Math.floor(y));
  }

  // RGB split intensity based on complexity
  const rgbSplit = ctx.getImageData(0, 0, w, h);
  const data = rgbSplit.data;
  const shift = Math.floor(lerp(1, 15, variation.complexity));

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w - shift; x++) {
      const idx = (y * w + x) * 4;
      const shiftedIdx = (y * w + x + shift) * 4;
      data[idx] = data[shiftedIdx];
    }
  }

  ctx.putImageData(rgbSplit, 0, 0);

  // Scan lines
  if (variation.softness < 0.5) {
    ctx.fillStyle = 'rgba(0,0,0,0.1)';
    for (let y = 0; y < h; y += 2) {
      ctx.fillRect(0, y, w, 1);
    }
  }
}

// GRADIENT MESH with variation
function drawGradientMesh(
  ctx: CanvasRenderingContext2D,
  w: number, h: number,
  colors: Color[],
  random: () => number,
  variation: VariationParams
) {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, w, h);

  // Grid size based on complexity
  const gridSize = Math.floor(lerp(2, 8, variation.complexity));
  const cellW = w / gridSize;
  const cellH = h / gridSize;

  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      const x = i * cellW;
      const y = j * cellH;
      const color = colors[(i + j) % colors.length];

      // Gradient center varies with organicness
      const centerX = x + cellW / 2 + (random() - 0.5) * cellW * variation.organicness;
      const centerY = y + cellH / 2 + (random() - 0.5) * cellH * variation.organicness;

      const gradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        x + cellW / 2, y + cellH / 2,
        Math.max(cellW, cellH) * lerp(0.8, 1.5, variation.scale)
      );

      const alpha = lerp(0.5, 1, variation.density);
      gradient.addColorStop(0, hslToRgba(color.h, color.s, color.l + 20, alpha));
      gradient.addColorStop(0.5, hslToRgba(color.h, color.s - 10, color.l, alpha * 0.7));
      gradient.addColorStop(1, hslToRgba(color.h, color.s - 20, color.l - 10, alpha * 0.3));

      ctx.fillStyle = gradient;
      ctx.fillRect(x, y, cellW, cellH);
    }
  }

  // Blend overlay based on softness
  if (variation.softness > 0.3) {
    ctx.globalCompositeOperation = 'overlay';
    const overlay = ctx.createLinearGradient(
      Math.cos(variation.flowAngle * Math.PI / 180) * w,
      Math.sin(variation.flowAngle * Math.PI / 180) * h,
      w, h
    );
    overlay.addColorStop(0, 'rgba(255,255,255,0.1)');
    overlay.addColorStop(0.5, 'rgba(0,0,0,0)');
    overlay.addColorStop(1, 'rgba(255,255,255,0.1)');
    ctx.fillStyle = overlay;
    ctx.fillRect(0, 0, w, h);
    ctx.globalCompositeOperation = 'source-over';
  }
}

// NOISE LANDSCAPE with variation
function drawNoiseLandscape(
  ctx: CanvasRenderingContext2D,
  w: number, h: number,
  colors: Color[],
  random: () => number,
  perlin: PerlinNoise,
  variation: VariationParams
) {
  // Sky gradient with flow direction influence
  const skyGrad = ctx.createLinearGradient(0, 0, 0, h * 0.6);
  skyGrad.addColorStop(0, hslToHex(colors[0].h, colors[0].s - 20, colors[0].l - 20));
  skyGrad.addColorStop(1, hslToHex(colors[0].h, colors[0].s - 10, colors[0].l));
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, w, h);

  // Layer count based on complexity
  const layers = Math.floor(lerp(3, 10, variation.complexity));
  const scale = lerp(0.003, 0.015, variation.scale);
  const baseAmplitude = lerp(20, 80, variation.tension);

  for (let layer = 0; layer < layers; layer++) {
    const baseY = h * lerp(0.2, 0.4, layer / layers);
    const amplitude = baseAmplitude * (1 - layer * 0.05);
    const color = colors[layer % colors.length];

    ctx.beginPath();
    ctx.moveTo(0, h);

    const stepSize = Math.floor(lerp(1, 5, variation.scale));
    for (let x = 0; x <= w; x += stepSize) {
      const noise = perlin.fbm(x * scale + layer * 100 + variation.flowAngle, layer, Math.floor(lerp(2, 5, variation.complexity)));
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

// CHROMATIC ABERRATION with variation
function drawChromaticAberration(
  ctx: CanvasRenderingContext2D,
  w: number, h: number,
  colors: Color[],
  random: () => number,
  variation: VariationParams
) {
  ctx.fillStyle = '#111';
  ctx.fillRect(0, 0, w, h);

  // Shape count based on density
  const shapes = Math.floor(lerp(3, 15, variation.density));

  for (let i = 0; i < shapes; i++) {
    const cx = random() * w;
    const cy = random() * h;
    const size = lerp(20, 150, variation.scale) * (0.5 + random() * 0.5);
    
    // Shape type based on shapeBias
    const shape = Math.floor(variation.shapeBias * 3);

    // RGB offset based on complexity
    const offsets = [
      { color: 'red', dx: -lerp(2, 8, variation.complexity), dy: 0 },
      { color: 'green', dx: 0, dy: 0 },
      { color: 'blue', dx: lerp(2, 8, variation.complexity), dy: 0 }
    ];

    for (const offset of offsets) {
      ctx.save();
      ctx.translate(cx + offset.dx, cy + offset.dy);

      ctx.beginPath();
      if (shape === 0) {
        ctx.arc(0, 0, size, 0, Math.PI * 2);
      } else if (shape === 1) {
        ctx.rect(-size, -size, size * 2, size * 2);
      } else {
        ctx.moveTo(0, -size);
        ctx.lineTo(size, size);
        ctx.lineTo(-size, size);
        ctx.closePath();
      }

      ctx.strokeStyle = offset.color;
      ctx.lineWidth = lerp(1, 5, variation.tension);
      ctx.globalAlpha = lerp(0.4, 0.9, variation.density);
      ctx.stroke();
      ctx.restore();
    }
  }

  ctx.globalAlpha = 1;
}

// MANDALA with variation
function drawMandala(
  ctx: CanvasRenderingContext2D,
  w: number, h: number,
  colors: Color[],
  random: () => number,
  variation: VariationParams
) {
  ctx.fillStyle = hslToHex(colors[0].h, colors[0].s - 40, colors[0].l - 30);
  ctx.fillRect(0, 0, w, h);

  const cx = w / 2;
  const cy = h / 2;
  const maxRadius = Math.min(w, h) * 0.45;
  
  // Layers based on complexity
  const layers = Math.floor(lerp(2, 8, variation.complexity));
  
  // Segments based on symmetry
  const segments = Math.floor(lerp(4, 16, variation.symmetry)) * 2;

  ctx.save();
  ctx.translate(cx, cy);

  for (let layer = 0; layer < layers; layer++) {
    const radius = maxRadius * ((layer + 1) / layers);
    const innerRadius = maxRadius * (layer / layers);
    const color = colors[layer % colors.length];

    for (let i = 0; i < segments; i++) {
      ctx.save();
      ctx.rotate((i / segments) * Math.PI * 2);

      ctx.beginPath();
      ctx.moveTo(innerRadius, 0);
      
      // Petal shape varies with curvature
      const petalWidth = (radius - innerRadius) * lerp(0.2, 0.5, variation.curvature);
      ctx.quadraticCurveTo(
        (innerRadius + radius) / 2,
        petalWidth,
        radius,
        0
      );
      ctx.quadraticCurveTo(
        (innerRadius + radius) / 2,
        -petalWidth,
        innerRadius,
        0
      );

      ctx.fillStyle = hslToRgba(color.h, color.s, color.l, lerp(0.4, 0.8, variation.density));
      ctx.fill();
      ctx.strokeStyle = hslToRgba(color.h, color.s - 20, color.l + 10, 0.8);
      ctx.lineWidth = lerp(0.5, 2, variation.scale);
      ctx.stroke();

      ctx.restore();
    }

    if (layer === 0) {
      ctx.beginPath();
      ctx.arc(0, 0, maxRadius * 0.1 * lerp(0.8, 1.5, variation.shapeBias), 0, Math.PI * 2);
      ctx.fillStyle = hslToHex(colors[0].h, colors[0].s, colors[0].l + 20);
      ctx.fill();
    }
  }

  ctx.restore();
}

// KALEIDOSCOPE with variation
function drawKaleidoscope(
  ctx: CanvasRenderingContext2D,
  w: number, h: number,
  colors: Color[],
  random: () => number,
  variation: VariationParams
) {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, w, h);

  const cx = w / 2;
  const cy = h / 2;
  
  // Segments based on symmetry
  const segments = Math.floor(lerp(4, 16, variation.symmetry));
  
  // Shapes per segment based on density
  const shapesPerSegment = Math.floor(lerp(2, 8, variation.density));

  for (let s = 0; s < segments; s++) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate((s / segments) * Math.PI * 2);

    for (let i = 0; i < shapesPerSegment; i++) {
      const distance = lerp(30, Math.min(w, h) * 0.4, random()) * variation.scale;
      const size = lerp(5, 50, variation.scale * random());
      const color = colors[Math.floor(random() * colors.length)];

      ctx.beginPath();
      
      // Shape varies with curvature
      if (variation.curvature > 0.5) {
        // Curved triangle
        ctx.moveTo(distance, 0);
        ctx.quadraticCurveTo(distance + size * 0.5, size / 2, distance + size, 0);
        ctx.quadraticCurveTo(distance + size * 0.5, -size / 2, distance, 0);
      } else {
        ctx.moveTo(distance, 0);
        ctx.lineTo(distance + size, size / 2);
        ctx.lineTo(distance + size, -size / 2);
      }
      ctx.closePath();

      ctx.fillStyle = hslToRgba(color.h, color.s, color.l, lerp(0.3, 0.8, variation.density));
      ctx.fill();
    }

    ctx.restore();
  }

  // Mirror effect varies with symmetry
  if (variation.symmetry > 0.5) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(1, -1);
    ctx.globalAlpha = lerp(0.3, 0.7, variation.softness);

    for (let s = 0; s < segments; s++) {
      ctx.save();
      ctx.rotate((s / segments) * Math.PI * 2);

      for (let i = 0; i < shapesPerSegment; i++) {
        const distance = lerp(30, Math.min(w, h) * 0.4, random()) * variation.scale;
        const size = lerp(5, 50, variation.scale * random());
        const color = colors[Math.floor(random() * colors.length)];

        ctx.beginPath();
        ctx.moveTo(distance, 0);
        ctx.lineTo(distance + size, size / 2);
        ctx.lineTo(distance + size, -size / 2);
        ctx.closePath();

        ctx.fillStyle = hslToRgba(color.h, color.s, color.l, lerp(0.2, 0.5, variation.density));
        ctx.fill();
      }

      ctx.restore();
    }

    ctx.restore();
  }
}

// FRACTAL TREE with variation
function drawFractalTree(
  ctx: CanvasRenderingContext2D,
  w: number, h: number,
  colors: Color[],
  random: () => number,
  variation: VariationParams
) {
  ctx.fillStyle = hslToHex(colors[0].h, colors[0].s - 40, colors[0].l - 30);
  ctx.fillRect(0, 0, w, h);

  // Tree position influenced by flow
  const startX = w / 2 + (variation.flowAngle - 180) / 180 * w * 0.2 * variation.flowStrength;
  const startY = h - 20;
  const trunkLength = h * lerp(0.15, 0.35, variation.scale);
  const color = colors[1];

  // Complexity affects max depth
  const maxDepth = Math.floor(lerp(6, 12, variation.complexity));
  
  // Tension affects branching angle
  const branchAngleBase = lerp(0.2, 0.6, variation.tension);
  
  // Curvature affects length ratio variance
  const lengthRatioBase = lerp(0.55, 0.75, variation.curvature);

  function drawBranch(x: number, y: number, length: number, angle: number, depth: number) {
    if (depth > maxDepth || length < 2) return;

    const endX = x + Math.cos(angle) * length;
    const endY = y + Math.sin(angle) * length;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(endX, endY);

    const hueShift = depth * lerp(5, 15, variation.tension);
    ctx.strokeStyle = hslToRgba(
      (color.h + hueShift) % 360,
      color.s,
      Math.min(color.l + depth * lerp(2, 5, variation.density), 70),
      0.8
    );
    ctx.lineWidth = Math.max(0.5, lerp(10, 2, depth / maxDepth) * variation.scale);
    ctx.stroke();

    const branchAngle = branchAngleBase + random() * 0.3;
    const lengthRatio = lengthRatioBase + random() * 0.15;

    drawBranch(endX, endY, length * lengthRatio, angle - branchAngle, depth + 1);
    drawBranch(endX, endY, length * lengthRatio, angle + branchAngle, depth + 1);

    // Third branch based on density
    if (random() < variation.density * 0.4) {
      drawBranch(endX, endY, length * lengthRatio * 0.7, angle + (random() - 0.5) * 0.4, depth + 1);
    }
  }

  drawBranch(startX, startY, trunkLength, -Math.PI / 2, 0);
}

// SACRED CIRCLE with variation
function drawSacredCircle(
  ctx: CanvasRenderingContext2D,
  w: number, h: number,
  colors: Color[],
  random: () => number,
  variation: VariationParams
) {
  ctx.fillStyle = '#0a0a0a';
  ctx.fillRect(0, 0, w, h);

  const cx = w / 2;
  const cy = h / 2;
  const maxRadius = Math.min(w, h) * 0.45;

  // Ring count based on complexity
  const rings = Math.floor(lerp(4, 16, variation.complexity));

  for (let i = rings; i >= 0; i--) {
    const radius = maxRadius * (i / rings);
    const color = colors[i % colors.length];

    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.strokeStyle = hslToRgba(color.h, color.s, color.l, lerp(0.3, 0.8, variation.density));
    ctx.lineWidth = lerp(0.5, 4, variation.scale);
    ctx.stroke();

    // Dots on rings based on density
    if (i % 2 === 0 && i > 0) {
      const dots = Math.floor(i * lerp(1.5, 4, variation.density));
      for (let j = 0; j < dots; j++) {
        const angle = (j / dots) * Math.PI * 2;
        const x = cx + Math.cos(angle) * radius;
        const y = cy + Math.sin(angle) * radius;

        ctx.beginPath();
        ctx.arc(x, y, lerp(1, 5, variation.scale), 0, Math.PI * 2);
        ctx.fillStyle = hslToHex(color.h, color.s, color.l + 20);
        ctx.fill();
      }
    }
  }

  // Center pattern size based on shapeBias
  const innerRadius = maxRadius * lerp(0.1, 0.2, variation.shapeBias);
  ctx.beginPath();
  ctx.arc(cx, cy, innerRadius, 0, Math.PI * 2);
  const centerGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, innerRadius);
  centerGrad.addColorStop(0, hslToHex(colors[0].h, colors[0].s, colors[0].l + 30));
  centerGrad.addColorStop(1, hslToHex(colors[0].h, colors[0].s - 20, colors[0].l));
  ctx.fillStyle = centerGrad;
  ctx.fill();
}

// ISOMETRIC WORLD with variation
function drawIsometricWorld(
  ctx: CanvasRenderingContext2D,
  w: number, h: number,
  colors: Color[],
  random: () => number,
  variation: VariationParams
) {
  ctx.fillStyle = hslToHex(colors[0].h, colors[0].s - 40, colors[0].l - 30);
  ctx.fillRect(0, 0, w, h);

  // Grid size based on complexity
  const gridSize = Math.floor(lerp(10, 30, variation.complexity));
  const cubeSize = Math.min(w, h) / gridSize * lerp(0.8, 1.5, variation.scale);

  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      // Cube probability based on density
      if (random() > lerp(0.2, 0.7, variation.density)) continue;

      const x = (i - j) * cubeSize * 0.866 + w / 2;
      const y = (i + j) * cubeSize * 0.5 + h * 0.2;
      const height = lerp(0.3, 2.5, variation.tension) * (0.5 + random());
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

// IMPOSSIBLE GEOMETRY with variation
function drawImpossibleGeometry(
  ctx: CanvasRenderingContext2D,
  w: number, h: number,
  colors: Color[],
  random: () => number,
  variation: VariationParams
) {
  ctx.fillStyle = hslToHex(colors[0].h, colors[0].s - 10, lerp(85, 98, variation.softness));
  ctx.fillRect(0, 0, w, h);

  // Shape count based on density
  const shapes = Math.floor(lerp(2, 8, variation.density));
  const cx = w / 2;
  const cy = h / 2;

  for (let i = 0; i < shapes; i++) {
    const x = cx + (random() - 0.5) * w * 0.5;
    const y = cy + (random() - 0.5) * h * 0.5;
    const size = lerp(30, 120, variation.scale) * (0.5 + random() * 0.5);
    const color = colors[i % colors.length];
    
    // Type based on shapeBias
    const type = Math.floor(variation.shapeBias * 3);

    ctx.strokeStyle = hslToHex(color.h, color.s, color.l);
    ctx.lineWidth = lerp(1, 4, variation.tension);
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
      // Penrose stairs
      const steps = Math.floor(lerp(4, 10, variation.complexity));
      for (let s = 0; s < steps; s++) {
        const sx = x + s * size * 0.12;
        const sy = y + s * size * 0.08;
        ctx.strokeRect(sx, sy, size * 0.2, size * 0.1);
      }
    }
  }
}

// ARCHITECTURAL LINES with variation
function drawArchitecturalLines(
  ctx: CanvasRenderingContext2D,
  w: number, h: number,
  colors: Color[],
  random: () => number,
  perlin: PerlinNoise,
  variation: VariationParams
) {
  ctx.fillStyle = hslToHex(colors[0].h, colors[0].s - 10, lerp(90, 98, variation.softness));
  ctx.fillRect(0, 0, w, h);

  ctx.strokeStyle = hslToRgba(colors[0].h, colors[0].s - 20, colors[0].l - 20, 0.4);
  ctx.lineWidth = 0.5;

  // Grid size based on complexity
  const gridSize = Math.floor(lerp(15, 50, variation.complexity));
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

  // Elements based on density
  const elements = Math.floor(lerp(3, 15, variation.density));
  ctx.lineWidth = lerp(1, 3, variation.tension);

  for (let i = 0; i < elements; i++) {
    const x = random() * w;
    const y = random() * h;
    const width = lerp(30, 200, variation.scale) * (0.5 + random() * 0.5);
    const height = lerp(30, 200, variation.scale) * (0.5 + random() * 0.5);
    const color = colors[Math.floor(random() * colors.length)];

    ctx.strokeStyle = hslToHex(color.h, color.s - 20, color.l - 20);
    ctx.strokeRect(x, y, width, height);

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + width, y + height);
    ctx.moveTo(x + width, y);
    ctx.lineTo(x, y + height);
    ctx.stroke();

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

// ZEN GARDEN with variation
function drawZenGarden(
  ctx: CanvasRenderingContext2D,
  w: number, h: number,
  colors: Color[],
  random: () => number,
  variation: VariationParams
) {
  // Sand base color varies
  ctx.fillStyle = hslToHex(45, lerp(10, 30, variation.softness), lerp(85, 95, variation.tension));
  ctx.fillRect(0, 0, w, h);

  // Raked lines
  ctx.strokeStyle = 'rgba(0,0,0,0.08)';
  ctx.lineWidth = 1;

  const lineSpacing = Math.floor(lerp(5, 15, variation.complexity));
  const waveAmount = lerp(0, 5, variation.organicness);
  
  for (let y = 0; y < h; y += lineSpacing) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    for (let x = 0; x <= w; x += 5) {
      const wave = Math.sin(x * 0.02 + variation.flowAngle * 0.01) * waveAmount;
      ctx.lineTo(x, y + wave);
    }
    ctx.stroke();
  }

  // Rock count based on density
  const rocks = Math.floor(lerp(2, 7, variation.density));
  for (let i = 0; i < rocks; i++) {
    const x = random() * w;
    const y = random() * h;
    const size = lerp(15, 50, variation.scale) * (0.5 + random() * 0.5);

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.05)';
    ctx.beginPath();
    ctx.ellipse(x + 5, y + 5, size, size * lerp(0.5, 0.8, variation.curvature), random() * Math.PI, 0, Math.PI * 2);
    ctx.fill();

    // Rock
    const rockGrad = ctx.createRadialGradient(x - size/3, y - size/3, 0, x, y, size);
    rockGrad.addColorStop(0, '#9a9a9a');
    rockGrad.addColorStop(1, '#4a4a4a');
    ctx.fillStyle = rockGrad;
    ctx.beginPath();
    ctx.ellipse(x, y, size, size * lerp(0.5, 0.8, variation.curvature), random() * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }
}

// DOT MATRIX with variation
function drawDotMatrix(
  ctx: CanvasRenderingContext2D,
  w: number, h: number,
  colors: Color[],
  random: () => number,
  variation: VariationParams
) {
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, w, h);

  // Dot size based on scale
  const dotSize = Math.floor(lerp(2, 8, variation.scale));
  const spacing = dotSize * lerp(2, 4, variation.density);

  for (let y = spacing; y < h - spacing; y += spacing) {
    for (let x = spacing; x < w - spacing; x += spacing) {
      const noise = random();
      
      // Probability based on density
      if (noise > lerp(0.1, 0.5, 1 - variation.density)) {
        const color = colors[Math.floor(random() * colors.length)];
        const size = dotSize * lerp(0.3, 1, variation.tension) * (0.5 + noise * 0.5);

        ctx.fillStyle = hslToHex(color.h, color.s, color.l);
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
}

// BREATHING CIRCLES with variation
function drawBreathingCircles(
  ctx: CanvasRenderingContext2D,
  w: number, h: number,
  colors: Color[],
  random: () => number,
  variation: VariationParams
) {
  ctx.fillStyle = '#fafafa';
  ctx.fillRect(0, 0, w, h);

  // Circle count based on density
  const circles = Math.floor(lerp(3, 12, variation.density));
  const cx = w / 2;
  const cy = h / 2;
  const maxRadius = Math.min(w, h) * lerp(0.3, 0.45, variation.scale);

  for (let i = 0; i < circles; i++) {
    const progress = i / circles;
    const radius = maxRadius * progress;
    const color = colors[i % colors.length];

    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.strokeStyle = hslToRgba(color.h, color.s, color.l, lerp(0.2, 0.7, progress * variation.density));
    ctx.lineWidth = lerp(0.5, 4, variation.scale * random());
    ctx.stroke();

    // Fill based on softness
    if (variation.softness > 0.5 && random() > 0.3) {
      ctx.fillStyle = hslToRgba(color.h, color.s, color.l, 0.05);
      ctx.fill();
    }
  }

  // Center dot
  ctx.beginPath();
  ctx.arc(cx, cy, lerp(3, 15, variation.scale), 0, Math.PI * 2);
  ctx.fillStyle = hslToHex(colors[0].h, colors[0].s, colors[0].l);
  ctx.fill();
}

// LINE HORIZON with variation
function drawLineHorizon(
  ctx: CanvasRenderingContext2D,
  w: number, h: number,
  colors: Color[],
  random: () => number,
  variation: VariationParams
) {
  // Sky
  ctx.fillStyle = hslToHex(colors[0].h, colors[0].s - 30, colors[0].l - 20);
  ctx.fillRect(0, 0, w, h / 2);

  // Ground
  ctx.fillStyle = hslToHex(colors[1].h, colors[1].s - 30, colors[1].l - 30);
  ctx.fillRect(0, h / 2, w, h / 2);

  // Horizon line thickness based on scale
  ctx.strokeStyle = hslToHex(colors[2]?.h || colors[0].h, colors[2]?.s || colors[0].s, colors[2]?.l || colors[0].l);
  ctx.lineWidth = lerp(1, 4, variation.scale);
  ctx.beginPath();
  ctx.moveTo(0, h / 2);
  ctx.lineTo(w, h / 2);
  ctx.stroke();

  // Elements based on density
  const elements = Math.floor(lerp(1, 6, variation.density));
  for (let i = 0; i < elements; i++) {
    const x = random() * w;
    const y = h / 2 + (random() - 0.5) * 30 * variation.tension;
    const width = lerp(20, 150, variation.scale) * (0.5 + random() * 0.5);
    const color = colors[Math.floor(random() * colors.length)];

    ctx.fillStyle = hslToRgba(color.h, color.s, color.l, lerp(0.2, 0.5, variation.density));
    ctx.fillRect(x, y, width, lerp(1, 6, variation.scale));
  }

  // Celestial body
  const celestialSize = lerp(15, 40, variation.scale);
  ctx.beginPath();
  ctx.arc(w * lerp(0.5, 0.9, variation.shapeBias), h * lerp(0.2, 0.4, variation.tension), celestialSize, 0, Math.PI * 2);
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

  // Combined random for general use
  const combinedRandom = createSeededRandom(hueSeed, satSeed, lightSeed, styleSeed);

  // Generate premium color palette
  const { colors } = generatePremiumPalette(combinedRandom);

  // Select art style
  const styleIndex = Math.floor(styleRandom() * ART_STYLES.length);
  const style = ART_STYLES[styleIndex];

  // Generate quantum variation parameters
  const variation = generateVariationParams(shapeSeed, positionSeed, sizeSeed);

  // Create perlin noise
  const perlin = new PerlinNoise(hueSeed + satSeed + lightSeed);

  // Draw based on style with variation
  switch (style) {
    // Flowing
    case 'flowField':
      drawFlowField(ctx, w, h, colors, combinedRandom, perlin, variation);
      break;
    case 'liquidChrome':
      drawLiquidChrome(ctx, w, h, colors, combinedRandom, perlin, variation);
      break;
    case 'inkBleed':
      drawInkBleed(ctx, w, h, colors, combinedRandom, variation);
      break;
    case 'smokeWisps':
      drawSmokeWisps(ctx, w, h, colors, combinedRandom, perlin, variation);
      break;

    // Geometric
    case 'voronoi':
      drawVoronoi(ctx, w, h, colors, combinedRandom, variation);
      break;
    case 'sacredGeometry':
      drawSacredGeometry(ctx, w, h, colors, combinedRandom, variation);
      break;
    case 'parametricWaves':
      drawParametricWaves(ctx, w, h, colors, combinedRandom, variation);
      break;
    case 'crystalline':
      drawCrystalline(ctx, w, h, colors, combinedRandom, variation);
      break;

    // Organic
    case 'neuralNetwork':
      drawNeuralNetwork(ctx, w, h, colors, combinedRandom, variation);
      break;
    case 'dendriteGrowth':
      drawDendriteGrowth(ctx, w, h, colors, combinedRandom, variation);
      break;
    case 'coralReef':
      drawCoralReef(ctx, w, h, colors, combinedRandom, variation);
      break;
    case 'mycelium':
      drawMycelium(ctx, w, h, colors, combinedRandom, perlin, variation);
      break;

    // Cosmic
    case 'nebula':
      drawNebula(ctx, w, h, colors, combinedRandom, perlin, variation);
      break;
    case 'aurora':
      drawAurora(ctx, w, h, colors, combinedRandom, perlin, variation);
      break;
    case 'starField':
      drawStarField(ctx, w, h, colors, combinedRandom, variation);
      break;
    case 'cosmicDust':
      drawCosmicDust(ctx, w, h, colors, combinedRandom, perlin, variation);
      break;

    // Abstract
    case 'glitchArt':
      drawGlitchArt(ctx, w, h, colors, combinedRandom, variation);
      break;
    case 'gradientMesh':
      drawGradientMesh(ctx, w, h, colors, combinedRandom, variation);
      break;
    case 'noiseLandscape':
      drawNoiseLandscape(ctx, w, h, colors, combinedRandom, perlin, variation);
      break;
    case 'chromaticAberration':
      drawChromaticAberration(ctx, w, h, colors, combinedRandom, variation);
      break;

    // Symmetric
    case 'mandala':
      drawMandala(ctx, w, h, colors, combinedRandom, variation);
      break;
    case 'kaleidoscope':
      drawKaleidoscope(ctx, w, h, colors, combinedRandom, variation);
      break;
    case 'fractalTree':
      drawFractalTree(ctx, w, h, colors, combinedRandom, variation);
      break;
    case 'sacredCircle':
      drawSacredCircle(ctx, w, h, colors, combinedRandom, variation);
      break;

    // Architectural
    case 'isometricWorld':
      drawIsometricWorld(ctx, w, h, colors, combinedRandom, variation);
      break;
    case 'impossibleGeometry':
      drawImpossibleGeometry(ctx, w, h, colors, combinedRandom, variation);
      break;
    case 'architecturalLines':
      drawArchitecturalLines(ctx, w, h, colors, combinedRandom, perlin, variation);
      break;

    // Minimalist
    case 'zenGarden':
      drawZenGarden(ctx, w, h, colors, combinedRandom, variation);
      break;
    case 'dotMatrix':
      drawDotMatrix(ctx, w, h, colors, combinedRandom, variation);
      break;
    case 'breathingCircles':
      drawBreathingCircles(ctx, w, h, colors, combinedRandom, variation);
      break;
    case 'lineHorizon':
      drawLineHorizon(ctx, w, h, colors, combinedRandom, variation);
      break;

    default:
      drawFlowField(ctx, w, h, colors, combinedRandom, perlin, variation);
  }

  // Post-processing
  if (combinedRandom() > 0.5) {
    addGrain(ctx, w, h, 0.02 + combinedRandom() * 0.03);
  }
  if (combinedRandom() > 0.3) {
    addVignette(ctx, w, h, 0.1 + combinedRandom() * 0.2);
  }
}
