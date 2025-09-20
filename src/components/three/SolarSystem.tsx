"use client";

import { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { Planet, PlanetData } from './Planet';

// Sun component with reliable texture loading and rotation
function Sun() {
  const meshRef = useRef<THREE.Mesh>(null!);
  
  // Use fallback approach for production compatibility
  const [sunTexture, setSunTexture] = useState<THREE.Texture | null>(null);
  
  useEffect(() => {
    // Skip texture loading for now to avoid CORS issues
    // Just use solid colors instead
    setSunTexture(null);
  }, []);

  // Sun rotation: 25.05 days at equator
  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * SCALE_TIME * ROTATION_VISUAL_SCALE * (1 / 25.05);
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Core sun */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.15, 64, 64]} />
        <meshStandardMaterial 
          map={sunTexture}
          emissiveMap={sunTexture}
          emissive={sunTexture ? "#FFAA33" : "#FF6600"}
          emissiveIntensity={sunTexture ? 0.6 : 1.2}
          color={sunTexture ? "#FFFFFF" : "#FFAA00"}
          roughness={0.9}
          metalness={0.0}
          key={sunTexture ? 'textured' : 'procedural'}
        />
      </mesh>

      {/* Simple glow effect */}
      <mesh scale={[1.3, 1.3, 1.3]}>
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshBasicMaterial
          color="#FF892A"
          transparent
          opacity={0.3}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Outer glow */}
      <mesh scale={[1.5, 1.5, 1.5]}>
        <sphereGeometry args={[0.15, 24, 24]} />
        <meshBasicMaterial
          color="#FFAA00"
          transparent
          opacity={0.1}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}


export type PlanetInfo = PlanetData & {
  distance: number; // orbital radius in scene units
  orbitalPeriodDays: number; // used for relative speed
  rotationPeriodHours: number; // rotation period in hours (negative = retrograde)
  funFact?: string;
  hasMoon?: boolean;
  moonData?: {
    radius: number;
    distance: number; // distance from planet
    orbitalPeriodDays: number;
    color: string;
    textureUrl: string;
  };
};

const SCALE_TIME = 0.05; // animation time scale factor (realistic orbital speeds)
const ROTATION_VISUAL_SCALE = 6; // multiplier to make axial spin more visible

const PLANETS: PlanetInfo[] = [
  // Realistic orbital distances (scaled), orbital periods, and rotation periods
  { name: 'Mercury', radius: 0.015, distance: 0.4, orbitalPeriodDays: 88, rotationPeriodHours: 1407.6, color: '#8C7853', textureUrl: '/textures/mercury.jpg', funFact: 'Smallest planet.' },
  { name: 'Venus', radius: 0.025, distance: 0.7, orbitalPeriodDays: 225, rotationPeriodHours: -5832.5, color: '#FFC649', textureUrl: '/textures/venus.jpg', funFact: 'Hottest planet.' },
  { 
    name: 'Earth', 
    radius: 0.025, 
    distance: 1.0, 
    orbitalPeriodDays: 365, 
    rotationPeriodHours: 24, 
    color: '#6B93D6', 
    textureUrl: '/textures/earth_day.jpg', 
    funFact: 'Our home planet.',
    hasMoon: true,
    moonData: {
      radius: 0.007,
      distance: 0.08,
      orbitalPeriodDays: 27.3,
      color: '#C0C0C0',
      textureUrl: '/textures/moon.jpg'
    }
  },
  { name: 'Mars', radius: 0.02, distance: 1.5, orbitalPeriodDays: 687, rotationPeriodHours: 24.6, color: '#CD5C5C', textureUrl: '/textures/mars.jpg', funFact: 'The Red Planet.' },
  { name: 'Jupiter', radius: 0.11, distance: 5.2, orbitalPeriodDays: 4333, rotationPeriodHours: 9.9, color: '#D8CA9D', textureUrl: '/textures/jupiter.jpg', funFact: 'Largest planet.' },
  {
    name: 'Saturn',
    radius: 0.09,
    distance: 9.5,
    orbitalPeriodDays: 10759,
    rotationPeriodHours: 10.7,
    color: '#FAD5A5',
    textureUrl: '/textures/saturn.jpg',
    funFact: 'Famous rings.',
    hasRings: true,
    ringTextureUrl: '/textures/saturn_rings.png',
    ringInnerScale: 1.4,
    ringOuterScale: 2.4,
    ringTilt: [Math.PI / 2.2, 0, 0],
  },
  { name: 'Uranus', radius: 0.04, distance: 19.2, orbitalPeriodDays: 30687, rotationPeriodHours: -17.2, color: '#4FD0E7', textureUrl: '/textures/uranus.jpg', funFact: 'Rotates on its side.' },
  { name: 'Neptune', radius: 0.038, distance: 30.1, orbitalPeriodDays: 60190, rotationPeriodHours: 16.1, color: '#4B70DD', textureUrl: '/textures/neptune.jpg', funFact: 'Farthest planet.' },
];

