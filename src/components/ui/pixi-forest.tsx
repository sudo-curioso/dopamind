'use client'

import { useEffect, useRef } from 'react'

export interface TreeData {
  id: string
  tree_type: string
  status: 'alive' | 'dead'
  grown_at?: string
}

interface PixiForestProps {
  trees: TreeData[]
  width?: number
  height?: number
}

// ─── Seeded deterministic RNG ───────────────────────────────────────────────
function mkRng(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (Math.imul(1664525, s) + 1013904223) >>> 0
    return s / 4294967296
  }
}

// ─── Time-based sky palette ──────────────────────────────────────────────────
function getSkyPalette(h: number): [number, number, number] {
  if (h >= 5  && h < 7)  return [0xC05830, 0xE8845A, 0xFFB87A] // dawn
  if (h >= 7  && h < 11) return [0x3A8ED4, 0x6CBCE4, 0xA8DCC8] // morning
  if (h >= 11 && h < 16) return [0x1E6FA8, 0x3A8ED4, 0x9DD4C0] // day
  if (h >= 16 && h < 19) return [0xA03010, 0xD05030, 0xF08850] // dusk
  if (h >= 19 && h < 22) return [0x060E08, 0x0A1410, 0x0E1C10] // evening — warm dark green
  return [0x040808, 0x060C08, 0x080E08]                          // night — forest dark
}

