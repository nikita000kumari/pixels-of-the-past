import React from 'react';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import { Grid, Float, Text } from '@react-three/drei';
import { ThematicMonumentSign } from './ThematicMonumentSign';

export function Ground() {
  return (
    <group>
      {/* 50x50 Test Ground Physics RigidBody */}
      <RigidBody type="fixed" friction={0.8} restitution={0.1}>
        {/* Cuboid collider halfExtents: width=25, height=0.5, depth=25 -> 50x50 plane */}
        <CuboidCollider args={[25, 0.5, 25]} position={[0, -0.5, 0]} />

        {/* Ground Floor Visual Mesh */}
        <mesh position={[0, -0.5, 0]} receiveShadow>
          <boxGeometry args={[50, 1, 50]} />
          <meshStandardMaterial
            color="#0b0f19"
            roughness={0.4}
            metalness={0.8}
            envMapIntensity={0.5}
          />
        </mesh>
      </RigidBody>

      {/* Cyber Grid Overlay on Ground Plane */}
      <Grid
        position={[0, 0.01, 0]}
        args={[50, 50]}
        cellSize={1}
        cellThickness={1}
        cellColor="#00f0ff"
        sectionSize={5}
        sectionThickness={1.5}
        sectionColor="#7000ff"
        fadeDistance={45}
        fadeStrength={1}
      />

      {/* 50x50 Perimeter Boundary Neon Light Tubes */}
      <group position={[0, 0.05, 0]}>
        {/* North Line (Z = -25) */}
        <mesh position={[0, 0, -25]}>
          <boxGeometry args={[50, 0.1, 0.2]} />
          <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={2} toneMapped={false} />
        </mesh>
        {/* South Line (Z = 25) */}
        <mesh position={[0, 0, 25]}>
          <boxGeometry args={[50, 0.1, 0.2]} />
          <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={2} toneMapped={false} />
        </mesh>
        {/* East Line (X = 25) */}
        <mesh position={[25, 0, 0]}>
          <boxGeometry args={[0.2, 0.1, 50]} />
          <meshStandardMaterial color="#ff0055" emissive="#ff0055" emissiveIntensity={2} toneMapped={false} />
        </mesh>
        {/* West Line (X = -25) */}
        <mesh position={[-25, 0, 0]}>
          <boxGeometry args={[0.2, 0.1, 50]} />
          <meshStandardMaterial color="#ff0055" emissive="#ff0055" emissiveIntensity={2} toneMapped={false} />
        </mesh>

        {/* Boundary Corner Pillars */}
        {[
          [-25, -25], [25, -25], [-25, 25], [25, 25]
        ].map(([px, pz], idx) => (
          <group key={idx} position={[px, 2, pz]}>
            <mesh castShadow>
              <boxGeometry args={[0.8, 4, 0.8]} />
              <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.2} />
            </mesh>
            <mesh position={[0, 2.1, 0]}>
              <sphereGeometry args={[0.5, 16, 16]} />
              <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={3} toneMapped={false} />
            </mesh>
          </group>
        ))}
      </group>

      {/* --- INTERACTIVE TEST OBJECTS ON 50x50 GROUND --- */}

      {/* 1. Pushable Dynamic Physics Cubes */}
      {[
        { pos: [-5, 1, -5], color: '#00f0ff', name: 'Cube A' },
        { pos: [-7, 1, -3], color: '#ff0055', name: 'Cube B' },
        { pos: [6, 1, -8], color: '#ffe600', name: 'Cube C' },
        { pos: [8, 1, -6], color: '#7000ff', name: 'Cube D' }
      ].map((item, i) => (
        <RigidBody key={i} position={item.pos} mass={0.5} restitution={0.4} friction={0.6}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[1.2, 1.2, 1.2]} />
            <meshStandardMaterial
              color={item.color}
              metalness={0.7}
              roughness={0.2}
              emissive={item.color}
              emissiveIntensity={0.4}
            />
          </mesh>
        </RigidBody>
      ))}

      {/* 2. Jump Ramps for Testing Controller */}
      <RigidBody type="fixed" position={[12, 0.6, 5]} rotation={[0.35, -Math.PI / 4, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[4, 0.4, 6]} />
          <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.21, 0]}>
          <boxGeometry args={[3.8, 0.02, 5.8]} />
          <meshStandardMaterial color="#ff0055" emissive="#ff0055" emissiveIntensity={1.5} toneMapped={false} />
        </mesh>
      </RigidBody>

      <RigidBody type="fixed" position={[-14, 0.6, 10]} rotation={[0.35, Math.PI / 3, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[4, 0.4, 6]} />
          <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.3} />
        </mesh>
      </RigidBody>

      {/* 3. Speed Boost Pads on the Ground */}
      <group position={[0, 0.02, 12]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[4, 8]} />
          <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={1.2} toneMapped={false} transparent opacity={0.6} />
        </mesh>
        {/* Arrow Chevron visual */}
        {[-2, 0, 2].map((zOffset, i) => (
          <mesh key={i} position={[0, 0.03, zOffset]} rotation={[-Math.PI / 2, 0, 0]}>
            <coneGeometry args={[1, 1.5, 3]} />
            <meshStandardMaterial color="#fff" emissive="#fff" emissiveIntensity={2} toneMapped={false} />
          </mesh>
        ))}
      </group>

      {/* 4. Futuristic Time Portal Arch (Teaser for "Pixels of the Past") */}
      <group position={[0, 0, -18]}>
        <RigidBody type="fixed">
          {/* Left Pillar */}
          <mesh position={[-3, 3, 0]} castShadow>
            <boxGeometry args={[1, 6, 1]} />
            <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.2} />
          </mesh>
          {/* Right Pillar */}
          <mesh position={[3, 3, 0]} castShadow>
            <boxGeometry args={[1, 6, 1]} />
            <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.2} />
          </mesh>
          {/* Top Arch Beam */}
          <mesh position={[0, 6, 0]} castShadow>
            <boxGeometry args={[7, 1, 1]} />
            <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.2} />
          </mesh>
        </RigidBody>

        {/* Portal Vortex Swirl */}
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          <mesh position={[0, 3, 0]}>
            <torusGeometry args={[2.2, 0.25, 16, 64]} />
            <meshStandardMaterial color="#7000ff" emissive="#7000ff" emissiveIntensity={3} toneMapped={false} />
          </mesh>
          <mesh position={[0, 3, 0]}>
            <circleGeometry args={[2, 32]} />
            <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={1.5} transparent opacity={0.4} side={2} />
          </mesh>
        </Float>

        <ThematicMonumentSign
          title="Pixels of the Past"
          subtitle="Chronicle Time Portal • Gateway to Ancient Empires"
          position={[0, 7.5, 0]}
          scale={1.25}
          theme="cyber"
        />
      </group>
    </group>
  );
}
