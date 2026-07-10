// ========================================
// AETHERMOOR AUDIO ENGINE
// ========================================
// Procedural audio using Web Audio API — no external files needed.
// Provides battle sounds, ambient music, story narration cues, and UI sounds.

let audioCtx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let musicGain: GainNode | null = null;
let sfxGain: GainNode | null = null;
let initialized = false;

// Non-null aliases used only inside functions that already check for null
function sfx(): GainNode { return sfxGain!; }
function mus(): GainNode { return musicGain!; }

// Persistent music nodes
let musicOscillators: OscillatorNode[] = [];
let musicLFOs: OscillatorNode[] = [];
let musicGainNodes: GainNode[] = [];
let isMusicPlaying = false;
let musicTimeout: ReturnType<typeof setTimeout> | null = null;

// Volume levels
const MUSIC_VOLUME = 0.06;
const SFX_VOLUME = 0.25;
const UI_VOLUME = 0.15;

function getContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    try {
      audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      masterGain = audioCtx.createGain();
      masterGain.gain.value = 1.0;
      masterGain.connect(audioCtx.destination);

      musicGain = audioCtx.createGain();
      musicGain.gain.value = MUSIC_VOLUME;
      musicGain.connect(masterGain);

      sfxGain = audioCtx.createGain();
      sfxGain.gain.value = SFX_VOLUME;
      sfxGain.connect(masterGain);
    } catch {
      return null;
    }
  }
  // Resume if suspended (browser autoplay policy)
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// ========================================
// INITIALIZATION
// ========================================

export function initAudio(): void {
  if (initialized) return;
  const ctx = getContext();
  if (!ctx) return;
  initialized = true;
}

export function resumeAudio(): void {
  const ctx = getContext();
  if (ctx && ctx.state === 'suspended') {
    ctx.resume();
  }
}

// ========================================
// VOLUME CONTROL
// ========================================

export function setMusicVolume(v: number): void {
  if (musicGain) musicGain.gain.value = Math.max(0, Math.min(1, v)) * MUSIC_VOLUME / 0.06;
}

export function setSFXVolume(v: number): void {
  if (sfxGain) sfxGain.gain.value = Math.max(0, Math.min(1, v)) * SFX_VOLUME / 0.25;
}

export function setMasterVolume(v: number): void {
  if (masterGain) masterGain.gain.value = Math.max(0, Math.min(1, v));
}

// ========================================
// HELPER: Create noise buffer
// ========================================

function createNoiseBuffer(ctx: AudioContext, duration: number): AudioBuffer {
  const length = ctx.sampleRate * duration;
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i++) {
    data[i] = (Math.random() * 2 - 1) * 0.5;
  }
  return buffer;
}

// ========================================
// UI SOUNDS
// ========================================

export function playClick(): void {
  const ctx = getContext();
  if (!ctx || !sfxGain) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(800, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.06);
  gain.gain.setValueAtTime(UI_VOLUME * 0.5, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
  osc.connect(gain).connect(sfx());
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.1);
}

export function playSelect(): void {
  const ctx = getContext();
  if (!ctx || !sfxGain) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(600, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.08);
  gain.gain.setValueAtTime(UI_VOLUME * 0.4, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
  osc.connect(gain).connect(sfx());
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.15);
}

