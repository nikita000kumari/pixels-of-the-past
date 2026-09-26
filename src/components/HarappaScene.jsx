import React from 'react';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import { Grid, Text, Float, Billboard } from '@react-three/drei';
import { HARAPPAN_ARTIFACTS } from '../data/harappanArtifacts';
import { ThematicMonumentSign, ThematicArtifactSign } from './ThematicMonumentSign';

const COLORS = {
  brickDark: '#8b4513',
  brickMedium: '#c06c38',
  brickLight: '#d2691e',
  sandGround: '#b89768',
  citadelMound: '#9e7b4f',
  water: '#00a896',
  pedestal: '#2a1a08',
  goldGlow: '#ffe600',
  cyanGlow: '#00f0ff'
};

export function HarappaScene({ onEnterArtifactSensor, onExitArtifactSensor, activeArtifactId }) {
  return (
    <group>
      {/* --- 1. BASE GROUND TERRAIN (Lower Town, 50x50) --- */}
      <RigidBody type="fixed" friction={0.8} restitution={0.1}>
        <CuboidCollider args={[25, 0.5, 25]} position={[0, -0.5, 0]} />
        <mesh position={[0, -0.5, 0]} receiveShadow>
          <boxGeometry args={[50, 1, 50]} />
          <meshStandardMaterial color={COLORS.sandGround} roughness={0.9} metalness={0.1} />
        </mesh>
      </RigidBody>

      {/* Grid Pattern suggesting Indus urban city grid */}
      <Grid
        position={[0, 0.01, 0]}
        args={[50, 50]}
        cellSize={1}
        cellThickness={0.8}
        cellColor="#8c6d46"
        sectionSize={5}
        sectionThickness={1.5}
        sectionColor="#5c4428"
        fadeDistance={45}
      />

      {/* --- 2. UPPER TOWN (CITADEL MOUND & STAIRS) --- */}
      <RigidBody type="fixed" friction={0.8}>
        <CuboidCollider args={[12, 1.25, 10]} position={[-11, 1.25, -13]} />
        <mesh position={[-11, 1.25, -13]} castShadow receiveShadow>
          <boxGeometry args={[24, 2.5, 20]} />
          <meshStandardMaterial color={COLORS.citadelMound} roughness={0.85} />
        </mesh>

        <mesh position={[-11, 2.6, -2.9]} castShadow>
          <boxGeometry args={[24.2, 0.4, 0.4]} />
          <meshStandardMaterial color={COLORS.brickDark} />
        </mesh>
      </RigidBody>

      {/* Citadel Access Staircase */}
      <group position={[0, 0, -2]}>
        <RigidBody type="fixed" friction={0.4}>
          <CuboidCollider
            args={[2, 0.15, 2.3]}
            position={[0, 1.15, -1.0]}
            rotation={[0.55, 0, 0]}
          />
        </RigidBody>

        {[0, 1, 2, 3, 4, 5, 6, 7].map((step) => {
          const stepY = step * 0.3 + 0.15;
          const stepZ = -step * 0.35;
          return (
            <mesh key={step} position={[0, stepY, stepZ]} castShadow receiveShadow>
              <boxGeometry args={[3.6, 0.3, 0.4]} />
              <meshStandardMaterial color={COLORS.brickMedium} roughness={0.7} />
            </mesh>
          );
        })}

        <RigidBody type="fixed">
          <mesh position={[-2, 1.3, -1.2]} castShadow>
            <boxGeometry args={[0.4, 2.5, 3]} />
            <meshStandardMaterial color={COLORS.brickDark} />
          </mesh>
          <mesh position={[2, 1.3, -1.2]} castShadow>
            <boxGeometry args={[0.4, 2.5, 3]} />
            <meshStandardMaterial color={COLORS.brickDark} />
          </mesh>
        </RigidBody>
      </group>

      {/* --- 3. THE GREAT BATH OF MOHENJO-DARO --- */}
      <group position={[-5, 2.5, -13]}>
        <RigidBody type="fixed" friction={0.8}>
          <CuboidCollider args={[4, 0.2, 2.5]} position={[0, -1.4, 0]} />
          <mesh position={[0, -1.4, 0]} receiveShadow>
            <boxGeometry args={[8, 0.4, 5]} />
            <meshStandardMaterial color={COLORS.brickDark} roughness={0.6} />
          </mesh>

          <CuboidCollider args={[4.5, 0.8, 0.3]} position={[0, -0.7, -2.7]} />
          <mesh position={[0, -0.7, -2.7]} castShadow receiveShadow>
            <boxGeometry args={[9, 1.6, 0.6]} />
            <meshStandardMaterial color={COLORS.brickMedium} />
          </mesh>

          <CuboidCollider args={[4.5, 0.8, 0.3]} position={[0, -0.7, 2.7]} />
          <mesh position={[0, -0.7, 2.7]} castShadow receiveShadow>
            <boxGeometry args={[9, 1.6, 0.6]} />
            <meshStandardMaterial color={COLORS.brickMedium} />
          </mesh>

          <CuboidCollider args={[0.3, 0.8, 2.4]} position={[-4.2, -0.7, 0]} />
          <mesh position={[-4.2, -0.7, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.6, 1.6, 4.8]} />
            <meshStandardMaterial color={COLORS.brickMedium} />
          </mesh>

          <CuboidCollider args={[0.3, 0.8, 2.4]} position={[4.2, -0.7, 0]} />
          <mesh position={[4.2, -0.7, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.6, 1.6, 4.8]} />
            <meshStandardMaterial color={COLORS.brickMedium} />
          </mesh>

          <CuboidCollider args={[1.5, 0.1, 1.2]} position={[0, -0.7, -1.8]} rotation={[0.4, 0, 0]} />
          <CuboidCollider args={[1.5, 0.1, 1.2]} position={[0, -0.7, 1.8]} rotation={[-0.4, 0, 0]} />
        </RigidBody>

        {[-1.8, 1.8].map((zPos, sIdx) => (
          <group key={sIdx} position={[0, 0, zPos]}>
            {[0, 1, 2, 3].map((st) => (
              <mesh
                key={st}
                position={[0, -0.3 - st * 0.3, (sIdx === 0 ? st : -st) * 0.35]}
                castShadow
              >
                <boxGeometry args={[3.2, 0.3, 0.4]} />
                <meshStandardMaterial color={COLORS.brickLight} />
              </mesh>
            ))}
          </group>
        ))}

        <mesh position={[0, -0.5, 0]}>
          <planeGeometry args={[7.8, 4.8]} rotation={[-Math.PI / 2, 0, 0]} />
          <meshStandardMaterial
            color={COLORS.water}
            roughness={0.1}
            metalness={0.2}
            transparent
            opacity={0.75}
          />
        </mesh>

        {[
          [-5, -3.5], [0, -3.5], [5, -3.5],
          [-5, 3.5], [0, 3.5], [5, 3.5],
          [-5, 0], [5, 0]
        ].map(([px, pz], pIdx) => (
          <RigidBody key={pIdx} type="fixed">
            <mesh position={[px, 1.2, pz]} castShadow>
              <boxGeometry args={[0.8, 2.4, 0.8]} />
              <meshStandardMaterial color={COLORS.brickDark} roughness={0.7} />
            </mesh>
          </RigidBody>
        ))}

        <ThematicMonumentSign
          title="The Great Bath"
          subtitle="Bitumen-Sealed Public Bath of Mohenjo-daro • c. 2600 BCE"
          position={[0, 3.2, 0]}
          scale={1.15}
          theme="harappa"
        />
      </group>

      {/* --- 4. THE GRANARIES (CITADEL WEST) --- */}
      <group position={[-18, 2.5, -13]}>
        {[
          [-2.5, -4], [2.5, -4],
          [-2.5, 4], [2.5, 4]
        ].map(([gx, gz], gIdx) => (
          <RigidBody key={gIdx} type="fixed">
            <mesh position={[gx, 0.8, gz]} castShadow receiveShadow>
              <boxGeometry args={[4, 1.6, 6]} />
              <meshStandardMaterial color={COLORS.brickLight} roughness={0.8} />
            </mesh>
            <mesh position={[gx, 1.8, gz]} castShadow>
              <boxGeometry args={[4.2, 0.4, 6.2]} />
              <meshStandardMaterial color="#5c3a21" roughness={0.9} />
            </mesh>
          </RigidBody>
        ))}

        <ThematicMonumentSign
          title="Citadel Granaries"
          subtitle="Ventilated Brick Air-Duct Grain Vaults • c. 2500 BCE"
          position={[0, 3.2, 0]}
          scale={1.15}
          theme="harappa"
        />
      </group>

      {/* --- 5. LOWER TOWN HOUSING LAYOUT --- */}
      <group position={[13, 0, -12]}>
        {[
          { pos: [-4, 1.5, -4], size: [5, 3, 5] },
          { pos: [4, 1.5, -4], size: [5, 3, 5] },
          { pos: [-4, 1.5, 4], size: [5, 3, 5] },
          { pos: [4, 2.0, 4], size: [5, 4, 5] }
        ].map((h, hIdx) => (
          <RigidBody key={hIdx} type="fixed">
            <mesh position={h.pos} castShadow receiveShadow>
              <boxGeometry args={h.size} />
              <meshStandardMaterial color={COLORS.citadelMound} roughness={0.8} />
            </mesh>
            <mesh position={[h.pos[0], 0.9, h.pos[2] + h.size[2] / 2 + 0.01]}>
              <boxGeometry args={[1.2, 1.8, 0.05]} />
              <meshStandardMaterial color="#3d2817" />
            </mesh>
          </RigidBody>
        ))}

        <ThematicMonumentSign
          title="Lower Town Residential"
          subtitle="Grid-Planned Kiln-Baked Brick Quarters • c. 2500 BCE"
          position={[0, 4.5, 0]}
          scale={1.15}
          theme="harappa"
        />
      </group>

      <group position={[-13, 0, 12]}>
        {[
          { pos: [-4, 1.5, -4], size: [6, 3, 5] },
          { pos: [4, 1.8, -4], size: [5, 3.6, 6] },
          { pos: [0, 1.5, 4], size: [7, 3, 5] }
        ].map((h, hIdx) => (
          <RigidBody key={hIdx} type="fixed">
            <mesh position={h.pos} castShadow receiveShadow>
              <boxGeometry args={h.size} />
              <meshStandardMaterial color={COLORS.brickMedium} roughness={0.85} />
            </mesh>
          </RigidBody>
        ))}
      </group>

      {/* --- 6. ARTIFACTS DISPLAY HALL & PLAZA --- */}
      <group position={[0, 0, 0]}>
        <RigidBody type="fixed">
          <mesh position={[13, 0.05, 12]} receiveShadow>
            <boxGeometry args={[18, 0.1, 16]} />
            <meshStandardMaterial color="#4a3728" roughness={0.5} />
          </mesh>
        </RigidBody>

        <ThematicMonumentSign
          title="Excavation Treasury"
          subtitle="Sanctuary of Indus Bronzes, Seals & Relics"
          position={[13, 5.2, 3]}
          scale={1.2}
          theme="harappa"
        />

        {HARAPPAN_ARTIFACTS.map((artifact) => {
          const [ax, ay, az] = artifact.pos;
          const isCurrentActive = activeArtifactId === artifact.id;

          return (
            <group key={artifact.id} position={[ax, 0, az]}>
              {/* Display Stand Pedestal (Solid Physics) */}
              <RigidBody type="fixed">
                <mesh position={[0, 0.4, 0]} castShadow>
                  <boxGeometry args={[1.4, 0.8, 1.4]} />
                  <meshStandardMaterial color={COLORS.pedestal} metalness={0.5} roughness={0.3} />
                </mesh>
              </RigidBody>

              {/* Rapier Non-Blocking Sensor Collider for Proximity Detection */}
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

              {/* Pedestal Antique Bronze / Gold Inlay Trim */}
              <mesh position={[0, 0.81, 0]}>
                <boxGeometry args={[1.45, 0.04, 1.45]} />
                <meshStandardMaterial
                  color={isCurrentActive ? '#ffe600' : '#8c5828'}
                  emissive={isCurrentActive ? '#ffe600' : '#4a2c11'}
                  emissiveIntensity={isCurrentActive ? 2.5 : 0.3}
                  roughness={isCurrentActive ? 0.2 : 0.6}
                  metalness={isCurrentActive ? 0.8 : 0.5}
                />
              </mesh>

              {/* Primitive Mesh Representation of Artifact */}
              <group position={[0, 1.1, 0]}>
                {artifact.id === 'lingam' && (
                  <mesh castShadow>
                    <cylinderGeometry args={[0.25, 0.3, 0.6, 16]} />
                    <meshStandardMaterial color="#334155" roughness={0.2} metalness={0.8} />
                  </mesh>
                )}
                {artifact.id === 'pashupati' && (
                  <mesh castShadow rotation={[0.4, 0, 0]}>
                    <boxGeometry args={[0.5, 0.5, 0.08]} />
                    <meshStandardMaterial color="#8c7853" roughness={0.4} />
                  </mesh>
                )}
                {artifact.id === 'pottery' && (
                  <mesh castShadow>
                    <sphereGeometry args={[0.3, 16, 16]} />
                    <meshStandardMaterial color="#c06c38" roughness={0.6} />
                  </mesh>
                )}
                {artifact.id === 'dancing_girl' && (
                  <mesh castShadow>
                    <cylinderGeometry args={[0.08, 0.12, 0.7, 12]} />
                    <meshStandardMaterial color="#b87333" metalness={0.9} roughness={0.2} />
                  </mesh>
                )}
                {artifact.id === 'bullock' && (
                  <group>
                    <mesh position={[0, 0, 0]} castShadow>
                      <boxGeometry args={[0.5, 0.2, 0.3]} />
                      <meshStandardMaterial color="#d2691e" />
                    </mesh>
                    <mesh position={[-0.2, -0.1, 0]} rotation={[0, 0, Math.PI / 2]}>
                      <cylinderGeometry args={[0.15, 0.15, 0.05, 12]} />
                      <meshStandardMaterial color="#8b4513" />
                    </mesh>
                    <mesh position={[0.2, -0.1, 0]} rotation={[0, 0, Math.PI / 2]}>
                      <cylinderGeometry args={[0.15, 0.15, 0.05, 12]} />
                      <meshStandardMaterial color="#8b4513" />
                    </mesh>
                  </group>
                )}
                {artifact.id === 'jewellery' && (
                  <mesh castShadow>
                    <boxGeometry args={[0.5, 0.25, 0.4]} />
                    <meshStandardMaterial color="#ffe600" metalness={0.9} roughness={0.1} />
                  </mesh>
                )}
              </group>

              <ThematicArtifactSign
                name={artifact.name}
                isActive={isCurrentActive}
                position={[0, 1.65, 0]}
                theme="harappa"
              />
            </group>
          );
        })}
      </group>
    </group>
  );
}
