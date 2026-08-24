// ========================================
// KHMER EMPIRE VOICE NARRATION SYSTEM
// ========================================
// Combines pre-recorded MP3 playback (intro) with Web Speech API TTS
// for all story pages and AI rival dialogue.

let introAudio: HTMLAudioElement | null = null;
let introPlaying = false;
let voiceEnabled = true;
let ttsUtterance: SpeechSynthesisUtterance | null = null;

// Voice character profiles for different speakers
const VOICE_PROFILES: Record<string, { pitch: number; rate: number; volume: number }> = {
  knight:    { pitch: 0.8, rate: 0.9, volume: 0.9 },   // Deep, measured
  mage:      { pitch: 1.1, rate: 0.85, volume: 0.85 }, // Slightly higher, deliberate
  rogue:     { pitch: 1.0, rate: 1.05, volume: 0.8 },  // Smooth, slightly fast
  paladin:   { pitch: 0.85, rate: 0.88, volume: 0.95 }, // Warm, resonant
  narrator:  { pitch: 0.9, rate: 0.82, volume: 0.9 },  // Classic narrator
  default:   { pitch: 0.95, rate: 0.9, volume: 0.85 },
};

// ========================================
// VOICE ENABLE/DISABLE
// ========================================

export function isVoiceEnabled(): boolean {
  return voiceEnabled;
}

export function toggleVoice(): boolean {
  voiceEnabled = !voiceEnabled;
  if (!voiceEnabled) {
    stopAll();
  }
  return voiceEnabled;
}

export function setVoiceEnabled(enabled: boolean): void {
  voiceEnabled = enabled;
  if (!enabled) stopAll();
}

// ========================================
// PRE-RECORDED INTRO NARRATION
// ========================================

/**
 * Play the intro narration MP3 during the prologue/character intro sequence.
 * The file is ~190 seconds. It fades in and can be stopped at any time.
 */
export function playIntroNarration(): void {
  if (!voiceEnabled) return;
  if (typeof window === 'undefined') return;

  stopIntroNarration();

  introAudio = new Audio('/game/audio/intro-narration.mp3');
  introAudio.volume = 0;
  introAudio.loop = false;

  // Fade in over 2 seconds
  const fadeIn = () => {
    if (!introAudio) return;
    const fadeInterval = setInterval(() => {
      if (!introAudio || introAudio.volume >= 0.7) {
        clearInterval(fadeInterval);
        return;
      }
      introAudio.volume = Math.min(0.7, introAudio.volume + 0.02);
    }, 40);
  };

  introAudio.addEventListener('canplaythrough', () => {
    introAudio?.play().then(fadeIn).catch(() => {});
  }, { once: true });

  introAudio.addEventListener('ended', () => {
    introPlaying = false;
  });

  introAudio.load();
  introPlaying = true;
}

export function stopIntroNarration(): void {
  if (introAudio) {
    // Quick fade out
    const fadeOut = () => {
      const fadeInterval = setInterval(() => {
        if (!introAudio || introAudio.volume <= 0.01) {
          clearInterval(fadeInterval);
          introAudio?.pause();
          introAudio = null;
          introPlaying = false;
          return;
        }
        introAudio.volume = Math.max(0, introAudio.volume - 0.05);
      }, 30);
    };
    fadeOut();
  }
}

export function isIntroPlaying(): boolean {
  return introPlaying;
}

// ========================================
// TEXT-TO-SPEECH FOR DIALOGUE
// ========================================

/**
 * Speak text using Web Speech API with character-appropriate voice settings.
 * Used for AI rival dialogue bubbles and story page narration.
 */
export function speakText(
  text: string,
  options?: {
    characterClass?: string;
    onStart?: () => void;
    onEnd?: () => void;
    onBoundary?: (event: SpeechSynthesisEvent) => void;
  },
): void {
  if (!voiceEnabled) return;
  if (typeof window === 'undefined' || !window.speechSynthesis) return;

  // Cancel any existing speech
  window.speechSynthesis.cancel();

  // Strip quotation marks and clean text
  const cleanText = text
    .replace(/["""\u201C\u201D]/g, '')
    .replace(/[–—]/g, ', ')
    .replace(/\s+/g, ' ')
    .trim();

  if (!cleanText) return;

  const utterance = new SpeechSynthesisUtterance(cleanText);
  ttsUtterance = utterance;

  // Apply character voice profile
  const profile = options?.characterClass
    ? VOICE_PROFILES[options.characterClass.toLowerCase()] || VOICE_PROFILES.default
    : VOICE_PROFILES.narrator;

  utterance.pitch = profile.pitch;
  utterance.rate = profile.rate;
  utterance.volume = profile.volume;

  // Try to find a good English voice
  const voices = window.speechSynthesis.getVoices();
  const preferred = voices.find(v =>
    v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Microsoft') || v.name.includes('Samantha') || v.name.includes('Daniel'))
  );
  if (preferred) {
    utterance.voice = preferred;
  } else {
    const english = voices.find(v => v.lang.startsWith('en'));
    if (english) utterance.voice = english;
  }

  utterance.onstart = () => options?.onStart?.();
  utterance.onend = () => {
    ttsUtterance = null;
    options?.onEnd?.();
  };
  utterance.onboundary = (e) => options?.onBoundary?.(e);

  // Handle Chrome bug: speechSynthesis can pause if tab is in background
  // Resume it periodically
  const keepAlive = setInterval(() => {
    if (!window.speechSynthesis.speaking) {
      clearInterval(keepAlive);
      return;
    }
    window.speechSynthesis.resume();
  }, 10000);

  utterance.addEventListener('end', () => clearInterval(keepAlive));
  utterance.addEventListener('error', () => clearInterval(keepAlive));

  window.speechSynthesis.speak(utterance);
}

/**
 * Speak a story page. Uses narrator voice, slightly slower for gravitas.
 */
export function speakStoryPage(text: string, onEnd?: () => void): void {
  speakText(text, {
    characterClass: 'narrator',
    onEnd,
  });
}

/**
 * Speak AI rival dialogue with character-appropriate voice.
 */
export function speakAIDialogue(
  text: string,
  characterClass: string,
  onEnd?: () => void,
): void {
  speakText(text, {
    characterClass,
    onEnd,
  });
}

/**
 * Stop all TTS and intro narration.
 */
export function stopAll(): void {
  stopIntroNarration();
  stopTTS();
}

export function stopTTS(): void {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
  ttsUtterance = null;
}

export function isSpeaking(): boolean {
  if (typeof window === 'undefined' || !window.speechSynthesis) return false;
  return window.speechSynthesis.speaking;
}

// ========================================
// PRELOAD VOICES
// ========================================

/**
 * Preload speech synthesis voices (call on first user interaction).
 * Some browsers need user gesture before voices are available.
 */
export function preloadVoices(): void {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  // Trigger voice loading
  window.speechSynthesis.getVoices();
  // Some browsers fire the event asynchronously
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.getVoices();
    };
  }
}