export function playDeploy(): void {
  const ctx = getContext();
  if (!ctx || !sfxGain) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(200, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(350, ctx.currentTime + 0.15);
  gain.gain.setValueAtTime(UI_VOLUME * 0.3, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
  osc.connect(gain).connect(sfx());
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.25);
}

export function playPhaseChange(): void {
  const ctx = getContext();
  if (!ctx || !sfxGain) return;

  // Whoosh-like sweep
  const noise = ctx.createBufferSource();
  noise.buffer = createNoiseBuffer(ctx, 0.3);
  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(300, ctx.currentTime);
  filter.frequency.exponentialRampToValueAtTime(2000, ctx.currentTime + 0.2);
  filter.Q.value = 2;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(UI_VOLUME * 0.3, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
  noise.connect(filter).connect(gain).connect(sfx());
  noise.start(ctx.currentTime);
  noise.stop(ctx.currentTime + 0.35);
}

// ========================================
// BATTLE SOUNDS
// ========================================

export function playDiceRoll(): void {
  const ctx = getContext();
  if (!ctx || !sfxGain) return;

  // Series of quick clicks like dice hitting a table
  for (let i = 0; i < 6; i++) {
    const delay = i * 0.05 + Math.random() * 0.03;
    const noise = ctx.createBufferSource();
    noise.buffer = createNoiseBuffer(ctx, 0.04);
    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 2000 + Math.random() * 3000;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, ctx.currentTime + delay);
    gain.gain.linearRampToValueAtTime(SFX_VOLUME * 0.4, ctx.currentTime + delay + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.04);
    noise.connect(filter).connect(gain).connect(sfx());
    noise.start(ctx.currentTime + delay);
    noise.stop(ctx.currentTime + delay + 0.06);
  }
}

export function playSwordClash(): void {
  const ctx = getContext();
  if (!ctx || !sfxGain) return;

  // Metallic clang: high-frequency burst + resonance
  const noise = ctx.createBufferSource();
  noise.buffer = createNoiseBuffer(ctx, 0.15);
  const highpass = ctx.createBiquadFilter();
  highpass.type = 'highpass';
  highpass.frequency.value = 3000;
  const bandpass = ctx.createBiquadFilter();
  bandpass.type = 'bandpass';
  bandpass.frequency.value = 5000;
  bandpass.Q.value = 3;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(SFX_VOLUME * 0.7, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

  // Add metallic resonance
  const osc = ctx.createOscillator();
  osc.type = 'square';
  osc.frequency.setValueAtTime(2500 + Math.random() * 500, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.2);
  const oscGain = ctx.createGain();
  oscGain.gain.setValueAtTime(SFX_VOLUME * 0.2, ctx.currentTime);
  oscGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);

  noise.connect(highpass).connect(bandpass).connect(gain).connect(sfx());
  osc.connect(oscGain).connect(sfx());
  noise.start(ctx.currentTime);
  noise.stop(ctx.currentTime + 0.2);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.25);
}

export function playBattleWin(): void {
  const ctx = getContext();
  if (!ctx || !sfxGain) return;

  // Short triumphant ascending tone
  const notes = [523.25, 659.25, 783.99]; // C5, E5, G5 - major triad
  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.value = freq;
    const startTime = ctx.currentTime + i * 0.08;
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(SFX_VOLUME * 0.3, startTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.5);
    osc.connect(gain).connect(sfx());
    osc.start(startTime);
    osc.stop(startTime + 0.55);
  });
}

export function playBattleLose(): void {
  const ctx = getContext();
  if (!ctx || !sfxGain) return;

  // Descending minor sound
  const notes = [440, 370, 311.13]; // A4, F#4, Eb4 - diminished
  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.value = freq;
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 1200;
    const startTime = ctx.currentTime + i * 0.1;
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(SFX_VOLUME * 0.15, startTime + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.4);
    osc.connect(filter).connect(gain).connect(sfx());
    osc.start(startTime);
    osc.stop(startTime + 0.45);
  });
}

