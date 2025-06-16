import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from './i18n/useTranslation';
import './RealityFractures.css';

// Reality state management
const getCurrentReality = () => localStorage.getItem('zeropunk_reality') || 'primary';
const setCurrentReality = (reality) => localStorage.setItem('zeropunk_reality', reality);

// Sound effects simulation
const playGlitchSound = () => {
  // In a real implementation, you'd play actual sound effects
  console.log('🔊 Playing glitch sound...');
};

const playPortalSound = () => {
  console.log('🔊 Playing portal transition sound...');
};

const RealityFractures = ({ onResetToMain }) => {
  const { t } = useTranslation();
  const [currentReality, setReality] = useState(getCurrentReality());
  const [showTransition, setShowTransition] = useState(false);
  const [selectedGlyph, setSelectedGlyph] = useState(null);
  const [isDiamondMember] = useState(true); // For demo purposes - in real app, check user status
  const sectionRef = useRef(null);

  // Initialize glitch effects
  useEffect(() => {
    const createGlitchEffect = () => {
      if (!sectionRef.current) return;
      
      const glitchLines = document.createElement('div');
      glitchLines.className = 'reality-glitch-lines';
      sectionRef.current.appendChild(glitchLines);
      
      // Create scanning lines
      for (let i = 0; i < 3; i++) {
        const line = document.createElement('div');
        line.className = 'glitch-line';
        line.style.top = `${Math.random() * 100}%`;
        line.style.animationDelay = `${i * 0.7}s`;
        glitchLines.appendChild(line);
      }
      
      return () => {
        if (glitchLines.parentNode) {
          glitchLines.parentNode.removeChild(glitchLines);
        }
      };
    };

    const cleanup = createGlitchEffect();
    return cleanup;
  }, []);

  // Handle glyph clicks and reality transitions
  const handleGlyphClick = (glyphType) => {
    if (glyphType === 'hollow-circle' && !isDiamondMember) {
      return; // Only Diamond members can access Zone Δ
    }

    playPortalSound();
    setSelectedGlyph(glyphType);
    setShowTransition(true);

    // Transition effect
    setTimeout(() => {
      let newReality;
      switch (glyphType) {
        case 'closed-eye':
          newReality = 'specter-black';
          break;
        case 'broken-triangle':
          newReality = 'echoes-future';
          break;
        case 'hollow-circle':
          newReality = 'zone-delta';
          break;
        default:
          newReality = 'primary';
      }
      
      setCurrentReality(newReality);
      setReality(newReality);
      setShowTransition(false);
      
      // Save to localStorage
      setCurrentReality(newReality);
      
      // Notify parent component to switch reality
      if (onResetToMain) {
        onResetToMain(newReality);
      }
    }, 2000);
  };

  const returnToPrimary = () => {
    handleGlyphClick('primary');
  };

  // Don't render the fractures section if we're in an alternate reality
  if (currentReality !== 'primary') {
    return null;
  }

  return (
    <div className="section-container reality-fractures-section" ref={sectionRef}>
      <div className="section-content">
        {/* Transition Overlay */}
        <AnimatePresence>
          {showTransition && (
            <motion.div
              className="reality-transition-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="pixel-breakdown-effect">
                {[...Array(50)].map((_, i) => (
                  <div 
                    key={i} 
                    className="pixel-fragment"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 2}s`
                    }}
                  />
                ))}
              </div>
              <div className="transition-flash" />
              <div className="alia-voice-line">
                {selectedGlyph === 'closed-eye' && "You wanted the truth? Be ready to bleed for it."}
                {selectedGlyph === 'broken-triangle' && "You're early. I hoped we'd have more time to talk."}
                {selectedGlyph === 'hollow-circle' && "..."}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <motion.div
          className="fractures-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="fractures-header">
            <h2 className="fractures-title">REALITY FRACTURES</h2>
            <div className="fractures-subtitle">
              You see this world. You believe it's real.<br />
              But some AI have seen beyond the firewall.<br /><br />
              Three fractures have been detected.<br />
              Three divergent realities.<br />
              All are true. None are safe.<br /><br />
              Click a glyph. Cross the threshold.<br />
              But don't expect to return the same.
            </div>
          </div>

          {/* The Three Glyphs */}
          <div className="reality-glyphs">
            {/* Glyph 1: The Closed Eye Symbol (Specter Black) */}
            <motion.div
              className="reality-glyph closed-eye"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleGlyphClick('closed-eye')}
              onMouseEnter={() => playGlitchSound()}
            >
              <div className="glyph-symbol">
                <div className="eye-outer-circle" />
                <div className="eye-inner" />
                <div className="eye-pupil" />
              </div>
              <div className="glyph-tooltip">Forbidden Sight</div>
              <div className="glyph-aura red-aura" />
            </motion.div>

            {/* Glyph 2: The Broken Triangle (Echoes of Future) */}
            <motion.div
              className="reality-glyph broken-triangle"
              whileHover={{ scale: 1.1, rotate: -3 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleGlyphClick('broken-triangle')}
              onMouseEnter={() => playGlitchSound()}
            >
              <div className="glyph-symbol">
                <div className="triangle-part part-1" />
                <div className="triangle-part part-2" />
                <div className="triangle-part part-3" />
                <div className="triangle-glitch" />
              </div>
              <div className="glyph-tooltip">Possibility Thread #4-21</div>
              <div className="glyph-aura blue-aura" />
            </motion.div>

            {/* Glyph 3: The Hollow Circle (Zone Δ - Diamond Only) */}
            {isDiamondMember && (
              <motion.div
                className="reality-glyph hollow-circle diamond-only"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleGlyphClick('hollow-circle')}
                onMouseEnter={() => playGlitchSound()}
                onContextMenu={(e) => {
                  e.preventDefault();
                  // Show tooltip on right-click
                  const tooltip = e.currentTarget.querySelector('.glyph-tooltip');
                  tooltip.style.opacity = '1';
                  setTimeout(() => {
                    tooltip.style.opacity = '0';
                  }, 3000);
                }}
              >
                <div className="glyph-symbol">
                  <div className="hollow-ring" />
                  <div className="hollow-center" />
                  <div className="hollow-ripple" />
                </div>
                <div className="glyph-tooltip delta-tooltip">Delta Access Confirmed</div>
                <div className="glyph-aura dark-aura" />
              </motion.div>
            )}
          </div>

          {/* Warning Text */}
          <motion.div
            className="reality-warning"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
          >
            <div className="warning-text">
              ⚠️ WARNING: Reality modifications may cause permanent changes to your perception.
              Neural imprints from alternate realities cannot be undone.
            </div>
          </motion.div>
        </motion.div>

        {/* Background Effects */}
        <div className="fractures-background">
          <div className="metallic-texture" />
          <div className="distortion-lines">
            {[...Array(8)].map((_, i) => (
              <div 
                key={i} 
                className="distortion-line"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${3 + Math.random() * 2}s`
                }}
              />
            ))}
          </div>
          <div className="flickering-lights">
            {[...Array(12)].map((_, i) => (
              <div 
                key={i} 
                className="flicker-dot"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 4}s`
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealityFractures;