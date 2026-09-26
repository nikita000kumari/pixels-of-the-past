import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, BookOpen, Compass, Award, X, Volume2, VolumeX, Pause, Play } from 'lucide-react';
import { voiceNarrator } from '../services/voiceNarrator';

// Data configuration for the 6 Historical Expedition Cards
const HUB_CARDS = [
  // LEFT COLUMN: THE THREE HISTORICAL REALMS
  {
    id: 'harappa',
    type: 'EXCAVATION',
    era: 'c. 2600 BCE',
    sceneId: 'harappa',
    title: 'Harappan Citadel',
    tagline: 'Bronze Age Metropolis & The Great Bath',
    image: '/assets/images/harappa_card.jpg',
    buttonText: 'Enter Citadel',
    column: 'left'
  },
  {
    id: 'gupta',
    type: 'GOLDEN AGE',
    era: 'c. 375 CE',
    sceneId: 'gupta',
    title: 'Gupta Dynasty',
    tagline: 'Classical Temples & Ancient Astronomy',
    image: '/assets/images/gupta_card.jpg',
    buttonText: 'Survey Realm',
    column: 'left'
  },
  {
    id: 'mughal',
    type: 'IMPERIUM',
    era: 'c. 1526 CE',
    sceneId: 'mughal',
    title: 'Mughal Empire',
    tagline: 'Monumental Marble & Imperial Courts',
    image: '/assets/images/art_card.jpg',
    buttonText: 'Walk Palace',
    column: 'left'
  },
  // RIGHT COLUMN: EXPEDITION FEATURES & HISTORICAL ARCHIVES
  {
    id: 'chronicler',
    type: 'LORE ARCHIVE',
    era: 'ORAL TRADITION',
    sceneId: null,
    title: 'Royal Chroniclers',
    tagline: 'Spoken Lore & Ancient Court Scribes',
    image: '/assets/images/kalidasa_card.jpg',
    buttonText: 'Hear Chronicler',
    column: 'right',
    infoModal: {
      category: 'HISTORICAL CHRONICLE',
      title: 'The Royal Chroniclers',
      subtitle: 'Oral Traditions & Court Lore of Ancient India',
      description: 'Consult with the legendary scribes, poets, and royal chroniclers across the three dynasties. Inquire into forgotten battles, royal edicts, celestial mathematics, and daily life in ancient cities through authentic spoken lore.',
      actionText: 'Enter Gupta with Chronicler',
      sceneTarget: 'gupta'
    }
  },
  {
    id: 'artifacts',
    type: 'TREASURY',
    era: '18 RELICS',
    sceneId: null,
    title: 'Treasury of Relics',
    tagline: 'Archaeological Vault & Sacred Seals',
    image: '/assets/images/relic_clean.jpg',
    buttonText: 'Inspect Vault',
    column: 'right',
    infoModal: {
      category: 'ARCHAEOLOGICAL REPOSITORY',
      title: 'Treasury of Ancient Relics',
      subtitle: 'Excavated Seals, Coinage & Sculptures',
      description: 'Each epoch contains authentic historical artifacts hidden across monument grounds. Discover Indus steatite seals, Gupta gold dinars, and royal damascened relics to expand your field journal.',
      actionText: 'Explore Relic Grounds',
      sceneTarget: 'harappa'
    }
  },
  {
    id: 'free_explore',
    type: 'EXPEDITION',
    era: 'OPEN SURVEY',
    sceneId: null,
    title: 'Expedition Trails',
    tagline: 'Unrestricted Monumental Survey & Ruins',
    image: '/assets/images/map_card.jpg',
    buttonText: 'Launch Survey',
    column: 'right',
    infoModal: {
      category: 'FIELD EXPEDITION',
      title: 'Expedition Survey Trails',
      subtitle: 'Free Exploration Across Ancient Ruins',
      description: 'Chart your own archaeological expedition with full 3D locomotion and free orbit cameras. Ascend citadel ramparts, explore subterranean water reservoirs, and inspect historical architecture up close.',
      actionText: 'Commence Field Expedition',
      sceneTarget: 'harappa'
    }
  }
];

// Reusable Historical Plaque Card
function HistoricalCard({ card, onClick }) {
  return (
    <div
      className="trading-card"
      onMouseEnter={() => voiceNarrator.playHover()}
      onClick={() => onClick(card)}
    >
      {/* Historical Artifact Preview Image */}
      <div className="card-image-wrap">
        <img src={card.image} alt={card.title} className="card-image" loading="lazy" />
        <div className="card-vignette" />
        <div className="card-badge-container">
          <span className="era-badge">{card.era}</span>
          <span className="type-badge">{card.type}</span>
        </div>
      </div>

      {/* Stone Tablet Inscription Plaque */}
      <div className="card-caption-body">
        <h3 className="card-title">{card.title}</h3>
        <p className="card-tagline">{card.tagline}</p>

        {/* Expedition Link Footer */}
        <div className="card-footer">
          <span className="card-action-text">
            {card.buttonText || 'Explore'}
            <ArrowRight size={13} strokeWidth={2.5} />
          </span>
        </div>
      </div>
    </div>
  );
}