export function playConquest(): void {
  const ctx = getContext();
  if (!ctx || !sfxGain) return;

  // Trumpet-like fanfare: bright sawtooth with fast attack
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(220, ctx.currentTime);
  osc.frequency.setValueAtTime(330, ctx.currentTime + 0.1);
  osc.frequency.setValueAtTime(440, ctx.currentTime + 0.2);
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(600, ctx.currentTime);
  filter.frequency.exponentialRampToValueAtTime(1500, ctx.currentTime + 0.25);
  filter.Q.value = 2;
  gain.gain.setValueAtTime(SFX_VOLUME * 0.5, ctx.currentTime);
  gain.gain.setValueAtTime(SFX_VOLUME * 0.6, ctx.currentTime + 0.15);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.7);
  osc.connect(filter).connect(gain).connect(sfx());
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.75);

  // Second layer: higher harmony
  const osc2 = ctx.createOscillator();
  const gain2 = ctx.createGain();
  osc2.type = 'square';
  osc2.frequency.setValueAtTime(440, ctx.currentTime + 0.15);
  osc2.frequency.setValueAtTime(660, ctx.currentTime + 0.25);
  const filter2 = ctx.createBiquadFilter();
  filter2.type = 'lowpass';
  filter2.frequency.value = 2000;
  gain2.gain.setValueAtTime(0, ctx.currentTime + 0.15);
  gain2.gain.linearRampToValueAtTime(SFX_VOLUME * 0.2, ctx.currentTime + 0.2);
  gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
  osc2.connect(filter2).connect(gain2).connect(sfx());
  osc2.start(ctx.currentTime + 0.15);
  osc2.stop(ctx.currentTime + 0.65);
}

export function playElimination(): void {
  const ctx = getContext();
  if (!ctx || !sfxGain) return;

  // Dramatic low rumble + descending tone
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(120, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 1.0);
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 400;
  gain.gain.setValueAtTime(SFX_VOLUME * 0.4, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.0);
  osc.connect(filter).connect(gain).connect(sfx());
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 1.1);

  // Noise rumble
  const noise = ctx.createBufferSource();
  noise.buffer = createNoiseBuffer(ctx, 0.8);
  const noiseFilter = ctx.createBiquadFilter();
  noiseFilter.type = 'lowpass';
  noiseFilter.frequency.setValueAtTime(200, ctx.currentTime);
  noiseFilter.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.8);
  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(SFX_VOLUME * 0.3, ctx.currentTime);
  noiseGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
  noise.connect(noiseFilter).connect(noiseGain).connect(sfx());
  noise.start(ctx.currentTime);
  noise.stop(ctx.currentTime + 0.9);
}

export function playVictory(): void {
  const ctx = getContext();
  if (!ctx || !sfxGain) return;

  // Full victory fanfare
  const melody = [
    { freq: 523.25, time: 0, dur: 0.2 },     // C5
    { freq: 659.25, time: 0.2, dur: 0.2 },   // E5
    { freq: 783.99, time: 0.4, dur: 0.3 },   // G5
    { freq: 1046.50, time: 0.7, dur: 0.6 },  // C6
  ];

  melody.forEach(({ freq, time, dur }) => {
    // Lead
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0, ctx.currentTime + time);
    gain.gain.linearRampToValueAtTime(SFX_VOLUME * 0.4, ctx.currentTime + time + 0.03);
    gain.gain.setValueAtTime(SFX_VOLUME * 0.4, ctx.currentTime + time + dur * 0.7);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + time + dur);
    osc.connect(gain).connect(sfx());
    osc.start(ctx.currentTime + time);
    osc.stop(ctx.currentTime + time + dur + 0.05);

    // Harmony (fifth above)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.value = freq * 1.5;
    gain2.gain.setValueAtTime(0, ctx.currentTime + time);
    gain2.gain.linearRampToValueAtTime(SFX_VOLUME * 0.15, ctx.currentTime + time + 0.03);
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + time + dur);
    osc2.connect(gain2).connect(sfx());
    osc2.start(ctx.currentTime + time);
    osc2.stop(ctx.currentTime + time + dur + 0.05);
  });
}

export function playTacticActivate(): void {
  const ctx = getContext();
  if (!ctx || !sfxGain) return;

  // Power-up sound: rising sweep with shimmer
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(200, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.3);
  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(400, ctx.currentTime);
  filter.frequency.exponentialRampToValueAtTime(3000, ctx.currentTime + 0.3);
  filter.Q.value = 5;
  gain.gain.setValueAtTime(SFX_VOLUME * 0.3, ctx.currentTime);
  gain.gain.setValueAtTime(SFX_VOLUME * 0.4, ctx.currentTime + 0.2);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
  osc.connect(filter).connect(gain).connect(sfx());
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.55);

  // Shimmer
  const osc2 = ctx.createOscillator();
  const gain2 = ctx.createGain();
  osc2.type = 'sine';
  osc2.frequency.value = 2000;
  gain2.gain.setValueAtTime(0, ctx.currentTime + 0.15);
  gain2.gain.linearRampToValueAtTime(SFX_VOLUME * 0.1, ctx.currentTime + 0.2);
  gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
  osc2.connect(gain2).connect(sfx());
  osc2.start(ctx.currentTime + 0.15);
  osc2.stop(ctx.currentTime + 0.45);
}

