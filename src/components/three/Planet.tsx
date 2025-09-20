"use client";

import React, { useEffect, useState } from 'react';
// Billboard import removed - no longer using Text components
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export type PlanetData = {
  name: string;
  radius: number; // visual radius of sphere
  color?: string;
  textureUrl: string; // local URL under /public/textures
  hasRings?: boolean;
  ringTextureUrl?: string;
  ringInnerScale?: number; // multiplier of planet radius
  ringOuterScale?: number; // multiplier of planet radius
  ringTilt?: [number, number, number]; // Euler radians
  orbitalPeriodDays: number;
  rotationPeriodHours: number;
  distance: number;
};

export function Planet({ 
  planet, 
  onSelect, 
  simulationSpeed = 1
}: { 
  planet: PlanetData; 
  onSelect?: (planet: PlanetData | null) => void;
  simulationSpeed?: number;
}) {
  const [map, setMap] = useState<THREE.Texture | null>(null);
  const [ringMap, setRingMap] = useState<THREE.Texture | null>(null);
  const meshRef = React.useRef<THREE.Mesh>(null!);
  const url = planet.textureUrl;
  const ringUrl = planet.ringTextureUrl;

  useEffect(() => {
    // Skip texture loading to avoid CORS issues - use solid colors instead
    setMap(null);
  }, [url]);

  // Skip ring texture loading to avoid CORS issues
  useEffect(() => {
    setRingMap(null);
  }, [ringUrl]);

  // Planet rotation only (orbital motion handled by parent)
  useFrame((_, delta) => {
    if (meshRef.current) {
      // Planet rotation - use realistic rotation speed without visual scale multiplier
      meshRef.current.rotation.y += delta * simulationSpeed * (1 / planet.rotationPeriodHours) * 0.5;
    }
  });

  return (
    <group>
      <mesh ref={meshRef} castShadow receiveShadow onClick={() => onSelect?.(planet)}>
        <sphereGeometry args={[planet.radius, 64, 64]} />
        <meshStandardMaterial 
          map={map} 
          color={planet.color || '#ffffff'}
          key={map ? 'textured' : 'colored'}
        />
      </mesh>

      {/* Rings */}
      {planet.hasRings && ringMap && (
        <mesh rotation={planet.ringTilt ?? [Math.PI / 2.5, 0, 0]}>
          <ringGeometry args={[planet.radius * (planet.ringInnerScale || 1.2), planet.radius * (planet.ringOuterScale || 2.0), 64]} />
          {ringMap ? (
            <meshBasicMaterial map={ringMap} transparent alphaTest={0.2} side={THREE.DoubleSide} />
          ) : (
            <meshStandardMaterial color="#d9d0b6" side={THREE.DoubleSide} transparent opacity={0.6} />
          )}
        </mesh>
      )}

      {/* Planet labels removed to fix Text component compatibility issues */}
    </group>
  );
}
