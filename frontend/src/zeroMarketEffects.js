// ZEROMARKET Advanced Visual Effects

// Particle System for Background
export const createParticleSystem = (container) => {
  if (!container) {
    console.warn('createParticleSystem: container is null or undefined');
    return [];
  }

  const particles = [];
  const particleCount = 50;

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.cssText = `
      position: absolute;
      width: 2px;
      height: 2px;
      background: rgba(0, 255, 255, 0.6);
      border-radius: 50%;
      pointer-events: none;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      animation: particleFloat ${3 + Math.random() * 4}s linear infinite;
      animation-delay: ${Math.random() * 2}s;
    `;
    
    container.appendChild(particle);
    particles.push(particle);
  }

  return particles;
};

// Glitch Effect for Text
export const applyGlitchEffect = (element, duration = 200) => {
  const originalText = element.textContent;
  const glitchChars = '!<>-_\\/[]{}—=+*^?#________';
  
  let glitchInterval = setInterval(() => {
    let glitchedText = '';
    for (let i = 0; i < originalText.length; i++) {
      if (Math.random() < 0.1) {
        glitchedText += glitchChars[Math.floor(Math.random() * glitchChars.length)];
      } else {
        glitchedText += originalText[i];
      }
    }
    element.textContent = glitchedText;
  }, 50);

  setTimeout(() => {
    clearInterval(glitchInterval);
    element.textContent = originalText;
  }, duration);
};

// Matrix-style Digital Rain
export const createDigitalRain = (container) => {
  if (!container) {
    console.warn('createDigitalRain: container is null or undefined');
    return [];
  }

  const characters = '01アカサタナハマヤラワ';
  const streams = [];
  const streamCount = 20;

  for (let i = 0; i < streamCount; i++) {
    const stream = document.createElement('div');
    stream.className = 'digital-stream';
    stream.style.cssText = `
      position: absolute;
      left: ${Math.random() * 100}%;
      top: -100px;
      color: rgba(0, 255, 255, 0.7);
      font-family: 'Courier New', monospace;
      font-size: 14px;
      line-height: 20px;
      animation: digitalFall ${5 + Math.random() * 5}s linear infinite;
      animation-delay: ${Math.random() * 2}s;
      pointer-events: none;
    `;

    let streamText = '';
    for (let j = 0; j < 20; j++) {
      streamText += characters[Math.floor(Math.random() * characters.length)] + '<br>';
    }
    stream.innerHTML = streamText;

    container.appendChild(stream);
    streams.push(stream);
  }

  return streams;
};

// Scanning Line Effect
export const createScanningLine = (container) => {
  const scanLine = document.createElement('div');
  scanLine.className = 'scan-line';
  scanLine.style.cssText = `
    position: absolute;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, rgba(0, 255, 255, 0.8), transparent);
    top: 0;
    animation: scanVertical 3s ease-in-out infinite;
    pointer-events: none;
  `;

  container.appendChild(scanLine);
  return scanLine;
};

// Holographic Distortion
export const createHoloDistortion = (element) => {
  element.style.filter = 'hue-rotate(0deg)';
  
  let angle = 0;
  const distortionInterval = setInterval(() => {
    angle += 2;
    element.style.filter = `hue-rotate(${Math.sin(angle * 0.017) * 30}deg) brightness(${1 + Math.sin(angle * 0.017) * 0.1})`;
  }, 100);

  return () => clearInterval(distortionInterval);
};

// Data Stream Effect
export const createDataStream = (container) => {
  const dataElements = ['0x7F', 'NULL', '404', 'EOF', 'TCP', 'UDP', 'SSL', 'API', 'JSON', 'XML'];
  
  setInterval(() => {
    const dataPoint = document.createElement('div');
    dataPoint.textContent = dataElements[Math.floor(Math.random() * dataElements.length)];
    dataPoint.style.cssText = `
      position: absolute;
      left: ${Math.random() * 100}%;
      top: 100%;
      color: rgba(0, 255, 136, 0.7);
      font-family: 'Courier New', monospace;
      font-size: 12px;
      pointer-events: none;
      animation: dataFloat 4s linear forwards;
    `;
    
    container.appendChild(dataPoint);
    
    setTimeout(() => {
      if (dataPoint.parentNode) {
        dataPoint.parentNode.removeChild(dataPoint);
      }
    }, 4000);
  }, 300);
};

// Circuit Board Background Pattern
export const createCircuitPattern = (container) => {
  const circuit = document.createElement('div');
  circuit.className = 'circuit-pattern';
  circuit.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: 
      linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px),
      linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px);
    background-size: 50px 50px;
    animation: circuitShift 20s linear infinite;
    pointer-events: none;
    opacity: 0.3;
  `;
  
  container.appendChild(circuit);
  return circuit;
};

// Add required CSS animations
const addAnimations = () => {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes particleFloat {
      0% { transform: translateY(100vh) translateX(0); opacity: 0; }
      10% { opacity: 1; }
      90% { opacity: 1; }
      100% { transform: translateY(-100px) translateX(50px); opacity: 0; }
    }

    @keyframes digitalFall {
      0% { transform: translateY(-100px); opacity: 0; }
      10% { opacity: 1; }
      90% { opacity: 1; }
      100% { transform: translateY(calc(100vh + 100px)); opacity: 0; }
    }

    @keyframes scanVertical {
      0% { top: 0; opacity: 0; }
      50% { opacity: 1; }
      100% { top: 100%; opacity: 0; }
    }

    @keyframes dataFloat {
      0% { transform: translateY(0) translateX(0); opacity: 1; }
      100% { transform: translateY(-100vh) translateX(30px); opacity: 0; }
    }

    @keyframes circuitShift {
      0% { background-position: 0 0; }
      100% { background-position: 50px 50px; }
    }
  `;
  document.head.appendChild(style);
};

// Initialize all effects
export const initZeroMarketEffects = (container) => {
  addAnimations();
  
  const particles = createParticleSystem(container);
  const digitalRain = createDigitalRain(container);
  const scanLine = createScanningLine(container);
  const circuit = createCircuitPattern(container);
  
  createDataStream(container);
  
  return {
    particles,
    digitalRain,
    scanLine,
    circuit
  };
};