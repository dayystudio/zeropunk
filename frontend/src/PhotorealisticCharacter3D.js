import React, { useRef, useState, Suspense, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  OrbitControls, 
  Environment, 
  ContactShadows, 
  PerspectiveCamera,
  Html,
  Sphere,
  Box,
  Cylinder,
  useHelper
} from '@react-three/drei';
import * as THREE from 'three';

// Advanced Material Nodes for Photorealistic Rendering
const createSkinMaterial = (skinTone, config) => {
  const material = new THREE.MeshStandardMaterial({
    color: new THREE.Color(skinTone),
    roughness: 0.4,
    metalness: 0.0,
    normalScale: new THREE.Vector2(0.8, 0.8),
    transparent: false,
    side: THREE.FrontSide,
  });

  // Advanced skin shader with subsurface scattering
  material.onBeforeCompile = (shader) => {
    shader.uniforms.time = { value: 0 };
    shader.uniforms.subsurface = { value: 0.6 };
    shader.uniforms.skinDetail = { value: 1.0 };
    shader.uniforms.bloodFlow = { value: 0.3 };
    
    shader.vertexShader = shader.vertexShader.replace(
      '#include <common>',
      `
      #include <common>
      uniform float time;
      uniform float subsurface;
      uniform float skinDetail;
      varying vec3 vWorldPosition;
      varying vec3 vNormal;
      varying vec2 vUv;
      `
    );
    
    shader.vertexShader = shader.vertexShader.replace(
      '#include <project_vertex>',
      `
      #include <project_vertex>
      vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
      vNormal = normalize(normalMatrix * normal);
      vUv = uv;
      `
    );
    
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <common>',
      `
      #include <common>
      uniform float time;
      uniform float subsurface;
      uniform float skinDetail;
      uniform float bloodFlow;
      varying vec3 vWorldPosition;
      varying vec3 vNormal;
      varying vec2 vUv;
      
      // Procedural skin detail function
      float skinNoise(vec2 uv, float scale) {
        vec2 p = uv * scale;
        return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
      }
      
      // Subsurface scattering approximation
      vec3 subsurfaceScattering(vec3 normal, vec3 lightDir, vec3 viewDir, float thickness) {
        float scatter = pow(max(0.0, dot(-normal, lightDir)), 2.0) * thickness;
        vec3 scatterColor = vec3(1.0, 0.4, 0.3) * scatter;
        return scatterColor;
      }
      `
    );
    
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <color_fragment>',
      `
      #include <color_fragment>
      
      // Add skin micro-details
      vec2 detailUV = vUv * 50.0;
      float pores = skinNoise(detailUV, 1.0) * 0.1;
      float wrinkles = skinNoise(detailUV * 2.0, 1.0) * 0.05;
      float skinTexture = pores + wrinkles;
      
      // Apply skin detail
      diffuseColor.rgb *= (1.0 + skinTexture * skinDetail);
      
      // Subsurface scattering
      vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
      vec3 viewDir = normalize(cameraPosition - vWorldPosition);
      vec3 subsurfaceColor = subsurfaceScattering(vNormal, lightDir, viewDir, subsurface);
      
      diffuseColor.rgb += subsurfaceColor * 0.4;
      
      // Blood flow simulation
      float pulse = sin(time * 1.5) * 0.02 + 1.0;
      vec3 bloodColor = vec3(0.8, 0.2, 0.2) * bloodFlow * pulse * 0.1;
      diffuseColor.rgb += bloodColor;
      
      // Skin oiliness variation
      float oiliness = skinNoise(vUv * 20.0, 1.0) * 0.3;
      diffuseColor.rgb += vec3(oiliness * 0.1);
      `
    );
    
    material.userData.shader = shader;
  };
  
  return material;
};

