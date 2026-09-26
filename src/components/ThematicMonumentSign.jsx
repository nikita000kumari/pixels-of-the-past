import React from 'react';
import { Billboard, Float, Text } from '@react-three/drei';

const THEME_STYLES = {
  mughal: {
    bg: '#140c08',
    border: '#d4af37',
    title: '#fff8eb',
    subtitle: '#e6c364',
    badge: 'MUGHAL EMPIRE • IMPERIAL RECORD',
  },
  gupta: {
    bg: '#0f1118',
    border: '#f1be48',
    title: '#fff9ed',
    subtitle: '#ffd269',
    badge: 'GUPTA DYNASTY • GOLDEN ERA',
  },
  harappa: {
    bg: '#18100b',
    border: '#d98242',
    title: '#fdf6ed',
    subtitle: '#f3aa72',
    badge: 'INDUS VALLEY • BRONZE AGE',
  },
  cyber: {
    bg: '#080d1a',
    border: '#00f0ff',
    title: '#ffffff',
    subtitle: '#00f0ff',
    badge: 'PIXELS OF THE PAST • PORTAL',
  }
};

export function ThematicMonumentSign({
  title,
  subtitle,
  position = [0, 0, 0],
  scale = 1.0,
  theme = 'mughal'
}) {
  const style = THEME_STYLES[theme] || THEME_STYLES.mughal;
  const titleLen = (title || '').length;
  const subLen = (subtitle || '').length;
  const maxChars = Math.max(titleLen, subLen * 0.72);
  const width = Math.max(3.8, Math.min(maxChars * 0.22 + 1.2, 11.0)) * scale;
  const height = (subtitle ? 1.15 : 0.8) * scale;

  return (
    <Float speed={1.2} floatIntensity={0.12} rotationIntensity={0}>
      <Billboard position={position}>
        {/* Dark stone plaque backing */}
        <mesh position={[0, 0, -0.02]}>
          <planeGeometry args={[width, height]} />
          <meshBasicMaterial color={style.bg} transparent opacity={0.88} depthWrite={false} />
        </mesh>

        {/* Top Gold Border */}
        <mesh position={[0, height / 2 - 0.025 * scale, -0.01]}>
          <planeGeometry args={[width * 0.96, 0.025 * scale]} />
          <meshBasicMaterial color={style.border} transparent opacity={0.9} depthWrite={false} />
        </mesh>

        {/* Bottom Gold Border */}
        <mesh position={[0, -height / 2 + 0.025 * scale, -0.01]}>
          <planeGeometry args={[width * 0.96, 0.025 * scale]} />
          <meshBasicMaterial color={style.border} transparent opacity={0.9} depthWrite={false} />
        </mesh>

        {/* Left and Right Accent Bars */}
        <mesh position={[-width / 2 + 0.04 * scale, 0, -0.01]}>
          <planeGeometry args={[0.02 * scale, height * 0.7]} />
          <meshBasicMaterial color={style.border} transparent opacity={0.6} depthWrite={false} />
        </mesh>
        <mesh position={[width / 2 - 0.04 * scale, 0, -0.01]}>
          <planeGeometry args={[0.02 * scale, height * 0.7]} />
          <meshBasicMaterial color={style.border} transparent opacity={0.6} depthWrite={false} />
        </mesh>

        {/* Top Small Ornamental Crest */}
        <Text
          position={[0, subtitle ? 0.38 * scale : 0.22 * scale, 0.01]}
          fontSize={0.11 * scale}
          color={style.subtitle}
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.12}
          fillOpacity={0.85}
        >
          {`✦ ${style.badge} ✦`}
        </Text>

        {/* Monument Title */}
        <Text
          position={[0, subtitle ? 0.12 * scale : -0.05 * scale, 0.01]}
          fontSize={0.34 * scale}
          color={style.title}
          outlineWidth={0.022 * scale}
          outlineColor="#000000"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.07}
        >
          {title.toUpperCase()}
        </Text>

        {/* Historical Context / Era Subtitle */}
        {subtitle && (
          <Text
            position={[0, -0.22 * scale, 0.01]}
            fontSize={0.17 * scale}
            color={style.subtitle}
            outlineWidth={0.015 * scale}
            outlineColor="#000000"
            anchorX="center"
            anchorY="middle"
            letterSpacing={0.04}
          >
            {subtitle}
          </Text>
        )}
      </Billboard>
    </Float>
  );
}

export function ThematicArtifactSign({
  name,
  isActive = false,
  position = [0, 1.65, 0],
  theme = 'mughal'
}) {
  const style = THEME_STYLES[theme] || THEME_STYLES.mughal;
  const width = Math.max(1.4, Math.min(name.length * 0.082 + 0.45, 3.2));
  const height = 0.34;

  return (
    <Float speed={isActive ? 2.5 : 1.2} floatIntensity={isActive ? 0.18 : 0.1} rotationIntensity={0}>
      <Billboard position={position}>
        {/* Plaque backing */}
        <mesh position={[0, 0, -0.02]}>
          <planeGeometry args={[width, height]} />
          <meshBasicMaterial
            color={isActive ? '#251b0a' : '#100c08'}
            transparent
            opacity={0.88}
            depthWrite={false}
          />
        </mesh>

        {/* Border */}
        <mesh position={[0, height / 2 - 0.012, -0.01]}>
          <planeGeometry args={[width * 0.94, 0.018]} />
          <meshBasicMaterial
            color={isActive ? '#ffe600' : style.border}
            transparent
            opacity={isActive ? 1 : 0.75}
            depthWrite={false}
          />
        </mesh>
        <mesh position={[0, -height / 2 + 0.012, -0.01]}>
          <planeGeometry args={[width * 0.94, 0.018]} />
          <meshBasicMaterial
            color={isActive ? '#ffe600' : style.border}
            transparent
            opacity={isActive ? 1 : 0.75}
            depthWrite={false}
          />
        </mesh>

        {/* Artifact Text */}
        <Text
          position={[0, 0, 0.01]}
          fontSize={isActive ? 0.20 : 0.155}
          color={isActive ? '#ffe600' : '#fff4db'}
          outlineWidth={0.016}
          outlineColor="#000000"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.04}
        >
          {isActive ? `★ ${name} ★` : name}
        </Text>
      </Billboard>
    </Float>
  );
}