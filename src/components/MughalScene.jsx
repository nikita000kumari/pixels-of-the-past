import React from 'react';
import { RigidBody, CuboidCollider, CylinderCollider } from '@react-three/rapier';
import { Grid, Text, Float, Billboard } from '@react-three/drei';
import { MUGHAL_ARTIFACTS } from '../data/mughalArtifacts';
import { ThematicMonumentSign, ThematicArtifactSign } from './ThematicMonumentSign';

const COLORS = {
  whiteMarble: '#f8fafc',
  marbleShadow: '#e2e8f0',
  redSandstone: '#9e472a',
  redFortDark: '#7a2211',
  water: '#00a896',
  gardenGreen: '#2d6a4f',
  goldGlow: '#ffe600',
  cyanGlow: '#00f0ff',
  pedestal: '#1f1a14'
};

export function MughalScene({ onEnterArtifactSensor, onExitArtifactSensor, activeArtifactId }) {
  return (
    <group>
      {/* --- 1. BASE GROUND TERRAIN (Mughal Empire, 50x50) --- */}
      <RigidBody type="fixed" friction={0.8} restitution={0.1}>
        <CuboidCollider args={[25, 0.5, 25]} position={[0, -0.5, 0]} />
        <mesh position={[0, -0.5, 0]} receiveShadow>
          <boxGeometry args={[50, 1, 50]} />
          <meshStandardMaterial color="#c4b299" roughness={0.7} metalness={0.1} />
        </mesh>
      </RigidBody>

      {/* Mughal Geometric Paving Grid */}
      <Grid
        position={[0, 0.01, 0]}
        args={[50, 50]}
        cellSize={1}
        cellThickness={0.8}
        cellColor="#a38f75"
        sectionSize={5}
        sectionThickness={1.5}
        sectionColor="#6e4f35"
        fadeDistance={45}
      />

      {/* --- 2. CHARBAGH GARDENS & CENTRAL WATER CHANNELS (X = 0, Z = 0) --- */}
      <group position={[0, 0, 0]}>
        {/* 4 Quadrant Garden Plots */}
        {[
          [-6, -6], [6, -6], [-6, 6], [6, 6]
        ].map(([gx, gz], gIdx) => (
          <mesh key={gIdx} position={[gx, 0.04, gz]} receiveShadow>
            <boxGeometry args={[8, 0.08, 8]} />
            <meshStandardMaterial color={COLORS.gardenGreen} roughness={0.9} />
          </mesh>
        ))}

        {/* North-South Water Channel */}
        <mesh position={[0, 0.03, 0]} receiveShadow>
          <boxGeometry args={[2, 0.06, 44]} />
          <meshStandardMaterial color={COLORS.water} roughness={0.1} metalness={0.3} transparent opacity={0.85} />
        </mesh>
        {/* East-West Water Channel */}
        <mesh position={[0, 0.03, 0]} receiveShadow>
          <boxGeometry args={[44, 0.06, 2]} />
          <meshStandardMaterial color={COLORS.water} roughness={0.1} metalness={0.3} transparent opacity={0.85} />
        </mesh>

        {/* Central Fountain Pool Intersection */}
        <mesh position={[0, 0.05, 0]} receiveShadow>
          <cylinderGeometry args={[2.5, 2.5, 0.1, 24]} />
          <meshStandardMaterial color={COLORS.water} roughness={0.1} metalness={0.5} transparent opacity={0.9} />
        </mesh>
        <Float speed={3} floatIntensity={0.5}>
          <mesh position={[0, 0.8, 0]}>
            <sphereGeometry args={[0.3, 16, 16]} />
            <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={2} toneMapped={false} />
          </mesh>
        </Float>

        <ThematicMonumentSign
          title="Charbagh Water Gardens"
          subtitle="Quadripartite Paradise Fountains • c. 1526 CE"
          position={[0, 3.5, 0]}
          scale={1.05}
          theme="mughal"
        />
      </group>

      {/* --- 3. TAJ MAHAL (NORTH-EAST: X = 12, Z = -12) --- */}
      <group position={[12, 0, -12]}>
        {/* Raised White Marble Plinth Platform (Y = 1.0) */}
        <RigidBody type="fixed" friction={0.8}>
          <CuboidCollider args={[7, 0.5, 7]} position={[0, 0.5, 0]} />
          <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
            <boxGeometry args={[14, 1.0, 14]} />
            <meshStandardMaterial color={COLORS.whiteMarble} roughness={0.2} metalness={0.1} />
          </mesh>
        </RigidBody>

        {/* Access Stairs to Plinth with Auto-Step Ramp */}
        <group position={[0, 0, 7]}>
          <RigidBody type="fixed" friction={0.4}>
            <CuboidCollider args={[1.8, 0.1, 1.2]} position={[0, 0.5, 0.6]} rotation={[-0.4, 0, 0]} />
          </RigidBody>
          {[0, 1, 2, 3].map((step) => (
            <mesh key={step} position={[0, step * 0.25 + 0.1, step * 0.3]} castShadow>
              <boxGeometry args={[3.8, 0.25, 0.35]} />
              <meshStandardMaterial color={COLORS.marbleShadow} />
            </mesh>
          ))}
        </group>

        {/* Central Tomb Building */}
        <RigidBody type="fixed">
          <mesh position={[0, 2.75, 0]} castShadow receiveShadow>
            <boxGeometry args={[8, 3.5, 8]} />
            <meshStandardMaterial color={COLORS.whiteMarble} roughness={0.15} metalness={0.1} />
          </mesh>
          {/* Main Onion Dome */}
          <mesh position={[0, 6.0, 0]} castShadow>
            <sphereGeometry args={[2.8, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.7]} />
            <meshStandardMaterial color={COLORS.whiteMarble} roughness={0.1} />
          </mesh>
          {/* Top Spire Finial */}
          <mesh position={[0, 8.8, 0]}>
            <coneGeometry args={[0.2, 1.2, 12]} />
            <meshStandardMaterial color={COLORS.goldGlow} metalness={0.9} roughness={0.1} />
          </mesh>
        </RigidBody>

        {/* 4 Corner Minaret Towers */}
        {[
          [-6, -6], [6, -6], [-6, 6], [6, 6]
        ].map(([mx, mz], mIdx) => (
          <RigidBody key={mIdx} type="fixed">
            <CylinderCollider args={[3.8, 0.4]} position={[mx, 4.8, mz]} />
            <mesh position={[mx, 4.8, mz]} castShadow>
              <cylinderGeometry args={[0.35, 0.45, 7.5, 24]} />
              <meshStandardMaterial color={COLORS.whiteMarble} roughness={0.2} />
            </mesh>
            {/* Minaret Cupola Top */}
            <mesh position={[mx, 8.8, mz]}>
              <sphereGeometry args={[0.5, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
              <meshStandardMaterial color={COLORS.whiteMarble} />
            </mesh>
          </RigidBody>
        ))}

        <ThematicMonumentSign
          title="Taj Mahal"
          subtitle="Rauza-i-Munawwara • Makrana Marble Mausoleum • c. 1632 CE"
          position={[0, 9.8, 0]}
          scale={1.2}
          theme="mughal"
        />
      </group>

      {/* --- 4. HUMAYUN'S TOMB (NORTH-WEST: X = -12, Z = -12) --- */}
      <group position={[-12, 0, -12]}>
        {/* Stepped Red Sandstone Base Platform */}
        <RigidBody type="fixed" friction={0.8}>
          <CuboidCollider args={[6, 0.5, 6]} position={[0, 0.5, 0]} />
          <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
            <boxGeometry args={[12, 1.0, 12]} />
            <meshStandardMaterial color={COLORS.redSandstone} roughness={0.8} />
          </mesh>
        </RigidBody>

        {/* Access Stairs */}
        <group position={[0, 0, 6]}>
          <RigidBody type="fixed" friction={0.4}>
            <CuboidCollider args={[1.5, 0.1, 1.2]} position={[0, 0.5, 0.6]} rotation={[-0.4, 0, 0]} />
          </RigidBody>
          {[0, 1, 2, 3].map((step) => (
            <mesh key={step} position={[0, step * 0.25 + 0.1, step * 0.3]} castShadow>
              <boxGeometry args={[3.2, 0.25, 0.35]} />
              <meshStandardMaterial color={COLORS.redFortDark} />
            </mesh>
          ))}
        </group>

        {/* Symmetrical Tomb Structure */}
        <RigidBody type="fixed">
          <mesh position={[0, 2.5, 0]} castShadow receiveShadow>
            <boxGeometry args={[7, 3.0, 7]} />
            <meshStandardMaterial color={COLORS.redSandstone} roughness={0.75} />
          </mesh>
          {/* Double White Marble Dome */}
          <mesh position={[0, 5.2, 0]} castShadow>
            <sphereGeometry args={[2.2, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.65]} />
            <meshStandardMaterial color={COLORS.whiteMarble} roughness={0.2} />
          </mesh>
        </RigidBody>

        <ThematicMonumentSign
          title="Humayun's Tomb"
          subtitle="Sandstone Imperial Necropolis • c. 1570 CE"
          position={[0, 7.8, 0]}
          scale={1.15}
          theme="mughal"
        />
      </group>

      {/* --- 5. AGRA FORT RAMPARTS (SOUTH-WEST: X = -12, Z = 12) --- */}
      <group position={[-12, 0, 12]}>
        <RigidBody type="fixed">
          {/* North Wall */}
          <mesh position={[0, 2.0, -5]} castShadow>
            <boxGeometry args={[11, 4.0, 1.2]} />
            <meshStandardMaterial color={COLORS.redFortDark} roughness={0.8} />
          </mesh>
          {/* West Wall */}
          <mesh position={[-5, 2.0, 0]} castShadow>
            <boxGeometry args={[1.2, 4.0, 11]} />
            <meshStandardMaterial color={COLORS.redFortDark} roughness={0.8} />
          </mesh>
          {/* South Wall with Gate Opening Cutout */}
          <mesh position={[-3.5, 2.0, 5]} castShadow>
            <boxGeometry args={[4, 4.0, 1.2]} />
            <meshStandardMaterial color={COLORS.redFortDark} roughness={0.8} />
          </mesh>
          <mesh position={[3.5, 2.0, 5]} castShadow>
            <boxGeometry args={[4, 4.0, 1.2]} />
            <meshStandardMaterial color={COLORS.redFortDark} roughness={0.8} />
          </mesh>
          {/* Arch Gate Beam over entrance */}
          <mesh position={[0, 3.5, 5]} castShadow>
            <boxGeometry args={[3, 1.0, 1.2]} />
            <meshStandardMaterial color={COLORS.redSandstone} roughness={0.7} />
          </mesh>
        </RigidBody>

        <ThematicMonumentSign
          title="Agra Fort Ramparts"
          subtitle="Crimson Sandstone Bastions of Akbar • c. 1565 CE"
          position={[0, 5.2, 0]}
          scale={1.15}
          theme="mughal"
        />
      </group>

      {/* --- 6. FATEHPUR SIKRI & BULAND DARWAZA (SOUTH-EAST: X = 12, Z = 12) --- */}
      <group position={[12, 0, 12]}>
        {/* Buland Darwaza Monumental Gate Tower */}
        <RigidBody type="fixed">
          {/* Left Gate Tower */}
          <mesh position={[-2.2, 3.25, 0]} castShadow>
            <boxGeometry args={[2.0, 6.5, 2.5]} />
            <meshStandardMaterial color={COLORS.redSandstone} roughness={0.8} />
          </mesh>
          {/* Right Gate Tower */}
          <mesh position={[2.2, 3.25, 0]} castShadow>
            <boxGeometry args={[2.0, 6.5, 2.5]} />
            <meshStandardMaterial color={COLORS.redSandstone} roughness={0.8} />
          </mesh>
          {/* Archway Portal Beam */}
          <mesh position={[0, 5.25, 0]} castShadow>
            <boxGeometry args={[2.4, 2.5, 2.5]} />
            <meshStandardMaterial color={COLORS.redFortDark} roughness={0.7} />
          </mesh>
        </RigidBody>

        {/* Panch Mahal 5-Tiered Pillared Structure */}
        <group position={[5, 0, 5]}>
          {[0, 1, 2, 3].map((tier) => (
            <RigidBody key={tier} type="fixed">
              <mesh position={[0, tier * 1.1 + 0.5, 0]} castShadow>
                <boxGeometry args={[4 - tier * 0.8, 0.3, 4 - tier * 0.8]} />
                <meshStandardMaterial color={COLORS.redSandstone} roughness={0.8} />
              </mesh>
            </RigidBody>
          ))}
        </group>

        <ThematicMonumentSign
          title="Fatehpur Sikri • Buland Darwaza"
          subtitle="Akbar's Gate of Magnificence • c. 1573 CE"
          position={[0, 7.2, 0]}
          scale={1.15}
          theme="mughal"
        />
      </group>

      {/* --- 7. ARTIFACT COLLECTIBLE PEDESTALS & SENSOR TRIGGERS --- */}
      <group position={[0, 0, 0]}>
        {MUGHAL_ARTIFACTS.map((artifact) => {
          const [ax, ay, az] = artifact.pos;
          const isCurrentActive = activeArtifactId === artifact.id;

          return (
            <group key={artifact.id} position={[ax, 0, az]}>
              {/* Display Stand Pedestal */}
              <RigidBody type="fixed">
                <mesh position={[0, 0.4, 0]} castShadow>
                  <boxGeometry args={[1.4, 0.8, 1.4]} />
                  <meshStandardMaterial color={COLORS.pedestal} metalness={0.6} roughness={0.3} />
                </mesh>
              </RigidBody>

              {/* Rapier Non-Blocking Sensor Collider */}
              <RigidBody type="fixed" colliders={false}>
                <CuboidCollider
                  args={[1.8, 1.8, 1.8]}
                  position={[0, 1.0, 0]}
                  sensor
                  onIntersectionEnter={() => {
                    if (onEnterArtifactSensor) onEnterArtifactSensor(artifact);
                  }}
                  onIntersectionExit={() => {
                    if (onExitArtifactSensor) onExitArtifactSensor(artifact);
                  }}
                />
              </RigidBody>

              {/* Pedestal Antique Gold Inlay Trim */}
              <mesh position={[0, 0.81, 0]}>
                <boxGeometry args={[1.45, 0.04, 1.45]} />
                <meshStandardMaterial
                  color={isCurrentActive ? '#ffe600' : '#b89343'}
                  emissive={isCurrentActive ? '#ffe600' : '#473510'}
                  emissiveIntensity={isCurrentActive ? 2.5 : 0.3}
                  roughness={isCurrentActive ? 0.2 : 0.5}
                  metalness={isCurrentActive ? 0.8 : 0.6}
                />
              </mesh>

              {/* Primitive Mesh Representation of Mughal Artifact */}
              <group position={[0, 1.1, 0]}>
                {artifact.id === 'peacock_throne' && (
                  <mesh castShadow>
                    <boxGeometry args={[0.6, 0.4, 0.5]} />
                    <meshStandardMaterial color="#ffe600" metalness={0.9} roughness={0.1} />
                  </mesh>
                )}
                {artifact.id === 'kohinoor' && (
                  <mesh castShadow>
                    <octahedronGeometry args={[0.35]} />
                    <meshStandardMaterial color="#ffffff" metalness={0.95} roughness={0.05} emissive="#00f0ff" emissiveIntensity={0.5} />
                  </mesh>
                )}
                {artifact.id === 'padshahnama' && (
                  <mesh castShadow>
                    <boxGeometry args={[0.5, 0.15, 0.4]} />
                    <meshStandardMaterial color="#9e472a" roughness={0.6} />
                  </mesh>
                )}
                {artifact.id === 'shamshir' && (
                  <mesh castShadow rotation={[0, 0, 0.5]}>
                    <boxGeometry args={[0.08, 0.7, 0.08]} />
                    <meshStandardMaterial color="#c0c0c0" metalness={0.95} roughness={0.1} />
                  </mesh>
                )}
                {artifact.id === 'jahangir_dagger' && (
                  <mesh castShadow rotation={[0, 0, -0.4]}>
                    <cylinderGeometry args={[0.04, 0.08, 0.5, 12]} />
                    <meshStandardMaterial color="#2d6a4f" metalness={0.8} roughness={0.2} />
                  </mesh>
                )}
                {artifact.id === 'akbarnama' && (
                  <mesh castShadow>
                    <boxGeometry args={[0.5, 0.2, 0.4]} />
                    <meshStandardMaterial color="#7a2211" roughness={0.7} />
                  </mesh>
                )}
              </group>

              <ThematicArtifactSign
                name={artifact.name}
                isActive={isCurrentActive}
                position={[0, 1.65, 0]}
                theme="mughal"
              />
            </group>
          );
        })}
      </group>
    </group>
  );
}