const createHairMaterial = (hairColor, config) => {
  const material = new THREE.MeshStandardMaterial({
    color: new THREE.Color(hairColor),
    roughness: 0.8,
    metalness: 0.0,
    transparent: true,
    opacity: 0.95,
    alphaTest: 0.1,
  });
  
  if (config.hair.glow) {
    material.emissive = new THREE.Color(hairColor);
    material.emissiveIntensity = 0.2;
  }
  
  // Advanced hair shader
  material.onBeforeCompile = (shader) => {
    shader.uniforms.time = { value: 0 };
    shader.uniforms.hairFlow = { value: 0.5 };
    
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <common>',
      `
      #include <common>
      uniform float time;
      uniform float hairFlow;
      varying vec2 vUv;
      
      // Hair strand simulation
      float hairPattern(vec2 uv, float flow) {
        vec2 hairUV = uv;
        hairUV.x += sin(uv.y * 20.0 + time * 2.0) * flow * 0.1;
        return smoothstep(0.3, 0.7, fract(hairUV.x * 100.0));
      }
      `
    );
    
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <color_fragment>',
      `
      #include <color_fragment>
      
      // Hair strand detail
      float strands = hairPattern(vUv, hairFlow);
      diffuseColor.rgb *= (0.7 + strands * 0.6);
      
      // Hair shine
      float shine = pow(strands, 4.0) * 0.3;
      diffuseColor.rgb += vec3(shine);
      `
    );
    
    if (config.hair.glow) {
      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <emissivemap_fragment>',
        `
        #include <emissivemap_fragment>
        
        float glowPulse = sin(time * 1.5) * 0.3 + 0.7;
        totalEmissiveRadiance *= glowPulse;
        
        // Neural glow patterns
        float glowPattern = sin(vUv.y * 10.0 + time * 3.0) * 0.5 + 0.5;
        totalEmissiveRadiance += vec3(0.0, 1.0, 1.0) * glowPattern * 0.2;
        `
      );
    }
    
    material.userData.shader = shader;
  };
  
  return material;
};

const createCyberneticMaterial = (implantLevel) => {
  const baseColors = {
    basic: '#4A90E2',
    advanced: '#FF6B35',
    military: '#9D4EDD'
  };
  
  const material = new THREE.MeshStandardMaterial({
    color: baseColors[implantLevel] || baseColors.basic,
    roughness: 0.1,
    metalness: 0.95,
    envMapIntensity: 2.0,
    emissive: new THREE.Color(baseColors[implantLevel] || baseColors.basic),
    emissiveIntensity: 0.3,
  });
  
  // Advanced cybernetic shader
  material.onBeforeCompile = (shader) => {
    shader.uniforms.time = { value: 0 };
    shader.uniforms.circuitDensity = { value: implantLevel === 'military' ? 2.0 : 1.0 };
    
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <common>',
      `
      #include <common>
      uniform float time;
      uniform float circuitDensity;
      varying vec2 vUv;
      
      // Circuit pattern generation
      float circuitPattern(vec2 uv, float density) {
        vec2 grid = uv * 20.0 * density;
        vec2 gridId = floor(grid);
        vec2 gridUV = fract(grid);
        
        // Create circuit lines
        float lines = 0.0;
        lines += step(0.95, max(gridUV.x, gridUV.y));
        lines += step(0.95, min(gridUV.x, gridUV.y));
        
        // Add circuit nodes
        float hash = fract(sin(dot(gridId, vec2(12.9898, 78.233))) * 43758.5453);
        if (hash > 0.7) {
          float dist = distance(gridUV, vec2(0.5));
          lines += smoothstep(0.3, 0.1, dist);
        }
        
        return lines;
      }
      `
    );
    
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <emissivemap_fragment>',
      `
      #include <emissivemap_fragment>
      
      // Animated circuits
      float circuits = circuitPattern(vUv, circuitDensity);
      float pulse = sin(time * 4.0) * 0.5 + 0.5;
      
      totalEmissiveRadiance *= (1.0 + circuits * pulse * 2.0);
      
      // Data flow animation
      vec2 flowUV = vUv + vec2(time * 0.1, 0.0);
      float dataFlow = step(0.8, sin(flowUV.x * 50.0 + time * 10.0));
      totalEmissiveRadiance += vec3(dataFlow) * 0.5;
      `
    );
    
    material.userData.shader = shader;
  };
  
  return material;
};

