// Synthesized sound effects and BGM using Web Audio API

function scheduleOsc(
  ctx: AudioContext,
  dest: AudioNode,
  type: OscillatorType,
  freq: number,
  vol: number,
  startTime: number,
  duration: number,
): void {
  if (freq <= 0 || vol <= 0) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(vol, startTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
  osc.connect(gain);
  gain.connect(dest);
  osc.start(startTime);
  osc.stop(startTime + duration + 0.005);
}

function scheduleNoise(
  ctx: AudioContext,
  dest: AudioNode,
  cutoff: number,
  vol: number,
  startTime: number,
  duration: number,
): void {
  const bufSize = Math.ceil(ctx.sampleRate * duration);
  const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < bufSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  const src = ctx.createBufferSource();
  src.buffer = buf;
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = cutoff;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(vol, startTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
  src.connect(filter);
  filter.connect(gain);
  gain.connect(dest);
  src.start(startTime);
}

// ─── Sound Effects ────────────────────────────────────────────────────────────

export function sfxMove(ctx: AudioContext, dest: AudioNode): void {
  scheduleOsc(ctx, dest, 'square', 200, 0.06, ctx.currentTime, 0.04);
}

export function sfxRotate(ctx: AudioContext, dest: AudioNode): void {
  const t = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'square';
  osc.frequency.setValueAtTime(330, t);
  osc.frequency.exponentialRampToValueAtTime(500, t + 0.07);
  gain.gain.setValueAtTime(0.09, t);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.07);
  osc.connect(gain);
  gain.connect(dest);
  osc.start(t);
  osc.stop(t + 0.08);
}

export function sfxLand(ctx: AudioContext, dest: AudioNode): void {
  scheduleNoise(ctx, dest, 160, 0.28, ctx.currentTime, 0.07);
}

export function sfxHardDrop(ctx: AudioContext, dest: AudioNode): void {
  const t = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(90, t);
  osc.frequency.exponentialRampToValueAtTime(35, t + 0.12);
  gain.gain.setValueAtTime(0.28, t);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.14);
  osc.connect(gain);
  gain.connect(dest);
  osc.start(t);
  osc.stop(t + 0.16);
  scheduleNoise(ctx, dest, 500, 0.38, t, 0.05);
}

export function sfxClear(ctx: AudioContext, dest: AudioNode, chain: number): void {
  const t = ctx.currentTime;
  const base = 300 + chain * 60;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'square';
  osc.frequency.setValueAtTime(base, t);
  osc.frequency.exponentialRampToValueAtTime(base * 2.8, t + 0.27);
  gain.gain.setValueAtTime(0.18, t);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.30);
  osc.connect(gain);
  gain.connect(dest);
  osc.start(t);
  osc.stop(t + 0.32);
}

// C major pentatonic ascending
const CHAIN_NOTES = [261.63, 329.63, 392.00, 523.25, 659.25, 784.00, 1046.5, 1318.5];

export function sfxChain(ctx: AudioContext, dest: AudioNode, chain: number): void {
  const count = Math.min(chain + 1, CHAIN_NOTES.length);
  const pitchBoost = Math.pow(1.1, chain - 2);
  for (let i = 0; i < count; i++) {
    const t = ctx.currentTime + i * 0.055;
    scheduleOsc(ctx, dest, 'square', Math.min(CHAIN_NOTES[i] * pitchBoost, 3000), 0.13, t, 0.1);
  }
}

export function sfxGameOver(ctx: AudioContext, dest: AudioNode): void {
  const freqs = [523.25, 440.00, 369.99, 311.13, 261.63, 220.00, 174.61];
  freqs.forEach((f, i) => {
    scheduleOsc(ctx, dest, 'square', f, 0.18, ctx.currentTime + i * 0.14, 0.17);
  });
}

export function sfxLevelUp(ctx: AudioContext, dest: AudioNode): void {
  const freqs = [261.63, 329.63, 392.00, 523.25, 659.25, 784.00];
  freqs.forEach((f, i) => {
    const isLast = i === freqs.length - 1;
    scheduleOsc(ctx, dest, 'square', f, 0.2, ctx.currentTime + i * 0.065, isLast ? 0.38 : 0.09);
  });
}

// ─── BGM ─────────────────────────────────────────────────────────────────────

