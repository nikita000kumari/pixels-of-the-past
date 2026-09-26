import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function RobotAvatar({ speed = 0, isGrounded = true, isSprinting = false }) {
  // References to limbs for procedural animation
  const avatarGroupRef = useRef();
  const torsoRef = useRef();
  const headRef = useRef();
  const leftArmRef = useRef();
  const rightArmRef = useRef();
  const leftLegRef = useRef();
  const rightLegRef = useRef();
  const reactorRef = useRef();
  const leftFootGlowRef = useRef();
  const rightFootGlowRef = useRef();

  const phase = useRef(0);
  const smoothSpeed = useRef(0);

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    // Smooth out speed changes for fluid transition between idle -> walk -> run
    smoothSpeed.current = THREE.MathUtils.lerp(smoothSpeed.current, speed, 0.15);
    const currSpeed = smoothSpeed.current;

    // Advance animation phase based on movement speed
    const animRate = isSprinting ? 14 : 9;
    phase.current += delta * Math.max(2, currSpeed * animRate * 0.25);

    // Calculate animation weights (0 = Idle, 1 = Max Run)
    const normalizedSpeed = Math.min(currSpeed / 12, 1);
    const strideAmp = normalizedSpeed * (isSprinting ? 0.65 : 0.45);

    if (avatarGroupRef.current) {
      if (!isGrounded) {
        // --- JUMP ANIMATION STATE ---
        // Torso tilts up slightly
        torsoRef.current.rotation.x = THREE.MathUtils.lerp(torsoRef.current.rotation.x, -0.15, 0.2);
        torsoRef.current.position.y = THREE.MathUtils.lerp(torsoRef.current.position.y, 0.05, 0.2);

        // Arms flare back
        leftArmRef.current.rotation.x = THREE.MathUtils.lerp(leftArmRef.current.rotation.x, -0.6, 0.2);
        rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, -0.6, 0.2);
        leftArmRef.current.rotation.z = THREE.MathUtils.lerp(leftArmRef.current.rotation.z, 0.3, 0.2);
        rightArmRef.current.rotation.z = THREE.MathUtils.lerp(rightArmRef.current.rotation.z, -0.3, 0.2);

        // Legs tuck upwards
        leftLegRef.current.rotation.x = THREE.MathUtils.lerp(leftLegRef.current.rotation.x, 0.4, 0.2);
        rightLegRef.current.rotation.x = THREE.MathUtils.lerp(rightLegRef.current.rotation.x, -0.2, 0.2);

        // Foot thrusters flare
        if (leftFootGlowRef.current) leftFootGlowRef.current.material.emissiveIntensity = 3.0;
        if (rightFootGlowRef.current) rightFootGlowRef.current.material.emissiveIntensity = 3.0;
      } else if (currSpeed > 0.3) {
        // --- WALK / RUN BLEND STATE ---
        const swing = Math.sin(phase.current) * strideAmp;

        // Torso leans forward with speed
        const leanForward = isSprinting ? 0.25 : 0.12;
        torsoRef.current.rotation.x = THREE.MathUtils.lerp(torsoRef.current.rotation.x, leanForward, 0.2);
        // Vertical step bounce
        const stepBounce = Math.abs(Math.sin(phase.current * 2)) * (isSprinting ? 0.08 : 0.04);
        torsoRef.current.position.y = THREE.MathUtils.lerp(torsoRef.current.position.y, stepBounce, 0.2);

        // Alternating limb swings
        leftLegRef.current.rotation.x = swing;
        rightLegRef.current.rotation.x = -swing;
        leftArmRef.current.rotation.x = -swing * 0.9;
        rightArmRef.current.rotation.x = swing * 0.9;

        // Reset Z flare on arms
        leftArmRef.current.rotation.z = THREE.MathUtils.lerp(leftArmRef.current.rotation.z, 0.08, 0.2);
        rightArmRef.current.rotation.z = THREE.MathUtils.lerp(rightArmRef.current.rotation.z, -0.08, 0.2);

        // Head bobbing
        headRef.current.rotation.y = Math.sin(phase.current) * 0.05;
        headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, -leanForward * 0.5, 0.2);

        // Foot thrusters moderate glow
        const glowVal = isSprinting ? 2.0 : 0.8;
        if (leftFootGlowRef.current) leftFootGlowRef.current.material.emissiveIntensity = glowVal;
        if (rightFootGlowRef.current) rightFootGlowRef.current.material.emissiveIntensity = glowVal;
      } else {
        // --- IDLE STATE ---
        // Gentle breathing bobbing
        const idleY = Math.sin(time * 2.2) * 0.03;
        const idleArmSway = Math.sin(time * 1.8) * 0.05;

        torsoRef.current.position.y = THREE.MathUtils.lerp(torsoRef.current.position.y, idleY, 0.1);
        torsoRef.current.rotation.x = THREE.MathUtils.lerp(torsoRef.current.rotation.x, 0, 0.1);

        // Idle limb positions
        leftLegRef.current.rotation.x = THREE.MathUtils.lerp(leftLegRef.current.rotation.x, 0, 0.1);
        rightLegRef.current.rotation.x = THREE.MathUtils.lerp(rightLegRef.current.rotation.x, 0, 0.1);
        leftArmRef.current.rotation.x = THREE.MathUtils.lerp(leftArmRef.current.rotation.x, idleArmSway, 0.1);
        rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, -idleArmSway, 0.1);
        leftArmRef.current.rotation.z = THREE.MathUtils.lerp(leftArmRef.current.rotation.z, 0.1, 0.1);
        rightArmRef.current.rotation.z = THREE.MathUtils.lerp(rightArmRef.current.rotation.z, -0.1, 0.1);

        // Head turns side to side gently looking around
        headRef.current.rotation.y = Math.sin(time * 0.8) * 0.12;
        headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, 0, 0.1);

        if (leftFootGlowRef.current) leftFootGlowRef.current.material.emissiveIntensity = 0.4;
        if (rightFootGlowRef.current) rightFootGlowRef.current.material.emissiveIntensity = 0.4;
      }

      // Reactor core pulsing
      if (reactorRef.current) {
        const pulse = Math.sin(time * 4) * 0.3 + 1.2;
        const sprintBonus = isSprinting ? 2.5 : 1.0;
        reactorRef.current.material.emissiveIntensity = pulse * sprintBonus;
      }
    }
  });

  return (
    <group ref={avatarGroupRef} position={[0, 0, 0]}>
      {/* Torso / Body Capsule */}
      <group ref={torsoRef} position={[0, 0.9, 0]}>
        {/* Main Body Capsule */}
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <capsuleGeometry args={[0.32, 0.55, 16, 32]} />
          <meshStandardMaterial
            color="#1a233a"
            metalness={0.8}
            roughness={0.2}
            envMapIntensity={1.5}
          />
        </mesh>

        {/* Chest Cyber Armor Plate */}
        <mesh position={[0, 0.05, 0.18]} castShadow>
          <boxGeometry args={[0.42, 0.38, 0.12]} />
          <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.3} />
        </mesh>

        {/* Glowing Arc Reactor Core (Sphere) */}
        <mesh ref={reactorRef} position={[0, 0.08, 0.24]}>
          <sphereGeometry args={[0.09, 16, 16]} />
          <meshStandardMaterial
            color="#00f0ff"
            emissive="#00f0ff"
            emissiveIntensity={1.5}
            toneMapped={false}
          />
        </mesh>

        {/* --- HEAD ASSEMBLY (Sphere + Visor) --- */}
        <group ref={headRef} position={[0, 0.52, 0]}>
          {/* Main Sphere Head */}
          <mesh castShadow>
            <sphereGeometry args={[0.26, 32, 32]} />
            <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.25} />
          </mesh>

          {/* Visor Mask (Glowing Curve) */}
          <mesh position={[0, 0.02, 0.18]} rotation={[0.1, 0, 0]}>
            <boxGeometry args={[0.34, 0.13, 0.14]} />
            <meshStandardMaterial
              color="#000"
              roughness={0.1}
            />
          </mesh>

          {/* Visor Glowing Eye Strip */}
          <mesh position={[0, 0.02, 0.25]}>
            <boxGeometry args={[0.28, 0.05, 0.02]} />
            <meshStandardMaterial
              color="#00f0ff"
              emissive="#00f0ff"
              emissiveIntensity={2.5}
              toneMapped={false}
            />
          </mesh>

          {/* Left Antenna */}
          <mesh position={[-0.18, 0.24, 0]} rotation={[0, 0, 0.2]}>
            <cylinderGeometry args={[0.015, 0.015, 0.2, 8]} />
            <meshStandardMaterial color="#64748b" metalness={0.9} />
          </mesh>
          <mesh position={[-0.2, 0.34, 0]}>
            <sphereGeometry args={[0.03, 8, 8]} />
            <meshStandardMaterial color="#ff0055" emissive="#ff0055" emissiveIntensity={2.0} />
          </mesh>

          {/* Right Antenna */}
          <mesh position={[0.18, 0.24, 0]} rotation={[0, 0, -0.2]}>
            <cylinderGeometry args={[0.015, 0.015, 0.2, 8]} />
            <meshStandardMaterial color="#64748b" metalness={0.9} />
          </mesh>
          <mesh position={[0.2, 0.34, 0]}>
            <sphereGeometry args={[0.03, 8, 8]} />
            <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={2.0} />
          </mesh>
        </group>

        {/* --- LEFT ARM ASSEMBLY --- */}
        <group ref={leftArmRef} position={[-0.42, 0.15, 0]}>
          {/* Shoulder Sphere */}
          <mesh castShadow>
            <sphereGeometry args={[0.11, 16, 16]} />
            <meshStandardMaterial color="#334155" metalness={0.8} />
          </mesh>
          {/* Upper Arm Capsule */}
          <mesh position={[0, -0.2, 0]} castShadow>
            <capsuleGeometry args={[0.07, 0.22, 12, 16]} />
            <meshStandardMaterial color="#1e293b" metalness={0.7} />
          </mesh>
          {/* Hand Sphere */}
          <mesh position={[0, -0.38, 0]}>
            <sphereGeometry args={[0.07, 16, 16]} />
            <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={0.8} />
          </mesh>
        </group>

        {/* --- RIGHT ARM ASSEMBLY --- */}
        <group ref={rightArmRef} position={[0.42, 0.15, 0]}>
          {/* Shoulder Sphere */}
          <mesh castShadow>
            <sphereGeometry args={[0.11, 16, 16]} />
            <meshStandardMaterial color="#334155" metalness={0.8} />
          </mesh>
          {/* Upper Arm Capsule */}
          <mesh position={[0, -0.2, 0]} castShadow>
            <capsuleGeometry args={[0.07, 0.22, 12, 16]} />
            <meshStandardMaterial color="#1e293b" metalness={0.7} />
          </mesh>
          {/* Hand Sphere */}
          <mesh position={[0, -0.38, 0]}>
            <sphereGeometry args={[0.07, 16, 16]} />
            <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={0.8} />
          </mesh>
        </group>
      </group>

      {/* --- LEFT LEG ASSEMBLY --- */}
      <group ref={leftLegRef} position={[-0.2, 0.45, 0]}>
        {/* Hip Joint */}
        <mesh castShadow>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color="#334155" metalness={0.8} />
        </mesh>
        {/* Thigh Capsule */}
        <mesh position={[0, -0.22, 0]} castShadow>
          <capsuleGeometry args={[0.085, 0.24, 12, 16]} />
          <meshStandardMaterial color="#1a233a" metalness={0.8} />
        </mesh>
        {/* Foot Pad */}
        <mesh position={[0, -0.42, 0.04]} castShadow>
          <boxGeometry args={[0.14, 0.08, 0.24]} />
          <meshStandardMaterial color="#0f172a" metalness={0.9} />
        </mesh>
        {/* Foot Jet Ring */}
        <mesh ref={leftFootGlowRef} position={[0, -0.46, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.03, 0.07, 16]} />
          <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={0.5} side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* --- RIGHT LEG ASSEMBLY --- */}
      <group ref={rightLegRef} position={[0.2, 0.45, 0]}>
        {/* Hip Joint */}
        <mesh castShadow>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color="#334155" metalness={0.8} />
        </mesh>
        {/* Thigh Capsule */}
        <mesh position={[0, -0.22, 0]} castShadow>
          <capsuleGeometry args={[0.085, 0.24, 12, 16]} />
          <meshStandardMaterial color="#1a233a" metalness={0.8} />
        </mesh>
        {/* Foot Pad */}
        <mesh position={[0, -0.42, 0.04]} castShadow>
          <boxGeometry args={[0.14, 0.08, 0.24]} />
          <meshStandardMaterial color="#0f172a" metalness={0.9} />
        </mesh>
        {/* Foot Jet Ring */}
        <mesh ref={rightFootGlowRef} position={[0, -0.46, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.03, 0.07, 16]} />
          <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={0.5} side={THREE.DoubleSide} />
        </mesh>
      </group>
    </group>
  );
}
