import React from 'react';
import { RigidBody, CuboidCollider, CylinderCollider } from '@react-three/rapier';
import { Grid, Text, Float, Billboard } from '@react-three/drei';
import { GUPTA_ARTIFACTS } from '../data/guptaArtifacts';
import { ThematicMonumentSign, ThematicArtifactSign } from './ThematicMonumentSign';

const COLORS = {
  sandstone: '#b8926a',
  sandstoneDark: '#8c6543',
  brickRed: '#9e472a',
  brickDark: '#6b2d18',
  stupaStone: '#a38f78',
  ironPillar: '#2b2d42',
  goldGlow: '#ffe600',
  cyanGlow: '#00f0ff',
  pedestal: '#1f1a14'
};

export function GuptaScene({ onEnterArtifactSensor, onExitArtifactSensor, activeArtifactId }) {
  return (
    <group>
      {/* --- 1. BASE GROUND TERRAIN (Gupta World, 50x50) --- */}
      <RigidBody type="fixed" friction={0.8} restitution={0.1}>
        <CuboidCollider args={[25, 0.5, 25]} position={[0, -0.5, 0]} />
        <mesh position={[0, -0.5, 0]} receiveShadow>
          <boxGeometry args={[50, 1, 50]} />
          <meshStandardMaterial color="#8a6949" roughness={0.85} metalness={0.15} />
        </mesh>
      </RigidBody>

      {/* Ancient Indian Golden Paving Grid */}
      <Grid
        position={[0, 0.01, 0]}
        args={[50, 50]}
        cellSize={1}
        cellThickness={0.8}
        cellColor="#b38b59"
        sectionSize={5}
        sectionThickness={1.5}
        sectionColor="#66492c"
        fadeDistance={45}
      />

      {/* --- 2. IRON PILLAR OF DELHI (CENTRAL PLAZA: X = 0, Z = 0) --- */}
      <group position={[0, 0, 0]}>
        {/* Ceremonial Paved Plaza Platform */}
        <RigidBody type="fixed">
          <mesh position={[0, 0.05, 0]} receiveShadow>
            <boxGeometry args={[10, 0.1, 10]} />
            <meshStandardMaterial color="#473a2b" roughness={0.5} />
          </mesh>
          <mesh position={[0, 0.15, 0]} receiveShadow>
            <boxGeometry args={[3, 0.2, 3]} />
            <meshStandardMaterial color="#2d2419" roughness={0.4} />
          </mesh>
        </RigidBody>

        {/* Tall Thin Rust-Resistant Iron Pillar (Physics Cylinder) */}
        <RigidBody type="fixed">
          <CylinderCollider args={[2.8, 0.25]} position={[0, 2.9, 0]} />
          <mesh position={[0, 2.9, 0]} castShadow>
            <cylinderGeometry args={[0.22, 0.28, 5.5, 24]} />
            <meshStandardMaterial color={COLORS.ironPillar} metalness={0.92} roughness={0.15} />
          </mesh>
          {/* Bell Capital Top & Crown */}
          <mesh position={[0, 5.7, 0]} castShadow>
            <cylinderGeometry args={[0.4, 0.22, 0.5, 16]} />
            <meshStandardMaterial color="#484b6a" metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh position={[0, 6.1, 0]}>
            <sphereGeometry args={[0.25, 16, 16]} />
            <meshStandardMaterial color={COLORS.goldGlow} emissive={COLORS.goldGlow} emissiveIntensity={1.5} />
          </mesh>
        </RigidBody>

        <ThematicMonumentSign
          title="Iron Pillar of Delhi"
          subtitle="Garuda Standard of King Chandra • c. 400 CE"
          position={[0, 6.8, 0]}
          scale={1.15}
          theme="gupta"
        />
      </group>

      {/* --- 3. DASHAVATARA TEMPLE OF DEOGARH (NORTH-WEST: X = -12, Z = -12) --- */}
      <group position={[-12, 0, -12]}>
        {/* Raised Jagati Platform (Y = 1.0) */}
        <RigidBody type="fixed" friction={0.8}>
          <CuboidCollider args={[5.5, 0.5, 5.5]} position={[0, 0.5, 0]} />
          <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
            <boxGeometry args={[11, 1.0, 11]} />
            <meshStandardMaterial color={COLORS.sandstone} roughness={0.8} />
          </mesh>
        </RigidBody>

        {/* Temple Entrance Staircase (Ramp Collider for Auto-Stepping) */}
        <group position={[0, 0, 5.5]}>
          <RigidBody type="fixed" friction={0.4}>
            <CuboidCollider args={[1.5, 0.1, 1.2]} position={[0, 0.5, 0.6]} rotation={[-0.4, 0, 0]} />
          </RigidBody>
          {[0, 1, 2, 3].map((step) => (
            <mesh key={step} position={[0, step * 0.25 + 0.1, step * 0.3]} castShadow>
              <boxGeometry args={[3.2, 0.25, 0.35]} />
              <meshStandardMaterial color={COLORS.sandstoneDark} />
            </mesh>
          ))}
        </group>

        {/* Tiered / Stepped Pyramid Shikhara Tower */}
        <RigidBody type="fixed">
          {/* Base Tier */}
          <mesh position={[0, 1.6, 0]} castShadow receiveShadow>
            <boxGeometry args={[7, 1.2, 7]} />
            <meshStandardMaterial color={COLORS.sandstoneDark} roughness={0.7} />
          </mesh>
          {/* Middle Tier */}
          <mesh position={[0, 2.8, 0]} castShadow receiveShadow>
            <boxGeometry args={[5, 1.2, 5]} />
            <meshStandardMaterial color={COLORS.sandstone} roughness={0.75} />
          </mesh>
          {/* Top Tier */}
          <mesh position={[0, 4.0, 0]} castShadow receiveShadow>
            <boxGeometry args={[3, 1.2, 3]} />
            <meshStandardMaterial color={COLORS.sandstoneDark} roughness={0.8} />
          </mesh>
          {/* Kalasha Crown */}
          <mesh position={[0, 4.9, 0]} castShadow>
            <sphereGeometry args={[0.6, 16, 16]} />
            <meshStandardMaterial color="#d4a373" metalness={0.6} roughness={0.3} />
          </mesh>
        </RigidBody>

        {/* 4 Corner Porch Pillars */}
        {[
          [-3, -3], [3, -3], [-3, 3], [3, 3]
        ].map(([px, pz], pIdx) => (
          <RigidBody key={pIdx} type="fixed">
            <mesh position={[px, 1.6, pz]} castShadow>
              <cylinderGeometry args={[0.25, 0.3, 2.2, 12]} />
              <meshStandardMaterial color={COLORS.sandstone} roughness={0.6} />
            </mesh>
          </RigidBody>
        ))}

        <ThematicMonumentSign
          title="Dashavatara Temple"
          subtitle="Panchayatana Vishnu Sanctum • Deogarh • c. 500 CE"
          position={[0, 6.0, 0]}
          scale={1.15}
          theme="gupta"
        />
      </group>

      {/* --- 4. NALANDA UNIVERSITY MONASTIC COMPLEX (NORTH-EAST: X = 12, Z = -12) --- */}
      <group position={[12, 0, -12]}>
        {/* Monastic Courtyard & Buildings */}
        {[
          { pos: [-5, 1.5, 0], size: [3, 3, 12] },  // West Wing
          { pos: [5, 1.5, 0], size: [3, 3, 12] },   // East Wing
          { pos: [0, 1.5, -5], size: [12, 3, 3] },  // North Wing (Library)
          { pos: [0, 1.5, 5], size: [8, 3, 3] }     // South Entrance Gate
        ].map((wing, wIdx) => (
          <RigidBody key={wIdx} type="fixed">
            <mesh position={wing.pos} castShadow receiveShadow>
              <boxGeometry args={wing.size} />
              <meshStandardMaterial color={COLORS.brickRed} roughness={0.8} />
            </mesh>
          </RigidBody>
        ))}

        {/* Central Courtyard Stupa Shrine */}
        <RigidBody type="fixed">
          <mesh position={[0, 1.0, 0]} castShadow>
            <cylinderGeometry args={[1.2, 1.5, 2.0, 24]} />
            <meshStandardMaterial color={COLORS.stupaStone} roughness={0.7} />
          </mesh>
          <mesh position={[0, 2.3, 0]}>
            <sphereGeometry args={[0.9, 16, 16]} />
            <meshStandardMaterial color="#c59b6c" roughness={0.5} />
          </mesh>
        </RigidBody>

        <ThematicMonumentSign
          title="Nalanda Mahavihara"
          subtitle="Ancient Buddhist Monastic University • c. 427 CE"
          position={[0, 4.8, 0]}
          scale={1.15}
          theme="gupta"
        />
      </group>

      {/* --- 5. DHAMEK STUPA OF SARNATH (SOUTH-WEST: X = -12, Z = 12) --- */}
      <group position={[-12, 0, 12]}>
        {/* Circular Pradakshina Patha Base */}
        <RigidBody type="fixed">
          <mesh position={[0, 0.1, 0]} receiveShadow>
            <cylinderGeometry args={[5.5, 5.5, 0.2, 32]} />
            <meshStandardMaterial color="#594837" roughness={0.6} />
          </mesh>
        </RigidBody>

        {/* Large Cylindrical Stupa Dome Structure */}
        <RigidBody type="fixed">
          {/* Base Drum */}
          <CylinderCollider args={[2.0, 4.0]} position={[0, 2.0, 0]} />
          <mesh position={[0, 2.0, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[4.0, 4.2, 4.0, 32]} />
            <meshStandardMaterial color={COLORS.stupaStone} roughness={0.75} />
          </mesh>

          {/* Carved Decorative Relief Band */}
          <mesh position={[0, 4.2, 0]}>
            <cylinderGeometry args={[3.8, 3.8, 0.6, 32]} />
            <meshStandardMaterial color="#8c785e" roughness={0.5} />
          </mesh>

          {/* Upper Cylindrical Dome */}
          <CylinderCollider args={[1.5, 3.6]} position={[0, 5.7, 0]} />
          <mesh position={[0, 5.7, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[3.6, 3.8, 3.0, 32]} />
            <meshStandardMaterial color={COLORS.stupaStone} roughness={0.75} />
          </mesh>

          {/* Dome Top Cap */}
          <mesh position={[0, 7.2, 0]}>
            <sphereGeometry args={[3.4, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial color="#8c785e" roughness={0.7} />
          </mesh>
        </RigidBody>

        <ThematicMonumentSign
          title="Dhamek Stupa"
          subtitle="Sacred Deer Park of Sarnath • c. 500 CE"
          position={[0, 9.2, 0]}
          scale={1.2}
          theme="gupta"
        />
      </group>

      {/* --- 6. ARTIFACT COLLECTIBLE PEDESTALS & SENSOR TRIGGERS --- */}
      <group position={[0, 0, 0]}>
        {GUPTA_ARTIFACTS.map((artifact) => {
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

              {/* Rapier Non-Blocking Sensor Collider for Auto-Popup Trigger */}
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
                  color={isCurrentActive ? '#ffe600' : '#b38d3b'}
                  emissive={isCurrentActive ? '#ffe600' : '#453512'}
                  emissiveIntensity={isCurrentActive ? 2.5 : 0.3}
                  roughness={isCurrentActive ? 0.2 : 0.5}
                  metalness={isCurrentActive ? 0.8 : 0.6}
                />
              </mesh>

              {/* Primitive Mesh Representation of Gupta Artifact */}
              <group position={[0, 1.1, 0]}>
                {artifact.id === 'gold_coin' && (
                  <mesh castShadow rotation={[Math.PI / 2, 0, 0]}>
                    <cylinderGeometry args={[0.3, 0.3, 0.05, 24]} />
                    <meshStandardMaterial color="#ffe600" metalness={0.95} roughness={0.1} />
                  </mesh>
                )}
                {artifact.id === 'sarnath_buddha' && (
                  <mesh castShadow>
                    <cylinderGeometry args={[0.2, 0.3, 0.7, 16]} />
                    <meshStandardMaterial color="#b8926a" roughness={0.4} />
                  </mesh>
                )}
                {artifact.id === 'nalanda_buddha' && (
                  <mesh castShadow>
                    <cylinderGeometry args={[0.1, 0.15, 0.8, 16]} />
                    <meshStandardMaterial color="#b87333" metalness={0.9} roughness={0.2} />
                  </mesh>
                )}
                {artifact.id === 'varaha_relief' && (
                  <mesh castShadow rotation={[0.3, 0, 0]}>
                    <boxGeometry args={[0.6, 0.6, 0.1]} />
                    <meshStandardMaterial color="#8c6543" roughness={0.6} />
                  </mesh>
                )}
                {artifact.id === 'sushruta_codex' && (
                  <mesh castShadow>
                    <boxGeometry args={[0.6, 0.15, 0.4]} />
                    <meshStandardMaterial color="#5c3a21" roughness={0.7} />
                  </mesh>
                )}
                {artifact.id === 'aryabhatiya' && (
                  <mesh castShadow>
                    <sphereGeometry args={[0.28, 16, 16]} />
                    <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={0.8} />
                  </mesh>
                )}
              </group>

              <ThematicArtifactSign
                name={artifact.name}
                isActive={isCurrentActive}
                position={[0, 1.65, 0]}
                theme="gupta"
              />
            </group>
          );
        })}
      </group>
    </group>
  );
}