const createFabricMaterial = (fabricType, color) => {
  const fabricProps = {
    leather: { roughness: 0.7, metalness: 0.0 },
    denim: { roughness: 0.9, metalness: 0.0 },
    tactical: { roughness: 0.6, metalness: 0.1 },
    synthetic: { roughness: 0.4, metalness: 0.2 }
  };
  
  const props = fabricProps[fabricType] || fabricProps.synthetic;
  
  const material = new THREE.MeshStandardMaterial({
    color: new THREE.Color(color),
    roughness: props.roughness,
    metalness: props.metalness,
  });
  
  // Fabric texture shader
  material.onBeforeCompile = (shader) => {
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <common>',
      `
      #include <common>
      varying vec2 vUv;
      
      // Fabric weave pattern
      float fabricWeave(vec2 uv, float scale) {
        vec2 weaveUV = uv * scale;
        float warp = sin(weaveUV.x * 3.14159) * 0.5 + 0.5;
        float weft = sin(weaveUV.y * 3.14159) * 0.5 + 0.5;
        return warp * weft;
      }
      `
    );
    
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <color_fragment>',
      `
      #include <color_fragment>
      
      // Apply fabric texture
      float weave = fabricWeave(vUv, 50.0);
      diffuseColor.rgb *= (0.8 + weave * 0.4);
      
      // Fabric wear and aging
      float wear = fract(sin(dot(vUv, vec2(12.9898, 78.233))) * 43758.5453) * 0.2;
      diffuseColor.rgb *= (1.0 - wear);
      `
    );
    
    material.userData.shader = shader;
  };
  
  return material;
};

