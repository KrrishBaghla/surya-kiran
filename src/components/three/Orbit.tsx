"use client";

import React, { useMemo } from 'react';
import * as THREE from 'three';

export function Orbit({ radius, segments = 128, color = '#333366', opacity = 0.25 }: { radius: number; segments?: number; color?: string; opacity?: number; }) {
  const geom = useMemo(() => new THREE.RingGeometry(radius - 0.005, radius + 0.005, segments), [radius, segments]);
  const mat = useMemo(() => new THREE.MeshBasicMaterial({ color, transparent: true, opacity, side: THREE.DoubleSide }), [color, opacity]);

  return (
    <mesh rotation={[Math.PI / 2, 0, 0]} geometry={geom} material={mat} />
  );
}