export function HubPage({ onSelectWorld }) {
  const [activeFeatureModal, setActiveFeatureModal] = useState(null);
  const [voiceState, setVoiceState] = useState(voiceNarrator.getState());

  useEffect(() => {
    return voiceNarrator.subscribe(setVoiceState);
  }, []);

  const isPlayingIntro = voiceState.isSpeaking && voiceState.currentTitle === 'Pixels of the Past';

  const handleToggleVoiceIntro = () => {
    if (isPlayingIntro) {
      voiceNarrator.stop();
    } else {
      voiceNarrator.speakIntro('hub');
    }
  };

  const leftCards = HUB_CARDS.filter((c) => c.column === 'left');
  const rightCards = HUB_CARDS.filter((c) => c.column === 'right');

  const handleCardClick = (card) => {
    voiceNarrator.playClick();
    if (card.sceneId) {
      voiceNarrator.stop();
      onSelectWorld(card.sceneId);
    } else if (card.infoModal) {
      voiceNarrator.stop();
      setActiveFeatureModal(card.infoModal);
    }
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100vw',
        minHeight: '100vh',
        overflowX: 'hidden',
        overflowY: 'auto',
        boxSizing: 'border-box',
        backgroundImage: `
          linear-gradient(to bottom, rgba(20,10,5,0.4) 0%, rgba(20,8,4,0.6) 55%, rgba(15,6,3,0.85) 100%),
          url('/assets/images/hub-background.jpg')
        `,
        backgroundPosition: 'center center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        backgroundColor: '#150603',
        color: '#ffffff',
        zIndex: 200,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 'max(14px, 2vh) 20px'
      }}
    >
      {/* Top Right Quick Audio / Voice Toggle */}
      <div style={{ position: 'absolute', top: 14, right: 18, zIndex: 10 }}>
        <button
          onClick={() => voiceNarrator.toggleMute()}
          className="glass-panel"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 7,
            padding: '6px 12px',
            borderRadius: 20,
            background: voiceState.isMuted ? 'rgba(239, 68, 68, 0.2)' : 'rgba(0, 0, 0, 0.55)',
            border: '1px solid ' + (voiceState.isMuted ? '#ef4444' : 'rgba(255, 210, 92, 0.45)'),
            color: voiceState.isMuted ? '#f87171' : '#ffd25c',
            fontSize: 11.5,
            fontWeight: 700,
            cursor: 'pointer',
            backdropFilter: 'blur(8px)'
          }}
        >
          {voiceState.isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
          <span>{voiceState.isMuted ? 'Voice Off' : 'Voice On'}</span>
        </button>
      </div>

      {/* Background Ambient Glows */}
      <div
        style={{
          position: 'absolute',
          top: '25%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '600px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(255, 210, 92, 0.22) 0%, rgba(0, 0, 0, 0) 70%)',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

      {/* --- MAIN HUB CONTAINER (FLANKING GRID ON DESKTOP) --- */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: '1260px',
          width: '100%',
          margin: 'auto 0',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 'clamp(14px, 2vw, 24px)',
          alignItems: 'center'
        }}
      >
        {/* --- LEFT CARDS COLUMN --- */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(8px, 1.2vh, 10px)' }}>
          {leftCards.map((card) => (
            <HistoricalCard key={card.id} card={card} onClick={handleCardClick} />
          ))}
        </div>

        {/* --- CENTER HERO SECTION --- */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            padding: '10px 6px'
          }}
        >
          {/* Eyebrow Line */}
          <span
            style={{
              fontSize: '11px',
              fontWeight: 800,
              color: '#ffd25c',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              marginBottom: '6px',
              textShadow: '0 2px 4px rgba(0,0,0,0.8)'
            }}
          >
            A JOURNEY THROUGH ANCIENT INDIA
          </span>

          {/* Main Chunky 3D Title */}
          <h1
            className="hub-title-gradient"
            style={{
              fontSize: 'clamp(2.1rem, 3.8vw, 3.4rem)',
              lineHeight: 1.05,
              marginBottom: '10px',
              letterSpacing: '1px'
            }}
          >
            PIXELS OF THE PAST
          </h1>

          {/* Two-Line Subtitle */}
          <p
            style={{
              fontSize: 'clamp(0.85rem, 1.15vw, 0.98rem)',
              color: '#f1e3d3',
              lineHeight: 1.5,
              maxWidth: '460px',
              marginBottom: '18px',
              fontWeight: 500,
              textShadow: '0 2px 8px rgba(0,0,0,0.9)'
            }}
          >
            Step inside interactive 3D historical realms, walk ancient monuments,
            and uncover timeless relics across India's glorious past.
          </p>

          {/* Pill-Shaped CTA Button & Audio Tour */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
            <button
              className="hub-cta-button"
              onMouseEnter={() => voiceNarrator.playHover()}
              onClick={() => {
                voiceNarrator.playClick();
                voiceNarrator.stop();
                onSelectWorld('harappa');
              }}
              style={{ padding: '11px 26px', fontSize: '1rem' }}
            >
              <span>Start Exploring</span>
              <ArrowRight size={20} color="#3b1400" strokeWidth={3} />
            </button>

            <button
              onMouseEnter={() => voiceNarrator.playHover()}
              onClick={() => {
                voiceNarrator.playClick();
                handleToggleVoiceIntro();
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 7,
                padding: '7px 15px',
                borderRadius: 20,
                background: isPlayingIntro ? 'rgba(255, 0, 85, 0.25)' : 'rgba(255, 255, 255, 0.08)',
                border: '1px solid ' + (isPlayingIntro ? '#ff0055' : 'rgba(255, 210, 92, 0.35)'),
                color: isPlayingIntro ? '#ff6699' : '#ffd25c',
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
                backdropFilter: 'blur(8px)',
                transition: 'all 0.2s ease',
                boxShadow: isPlayingIntro ? '0 0 15px rgba(255,0,85,0.4)' : 'none'
              }}
            >
              {isPlayingIntro ? <Pause size={14} /> : <Volume2 size={14} />}
              <span>{isPlayingIntro ? 'Pause Voice Tour' : 'Listen to Audio Tour'}</span>
            </button>
          </div>
        </div>

        {/* --- RIGHT CARDS COLUMN --- */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(8px, 1.2vh, 10px)' }}>
          {rightCards.map((card) => (
            <HistoricalCard key={card.id} card={card} onClick={handleCardClick} />
          ))}
        </div>
      </div>

      {/* --- HISTORICAL EXPEDITION DOSSIER MODAL --- */}
      {activeFeatureModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(8, 5, 3, 0.88)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            zIndex: 300,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20
          }}
          onClick={() => setActiveFeatureModal(null)}
        >
          <div
            className="expedition-modal-panel"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveFeatureModal(null)}
              style={{
                position: 'absolute',
                top: 18,
                right: 18,
                background: 'rgba(255, 215, 0, 0.1)',
                border: '1px solid rgba(212, 175, 55, 0.35)',
                color: '#e2d5c3',
                width: 34,
                height: 34,
                borderRadius: 8,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 215, 0, 0.25)';
                e.currentTarget.style.color = '#fff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 215, 0, 0.1)';
                e.currentTarget.style.color = '#e2d5c3';
              }}
            >
              <X size={18} />
            </button>

            {/* Plaque Header / Ribbon */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#ffd25c', marginBottom: 12 }}>
              <Sparkles size={18} />
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  letterSpacing: 2,
                  textTransform: 'uppercase',
                  fontFamily: "'Cinzel', serif"
                }}
              >
                {activeFeatureModal.category || 'EXPEDITION DOSSIER'}
              </span>
            </div>

            <h3
              style={{
                fontSize: 24,
                fontWeight: 700,
                color: '#fff6db',
                fontFamily: "'Cinzel', serif",
                letterSpacing: '0.5px',
                marginBottom: 6,
                textShadow: '0 2px 8px rgba(0,0,0,0.8)'
              }}
            >
              {activeFeatureModal.title}
            </h3>

            {activeFeatureModal.subtitle && (
              <h4
                style={{
                  fontSize: 13,
                  color: '#ffd25c',
                  fontWeight: 600,
                  letterSpacing: '0.5px',
                  marginBottom: 16
                }}
              >
                {activeFeatureModal.subtitle}
              </h4>
            )}

            <p
              style={{
                fontSize: 13.5,
                color: '#d9cbba',
                lineHeight: 1.7,
                marginBottom: 28
              }}
            >
              {activeFeatureModal.description}
            </p>

            <button
              onClick={() => {
                setActiveFeatureModal(null);
                onSelectWorld(activeFeatureModal.sceneTarget || 'harappa');
              }}
              className="hub-cta-button"
              style={{
                width: '100%',
                justifyContent: 'center',
                fontSize: '1.05rem',
                padding: '13px 24px'
              }}
            >
              <span>{activeFeatureModal.actionText || 'Commence Expedition'}</span>
              <ArrowRight size={20} color="#3b1400" strokeWidth={3} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
