import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { KeyboardControls } from '@react-three/drei';
import { Experience } from './components/Experience';
import { UIOverlay } from './components/UIOverlay';
import { ArtifactModal } from './components/ArtifactModal';
import { ThreeErrorBoundary } from './components/ThreeErrorBoundary';
import { HubPage } from './components/HubPage';
import { voiceNarrator } from './services/voiceNarrator';

const keyboardMap = [
  { name: 'forward', keys: ['KeyW', 'ArrowUp'] },
  { name: 'backward', keys: ['KeyS', 'ArrowDown'] },
  { name: 'left', keys: ['KeyA', 'ArrowLeft'] },
  { name: 'right', keys: ['KeyD', 'ArrowRight'] },
  { name: 'jump', keys: ['Space'] },
  { name: 'sprint', keys: ['ShiftLeft', 'ShiftRight'] }
];

export default function App() {
  const [isHubOpen, setIsHubOpen] = useState(true); // Default entry screen
  const [currentScene, setCurrentScene] = useState('harappa');

  const [telemetry, setTelemetry] = useState({
    speed: 0,
    isGrounded: true,
    isSprinting: false,
    isMoving: false,
    position: [0, 2.5, 0]
  });

  const [resetTrigger, setResetTrigger] = useState(0);
  const [timeOfDay, setTimeOfDay] = useState('cyber');

  // Active artifact sensor popup state & collection log
  const [activeArtifact, setActiveArtifact] = useState(null);
  const [collectedArtifacts, setCollectedArtifacts] = useState([]);

  const handleResetPosition = () => {
    voiceNarrator.playSfx('teleport');
    setResetTrigger((prev) => prev + 1);
  };

  const handleSelectWorldFromHub = (sceneId) => {
    setCurrentScene(sceneId);
    setIsHubOpen(false);
    voiceNarrator.playEraMusic(sceneId);
    voiceNarrator.speakIntro(sceneId);
  };

  const handleSceneChange = (sceneId) => {
    setCurrentScene(sceneId);
    setActiveArtifact(null);
    voiceNarrator.stop();
    voiceNarrator.playEraMusic(sceneId);
    voiceNarrator.speakIntro(sceneId);
  };

  const handleOpenHub = () => {
    setActiveArtifact(null);
    voiceNarrator.stop();
    setIsHubOpen(true);
  };

  // Called when player character touches/enters Rapier sensor trigger zone
  const handleEnterArtifactSensor = (artifact) => {
    setActiveArtifact(artifact);
    if (!collectedArtifacts.includes(artifact.id)) {
      setCollectedArtifacts((prev) => [...prev, artifact.id]);
    }
  };

  // Called when player character exits Rapier sensor trigger zone (auto-dismiss popup!)
  const handleExitArtifactSensor = (artifact) => {
    setActiveArtifact((current) => {
      if (current?.id === artifact.id) {
        voiceNarrator.stop();
        return null;
      }
      return current;
    });
  };

  return (
    <KeyboardControls map={keyboardMap}>
      <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden', background: '#090a10' }}>
        {/* ENTRY SCREEN: Landing / Hub Page */}
        {isHubOpen ? (
          <HubPage onSelectWorld={handleSelectWorldFromHub} />
        ) : (
          <>
            {/* HUD UI Layer */}
            <UIOverlay
              telemetry={telemetry}
              onResetPosition={handleResetPosition}
              timeOfDay={timeOfDay}
              setTimeOfDay={setTimeOfDay}
              currentScene={currentScene}
              setCurrentScene={handleSceneChange}
              onOpenHub={handleOpenHub}
              collectedArtifactsCount={collectedArtifacts.length}
              totalArtifactsCount={6}
            />

            {/* Proximity Artifact Lore Popup */}
            <ArtifactModal
              artifact={activeArtifact}
              onClose={() => {
                voiceNarrator.stop();
                setActiveArtifact(null);
              }}
              isCollected={activeArtifact ? collectedArtifacts.includes(activeArtifact.id) : false}
            />

            {/* 3D WebGL Canvas */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}>
              <Canvas
                shadows
                camera={{ position: [0, 8, 14], fov: 50 }}
                style={{ width: '100%', height: '100%', background: '#090a10' }}
                gl={{ antialias: true, alpha: false }}
                onCreated={({ gl, scene, camera }) => {
                  console.log('[Pixels of the Past] R3F Canvas initialized successfully:', { gl, scene, camera });
                }}
              >
                <ThreeErrorBoundary>
                  <Suspense fallback={null}>
                    <Experience
                      onTelemetryUpdate={setTelemetry}
                      resetTrigger={resetTrigger}
                      timeOfDay={timeOfDay}
                      currentScene={currentScene}
                      onEnterArtifactSensor={handleEnterArtifactSensor}
                      onExitArtifactSensor={handleExitArtifactSensor}
                      activeArtifactId={activeArtifact?.id}
                    />
                  </Suspense>
                </ThreeErrorBoundary>
              </Canvas>
            </div>
          </>
        )}
      </div>
    </KeyboardControls>
  );
}
