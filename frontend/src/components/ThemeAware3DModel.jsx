/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Float, MeshDistortMaterial } from '@react-three/drei';
import { motion } from 'framer-motion';

function AbstractModel({ color, isWireframe }) {
  const mesh = useRef();
  
  useFrame((state, delta) => {
    if (mesh.current) {
      mesh.current.rotation.x -= delta * 0.15;
      mesh.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1.5} floatIntensity={0.5}>
      <mesh ref={mesh} castShadow receiveShadow scale={0.9}>
        <torusKnotGeometry args={[1, 0.35, 128, 32]} />
        <MeshDistortMaterial 
          color={color} 
          envMapIntensity={2} 
          clearcoat={1} 
          clearcoatRoughness={0} 
          metalness={0.6}
          roughness={0.2}
          emissive={color}
          emissiveIntensity={0.5}
          distort={isWireframe ? 0.2 : 0.4}
          speed={isWireframe ? 1 : 2}
          wireframe={isWireframe}
        />
      </mesh>
    </Float>
  );
}

export default function ThemeAware3DModel() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [hovered, setHovered] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    // Detect system theme preference
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(mq.matches);
    
    const handler = (e) => setIsDarkMode(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const modelColor = isDarkMode ? '#00E5A0' : '#7C6DFA';
  const envPreset = isDarkMode ? 'city' : 'studio';
  const ambientIntensity = isDarkMode ? 0.2 : 0.7;
  const directionalIntensity = isDarkMode ? 0.8 : 1.2;

  return (
    <motion.div 
      ref={containerRef}
      className="theme-aware-model-container" 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      style={{ 
        width: '100%', 
        height: '100%', 
        position: 'relative',
        overflow: 'hidden',
        background: 'transparent',
        cursor: hovered ? 'grab' : 'pointer',
        zIndex: 10
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseDown={() => { if(containerRef.current) containerRef.current.style.cursor = 'grabbing'; }}
      onMouseUp={() => { if(containerRef.current) containerRef.current.style.cursor = 'grab'; }}
    >
      <Canvas shadows camera={{ position: [0, 0, 7], fov: 45 }} style={{ touchAction: 'none' }}>
        <ambientLight intensity={ambientIntensity * 2} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        <directionalLight position={[-10, -10, -10]} intensity={directionalIntensity} color={modelColor} />
        
        {/* Toggle wireframe on hover for interactive feel */}
        <AbstractModel color={modelColor} isWireframe={!hovered} />
        
        <ContactShadows position={[0, -1.8, 0]} opacity={isDarkMode ? 0.6 : 0.3} scale={10} blur={2.5} far={4} />
        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          autoRotate={!hovered}
          autoRotateSpeed={1.5}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.5}
          makeDefault
        />
        <Environment preset={envPreset} />
      </Canvas>
    </motion.div>
  );
}
