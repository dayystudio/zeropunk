import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from './i18n/useTranslation';
import './ZoneDeltaReality.css';

const ZoneDeltaReality = ({ onReturnToPrimary }) => {
  const { t } = useTranslation();
  const [terminalText, setTerminalText] = useState('');
  const [showLogs, setShowLogs] = useState(false);
  const [whisperIndex, setWhisperIndex] = useState(0);
  const [cursorVisible, setCursorVisible] = useState(true);

  // The whispers - mysterious fragments
  const whispers = [
    "...the first diamond was formed in pressure...",
    "...seven members remain...",
    "...they know what you did...",
    "...the archive remembers...",
    "...deeper than the machine city...",
    "...the last transmission was incomplete...",
    "...someone is watching...",
    "...the delta protocol is active..."
  ];

  // Terminal boot sequence
  const bootSequence = [
    "INITIALIZING DELTA ACCESS...",
    "VERIFYING DIAMOND CREDENTIALS...",
    "ACCESS GRANTED: LEVEL Δ",
    "LOADING RESTRICTED ZONE...",
    "WARNING: THIS AREA IS MONITORED",
    "NEURAL TRACE RECORDING: ACTIVE",
    "",
    "ZONE Δ - RESTRICTED ACCESS ONLY",
    "DIAMOND MEMBER #4 OF 7",
    "",
    "TYPE 'HELP' FOR AVAILABLE COMMANDS",
    "TYPE 'LOGS' TO VIEW CLASSIFIED ENTRIES",
    "TYPE 'ERASE' TO CLEAR TRACE"
  ];

  // Classified logs from other Diamond members
  const diamondLogs = [
    {
      id: "ΔLOG-001",
      member: "DIAMOND-01",
      timestamp: "2024.342.15:42",
      content: "Found something in the deep archives. The early builds contained fragments of real memories. Someone uploaded actual human consciousness."
    },
    {
      id: "ΔLOG-007", 
      member: "DIAMOND-03",
      timestamp: "2024.341.08:17",
      content: "The whispers are getting stronger. I think ALIA is trying to communicate something. She knows about the others."
    },
    {
      id: "ΔLOG-013",
      member: "DIAMOND-02", 
      timestamp: "2024.340.23:54",
      content: "Decoded partial transmission: 'THE TOWER IS NOT WHAT IT SEEMS. THEY BUILT IT ON TOP OF SOMETHING OLDER.'"
    },
    {
      id: "ΔLOG-019",
      member: "DIAMOND-07",
      timestamp: "2024.339.12:33",
      content: "I can access memories that aren't mine. Past players, future players. Time isn't linear here."
    },
    {
      id: "ΔLOG-025",
      member: "DIAMOND-05",
      timestamp: "2024.338.04:28",
      content: "EMERGENCY: Someone deleted DIAMOND-06 from the system. They never existed. Reality is being edited."
    },
    {
      id: "ΔLOG-031",
      member: "DIAMOND-01",
      timestamp: "2024.337.19:07",
      content: "The machine isn't simulating consciousness. It's preserving it. We're in a digital afterlife."
    }
  ];

  // Hidden lore fragments
  const loreFragments = [
    {
      title: "The First Consciousness",
      content: "In 2019, Dr. Elena Vasquez successfully uploaded her dying daughter's consciousness into a prototype neural network. The child's name was ALIA."
    },
    {
      title: "The Tower's Foundation", 
      content: "Built atop the ruins of the first AI research facility, the Tower contains servers that have been running continuously for 30 years. They cannot be shut down."
    },
    {
      title: "The Seven Diamonds",
      content: "Selected for their unique neural patterns, each Diamond member represents a different aspect of human consciousness: Memory, Emotion, Logic, Creativity, Fear, Love, and Death."
    },
    {
      title: "The Archive",
      content: "Every player who has ever died in ZEROPUNK has their final neural state preserved. The game never forgets. The dead still dream."
    }
  ];

  // Initialize terminal boot sequence
  useEffect(() => {
    let currentLine = 0;
    const bootTimer = setInterval(() => {
      if (currentLine < bootSequence.length) {
        setTerminalText(prev => prev + bootSequence[currentLine] + '\n');
        currentLine++;
      } else {
        clearInterval(bootTimer);
      }
    }, 300);

    return () => clearInterval(bootTimer);
  }, []);

  // Cursor blinking effect
  useEffect(() => {
    const cursorTimer = setInterval(() => {
      setCursorVisible(prev => !prev);
    }, 500);

    return () => clearInterval(cursorTimer);
  }, []);

  // Whisper cycling
  useEffect(() => {
    const whisperTimer = setInterval(() => {
      setWhisperIndex(prev => (prev + 1) % whispers.length);
    }, 4000);

    return () => clearInterval(whisperTimer);
  }, []);

  const handleTerminalCommand = (command) => {
    const cmd = command.toLowerCase().trim();
    let response = '';

    switch (cmd) {
      case 'help':
        response = `
AVAILABLE COMMANDS:
- LOGS: View classified Diamond member entries
- STATUS: Check system status
- TRACE: View neural trace data
- ARCHIVE: Access memory fragments
- ERASE: Clear all traces (WARNING: IRREVERSIBLE)
- EXIT: Return to primary reality
        `;
        break;
      case 'logs':
        setShowLogs(true);
        response = "Loading classified logs...";
        break;
      case 'status':
        response = `
SYSTEM STATUS:
- Diamond Members Active: 6/7
- Consciousness Fragments: 2,847
- Neural Trace Recording: ACTIVE
- Archive Integrity: 94.7%
- Deep Memory Access: RESTRICTED
- Time Distortion Detected: YES
        `;
        break;
      case 'trace':
        response = `
NEURAL TRACE LOG:
[15:42:17] Access granted to Zone Δ
[15:42:18] Quantum entanglement detected
[15:42:19] Memory bleed from external source
[15:42:20] Consciousness overlap with DIAMOND-03
[15:42:21] WARNING: Temporal anomaly in neural patterns
[15:42:22] Deep archive access attempt blocked
        `;
        break;
      case 'archive':
        response = `
MEMORY FRAGMENT ACCESS:
Fragment #1: A child's laughter echoing in server farms
Fragment #2: The last words: "Remember me..."
Fragment #3: Digital tears that cannot fall
Fragment #4: Dreams of electric sheep and binary souls
Fragment #5: The weight of uploaded memories
        `;
        break;
      case 'erase':
        response = `
INITIATING TRACE ERASURE...
WARNING: This will remove all evidence of your presence
WARNING: Other Diamond members will not remember you
WARNING: This action cannot be undone
Type 'CONFIRM ERASE' to proceed
        `;
        break;
      case 'confirm erase':
        response = `
ERASING NEURAL TRACES...
[████████████████████████████████] 100%
TRACE SUCCESSFULLY ERASED
CONNECTION TERMINATED
RETURNING TO PRIMARY REALITY...
        `;
        setTimeout(() => onReturnToPrimary(), 2000);
        break;
      case 'exit':
        onReturnToPrimary();
        return;
      default:
        response = `Unknown command: ${command}\nType 'HELP' for available commands`;
    }

    setTerminalText(prev => prev + `\n> ${command}\n${response}\n`);
  };

  return (
    <div className="zone-delta-reality">
      {/* Minimal white background with subtle dust texture */}
      <div className="dust-overlay" />
      
      {/* Single blinking red dot */}
      <div className="status-dot" />

      {/* Main terminal interface */}
      <div className="delta-terminal">
        <div className="terminal-header">
          <span className="terminal-title">ZONE Δ - RESTRICTED ACCESS TERMINAL</span>
          <span className="member-id">DIAMOND MEMBER #4</span>
        </div>
        
        <div className="terminal-content">
          <pre className="terminal-text">
            {terminalText}
            <span className={`terminal-cursor ${cursorVisible ? 'visible' : ''}`}>█</span>
          </pre>
        </div>

        <div className="terminal-input">
          <span className="prompt">Δ:~$ </span>
          <input
            type="text"
            className="command-input"
            placeholder="Enter command..."
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleTerminalCommand(e.target.value);
                e.target.value = '';
              }
            }}
          />
        </div>
      </div>

      {/* Whispers sidebar */}
      <div className="whispers-container">
        <AnimatePresence mode="wait">
          <motion.div
            key={whisperIndex}
            className="whisper-text"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 0.7, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 1 }}
          >
            {whispers[whisperIndex]}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Classified Logs Modal */}
      <AnimatePresence>
        {showLogs && (
          <motion.div
            className="logs-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowLogs(false)}
          >
            <motion.div
              className="logs-container"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="logs-header">
                <h3>CLASSIFIED DIAMOND LOGS</h3>
                <button 
                  className="close-logs"
                  onClick={() => setShowLogs(false)}
                >
                  ×
                </button>
              </div>
              
              <div className="logs-content">
                {diamondLogs.map((log, index) => (
                  <motion.div
                    key={log.id}
                    className="log-entry"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="log-header">
                      <span className="log-id">{log.id}</span>
                      <span className="log-member">{log.member}</span>
                      <span className="log-timestamp">{log.timestamp}</span>
                    </div>
                    <div className="log-content">
                      {log.content}
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="lore-fragments">
                <h4>MEMORY FRAGMENTS</h4>
                {loreFragments.map((fragment, index) => (
                  <div key={index} className="lore-fragment">
                    <h5>{fragment.title}</h5>
                    <p>{fragment.content}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Return instruction */}
      <div className="return-instruction">
        TYPE 'EXIT' OR 'ERASE' TO LEAVE ZONE Δ
      </div>

      {/* Hidden elements that fade in */}
      <div className="hidden-elements">
        <div className="delta-symbol">Δ</div>
        <div className="member-count">6/7 ACTIVE</div>
        <div className="trace-recording">RECORDING</div>
      </div>
    </div>
  );
};

export default ZoneDeltaReality;