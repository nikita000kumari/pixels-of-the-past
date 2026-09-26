import React, { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { RigidBody, CapsuleCollider, useRapier } from '@react-three/rapier';
import { useKeyboardControls, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { RobotAvatar } from './RobotAvatar';

// Reuse vectors to prevent garbage collection frame drops
const tempCamDir = new THREE.Vector3();
const tempForward = new THREE.Vector3();
const tempRight = new THREE.Vector3();
const tempMoveVec = new THREE.Vector3();
const tempTargetPos = new THREE.Vector3();

export function PlayerController({ onTelemetryUpdate, resetTrigger }) {
  const rbRef = useRef();
  const avatarGroupRef = useRef();
  const orbitControlsRef = useRef();

  const rapierContext = useRapier();
  const [, getKeys] = useKeyboardControls();
  const { camera } = useThree();

  // State tracked for procedural animation and HUD
  const [speed, setSpeed] = useState(0);
  const [isGrounded, setIsGrounded] = useState(true);
  const [isSprinting, setIsSprinting] = useState(false);

  const avatarAngleRef = useRef(0);
  const wasJumpingRef = useRef(false);

  // Handle manual position reset trigger from UI button or drop out of bounds
  useEffect(() => {
    if (rbRef.current) {
      rbRef.current.setTranslation({ x: 0, y: 2.5, z: 0 }, true);
      rbRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
      rbRef.current.setAngvel({ x: 0, y: 0, z: 0 }, true);
    }
  }, [resetTrigger]);

  useFrame((state, delta) => {
    if (!rbRef.current) return;

    const pPos = rbRef.current.translation();
    const linvel = rbRef.current.linvel();

    // Auto reset if player falls off platform into abyss
    if (pPos.y < -10) {
      rbRef.current.setTranslation({ x: 0, y: 2.5, z: 0 }, true);
      rbRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
    }

    // 1. Ground detection (Safely check vertical velocity & altitude)
    let grounded = Math.abs(linvel.y) < 0.45;
    const world = rapierContext?.world;
    const rapier = rapierContext?.rapier;

    if (world && rapier) {
      try {
        const groundRay = new rapier.Ray(
          { x: pPos.x, y: pPos.y + 0.3, z: pPos.z },
          { x: 0, y: -1, z: 0 }
        );
        const hit = world.castRay(groundRay, 0.75, true);
        if (hit && hit.timeOfImpact <= 0.72) {
          grounded = true;
        }
      } catch (err) {
        // Fallback to velocity check
      }
    }
    setIsGrounded(grounded);

    // 2. Read Keyboard Inputs
    const { forward, backward, left, right, jump, sprint } = getKeys();
    setIsSprinting(sprint);

    // 3. Compute Camera-Relative Direction Vectors
    camera.getWorldDirection(tempCamDir);
    tempForward.set(tempCamDir.x, 0, tempCamDir.z).normalize();
    tempRight.set(-tempForward.z, 0, tempForward.x).normalize();

    tempMoveVec.set(0, 0, 0);
    if (forward) tempMoveVec.add(tempForward);
    if (backward) tempMoveVec.sub(tempForward);
    if (right) tempMoveVec.add(tempRight);
    if (left) tempMoveVec.sub(tempRight);

    const isMoving = tempMoveVec.lengthSq() > 0.001;
    if (isMoving) {
      tempMoveVec.normalize();
    }

    // 4. Movement Speeds (Walk: 5.5 m/s, Sprint: 11.0 m/s)
    const targetSpeed = isMoving ? (sprint ? 11.0 : 5.5) : 0;

    // Smooth velocity transitions using lerp
    const newVx = THREE.MathUtils.lerp(linvel.x, tempMoveVec.x * targetSpeed, 0.25);
    const newVz = THREE.MathUtils.lerp(linvel.z, tempMoveVec.z * targetSpeed, 0.25);

    // 5. Jump logic
    let newVy = linvel.y;
    if (jump && grounded && !wasJumpingRef.current) {
      newVy = 7.5; // Jump impulse velocity
      wasJumpingRef.current = true;
    } else if (!jump) {
      wasJumpingRef.current = false;
    }

    // 6. Safe Character Controller Step-Offset Auto-Stepping (Climb stairs up to 0.45m automatically)
    const maxStepHeight = 0.45;
    if (isMoving && grounded && world && rapier && !jump) {
      try {
        const stepRay = new rapier.Ray(
          {
            x: pPos.x + tempMoveVec.x * 0.4,
            y: pPos.y + maxStepHeight,
            z: pPos.z + tempMoveVec.z * 0.4
          },
          { x: 0, y: -1, z: 0 }
        );
        const stepHit = world.castRay(stepRay, maxStepHeight + 0.2, true);
        if (stepHit) {
          const hitGroundY = (pPos.y + maxStepHeight) - stepHit.timeOfImpact;
          const stepHeightDiff = hitGroundY - pPos.y;

          if (stepHeightDiff > 0.03 && stepHeightDiff <= maxStepHeight) {
            rbRef.current.setTranslation(
              {
                x: pPos.x + tempMoveVec.x * 0.06,
                y: pPos.y + stepHeightDiff * 0.6 + 0.02,
                z: pPos.z + tempMoveVec.z * 0.06
              },
              true
            );
            newVy = Math.max(newVy, 0.5);
          }
        }
      } catch (e) {
        // Ignore raycast errors safely
      }
    }

    // Apply linear velocity to physics body
    rbRef.current.setLinvel({ x: newVx, y: newVy, z: newVz }, true);

    // Calculate current horizontal speed for animations and UI HUD
    const curHorizontalSpeed = Math.sqrt(newVx * newVx + newVz * newVz);
    setSpeed(curHorizontalSpeed);

    if (onTelemetryUpdate) {
      onTelemetryUpdate({
        speed: Math.round(curHorizontalSpeed * 3.6), // Convert m/s to km/h display
        isGrounded: grounded,
        isSprinting: sprint,
        isMoving,
        position: [pPos.x, pPos.y, pPos.z]
      });
    }

    // 7. Rotate Avatar Mesh to Face Movement Direction
    if (isMoving && avatarGroupRef.current) {
      const targetAngle = Math.atan2(tempMoveVec.x, tempMoveVec.z);
      let diff = targetAngle - avatarAngleRef.current;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;
      avatarAngleRef.current += diff * 0.2;

      avatarGroupRef.current.rotation.y = avatarAngleRef.current;
    }

    // 8. Sync OrbitControls Camera Target to Player Position
    if (orbitControlsRef.current) {
      tempTargetPos.set(pPos.x, pPos.y + 1.1, pPos.z);
      orbitControlsRef.current.target.lerp(tempTargetPos, 0.2);
      orbitControlsRef.current.update();
    }
  });

  return (
    <>
      <OrbitControls
        ref={orbitControlsRef}
        makeDefault
        minDistance={3.5}
        maxDistance={14}
        maxPolarAngle={Math.PI / 2 - 0.05} // Prevent camera going under ground
        minPolarAngle={0.1}
        enableDamping
        dampingFactor={0.08}
      />

      <RigidBody
        ref={rbRef}
        colliders={false}
        mass={1.2}
        lockRotations
        enabledRotations={[false, false, false]}
        position={[0, 1.8, 0]}
        friction={0.1}
        restitution={0}
      >
        {/* Capsule collider for player character */}
        <CapsuleCollider args={[0.35, 0.32]} position={[0, 0.67, 0]} />

        {/* Visual Capsule-and-Sphere Robot Avatar */}
        <group ref={avatarGroupRef}>
          <RobotAvatar
            speed={speed}
            isGrounded={isGrounded}
            isSprinting={isSprinting}
          />
        </group>
      </RigidBody>
    </>
  );
}