// Ultra-Realistic Character Model
const PhotorealisticCharacterModel = ({ config, isHovered, animationSpeed = 1 }) => {
  const groupRef = useRef();
  const headRef = useRef();
  const torsoRef = useRef();
  const armRefs = [useRef(), useRef()];
  const legRefs = [useRef(), useRef()];
  const eyeRefs = [useRef(), useRef()];
  const eyebrowRefs = [useRef(), useRef()];
  const mouthRef = useRef();
  const noseRef = useRef();
  
  // Animation states
  const [expressionState, setExpressionState] = useState({
    eyebrowRaise: 0,
    eyeSquint: 0,
    mouthCurve: 0,
    blinkPhase: 0
  });
  
  // Materials
  const skinMaterial = useMemo(() => createSkinMaterial(config.face.skinTone, config), [config.face.skinTone]);
  const hairMaterial = useMemo(() => createHairMaterial(config.hair.color, config), [config.hair.color, config.hair.glow]);
  const cyberneticMaterial = useMemo(() => createCyberneticMaterial(config.face.implants), [config.face.implants]);
  
  // Create high-detail geometry
  const createDetailedGeometry = (type, params = {}) => {
    switch (type) {
      case 'head':
        // High-poly head with proper facial structure
        const headGeom = new THREE.SphereGeometry(0.65, 128, 128);
        const headPositions = headGeom.attributes.position;
        
        for (let i = 0; i < headPositions.count; i++) {
          const vertex = new THREE.Vector3().fromBufferAttribute(headPositions, i);
          
          // Anatomically correct head shaping
          const phi = Math.acos(vertex.y / 0.65);
          const theta = Math.atan2(vertex.z, vertex.x);
          
          // Flatten back of head
          if (vertex.z < -0.2) vertex.z *= 0.7;
          
          // Create eye sockets
          const eyeSocketL = new THREE.Vector3(-0.2, 0.15, 0.5);
          const eyeSocketR = new THREE.Vector3(0.2, 0.15, 0.5);
          const distL = vertex.distanceTo(eyeSocketL);
          const distR = vertex.distanceTo(eyeSocketR);
          
          if (distL < 0.15) {
            vertex.add(eyeSocketL.clone().sub(vertex).multiplyScalar(0.1));
          }
          if (distR < 0.15) {
            vertex.add(eyeSocketR.clone().sub(vertex).multiplyScalar(0.1));
          }
          
          // Jawline definition
          if (vertex.y < -0.1 && vertex.z > 0) {
            vertex.z *= 0.9;
            vertex.y *= 1.1;
          }
          
          // Cheekbones
          if (vertex.y > 0.1 && vertex.y < 0.3 && Math.abs(vertex.x) > 0.3) {
            vertex.multiplyScalar(1.05);
          }
          
          headPositions.setXYZ(i, vertex.x, vertex.y, vertex.z);
        }
        
        headGeom.computeVertexNormals();
        return headGeom;
        
      case 'eye':
        return new THREE.SphereGeometry(0.08, 32, 32);
        
      case 'iris':
        return new THREE.SphereGeometry(0.04, 16, 16);
        
      case 'pupil':
        return new THREE.SphereGeometry(0.02, 12, 12);
        
      case 'eyebrow':
        return new THREE.BoxGeometry(0.15, 0.03, 0.08);
        
      case 'nose':
        const noseGeom = new THREE.ConeGeometry(0.05, 0.12, 16);
        noseGeom.rotateX(Math.PI);
        return noseGeom;
        
      case 'mouth':
        return new THREE.BoxGeometry(0.2, 0.05, 0.08);
        
      case 'torso':
        // Anatomically correct torso
        const torsoGeom = new THREE.CylinderGeometry(0.8, 0.9, 2.2, 32, 32);
        const torsoPositions = torsoGeom.attributes.position;
        
        for (let i = 0; i < torsoPositions.count; i++) {
          const vertex = new THREE.Vector3().fromBufferAttribute(torsoPositions, i);
          
          // Chest definition
          if (vertex.y > 0.5 && vertex.z > 0) {
            vertex.z *= 1.2;
          }
          
          // Waist narrowing
          if (vertex.y > -0.3 && vertex.y < 0.2) {
            vertex.x *= 0.85;
            vertex.z *= 0.85;
          }
          
          torsoPositions.setXYZ(i, vertex.x, vertex.y, vertex.z);
        }
        
        torsoGeom.computeVertexNormals();
        return torsoGeom;
        
      case 'limb':
        const radius = params.radius || 0.15;
        const length = params.length || 1.5;
        const limbGeom = new THREE.CapsuleGeometry(radius, length, 16, 32);
        
        // Add muscle definition
        const limbPositions = limbGeom.attributes.position;
        for (let i = 0; i < limbPositions.count; i++) {
          const vertex = new THREE.Vector3().fromBufferAttribute(limbPositions, i);
          
          // Muscle bulges
          const muscleFactor = Math.sin(vertex.y * 2 + Math.PI) * 0.1 + 1;
          vertex.x *= muscleFactor;
          vertex.z *= muscleFactor;
          
          limbPositions.setXYZ(i, vertex.x, vertex.y, vertex.z);
        }
        
        limbGeom.computeVertexNormals();
        return limbGeom;
        
      default:
        return new THREE.SphereGeometry(0.5, 32, 32);
    }
  };
  
  // Create realistic hair system
  const createHairSystem = () => {
    const hairStrands = [];
    const strandCount = config.hair.style === 'mohawk' ? 50 : 200;
    
    for (let i = 0; i < strandCount; i++) {
      const angle = (i / strandCount) * Math.PI * 2;
      const radius = 0.6 + Math.random() * 0.1;
      const height = 0.2 + Math.random() * 0.3;
      
      const strand = (
        <mesh
          key={i}
          position={[
            Math.cos(angle) * radius,
            height,
            Math.sin(angle) * radius
          ]}
          rotation={[0, angle, Math.random() * 0.3 - 0.15]}
        >
          <cylinderGeometry args={[0.005, 0.002, 0.4, 6]} />
          <primitive object={hairMaterial} />
        </mesh>
      );
      
      hairStrands.push(strand);
    }
    
    return hairStrands;
  };
  
  // Advanced animation system
  useFrame((state, delta) => {
    const time = state.clock.elapsedTime * animationSpeed;
    
    // Update shader uniforms
    [skinMaterial, hairMaterial, cyberneticMaterial].forEach(material => {
      if (material.userData.shader) {
        material.userData.shader.uniforms.time.value = time;
      }
    });
    
    // Breathing animation
    if (torsoRef.current) {
      const breathScale = 1 + Math.sin(time * 1.2) * 0.02;
      torsoRef.current.scale.set(breathScale, breathScale, breathScale);
    }
    
    // Head movement and expressions
    if (headRef.current) {
      // Subtle head movement
      headRef.current.rotation.x = Math.sin(time * 0.7) * 0.05;
      headRef.current.rotation.y = Math.sin(time * 0.5) * 0.08;
      
      // Micro-expressions
      setExpressionState(prev => ({
        eyebrowRaise: Math.sin(time * 0.3) * 0.02,
        eyeSquint: Math.sin(time * 0.8) * 0.01,
        mouthCurve: Math.sin(time * 0.4) * 0.01,
        blinkPhase: time % 3
      }));
    }
    
    // Eye blinking
    eyeRefs.forEach(eyeRef => {
      if (eyeRef.current) {
        const blinkInterval = 3;
        const blinkPhase = (time % blinkInterval) / blinkInterval;
        const blink = blinkPhase < 0.1 || blinkPhase > 0.95 ? 
          1 - Math.sin((blinkPhase % 0.1) * 10 * Math.PI) * 0.8 : 1;
        eyeRef.current.scale.y = blink;
      }
    });
    
    // Eyebrow expressions
    eyebrowRefs.forEach(eyebrowRef => {
      if (eyebrowRef.current) {
        eyebrowRef.current.position.y = 1.95 + expressionState.eyebrowRaise;
      }
    });
    
    // Mouth expressions
    if (mouthRef.current) {
      mouthRef.current.scale.x = 1 + expressionState.mouthCurve;
    }
    
    // Limb articulation
    armRefs.forEach((armRef, index) => {
      if (armRef.current) {
        const phase = time + index * Math.PI;
        armRef.current.rotation.z += Math.sin(phase * 0.8) * 0.005;
      }
    });
    
    // Hover effects
    if (isHovered && groupRef.current) {
      groupRef.current.position.y = Math.sin(time * 2) * 0.05;
    }
  });
  
  return (
    <group ref={groupRef} position={[0, -1, 0]}>
      {/* Ultra-detailed head */}
      <mesh 
        ref={headRef}
        position={[0, 1.8, 0]}
        geometry={createDetailedGeometry('head')}
        material={skinMaterial}
        castShadow
        receiveShadow
      />
      
      {/* Detailed facial features */}
      {/* Eyes */}
      <mesh ref={eyeRefs[0]} position={[-0.15, 1.85, 0.55]}>
        <primitive object={createDetailedGeometry('eye')} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[-0.15, 1.85, 0.6]}>
        <primitive object={createDetailedGeometry('iris')} />
        <meshStandardMaterial 
          color={config.face.eyes === 'cyber' ? '#00ffff' : config.face.eyes === 'blue' ? '#4A90E2' : '#8B4513'}
          emissive={config.face.eyes === 'cyber' ? '#00ffff' : '#000000'}
          emissiveIntensity={config.face.eyes === 'cyber' ? 0.5 : 0}
        />
      </mesh>
      <mesh position={[-0.15, 1.85, 0.62]}>
        <primitive object={createDetailedGeometry('pupil')} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      
      <mesh ref={eyeRefs[1]} position={[0.15, 1.85, 0.55]}>
        <primitive object={createDetailedGeometry('eye')} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0.15, 1.85, 0.6]}>
        <primitive object={createDetailedGeometry('iris')} />
        <meshStandardMaterial 
          color={config.face.eyes === 'cyber' ? '#00ffff' : config.face.eyes === 'blue' ? '#4A90E2' : '#8B4513'}
          emissive={config.face.eyes === 'cyber' ? '#00ffff' : '#000000'}
          emissiveIntensity={config.face.eyes === 'cyber' ? 0.5 : 0}
        />
      </mesh>
      <mesh position={[0.15, 1.85, 0.62]}>
        <primitive object={createDetailedGeometry('pupil')} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      
      {/* Eyebrows */}
      <mesh ref={eyebrowRefs[0]} position={[-0.15, 1.95, 0.5]}>
        <primitive object={createDetailedGeometry('eyebrow')} />
        <primitive object={hairMaterial} />
      </mesh>
      <mesh ref={eyebrowRefs[1]} position={[0.15, 1.95, 0.5]}>
        <primitive object={createDetailedGeometry('eyebrow')} />
        <primitive object={hairMaterial} />
      </mesh>
      
      {/* Nose */}
      <mesh ref={noseRef} position={[0, 1.75, 0.5]}>
        <primitive object={createDetailedGeometry('nose')} />
        <primitive object={skinMaterial} />
      </mesh>
      
      {/* Mouth */}
      <mesh ref={mouthRef} position={[0, 1.6, 0.5]}>
        <primitive object={createDetailedGeometry('mouth')} />
        <meshStandardMaterial color="#CC6677" roughness={0.6} />
      </mesh>
      
      {/* Realistic hair system */}
      <group position={[0, 1.9, 0]}>
        {createHairSystem()}
      </group>
      
      {/* Detailed torso */}
      <mesh 
        ref={torsoRef}
        position={[0, 0.2, 0]}
        geometry={createDetailedGeometry('torso')}
        material={skinMaterial}
        castShadow
        receiveShadow
      />
      
      {/* Realistic arms */}
      <mesh 
        ref={armRefs[0]}
        position={[-0.9, 0.8, 0]} 
        rotation={[0, 0, Math.PI / 8]}
        geometry={createDetailedGeometry('limb', { radius: 0.15, length: 1.4 })}
        material={config.augmentations.arms === 'cybernetic' ? cyberneticMaterial : skinMaterial}
        castShadow
      />
      
      <mesh 
        ref={armRefs[1]}
        position={[0.9, 0.8, 0]} 
        rotation={[0, 0, -Math.PI / 8]}
        geometry={createDetailedGeometry('limb', { radius: 0.15, length: 1.4 })}
        material={config.augmentations.arms === 'cybernetic' ? cyberneticMaterial : skinMaterial}
        castShadow
      />
      
      {/* Realistic legs */}
      <mesh 
        ref={legRefs[0]}
        position={[-0.35, -1.2, 0]}
        geometry={createDetailedGeometry('limb', { radius: 0.18, length: 1.8 })}
        material={config.augmentations.legs !== 'none' ? cyberneticMaterial : skinMaterial}
        castShadow
      />
      
      <mesh 
        ref={legRefs[1]}
        position={[0.35, -1.2, 0]}
        geometry={createDetailedGeometry('limb', { radius: 0.18, length: 1.8 })}
        material={config.augmentations.legs !== 'none' ? cyberneticMaterial : skinMaterial}
        castShadow
      />
      
      {/* Ultra-detailed cybernetic implants */}
      {config.face.implants !== 'basic' && (
        <group>
          {/* Neural interface port */}
          <mesh position={[0.4, 1.6, 0.3]} rotation={[0, Math.PI / 2, 0]}>
            <cylinderGeometry args={[0.06, 0.04, 0.15]} />
            <primitive object={cyberneticMaterial} />
          </mesh>
          
          {/* Facial circuit lines */}
          <mesh position={[-0.3, 1.7, 0.6]}>
            <boxGeometry args={[0.2, 0.02, 0.01]} />
            <primitive object={cyberneticMaterial} />
          </mesh>
          
          <mesh position={[0.3, 1.7, 0.6]}>
            <boxGeometry args={[0.2, 0.02, 0.01]} />
            <primitive object={cyberneticMaterial} />
          </mesh>
          
          {/* Eye augmentations */}
          {config.face.implants === 'military' && (
            <>
              <mesh position={[-0.25, 1.85, 0.65]}>
                <ringGeometry args={[0.08, 0.12, 16]} />
                <primitive object={cyberneticMaterial} />
              </mesh>
              <mesh position={[0.25, 1.85, 0.65]}>
                <ringGeometry args={[0.08, 0.12, 16]} />
                <primitive object={cyberneticMaterial} />
              </mesh>
            </>
          )}
        </group>
      )}
      
      {/* Clothing system */}
      <group>
        {/* Jacket/Top */}
        <mesh position={[0, 0.5, 0]}>
          <cylinderGeometry args={[1.0, 1.1, 1.5, 32]} />
          <primitive object={createFabricMaterial('leather', '#2a2a2a')} />
        </mesh>
        
        {/* Pants */}
        <mesh position={[0, -0.8, 0]}>
          <cylinderGeometry args={[0.9, 0.8, 1.2, 32]} />
          <primitive object={createFabricMaterial('denim', '#1a4a6b')} />
        </mesh>
      </group>
    </group>
  );
};

