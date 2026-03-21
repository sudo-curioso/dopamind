// Ambient sound engine — pure Web Audio API, no external files
// Generates rain, forest, ocean waves, and white noise in-browser.

export type SoundMode = 'off' | 'rain' | 'forest' | 'waves' | 'noise'

export const SOUND_OPTIONS: { mode: SoundMode; icon: string; label: string }[] = [
  { mode: 'off',    icon: '🔇', label: 'Silent'  },
  { mode: 'rain',   icon: '🌧️', label: 'Rain'    },
  { mode: 'forest', icon: '🌿', label: 'Forest'  },
  { mode: 'waves',  icon: '🌊', label: 'Waves'   },
  { mode: 'noise',  icon: '☁️', label: 'Focus'   },
]

export class AmbientSoundPlayer {
  private ctx: AudioContext | null = null
  private masterGain: GainNode | null = null
  private sources: (AudioBufferSourceNode | OscillatorNode)[] = []
  private nodes: AudioNode[] = []
  currentMode: SoundMode = 'off'

  private getCtx(): AudioContext {
    if (!this.ctx || this.ctx.state === 'closed') {
      this.ctx = new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
    }
    if (this.ctx.state === 'suspended') this.ctx.resume()
    return this.ctx
  }

  // ── Noise buffers ─────────────────────────────────────────────────────────

  private whiteNoiseBuf(ctx: AudioContext): AudioBuffer {
    const len = 2 * ctx.sampleRate
    const buf = ctx.createBuffer(1, len, ctx.sampleRate)
    const d   = buf.getChannelData(0)
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1
    return buf
  }

  // Brown noise: each sample = weighted average of previous + small random step
  private brownNoiseBuf(ctx: AudioContext): AudioBuffer {
    const len = 4 * ctx.sampleRate
    const buf = ctx.createBuffer(1, len, ctx.sampleRate)
    const d   = buf.getChannelData(0)
    let last  = 0
    for (let i = 0; i < len; i++) {
      const w = Math.random() * 2 - 1
      d[i]    = (last + 0.02 * w) / 1.02
      last    = d[i]
      d[i]   *= 3.5
    }
    return buf
  }

  private makeSrc(ctx: AudioContext, buf: AudioBuffer): AudioBufferSourceNode {
    const src = ctx.createBufferSource()
    src.buffer = buf
    src.loop   = true
    return src
  }

  // ── Public API ────────────────────────────────────────────────────────────

  play(mode: SoundMode, volume = 0.38) {
    if (mode === 'off') { this.stop(); return }
    if (mode === this.currentMode) return

    this.stopImmediate()
    this.currentMode = mode

    const ctx  = this.getCtx()
    const mg   = ctx.createGain()
    mg.gain.setValueAtTime(0, ctx.currentTime)
    mg.gain.linearRampToValueAtTime(volume, ctx.currentTime + 1.8)
    mg.connect(ctx.destination)
    this.masterGain = mg
    this.nodes.push(mg)

    if (mode === 'rain') {
      // White noise → lowpass → gain
      const src    = this.makeSrc(ctx, this.whiteNoiseBuf(ctx))
      const lpf    = ctx.createBiquadFilter()
      lpf.type     = 'lowpass'
      lpf.frequency.value = 1300
      lpf.Q.value  = 0.4
      src.connect(lpf); lpf.connect(mg)
      src.start()
      this.sources.push(src); this.nodes.push(lpf)
    }

    if (mode === 'forest') {
      // Brown noise (distant rumble) + bandpass white noise (leaf rustle)
      const brown     = this.makeSrc(ctx, this.brownNoiseBuf(ctx))
      const brownGain = ctx.createGain()
      brownGain.gain.value = 0.22
      brown.connect(brownGain); brownGain.connect(mg)
      brown.start()
      this.sources.push(brown); this.nodes.push(brownGain)

      const white  = this.makeSrc(ctx, this.whiteNoiseBuf(ctx))
      const bpf    = ctx.createBiquadFilter()
      bpf.type     = 'bandpass'
      bpf.frequency.value = 3800
      bpf.Q.value  = 0.9
      const leafGain = ctx.createGain()
      leafGain.gain.value = 0.12
      white.connect(bpf); bpf.connect(leafGain); leafGain.connect(mg)
      white.start()
      this.sources.push(white); this.nodes.push(bpf, leafGain)
    }

    if (mode === 'waves') {
      // Brown noise → deep lowpass → LFO on gain (0.1 Hz = slow wave rhythm)
      const src    = this.makeSrc(ctx, this.brownNoiseBuf(ctx))
      const lpf    = ctx.createBiquadFilter()
      lpf.type     = 'lowpass'
      lpf.frequency.value = 500
      const wGain  = ctx.createGain()
      wGain.gain.value = 0.55
      src.connect(lpf); lpf.connect(wGain); wGain.connect(mg)
      src.start()
      this.sources.push(src); this.nodes.push(lpf, wGain)

      // LFO modulates gain to create "wave crash" rhythm
      const lfo    = ctx.createOscillator()
      lfo.frequency.value = 0.11
      const lfoGain = ctx.createGain()
      lfoGain.gain.value = 0.28
      lfo.connect(lfoGain); lfoGain.connect(wGain.gain)
      lfo.start()
      this.sources.push(lfo); this.nodes.push(lfoGain)
    }

    if (mode === 'noise') {
      // Pure white noise (narrow band, concentration aid)
      const src  = this.makeSrc(ctx, this.whiteNoiseBuf(ctx))
      const hpf  = ctx.createBiquadFilter()
      hpf.type   = 'highpass'
      hpf.frequency.value = 300
      src.connect(hpf); hpf.connect(mg)
      src.start()
      this.sources.push(src); this.nodes.push(hpf)
    }
  }

  stop() {
    if (!this.ctx || !this.masterGain) { this.currentMode = 'off'; return }
    const ctx = this.ctx
    const mg  = this.masterGain
    mg.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.9)
    setTimeout(() => this.stopImmediate(), 950)
    this.currentMode = 'off'
  }

  private stopImmediate() {
    this.sources.forEach(s => { try { s.stop() } catch {} })
    this.sources = []
    this.nodes   = []
    this.masterGain = null
  }

  setVolume(v: number) {
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.linearRampToValueAtTime(v, this.ctx.currentTime + 0.3)
    }
  }

  destroy() {
    this.stop()
    setTimeout(() => {
      try { this.ctx?.close() } catch {}
      this.ctx = null
    }, 1100)
  }
}
