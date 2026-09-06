import { cleanSpokenText } from './narrationBuilder';

export type PlaybackState = 'idle' | 'loading' | 'playing' | 'paused' | 'error';

export interface PlaybackStatus {
  activeId: string | null;
  state: PlaybackState;
  error: string | null;
  sessionId: number;
}

type Listener = (status: PlaybackStatus) => void;

function getFemaleVoice(): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;

  const maleKeywords = ['male', 'david', 'mark', 'george', 'prabhat', 'rishi', 'guy', 'stefan', 'daniel', 'alex', 'fred', 'james', 'richard'];

  const isMale = (v: SpeechSynthesisVoice) => {
    const name = v.name.toLowerCase();
    return maleKeywords.some((mk) => name.includes(mk));
  };

  const topFemaleNames = [
    'neerja',                  // Indian Neural/Natural
    'jenny',                   // US Neural/Natural (young, energetic)
    'aria',                    // US Neural/Natural (engaging)
    'google us english',       // Chrome female
    'google uk english female',
    'samantha',                // Apple female
    'veena',                   // Indian female
    'kavya',                   // Indian female
    'swara',                   // Indian female
    'natural',
    'neural',
    'online',
    'ana',
    'zira',                    // fallback desktop
  ];

  const eligible = voices.filter((v) => v.lang.toLowerCase().startsWith('en') && !isMale(v));
  if (eligible.length === 0) return voices[0] || null;

  let bestVoice: SpeechSynthesisVoice | null = null;
  let maxScore = -999;

  for (const voice of eligible) {
    const name = voice.name.toLowerCase();
    const lang = voice.lang.toLowerCase().replace('_', '-');

    let score = 0;
    // High boost for Neural/Natural/Online modern clear voices
    if (name.includes('natural') || name.includes('neural') || name.includes('online')) score += 50;
    if (name.includes('google')) score += 40;

    // Boost for Indian English
    if (lang.startsWith('en-in') || name.includes('india') || name.includes('hindi')) score += 30;

    // Score based on top female voice list
    for (let i = 0; i < topFemaleNames.length; i++) {
      if (name.includes(topFemaleNames[i])) {
        score += (topFemaleNames.length - i) * 10;
        break;
      }
    }

    // Penalize legacy offline desktop voices that sound robotic/older
    if (name.includes('desktop')) score -= 30;

    if (score > maxScore) {
      maxScore = score;
      bestVoice = voice;
    }
  }

  return bestVoice || eligible[0] || voices[0] || null;
}

class SpeechManager {
  private activeId: string | null = null;
  private state: PlaybackState = 'idle';
  private errorMessage: string | null = null;
  private sessionCounter: number = 0;
  private activeSessionId: number = 0;
  private listeners: Set<Listener> = new Set();
  private currentChunks: string[] = [];
  private currentChunkIndex: number = 0;

  constructor() {
    if (typeof window !== 'undefined' && this.checkSupport()) {
      window.addEventListener('beforeunload', () => this.stop());
      window.addEventListener('popstate', () => this.stop());
      if ('onvoiceschanged' in window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = () => {
          getFemaleVoice();
        };
      }
    }
  }

  public checkSupport(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    listener(this.getStatus());
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    const status = this.getStatus();
    for (const listener of this.listeners) {
      listener(status);
    }
  }

  public getStatus(): PlaybackStatus {
    return {
      activeId: this.activeId,
      state: this.state,
      error: this.errorMessage,
      sessionId: this.activeSessionId,
    };
  }

  public getActiveId(): string | null {
    return this.activeId;
  }

  public getState(): PlaybackState {
    return this.state;
  }

  public play(id: string, narrationScript: string) {
    if (!this.checkSupport()) {
      this.state = 'error';
      this.errorMessage = 'Browser does not support SpeechSynthesis';
      this.notify();
      return;
    }

    if (this.activeId === id) {
      if (this.state === 'paused') {
        this.resume();
        return;
      } else if (this.state === 'playing') {
        this.pause();
        return;
      }
    }

    this.sessionCounter++;
    const currentSessionId = this.sessionCounter;
    this.activeSessionId = currentSessionId;

    try {
      window.speechSynthesis.cancel();
    } catch {
      // Ignore
    }

    this.activeId = id;
    this.state = 'loading';
    this.errorMessage = null;
    this.notify();

    const cleanedText = cleanSpokenText(narrationScript);

    if (this.activeSessionId !== currentSessionId) return;

    if (!cleanedText) {
      this.activeId = null;
      this.state = 'idle';
      this.errorMessage = 'Subtopic has no readable content';
      this.notify();
      return;
    }

    this.currentChunks = this.splitIntoChunks(cleanedText);
    this.currentChunkIndex = 0;
    this.state = 'playing';
    this.notify();

    this.speakCurrentChunk(currentSessionId);
  }