// ========================================
// STORY / NARRATION CUES
// ========================================

export function playStoryOpen(): void {
  const ctx = getContext();
  if (!ctx || !sfxGain) return;

  // Deep bass swell — cinematic story opening
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(55, ctx.currentTime);
  osc.frequency.linearRampToValueAtTime(65, ctx.currentTime + 0.5);
  osc.frequency.linearRampToValueAtTime(50, ctx.currentTime + 1.5);
  gain.gain.setValueAtTime(0, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(SFX_VOLUME * 0.5, ctx.currentTime + 0.5);
  gain.gain.setValueAtTime(SFX_VOLUME * 0.5, ctx.currentTime + 1.0);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.8);
  osc.connect(gain).connect(sfx());
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 2.0);

  // Ethereal high tone
  const osc2 = ctx.createOscillator();
  const gain2 = ctx.createGain();
  osc2.type = 'sine';
  osc2.frequency.value = 880;
  gain2.gain.setValueAtTime(0, ctx.currentTime + 0.3);
  gain2.gain.linearRampToValueAtTime(SFX_VOLUME * 0.08, ctx.currentTime + 0.6);
  gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);
  osc2.connect(gain2).connect(sfx());
  osc2.start(ctx.currentTime + 0.3);
  osc2.stop(ctx.currentTime + 1.6);
}

export function playStoryPage(): void {
  const ctx = getContext();
  if (!ctx || !sfxGain) return;

  // Soft chime for page advance
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.value = 660;
  gain.gain.setValueAtTime(SFX_VOLUME * 0.12, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
  osc.connect(gain).connect(sfx());
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.55);

  // Harmonic
  const osc2 = ctx.createOscillator();
  const gain2 = ctx.createGain();
  osc2.type = 'sine';
  osc2.frequency.value = 990; // perfect fifth
  gain2.gain.setValueAtTime(SFX_VOLUME * 0.06, ctx.currentTime + 0.05);
  gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
  osc2.connect(gain2).connect(sfx());
  osc2.start(ctx.currentTime + 0.05);
  osc2.stop(ctx.currentTime + 0.55);
}

export function playStoryClose(): void {
  const ctx = getContext();
  if (!ctx || !sfxGain) return;

  // Descending close — story ends
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(440, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.6);
  gain.gain.setValueAtTime(SFX_VOLUME * 0.15, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.7);
  osc.connect(gain).connect(sfx());
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.75);
}

// ========================================
// AMBIENT MUSIC
// ========================================