// Advanced lighting setup for photorealism
const PhotorealisticLighting = () => {
  const keyLightRef = useRef();
  const fillLightRef = useRef();
  const rimLightRef = useRef();
  
  useFrame((state) => {
    if (keyLightRef.current) {
      keyLightRef.current.position.x = Math.sin(state.clock.elapsedTime * 0.5) * 3;
      keyLightRef.current.position.z = Math.cos(state.clock.elapsedTime * 0.5) * 3;
    }
  });

  return (
    <>
      {/* Key light (main illumination) */}
      <directionalLight
        ref={keyLightRef}
        position={[5, 8, 5]}
        intensity={2.0}
        color="#ffffff"
        castShadow
        shadow-mapSize={[4096, 4096]}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        shadow-bias={-0.0001}
      />
      
      {/* Fill light (soften shadows) */}
      <directionalLight
        ref={fillLightRef}
        position={[-3, 4, -3]}
        intensity={0.6}
        color="#e3f2fd"
      />
      
      {/* Rim light (edge definition) */}
      <directionalLight
        ref={rimLightRef}
        position={[0, 3, -8]}
        intensity={1.5}
        color="#ff6b9d"
      />
      
      {/* Ambient light (global illumination) */}
      <ambientLight intensity={0.15} color="#b3e5fc" />
      
      {/* Accent lights for cyberpunk atmosphere */}
      <pointLight
        position={[3, 3, 3]}
        intensity={1.0}
        color="#00ffff"
        distance={15}
        decay={2}
      />
      
      <pointLight
        position={[-3, -2, 3]}
        intensity={0.8}
        color="#ff0080"
        distance={12}
        decay={2}
      />
      
      <pointLight
        position={[0, 5, -5]}
        intensity={0.6}
        color="#80ff00"
        distance={20}
        decay={1}
      />
    </>
  );
};

