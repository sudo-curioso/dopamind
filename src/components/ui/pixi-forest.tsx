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

// ─────────────────────────────────────────
// Seeded deterministic random
// ─────────────────────────────────────────
function mkRng(seed: number) {
  let s = seed >>> 0
  return () => {
    s = Math.imul(1664525, s) + 1013904223 >>> 0
    return s / 4294967296
  }
}

// ─────────────────────────────────────────
// TREE DRAWING ENGINE
// Each tree is drawn on its own Graphics
// object then cached as bitmap for perf
// ─────────────────────────────────────────
function renderTree(G: any, type: string, sc: number) {
  const s = sc

  // ── GROUND SHADOW ──
  G.beginFill(0x2D5A1B, 0.18)
  G.drawEllipse(2*s, 1*s, 15*s, 4.5*s)
  G.endFill()

  // ── DEAD TREE ──
  if (type === 'dead') {
    // trunk
    G.beginFill(0x78716C)
    G.drawPolygon([-3.5*s,0, 3.5*s,0, 2.5*s,-26*s, -2.5*s,-26*s])
    G.endFill()
    G.beginFill(0x57534E)
    G.drawPolygon([3.5*s,0, 6.5*s,3*s, 5.5*s,-23*s, 2.5*s,-26*s])
    G.endFill()
    // branches
    G.beginFill(0x78716C)
    G.drawPolygon([0,-17*s, -13*s,-25*s, -11*s,-23*s, 0,-15*s])
    G.endFill()
    G.beginFill(0x57534E)
    G.drawPolygon([0,-12*s, 13*s,-21*s, 12*s,-19*s, 0,-10*s])
    G.endFill()
    G.beginFill(0x44403C)
    G.drawPolygon([0,-8*s, 9*s,-14*s, 8*s,-12*s, 0,-6*s])
    G.endFill()
    return
  }

  // ── SPROUT ──
  if (type === 'sprout') {
    G.beginFill(0x92400E)
    G.drawPolygon([-2*s,0, 2*s,0, 1.5*s,-11*s, -1.5*s,-11*s])
    G.endFill()
    G.beginFill(0x78350F)
    G.drawPolygon([2*s,0, 4.5*s,2*s, 4*s,-9*s, 1.5*s,-11*s])
    G.endFill()
    // single cone canopy
    G.beginFill(0x86EFAC) // bright top face
    G.drawPolygon([0,-24*s, -11*s,-9*s, 11*s,-9*s])
    G.endFill()
    G.beginFill(0x4ADE80) // left face
    G.drawPolygon([0,-24*s, -11*s,-9*s, -9*s,-7*s, 0,-21*s])
    G.endFill()
    G.beginFill(0x22C55E) // right face (darker)
    G.drawPolygon([0,-24*s, 11*s,-9*s, 9*s,-7*s, 0,-21*s])
    G.endFill()
    G.beginFill(0x16A34A)
    G.drawEllipse(0,-9*s, 11*s, 3.5*s)
    G.endFill()
    return
  }

  // ── BABY ── (small round tree)
  if (type === 'baby') {
    // trunk
    G.beginFill(0x92400E)
    G.drawPolygon([-3*s,0, 3*s,0, 2.5*s,-18*s, -2.5*s,-18*s])
    G.endFill()
    G.beginFill(0x78350F)
    G.drawPolygon([3*s,0, 6*s,2.5*s, 5.5*s,-15*s, 2.5*s,-18*s])
    G.endFill()
    // lower ball
    G.beginFill(0x15803D)
    G.drawEllipse(3.5*s,-24*s, 18*s, 12*s) // side shadow
    G.endFill()
    G.beginFill(0x16A34A)
    G.drawEllipse(0,-24*s, 18*s, 12*s)
    G.endFill()
    G.beginFill(0x22C55E)
    G.drawEllipse(-2*s,-26*s, 14*s, 10*s) // highlight
    G.endFill()
    G.beginFill(0x4ADE80)
    G.drawEllipse(-4*s,-28*s, 8*s, 6*s)
    G.endFill()
    // upper ball
    G.beginFill(0x15803D)
    G.drawEllipse(3*s,-36*s, 13*s, 9*s)
    G.endFill()
    G.beginFill(0x22C55E)
    G.drawEllipse(0,-36*s, 13*s, 9*s)
    G.endFill()
    G.beginFill(0x4ADE80)
    G.drawEllipse(-2*s,-38*s, 7*s, 5*s)
    G.endFill()
    return
  }

  // ── HALF ── (medium round tree - 3 balls)
  if (type === 'half') {
    // trunk
    G.beginFill(0x92400E)
    G.drawPolygon([-4*s,0, 4*s,0, 3.5*s,-24*s, -3.5*s,-24*s])
    G.endFill()
    G.beginFill(0x78350F)
    G.drawPolygon([4*s,0, 8*s,3*s, 7*s,-21*s, 3.5*s,-24*s])
    G.endFill()
    // bottom ball
    G.beginFill(0x14532D)
    G.drawEllipse(5*s,-30*s, 24*s, 15*s)
    G.endFill()
    G.beginFill(0x15803D)
    G.drawEllipse(0,-30*s, 24*s, 15*s)
    G.endFill()
    G.beginFill(0x16A34A)
    G.drawEllipse(-3*s,-33*s, 18*s, 12*s)
    G.endFill()
    G.beginFill(0x22C55E)
    G.drawEllipse(-5*s,-36*s, 10*s, 7*s)
    G.endFill()
    // mid ball
    G.beginFill(0x14532D)
    G.drawEllipse(4*s,-44*s, 20*s, 13*s)
    G.endFill()
    G.beginFill(0x16A34A)
    G.drawEllipse(0,-44*s, 20*s, 13*s)
    G.endFill()
    G.beginFill(0x22C55E)
    G.drawEllipse(-3*s,-47*s, 13*s, 9*s)
    G.endFill()
    // top ball
    G.beginFill(0x15803D)
    G.drawEllipse(3*s,-57*s, 14*s, 9*s)
    G.endFill()
    G.beginFill(0x22C55E)
    G.drawEllipse(0,-57*s, 14*s, 9*s)
    G.endFill()
    G.beginFill(0x4ADE80)
    G.drawEllipse(-2*s,-59*s, 8*s, 6*s)
    G.endFill()
    return
  }

  // ── FLOWERING ── (pink blossom tree)
  if (type === 'flowering') {
    // trunk
    G.beginFill(0x92400E)
    G.drawPolygon([-4*s,0, 4*s,0, 3.5*s,-26*s, -3.5*s,-26*s])
    G.endFill()
    G.beginFill(0x78350F)
    G.drawPolygon([4*s,0, 8*s,3*s, 7*s,-23*s, 3.5*s,-26*s])
    G.endFill()
    // bottom pink layer
    G.beginFill(0xF472B6)
    G.drawEllipse(5*s,-32*s, 26*s, 16*s)
    G.endFill()
    G.beginFill(0xFBCFE8)
    G.drawEllipse(0,-32*s, 26*s, 16*s)
    G.endFill()
    G.beginFill(0xFDE8F0)
    G.drawEllipse(-3*s,-35*s, 18*s, 12*s)
    G.endFill()
    // mid pink layer
    G.beginFill(0xEC4899)
    G.drawEllipse(4*s,-46*s, 21*s, 14*s)
    G.endFill()
    G.beginFill(0xF9A8D4)
    G.drawEllipse(0,-46*s, 21*s, 14*s)
    G.endFill()
    G.beginFill(0xFBCFE8)
    G.drawEllipse(-2*s,-49*s, 14*s, 9*s)
    G.endFill()
    // top pink
    G.beginFill(0xF472B6)
    G.drawEllipse(3*s,-58*s, 14*s, 9*s)
    G.endFill()
    G.beginFill(0xFBCFE8)
    G.drawEllipse(0,-58*s, 14*s, 9*s)
    G.endFill()
    // white flower dots
    const rngF = mkRng(88)
    for (let i = 0; i < 9; i++) {
      const fx = (rngF()-0.5)*34*s
      const fy = (-28-rngF()*30)*s
      G.beginFill(0xFFFFFF, 0.9)
      G.drawCircle(fx, fy, 2.8*s)
      G.endFill()
      G.beginFill(0xFEF9C3, 1)
      G.drawCircle(fx, fy, 1.1*s)
      G.endFill()
    }
    return
  }

  // ── LARGE ── (tall pine tree - the star of the show)
  if (type === 'large') {
    // trunk - thick
    G.beginFill(0x78350F)
    G.drawPolygon([-5*s,0, 5*s,0, 4*s,-32*s, -4*s,-32*s])
    G.endFill()
    G.beginFill(0x451A03)
    G.drawPolygon([5*s,0, 10*s,4*s, 9*s,-28*s, 4*s,-32*s])
    G.endFill()
    // 6 pine layers from bottom to top
    const layers = [
      {w:30, top:-26, peak:-44, c:0x14532D, cl:0x0F3D20, cr:0x0A2918},
      {w:26, top:-38, peak:-56, c:0x15803D, cl:0x145D2A, cr:0x0F3D20},
      {w:21, top:-50, peak:-67, c:0x16A34A, cl:0x15803D, cr:0x145D2A},
      {w:16, top:-61, peak:-77, c:0x22C55E, cl:0x16A34A, cr:0x15803D},
      {w:11, top:-71, peak:-86, c:0x4ADE80, cl:0x22C55E, cr:0x16A34A},
      {w:6,  top:-80, peak:-93, c:0x86EFAC, cl:0x4ADE80, cr:0x22C55E},
    ]
    for (const l of layers) {
      const w = l.w*s
      // front bright face
      G.beginFill(l.c)
      G.drawPolygon([0,l.peak*s, -w,l.top*s, w,l.top*s])
      G.endFill()
      // left face darker
      G.beginFill(l.cl)
      G.drawPolygon([0,l.peak*s, -w,l.top*s, -w+3*s,(l.top+5)*s, 0,(l.peak+5)*s])
      G.endFill()
      // right face darkest
      G.beginFill(l.cr)
      G.drawPolygon([0,l.peak*s, w,l.top*s, w+5*s,(l.top+6)*s, 0,(l.peak+6)*s])
      G.endFill()
      // bottom cap ellipse
      G.beginFill(l.cr)
      G.drawEllipse(s,(l.top+1)*s, w*0.92, w*0.25)
      G.endFill()
    }
    return
  }

  // ── FULL ── (grand lush tree - maximum prestige)
  if (type === 'full') {
    // thick trunk
    G.beginFill(0x78350F)
    G.drawPolygon([-6*s,0, 6*s,0, 5*s,-34*s, -5*s,-34*s])
    G.endFill()
    G.beginFill(0x451A03)
    G.drawPolygon([6*s,0, 11*s,4*s, 10*s,-30*s, 5*s,-34*s])
    G.endFill()
    // 6 lush blob layers
    const blobs = [
      {bw:34,bh:21,oy:-38, tc:0x14532D, sc2:0x0F3D20, dc:0x0A2918},
      {bw:30,bh:19,oy:-54, tc:0x15803D, sc2:0x14532D, dc:0x0F3D20},
      {bw:24,bh:16,oy:-68, tc:0x16A34A, sc2:0x15803D, dc:0x14532D},
      {bw:18,bh:13,oy:-80, tc:0x22C55E, sc2:0x16A34A, dc:0x15803D},
      {bw:12,bh:9, oy:-90, tc:0x4ADE80, sc2:0x22C55E, dc:0x16A34A},
      {bw:7, bh:6, oy:-98, tc:0x86EFAC, sc2:0x4ADE80, dc:0x22C55E},
    ]
    for (const b of blobs) {
      const bws = b.bw*s, bhs = b.bh*s, bys = b.oy*s
      G.beginFill(b.dc, 0.55)
      G.drawEllipse(4*s, bys+bhs*0.55, bws*0.85, bhs*0.38)
      G.endFill()
      G.beginFill(b.sc2)
      G.drawEllipse(4.5*s, bys, bws, bhs)
      G.endFill()
      G.beginFill(b.tc)
      G.drawEllipse(0, bys, bws, bhs)
      G.endFill()
      G.beginFill(0xFFFFFF, 0.13)
      G.drawEllipse(-bws*0.22, bys-bhs*0.2, bws*0.4, bhs*0.32)
      G.endFill()
    }
    // golden flower accent dots
    const rngFl = mkRng(55)
    for (let i = 0; i < 11; i++) {
      const fx = (rngFl()-0.5)*46*s
      const fy = (-32-rngFl()*62)*s
      const inBounds = (fx/(24*s))**2 + ((fy+65*s)/(34*s))**2 < 1.15
      if (!inBounds) continue
      G.beginFill(0xFDE68A, 0.94)
      G.drawCircle(fx, fy, 3.2*s)
      G.endFill()
      G.beginFill(0xFBBF24, 0.8)
      G.drawCircle(fx, fy, 1.4*s)
      G.endFill()
    }
    return
  }
}