// Asteroid belt between Mars (~1.5) and Jupiter (~5.2)
function AsteroidBelt({ inner = 2.2, outer = 3.4, count = 4500, tilt = 0.05 }: { inner?: number; outer?: number; count?: number; tilt?: number; }) {
  const groupRef = useRef<THREE.Group>(null!);

  // Skip texture loading to avoid CORS issues

  const palette = useMemo(() => [
    new THREE.Color('#c0c0c0'), // bright gray
    new THREE.Color('#b8b8b8'), // light gray
    new THREE.Color('#a8a8a8'), // medium gray
    new THREE.Color('#d0d0d0'), // very light gray
    new THREE.Color('#b0b0b0'), // silver gray
  ], []);

  // Simplified single geometry approach for better visibility
  const { geometry, material, matrices, colors } = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(0.01, 0);
    const mat = new THREE.MeshStandardMaterial({
      color: '#ffffff',
      roughness: 0.3,
      metalness: 0.7,
      emissive: '#888888',
      emissiveIntensity: 0.6,
      vertexColors: true
    });

    const mats: THREE.Matrix4[] = [];
    const cols: THREE.Color[] = [];
    const tmp = new THREE.Matrix4();
    const pos = new THREE.Vector3();
    const quat = new THREE.Quaternion();
    const scale = new THREE.Vector3();

    for (let i = 0; i < count; i++) {
      const r = inner + Math.random() * (outer - inner);
      const a = Math.random() * Math.PI * 2;
      const yJitter = (Math.random() - 0.5) * 0.08; // belt thickness
      pos.set(Math.cos(a) * r, yJitter, Math.sin(a) * r);

      // varied sizes; larger for visibility
      const sBase = 0.08 + Math.random() * 0.15; // 0.08 .. 0.23
      const sx = sBase * (0.7 + Math.random() * 1.8);
      const sy = sBase * (0.7 + Math.random() * 1.8);
      const sz = sBase * (0.7 + Math.random() * 1.8);
      scale.set(sx, sy, sz);
      quat.setFromEuler(new THREE.Euler(Math.random()*Math.PI, Math.random()*Math.PI, Math.random()*Math.PI));
      tmp.compose(pos, quat, scale);
      mats.push(tmp.clone());

      // per-instance color with variance from palette
      const base = palette[Math.floor(Math.random()*palette.length)].clone();
      const variance = 1.0 + Math.random()*0.5; // 1.0..1.5 - brighter
      base.multiplyScalar(variance);
      cols.push(base);
    }

    return { geometry: geo, material: mat, matrices: mats, colors: cols };
  }, [inner, outer, count, palette]);

  // Slow belt rotation
  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.003;
  });

  // Single mesh ref for simplified approach
  const meshRef = useRef<THREE.InstancedMesh>(null!);
  
  useEffect(() => {
    if (!meshRef.current) return;
    for (let i = 0; i < matrices.length; i++) {
      meshRef.current.setMatrixAt(i, matrices[i]);
      if ((meshRef.current as any).setColorAt) {
        (meshRef.current as any).setColorAt(i, colors[i]);
      }
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
    if ((meshRef.current as any).instanceColor) {
      (meshRef.current as any).instanceColor.needsUpdate = true;
    }
  }, [matrices, colors]);

  return (
    <group ref={groupRef} rotation={[tilt, 0, 0]}>
      <instancedMesh
        ref={meshRef}
        args={[geometry, material, matrices.length]}
        frustumCulled={false}
      >
        <bufferAttribute 
          attach="instanceColor" 
          args={[new Float32Array(colors.flatMap(col => col.toArray())), 3]} 
        />
      </instancedMesh>
    </group>
  );
}

