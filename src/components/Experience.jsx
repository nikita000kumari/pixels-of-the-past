import React from 'react';
import { Physics } from '@react-three/rapier';
import { Sky, ContactShadows, Stars } from '@react-three/drei';
import { Ground } from './Ground';
import { HarappaScene } from './HarappaScene';
import { GuptaScene } from './GuptaScene';
import { MughalScene } from './MughalScene';
import { PlayerController } from './PlayerController';

export function Experience({
  onTelemetryUpdate,
  resetTrigger,
  timeOfDay = 'cyber',
  currentScene = 'mughal',
  onEnterArtifactSensor,
  onExitArtifactSensor,
  activeArtifactId
}) {
  const isCyber = timeOfDay === 'cyber';
  const isMidnight = timeOfDay === 'midnight';

  return (
    <>
      {/* Sky & Stars background */}
      {isMidnight ? (
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      ) : (
        <Sky
          sunPosition={isCyber ? [100, 25, 40] : [100, 10, 10]}
          turbidity={6}
          rayleigh={isCyber ? 1.5 : 4}
          mieCoefficient={0.005}
          mieDirectionalG={0.8}
        />
      )}

      {/* Lighting */}
      <ambientLight intensity={isMidnight ? 0.35 : 0.65} />
      <directionalLight
        position={[30, 45, 25]}
        intensity={isMidnight ? 0.7 : 1.9}
        color={isCyber ? '#fff5e6' : isMidnight ? '#7000ff' : '#fff7ed'}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.5}
        shadow-camera-far={100}
        shadow-camera-left={-30}
        shadow-camera-right={30}
        shadow-camera-top={30}
        shadow-camera-bottom={-30}
      />

      <pointLight position={[-15, 8, -15]} color="#ffe600" intensity={3} distance={35} />
      <pointLight position={[15, 8, 15]} color="#00f0ff" intensity={3} distance={35} />

      <ContactShadows position={[0, 0.01, 0]} opacity={0.5} scale={48} blur={2.0} far={12} />

      {/* Rapier Physics Engine */}
      <Physics gravity={[0, -22, 0]}>
        {currentScene === 'mughal' ? (
          <MughalScene
            onEnterArtifactSensor={onEnterArtifactSensor}
            onExitArtifactSensor={onExitArtifactSensor}
            activeArtifactId={activeArtifactId}
          />
        ) : currentScene === 'gupta' ? (
          <GuptaScene
            onEnterArtifactSensor={onEnterArtifactSensor}
            onExitArtifactSensor={onExitArtifactSensor}
            activeArtifactId={activeArtifactId}
          />
        ) : currentScene === 'harappa' ? (
          <HarappaScene
            onEnterArtifactSensor={onEnterArtifactSensor}
            onExitArtifactSensor={onExitArtifactSensor}
            activeArtifactId={activeArtifactId}
          />
        ) : (
          <Ground />
        )}

        <PlayerController
          onTelemetryUpdate={onTelemetryUpdate}
          resetTrigger={resetTrigger}
        />
      </Physics>
    </>
  );
}