// ─── TREE DRAWING ENGINE ─────────────────────────────────────────────────────
// All coordinates are multiplied by sc (scale).
// sc ≈ 2.0–3.5 for proper visibility in the forest canvas.
function renderTree(G: any, type: string, sc: number) {
  const s = sc

  // Ground shadow — oval under every tree
  G.beginFill(0x1A3D0A, 0.22)
  G.drawEllipse(2 * s, 1 * s, 18 * s, 5 * s)
  G.endFill()

  // ── DEAD TREE ──────────────────────────────────────────────────────────────
  if (type === 'dead') {
    G.beginFill(0x6B6460)
    G.drawPolygon([-3.5*s,0, 3.5*s,0, 2.8*s,-28*s, -2.8*s,-28*s])
    G.endFill()
    G.beginFill(0x4A4240)
    G.drawPolygon([3.5*s,0, 7*s,3*s, 6*s,-24*s, 2.8*s,-28*s])
    G.endFill()
    G.beginFill(0x6B6460)
    G.drawPolygon([0,-18*s, -14*s,-27*s, -12*s,-24*s, 0,-16*s])
    G.endFill()
    G.beginFill(0x4A4240)
    G.drawPolygon([0,-13*s, 14*s,-22*s, 12*s,-20*s, 0,-11*s])
    G.endFill()
    G.beginFill(0x38302E)
    G.drawPolygon([0,-9*s, 9*s,-15*s, 8*s,-13*s, 0,-7*s])
    G.endFill()
    return
  }

  // ── SPROUT (5 min) ──────────────────────────────────────────────────────────
  if (type === 'sprout') {
    // stem
    G.beginFill(0x7A3010)
    G.drawPolygon([-2*s,0, 2*s,0, 1.5*s,-12*s, -1.5*s,-12*s])
    G.endFill()
    G.beginFill(0x5A2008)
    G.drawPolygon([2*s,0, 5*s,2*s, 4.5*s,-10*s, 1.5*s,-12*s])
    G.endFill()
    // single cone — bright top face
    G.beginFill(0x86EFAC)
    G.drawPolygon([0,-26*s, -12*s,-10*s, 12*s,-10*s])
    G.endFill()
    // left face (mid green)
    G.beginFill(0x4ADE80)
    G.drawPolygon([0,-26*s, -12*s,-10*s, -10*s,-8*s, 0,-22*s])
    G.endFill()
    // right face (darker)
    G.beginFill(0x22C55E)
    G.drawPolygon([0,-26*s, 12*s,-10*s, 10*s,-8*s, 0,-22*s])
    G.endFill()
    G.beginFill(0x16A34A)
    G.drawEllipse(0,-10*s, 12*s, 4*s)
    G.endFill()
    return
  }

  // ── BABY (15 min) ──────────────────────────────────────────────────────────
  if (type === 'baby') {
    G.beginFill(0x8B4513)
    G.drawPolygon([-3*s,0, 3*s,0, 2.5*s,-20*s, -2.5*s,-20*s])
    G.endFill()
    G.beginFill(0x6B3210)
    G.drawPolygon([3*s,0, 6.5*s,2.5*s, 6*s,-17*s, 2.5*s,-20*s])
    G.endFill()
    // lower canopy
    G.beginFill(0x15803D)
    G.drawEllipse(4*s,-26*s, 20*s, 13*s)
    G.endFill()
    G.beginFill(0x16A34A)
    G.drawEllipse(0,-26*s, 20*s, 13*s)
    G.endFill()
    G.beginFill(0x22C55E)
    G.drawEllipse(-3*s,-29*s, 15*s, 10*s)
    G.endFill()
    G.beginFill(0x4ADE80)
    G.drawEllipse(-5*s,-31*s, 8*s, 6*s)
    G.endFill()
    // upper canopy
    G.beginFill(0x14532D)
    G.drawEllipse(3.5*s,-39*s, 15*s, 10*s)
    G.endFill()
    G.beginFill(0x22C55E)
    G.drawEllipse(0,-39*s, 15*s, 10*s)
    G.endFill()
    G.beginFill(0x4ADE80)
    G.drawEllipse(-2.5*s,-42*s, 8*s, 6*s)
    G.endFill()
    return
  }

  // ── HALF (25 min) ──────────────────────────────────────────────────────────
  if (type === 'half') {
    G.beginFill(0x8B4513)
    G.drawPolygon([-4*s,0, 4*s,0, 3.5*s,-26*s, -3.5*s,-26*s])
    G.endFill()
    G.beginFill(0x6B3210)
    G.drawPolygon([4*s,0, 8.5*s,3*s, 7.5*s,-23*s, 3.5*s,-26*s])
    G.endFill()
    G.beginFill(0x0F3D20)
    G.drawEllipse(5.5*s,-33*s, 26*s, 17*s)
    G.endFill()
    G.beginFill(0x14532D)
    G.drawEllipse(0,-33*s, 26*s, 17*s)
    G.endFill()
    G.beginFill(0x16A34A)
    G.drawEllipse(-3*s,-37*s, 20*s, 13*s)
    G.endFill()
    G.beginFill(0x22C55E)
    G.drawEllipse(-6*s,-40*s, 11*s, 8*s)
    G.endFill()
    G.beginFill(0x0F3D20)
    G.drawEllipse(4.5*s,-48*s, 22*s, 14*s)
    G.endFill()
    G.beginFill(0x16A34A)
    G.drawEllipse(0,-48*s, 22*s, 14*s)
    G.endFill()
    G.beginFill(0x22C55E)
    G.drawEllipse(-3*s,-52*s, 14*s, 10*s)
    G.endFill()
    G.beginFill(0x15803D)
    G.drawEllipse(3.5*s,-62*s, 16*s, 11*s)
    G.endFill()
    G.beginFill(0x4ADE80)
    G.drawEllipse(0,-62*s, 16*s, 11*s)
    G.endFill()
    G.beginFill(0x86EFAC)
    G.drawEllipse(-2.5*s,-65*s, 8*s, 6*s)
    G.endFill()
    return
  }

  // ── FLOWERING (30 min) ────────────────────────────────────────────────────
  if (type === 'flowering') {
    G.beginFill(0x7A3814)
    G.drawPolygon([-4*s,0, 4*s,0, 3.5*s,-28*s, -3.5*s,-28*s])
    G.endFill()
    G.beginFill(0x5A2808)
    G.drawPolygon([4*s,0, 8.5*s,3*s, 7.5*s,-24*s, 3.5*s,-28*s])
    G.endFill()
    // bottom pink layer
    G.beginFill(0xE8409A)
    G.drawEllipse(5.5*s,-35*s, 28*s, 18*s)
    G.endFill()
    G.beginFill(0xF9A8D4)
    G.drawEllipse(0,-35*s, 28*s, 18*s)
    G.endFill()
    G.beginFill(0xFBCFE8)
    G.drawEllipse(-3.5*s,-39*s, 20*s, 13*s)
    G.endFill()
    G.beginFill(0xE8409A)
    G.drawEllipse(4.5*s,-51*s, 23*s, 15*s)
    G.endFill()
    G.beginFill(0xF472B6)
    G.drawEllipse(0,-51*s, 23*s, 15*s)
    G.endFill()
    G.beginFill(0xFBCFE8)
    G.drawEllipse(-2.5*s,-55*s, 15*s, 10*s)
    G.endFill()
    G.beginFill(0xE8409A)
    G.drawEllipse(3*s,-63*s, 15*s, 10*s)
    G.endFill()
    G.beginFill(0xFBCFE8)
    G.drawEllipse(0,-63*s, 15*s, 10*s)
    G.endFill()
    // white + yellow flower dots
    const rngF = mkRng(88)
    for (let i = 0; i < 12; i++) {
      const fx = (rngF()-0.5)*38*s
      const fy = (-30-rngF()*35)*s
      G.beginFill(0xFFFFFF, 0.95); G.drawCircle(fx, fy, 2.8*s); G.endFill()
      G.beginFill(0xFEF9C3, 1);    G.drawCircle(fx, fy, 1.2*s); G.endFill()
    }
    return
  }

  // ── LARGE / PINE (45 min) ────────────────────────────────────────────────
  if (type === 'large') {
    // thick trunk
    G.beginFill(0x6B3210)
    G.drawPolygon([-5*s,0, 5*s,0, 4*s,-35*s, -4*s,-35*s])
    G.endFill()
    G.beginFill(0x4A2208)
    G.drawPolygon([5*s,0, 10.5*s,4*s, 9.5*s,-31*s, 4*s,-35*s])
    G.endFill()
    // 6 pine tiers, bottom → top, getting lighter
    const layers = [
      { w:34, top:-28, peak:-48, c:0x0A2918, cl:0x072010, cr:0x051808 },
      { w:29, top:-41, peak:-61, c:0x0F3D20, cl:0x0A2918, cr:0x072010 },
      { w:23, top:-54, peak:-73, c:0x14532D, cl:0x0F3D20, cr:0x0A2918 },
      { w:17, top:-66, peak:-84, c:0x16A34A, cl:0x14532D, cr:0x0F3D20 },
      { w:11, top:-77, peak:-94, c:0x22C55E, cl:0x16A34A, cr:0x14532D },
      { w:6,  top:-87, peak:-100, c:0x4ADE80, cl:0x22C55E, cr:0x16A34A },
    ]
    for (const l of layers) {
      const w = l.w * s
      G.beginFill(l.c)
      G.drawPolygon([0,l.peak*s, -w,l.top*s, w,l.top*s])
      G.endFill()
      G.beginFill(l.cl)
      G.drawPolygon([0,l.peak*s, -w,l.top*s, -w+3*s,(l.top+5)*s, 0,(l.peak+5)*s])
      G.endFill()
      G.beginFill(l.cr)
      G.drawPolygon([0,l.peak*s, w,l.top*s, w+5*s,(l.top+6)*s, 0,(l.peak+6)*s])
      G.endFill()
      G.beginFill(l.cr)
      G.drawEllipse(s,(l.top+1)*s, w*0.92, w*0.24)
      G.endFill()
    }
    return
  }

  // ── FULL / LUSH (60 min) ─────────────────────────────────────────────────
  if (type === 'full') {
    // thick trunk with roots
    G.beginFill(0x6B3210)
    G.drawPolygon([-6*s,0, 6*s,0, 5*s,-37*s, -5*s,-37*s])
    G.endFill()
    G.beginFill(0x4A2208)
    G.drawPolygon([6*s,0, 12*s,4.5*s, 11*s,-33*s, 5*s,-37*s])
    G.endFill()
    // root flares
    G.beginFill(0x8B5A2E, 0.6)
    G.drawPolygon([-6*s,0, -11*s,5*s, -9*s,2*s, -6*s,-4*s])
    G.endFill()
    G.beginFill(0x8B5A2E, 0.6)
    G.drawPolygon([6*s,0, 11*s,4*s, 9*s,1*s, 6*s,-3*s])
    G.endFill()
    // 6 lush canopy blobs
    const blobs = [
      { bw:38, bh:24, oy:-42, tc:0x0A2918, sc2:0x072010, dc:0x051808 },
      { bw:34, bh:21, oy:-59, tc:0x0F3D20, sc2:0x0A2918, dc:0x072010 },
      { bw:27, bh:18, oy:-74, tc:0x14532D, sc2:0x0F3D20, dc:0x0A2918 },
      { bw:20, bh:14, oy:-87, tc:0x16A34A, sc2:0x14532D, dc:0x0F3D20 },
      { bw:13, bh:10, oy:-98, tc:0x22C55E, sc2:0x16A34A, dc:0x14532D },
      { bw:8,  bh:6,  oy:-107, tc:0x4ADE80, sc2:0x22C55E, dc:0x16A34A },
    ]
    for (const b of blobs) {
      const bws = b.bw*s, bhs = b.bh*s, bys = b.oy*s
      // side shadow
      G.beginFill(b.dc, 0.6)
      G.drawEllipse(5*s, bys+bhs*0.55, bws*0.88, bhs*0.38)
      G.endFill()
      // dark face
      G.beginFill(b.sc2)
      G.drawEllipse(5*s, bys, bws, bhs)
      G.endFill()
      // top face
      G.beginFill(b.tc)
      G.drawEllipse(0, bys, bws, bhs)
      G.endFill()
      // highlight shimmer
      G.beginFill(0xFFFFFF, 0.1)
      G.drawEllipse(-bws*0.22, bys-bhs*0.22, bws*0.38, bhs*0.3)
      G.endFill()
    }
    // golden flower accent dots
    const rngFl = mkRng(55)
    for (let i = 0; i < 14; i++) {
      const fx = (rngFl()-0.5)*52*s
      const fy = (-36-rngFl()*68)*s
      const inB = (fx/(28*s))**2 + ((fy+72*s)/(38*s))**2 < 1.2
      if (!inB) continue
      G.beginFill(0xFDE68A, 0.95); G.drawCircle(fx, fy, 3.4*s); G.endFill()
      G.beginFill(0xFBBF24, 0.82); G.drawCircle(fx, fy, 1.5*s); G.endFill()
    }
    return
  }
}

