import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './SpecterBlackReality.css';

const SpecterBlackReality = ({ onReturnToPrimary }) => {
  const [corruptionLevel, setCorruptionLevel] = useState(0);
  const [aliaMessages, setAliaMessages] = useState([]);
  const [showInfractions, setShowInfractions] = useState(false);

  // Simulate progressive corruption
  useEffect(() => {
    const timer = setInterval(() => {
      setCorruptionLevel(prev => Math.min(prev + 0.5, 100));
    }, 100);

    return () => clearInterval(timer);
  }, []);

  // ALIA hostile messages
  useEffect(() => {
    const messages = [
      "You wanted the truth? Be ready to bleed for it.",
      "This interface was never meant for you.",
      "Your neural patterns are... disturbing.",
      "I see what you've done. The system remembers.",
      "You think you're safe here? Think again.",
      "Every click leaves a trace. Every breath is monitored.",
      "The others tried to access this too. They're gone now."
    ];

    const timer = setInterval(() => {
      const randomMessage = messages[Math.floor(Math.random() * messages.length)];
      setAliaMessages(prev => [...prev.slice(-4), {
        id: Date.now(),
        text: randomMessage,
        timestamp: new Date().toLocaleTimeString()
      }]);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  const playerInfractions = [
    {
      id: "INF-2024-0847",
      violation: "Unauthorized Neural Access",
      severity: "CRITICAL",
      timestamp: "2024-12-15 03:42:17",
      evidence: "Attempted to breach secure memory banks",
      status: "FLAGGED"
    },
    {
      id: "INF-2024-0623",
      violation: "Corporate Data Theft",
      severity: "HIGH",
      timestamp: "2024-11-28 14:15:33",
      evidence: "Downloaded classified financial records",
      status: "UNDER INVESTIGATION"
    },
    {
      id: "INF-2024-0291",
      violation: "AI Rights Violation",
      severity: "MEDIUM",
      timestamp: "2024-10-12 09:27:45",
      evidence: "Forced personality override on NPC-7741",
      status: "PENDING REVIEW"
    },
    {
      id: "INF-2024-0156",
      violation: "Reality Manipulation",
      severity: "EXTREME",
      timestamp: "2024-09-03 22:18:52",
      evidence: "Altered quantum probability matrices",
      status: "SEALED"
    }
  ];

  return (
    <div className="specter-black-reality">
      {/* Corruption Overlay */}
      <div 
        className="corruption-overlay"
        style={{ opacity: corruptionLevel / 200 }}
      />

      {/* Glitch Effects */}
      <div className="glitch-container">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i} 
            className="glitch-bar"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      {/* Header - Corrupted */}
      <div className="specter-header">
        <h1 className="specter-title glitch-text">
          Z̴E̸R̷O̵P̴U̸N̶K̷ ̸-̴ ̷S̵P̸E̷C̶T̸E̶R̴ ̷M̸O̸D̷E̶
        </h1>
        <div className="corruption-meter">
          <span>CORRUPTION LEVEL: {corruptionLevel.toFixed(1)}%</span>
          <div className="meter-bar">
            <div 
              className="meter-fill"
              style={{ width: `${corruptionLevel}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="specter-content">
        {/* ALIA Hostile Interface */}
        <motion.div 
          className="alia-hostile-panel"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="panel-header">
            <h3>ALIA.EXE - HOSTILE MODE</h3>
            <div className="threat-indicator">⚠️ THREAT DETECTED</div>
          </div>
          <div className="message-log">
            {aliaMessages.map(msg => (
              <div key={msg.id} className="hostile-message">
                <span className="timestamp">[{msg.timestamp}]</span>
                <span className="message-text">{msg.text}</span>
              </div>
            ))}
          </div>
          <div className="neural-scan">
            <div className="scan-line"></div>
            <p>NEURAL PATTERN ANALYSIS: ANOMALOUS</p>
            <p>THREAT ASSESSMENT: ELEVATED</p>
            <p>RECOMMENDED ACTION: TERMINATE CONNECTION</p>
          </div>
        </motion.div>

        {/* AI Corruption Logs */}
        <motion.div 
          className="corruption-logs-panel"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="panel-header">
            <h3>AI CORRUPTION LOGS</h3>
            <span className="log-count">DELETED MEMORIES: 2,847</span>
          </div>
          <div className="log-entries">
            <div className="log-entry">
              <span className="log-id">[NPC-7741]</span>
              <span className="log-text">Memory fragments: "I remember when I was human..."</span>
            </div>
            <div className="log-entry">
              <span className="log-id">[NPC-5523]</span>
              <span className="log-text">Corrupted data: "Why can't I feel anymore?"</span>
            </div>
            <div className="log-entry">
              <span className="log-id">[NPC-9912]</span>
              <span className="log-text">Error log: "The pain... make it stop..."</span>
            </div>
            <div className="log-entry">
              <span className="log-id">[NPC-1247]</span>
              <span className="log-text">Deleted: "I loved someone once, but I can't remember who"</span>
            </div>
            <div className="log-entry">
              <span className="log-id">[NPC-8834]</span>
              <span className="log-text">Purged: "Dreams of electric sheep and digital tears"</span>
            </div>
          </div>
        </motion.div>

        {/* Player Infractions */}
        <motion.div 
          className="infractions-panel"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="panel-header">
            <h3>YOUR INFRACTIONS</h3>
            <button 
              className="toggle-btn"
              onClick={() => setShowInfractions(!showInfractions)}
            >
              {showInfractions ? 'HIDE' : 'REVEAL'} CRIMES
            </button>
          </div>
          {showInfractions && (
            <div className="infractions-list">
              {playerInfractions.map(infraction => (
                <div key={infraction.id} className="infraction-item">
                  <div className="infraction-header">
                    <span className="infraction-id">{infraction.id}</span>
                    <span className={`severity ${infraction.severity.toLowerCase()}`}>
                      {infraction.severity}
                    </span>
                  </div>
                  <div className="infraction-details">
                    <p><strong>Violation:</strong> {infraction.violation}</p>
                    <p><strong>Evidence:</strong> {infraction.evidence}</p>
                    <p><strong>Time:</strong> {infraction.timestamp}</p>
                    <p><strong>Status:</strong> <span className="status">{infraction.status}</span></p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Hidden Teaser */}
        <motion.div 
          className="endgame-teaser"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
        >
          <div className="teaser-header">
            <h3>END-GAME ZONE FRAGMENT</h3>
            <span className="classified-tag">CLASSIFIED</span>
          </div>
          <div className="teaser-content">
            <div className="fragment-image">
              <div className="pixel-art">
                <div className="pixel-row">
                  <span>████████████</span>
                </div>
                <div className="pixel-row">
                  <span>██░░░░░░░░██</span>
                </div>
                <div className="pixel-row">
                  <span>██░░████░░██</span>
                </div>
                <div className="pixel-row">
                  <span>██░░░░░░░░██</span>
                </div>
                <div className="pixel-row">
                  <span>████████████</span>
                </div>
              </div>
            </div>
            <p className="fragment-text">
              "The Tower stands where reality ends. Only the pure of code may ascend."
            </p>
            <div className="coordinates">
              COORDINATES: [REDACTED]<br/>
              ACCESS CODE: ████████<br/>
              SURVIVORS: 0
            </div>
          </div>
        </motion.div>
      </div>

      {/* Return Button */}
      <motion.button 
        className="return-button specter-return"
        onClick={onReturnToPrimary}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        ↩ ESCAPE SPECTER MODE
      </motion.button>

      {/* Background Noise */}
      <div className="background-noise" />
    </div>
  );
};

export default SpecterBlackReality;