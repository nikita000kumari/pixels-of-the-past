// Voice Narrator & Audio Manager Service for Pixels of the Past
// Features collision-free, single-channel voice narration with automatic audio ducking and priority queuing.

import { VOICE_NARRATIONS } from '../data/voiceNarrations';

class VoiceNarratorService {
  constructor() {
    this.isMuted = localStorage.getItem('potp_voice_muted') === 'true';
    this.autoNarrate = localStorage.getItem('potp_auto_narrate') !== 'false';
    this.volume = 0.9;
    this.speed = 1.0;

    this.isSpeaking = false;
    this.isPaused = false;
    this.currentText = '';
    this.currentTitle = '';
    this.currentSource = null; // 'audio' | 'speechSynthesis'

    this.speechSessionId = 0; // Incremented on every new speech request or stop() to invalidate stale callbacks
    this.activeAudio = null;
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.activeUtterance = null;
    this.audioContext = null;

    this.activeBgm = null;
    this.currentEraMusic = null;
    this.worldEntranceTime = Date.now();

    this.listeners = new Set();
    this.monumentCooldowns = new Map();
    this.isArtifactActive = false;
    this.lastHoverTime = 0;

    // Preferred voice for SpeechSynthesis fallback
    this.preferredVoice = null;
    if (this.synth) {
      this.initVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.initVoices();
      }
    }
  }

  initVoices() {
    if (!this.synth) return;
    const voices = this.synth.getVoices();
    this.preferredVoice =
      voices.find((v) => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Online') || v.name.includes('Neural'))) ||
      voices.find((v) => v.lang.startsWith('en-IN')) ||
      voices.find((v) => v.lang.startsWith('en-GB')) ||
      voices.find((v) => v.lang.startsWith('en-US')) ||
      voices.find((v) => v.lang.startsWith('en')) ||
      voices[0];
  }

  subscribe(callback) {
    this.listeners.add(callback);
    callback(this.getState());
    return () => this.listeners.delete(callback);
  }

  notify() {
    const state = this.getState();
    this.listeners.forEach((cb) => {
      try {
        cb(state);
      } catch (err) {
        console.error('[VoiceNarrator] Listener error:', err);
      }
    });
  }

  getState() {
    return {
      isSpeaking: this.isSpeaking,
      isPaused: this.isPaused,
      isMuted: this.isMuted,
      autoNarrate: this.autoNarrate,
      volume: this.volume,
      speed: this.speed,
      currentText: this.currentText,
      currentTitle: this.currentTitle
    };
  }

  setMuted(muted) {
    this.isMuted = muted;
    localStorage.setItem('potp_voice_muted', String(muted));
    if (muted) {
      this.stop();
      if (this.activeBgm) this.activeBgm.pause();
    } else if (this.activeBgm) {
      this.activeBgm.play().catch(() => {});
    }
    this.notify();
  }

  toggleMute() {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  setAutoNarrate(val) {
    this.autoNarrate = val;
    localStorage.setItem('potp_auto_narrate', String(val));
    this.notify();
  }

  setSpeed(newSpeed) {
    this.speed = newSpeed;
    if (this.activeAudio) {
      this.activeAudio.playbackRate = newSpeed;
    }
    this.notify();
  }

  // --- AUDIO DUCKING (Smoothly lowers music while speaking) ---
  duckMusic(duck) {
    if (!this.activeBgm) return;
    try {
      this.activeBgm.volume = duck ? 0.07 : 0.22;
    } catch (e) {}
  }

  // --- PLAYBACK METHODS (STRICT SINGLE-CHANNEL EXECUTION) ---

  // Highest priority: Artifact Lore
  speakArtifact(artifactId) {
    const data = VOICE_NARRATIONS[artifactId];
    if (!data) return;
    this.playNarration(data.audioFile, data.text, data.title);
  }

  // High priority: World entrance introduction
  speakIntro(worldId) {
    this.worldEntranceTime = Date.now();
    const data = VOICE_NARRATIONS[worldId];
    if (!data) return;
    this.playNarration(data.audioFile, data.text, data.title);
  }

  // Monument announcement: ONLY plays if no other voice is speaking and not in artifact modal
  announceMonument(monumentKey) {
    if (this.isMuted || this.isArtifactActive || this.isSpeaking) return;

    // Suppress monuments during initial 8 seconds of entering world so intro voice is clear
    if (Date.now() - this.worldEntranceTime < 8000) return;

    // Cooldown check (30 seconds per monument)
    const now = Date.now();
    const lastSpoken = this.monumentCooldowns.get(monumentKey) || 0;
    if (now - lastSpoken < 30000) return;

    const data = VOICE_NARRATIONS[monumentKey];
    if (!data) return;

    this.monumentCooldowns.set(monumentKey, now);
    this.playSfx('discover');
    this.playNarration(data.audioFile, data.text, data.title);
  }

  // Core single-voice dispatcher
  playNarration(audioFile, text, title = 'Voice Guide') {
    if (this.isMuted) return;

    // Invalidate any previously running audio or promise callbacks
    this.stop();

    const currentId = ++this.speechSessionId;

    this.isSpeaking = true;
    this.isPaused = false;
    this.currentText = text;
    this.currentTitle = title;
    this.duckMusic(true);
    this.notify();

    // 1. Try pre-rendered WAV file first
    if (audioFile) {
      const audio = new Audio(audioFile);
      audio.volume = this.volume;
      audio.playbackRate = this.speed;
      this.activeAudio = audio;
      this.currentSource = 'audio';

      audio.onended = () => {
        if (this.speechSessionId !== currentId) return;
        this.isSpeaking = false;
        this.isPaused = false;
        this.activeAudio = null;
        this.duckMusic(false);
        this.notify();
      };

      audio.onerror = () => {
        if (this.speechSessionId !== currentId) return;
        this.speakWithSynthesis(text, currentId);
      };

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          // If aborted by stop(), do not trigger synthesis!
          if (err.name === 'AbortError' || this.speechSessionId !== currentId) {
            return;
          }
          // Autoplay policy prevented playback: fallback to SpeechSynthesis
          this.speakWithSynthesis(text, currentId);
        });
      }
    } else {
      this.speakWithSynthesis(text, currentId);
    }
  }

  speakWithSynthesis(text, sessionId = this.speechSessionId) {
    if (!this.synth || this.isMuted || this.speechSessionId !== sessionId) {
      if (this.speechSessionId === sessionId) {
        this.isSpeaking = false;
        this.duckMusic(false);
        this.notify();
      }
      return;
    }

    try {
      this.synth.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      if (this.preferredVoice) utterance.voice = this.preferredVoice;
      utterance.rate = this.speed;
      utterance.volume = this.volume;
      utterance.pitch = 1.0;

      utterance.onstart = () => {
        if (this.speechSessionId !== sessionId) return;
        this.isSpeaking = true;
        this.isPaused = false;
        this.duckMusic(true);
        this.notify();
      };

      utterance.onend = () => {
        if (this.speechSessionId !== sessionId) return;
        this.isSpeaking = false;
        this.isPaused = false;
        this.activeUtterance = null;
        this.duckMusic(false);
        this.notify();
      };

      utterance.onerror = (err) => {
        if (this.speechSessionId !== sessionId) return;
        this.isSpeaking = false;
        this.activeUtterance = null;
        this.duckMusic(false);
        this.notify();
      };

      this.activeUtterance = utterance;
      this.currentSource = 'speechSynthesis';
      this.synth.speak(utterance);
    } catch (e) {
      this.isSpeaking = false;
      this.duckMusic(false);
      this.notify();
    }
  }

  stop() {
    this.speechSessionId++; // Invalidate any pending audio callbacks
    if (this.activeAudio) {
      try {
        this.activeAudio.pause();
        this.activeAudio.src = '';
      } catch (e) {}
      this.activeAudio = null;
    }
    if (this.synth) {
      try {
        this.synth.cancel();
      } catch (e) {}
    }
    this.activeUtterance = null;
    this.isSpeaking = false;
    this.isPaused = false;
    this.duckMusic(false);
    this.notify();
  }

  pause() {
    if (this.currentSource === 'audio' && this.activeAudio) {
      this.activeAudio.pause();
      this.isPaused = true;
      this.notify();
    } else if (this.currentSource === 'speechSynthesis' && this.synth) {
      this.synth.pause();
      this.isPaused = true;
      this.notify();
    }
  }

  resume() {
    if (this.isMuted) return;
    if (this.currentSource === 'audio' && this.activeAudio && this.isPaused) {
      this.activeAudio.play().catch(() => {});
      this.isPaused = false;
      this.notify();
    } else if (this.currentSource === 'speechSynthesis' && this.synth && this.isPaused) {
      this.synth.resume();
      this.isPaused = false;
      this.notify();
    }
  }

  // --- SUBTLE UI SOUND EFFECTS (NO VOICE ON BUTTONS) ---

  // Ultra-soft, low-latency hover tick (debounced to max 1 per 90ms)
  playHover() {
    if (this.isMuted) return;
    const now = Date.now();
    if (now - this.lastHoverTime < 90) return;
    this.lastHoverTime = now;

    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      if (!this.audioContext) this.audioContext = new AudioCtx();
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }
      const ct = this.audioContext.currentTime;
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1400, ct);
      osc.frequency.exponentialRampToValueAtTime(1800, ct + 0.03);

      gain.gain.setValueAtTime(0.015, ct); // Very gentle
      gain.gain.exponentialRampToValueAtTime(0.0001, ct + 0.035);

      osc.connect(gain);
      gain.connect(this.audioContext.destination);
      osc.start(ct);
      osc.stop(ct + 0.035);
    } catch (e) {}
  }

  // Crisp tactical click
  playClick() {
    if (this.isMuted) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      if (!this.audioContext) this.audioContext = new AudioCtx();
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }
      const ct = this.audioContext.currentTime;
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(700, ct);
      osc.frequency.exponentialRampToValueAtTime(250, ct + 0.05);

      gain.gain.setValueAtTime(0.06, ct);
      gain.gain.exponentialRampToValueAtTime(0.001, ct + 0.05);

      osc.connect(gain);
      gain.connect(this.audioContext.destination);
      osc.start(ct);
      osc.stop(ct + 0.05);
    } catch (e) {}
  }

  // In-game sound events
  playSfx(type) {
    if (this.isMuted) return;

    let soundPath = '';
    if (type === 'discover') soundPath = '/audio/sfx/artifact_discover.ogg';
    else if (type === 'teleport' || type === 'reset') soundPath = '/audio/sfx/teleport.ogg';

    if (soundPath) {
      const sfx = new Audio(soundPath);
      sfx.volume = 0.5 * this.volume;
      sfx.play().catch(() => {
        this.synthesizeChime(type);
      });
    } else {
      this.synthesizeChime(type);
    }
  }

  synthesizeChime(type) {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      if (!this.audioContext) this.audioContext = new AudioCtx();
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }

      const now = this.audioContext.currentTime;
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();

      if (type === 'discover') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.setValueAtTime(659.25, now + 0.08);
        osc.frequency.setValueAtTime(783.99, now + 0.16);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
        osc.connect(gain);
        gain.connect(this.audioContext.destination);
        osc.start(now);
        osc.stop(now + 0.5);
      } else {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.connect(gain);
        gain.connect(this.audioContext.destination);
        osc.start(now);
        osc.stop(now + 0.12);
      }
    } catch (e) {}
  }

  // --- BACKGROUND MUSIC (BGM) ---
  playEraMusic(era) {
    if (this.currentEraMusic === era && this.activeBgm) return;
    this.currentEraMusic = era;

    if (this.activeBgm) {
      this.activeBgm.pause();
      this.activeBgm = null;
    }

    if (this.isMuted) return;

    let musicFile = '';
    if (era === 'harappa') musicFile = '/audio/music/harappa_theme.ogg';
    else if (era === 'gupta') musicFile = '/audio/music/gupta_theme.ogg';
    else if (era === 'mughal') musicFile = '/audio/music/mughal_theme.ogg';

    if (musicFile) {
      const bgm = new Audio(musicFile);
      bgm.loop = true;
      bgm.volume = 0.22;
      this.activeBgm = bgm;
      bgm.play().catch(() => {});
    }
  }
}

// Singleton export
export const voiceNarrator = new VoiceNarratorService();
