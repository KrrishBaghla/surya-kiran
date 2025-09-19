import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { mockEvents } from '../utils/mockData';

const SolarSystemView: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 50, 100);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    // Add stars background
    const starsGeometry = new THREE.BufferGeometry();
    const starsCount = 5000;
    const positions = new Float32Array(starsCount * 3);

    for (let i = 0; i < starsCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 2000;
    }

    starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const starsMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 2,
      transparent: true,
      opacity: 0.8
    });

    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    // Sun
    const sunGeometry = new THREE.SphereGeometry(5, 32, 32);
    const sunMaterial = new THREE.MeshBasicMaterial({
      color: 0xffff00,
      emissive: 0xffff00,
      emissiveIntensity: 0.3
    });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    scene.add(sun);

    // Planets
    const planets = [
      { name: 'Mercury', distance: 15, size: 0.5, color: 0x8c7853, speed: 0.02 },
      { name: 'Venus', distance: 20, size: 0.8, color: 0xffc649, speed: 0.015 },
      { name: 'Earth', distance: 25, size: 1, color: 0x6b93d6, speed: 0.01 },
      { name: 'Mars', distance: 30, size: 0.7, color: 0xc1440e, speed: 0.008 },
      { name: 'Jupiter', distance: 40, size: 3, color: 0xd8ca9d, speed: 0.005 },
      { name: 'Saturn', distance: 50, size: 2.5, color: 0xfad5a5, speed: 0.003 },
    ];

    const planetMeshes: THREE.Mesh[] = [];

    planets.forEach((planetData, index) => {
      const geometry = new THREE.SphereGeometry(planetData.size, 16, 16);
      const material = new THREE.MeshLambertMaterial({ color: planetData.color });
      const planet = new THREE.Mesh(geometry, material);
      planet.position.x = planetData.distance;
      scene.add(planet);
      planetMeshes.push(planet);

      // Orbit rings
      const ringGeometry = new THREE.RingGeometry(planetData.distance - 0.1, planetData.distance + 0.1, 64);
      const ringMaterial = new THREE.MeshBasicMaterial({
        color: 0x333333,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.3
      });
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.rotation.x = -Math.PI / 2;
      scene.add(ring);
    });

    // Event markers
    mockEvents.forEach((event, index) => {
      const markerGeometry = new THREE.SphereGeometry(0.8, 8, 8);
      const markerMaterial = new THREE.MeshBasicMaterial({
        color: event.priority === 'CRITICAL' ? 0xff0000 : 
               event.priority === 'HIGH' ? 0xff6600 : 0x00ffff,
        emissive: event.priority === 'CRITICAL' ? 0xff0000 : 
                 event.priority === 'HIGH' ? 0xff6600 : 0x00ffff,
        emissiveIntensity: 0.5
      });
      const marker = new THREE.Mesh(markerGeometry, markerMaterial);
      
      // Position markers in space
      const angle = (index / mockEvents.length) * Math.PI * 2;
      const distance = 60 + index * 10;
      marker.position.x = Math.cos(angle) * distance;
      marker.position.z = Math.sin(angle) * distance;
      marker.position.y = (Math.random() - 0.5) * 20;
      
      scene.add(marker);
    });

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    scene.add(ambientLight);

    const sunLight = new THREE.PointLight(0xffffff, 1, 200);
    sunLight.position.set(0, 0, 0);
    sunLight.castShadow = true;
    scene.add(sunLight);

    // Animation
    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.01;

      // Rotate planets
      planetMeshes.forEach((planet, index) => {
        const planetData = planets[index];
        planet.position.x = Math.cos(time * planetData.speed) * planetData.distance;
        planet.position.z = Math.sin(time * planetData.speed) * planetData.distance;
        planet.rotation.y += 0.01;
      });

      // Rotate camera around the system
      camera.position.x = Math.cos(time * 0.001) * 100;
      camera.position.z = Math.sin(time * 0.001) * 100;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();
    mountRef.current.appendChild(renderer.domElement);

    // Cleanup
    return () => {
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="min-h-screen bg-black relative">
      <div ref={mountRef} className="w-full h-screen" />
      
      {/* Overlay Information */}
      <div className="absolute top-6 left-6 bg-black/50 backdrop-blur-sm border border-cyan-500/20 rounded-xl p-6 max-w-sm">
        <h2 className="text-xl font-bold text-white mb-4">Solar System View</h2>
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-white">Critical Events</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span className="text-white">High Priority Events</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-cyan-500 rounded-full"></div>
            <span className="text-white">Medium/Low Priority Events</span>
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-700">
          <p className="text-gray-300 text-xs leading-relaxed">
            This 3D visualization shows cosmic events in relation to our solar system. 
            Larger, brighter markers indicate higher priority or more significant events.
          </p>
        </div>
      </div>

      {/* Event Counter */}
      <motion.div
        className="absolute top-6 right-6 bg-black/50 backdrop-blur-sm border border-purple-500/20 rounded-xl p-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-400">
            {mockEvents.length}
          </div>
          <div className="text-sm text-gray-300">
            Active Events
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SolarSystemView;