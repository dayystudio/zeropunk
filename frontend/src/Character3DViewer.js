import React, { useRef, useState, Suspense, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  OrbitControls, 
  Environment, 
  ContactShadows, 
  PerspectiveCamera,
  Html,
  useTexture,
  MeshTransmissionMaterial,
  Effects,
  EffectComposer,
  Bloom,
  ChromaticAberration,
  Noise,
  Vignette
} from '@react-three/drei';
import { 
  EffectComposer as PostEffectComposer, 
  RenderPass, 
  UnrealBloomPass, 
  ShaderPass 
} from 'three/examples/jsm/postprocessing/EffectComposer';
import * as THREE from 'three';

// Advanced Realistic Character Model Component
const RealisticCharacterModel = ({ config, isHovered, animationSpeed = 1 }) => {
  const groupRef = useRef();
  const headRef = useRef();
  const torsoRef = useRef();
  const armRefs = [useRef(), useRef()];
  const legRefs = [useRef(), useRef()];
  const eyeRefs = [useRef(), useRef()];
  
  // Animation state
  const [breathingPhase, setBreathingPhase] = useState(0);
  const [blinkPhase, setBlinkPhase] = useState(0);
  const [idleAnimPhase, setIdleAnimPhase] = useState(0);

  // Advanced material configurations
  const skinMaterial = useMemo(() => {
    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(config.face.skinTone),
      roughness: 0.6,
      metalness: 0.0,
      normalScale: new THREE.Vector2(0.5, 0.5),
      transparent: false,
      side: THREE.FrontSide,
    });
    
    // Add subsurface scattering effect simulation
    material.onBeforeCompile = (shader) => {
      shader.uniforms.time = { value: 0 };
      shader.uniforms.subsurface = { value: 0.3 };
      
      shader.vertexShader = shader.vertexShader.replace(
        '#include <common>',
        `
        #include <common>
        uniform float time;
        varying vec3 vWorldPosition;
        `
      );
      
      shader.vertexShader = shader.vertexShader.replace(
        '#include <project_vertex>',
        `
        #include <project_vertex>
        vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
        `
      );
      
      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <common>',
        `
        #include <common>
        uniform float time;
        uniform float subsurface;
        varying vec3 vWorldPosition;
        `
      );
      
      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <color_fragment>',
        `
        #include <color_fragment>
        
        // Subsurface scattering simulation
        vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
        float subsurfaceAmount = max(0.0, dot(-normal, lightDir)) * subsurface;
        vec3 subsurfaceColor = vec3(1.0, 0.4, 0.3) * subsurfaceAmount;
        
        diffuseColor.rgb += subsurfaceColor * 0.3;
        
        // Subtle animation for living feel
        float pulse = sin(time * 2.0) * 0.05 + 1.0;
        diffuseColor.rgb *= pulse;
        `
      );
      
      material.userData.shader = shader;
    };
    
    return material;
  }, [config.face.skinTone]);

  const cyberneticMaterial = useMemo(() => {
    const material = new THREE.MeshStandardMaterial({
      color: '#1a237e',
      roughness: 0.1,
      metalness: 0.9,
      envMapIntensity: 1.5,
      emissive: new THREE.Color('#00ffff'),
      emissiveIntensity: 0.2,
    });
    
    material.onBeforeCompile = (shader) => {
      shader.uniforms.time = { value: 0 };
      
      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <common>',
        `
        #include <common>
        uniform float time;
        `
      );
      
      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <emissivemap_fragment>',
        `
        #include <emissivemap_fragment>
        
        // Animated cybernetic glow
        float glowPulse = sin(time * 3.0) * 0.3 + 0.7;
        totalEmissiveRadiance *= glowPulse;
        
        // Circuit-like patterns
        vec2 uv = vUv;
        float circuit = step(0.9, sin(uv.x * 20.0)) * step(0.9, sin(uv.y * 20.0));
        totalEmissiveRadiance += vec3(0.0, 1.0, 1.0) * circuit * 0.5;
        `
      );
      
      material.userData.shader = shader;
    };
    
    return material;
  }, []);

  const hairMaterial = useMemo(() => {
    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(config.hair.color),
      roughness: 0.8,
      metalness: 0.0,
      transparent: true,
      opacity: 0.9,
      alphaTest: 0.1,
    });
    
    if (config.hair.glow) {
      material.emissive = new THREE.Color(config.hair.color);
      material.emissiveIntensity = 0.3;
      
      material.onBeforeCompile = (shader) => {
        shader.uniforms.time = { value: 0 };
        
        shader.fragmentShader = shader.fragmentShader.replace(
          '#include <emissivemap_fragment>',
          `
          #include <emissivemap_fragment>
          
          float glowPulse = sin(time * 1.5) * 0.2 + 0.8;
          totalEmissiveRadiance *= glowPulse;
          `
        );
        
        material.userData.shader = shader;
      };
    }
    
    return material;
  }, [config.hair.color, config.hair.glow]);

  // Animation loop
  useFrame((state, delta) => {
    const time = state.clock.elapsedTime * animationSpeed;
    
    // Update shader uniforms
    [skinMaterial, cyberneticMaterial, hairMaterial].forEach(material => {
      if (material.userData.shader) {
        material.userData.shader.uniforms.time.value = time;
      }
    });
    
    // Idle rotation
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(time * 0.3) * 0.2;
    }
    
    // Breathing animation
    setBreathingPhase(time);
    if (torsoRef.current) {
      const breathScale = 1 + Math.sin(time * 1.2) * 0.02;
      torsoRef.current.scale.set(1, breathScale, 1);
    }
    
    // Head subtle movement
    if (headRef.current) {
      headRef.current.rotation.x = Math.sin(time * 0.7) * 0.05;
      headRef.current.rotation.y = Math.sin(time * 0.5) * 0.1;
    }
    
    // Arm sway
    armRefs.forEach((armRef, index) => {
      if (armRef.current) {
        const phase = time + index * Math.PI;
        armRef.current.rotation.z += Math.sin(phase * 0.8) * 0.01;
      }
    });
    
    // Eye blinking
    setBlinkPhase(time);
    eyeRefs.forEach(eyeRef => {
      if (eyeRef.current) {
        const blinkInterval = 3; // Blink every 3 seconds
        const blinkPhase = (time % blinkInterval) / blinkInterval;
        const blink = blinkPhase < 0.1 || blinkPhase > 0.95 ? 
          1 - Math.sin((blinkPhase % 0.1) * 10 * Math.PI) * 0.8 : 1;
        eyeRef.current.scale.y = blink;
      }
    });
    
    // Hover effects
    if (isHovered && groupRef.current) {
      groupRef.current.position.y = Math.sin(time * 2) * 0.1;
    }
  });

  // Advanced geometry creation
  const createAdvancedGeometry = (type, params) => {
    switch (type) {
      case 'head':
        const headGeometry = new THREE.SphereGeometry(0.65, 64, 64);
        // Add displacement for more realistic head shape
        const headPositions = headGeometry.attributes.position;
        for (let i = 0; i < headPositions.count; i++) {
          const vertex = new THREE.Vector3().fromBufferAttribute(headPositions, i);
          // Flatten the back and top slightly
          if (vertex.z < -0.3) vertex.z *= 0.8;
          if (vertex.y > 0.4) vertex.y *= 0.9;
          headPositions.setXYZ(i, vertex.x, vertex.y, vertex.z);
        }
        headGeometry.computeVertexNormals();
        return headGeometry;
        
      case 'torso':
        const torsoGeometry = new THREE.BoxGeometry(1.4, 2.2, 0.7, 32, 32, 32);
        // Round the torso
        const torsoPositions = torsoGeometry.attributes.position;
        for (let i = 0; i < torsoPositions.count; i++) {
          const vertex = new THREE.Vector3().fromBufferAttribute(torsoPositions, i);
          const distance = Math.sqrt(vertex.x * vertex.x + vertex.z * vertex.z);
          if (distance > 0.6) {
            const factor = 0.6 / distance;
            vertex.x *= factor;
            vertex.z *= factor;
          }
          torsoPositions.setXYZ(i, vertex.x, vertex.y, vertex.z);
        }
        torsoGeometry.computeVertexNormals();
        return torsoGeometry;
        
      case 'limb':
        return new THREE.CapsuleGeometry(params.radius, params.length, 16, 32);
        
      default:
        return new THREE.SphereGeometry(0.5, 32, 32);
    }
  };

  return (
    <group ref={groupRef} position={[0, -1, 0]}>
      {/* Advanced Head */}
      <mesh 
        ref={headRef}
        position={[0, 1.8, 0]}
        geometry={createAdvancedGeometry('head')}
        material={skinMaterial}
        castShadow
        receiveShadow
      />
      
      {/* Eyes */}
      <mesh 
        ref={eyeRefs[0]}
        position={[-0.15, 1.85, 0.55]}
      >
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[-0.15, 1.85, 0.6]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial 
          color={config.face.eyes === 'cyber' ? '#00ffff' : '#2a2a2a'}
          emissive={config.face.eyes === 'cyber' ? '#00ffff' : '#000000'}
          emissiveIntensity={config.face.eyes === 'cyber' ? 0.5 : 0}
        />
      </mesh>
      
      <mesh 
        ref={eyeRefs[1]}
        position={[0.15, 1.85, 0.55]}
      >
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0.15, 1.85, 0.6]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial 
          color={config.face.eyes === 'cyber' ? '#00ffff' : '#2a2a2a'}
          emissive={config.face.eyes === 'cyber' ? '#00ffff' : '#000000'}
          emissiveIntensity={config.face.eyes === 'cyber' ? 0.5 : 0}
        />
      </mesh>

      {/* Advanced Hair System */}
      <group position={[0, 1.9, 0]}>
        {/* Base hair volume */}
        <mesh geometry={createAdvancedGeometry('head')} material={hairMaterial}>
          <sphereGeometry args={[0.75, 32, 32]} />
        </mesh>
        
        {/* Hair strands for different styles */}
        {config.hair.style === 'punk' && (
          <>
            {Array.from({ length: 8 }, (_, i) => (
              <mesh 
                key={i}
                position={[
                  Math.cos(i * Math.PI / 4) * 0.6,
                  0.3 + Math.sin(i * 0.5) * 0.2,
                  Math.sin(i * Math.PI / 4) * 0.6
                ]}
                rotation={[0, i * Math.PI / 4, Math.PI / 6]}
              >
                <cylinderGeometry args={[0.02, 0.01, 0.8, 8]} />
                <meshStandardMaterial 
                  color={config.hair.color}
                  transparent
                  opacity={0.8}
                />
              </mesh>
            ))}
          </>
        )}
        
        {config.hair.style === 'mohawk' && (
          <mesh position={[0, 0.4, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.1, 0.05, 1.2, 16]} />
            <meshStandardMaterial 
              color={config.hair.color}
              emissive={config.hair.glow ? config.hair.color : '#000000'}
              emissiveIntensity={config.hair.glow ? 0.3 : 0}
            />
          </mesh>
        )}
      </group>

      {/* Advanced Torso */}
      <mesh 
        ref={torsoRef}
        position={[0, 0.2, 0]}
        geometry={createAdvancedGeometry('torso')}
        material={skinMaterial}
        castShadow
        receiveShadow
      />

      {/* Advanced Arms */}
      <mesh 
        ref={armRefs[0]}
        position={[-0.9, 0.8, 0]} 
        rotation={[0, 0, Math.PI / 8]}
        geometry={createAdvancedGeometry('limb', { radius: 0.15, length: 1.4 })}
        material={config.augmentations.arms === 'cybernetic' ? cyberneticMaterial : skinMaterial}
        castShadow
      />
      
      <mesh 
        ref={armRefs[1]}
        position={[0.9, 0.8, 0]} 
        rotation={[0, 0, -Math.PI / 8]}
        geometry={createAdvancedGeometry('limb', { radius: 0.15, length: 1.4 })}
        material={config.augmentations.arms === 'cybernetic' ? cyberneticMaterial : skinMaterial}
        castShadow
      />

      {/* Advanced Legs */}
      <mesh 
        ref={legRefs[0]}
        position={[-0.35, -1.2, 0]}
        geometry={createAdvancedGeometry('limb', { radius: 0.18, length: 1.8 })}
        material={config.augmentations.legs !== 'none' ? cyberneticMaterial : skinMaterial}
        castShadow
      />
      
      <mesh 
        ref={legRefs[1]}
        position={[0.35, -1.2, 0]}
        geometry={createAdvancedGeometry('limb', { radius: 0.18, length: 1.8 })}
        material={config.augmentations.legs !== 'none' ? cyberneticMaterial : skinMaterial}
        castShadow
      />

      {/* Advanced Cybernetic Implants */}
      {config.face.implants !== 'basic' && (
        <group>
          {/* Facial implants */}
          <mesh position={[-0.3, 1.7, 0.6]}>
            <boxGeometry args={[0.15, 0.05, 0.02]} />
            <meshStandardMaterial 
              color="#00ffff"
              emissive="#00ffff"
              emissiveIntensity={0.8}
              metalness={0.9}
              roughness={0.1}
            />
          </mesh>
          
          <mesh position={[0.3, 1.7, 0.6]}>
            <boxGeometry args={[0.15, 0.05, 0.02]} />
            <meshStandardMaterial 
              color="#00ffff"
              emissive="#00ffff"
              emissiveIntensity={0.8}
              metalness={0.9}
              roughness={0.1}
            />
          </mesh>
          
          {/* Neural interface ports */}
          <mesh position={[0.4, 1.6, 0.3]} rotation={[0, Math.PI / 2, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 0.1]} />
            <meshStandardMaterial 
              color="#1a237e"
              emissive="#00ffff"
              emissiveIntensity={0.3}
              metalness={1}
              roughness={0}
            />
          </mesh>
        </group>
      )}

      {/* Weapon Systems */}
      {config.weapons.sidearm !== 'none' && (
        <group position={[1.2, 0.5, -0.1]} rotation={[0, 0, -Math.PI / 4]}>
          <mesh>
            <boxGeometry args={[0.4, 0.8, 0.15]} />
            <meshStandardMaterial 
              color="#2a2a2a"
              metalness={0.9}
              roughness={0.1}
              emissive="#ff4444"
              emissiveIntensity={0.1}
            />
          </mesh>
          
          {/* Energy charge effect */}
          <mesh position={[0, 0.3, 0]}>
            <sphereGeometry args={[0.03, 16, 16]} />
            <meshStandardMaterial 
              color="#ff0080"
              emissive="#ff0080"
              emissiveIntensity={1}
              transparent
              opacity={0.8}
            />
          </mesh>
        </group>
      )}
    </group>
  );
};