const BPM = 156;
const S16 = (60 / BPM) / 4; // seconds per sixteenth note ≈ 0.096s

// Melody in C major pentatonic (C D E G A)
// Each entry: [frequency (0=rest), duration in sixteenth notes]
const MELODY_SEQ: [number, number][] = [
  // Bar 1
  [659.25, 2], [783.99, 2], [880.00, 2], [783.99, 2],
  [659.25, 2], [587.33, 2], [659.25, 2], [523.25, 2],
  // Bar 2
  [587.33, 2], [659.25, 2], [783.99, 2], [659.25, 2],
  [587.33, 2], [523.25, 2], [587.33, 2], [659.25, 2],
  // Bar 3
  [880.00, 4], [783.99, 2], [659.25, 2], [783.99, 4], [659.25, 4],
  // Bar 4
  [587.33, 2], [659.25, 2], [587.33, 2], [523.25, 2], [659.25, 4], [0, 4],
];
// Count: 16 + 16 + (4+2+2+4+4) + (2+2+2+2+4+4) = 16+16+16+16 = 64 sixteenths

const BASS_SEQ: [number, number][] = [
  // Bar 1 (C): C3 - G2 alternating
  [130.81, 4], [0, 2], [98.00, 4], [0, 2], [130.81, 4],
  // Bar 2 (Am): A2 repeated
  [110.00, 4], [0, 2], [110.00, 4], [0, 2], [110.00, 4],
  // Bar 3 (F): F2 - C3
  [87.31, 4], [0, 2], [130.81, 4], [0, 2], [87.31, 4],
  // Bar 4 (G): G2
  [98.00, 4], [0, 2], [98.00, 4], [0, 2], [98.00, 4],
];
// Count each bar: 4+2+4+2+4=16 → 4 bars = 64 ✓

const HARM_SEQ: [number, number][] = [
  // Sustained chord notes (triangle for warmth)
  [392.00, 8], [440.00, 8],   // Bar 1: G4, A4
  [392.00, 8], [329.63, 8],   // Bar 2: G4, E4
  [349.23, 8], [392.00, 8],   // Bar 3: F4, G4
  [392.00, 8], [392.00, 8],   // Bar 4: G4
];
// Count: 8+8 per bar × 4 bars = 64 ✓

function seqDuration(seq: [number, number][]): number {
  return seq.reduce((sum, [, dur]) => sum + dur * S16, 0);
}

export class BgmPlayer {
  private ctx: AudioContext;
  private dest: AudioNode;
  private timerRef: ReturnType<typeof setTimeout> | null = null;
  active = false;

  constructor(ctx: AudioContext, dest: AudioNode) {
    this.ctx = ctx;
    this.dest = dest;
  }

  start(): void {
    if (this.active) return;
    this.active = true;
    this.scheduleFrom(this.ctx.currentTime + 0.05);
  }

  stop(): void {
    this.active = false;
    if (this.timerRef !== null) {
      clearTimeout(this.timerRef);
      this.timerRef = null;
    }
  }

  private scheduleFrom(startTime: number): void {
    if (!this.active) return;

    let mt = startTime;
    for (const [freq, dur] of MELODY_SEQ) {
      if (freq > 0) scheduleOsc(this.ctx, this.dest, 'square', freq, 0.055, mt, dur * S16 * 0.8);
      mt += dur * S16;
    }

    let bt = startTime;
    for (const [freq, dur] of BASS_SEQ) {
      if (freq > 0) scheduleOsc(this.ctx, this.dest, 'triangle', freq, 0.06, bt, dur * S16 * 0.85);
      bt += dur * S16;
    }

    let ht = startTime;
    for (const [freq, dur] of HARM_SEQ) {
      if (freq > 0) scheduleOsc(this.ctx, this.dest, 'triangle', freq, 0.04, ht, dur * S16 * 0.88);
      ht += dur * S16;
    }

    const loopLen = seqDuration(MELODY_SEQ);
    const nextStart = startTime + loopLen;
    const msUntilNext = (nextStart - this.ctx.currentTime - 0.15) * 1000;

    this.timerRef = setTimeout(() => {
      this.scheduleFrom(nextStart);
    }, Math.max(0, msUntilNext));
  }
}
