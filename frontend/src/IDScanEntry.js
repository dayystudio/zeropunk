import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from './i18n/useTranslation';
import './IDScanEntry.css';

const IDScanEntry = ({ onComplete }) => {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [scanProgress, setScanProgress] = useState(0);
  const [isReturningUser, setIsReturningUser] = useState(false);
  const [userID, setUserID] = useState(null);
  const [glitchActive, setGlitchActive] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const audioRef = useRef(null);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsMobile(mobile);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Check if user is returning
  useEffect(() => {
    const lastVisit = localStorage.getItem('zeropunk_last_visit');
    const storedUserID = localStorage.getItem('zeropunk_user_id');
    
    if (lastVisit) {
      setIsReturningUser(true);
      if (storedUserID) {
        setUserID(storedUserID);
      }
    } else {
      // Generate new user ID for first-time visitors
      const newUserID = generateUserID();
      setUserID(newUserID);
      localStorage.setItem('zeropunk_user_id', newUserID);
    }
    
    // Update last visit timestamp
    localStorage.setItem('zeropunk_last_visit', Date.now().toString());
  }, []);

  // Generate unique user ID
  const generateUserID = () => {
    const prefix = Math.random() > 0.5 ? 'Z' : 'N';
    const numbers = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
    return `${prefix}-${numbers}`;
  };

  // Get scan sequence based on user type (optimized for mobile)
  const getScanSequence = () => {
    const baseDuration = isMobile ? 600 : 800; // Faster on mobile
    const sequences = {
      returning: [
        { text: t('scan_initializing'), duration: baseDuration },
        { text: t('scan_detecting'), duration: baseDuration * 0.8 },
        { text: t('scan_returning_user'), duration: baseDuration * 1.1 },
        { text: t('scan_memory_traces'), duration: baseDuration },
        { text: `${t('scan_user_id')}: ${userID}`, duration: baseDuration * 1.1 },
        { text: t('scan_access_granted'), duration: baseDuration * 0.7 },
        { text: t('scan_welcome_back'), duration: baseDuration }
      ],
      new: [
        { text: t('scan_initializing'), duration: baseDuration },
        { text: t('scan_detecting'), duration: baseDuration * 0.8 },
        { text: t('scan_unregistered'), duration: baseDuration * 1.1 },
        { text: t('scan_mind_pattern'), duration: baseDuration },
        { text: t('scan_access_temp'), duration: baseDuration * 1.1 },
        { text: `${t('scan_assigned_id')}: ${userID}`, duration: baseDuration },
        { text: t('scan_protocol_override'), duration: baseDuration * 0.7 },
        { text: t('scan_welcome'), duration: baseDuration }
      ]
    };
    
    return isReturningUser ? sequences.returning : sequences.new;
  };

  const scanSequence = getScanSequence();

  // Main sequence controller
  useEffect(() => {
    if (!isVisible) return;

    const totalDuration = scanSequence.reduce((sum, step) => sum + step.duration, 0);
    let currentTime = 0;

    // Start scan progress animation
    const progressInterval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + (100 / (totalDuration / 50));
      });
    }, 50);

    // Step through scan sequence
    const stepTimeouts = [];
    scanSequence.forEach((step, index) => {
      const timeout = setTimeout(() => {
        setCurrentStep(index);
        
        // Trigger glitch effect on certain steps
        if (index === 2 || index === scanSequence.length - 2) {
          setGlitchActive(true);
          setTimeout(() => setGlitchActive(false), 200);
        }
      }, currentTime);
      
      stepTimeouts.push(timeout);
      currentTime += step.duration;
    });

    // Complete sequence
    const completeTimeout = setTimeout(() => {
      // Final glitch effect
      setGlitchActive(true);
      setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => {
          onComplete();
        }, 500);
      }, 300);
    }, totalDuration + 500);

    return () => {
      clearInterval(progressInterval);
      stepTimeouts.forEach(timeout => clearTimeout(timeout));
      clearTimeout(completeTimeout);
    };
  }, [isVisible, scanSequence, onComplete]);

  // Skip functionality (optional)
  const handleSkip = () => {
    setGlitchActive(true);
    setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        onComplete();
      }, 200);
    }, 100);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div 
        className={`id-scan-overlay ${glitchActive ? 'glitch-active' : ''}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Background Effects */}
        <div className="scan-background">
          <div className="scan-grid"></div>
          <div className="scan-particles"></div>
          <div className="scan-noise"></div>
        </div>

        {/* Laser Scan Line */}
        <div className="laser-scan-container">
          <motion.div 
            className="laser-scan-line"
            animate={{ 
              y: ['0vh', '100vh'],
              opacity: [0, 1, 1, 0]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </div>

        {/* Main Content */}
        <div className="scan-content">
          {/* Header */}
          <div className="scan-header">
            <div className="scan-logo">
              <span className="logo-text">ZEROPUNK</span>
              <span className="logo-subtitle">{t('scan_neural_interface')}</span>
            </div>
          </div>

          {/* Scan Progress */}
          <div className="scan-progress-container">
            <div className="scan-progress-bar">
              <motion.div 
                className="scan-progress-fill"
                animate={{ width: `${scanProgress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <div className="scan-progress-text">
              {Math.round(scanProgress)}% {t('scan_complete')}
            </div>
          </div>

          {/* Scan Terminal */}
          <div className="scan-terminal">
            <div className="terminal-header">
              <span className="terminal-title">{t('scan_neural_scanner')}</span>
              <div className="terminal-status">
                <div className="status-dot active"></div>
                <span>{t('scan_active')}</span>
              </div>
            </div>
            
            <div className="terminal-content">
              {scanSequence.slice(0, currentStep + 1).map((step, index) => (
                <motion.div
                  key={index}
                  className={`terminal-line ${index === currentStep ? 'current' : 'completed'}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <span className="terminal-prompt">{'>'}</span>
                  <span className="terminal-text">
                    {index === currentStep ? (
                      <TypewriterText text={step.text} />
                    ) : (
                      step.text
                    )}
                  </span>
                  {index === currentStep && <span className="terminal-cursor">_</span>}
                </motion.div>
              ))}
            </div>
          </div>

          {/* User Info Card (appears for returning users) */}
          {isReturningUser && currentStep >= 3 && (
            <motion.div 
              className="user-info-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="user-card-header">
                <span className="user-card-title">{t('scan_user_profile')}</span>
              </div>
              <div className="user-card-content">
                <div className="user-detail">
                  <span className="detail-label">{t('scan_id')}:</span>
                  <span className="detail-value">{userID}</span>
                </div>
                <div className="user-detail">
                  <span className="detail-label">{t('scan_class')}:</span>
                  <span className="detail-value">{t('scan_civilian')}</span>
                </div>
                <div className="user-detail">
                  <span className="detail-label">{t('scan_affiliation')}:</span>
                  <span className="detail-value">{t('scan_unknown')}</span>
                </div>
                <div className="user-detail">
                  <span className="detail-label">{t('scan_threat_level')}:</span>
                  <span className="detail-value threat-low">{t('scan_minimal')}</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Skip Button */}
          <button 
            className="scan-skip-button"
            onClick={handleSkip}
            title={t('scan_skip')}
          >
            {t('scan_skip')} [ESC]
          </button>
        </div>

        {/* Glitch Overlay */}
        {glitchActive && (
          <div className="glitch-overlay">
            <div className="glitch-bars"></div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

// Typewriter effect component (optimized for performance)
const TypewriterText = ({ text, speed = 50 }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      // Adaptive speed based on device performance
      const adaptiveSpeed = /Mobile|Android|iPhone|iPad/.test(navigator.userAgent) ? speed * 1.2 : speed;
      
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, adaptiveSpeed);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, speed]);

  useEffect(() => {
    // Reset when text changes
    setDisplayText('');
    setCurrentIndex(0);
  }, [text]);

  return <span>{displayText}</span>;
};

export default IDScanEntry;