// Advanced Lighting Setup
const AdvancedLighting = () => {
  const lightRef = useRef();
  
  useFrame((state) => {
    if (lightRef.current) {
      lightRef.current.position.x = Math.sin(state.clock.elapsedTime * 0.5) * 5;
      lightRef.current.position.z = Math.cos(state.clock.elapsedTime * 0.5) * 5;
    }
  });

  return (
    <>
      {/* Key Light */}
      <directionalLight
        ref={lightRef}
        position={[5, 10, 5]}
        intensity={1.2}
        color="#ffffff"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      
      {/* Fill Light */}
      <directionalLight
        position={[-5, 5, -5]}
        intensity={0.4}
        color="#4fc3f7"
      />
      
      {/* Rim Light */}
      <directionalLight
        position={[0, 5, -10]}
        intensity={0.8}
        color="#e91e63"
      />
      
      {/* Ambient Light */}
      <ambientLight intensity={0.2} color="#b39ddb" />
      
      {/* Point Lights for Cyberpunk Effect */}
      <pointLight
        position={[2, 2, 2]}
        intensity={0.5}
        color="#00ffff"
        distance={10}
      />
      
      <pointLight
        position={[-2, -2, 2]}
        intensity={0.5}
        color="#ff0080"
        distance={10}
      />
    </>
  );
};

