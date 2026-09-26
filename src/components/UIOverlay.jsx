import React, { useState, useEffect } from 'react';
import { RotateCcw, HelpCircle, Compass, Zap, Sun, Moon, Sparkles, Move, Landmark, Award, Grid as GridIcon, Castle, Crown, Home, Volume2, VolumeX, Radio } from 'lucide-react';
import { voiceNarrator } from '../services/voiceNarrator';

export function UIOverlay({
  telemetry,
  onResetPosition,
  timeOfDay,
  setTimeOfDay,
  currentScene,
  setCurrentScene,
  onOpenHub,
  collectedArtifactsCount = 0,
  totalArtifactsCount = 6
}) {
  const [showControlsGuide, setShowControlsGuide] = useState(false);
  const [voiceState, setVoiceState] = useState(voiceNarrator.getState());

  useEffect(() => {
    return voiceNarrator.subscribe(setVoiceState);
  }, []);

  // Speed percent for gauge bar (0 to 40 km/h)
  const speed = telemetry?.speed || 0;
  const speedPercent = Math.min((speed / 40) * 100, 100);

  // Determine current player state tag
  let stateTag = 'IDLE';
  let stateColor = '#94a3b8';

  if (!telemetry?.isGrounded) {
    stateTag = 'AIRBORNE JUMP';
    stateColor = '#ffe600';
  } else if (telemetry?.isSprinting && telemetry?.isMoving) {
    stateTag = 'SPRINTING';
    stateColor = '#ff0055';
  } else if (telemetry?.isMoving) {
    stateTag = 'WALKING';
    stateColor = '#00f0ff';
  }

  // Determine location name and monument key based on active scene and coordinates
  let locationName = 'Golden Era Metropolis';
  let monumentKey = null;

  if (currentScene === 'mughal' && telemetry?.position) {
    const [px, py, pz] = telemetry.position;
    if (px > 3 && pz < -3) {
      locationName = 'Taj Mahal • Rauza-i-Munawwara';
      monumentKey = 'monument_taj_mahal';
    } else if (px < -3 && pz < -3) {
      locationName = "Imperial Necropolis of Humayun";
      monumentKey = 'monument_humayun_tomb';
    } else if (px < -3 && pz > 3) {
      locationName = 'Agra Fort • Crimson Ramparts';
      monumentKey = 'monument_agra_fort';
    } else if (px > 3 && pz > 3) {
      locationName = 'Fatehpur Sikri • Buland Darwaza';
      monumentKey = 'monument_fatehpur_sikri';
    } else {
      locationName = 'Charbagh Quadripartite Waterways';
      monumentKey = 'monument_charbagh';
    }
  } else if (currentScene === 'gupta' && telemetry?.position) {
    const [px, py, pz] = telemetry.position;
    if (Math.abs(px) < 5 && Math.abs(pz) < 5) {
      locationName = 'Iron Pillar Plaza • Garuda Standard';
      monumentKey = 'monument_iron_pillar';
    } else if (px < -3 && pz < -3) {
      locationName = 'Dashavatara Sanctum (Deogarh)';
      monumentKey = 'monument_dashavatara';
    } else if (px > 3 && pz < -3) {
      locationName = 'Nalanda Mahavihara Complex';
      monumentKey = 'monument_nalanda';
    } else if (px < -3 && pz > 3) {
      locationName = 'Dhamek Stupa • Sarnath';
      monumentKey = 'monument_dhamek_stupa';
    } else {
      locationName = 'Gupta Empire • Golden Age Plaza';
    }
  } else if (currentScene === 'harappa' && telemetry?.position) {
    const [px, py, pz] = telemetry.position;
    if (pz < -2.5) {
      if (px > -11) {
        locationName = 'The Great Bath • Ritual Pool';
        monumentKey = 'monument_great_bath';
      } else {
        locationName = 'Citadel Granaries & Reserve Vaults';
        monumentKey = 'monument_granaries';
      }
    } else if (pz >= -2.5 && pz <= 1.5 && Math.abs(px) < 5) {
      locationName = 'Citadel Processional Stairway';
      monumentKey = 'monument_citadel_stairs';
    } else if (px > 4 && pz > 3) {
      locationName = 'Excavation Relic Plaza';
    } else if (px > 4 && pz <= 3) {
      locationName = 'Lower Town East Quarters';
    } else if (px <= 4 && pz > 3) {
      locationName = 'Lower Town West Quarters';
    } else {
      locationName = 'Lower Town Main Thoroughfare';
    }
  } else if (currentScene === 'flat') {
    locationName = 'Archaeological Survey Ground';
  }

  // Voice announcement while approaching / touching monuments (only while moving to avoid spawn collision)
  useEffect(() => {
    if (monumentKey && telemetry?.isMoving) {
      voiceNarrator.announceMonument(monumentKey);
    }
  }, [monumentKey, telemetry?.isMoving]);

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 100 }}>
      {/* --- TOP HEADER BAR --- */}
      <header
        className="glass-panel"
        style={{
          position: 'absolute',
          top: 16,
          left: 16,
          right: 16,
          padding: '12px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pointerEvents: 'auto',
          background: 'rgba(8, 12, 22, 0.92)',
          border: '1px solid rgba(0, 240, 255, 0.35)',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.6), 0 0 20px rgba(0, 240, 255, 0.2)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div
            onClick={onOpenHub}
            style={{
              width: 42,
              height: 42,
              borderRadius: 10,
              background: currentScene === 'mughal'
                ? 'linear-gradient(135deg, #ff0055, #7000ff)'
                : currentScene === 'gupta'
                ? 'linear-gradient(135deg, #ffe600, #ff7700)'
                : 'linear-gradient(135deg, #00f0ff, #7000ff)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(255, 230, 0, 0.5)',
              cursor: 'pointer'
            }}
          >
            {currentScene === 'mughal' ? <Crown size={24} color="#ffffff" /> : <Landmark size={24} color="#000000" />}
          </div>
          <div>
            <h1
              className="title-gradient"
              onClick={onOpenHub}
              style={{
                fontSize: 20,
                fontWeight: 800,
                letterSpacing: 1.2,
                filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.9))',
                cursor: 'pointer'
              }}
            >
              PIXELS OF THE PAST
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 2 }}>
              <span
                style={{
                  fontSize: 12,
                  color: '#00f0ff',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  textShadow: '0 1px 3px rgba(0,0,0,0.9)'
                }}
              >
                <Compass size={13} /> {locationName}
              </span>
              <span style={{ color: '#64748b' }}>•</span>
              <span
                style={{
                  fontSize: 11,
                  color: '#ffe600',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  textShadow: '0 1px 3px rgba(0,0,0,0.9)'
                }}
              >
                <Award size={13} /> Artifact Logs: {collectedArtifactsCount}/{totalArtifactsCount}
              </span>
            </div>
          </div>
        </div>

        {/* World Switcher (Hub / Mughal / Gupta / Harappa / Test Grid) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Scene Selector */}
          <div className="glass-panel-sm" style={{ display: 'flex', padding: 4, gap: 4, background: 'rgba(0,0,0,0.4)' }}>
            <button
              onMouseEnter={() => voiceNarrator.playHover()}
              onClick={() => {
                voiceNarrator.playClick();
                onOpenHub();
              }}
              style={{
                background: 'linear-gradient(135deg, #ffe600, #f59e0b)',
                color: '#3b1400',
                border: 'none',
                padding: '6px 12px',
                borderRadius: 6,
                fontWeight: 800,
                fontSize: 12,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              <Home size={14} /> Hub
            </button>
            <button
              onMouseEnter={() => voiceNarrator.playHover()}
              onClick={() => {
                voiceNarrator.playClick();
                setCurrentScene('mughal');
              }}
              style={{
                background: currentScene === 'mughal' ? 'linear-gradient(135deg, #ff0055, #7000ff)' : 'transparent',
                color: '#ffffff',
                border: 'none',
                padding: '6px 12px',
                borderRadius: 6,
                fontWeight: 800,
                fontSize: 12,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                transition: 'all 0.2s ease'
              }}
            >
              <Crown size={14} /> Mughal
            </button>
            <button
              onMouseEnter={() => voiceNarrator.playHover()}
              onClick={() => {
                voiceNarrator.playClick();
                setCurrentScene('gupta');
              }}
              style={{
                background: currentScene === 'gupta' ? 'linear-gradient(135deg, #ffe600, #ff7700)' : 'transparent',
                color: currentScene === 'gupta' ? '#000000' : '#cbd5e1',
                border: 'none',
                padding: '6px 12px',
                borderRadius: 6,
                fontWeight: 800,
                fontSize: 12,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                transition: 'all 0.2s ease'
              }}
            >
              <Castle size={14} /> Gupta
            </button>
            <button
              onMouseEnter={() => voiceNarrator.playHover()}
              onClick={() => {
                voiceNarrator.playClick();
                setCurrentScene('harappa');
              }}
              style={{
                background: currentScene === 'harappa' ? 'linear-gradient(135deg, #00f0ff, #7000ff)' : 'transparent',
                color: currentScene === 'harappa' ? '#ffffff' : '#cbd5e1',
                border: 'none',
                padding: '6px 12px',
                borderRadius: 6,
                fontWeight: 800,
                fontSize: 12,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                transition: 'all 0.2s ease'
              }}
            >
              <Landmark size={14} /> Harappa
            </button>
            <button
              onMouseEnter={() => voiceNarrator.playHover()}
              onClick={() => {
                voiceNarrator.playClick();
                setCurrentScene('flat');
              }}
              style={{
                background: currentScene === 'flat' ? '#00f0ff' : 'transparent',
                color: currentScene === 'flat' ? '#000000' : '#cbd5e1',
                border: 'none',
                padding: '6px 12px',
                borderRadius: 6,
                fontWeight: 800,
                fontSize: 12,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                transition: 'all 0.2s ease'
              }}
            >
              <GridIcon size={14} /> Grid
            </button>
          </div>

          {/* Time of Day buttons */}
          <div className="glass-panel-sm" style={{ display: 'flex', padding: 4, gap: 4, background: 'rgba(0,0,0,0.4)' }}>
            <button
              onMouseEnter={() => voiceNarrator.playHover()}
              onClick={() => {
                voiceNarrator.playClick();
                setTimeOfDay('cyber');
              }}
              style={{
                background: timeOfDay === 'cyber' ? 'rgba(0, 240, 255, 0.3)' : 'transparent',
                color: timeOfDay === 'cyber' ? '#00f0ff' : '#cbd5e1',
                border: '1px solid ' + (timeOfDay === 'cyber' ? '#00f0ff' : 'transparent'),
                padding: '6px 10px',
                borderRadius: 6,
                fontWeight: 700,
                fontSize: 12,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 4
              }}
            >
              <Sun size={14} /> Daylight
            </button>
            <button
              onMouseEnter={() => voiceNarrator.playHover()}
              onClick={() => {
                voiceNarrator.playClick();
                setTimeOfDay('midnight');
              }}
              style={{
                background: timeOfDay === 'midnight' ? 'rgba(112, 0, 255, 0.4)' : 'transparent',
                color: timeOfDay === 'midnight' ? '#c4b5fd' : '#cbd5e1',
                border: '1px solid ' + (timeOfDay === 'midnight' ? '#a78bfa' : 'transparent'),
                padding: '6px 10px',
                borderRadius: 6,
                fontWeight: 700,
                fontSize: 12,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 4
              }}
            >
              <Moon size={14} /> Midnight
            </button>
          </div>

          {/* Reset Position */}
          <button
            onMouseEnter={() => voiceNarrator.playHover()}
            onClick={() => {
              voiceNarrator.playClick();
              onResetPosition();
            }}
            className="glass-panel-sm"
            style={{
              background: 'rgba(255, 0, 85, 0.2)',
              border: '1px solid rgba(255, 0, 85, 0.5)',
              color: '#ff6699',
              padding: '8px 12px',
              borderRadius: 8,
              fontWeight: 700,
              fontSize: 12,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            <RotateCcw size={14} /> Reset
          </button>

          {/* Voice Guide Quick Toggle */}
          <button
            onMouseEnter={() => voiceNarrator.playHover()}
            onClick={() => {
              voiceNarrator.playClick();
              voiceNarrator.toggleMute();
            }}
            title={voiceState.isMuted ? "Voice Narrator Muted (Click to Unmute)" : "Voice Narrator Active (Click to Mute)"}
            className="glass-panel-sm"
            style={{
              background: voiceState.isMuted
                ? 'rgba(239, 68, 68, 0.2)'
                : voiceState.isSpeaking
                ? 'rgba(0, 240, 255, 0.35)'
                : 'rgba(0, 0, 0, 0.4)',
              border: '1px solid ' + (voiceState.isMuted ? '#ef4444' : voiceState.isSpeaking ? '#00f0ff' : 'rgba(255, 255, 255, 0.2)'),
              color: voiceState.isMuted ? '#f87171' : '#00f0ff',
              padding: '8px 12px',
              borderRadius: 8,
              fontWeight: 700,
              fontSize: 12,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              boxShadow: voiceState.isSpeaking ? '0 0 14px rgba(0,240,255,0.5)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            {voiceState.isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
            <span>{voiceState.isMuted ? 'Voice Off' : voiceState.isSpeaking ? 'Narrating...' : 'Voice On'}</span>
          </button>

          {/* Controls Guide Toggle */}
          <button
            onMouseEnter={() => voiceNarrator.playHover()}
            onClick={() => {
              voiceNarrator.playClick();
              setShowControlsGuide(!showControlsGuide);
            }}
            className="glass-panel-sm"
            style={{
              background: showControlsGuide ? 'rgba(0, 240, 255, 0.3)' : 'rgba(0, 0, 0, 0.4)',
              border: '1px solid rgba(0, 240, 255, 0.5)',
              color: '#00f0ff',
              padding: '8px',
              borderRadius: 8,
              cursor: 'pointer'
            }}
          >
            <HelpCircle size={16} />
          </button>
        </div>
      </header>

      {/* --- LIVE VOICE NARRATOR SUBTITLE / TICKER --- */}
      {voiceState.isSpeaking && voiceState.currentText && (
        <div
          style={{
            position: 'absolute',
            top: 84,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 'min(90%, 680px)',
            pointerEvents: 'auto',
            zIndex: 110,
            animation: 'fadeIn 0.25s ease'
          }}
        >
          <div
            className="glass-panel"
            style={{
              padding: '11px 18px',
              background: 'linear-gradient(165deg, rgba(28, 18, 12, 0.97) 0%, rgba(14, 9, 6, 0.99) 100%)',
              border: '1.5px solid rgba(212, 175, 55, 0.65)',
              boxShadow: '0 12px 36px rgba(0, 0, 0, 0.9), 0 0 24px rgba(212, 175, 55, 0.25)',
              borderRadius: 12,
              display: 'flex',
              alignItems: 'flex-start',
              gap: 14
            }}
          >
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: '50%',
                background: 'rgba(212, 175, 55, 0.2)',
                border: '1px solid #ffd25c',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffd25c',
                flexShrink: 0,
                marginTop: 2,
                boxShadow: '0 0 10px rgba(255, 210, 92, 0.4)'
              }}
            >
              <Sparkles size={15} />
            </div>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 800,
                  color: '#ffd25c',
                  textTransform: 'uppercase',
                  letterSpacing: 1.5,
                  fontFamily: "'Cinzel', serif",
                  marginBottom: 3
                }}
              >
                {voiceState.currentTitle || 'CHRONICLER RECORD'}
              </div>
              <div style={{ fontSize: 12.5, color: '#f3ece2', lineHeight: 1.5 }}>
                {voiceState.currentText}
              </div>
            </div>
            <button
              onClick={() => voiceNarrator.stop()}
              title="Stop Voice"
              style={{
                background: 'rgba(255, 215, 0, 0.1)',
                border: '1px solid rgba(212, 175, 55, 0.3)',
                color: '#d4c5b3',
                width: 24,
                height: 24,
                borderRadius: 6,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* --- CONTROLS OVERLAY / KEYBOARD MAP (Bottom Left) --- */}
      <div
        className="glass-panel"
        style={{
          position: 'absolute',
          bottom: 20,
          left: 20,
          padding: 16,
          minWidth: 260,
          pointerEvents: 'auto',
          background: 'rgba(8, 12, 22, 0.92)',
          border: '1px solid rgba(255, 255, 255, 0.15)'
        }}
      >
        <div style={{ fontSize: 12, fontWeight: 800, color: '#00f0ff', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
          <Move size={14} color="var(--primary)" /> CONTROLS HUD
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, fontSize: 12 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: 10, color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Movement</span>
            <div style={{ display: 'flex', gap: 4 }}>
              <span className="key-cap">W</span>
              <span className="key-cap">A</span>
              <span className="key-cap">S</span>
              <span className="key-cap">D</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: 10, color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Orbit Camera</span>
            <div style={{ display: 'flex', alignItems: 'center', height: 32 }}>
              <span className="key-cap" style={{ width: 'auto', padding: '0 8px' }}>Mouse Drag</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: 10, color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Jump</span>
            <span className={`key-cap ${!telemetry?.isGrounded ? 'active' : ''}`} style={{ width: '100%' }}>
              SPACE
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: 10, color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Sprint</span>
            <span className={`key-cap ${telemetry?.isSprinting ? 'active' : ''}`} style={{ width: '100%' }}>
              SHIFT
            </span>
          </div>
        </div>
      </div>

      {/* --- TELEMETRY HUD (Bottom Right) --- */}
      <div
        className="glass-panel"
        style={{
          position: 'absolute',
          bottom: 20,
          right: 20,
          padding: 16,
          minWidth: 240,
          pointerEvents: 'auto',
          background: 'rgba(8, 12, 22, 0.92)',
          border: '1px solid rgba(255, 255, 255, 0.15)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <span style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>
            Velocity Gauge
          </span>
          <span
            style={{
              fontSize: 10,
              fontWeight: 800,
              padding: '2px 8px',
              borderRadius: 4,
              background: `${stateColor}30`,
              color: stateColor,
              border: `1px solid ${stateColor}80`,
              textShadow: '0 1px 2px #000'
            }}
          >
            {stateTag}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 8 }}>
          <span style={{ fontSize: 36, fontWeight: 900, fontFamily: 'monospace', color: '#ffffff', textShadow: '0 2px 6px #000' }}>
            {speed}
          </span>
          <span style={{ fontSize: 12, color: '#00f0ff', fontWeight: 800 }}>
            KM/H
          </span>
        </div>

        <div style={{ width: '100%', height: 6, background: 'rgba(255,255,255,0.15)', borderRadius: 3, overflow: 'hidden' }}>
          <div
            style={{
              width: `${speedPercent}%`,
              height: '100%',
              background: telemetry?.isSprinting
                ? 'linear-gradient(90deg, #00f0ff, #ff0055)'
                : 'linear-gradient(90deg, #00f0ff, #7000ff)',
              boxShadow: '0 0 10px #00f0ff',
              transition: 'width 0.15s ease-out'
            }}
          />
        </div>

        {telemetry?.position && (
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#cbd5e1', marginTop: 10, fontFamily: 'monospace', fontWeight: 700 }}>
            <span>X: {telemetry.position[0].toFixed(1)}</span>
            <span>Y: {telemetry.position[1].toFixed(1)}</span>
            <span>Z: {telemetry.position[2].toFixed(1)}</span>
          </div>
        )}
      </div>

      {/* --- QUICK START GUIDE MODAL --- */}
      {showControlsGuide && (
        <div
          className="glass-panel"
          style={{
            position: 'absolute',
            top: 80,
            right: 20,
            width: 310,
            padding: 18,
            pointerEvents: 'auto',
            background: 'rgba(8, 12, 22, 0.94)',
            border: '1px solid rgba(255, 230, 0, 0.4)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6), 0 0 15px rgba(255, 230, 0, 0.2)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <span style={{ fontSize: 13, fontWeight: 800, color: '#ffe600', display: 'flex', alignItems: 'center', gap: 6, textShadow: '0 1px 2px #000' }}>
              <Zap size={15} /> {currentScene === 'mughal' ? 'Mughal World Guide' : currentScene === 'gupta' ? 'Gupta Dynasty Guide' : 'Harappa Exploration Guide'}
            </span>
            <button
              onClick={() => setShowControlsGuide(false)}
              style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: 14, fontWeight: 'bold' }}
            >
              ✕
            </button>
          </div>
          {currentScene === 'mughal' ? (
            <ul style={{ fontSize: 12, color: '#e2e8f0', lineHeight: 1.6, paddingLeft: 16 }}>
              <li><b>WASD / Space / Shift</b> to walk, jump, and sprint</li>
              <li>Explore the white marble <b>Taj Mahal</b> plinth</li>
              <li>Walk the <b>Charbagh Water Gardens</b> central channels</li>
              <li>Inspect <b>Humayun's Tomb</b>, <b>Agra Fort</b> & <b>Fatehpur Sikri</b></li>
              <li>Step into <b>Artifact Pedestals</b> for auto sensor popups</li>
            </ul>
          ) : currentScene === 'gupta' ? (
            <ul style={{ fontSize: 12, color: '#e2e8f0', lineHeight: 1.6, paddingLeft: 16 }}>
              <li><b>WASD / Space / Shift</b> to walk, jump, and sprint</li>
              <li>Inspect the central <b>Iron Pillar of Delhi</b></li>
              <li>Climb the tiered <b>Dashavatara Temple</b> (Deogarh)</li>
              <li>Explore <b>Nalanda University</b> & <b>Dhamek Stupa</b></li>
              <li>Step into <b>Artifact Pedestals</b> for auto sensor popups</li>
            </ul>
          ) : (
            <ul style={{ fontSize: 12, color: '#e2e8f0', lineHeight: 1.6, paddingLeft: 16 }}>
              <li><b>WASD / Space / Shift</b> to walk, jump, and sprint</li>
              <li>Walk up the <b>Grand Staircase</b> auto-stepping to Citadel</li>
              <li>Step down inside <b>The Great Bath</b> sunken pool</li>
              <li>Inspect the <b>4 Granaries</b> & <b>Lower Town Houses</b></li>
              <li>Approach <b>Artifact Pedestals</b> to record all 6 relics</li>
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