export function SolarSystem({ 
  onSelect, 
  simulationSpeed = 1, 
  showOrbits = true, 
  showAsteroidBelt = true 
}: { 
  onSelect?: (planet: PlanetInfo | null) => void;
  simulationSpeed?: number;
  showOrbits?: boolean;
  showLabels?: boolean;
  showAsteroidBelt?: boolean;
}) {
  const { camera } = useThree();
  // Access external controls set via <OrbitControls makeDefault /> on the page
  const controls = useThree((state: any) => state.controls);
  const focusTarget = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
  const desiredCamPos = useRef<THREE.Vector3>(camera.position.clone());
  const focusProgress = useRef<number>(1); // 1 = not focusing

  // Animate planets and camera focus
  useFrame((_state, delta) => {
    // const adjustedDelta = delta * simulationSpeed;
    // Only animate camera/target while focus is in progress
    if (focusProgress.current < 1) {
      const ease = Math.min(1, delta * 2);
      camera.position.lerp(desiredCamPos.current, ease);
      if (controls) {
        controls.target.lerp(focusTarget.current, ease);
        controls.update();
      }
      focusProgress.current = Math.min(1, focusProgress.current + delta * 1.5);
    }
  });

  // If the user starts interacting (mouse/touch down), cancel any camera focusing
  useEffect(() => {
    if (!controls) return;
    const onStart = () => {
      focusProgress.current = 1;
    };
    controls.addEventListener('start', onStart);
    return () => {
      controls.removeEventListener('start', onStart);
    };
  }, [controls]);

  const handleFocus = (planet: PlanetInfo | null, pos?: THREE.Vector3) => {
    // setFocused(planet);
    if (onSelect) onSelect(planet);

    const target = pos ?? new THREE.Vector3(0, 0, 0);
    focusTarget.current.copy(target);

    const offsetDir = new THREE.Vector3(0, 0.25, 0.75).normalize();
    const camDistance = planet ? Math.max(0.6, planet.distance * 0.5) : 8;
    desiredCamPos.current.copy(target.clone().add(offsetDir.multiplyScalar(camDistance)));
    focusProgress.current = 0; // start focusing animation on next frames
  };

  return (
    <>
      {/* Lights */}
      <ambientLight intensity={0.15} />
      <pointLight position={[0, 0, 0]} intensity={4.0} distance={100} color="#ffffff" />
      {/* Additional sun glow */}
      <pointLight position={[0, 0, 0]} intensity={2.0} distance={50} color="#ffffff" />

      {/* Grid helper (extended to cover full solar system) */}
      {/* Size ~120 to comfortably include Neptune's 30.1 AU scaled distance */}
      <gridHelper args={[120, 120, '#4A4A6A', '#3A3A5A']} position={[0, -0.01, 0]} />

      {/* Stars background can be toggled here if used standalone */}
      {/* <Stars radius={50} depth={50} count={2000} factor={4} saturation={0} fade /> */}

      {/* Sun */}
      <Sun />

      {/* Asteroid belt between Mars and Jupiter */}
      {showAsteroidBelt && (
        <AsteroidBelt inner={2.2} outer={3.4} count={2200} tilt={0.05} />
      )}

      {/* Orbital paths (slightly thicker for visibility when zoomed out) */}
      {showOrbits && PLANETS.map((p) => (
        <mesh key={`orbit-${p.name}`} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[p.distance - 0.006, p.distance + 0.006, 256]} />
          <meshBasicMaterial 
            color="#ffffff" 
            transparent
            opacity={0.3}
            depthWrite={false}
            polygonOffset
            polygonOffsetFactor={-1}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}

      {/* Planets */}
      {PLANETS.map((p, idx) => {
        return (
          <PlanetOrbiting
            key={p.name}
            data={p}
            index={idx}
            onFocus={handleFocus}
            simulationSpeed={simulationSpeed}
          />
        );
      })}
    </>
  );
}

// Moon component
function Moon({ moonData, simulationSpeed, showOrbit = true, onFocus }: { moonData: any; simulationSpeed: number; showOrbit?: boolean; onFocus?: (moonInfo: any, pos: THREE.Vector3) => void; }) {
  const moonRef = useRef<THREE.Group>(null!);
  const [moonTexture, setMoonTexture] = useState<THREE.Texture | null>(null);

  // Skip texture loading to avoid CORS issues
  useEffect(() => {
    setMoonTexture(null);
  }, [moonData.textureUrl]);

  // Moon orbital motion and rotation (tidally locked)
  useFrame(({ clock }) => {
    if (moonRef.current) {
      const t = clock.getElapsedTime();
      const theta = t * SCALE_TIME * simulationSpeed * (100 / moonData.orbitalPeriodDays);
      const x = Math.cos(theta) * moonData.distance;
      const z = Math.sin(theta) * moonData.distance;
      moonRef.current.position.set(x, 0, z);
      
      // Moon rotation - tidally locked (same face always toward Earth)
      // Rotation period equals orbital period
      moonRef.current.rotation.y = theta;
    }
  });

  const handleMoonClick = (event: any) => {
    event.stopPropagation(); // Prevent Earth click
    if (moonRef.current && onFocus) {
      const pos = moonRef.current.getWorldPosition(new THREE.Vector3());
      const moonInfo = {
        name: 'Moon',
        radius: moonData.radius,
        distance: moonData.distance,
        orbitalPeriodDays: moonData.orbitalPeriodDays,
        rotationPeriodHours: 708.7, // Moon's rotation period (tidally locked)
        color: moonData.color,
        textureUrl: moonData.textureUrl,
        funFact: 'Earth\'s only natural satellite. Always shows the same face to Earth.'
      } as PlanetInfo;
      onFocus(moonInfo, pos);
    }
  };

  return (
    <group>
      {/* Moon orbit path */}
      {showOrbit && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[moonData.distance - 0.002, moonData.distance + 0.002, 64]} />
          <meshBasicMaterial 
            color="#ffffff" 
            transparent
            opacity={0.2}
            depthWrite={false}
          />
        </mesh>
      )}
      
      {/* Moon */}
      <group ref={moonRef}>
        <mesh castShadow receiveShadow onClick={handleMoonClick}>
          <sphereGeometry args={[moonData.radius, 32, 32]} />
          <meshStandardMaterial 
            map={moonTexture}
            color={moonTexture ? '#ffffff' : moonData.color}
            roughness={0.9}
            metalness={0.1}
            key={moonTexture ? 'textured' : 'colored'}
          />
        </mesh>
      </group>
    </group>
  );
}

function PlanetOrbiting({ data, index, onFocus, simulationSpeed }: { data: PlanetInfo; index: number; onFocus: (p: PlanetInfo, pos: THREE.Vector3) => void; simulationSpeed: number; }) {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    // Start planets at realistic positions (not all aligned)
    const startOffset = index * (Math.PI / 4); // Spread planets around orbit
    const theta = t * SCALE_TIME * simulationSpeed * (100 / data.orbitalPeriodDays) + startOffset;
    const x = Math.cos(theta) * data.distance;
    const z = Math.sin(theta) * data.distance;
    if (groupRef.current) {
      groupRef.current.position.set(x, 0, z);
    }
  });

  const onClick = () => {
    if (groupRef.current) {
      const pos = groupRef.current.getWorldPosition(new THREE.Vector3());
      onFocus(data, pos);
    }
  };

  return (
    <group ref={groupRef} onClick={onClick}>
      <Planet planet={data} simulationSpeed={simulationSpeed} />
      {/* Add Moon if planet has one */}
      {data.hasMoon && data.moonData && (
        <Moon moonData={data.moonData} simulationSpeed={simulationSpeed} onFocus={onFocus} />
      )}
    </group>
  );
}

export default SolarSystem;