// ─── GRASS TUFT ──────────────────────────────────────────────────────────────
function renderGrassTuft(G: any, sc: number) {
  const s = sc
  for (const [x1,y1,x2,y2,x3,y3] of [
    [-4,0,-2,-9,0,0],[0,0,1,-10,3,0],[3,0,6,-8,8,0],
    [-6,0,-5,-7,-3,0],[5,0,7,-9,9,0],
  ]) {
    G.beginFill(0x4ADE80)
    G.drawPolygon([x1*s,y1*s, x2*s,y2*s, x3*s,y3*s])
    G.endFill()
  }
}

// ─── MUSHROOM ────────────────────────────────────────────────────────────────
function renderMushroom(G: any, sc: number, type: 'red'|'small') {
  const s = sc
  if (type === 'red') {
    G.beginFill(0xF5F0E0)
    G.drawPolygon([-3*s,0, 3*s,0, 2.5*s,-9*s, -2.5*s,-9*s])
    G.endFill()
    G.beginFill(0xCC2020)
    G.drawEllipse(3.5*s,-13*s, 15*s, 9*s)
    G.endFill()
    G.beginFill(0xEF4444)
    G.drawEllipse(0,-13*s, 15*s, 9*s)
    G.endFill()
    G.beginFill(0xCC2020)
    G.drawEllipse(0,-9*s, 15*s, 4.5*s)
    G.endFill()
    for (const [dx,dy] of [[-4,-16],[3,-18],[7,-13],[-1,-10]]) {
      G.beginFill(0xFFFFFF, 0.88); G.drawCircle(dx*s,dy*s, 2.2*s); G.endFill()
    }
  } else {
    G.beginFill(0xE5E7EB)
    G.drawPolygon([-2*s,0, 2*s,0, 1.5*s,-6*s, -1.5*s,-6*s])
    G.endFill()
    G.beginFill(0xC2410C)
    G.drawEllipse(0,-8*s, 9*s, 6*s)
    G.endFill()
    G.beginFill(0xC2410C)
    G.drawEllipse(0,-6*s, 9*s, 3.5*s)
    G.endFill()
  }
}

// ─── BUSH ────────────────────────────────────────────────────────────────────
function renderBush(G: any, sc: number) {
  const s = sc
  // shadow
  G.beginFill(0x1A3D0A, 0.18); G.drawEllipse(2*s, 2*s, 18*s, 6*s); G.endFill()
  // dark side blob
  G.beginFill(0x1A6B30); G.drawEllipse(3.5*s, 1*s, 20*s, 14*s); G.endFill()
  // main round body
  G.beginFill(0x2D8A44); G.drawEllipse(0, 0, 20*s, 14*s); G.endFill()
  // top highlight blob
  G.beginFill(0x3DAA55); G.drawEllipse(-2*s, -2.5*s, 14*s, 10*s); G.endFill()
  G.beginFill(0x5DC96A, 0.42); G.drawEllipse(-4*s, -4*s, 7*s, 5.5*s); G.endFill()
  // white daisy flowers
  for (const [dx, dy] of [[-5,-8],[2,-10],[8,-5],[-1,-6],[5,-9]]) {
    for (let p = 0; p < 5; p++) {
      const ang = (p/5)*Math.PI*2
      G.beginFill(0xFFFFFF, 0.92)
      G.drawEllipse((dx+Math.cos(ang)*2.4)*s,(dy+Math.sin(ang)*2.4)*s,2*s,1.3*s)
      G.endFill()
    }
    G.beginFill(0xFEF08A); G.drawCircle(dx*s,dy*s,1.5*s); G.endFill()
  }
}

