import React, { useRef, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Simple 3D Character Model Component
const CharacterModel = ({ config }) => {
  const meshRef = useRef();

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.3;
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
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.2, 2, 0.6]} />
        <meshStandardMaterial 
          color={getColor('skinTone', config.face.skinTone)}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Head */}
      <mesh position={[0, 1.5, 0]}>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshStandardMaterial 
          color={getColor('skinTone', config.face.skinTone)}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Hair */}
      <mesh position={[0, 1.8, 0]}>
        <sphereGeometry args={[0.65, 32, 32]} />
        <meshStandardMaterial 
          color={getColor('hair', config.hair.color)}
          transparent
          opacity={0.7}
          emissive={config.hair.glow ? getColor('hair', config.hair.color) : '#000000'}
          emissiveIntensity={config.hair.glow ? 0.3 : 0}
        />
      </mesh>

      {/* Arms */}
      <mesh position={[-0.8, 0.5, 0]} rotation={[0, 0, Math.PI / 6]}>
        <cylinderGeometry args={[0.2, 0.15, 1.5]} />
        <meshStandardMaterial 
          color={config.augmentations.arms === 'cybernetic' ? '#4A90E2' : getColor('skinTone', config.face.skinTone)}
          metalness={config.augmentations.arms === 'cybernetic' ? 0.8 : 0}
          roughness={config.augmentations.arms === 'cybernetic' ? 0.2 : 0.8}
        />
      </mesh>

      <mesh position={[0.8, 0.5, 0]} rotation={[0, 0, -Math.PI / 6]}>
        <cylinderGeometry args={[0.2, 0.15, 1.5]} />
        <meshStandardMaterial 
          color={config.augmentations.arms === 'cybernetic' ? '#4A90E2' : getColor('skinTone', config.face.skinTone)}
          metalness={config.augmentations.arms === 'cybernetic' ? 0.8 : 0}
          roughness={config.augmentations.arms === 'cybernetic' ? 0.2 : 0.8}
        />
      </mesh>

      {/* Legs */}
      <mesh position={[-0.3, -1.5, 0]}>
        <cylinderGeometry args={[0.25, 0.2, 1.5]} />
        <meshStandardMaterial 
          color={config.augmentations.legs !== 'none' ? '#4A90E2' : getColor('skinTone', config.face.skinTone)}
          metalness={config.augmentations.legs !== 'none' ? 0.8 : 0}
          roughness={config.augmentations.legs !== 'none' ? 0.2 : 0.8}
        />
      </mesh>

      <mesh position={[0.3, -1.5, 0]}>
        <cylinderGeometry args={[0.25, 0.2, 1.5]} />
        <meshStandardMaterial 
          color={config.augmentations.legs !== 'none' ? '#4A90E2' : getColor('skinTone', config.face.skinTone)}
          metalness={config.augmentations.legs !== 'none' ? 0.8 : 0}
          roughness={config.augmentations.legs !== 'none' ? 0.2 : 0.8}
        />
      </mesh>

      {/* Cybernetic Eyes/Implants */}
      {config.face.implants !== 'basic' && (
        <>
          <mesh position={[-0.2, 1.6, 0.5]}>
            <sphereGeometry args={[0.05, 16, 16]} />
            <meshStandardMaterial 
              color="#00FFFF"
              emissive="#00FFFF"
              emissiveIntensity={0.5}
            />
          </mesh>
          <mesh position={[0.2, 1.6, 0.5]}>
            <sphereGeometry args={[0.05, 16, 16]} />
            <meshStandardMaterial 
              color="#00FFFF"
              emissive="#00FFFF"
              emissiveIntensity={0.5}
            />
          </mesh>
        </>
      )}

      {/* Weapon Accessories */}
      {config.weapons.sidearm !== 'none' && (
        <mesh position={[1.2, 0, 0]}>
          <boxGeometry args={[0.3, 0.6, 0.1]} />
          <meshStandardMaterial color="#333" metalness={0.9} roughness={0.1} />
        </mesh>
      )}
    </group>
  );
};

// Fallback Component for 3D Loading Issues
const Character3DFallback = ({ characterConfig }) => (
  <div className="placeholder-3d">
    <div className="character-silhouette">
      <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
        <circle cx="60" cy="35" r="20" fill={characterConfig.face.skinTone} opacity="0.8"/>
        <rect x="45" y="55" width="30" height="40" rx="5" fill={characterConfig.face.skinTone} opacity="0.8"/>
        <rect x="35" y="60" width="10" height="25" rx="5" fill={characterConfig.augmentations.arms === 'cybernetic' ? '#4A90E2' : characterConfig.face.skinTone} opacity="0.8"/>
        <rect x="75" y="60" width="10" height="25" rx="5" fill={characterConfig.augmentations.arms === 'cybernetic' ? '#4A90E2' : characterConfig.face.skinTone} opacity="0.8"/>
        <circle cx="60" cy="30" r="22" fill={characterConfig.hair.color} opacity="0.7"/>
        {characterConfig.hair.glow && (
          <circle cx="60" cy="30" r="22" fill={characterConfig.hair.color} opacity="0.3">
            <animate attributeName="opacity" values="0.3;0.6;0.3" dur="2s" repeatCount="indefinite"/>
          </circle>
        )}
      </svg>
    </div>
    <div className="viewer-overlay">
      <span>3D Character Preview</span>
      <p>{characterConfig.gender} • {characterConfig.face.shape} face • {characterConfig.hair.style} hair</p>
    </div>
  </div>
);

// Main 3D Scene Component with Error Boundary
const Character3DViewer = ({ characterConfig, onViewChange }) => {
  const [has3DError, setHas3DError] = useState(false);

  if (has3DError) {
    return <Character3DFallback characterConfig={characterConfig} />;
  }

  try {
    return (
      <div style={{ width: '100%', height: '100%' }}>
        <Suspense fallback={<Character3DFallback characterConfig={characterConfig} />}>
          <Canvas
            camera={{ position: [0, 0, 5], fov: 50 }}
            style={{ background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.3), rgba(20, 20, 40, 0.6))' }}
            onError={() => setHas3DError(true)}
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
        </Suspense>
      </div>
    );
  } catch (error) {
    console.error('3D Viewer Error:', error);
    return <Character3DFallback characterConfig={characterConfig} />;
  }
};

export default Character3DViewer;