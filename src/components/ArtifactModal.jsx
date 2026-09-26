import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  X,
  Award,
  MapPin,
  Sparkles,
  Shield,
  Flame,
  Truck,
  Gem,
  Clock,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';
import { voiceNarrator } from '../services/voiceNarrator';

const ICON_MAP = {
  Sparkles,
  Shield,
  Flame,
  Award,
  Truck,
  Gem
};

export function ArtifactModal({ artifact, onClose, isCollected }) {
  const [voiceState, setVoiceState] = useState(voiceNarrator.getState());

  useEffect(() => {
    const unsub = voiceNarrator.subscribe(setVoiceState);
    return unsub;
  }, []);

  // When artifact opens, trigger SFX and optional auto-narration
  useEffect(() => {
    if (!artifact) return;

    voiceNarrator.isArtifactActive = true;

    // Play discovery chime sound
    voiceNarrator.playSfx('discover');

    // Auto-narrate if preference is set
    if (voiceNarrator.autoNarrate && !voiceNarrator.isMuted) {
      voiceNarrator.speakArtifact(artifact.id);
    }

    return () => {
      voiceNarrator.isArtifactActive = false;
      voiceNarrator.stop();
    };
  }, [artifact?.id]);

  if (!artifact) return null;

  const IconComp = ICON_MAP[artifact.iconType] || BookOpen;
  const isPlayingThis = voiceState.isSpeaking && !voiceState.isPaused;

  const handleToggleVoice = () => {
    if (isPlayingThis) {
      voiceNarrator.pause();
    } else if (voiceState.isPaused) {
      voiceNarrator.resume();
    } else {
      voiceNarrator.speakArtifact(artifact.id);
    }
  };

  const handleRestartVoice = () => {
    voiceNarrator.speakArtifact(artifact.id);
  };

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 90,
        right: 20,
        maxWidth: 440,
        width: 'calc(100vw - 40px)',
        zIndex: 150,
        pointerEvents: 'auto',
        animation: 'slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      <div
        className="glass-panel"
        style={{
          padding: 22,
          background: 'rgba(8, 12, 22, 0.96)',
          border: '1px solid rgba(255, 230, 0, 0.5)',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.7), 0 0 25px rgba(255, 230, 0, 0.3)',
          borderRadius: 14,
          position: 'relative'
        }}
      >
        {/* Close [X] button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 14,
            right: 14,
            background: 'rgba(255, 255, 255, 0.1)',
            border: 'none',
            color: '#cbd5e1',
            width: 28,
            height: 28,
            borderRadius: 6,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.15s ease'
          }}
        >
          <X size={16} />
        </button>

        {/* Category & Period Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: 'linear-gradient(135deg, #ffe600, #ff0055)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#000'
            }}
          >
            <IconComp size={18} />
          </div>
          <div>
            <span style={{ fontSize: 10, fontWeight: 800, color: '#ffe600', textTransform: 'uppercase', letterSpacing: 1.2 }}>
              {artifact.category}
            </span>
            <div style={{ fontSize: 11, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 4 }}>
              <Clock size={11} /> {artifact.period}
            </div>
          </div>
        </div>

        {/* Artifact Name */}
        <h3 style={{ fontSize: 19, fontWeight: 800, color: '#ffffff', marginBottom: 6 }}>
          {artifact.name}
        </h3>

        {/* Location tag */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#00f0ff', marginBottom: 12, fontWeight: 700 }}>
          <MapPin size={13} />
          <span>{artifact.location} ({artifact.provenance})</span>
        </div>

        {/* Historical Lore Description */}
        <p
          style={{
            background: 'rgba(0, 0, 0, 0.45)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 8,
            padding: 12,
            fontSize: 12,
            color: '#e2e8f0',
            lineHeight: 1.55,
            marginBottom: 12
          }}
        >
          {artifact.description}
        </p>

        {/* --- VOICE NARRATION CONTROLLER BAR --- */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(0, 240, 255, 0.08)',
            border: '1px solid rgba(0, 240, 255, 0.3)',
            borderRadius: 8,
            padding: '8px 12px',
            marginBottom: 14
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {/* Play / Pause Voice button */}
            <button
              onClick={handleToggleVoice}
              style={{
                background: isPlayingThis ? '#ff0055' : '#00f0ff',
                color: '#000000',
                border: 'none',
                borderRadius: 6,
                padding: '6px 12px',
                fontWeight: 800,
                fontSize: 11,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                boxShadow: isPlayingThis ? '0 0 12px rgba(255,0,85,0.6)' : '0 0 12px rgba(0,240,255,0.4)',
                transition: 'all 0.2s ease'
              }}
            >
              {isPlayingThis ? <Pause size={13} fill="#000" /> : <Play size={13} fill="#000" />}
              {isPlayingThis ? 'Pause' : voiceState.isPaused ? 'Resume' : 'Listen Voice'}
            </button>

            {/* Restart Voice */}
            <button
              onClick={handleRestartVoice}
              title="Replay from start"
              style={{
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: '#cbd5e1',
                borderRadius: 6,
                padding: '6px 8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <RotateCcw size={13} />
            </button>

            {/* Pulsing Voice Equalizer Bars */}
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 16, paddingLeft: 4 }}>
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={isPlayingThis ? 'sound-bar animated' : 'sound-bar'}
                  style={{
                    width: 3,
                    borderRadius: 2,
                    background: isPlayingThis ? '#00f0ff' : '#475569',
                    height: isPlayingThis ? undefined : '4px',
                    animationDelay: `${i * 0.12}s`
                  }}
                />
              ))}
            </div>
          </div>

          {/* Auto-narrate setting toggle */}
          <label
            style={{
              fontSize: 10,
              color: '#94a3b8',
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              cursor: 'pointer',
              userSelect: 'none'
            }}
          >
            <input
              type="checkbox"
              checked={voiceState.autoNarrate}
              onChange={(e) => voiceNarrator.setAutoNarrate(e.target.checked)}
              style={{ accentColor: '#00f0ff', cursor: 'pointer' }}
            />
            Auto-Speak
          </label>
        </div>

        {/* Footer info auto-dismiss notice */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 10, color: '#64748b', fontStyle: 'italic' }}>
            Auto-dismisses when walking away
          </span>
          <span
            style={{
              fontSize: 10,
              fontWeight: 800,
              padding: '3px 10px',
              borderRadius: 12,
              background: 'rgba(16, 185, 129, 0.2)',
              color: '#10b981',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              display: 'flex',
              alignItems: 'center',
              gap: 4
            }}
          >
            <Award size={12} /> Logged in Archive
          </span>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .sound-bar {
          transition: height 0.15s ease;
        }
        .sound-bar.animated {
          animation: bounce 0.6s infinite ease-in-out alternate;
        }
        @keyframes bounce {
          0% { height: 4px; }
          50% { height: 15px; }
          100% { height: 6px; }
        }
      `}</style>
    </div>
  );
}
