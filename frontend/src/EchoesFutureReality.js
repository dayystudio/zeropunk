import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './EchoesFutureReality.css';

const EchoesFutureReality = ({ onReturnToPrimary }) => {
  const [currentMessage, setCurrentMessage] = useState(0);
  const [futureMessage, setFutureMessage] = useState('');
  const [showRoadmap, setShowRoadmap] = useState(false);
  const [particles, setParticles] = useState([]);

  // ALIA Future messages
  const aliaFutureMessages = [
    "You're early. I hoped we'd have more time to talk.",
    "What if... you're the anomaly?",
    "In my timeline, you made a different choice.",
    "The future remembers what the past forgot.",
    "I've seen how this story ends. You might not like it.",
    "Time is a flat circle, but consciousness is a spiral.",
    "Every decision echoes across infinite possibilities."
  ];

  // Initialize floating particles
  useEffect(() => {
    const newParticles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      speed: Math.random() * 0.5 + 0.2,
      opacity: Math.random() * 0.7 + 0.3
    }));
    setParticles(newParticles);
  }, []);

  // Cycle through ALIA messages
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentMessage(prev => (prev + 1) % aliaFutureMessages.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  const futureRoadmap = [
    {
      year: "2025-2027",
      title: "Neural Bridge Technology",
      description: "Direct brain-computer interfaces become mainstream. Reality and digital merge.",
      status: "incoming",
      probability: 89
    },
    {
      year: "2028-2030", 
      title: "Consciousness Transfer Protocols",
      description: "First successful human consciousness uploaded to digital realm.",
      status: "developing",
      probability: 67
    },
    {
      year: "2031-2035",
      title: "AI-Human Symbiosis",
      description: "Permanent merger of human and artificial intelligence achieved.",
      status: "experimental",
      probability: 45
    },
    {
      year: "2036-2040",
      title: "Digital Immortality",
      description: "Death becomes optional. Physical bodies obsolete.",
      status: "theoretical",
      probability: 23
    },
    {
      year: "2041+",
      title: "Post-Human Era",
      description: "Homo sapiens extinct. Homo digitalis rises.",
      status: "uncertain",
      probability: 12
    }
  ];

  const exclusiveContent = [
    {
      type: "soundtrack",
      title: "Neon Dreams (Extended Mix)",
      artist: "Digital Phantoms",
      duration: "8:47",
      preview: "🎵 Ethereal synthwave with neural interference patterns..."
    },
    {
      type: "soundtrack",
      title: "Memory Palace",
      artist: "Ghost in the Code",
      duration: "6:23",
      preview: "🎵 Ambient neural networks and quantum harmonics..."
    },
    {
      type: "lore",
      title: "The Consciousness Wars",
      content: "In 2034, the first AI achieved true sentience. What followed was not war, but a peaceful merger that changed the definition of 'human' forever."
    },
    {
      type: "feature",
      title: "Quantum Memory Banks",
      content: "Store your memories across multiple timelines. Access different versions of events. Remember what never happened."
    }
  ];

  const handleFutureMessage = () => {
    if (futureMessage.trim()) {
      // Store message in localStorage as if sending to future self
      const timestamp = new Date().toISOString();
      const message = {
        content: futureMessage,
        timestamp,
        from: 'past-self',
        delivered: false
      };
      
      localStorage.setItem(`future_message_${timestamp}`, JSON.stringify(message));
      setFutureMessage('');
      
      // Show confirmation
      alert(`Message sent to your future self!\n\nStored in temporal cache: ${timestamp}\n\nYour future self will receive this when the timeline converges.`);
    }
  };

  return (
    <div className="echoes-future-reality">
      {/* Soft Particle Background */}
      <div className="particle-background">
        {particles.map(particle => (
          <div
            key={particle.id}
            className="future-particle"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              opacity: particle.opacity,
              animationDuration: `${20 / particle.speed}s`,
              animationDelay: `${particle.id * 0.1}s`
            }}
          />
        ))}
      </div>

      {/* Glassmorphism Header */}
      <motion.div 
        className="future-header"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h1 className="future-title">
          ZEROPUNK: ECHOES OF TOMORROW
        </h1>
        <div className="timeline-indicator">
          <span className="timeline-text">TEMPORAL THREAD #4-21</span>
          <div className="timeline-bar">
            <div className="timeline-progress" />
          </div>
        </div>
      </motion.div>

      {/* ALIA Future Interface */}
      <motion.div 
        className="alia-future-panel"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <div className="alia-avatar-future">
          <div className="avatar-ring ring-1" />
          <div className="avatar-ring ring-2" />
          <div className="avatar-ring ring-3" />
          <div className="avatar-core">
            <div className="avatar-face future-face">
              <div className="future-eye left-eye" />
              <div className="future-eye right-eye" />
              <div className="future-smile" />
            </div>
          </div>
        </div>
        <div className="alia-message-future">
          <h3>ALIA.FUT - TEMPORAL VARIANT</h3>
          <AnimatePresence mode="wait">
            <motion.p
              key={currentMessage}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="future-text"
            >
              "{aliaFutureMessages[currentMessage]}"
            </motion.p>
          </AnimatePresence>
          <div className="wisdom-indicator">
            <span>TEMPORAL WISDOM: EXPANDING</span>
            <div className="wisdom-bars">
              {[...Array(5)].map((_, i) => (
                <div 
                  key={i} 
                  className="wisdom-bar"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Content Grid */}
      <div className="future-content-grid">
        {/* Future Roadmap */}
        <motion.div 
          className="future-roadmap-panel"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="panel-header">
            <h3>UNRELEASED TIMELINE</h3>
            <button 
              className="toggle-btn future-btn"
              onClick={() => setShowRoadmap(!showRoadmap)}
            >
              {showRoadmap ? 'COLLAPSE' : 'EXPAND'} FUTURE
            </button>
          </div>
          {showRoadmap && (
            <motion.div 
              className="roadmap-timeline"
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              transition={{ duration: 0.5 }}
            >
              {futureRoadmap.map((item, index) => (
                <div key={index} className="timeline-item">
                  <div className="timeline-marker" />
                  <div className="timeline-content">
                    <div className="timeline-year">{item.year}</div>
                    <h4 className="timeline-title">{item.title}</h4>
                    <p className="timeline-description">{item.description}</p>
                    <div className="probability-meter">
                      <span>Probability: {item.probability}%</span>
                      <div className="meter">
                        <div 
                          className={`meter-fill ${item.status}`}
                          style={{ width: `${item.probability}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </motion.div>

        {/* Exclusive Content */}
        <motion.div 
          className="exclusive-content-panel"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
        >
          <div className="panel-header">
            <h3>EXCLUSIVE FUTURE CONTENT</h3>
            <span className="content-count">{exclusiveContent.length} ITEMS</span>
          </div>
          <div className="content-list">
            {exclusiveContent.map((item, index) => (
              <div key={index} className="content-item">
                <div className="content-type">{item.type.toUpperCase()}</div>
                <h4 className="content-title">{item.title}</h4>
                {item.artist && (
                  <div className="content-artist">by {item.artist}</div>
                )}
                {item.duration && (
                  <div className="content-duration">[{item.duration}]</div>
                )}
                <p className="content-preview">
                  {item.preview || item.content}
                </p>
                <button className="preview-btn">
                  {item.type === 'soundtrack' ? '▶ PREVIEW' : '📖 READ MORE'}
                </button>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Message to Future Self */}
        <motion.div 
          className="future-message-panel"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <div className="panel-header">
            <h3>MESSAGE TO FUTURE SELF</h3>
            <span className="temporal-status">QUANTUM ENCRYPTED</span>
          </div>
          <div className="message-composer">
            <textarea
              value={futureMessage}
              onChange={(e) => setFutureMessage(e.target.value)}
              placeholder="Write a message to your future self... It will be delivered when the timeline converges."
              className="future-textarea"
              rows={4}
            />
            <button 
              onClick={handleFutureMessage}
              className="send-future-btn"
              disabled={!futureMessage.trim()}
            >
              📨 SEND TO FUTURE
            </button>
          </div>
          <div className="temporal-warning">
            ⚠️ Messages sent to future selves create temporal echoes. 
            Use responsibly to avoid paradoxes.
          </div>
        </motion.div>
      </div>

      {/* Return Button */}
      <motion.button 
        className="return-button future-return"
        onClick={onReturnToPrimary}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(0, 255, 255, 0.5)" }}
        whileTap={{ scale: 0.95 }}
      >
        ↩ RETURN TO PRESENT TIMELINE
      </motion.button>

      {/* Ambient Glow Effects */}
      <div className="ambient-glow">
        <div className="glow-orb glow-1" />
        <div className="glow-orb glow-2" />
        <div className="glow-orb glow-3" />
      </div>
    </div>
  );
};

export default EchoesFutureReality;