// ─────────────────────────────────────────
// GRASS TUFT decoration
// ─────────────────────────────────────────
function renderGrassTuft(G: any, sc: number) {
  const s = sc
  const blades = [[-4,0,-2,-8,0,0], [0,0,1,-9,3,0], [3,0,6,-7,8,0],
                  [-6,0,-5,-6,-3,0], [5,0,7,-8,9,0]]
  for (const [x1,y1,x2,y2,x3,y3] of blades) {
    G.beginFill(0x4ADE80)
    G.drawPolygon([x1*s,y1*s, x2*s,y2*s, x3*s,y3*s])
    G.endFill()
  }
}

// ─────────────────────────────────────────
// MUSHROOM decoration
// ─────────────────────────────────────────
function renderMushroom(G: any, sc: number, type: 'red'|'small') {
  const s = sc
  if (type === 'red') {
    G.beginFill(0xF5F5DC) // stem
    G.drawPolygon([-3*s,0, 3*s,0, 2.5*s,-8*s, -2.5*s,-8*s])
    G.endFill()
    G.beginFill(0xDC2626) // cap dark side
    G.drawEllipse(3*s,-11*s, 14*s, 8*s)
    G.endFill()
    G.beginFill(0xEF4444) // cap main
    G.drawEllipse(0,-11*s, 14*s, 8*s)
    G.endFill()
    G.beginFill(0xDC2626) // cap underside
    G.drawEllipse(0,-8*s, 14*s, 4*s)
    G.endFill()
    // white dots
    for (const [dx,dy] of [[-4,-14],[2,-16],[6,-11],[-1,-9]]) {
      G.beginFill(0xFFFFFF, 0.9)
      G.drawCircle(dx*s, dy*s, 2*s)
      G.endFill()
    }
  } else {
    G.beginFill(0xE5E7EB)
    G.drawPolygon([-2*s,0, 2*s,0, 1.5*s,-5*s, -1.5*s,-5*s])
    G.endFill()
    G.beginFill(0xC2410C)
    G.drawEllipse(0,-7*s, 8*s, 5*s)
    G.endFill()
    G.beginFill(0xC2410C)
    G.drawEllipse(0,-5*s, 8*s, 3*s)
    G.endFill()
  }
}

