import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Box, Sphere, Cylinder } from '@react-three/drei';
import * as THREE from 'three';

// 3D Character Model Component
const CharacterModel = ({ config }) => {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.2;
    }
  });

  // Color mapping for different options
  const getColor = (type, value) => {
    const colorMap = {
      skinTone: {
        '#FDBCB4': '#FDBCB4',
        '#F1C27D': '#F1C27D', 
        '#E0AC69': '#E0AC69',
        '#C68642': '#C68642',
        '#8D5524': '#8D5524'
      },
      hair: {
        '#00FFFF': '#00FFFF',
        '#FF0080': '#FF0080',
        '#80FF00': '#80FF00', 
        '#FF8000': '#FF8000',
        '#8000FF': '#8000FF'
      }
    };
    return colorMap[type]?.[value] || value;
  };

  return (
    <group ref={meshRef}>
      {/* Character Base/Torso */}
      <Box
        position={[0, 0, 0]}
        args={[1.2, 2, 0.6]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshStandardMaterial 
          color={getColor('skinTone', config.face.skinTone)}
          transparent
          opacity={0.8}
        />
      </Box>

      {/* Head */}
      <Sphere
        position={[0, 1.5, 0]}
        args={[0.6, 32, 32]}
      >
        <meshStandardMaterial 
          color={getColor('skinTone', config.face.skinTone)}
          transparent
          opacity={0.9}
        />
      </Sphere>

      {/* Hair */}
      <Sphere
        position={[0, 1.8, 0]}
        args={[0.65, 32, 32]}
      >
        <meshStandardMaterial 
          color={getColor('hair', config.hair.color)}
          transparent
          opacity={0.7}
          emissive={config.hair.glow ? getColor('hair', config.hair.color) : '#000000'}
          emissiveIntensity={config.hair.glow ? 0.3 : 0}
        />
      </Sphere>

      {/* Arms */}
      <Cylinder
        position={[-0.8, 0.5, 0]}
        args={[0.2, 0.15, 1.5]}
        rotation={[0, 0, Math.PI / 6]}
      >
        <meshStandardMaterial 
          color={config.augmentations.arms === 'cybernetic' ? '#4A90E2' : getColor('skinTone', config.face.skinTone)}
          metalness={config.augmentations.arms === 'cybernetic' ? 0.8 : 0}
          roughness={config.augmentations.arms === 'cybernetic' ? 0.2 : 0.8}
        />
      </Cylinder>

      <Cylinder
        position={[0.8, 0.5, 0]}
        args={[0.2, 0.15, 1.5]}
        rotation={[0, 0, -Math.PI / 6]}
      >
        <meshStandardMaterial 
          color={config.augmentations.arms === 'cybernetic' ? '#4A90E2' : getColor('skinTone', config.face.skinTone)}
          metalness={config.augmentations.arms === 'cybernetic' ? 0.8 : 0}
          roughness={config.augmentations.arms === 'cybernetic' ? 0.2 : 0.8}
        />
      </Cylinder>

      {/* Legs */}
      <Cylinder
        position={[-0.3, -1.5, 0]}
        args={[0.25, 0.2, 1.5]}
      >
        <meshStandardMaterial 
          color={config.augmentations.legs !== 'none' ? '#4A90E2' : getColor('skinTone', config.face.skinTone)}
          metalness={config.augmentations.legs !== 'none' ? 0.8 : 0}
          roughness={config.augmentations.legs !== 'none' ? 0.2 : 0.8}
        />
      </Cylinder>

      <Cylinder
        position={[0.3, -1.5, 0]}
        args={[0.25, 0.2, 1.5]}
      >
        <meshStandardMaterial 
          color={config.augmentations.legs !== 'none' ? '#4A90E2' : getColor('skinTone', config.face.skinTone)}
          metalness={config.augmentations.legs !== 'none' ? 0.8 : 0}
          roughness={config.augmentations.legs !== 'none' ? 0.2 : 0.8}
        />
      </Cylinder>

      {/* Cybernetic Eyes/Implants */}
      {config.face.implants !== 'basic' && (
        <>
          <Sphere position={[-0.2, 1.6, 0.5]} args={[0.05, 16, 16]}>
            <meshStandardMaterial 
              color="#00FFFF"
              emissive="#00FFFF"
              emissiveIntensity={0.5}
            />
          </Sphere>
          <Sphere position={[0.2, 1.6, 0.5]} args={[0.05, 16, 16]}>
            <meshStandardMaterial 
              color="#00FFFF"
              emissive="#00FFFF"
              emissiveIntensity={0.5}
            />
          </Sphere>
        </>
      )}

      {/* Weapon Accessories */}
      {config.weapons.sidearm !== 'none' && (
        <Box position={[1.2, 0, 0]} args={[0.3, 0.6, 0.1]}>
          <meshStandardMaterial color="#333" metalness={0.9} roughness={0.1} />
        </Box>
      )}

      {/* Character Info Text */}
      <Text
        position={[0, -3, 0]}
        fontSize={0.3}
        color="#4A90E2"
        anchorX="center"
        anchorY="middle"
        font="/fonts/inter-bold.woff"
      >
        {`${config.gender} • ${config.face.shape} face`}
      </Text>
    </group>
  );
};

// Main 3D Scene Component
const Character3DViewer = ({ characterConfig, onViewChange }) => {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        style={{ background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.3), rgba(20, 20, 40, 0.6))' }}
      >
        {/* Lighting Setup */}
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#4A90E2" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#E948A5" />
        <spotLight
          position={[0, 10, 0]}
          angle={0.3}
          penumbra={1}
          intensity={1}
          color="#00FFFF"
          castShadow
        />

        {/* Character Model */}
        <CharacterModel config={characterConfig} />

        {/* Controls */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={3}
          maxDistance={8}
          maxPolarAngle={Math.PI / 1.5}
          onChange={onViewChange}
        />

        {/* Environment/Background */}
        <mesh position={[0, 0, -10]} receiveShadow>
          <planeGeometry args={[20, 20]} />
          <meshStandardMaterial 
            color="#000011"
            transparent
            opacity={0.3}
          />
        </mesh>
      </Canvas>
    </div>
  );
};

export default Character3DViewer;