function startMusicLoop(): void {
  const ctx = getContext();
  if (!ctx || !musicGain || isMusicPlaying) return;
  isMusicPlaying = true;

  // Dark atmospheric drone: two detuned oscillators with slow modulation
  const baseFreq = 55; // A1 — deep and ominous

  // Oscillator 1: Deep drone
  const osc1 = ctx.createOscillator();
  osc1.type = 'sine';
  osc1.frequency.value = baseFreq;
  const gain1 = ctx.createGain();
  gain1.gain.value = 0.4;
  osc1.connect(gain1).connect(mus());

  // Oscillator 2: Slightly detuned for warmth
  const osc2 = ctx.createOscillator();
  osc2.type = 'sine';
  osc2.frequency.value = baseFreq * 1.005; // slight detune
  const gain2 = ctx.createGain();
  gain2.gain.value = 0.3;
  osc2.connect(gain2).connect(mus());

  // Oscillator 3: Fifth above, very quiet
  const osc3 = ctx.createOscillator();
  osc3.type = 'triangle';
  osc3.frequency.value = baseFreq * 1.5;
  const gain3 = ctx.createGain();
  gain3.gain.value = 0.08;
  const filter3 = ctx.createBiquadFilter();
  filter3.type = 'lowpass';
  filter3.frequency.value = 300;
  osc3.connect(filter3).connect(gain3).connect(mus());

  // LFO for subtle volume modulation on drone 1
  const lfo1 = ctx.createOscillator();
  lfo1.type = 'sine';
  lfo1.frequency.value = 0.08; // very slow
  const lfoGain1 = ctx.createGain();
  lfoGain1.gain.value = 0.1;
  lfo1.connect(lfoGain1).connect(gain1.gain);

  // LFO for filter modulation on osc3 (creates movement)
  const lfo2 = ctx.createOscillator();
  lfo2.type = 'sine';
  lfo2.frequency.value = 0.03;
  const lfoGain2 = ctx.createGain();
  lfoGain2.gain.value = 100;
  lfo2.connect(lfoGain2).connect(filter3.frequency);

  musicOscillators = [osc1, osc2, osc3];
  musicLFOs = [lfo1, lfo2];
  musicGainNodes = [gain1, gain2, gain3];

  // Start everything
  [osc1, osc2, osc3, lfo1, lfo2].forEach(o => o.start());

  // Schedule "mystical chime" events at random intervals
  scheduleMysticalChime();
}

function scheduleMysticalChime(): void {
  if (!isMusicPlaying) return;
  const interval = 6000 + Math.random() * 10000; // 6-16 seconds
  musicTimeout = setTimeout(() => {
    if (!isMusicPlaying) return;
    playMysticalChime();
    scheduleMysticalChime();
  }, interval);
}

function playMysticalChime(): void {
  const ctx = getContext();
  if (!ctx || !musicGain) return;

  // Random pentatonic note for mystical feel
  const pentatonic = [220, 261.63, 329.63, 392, 523.25, 659.25];
  const freq = pentatonic[Math.floor(Math.random() * pentatonic.length)];

  const osc = ctx.createOscillator();
  osc.type = 'sine';
  osc.frequency.value = freq;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 0.3);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.0);
  osc.connect(gain).connect(mus());
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 2.1);

  // Harmonic overtone
  if (Math.random() > 0.5) {
    const osc2 = ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.value = freq * 2;
    const gain2 = ctx.createGain();
    gain2.gain.setValueAtTime(0, ctx.currentTime + 0.1);
    gain2.gain.linearRampToValueAtTime(0.015, ctx.currentTime + 0.4);
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);
    osc2.connect(gain2).connect(mus());
    osc2.start(ctx.currentTime + 0.1);
    osc2.stop(ctx.currentTime + 1.6);
  }
}

function stopMusicLoop(): void {
  if (musicTimeout) {
    clearTimeout(musicTimeout);
    musicTimeout = null;
  }

  const ctx = getContext();
  if (!ctx) return;

  musicOscillators.forEach(osc => {
    try { osc.stop(); } catch { /* already stopped */ }
  });
  musicLFOs.forEach(osc => {
    try { osc.stop(); } catch { /* already stopped */ }
  });

  musicOscillators = [];
  musicLFOs = [];
  musicGainNodes = [];
  isMusicPlaying = false;
}

export function startMusic(): void {
  initAudio();
  startMusicLoop();
}

export function stopMusic(): void {
  stopMusicLoop();
}

export function isMusicActive(): boolean {
  return isMusicPlaying;
}

// ========================================
// AI DIALOGUE SOUND
// ========================================

export function playDialogueAppear(): void {
  const ctx = getContext();
  if (!ctx || !sfxGain) return;

  // Subtle "presence" sound — AI is speaking
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(300, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(450, ctx.currentTime + 0.15);
  gain.gain.setValueAtTime(SFX_VOLUME * 0.15, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
  osc.connect(gain).connect(sfx());
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.35);
}