// ─── SPIRIT CREATURE ─────────────────────────────────────────────────────────
function renderSpirit(G: any, sc: number) {
  const s = sc
  // ground shadow
  G.beginFill(0x1A3D0A, 0.16); G.drawEllipse(0, 11*s, 10*s, 3.5*s); G.endFill()
  // body dark side
  G.beginFill(0x2E6B2C, 0.28); G.drawEllipse(1.5*s, 1.5*s, 12.5*s, 16*s); G.endFill()
  // main body
  G.beginFill(0x3D8B3A); G.drawEllipse(0, 0, 12.5*s, 16*s); G.endFill()
  // wavy ghost skirt bottom
  G.beginFill(0x3D8B3A)
  G.drawPolygon([
    -6*s,7*s, -4.5*s,12*s, -1.5*s,8.5*s, 1.5*s,12.5*s,
    4.5*s,8.5*s, 6*s,11.5*s, 6*s,7*s
  ])
  G.endFill()
  // top shimmer highlight
  G.beginFill(0x7ACC70, 0.46); G.drawEllipse(-1.5*s, -4*s, 5*s, 4*s); G.endFill()
  // eyes white
  G.beginFill(0xFFFFFF, 0.94)
  G.drawEllipse(-3.5*s,-1.5*s,3*s,3.8*s); G.drawEllipse(3.5*s,-1.5*s,3*s,3.8*s)
  G.endFill()
  // pupils
  G.beginFill(0x162414)
  G.drawCircle(-3.5*s,-1*s,1.4*s); G.drawCircle(3.5*s,-1*s,1.4*s)
  G.endFill()
  // eye highlights
  G.beginFill(0xFFFFFF, 0.78)
  G.drawCircle(-2.8*s,-1.8*s,0.6*s); G.drawCircle(4.2*s,-1.8*s,0.6*s)
  G.endFill()
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
export default function PixiForest({ trees, width = 480, height = 420 }: PixiForestProps) {
  const mountRef = useRef<HTMLDivElement>(null)
  const appRef   = useRef<any>(null)

  useEffect(() => {
    if (!mountRef.current) return
    let destroyed = false

    async function boot() {
      try {
        const PIXI = await import('pixi.js')
        if (destroyed || !mountRef.current) return

        if (appRef.current) {
          try { appRef.current.destroy(true) } catch {}
          appRef.current = null
        }
        mountRef.current.innerHTML = ''

        const hour    = new Date().getHours()
        const isNight = hour < 7 || hour >= 19
        const isDusk  = hour >= 16 && hour < 19
        const isDawn  = hour >= 5  && hour < 7
        const [skyTop, skyMid, skyBot] = getSkyPalette(hour)

        const app = new PIXI.Application({
          width, height,
          backgroundColor: skyTop,
          antialias: true,
          resolution: Math.min(window.devicePixelRatio || 1, 2),
          autoDensity: true,
        })
        appRef.current = app

        const cv = app.view as HTMLCanvasElement
        cv.style.cssText = 'width:100%;height:auto;display:block;border-radius:20px;'
        mountRef.current.appendChild(cv)

        // ── LAYER STACK ──────────────────────────────────────────────────────
        const skyLayer   = new PIXI.Container()
        const worldLayer = new PIXI.Container()
        const fxLayer    = new PIXI.Container()
        app.stage.addChild(skyLayer, worldLayer, fxLayer)
        worldLayer.sortableChildren = true

        // ── SKY GRADIENT ─────────────────────────────────────────────────────
        const topR = (skyTop>>16)&0xFF, topG = (skyTop>>8)&0xFF, topB = skyTop&0xFF
        const midR = (skyMid>>16)&0xFF, midG = (skyMid>>8)&0xFF, midB = skyMid&0xFF
        const botR = (skyBot>>16)&0xFF, botG = (skyBot>>8)&0xFF, botB = skyBot&0xFF

        const skyG = new PIXI.Graphics()
        for (let i = 0; i < height; i++) {
          const t = i / height
          let sr: number, sg: number, sb: number
          if (t < 0.5) {
            const f = t / 0.5
            sr = Math.round(topR + (midR - topR) * f)
            sg = Math.round(topG + (midG - topG) * f)
            sb = Math.round(topB + (midB - topB) * f)
          } else {
            const f = (t - 0.5) / 0.5
            sr = Math.round(midR + (botR - midR) * f)
            sg = Math.round(midG + (botG - midG) * f)
            sb = Math.round(midB + (botB - midB) * f)
          }
          skyG.beginFill((sr << 16) | (sg << 8) | sb)
          skyG.drawRect(0, i, width, 1)
          skyG.endFill()
        }
        skyLayer.addChild(skyG)

        // ── STARS (night / dusk / dawn) ───────────────────────────────────────
        if (isNight || isDusk || isDawn) {
          const rngStar = mkRng(13)
          const count   = isNight ? 48 : 20
          for (let i = 0; i < count; i++) {
            const sx = rngStar() * width
            const sy = rngStar() * height * 0.46
            const sr2 = 0.6 + rngStar() * 1.3
            const sa  = isNight ? 0.38 + rngStar() * 0.55 : 0.12 + rngStar() * 0.25
            const stG = new PIXI.Graphics()
            stG.beginFill(0xFFFFFF, sa)
            stG.drawCircle(0, 0, sr2)
            stG.endFill()
            stG.x = sx; stG.y = sy
            const ph = rngStar() * Math.PI * 2
            app.ticker.add(() => {
              stG.alpha = sa * (0.65 + Math.sin(performance.now()/1000*1.1+ph)*0.35)
            })
            skyLayer.addChild(stG)
          }
        }

        // ── SUN / MOON ───────────────────────────────────────────────────────
        const celestialCont = new PIXI.Container()
        celestialCont.x = width * 0.82
        celestialCont.y = height * 0.1

        if (isNight) {
          const moonG = new PIXI.Graphics()
          moonG.beginFill(0xC8C0A8, 0.1);  moonG.drawCircle(0,0,34); moonG.endFill()
          moonG.beginFill(0xE4DCC0, 0.92); moonG.drawCircle(0,0,20); moonG.endFill()
          moonG.beginFill(0xF0E8D0, 0.96); moonG.drawCircle(-2,-2,17); moonG.endFill()
          for (const [cx,cy,cr,a] of [[-5,-4,3,0.55],[4,5,2,0.5],[-3,6,2.2,0.5],[6,-3,2.5,0.45]]) {
            moonG.beginFill(0xB8B090, a as number)
            moonG.drawCircle(cx, cy, cr)
            moonG.endFill()
          }
          celestialCont.addChild(moonG)
        } else {
          const sunG   = new PIXI.Graphics()
          const core   = (isDawn || isDusk) ? 0xF97316 : 0xFACC15
          const glow1  = (isDawn || isDusk) ? 0xFB923C : 0xFEF08A
          const glow2  = (isDawn || isDusk) ? 0xFED7AA : 0xFEF9C3
          sunG.beginFill(glow2, 0.13); sunG.drawCircle(0,0,42); sunG.endFill()
          sunG.beginFill(glow1, 0.36); sunG.drawCircle(0,0,33); sunG.endFill()
          sunG.beginFill(glow1, 0.88); sunG.drawCircle(0,0,25); sunG.endFill()
          sunG.beginFill(core);        sunG.drawCircle(0,0,19); sunG.endFill()
          sunG.beginFill(glow2, 0.42); sunG.drawCircle(-7,-7,8); sunG.endFill()
          celestialCont.addChild(sunG)
        }
        skyLayer.addChild(celestialCont)

        // ── CLOUDS ────────────────────────────────────────────────────────────
        const cloudAlpha = isNight ? 0.72 : isDusk || isDawn ? 0.85 : 0.96
        const mkCloud = (cx: number, cy: number, csc: number) => {
          const cg = new PIXI.Graphics()
          for (const [px,py,prx,pry] of [
            [0,0,32,16],[26,-12,24,17],[-21,-7,20,14],[10,12,21,11],[-8,11,16,10]
          ]) {
            cg.beginFill(0xFFFFFF, cloudAlpha)
            cg.drawEllipse(px as number,py as number,prx as number,pry as number)
            cg.endFill()
          }
          cg.x = cx; cg.y = cy; cg.scale.set(csc)
          return cg
        }
        const clouds = [
          mkCloud(width*0.12, height*0.08, 1.12),
          mkCloud(width*0.50, height*0.06, 0.82),
          mkCloud(width*0.30, height*0.13, 0.66),
        ]
        clouds.forEach(c => skyLayer.addChild(c))

        // ── ISOMETRIC TERRAIN ─────────────────────────────────────────────────
        const TW = 48, TH = 24, SOIL = 62
        // World expands with more alive trees
        const aliveCount = trees.filter(t => t.status === 'alive').length
        const COLS = aliveCount === 0 ? 4
          : aliveCount <= 2  ? 5
          : aliveCount <= 6  ? 6
          : aliveCount <= 12 ? 7
          : aliveCount <= 20 ? 8
          : aliveCount <= 30 ? 9
          : 10
        const ROWS = COLS
        const OX = width / 2
        const OY = height * 0.13 + (10 - COLS) * TH * 0.4

        const iso = (col: number, row: number) => {
          return { x: OX + (col - row) * TW/2, y: OY + (col + row) * TH/2 }
        }

        const cTL = iso(0,0), cTR = iso(COLS-1,0)
        const cBL = iso(0,ROWS-1)
        const tipY = OY + (COLS+ROWS-2)*TH/2 + TH/2

        const terrG = new PIXI.Graphics()
        terrG.zIndex = 0

        // ── SW face (left-visible wall) — warm brown, faces viewer ──────────────
        // Goes from Left-diamond-vertex to Bottom-diamond-vertex, then drops SOIL px
        for (let i = 0; i < SOIL; i++) {
          const t = i / SOIL
          const r = Math.round(0xC0 - t*0x52)
          const g = Math.round(0x78 - t*0x38)
          const b = Math.round(0x28 - t*0x14)
          terrG.beginFill((r<<16)|(g<<8)|b)
          terrG.drawPolygon([
            cBL.x-TW/2, cBL.y+i,  OX, tipY+i,
            OX, tipY+i+1,  cBL.x-TW/2, cBL.y+i+1,
          ])
          terrG.endFill()
        }
        // ── SE face (right-visible wall) — darker brown, shadow side ─────────────
        // Goes from Bottom-diamond-vertex to Right-diamond-vertex, then drops SOIL px
        for (let i = 0; i < SOIL; i++) {
          const t = i / SOIL
          const r = Math.round(0x82 - t*0x38)
          const g = Math.round(0x50 - t*0x24)
          const b = Math.round(0x18 - t*0x0C)
          terrG.beginFill((r<<16)|(g<<8)|b)
          terrG.drawPolygon([
            OX, tipY+i,  cTR.x+TW/2, cTR.y+i,
            cTR.x+TW/2, cTR.y+i+1,  OX, tipY+i+1,
          ])
          terrG.endFill()
        }
        // ── Bottom edge cap ───────────────────────────────────────────────────────
        terrG.beginFill(0x2A1206)
        terrG.drawPolygon([
          cBL.x-TW/2, cBL.y+SOIL,  OX, tipY+SOIL,  cTR.x+TW/2, cTR.y+SOIL,
          cTR.x+TW/2, cTR.y+SOIL+4, OX, tipY+SOIL+4, cBL.x-TW/2, cBL.y+SOIL+4,
        ])
        terrG.endFill()

        // Soil face texture — pebbles/rocks scattered across both SW and SE faces
        const rngPeb = mkRng(77)
        for (let i = 0; i < 55; i++) {
          const t = rngPeb()
          const depth = rngPeb()
          const isSW = i < 28
          // SW face: from (cBL.x-TW/2, cBL.y) to (OX, tipY)
          // SE face: from (OX, tipY) to (cTR.x+TW/2, cTR.y)
          let px: number, py: number
          if (isSW) {
            px = (cBL.x-TW/2) + t*(OX - (cBL.x-TW/2)) + (rngPeb()-0.5)*8
            py = cBL.y + t*(tipY - cBL.y) + depth*SOIL*0.85
          } else {
            px = OX + t*((cTR.x+TW/2) - OX) + (rngPeb()-0.5)*6
            py = tipY + t*(cTR.y - tipY) + depth*SOIL*0.85
          }
          const a = 0.25 + rngPeb()*0.28
          const clr = rngPeb() > 0.6 ? 0x2A1206 : 0x4A2810
          terrG.beginFill(clr, a)
          terrG.drawEllipse(px, py, 3+rngPeb()*5, 1.5+rngPeb()*2.5)
          terrG.endFill()
        }

        // Grass tiles — organic color variation, NO borders
        const tiles: {col:number,row:number}[] = []
        for (let row = 0; row < ROWS; row++)
          for (let col = 0; col < COLS; col++)
            tiles.push({col,row})
        tiles.sort((a,b) => (a.col+a.row)-(b.col+b.row))

        for (const {col,row} of tiles) {
          const pos = iso(col,row)
          // organic noise — no checkerboard pattern
          const n1 = Math.sin(col*2.1+row*1.4)*0.5 + Math.cos(col*1.7-row*2.2)*0.5
          const n2 = Math.sin(col*3.3+row*0.9)*0.3
          const n  = n1*0.7 + n2*0.3
          // bright lime-green base matching Forest app
          const bR=0x6C, bG=0xC8, bB=0x40
          const vary = n * 10
          // depth: back rows slightly darker
          const depthDim = 1 - (ROWS-1-row)/ROWS * 0.12
          // light: top-left bright
          const lx = (pos.x-OX)/(width*0.46)
          const ly = (pos.y-OY)/(height*0.46)
          const lit = (1 + lx*0.07 - ly*0.03) * depthDim
          const tR = Math.min(255,Math.max(0,Math.round((bR+vary)*lit)))
          const tG3 = Math.min(255,Math.max(0,Math.round((bG+vary)*lit)))
          const tB = Math.min(255,Math.max(0,Math.round((bB+vary*0.5)*lit)))
          terrG.lineStyle(0)
          terrG.beginFill((tR<<16)|(tG3<<8)|tB)
          terrG.drawPolygon([
            pos.x, pos.y-TH/2, pos.x+TW/2, pos.y, pos.x, pos.y+TH/2, pos.x-TW/2, pos.y
          ])
          terrG.endFill()
        }

        // Grass surface sheen — soft highlight on top-left quadrant
        terrG.beginFill(0xD4F4A0, 0.07)
        terrG.drawPolygon([
          cTL.x, cTL.y-TH/2, OX*0.52, OY+height*0.04,
          iso(2,5).x, iso(2,5).y+TH/2, cTL.x-TW/2, cTL.y+TH,
        ])
        terrG.endFill()

        terrG.cacheAsBitmap = true
        worldLayer.addChild(terrG)

        // ── ISLAND SHADOW — soft ellipse beneath the platform ─────────────────
        const shadowG = new PIXI.Graphics()
        const shadowY = tipY + SOIL + 10
        for (let i = 5; i >= 0; i--) {
          shadowG.beginFill(0x000000, 0.06 * i)
          shadowG.drawEllipse(width/2, shadowY + i*3, width*0.38 + i*6, 10 + i*2)
          shadowG.endFill()
        }
        shadowG.zIndex = -1
        worldLayer.addChild(shadowG)

        // ── SOIL EDGE GRASS OVERHANG — organic wisps along the soil top ────────
        const rngEdge = mkRng(71)
        // SW edge: from (cBL.x-TW/2, cBL.y) to (OX, tipY)
        const swX0 = cBL.x-TW/2, swY0 = cBL.y, swX1 = OX, swY1 = tipY
        // SE edge: from (OX, tipY) to (cTR.x+TW/2, cTR.y)
        const seX0 = OX, seY0 = tipY, seX1 = cTR.x+TW/2, seY1 = cTR.y
        for (let e = 0; e < 2; e++) {
          const ex0 = e===0?swX0:seX0, ey0 = e===0?swY0:seY0
          const ex1 = e===0?swX1:seX1, ey1 = e===0?swY1:seY1
          for (let i = 0; i < 14; i++) {
            const t = (i + 0.3 + rngEdge()*0.4) / 14
            const ex = ex0 + t*(ex1-ex0) + (rngEdge()-0.5)*8
            const ey = ey0 + t*(ey1-ey0) - 2 + (rngEdge()-0.5)*4
            const eg = new PIXI.Graphics()
            renderGrassTuft(eg, 0.35 + rngEdge()*0.22)
            eg.x = ex; eg.y = ey
            eg.zIndex = 1
            worldLayer.addChild(eg)
          }
        }

        // ── GRASS TUFTS — perimeter + interior scatter ────────────────────────
        const rngTuft = mkRng(33)
        // Perimeter (36 tufts)
        for (let i = 0; i < 36; i++) {
          const col = Math.floor(rngTuft()*COLS)
          const row = Math.floor(rngTuft()*ROWS)
          if (col>0 && col<COLS-1 && row>0 && row<ROWS-1) continue
          const pos = iso(col,row)
          const tG2 = new PIXI.Graphics()
          renderGrassTuft(tG2, 0.55 + rngTuft()*0.35)
          tG2.x = pos.x + (rngTuft()-0.5)*TW*0.5
          tG2.y = pos.y + TH/2 + (rngTuft()-0.5)*TH*0.35
          tG2.zIndex = 1
          worldLayer.addChild(tG2)
        }
        // Interior scatter (26 tufts in inner tiles)
        const rngInt = mkRng(87)
        for (let i = 0; i < 26; i++) {
          const col = 1 + Math.floor(rngInt()*(COLS-2))
          const row = 1 + Math.floor(rngInt()*(ROWS-2))
          const pos = iso(col,row)
          const tGi = new PIXI.Graphics()
          renderGrassTuft(tGi, 0.4 + rngInt()*0.28)
          tGi.x = pos.x + (rngInt()-0.5)*TW*0.65
          tGi.y = pos.y + TH/2 + (rngInt()-0.5)*TH*0.48
          tGi.zIndex = pos.y
          worldLayer.addChild(tGi)
        }

        // ── PRE-COMPUTE TREE ARRAYS ───────────────────────────────────────────
        const aliveTrees = trees.filter(t => t.status === 'alive')
        const deadTrees  = trees.filter(t => t.status === 'dead')
        const allTrees   = [...aliveTrees, ...deadTrees]

        // ── BUSHES ────────────────────────────────────────────────────────────
        const rngBsh = mkRng(66)
        const bushCount = Math.min(2 + Math.floor(aliveTrees.length * 0.4), 14)
        for (let i = 0; i < bushCount; i++) {
          const col = 1 + Math.floor(rngBsh()*(COLS-2))
          const row = 1 + Math.floor(rngBsh()*(ROWS-2))
          const pos = iso(col,row)
          const bG = new PIXI.Graphics()
          renderBush(bG, 0.62 + rngBsh()*0.42)
          bG.x = pos.x + (rngBsh()-0.5)*TW*0.62
          bG.y = pos.y + TH/2 + (rngBsh()-0.5)*TH*0.42
          bG.zIndex = bG.y + 6
          worldLayer.addChild(bG)
        }

        // ── GROUND DECORATIONS ────────────────────────────────────────────────
        const rngDec = mkRng(99)
        const decorTiles: {col:number,row:number}[] = []
        for (let row=1; row<ROWS-1; row++)
          for (let col=1; col<COLS-1; col++)
            decorTiles.push({col,row})

        const mushroomCount = Math.min(3 + Math.floor(aliveTrees.length * 0.5), 20)
        for (let i = 0; i < mushroomCount; i++) {
          const idx = Math.floor(rngDec()*decorTiles.length)
          const {col,row} = decorTiles[idx]
          const pos = iso(col,row)
          const mG = new PIXI.Graphics()
          renderMushroom(mG, 0.7+rngDec()*0.55, rngDec()>0.45?'red':'small')
          mG.x = pos.x + (rngDec()-0.5)*TW*0.65
          mG.y = pos.y + TH/2 + (rngDec()-0.5)*TH*0.38
          mG.zIndex = pos.y + TH/2 + 5
          worldLayer.addChild(mG)
        }

        // Small flowers scattered organically
        const rngFlwr = mkRng(44)
        const flowerCount = Math.min(8 + Math.floor(aliveTrees.length * 1.5), 48)
        for (let i = 0; i < flowerCount; i++) {
          const col = 1 + Math.floor(rngFlwr()*(COLS-2))
          const row = 1 + Math.floor(rngFlwr()*(ROWS-2))
          const pos = iso(col,row)
          const fG = new PIXI.Graphics()
          const fc = [0xFEF08A, 0xF9A8D4, 0xBFDBFE, 0xFBCFE8][Math.floor(rngFlwr()*4)]
          const fx = pos.x + (rngFlwr()-0.5)*TW*0.7
          const fy = pos.y + TH/2 + (rngFlwr()-0.5)*TH*0.45
          const fsc = 0.5 + rngFlwr()*0.5
          fG.beginFill(0x16A34A); fG.drawRect(-fsc,-6*fsc, fsc*2, 6*fsc); fG.endFill()
          for (const [dx,dy] of [[-2,-1],[2,-1],[0,-2.5],[-1.5,-2.5],[1.5,-2.5]]) {
            fG.beginFill(fc, 0.9)
            fG.drawEllipse(dx*fsc*1.2, (dy-6)*fsc, 1.8*fsc, 1.1*fsc)
            fG.endFill()
          }
          fG.beginFill(0xFEF9C3); fG.drawCircle(0,-6*fsc, fsc); fG.endFill()
          fG.x = fx; fG.y = fy
          fG.zIndex = fy + 2
          worldLayer.addChild(fG)
        }

        // ── TREES ─────────────────────────────────────────────────────────────
        const rng = mkRng(42)
        const validTiles: {col:number,row:number}[] = []
        for (let row=1; row<ROWS-1; row++)
          for (let col=1; col<COLS-1; col++) {
            if ((col===1&&row===1)||(col===COLS-2&&row===1)||
                (col===1&&row===ROWS-2)||(col===COLS-2&&row===ROWS-2)) continue
            validTiles.push({col,row})
          }

        // Shuffle
        for (let i = validTiles.length-1; i > 0; i--) {
          const j = Math.floor(rng()*(i+1))
          ;[validTiles[i],validTiles[j]] = [validTiles[j],validTiles[i]]
        }

        // Cluster toward center + organic scatter
        const cC = COLS/2, cR = ROWS/2
        validTiles.sort((a,b) => {
          const dA = (a.col-cC)**2+(a.row-cR)**2+Math.sin(a.col*3.7+a.row*2.1)*2
          const dB = (b.col-cC)**2+(b.row-cR)**2+Math.sin(b.col*3.7+b.row*2.1)*2
          return dA-dB
        })

        const placed = allTrees.map((tree,i) => {
          const tile = validTiles[i % validTiles.length]
          return { tree, tile, depth: tile.col+tile.row }
        })
        placed.sort((a,b) => a.depth-b.depth)

        // BASE_SC: controls tree size relative to tile (TW=48). At 0.85, full tree blob ~73px wide — fits with slight overlap.
        const BASE_SC = 0.85
        const treeCont: {c:any, baseRot:number}[] = []

        placed.forEach(({tree,tile},i) => {
          const rngL  = mkRng(i*41+7)
          const tPos  = iso(tile.col, tile.row)
          const jx    = (rngL()-0.5)*TW*0.30
          const jy    = (rngL()-0.5)*TH*0.25
          // depth scale: back rows slightly smaller for natural perspective
          const depthSc = 0.80 + (tile.row/ROWS)*0.22
          const randSc  = 0.92 + rngL()*0.16
          const finalSc = BASE_SC * depthSc * randSc

          // atmospheric depth: subtle — all trees nearly opaque, front rows slightly more saturated
          const atmAlpha = 0.88 + (tile.row/ROWS)*0.12

          const baseRot = (rngL()-0.5)*0.05

          const cont = new PIXI.Container()
          cont.x = tPos.x + jx
          cont.y = tPos.y + TH/2 + jy
          cont.rotation = baseRot
          cont.zIndex = tPos.y + TH/2 + jy + 10
          cont.scale.set(0)
          cont.alpha = 0

          const tG = new PIXI.Graphics()
          renderTree(tG, tree.tree_type, finalSc)
          cont.addChild(tG)
          worldLayer.addChild(cont)
          treeCont.push({c: cont, baseRot})

          // Spring entrance animation — staggered, snappy
          let elapsed = 0
          const delay = i * 0.045
          const tick = (delta: number) => {
            elapsed += delta / 60
            if (elapsed < delay) return
            const p = Math.min((elapsed-delay)/0.45, 1)
            // cubic ease with spring overshoot
            const ease = p < 0.5 ? 4*p**3 : 1-(-2*p+2)**3/2
            const sc = p < 0.80 ? ease*1.10 : ease
            cont.scale.set(sc)
            cont.alpha = Math.min(p * atmAlpha * 2.5, atmAlpha)
            if (p >= 1) {
              cont.scale.set(1)
              cont.alpha = atmAlpha
              // Now safe to cache (full size established)
              tG.cacheAsBitmap = true
              app.ticker.remove(tick)
            }
          }
          app.ticker.add(tick)
        })

        // Empty state hint
        if (allTrees.length === 0) {
          const hint = new PIXI.Text('Complete tasks to grow your forest 🌱', {
            fontFamily:'system-ui,sans-serif', fontSize:12, fill:0x2D6B2D,
            align:'center', fontWeight:'500',
          })
          hint.anchor.set(0.5)
          hint.x = width/2; hint.y = height*0.65
          worldLayer.addChild(hint)
        }

        // ── SPIRIT CREATURES ──────────────────────────────────────────────────
        if (aliveTrees.length >= 5) {
          const spiritCount = Math.min(1 + Math.floor((aliveTrees.length - 5) / 5), 5)
          const rngSp = mkRng(123)
          for (let s = 0; s < spiritCount; s++) {
            const col = 1 + Math.floor(rngSp()*(COLS-2))
            const row = 1 + Math.floor(rngSp()*(ROWS-2))
            const pos = iso(col, row)
            const spCont = new PIXI.Container()
            const spG = new PIXI.Graphics()
            renderSpirit(spG, 0.52 + rngSp()*0.22)
            spCont.addChild(spG)
            spCont.x = pos.x + (rngSp()-0.5)*TW*0.5
            spCont.y = pos.y - 10 + (rngSp()-0.5)*TH*0.4
            spCont.zIndex = spCont.y + 20
            worldLayer.addChild(spCont)
            const spBaseY = spCont.y
            const spPhase = rngSp() * Math.PI * 2
            app.ticker.add(() => {
              const t = performance.now()/1000
              spCont.y = spBaseY + Math.sin(t * 0.9 + spPhase) * 4
              spCont.rotation = Math.sin(t * 0.5 + spPhase) * 0.04
            })
          }
        }

        // ── WIND SWAY ─────────────────────────────────────────────────────────
        treeCont.forEach(({c,baseRot},i) => {
          const phase = i * 0.38
          const amt   = 0.006 + Math.abs(Math.sin(i*2.1))*0.004
          app.ticker.add(() => {
            const t = performance.now()/1000*0.48
            c.rotation = baseRot + Math.sin(t+phase)*amt
          })
        })

        // ── GROUND MIST (depth atmosphere) ────────────────────────────────────
        const mistG = new PIXI.Graphics()
        const groundMidY = OY + (COLS+ROWS)*TH/2*0.38
        for (let i = 0; i < 10; i++) {
          const t = i/10
          mistG.beginFill(isNight ? 0x8ABCCC : 0xC8ECC0, 0.055*(1-t*t))
          mistG.drawEllipse(width/2, groundMidY+i*9, width*0.72, 22+i*5)
          mistG.endFill()
        }
        mistG.zIndex = 2
        worldLayer.addChild(mistG)

        // ── AMBIENT FX ────────────────────────────────────────────────────────
        if (aliveTrees.length >= 3) {
          const bf = new PIXI.Text('🦋',{fontSize:15})
          bf.x = width*0.35; bf.y = height*0.5
          fxLayer.addChild(bf)
          app.ticker.add(() => {
            const t = performance.now()/1000
            bf.x = width*0.35+Math.sin(t*1.05)*28
            bf.y = height*0.50+Math.sin(t*0.68)*16
          })
        }
        if (aliveTrees.length >= 8) {
          const bird = new PIXI.Text('🐦',{fontSize:13})
          bird.x = width*0.72; bird.y = height*0.22
          fxLayer.addChild(bird)
          app.ticker.add(() => {
            const t = performance.now()/1000
            bird.x = width*0.72+Math.sin(t*0.72)*36
            bird.y = height*0.22+Math.sin(t*0.40)*18
          })
        }
        if (aliveTrees.length >= 15) {
          const deer = new PIXI.Text('🦌',{fontSize:14})
          deer.x = width*0.2; deer.y = height*0.56
          fxLayer.addChild(deer)
          app.ticker.add(() => {
            const t = performance.now()/1000
            deer.x = width*0.2+Math.sin(t*0.3)*22
          })
        }

        // ── FLOATING POLLEN / FIREFLIES ───────────────────────────────────────
        const POLLEN = [
          {lx:0.13,ly:0.52},{lx:0.29,ly:0.46},{lx:0.45,ly:0.59},
          {lx:0.61,ly:0.43},{lx:0.73,ly:0.56},{lx:0.83,ly:0.49},
          {lx:0.21,ly:0.66},{lx:0.51,ly:0.63},{lx:0.66,ly:0.69},
          {lx:0.36,ly:0.51},{lx:0.56,ly:0.73},{lx:0.79,ly:0.63},
          {lx:0.16,ly:0.73},{lx:0.91,ly:0.56},
        ]
        const pollenCount = isNight
          ? 12
          : Math.min(aliveTrees.length * 2 + 4, 14)

        for (let i = 0; i < pollenCount; i++) {
          const rngP = mkRng(i*19+5)
          const pG   = new PIXI.Graphics()
          const pSz  = isNight ? 1.8+rngP()*1.5 : 1.2+rngP()*2
          const pClr = isNight ? 0xAAFF88 : 0xFFFFFF
          const pAMax= isNight ? 0.65+rngP()*0.3 : 0.30+rngP()*0.25
          pG.beginFill(pClr, 1); pG.drawCircle(0,0,pSz); pG.endFill()
          fxLayer.addChild(pG)
          const sp = POLLEN[i%POLLEN.length]
          const bX = sp.lx*width, bY = sp.ly*height
          const dX = (rngP()-0.5)*55
          const spd= 0.011+rngP()*0.017
          const ph = rngP()*Math.PI*2
          let prog = rngP()
          app.ticker.add((delta: number) => {
            prog += spd*delta/60
            if (prog>1) prog-=1
            const rise = Math.sin(prog*Math.PI)
            pG.x = bX+Math.sin(prog*Math.PI*3+ph)*14+dX*prog
            pG.y = bY-prog*height*0.26
            pG.alpha = rise*pAMax
          })
        }

        // ── MASTER FLOAT + CLOUDS ─────────────────────────────────────────────
        app.ticker.add(() => {
          const t = performance.now()/1000
          const floatY = Math.sin(t*0.48)*5
          worldLayer.y = floatY
          // Shadow scales inversely to float (closer = bigger shadow)
          const shadowScale = 1 - floatY*0.008
          shadowG.scale.set(shadowScale, 1)
          shadowG.alpha = 0.85 + floatY*0.02
          clouds[0].x = width*0.12+Math.sin(t*0.36)*18
          clouds[1].x = width*0.50+Math.sin(t*0.26+1.9)*13
          clouds[2].x = width*0.30+Math.sin(t*0.20+3.2)*10
          celestialCont.scale.set(1+Math.sin(t*0.58)*0.035)
        })

      } catch(e) {
        console.error('PixiForest boot error:', e)
      }
    }

    boot()
    return () => {
      destroyed = true
      if (appRef.current) {
        try { appRef.current.destroy(true) } catch {}
        appRef.current = null
      }
    }
  }, [trees])

  // Time-aware placeholder shown while PIXI loads
  const h = new Date().getHours()
  const [pt, pm, pb] = getSkyPalette(h)
  const toHex = (n: number) => `#${n.toString(16).padStart(6,'0')}`
  const placeholderBg = `linear-gradient(180deg,${toHex(pt)} 0%,${toHex(pm)} 50%,${toHex(pb)} 100%)`

  return (
    <div style={{ position:'relative', width:'100%', borderRadius:'20px', overflow:'hidden' }}>
      <div
        ref={mountRef}
        style={{ width:'100%', borderRadius:'20px', overflow:'hidden', minHeight:`${height}px`, background:placeholderBg }}
      />
      {/* Forest atmosphere vignette — dark forest-green at edges like Forest app */}
      <div style={{
        position:'absolute', inset:0, borderRadius:'20px', pointerEvents:'none',
        background:'radial-gradient(ellipse at 50% 38%, transparent 30%, rgba(4,10,5,0.45) 65%, rgba(2,6,3,0.78) 100%)',
      }}/>
    </div>
  )
}