// Post-processing Effects
const PostProcessingEffects = () => {
  return (
    <EffectComposer>
      <Bloom 
        intensity={0.3}
        luminanceThreshold={0.1}
        luminanceSmoothing={0.9}
      />
      <ChromaticAberration offset={[0.0005, 0.0005]} />
      <Noise opacity={0.02} />
      <Vignette eskil={false} offset={0.1} darkness={0.5} />
    </EffectComposer>
  );
};

// Main Ultra-Realistic 3D Viewer
const UltraRealistic3DViewer = ({ characterConfig, onViewChange }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const controlsRef = useRef();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="ultra-3d-loader">
        <div className="loader-content">
          <div className="neural-loader">
            <div className="neural-pulse"></div>
            <div className="neural-pulse"></div>
            <div className="neural-pulse"></div>
          </div>
          <p>Initializing Neural Interface...</p>
          <div className="loading-progress">
            <div className="progress-bar"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="ultra-realistic-viewer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Canvas
        shadows
        camera={{ position: [0, 2, 6], fov: 45 }}
        style={{ 
          background: 'radial-gradient(circle at center, rgba(20, 20, 60, 0.8), rgba(0, 0, 0, 0.9))',
          borderRadius: '12px'
        }}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: "high-performance",
          stencil: false,
          depth: true
        }}
      >
        <Suspense fallback={null}>
          {/* Advanced Camera Controls */}
          <OrbitControls
            ref={controlsRef}
            enableZoom={true}
            enablePan={false}
            enableRotate={true}
            autoRotate={false}
            autoRotateSpeed={0.5}
            minDistance={3}
            maxDistance={10}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI - Math.PI / 6}
            dampingFactor={0.05}
            enableDamping={true}
          />
          
          {/* Ultra-Realistic Lighting */}
          <AdvancedLighting />
          
          {/* HDRI Environment */}
          <Environment preset="city" background={false} />
          
          {/* Character Model */}
          <RealisticCharacterModel 
            config={characterConfig} 
            isHovered={isHovered}
            animationSpeed={1}
          />
          
          {/* Ground and Shadows */}
          <ContactShadows
            position={[0, -2.1, 0]}
            opacity={0.6}
            scale={8}
            blur={2}
            far={4}
            color="#000033"
          />
          
          {/* Backdrop */}
          <mesh position={[0, 0, -5]} receiveShadow>
            <planeGeometry args={[20, 20]} />
            <meshStandardMaterial 
              color="#0a0a0a"
              transparent
              opacity={0.1}
            />
          </mesh>
          
          {/* Post-processing Effects */}
          <PostProcessingEffects />
        </Suspense>
      </Canvas>
      
      {/* UI Overlay */}
      <div className="viewer-ui-overlay">
        <div className="model-info">
          <span className="model-status">NEURAL INTERFACE ACTIVE</span>
          <span className="model-quality">ULTRA-HD RENDERING</span>
        </div>
        
        <div className="viewer-controls-info">
          <span>🖱️ Drag to rotate • 🔍 Scroll to zoom</span>
        </div>
      </div>
      
      {/* Performance Monitor */}
      <div className="performance-monitor">
        <div className="perf-indicator active">
          <span>⚡</span>
          <span>60 FPS</span>
        </div>
      </div>
    </div>
  );
};

export default UltraRealistic3DViewer;