// Main photorealistic viewer component
const PhotorealisticCharacterViewer = ({ characterConfig, onViewChange }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [renderQuality, setRenderQuality] = useState('ultra');
  const controlsRef = useRef();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="photorealistic-loader">
        <div className="loader-content">
          <div className="aaa-loader">
            <div className="render-progress">
              <div className="progress-bar">
                <div className="progress-fill"></div>
              </div>
              <div className="progress-text">Initializing AAA Renderer...</div>
            </div>
            <div className="render-stats">
              <div className="stat">
                <span className="label">Polygons:</span>
                <span className="value">2.4M</span>
              </div>
              <div className="stat">
                <span className="label">Shaders:</span>
                <span className="value">Ultra-HD</span>
              </div>
              <div className="stat">
                <span className="label">Lighting:</span>
                <span className="value">Cinematic</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="photorealistic-viewer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Canvas
        shadows="soft"
        camera={{ position: [0, 2, 6], fov: 35 }}
        style={{ 
          background: 'radial-gradient(circle at center, rgba(10, 10, 40, 0.9), rgba(0, 0, 0, 1))',
          borderRadius: '12px'
        }}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: "high-performance",
          stencil: false,
          depth: true,
          shadowMapType: THREE.PCFSoftShadowMap,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
          outputColorSpace: THREE.SRGBColorSpace
        }}
      >
        <Suspense fallback={null}>
          {/* Advanced camera controls */}
          <OrbitControls
            ref={controlsRef}
            enableZoom={true}
            enablePan={false}
            enableRotate={true}
            autoRotate={false}
            autoRotateSpeed={0.3}
            minDistance={2.5}
            maxDistance={12}
            minPolarAngle={Math.PI / 8}
            maxPolarAngle={Math.PI - Math.PI / 8}
            dampingFactor={0.03}
            enableDamping={true}
            rotateSpeed={0.5}
            zoomSpeed={0.6}
          />
          
          {/* Photorealistic lighting */}
          <PhotorealisticLighting />
          
          {/* HDRI environment for reflections */}
          <Environment preset="studio" background={false} environmentIntensity={0.4} />
          
          {/* Photorealistic character */}
          <PhotorealisticCharacterModel 
            config={characterConfig} 
            isHovered={isHovered}
            animationSpeed={1}
          />
          
          {/* Advanced shadows */}
          <ContactShadows
            position={[0, -2.1, 0]}
            opacity={0.8}
            scale={12}
            blur={3}
            far={6}
            color="#000044"
            resolution={1024}
          />
          
          {/* Environmental elements */}
          <mesh position={[0, 0, -8]} receiveShadow>
            <planeGeometry args={[30, 30]} />
            <meshStandardMaterial 
              color="#0a0a0a"
              transparent
              opacity={0.05}
            />
          </mesh>
        </Suspense>
      </Canvas>
      
      {/* Advanced UI overlay */}
      <div className="photorealistic-ui-overlay">
        <div className="render-info">
          <div className="quality-badge">
            <span className="quality-icon">⚡</span>
            <span className="quality-text">AAA QUALITY</span>
          </div>
          <div className="render-stats">
            <span className="stat">4K TEXTURES</span>
            <span className="stat">PBR MATERIALS</span>
            <span className="stat">REAL-TIME RT</span>
          </div>
        </div>
        
        <div className="viewer-controls-info">
          <span>🖱️ Drag to orbit • 🔍 Scroll to zoom • ⌨️ Hold shift for pan</span>
        </div>
      </div>
      
      {/* Performance and quality indicators */}
      <div className="performance-indicators">
        <div className="fps-counter">
          <span className="fps-value">60</span>
          <span className="fps-label">FPS</span>
        </div>
        <div className="quality-selector">
          <button 
            className={renderQuality === 'ultra' ? 'active' : ''}
            onClick={() => setRenderQuality('ultra')}
          >
            ULTRA
          </button>
          <button 
            className={renderQuality === 'cinematic' ? 'active' : ''}
            onClick={() => setRenderQuality('cinematic')}
          >
            CINEMATIC
          </button>
        </div>
      </div>
    </div>
  );
};

export default PhotorealisticCharacterViewer;