// ─────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────
export default function PixiForest({ trees, width = 480, height = 380 }: PixiForestProps) {
  const mountRef = useRef<HTMLDivElement>(null)
  const appRef = useRef<any>(null)

  useEffect(() => {
    if (!mountRef.current) return
    let dead = false

    async function boot() {
      try {
        const PIXI = await import('pixi.js')
        if (dead || !mountRef.current) return

        // cleanup
        if (appRef.current) {
          try { appRef.current.destroy(true) } catch {}
          appRef.current = null
        }
        mountRef.current.innerHTML = ''

        const app = new PIXI.Application({
          width, height,
          backgroundColor: 0x4AA8D4,
          antialias: true,
          resolution: Math.min(window.devicePixelRatio || 1, 2),
          autoDensity: true,
        })
        appRef.current = app

        const cv = app.view as HTMLCanvasElement
        cv.style.cssText = 'width:100%;height:auto;display:block;border-radius:20px;'
        mountRef.current.appendChild(cv)

        // ── LAYER STACK ──
        const skyLayer   = new PIXI.Container()
        const worldLayer = new PIXI.Container() // floats
        const fxLayer    = new PIXI.Container()
        app.stage.addChild(skyLayer, worldLayer, fxLayer)

        // ─────────────── SKY ───────────────
        const skyG = new PIXI.Graphics()
        for (let i = 0; i < height; i++) {
          const t = i / height
          let sr: number, sg: number, sb: number
          if (t < 0.5) {
            const f = t / 0.5
            sr = Math.round(0x44 + (0x7A - 0x44) * f)
            sg = Math.round(0xAA + (0xCC - 0xAA) * f)
            sb = Math.round(0xD8 + (0xF0 - 0xD8) * f)
          } else {
            const f = (t - 0.5) / 0.5
            sr = Math.round(0x7A + (0xB4 - 0x7A) * f)
            sg = Math.round(0xCC + (0xE8 - 0xCC) * f)
            sb = Math.round(0xF0 + (0xCC - 0xF0) * f)
          }
          skyG.beginFill((sr << 16) | (sg << 8) | sb)
          skyG.drawRect(0, i, width, 1)
          skyG.endFill()
        }
        skyLayer.addChild(skyG)

        // ─────────────── SUN ───────────────
        const sunCont = new PIXI.Container()
        sunCont.x = width * 0.82; sunCont.y = height * 0.1
        const sunG = new PIXI.Graphics()
        sunG.beginFill(0xFEF9C3, 0.15); sunG.drawCircle(0,0,40); sunG.endFill()
        sunG.beginFill(0xFEF08A, 0.4);  sunG.drawCircle(0,0,32); sunG.endFill()
        sunG.beginFill(0xFEF08A, 0.88); sunG.drawCircle(0,0,24); sunG.endFill()
        sunG.beginFill(0xFACC15);       sunG.drawCircle(0,0,18); sunG.endFill()
        sunG.beginFill(0xFEF9C3, 0.4);  sunG.drawCircle(-7,-7,7); sunG.endFill()
        sunCont.addChild(sunG)
        skyLayer.addChild(sunCont)

        // ─────────────── CLOUDS ───────────────
        function mkCloud(cx: number, cy: number, csc: number, alpha: number) {
          const cg = new PIXI.Graphics()
          for (const [px,py,prx,pry] of [
            [0,0,32,15],[25,-11,23,16],[-20,-6,19,13],[10,11,20,10],[-7,10,15,9]
          ]) {
            cg.beginFill(0xFFFFFF, alpha)
            cg.drawEllipse(px as number, py as number, prx as number, pry as number)
            cg.endFill()
          }
          cg.x = cx; cg.y = cy; cg.scale.set(csc)
          return cg
        }
        const clouds = [
          mkCloud(width*0.12, height*0.08, 1.1, 0.92),
          mkCloud(width*0.50, height*0.06, 0.82, 0.76),
          mkCloud(width*0.30, height*0.13, 0.65, 0.6),
        ]
        clouds.forEach(c => skyLayer.addChild(c))

        // ─────────────── ISOMETRIC TERRAIN ───────────────
        const TW = 58, TH = 29, SOIL = 46
        const COLS = 9, ROWS = 9
        const OX = width / 2
        const OY = height * 0.13

        function iso(col: number, row: number) {
          return {
            x: OX + (col - row) * TW / 2,
            y: OY + (col + row) * TH / 2,
          }
        }

        const cTL = iso(0,0), cTR = iso(COLS-1,0)
        const cBL = iso(0,ROWS-1), cBR = iso(COLS-1,ROWS-1)
        const tipY = OY + (COLS+ROWS-2)*TH/2 + TH/2

        const terrG = new PIXI.Graphics()

        // left soil gradient
        for (let i = 0; i < SOIL; i++) {
          const t = i/SOIL
          const sr = Math.round(0xC8 - t*0x50)
          const sg = Math.round(0x82 - t*0x36)
          const sb = Math.round(0x2A - t*0x14)
          terrG.beginFill((sr<<16)|(sg<<8)|sb)
          terrG.drawPolygon([
            cTL.x-TW/2, cTL.y+i,
            cBL.x-TW/2, cBL.y+TH/2+i,
            cBL.x-TW/2, cBL.y+TH/2+i+1,
            cTL.x-TW/2, cTL.y+i+1,
          ])
          terrG.endFill()
        }
        // right soil gradient
        for (let i = 0; i < SOIL; i++) {
          const t = i/SOIL
          const sr = Math.round(0x8B - t*0x38)
          const sg = Math.round(0x5A - t*0x28)
          const sb = Math.round(0x1A - t*0x0C)
          terrG.beginFill((sr<<16)|(sg<<8)|sb)
          terrG.drawPolygon([
            cTR.x+TW/2, cTR.y+i,
            cBR.x+TW/2, cBR.y+TH/2+i,
            cBR.x+TW/2, cBR.y+TH/2+i+1,
            cTR.x+TW/2, cTR.y+i+1,
          ])
          terrG.endFill()
        }
        // bottom soil
        terrG.beginFill(0x3D2208)
        terrG.drawPolygon([
          cBL.x-TW/2, cBL.y+TH/2,
          OX, tipY,
          cBR.x+TW/2, cBR.y+TH/2,
          cBR.x+TW/2, cBR.y+TH/2+SOIL,
          OX, tipY+SOIL,
          cBL.x-TW/2, cBL.y+TH/2+SOIL,
        ])
        terrG.endFill()

        // pebble texture on soil edges
        const rngPeb = mkRng(77)
        for (let i = 0; i < 28; i++) {
          const t = rngPeb()
          const pebX = cBL.x - TW/2 + t*(OX - cBL.x + TW/2) * 2
          const pebY = cBL.y + TH/2 + rngPeb() * SOIL * 0.7
          terrG.beginFill(0x4A2C10, 0.5)
          terrG.drawEllipse(pebX, pebY, 4+rngPeb()*5, 2+rngPeb()*2)
          terrG.endFill()
        }

        // grass tiles - NO checkerboard, smooth variation
        const tiles: {col:number,row:number}[] = []
        for (let row = 0; row < ROWS; row++)
          for (let col = 0; col < COLS; col++)
            tiles.push({col,row})
        tiles.sort((a,b) => (a.col+a.row)-(b.col+b.row))

        for (const {col,row} of tiles) {
          const pos = iso(col,row)
          // smooth organic noise - not checkerboard
          const n = (Math.sin(col*1.9+row*1.3)*0.5 + Math.cos(col*2.3-row*1.7)*0.5)
          const base = 0x6EC647
          const br2 = ((base>>16)&0xFF), bg2 = ((base>>8)&0xFF), bb2 = base&0xFF
          const vary = n * 9
          // top-left bright lighting
          const lx = (pos.x-OX)/(width*0.45)
          const ly = (pos.y-OY)/(height*0.45)
          const lit = 1 + lx*0.06 - ly*0.025
          const tR = Math.min(255,Math.max(0,Math.round((br2+vary)*lit)))
          const tG = Math.min(255,Math.max(0,Math.round((bg2+vary)*lit)))
          const tB = Math.min(255,Math.max(0,Math.round((bb2+vary*0.4)*lit)))
          terrG.beginFill((tR<<16)|(tG<<8)|tB)
          terrG.lineStyle(0.12, 0x48922A, 0.2)
          terrG.drawPolygon([
            pos.x, pos.y-TH/2,
            pos.x+TW/2, pos.y,
            pos.x, pos.y+TH/2,
            pos.x-TW/2, pos.y,
          ])
          terrG.endFill()
          terrG.lineStyle(0)
        }

        // grass shine
        terrG.beginFill(0xD4F4A0, 0.08)
        terrG.drawPolygon([
          cTL.x, cTL.y-TH/2,
          OX*0.55, OY+height*0.04,
          iso(2,5).x, iso(2,5).y+TH/2,
          cTL.x-TW/2, cTL.y+TH,
        ])
        terrG.endFill()

        // grass tufts along edges
        const rngTuft = mkRng(33)
        for (let i = 0; i < 22; i++) {
          const col = Math.floor(rngTuft() * COLS)
          const row = Math.floor(rngTuft() * ROWS)
          if (col > 0 && col < COLS-1 && row > 0 && row < ROWS-1) continue
          const pos = iso(col, row)
          const tG2 = new PIXI.Graphics()
          renderGrassTuft(tG2, 0.55 + rngTuft() * 0.3)
          tG2.x = pos.x + (rngTuft()-0.5)*TW*0.6
          tG2.y = pos.y + TH/2 + (rngTuft()-0.5)*TH*0.4
          terrG.addChild ? null : null
          worldLayer.addChild(tG2)
        }

        // cache terrain as bitmap for perf
        terrG.cacheAsBitmap = true
        worldLayer.addChild(terrG)

        // ─────────────── DECORATION - ground decorations ───────────────
        const rngDec = mkRng(99)
        const decorTiles = []
        for (let row = 1; row < ROWS-1; row++)
          for (let col = 1; col < COLS-1; col++)
            decorTiles.push({col,row})

        // scatter mushrooms and flowers
        for (let i = 0; i < 6; i++) {
          const idx = Math.floor(rngDec() * decorTiles.length)
          const {col,row} = decorTiles[idx]
          const pos = iso(col,row)
          const mG = new PIXI.Graphics()
          const mType = rngDec() > 0.5 ? 'red' : 'small'
          renderMushroom(mG, 0.7 + rngDec()*0.3, mType as 'red'|'small')
          mG.x = pos.x + (rngDec()-0.5)*TW*0.7
          mG.y = pos.y + TH/2 + (rngDec()-0.5)*TH*0.4
          mG.zIndex = pos.y + TH/2
          worldLayer.addChild(mG)
        }

        // ─────────────── TREES ───────────────
        const aliveTrees = trees.filter(t => t.status === 'alive')
        const deadTrees  = trees.filter(t => t.status === 'dead')
        const allTrees   = [...aliveTrees, ...deadTrees]

        const rng = mkRng(42)
        // valid inner tiles
        const validTiles: {col:number,row:number}[] = []
        for (let row = 1; row < ROWS-1; row++)
          for (let col = 1; col < COLS-1; col++) {
            if ((col===1&&row===1)||(col===COLS-2&&row===1)||
                (col===1&&row===ROWS-2)||(col===COLS-2&&row===ROWS-2)) continue
            validTiles.push({col,row})
          }

        // shuffle
        for (let i = validTiles.length-1; i > 0; i--) {
          const j = Math.floor(rng()*(i+1));
          [validTiles[i],validTiles[j]] = [validTiles[j],validTiles[i]]
        }

        // center-cluster sort
        const cC = COLS/2, cR = ROWS/2
        validTiles.sort((a,b) => {
          const dA = (a.col-cC)**2 + (a.row-cR)**2 + Math.sin(a.col*4.1+a.row*2.3)*2.5
          const dB = (b.col-cC)**2 + (b.row-cR)**2 + Math.sin(b.col*4.1+b.row*2.3)*2.5
          return dA-dB
        })

        // place trees sorted back→front
        const placed = allTrees.map((tree,i) => {
          const tile = validTiles[i % validTiles.length]
          return { tree, tile, depth: tile.col + tile.row }
        })
        placed.sort((a,b) => a.depth - b.depth)

        worldLayer.sortableChildren = true
        const treeCont: {c: any, baseRot: number}[] = []

        placed.forEach(({tree, tile}, i) => {
          const rngL = mkRng(i*41+7)
          const tPos = iso(tile.col, tile.row)
          const jx = (rngL()-0.5)*TW*0.48
          const jy = (rngL()-0.5)*TH*0.42
          const depthSc = 0.72 + (tile.row/ROWS)*0.32
          const randSc  = 0.86 + rngL()*0.28
          const finalSc = depthSc * randSc
          const baseRot = (rngL()-0.5)*0.055

          const cont = new PIXI.Container()
          cont.x = tPos.x + jx
          cont.y = tPos.y + TH/2 + jy
          cont.rotation = baseRot
          cont.zIndex = tPos.y + TH/2 + jy

          const tG = new PIXI.Graphics()
          renderTree(tG, tree.tree_type, finalSc)
          // cache each tree as bitmap - massive perf win
          tG.cacheAsBitmap = true
          cont.addChild(tG)

          cont.scale.set(0)
          cont.alpha = 0
          worldLayer.addChild(cont)
          treeCont.push({c: cont, baseRot})

          // spring bounce entrance
          let elapsed = 0
          const delay = i * 0.04
          const tick = (delta: number) => {
            elapsed += delta/60
            if (elapsed < delay) return
            const p = Math.min((elapsed-delay)/0.5, 1)
            const ease = p < 0.5 ? 4*p**3 : 1-(-2*p+2)**3/2
            cont.scale.set(p < 0.75 ? ease*1.12 : ease)
            cont.alpha = Math.min(p*2.8, 1)
            if (p >= 1) { cont.scale.set(1); cont.alpha = 1; app.ticker.remove(tick) }
          }
          app.ticker.add(tick)
        })

        // empty forest hint
        if (allTrees.length === 0) {
          const hint = new PIXI.Text('Complete tasks to grow your forest 🌱', {
            fontFamily: 'Arial', fontSize: 11, fill: 0x2D6B2D, align: 'center'
          })
          hint.anchor.set(0.5)
          hint.x = width/2; hint.y = height*0.64
          worldLayer.addChild(hint)
        }

        // ─────────────── WIND SWAY ───────────────
        treeCont.forEach(({c, baseRot}, i) => {
          const phase = i * 0.37
          const amt = 0.007 + Math.abs(Math.sin(i*1.9))*0.004
          app.ticker.add(() => {
            const t = performance.now()/1000 * 0.5
            c.rotation = baseRot + Math.sin(t+phase)*amt
          })
        })

        // ─────────────── AMBIENT FX ───────────────
        if (aliveTrees.length >= 3) {
          const bf = new PIXI.Text('🦋', {fontSize:14})
          bf.x = width*0.35; bf.y = height*0.5
          fxLayer.addChild(bf)
          app.ticker.add(() => {
            const t = performance.now()/1000
            bf.x = width*0.35 + Math.sin(t*1.05)*26
            bf.y = height*0.5 + Math.sin(t*0.68)*15
          })
        }
        if (aliveTrees.length >= 8) {
          const bird = new PIXI.Text('🐦',{fontSize:13})
          bird.x = width*0.72; bird.y = height*0.22
          fxLayer.addChild(bird)
          app.ticker.add(() => {
            const t = performance.now()/1000
            bird.x = width*0.72 + Math.sin(t*0.72)*34
            bird.y = height*0.22 + Math.sin(t*0.4)*17
          })
        }
        if (aliveTrees.length >= 15) {
          const deer = new PIXI.Text('🦌',{fontSize:14})
          deer.x = width*0.2; deer.y = height*0.55
          fxLayer.addChild(deer)
          app.ticker.add(() => {
            const t = performance.now()/1000
            deer.x = width*0.2 + Math.sin(t*0.3)*20
          })
        }

        // ─────────────── MASTER FLOAT ───────────────
        app.ticker.add(() => {
          const t = performance.now()/1000
          worldLayer.y = Math.sin(t*0.52)*4.5
          clouds[0].x = width*0.12 + Math.sin(t*0.36)*16
          clouds[1].x = width*0.50 + Math.sin(t*0.26+1.9)*12
          clouds[2].x = width*0.30 + Math.sin(t*0.2+3.2)*9
          sunCont.scale.set(1 + Math.sin(t*0.58)*0.038)
        })

      } catch(e) {
        console.error('PixiForest:', e)
      }
    }

    boot()
    return () => {
      dead = true
      if (appRef.current) {
        try { appRef.current.destroy(true) } catch {}
        appRef.current = null
      }
    }
  }, [trees])

  return (
    <div ref={mountRef} style={{
      width:'100%', borderRadius:'20px', overflow:'hidden',
      minHeight:`${height}px`,
      background:'linear-gradient(180deg,#44AAD8 0%,#7ACCE8 48%,#B4E8CC 100%)'
    }}/>
  )
}