  private splitIntoChunks(text: string): string[] {
    const maxLength = 180;
    if (text.length <= maxLength) return [text];

    const sentences = text.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [text];
    const chunks: string[] = [];
    let currentChunk = '';

    for (const sentence of sentences) {
      if ((currentChunk + sentence).length <= maxLength) {
        currentChunk += sentence;
      } else {
        if (currentChunk.trim()) {
          chunks.push(currentChunk.trim());
        }
        if (sentence.length > maxLength) {
          const words = sentence.split(' ');
          currentChunk = '';
          for (const word of words) {
            if ((currentChunk + ' ' + word).length <= maxLength) {
              currentChunk += (currentChunk ? ' ' : '') + word;
            } else {
              if (currentChunk.trim()) chunks.push(currentChunk.trim());
              currentChunk = word;
            }
          }
        } else {
          currentChunk = sentence;
        }
      }
    }
    if (currentChunk.trim()) {
      chunks.push(currentChunk.trim());
    }

    return chunks;
  }

  private speakCurrentChunk(sessionId: number) {
    if (this.activeSessionId !== sessionId || !this.checkSupport() || this.state !== 'playing') {
      return;
    }

    if (this.currentChunkIndex >= this.currentChunks.length) {
      if (this.activeSessionId === sessionId) {
        this.resetState();
      }
      return;
    }

    try {
      window.speechSynthesis.cancel();
    } catch {
      // Ignore
    }

    const utteranceText = this.currentChunks[this.currentChunkIndex];
    const utterance = new SpeechSynthesisUtterance(utteranceText);

    const voice = getFemaleVoice();
    if (voice) {
      utterance.voice = voice;
    }

    utterance.rate = 1.0;
    utterance.pitch = 1.15; // lively, engaging, modern clear female voice tone
    utterance.volume = 1.0;

    utterance.onstart = () => {
      if (this.activeSessionId !== sessionId) return;
      if (this.state !== 'playing') {
        this.state = 'playing';
        this.notify();
      }
    };

    utterance.onend = () => {
      if (this.activeSessionId !== sessionId) return;

      if (this.state === 'playing') {
        this.currentChunkIndex++;
        if (this.currentChunkIndex < this.currentChunks.length) {
          this.speakCurrentChunk(sessionId);
        } else {
          this.resetState();
        }
      }
    };

    utterance.onerror = (e) => {
      if (this.activeSessionId !== sessionId) return;

      if (e.error !== 'interrupted' && e.error !== 'canceled') {
        console.warn('SpeechSynthesis utterance error:', e);
      }

      if (this.state === 'playing') {
        this.currentChunkIndex++;
        if (this.currentChunkIndex < this.currentChunks.length) {
          this.speakCurrentChunk(sessionId);
        } else {
          this.resetState();
        }
      }
    };

    try {
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      if (this.activeSessionId !== sessionId) return;
      console.warn('SpeechSynthesis speak failed:', err);
      this.resetState();
    }
  }

  public pause() {
    if (!this.checkSupport() || this.state !== 'playing') return;
    try {
      window.speechSynthesis.pause();
    } catch {
      // Ignore
    }
    this.state = 'paused';
    this.notify();
  }

  public resume() {
    if (!this.checkSupport() || this.state !== 'paused') return;
    try {
      window.speechSynthesis.resume();
    } catch {
      // Ignore
    }
    this.state = 'playing';
    this.notify();
  }

  public stop() {
    this.sessionCounter++;
    this.activeSessionId = this.sessionCounter;

    if (this.checkSupport()) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // Ignore
      }
    }
    this.resetState();
  }

  private resetState() {
    this.activeId = null;
    this.state = 'idle';
    this.errorMessage = null;
    this.currentChunks = [];
    this.currentChunkIndex = 0;
    this.notify();
  }
}

export const speechManager = new SpeechManager();
