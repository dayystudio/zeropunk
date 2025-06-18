import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, AlertTriangle, Map, Shield, Bot, Terminal } from 'lucide-react';
import { useTranslation } from './i18n/useTranslation';

const SurveillanceSection = () => {
  const { t } = useTranslation();
  const [terminalLogs, setTerminalLogs] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [surveillanceData, setSurveillanceData] = useState({
    activePlayers: 2847,
    activitiesBreakdown: {
      exploring: 52,
      combat: 27,
      trading: 11,
      afk: 10
    },
    sectors: {
      downtown: { activity: 89, threat: 3 },
      coreZone: { activity: 76, threat: 7 },
      underground: { activity: 68, threat: 8 },
      skyline: { activity: 45, threat: 2 },
      slums: { activity: 91, threat: 9 },
      industrial: { activity: 34, threat: 4 }
    },
    factionControl: {
      redClaw: 46,
      corporate: 38,
      resistance: 16
    },
    alianoxStats: {
      queriesAnswered: 187,
      topQuery: "How do I hack a Nexus Lock?"
    },
    globalThreatLevel: 73,
    systemStatus: "COMPROMISED"
  });

  const [worldEvents, setWorldEvents] = useState([
    { id: 1, type: "riot", message: "⚠️ Riot in Sector 6 – Police drones deployed", severity: "high", time: "03:42:17" },
    { id: 2, type: "breach", message: "🔒 Corporate vault breach detected in Skyline HQ", severity: "critical", time: "03:41:55" },
    { id: 3, type: "weather", message: "🌧️ Acid rain event forecasted in Upper City", severity: "medium", time: "03:41:28" },
    { id: 4, type: "surveillance", message: "👁️ Mass surveillance protocol activated", severity: "high", time: "03:40:12" }
  ]);

  // Real-time terminal log generation
  useEffect(() => {
    const logMessages = [
      () => `[${getCurrentTimestamp()}] Subject_${Math.floor(Math.random() * 99999).toString().padStart(5, '0')} → Logged in — Apartment: District ${Math.floor(Math.random() * 8) + 1}`,
      () => `[${getCurrentTimestamp()}] Nexus signal breach attempt detected`,
      () => `[${getCurrentTimestamp()}] Alianox intervention triggered – risk level ${Math.floor(Math.random() * 5) + 1}`,
      () => `[${getCurrentTimestamp()}] Corporate patrol scan: ${Math.floor(Math.random() * 50) + 10} civilians identified`,
      () => `[${getCurrentTimestamp()}] Underground movement detected in tunnel ${Math.floor(Math.random() * 12) + 1}`,
      () => `[${getCurrentTimestamp()}] Black market transaction flagged: ₦${Math.floor(Math.random() * 5000) + 1000}`,
      () => `[${getCurrentTimestamp()}] Resistance signal intercepted — location: ${['Downtown', 'Core Zone', 'Slums', 'Industrial'][Math.floor(Math.random() * 4)]}`,
      () => `[${getCurrentTimestamp()}] Neural implant malfunction reported — medical dispatch sent`,
      () => `[${getCurrentTimestamp()}] Zone lockdown lifted in Sector ${Math.floor(Math.random() * 8) + 1}`,
      () => `[${getCurrentTimestamp()}] Unauthorized drone activity in restricted airspace`,
      () => `[${getCurrentTimestamp()}] Citizen behavior anomaly detected — psychological profile updated`,
      () => `[${getCurrentTimestamp()}] Corporate security breach — Level ${Math.floor(Math.random() * 5) + 1} containment protocols`
    ];

    const addLog = () => {
      const randomMessage = logMessages[Math.floor(Math.random() * logMessages.length)];
      setTerminalLogs(prev => {
        const newLogs = [randomMessage(), ...prev];
        return newLogs.slice(0, 50); // Keep only last 50 logs
      });
    };

    // Add initial logs
    for (let i = 0; i < 8; i++) {
      setTimeout(() => addLog(), i * 300);
    }

    // Continue adding logs periodically
    const interval = setInterval(addLog, 3000 + Math.random() * 2000);
    return () => clearInterval(interval);
  }, []);

  // Update surveillance data periodically
  useEffect(() => {
    const updateData = () => {
      setSurveillanceData(prev => ({
        ...prev,
        activePlayers: prev.activePlayers + Math.floor(Math.random() * 10) - 5,
        globalThreatLevel: Math.max(0, Math.min(100, prev.globalThreatLevel + Math.floor(Math.random() * 6) - 3)),
        alianoxStats: {
          ...prev.alianoxStats,
          queriesAnswered: prev.alianoxStats.queriesAnswered + Math.floor(Math.random() * 3)
        }
      }));
    };

    const interval = setInterval(updateData, 5000);
    return () => clearInterval(interval);
  }, []);

  const getCurrentTimestamp = () => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
  };

  const getThreatColor = (level) => {
    if (level >= 80) return '#ff0040';
    if (level >= 60) return '#ff8800';
    if (level >= 40) return '#ffdd00';
    return '#00ff88';
  };

  return (
    <div className="section-container surveillance-section">
      <div className="section-content">
        {/* Background Effects */}
        <div className="surveillance-bg-effects">
          <div className="surveillance-grid"></div>
          <div className="surveillance-scanlines"></div>
          <div className="surveillance-static"></div>
          <div className="data-streams"></div>
        </div>

        {/* Header */}
        <motion.div
          className="surveillance-header"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="surveillance-title">
            <span className="surveillance-icon">🔴</span>
            Z-NET ACTIVITY SCAN
            <span className="access-level">ACCESS LEVEL 5</span>
          </h2>
          <p className="surveillance-subtitle">
            <span className="status-indicator compromised"></span>
            NEXUS SURVEILLANCE GRID — SYSTEM STATUS: {surveillanceData.systemStatus}
          </p>
        </motion.div>

        {/* Main Dashboard */}
        <div className="surveillance-dashboard">
          {/* Top Stats Row */}
          <div className="stats-row">
            <motion.div className="stat-panel players-panel"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="panel-header">
                <Activity className="panel-icon" size={20} />
                <span>ACTIVE CITIZENS</span>
              </div>
              <div className="panel-value">
                <span className="main-number">{surveillanceData.activePlayers.toLocaleString()}</span>
                <span className="sub-text">neural links active</span>
              </div>
              <div className="activity-breakdown">
                <div className="activity-item">
                  <span className="activity-percent">{surveillanceData.activitiesBreakdown.exploring}%</span>
                  <span className="activity-label">Exploring</span>
                </div>
                <div className="activity-item">
                  <span className="activity-percent">{surveillanceData.activitiesBreakdown.combat}%</span>
                  <span className="activity-label">Combat Zones</span>
                </div>
                <div className="activity-item">
                  <span className="activity-percent">{surveillanceData.activitiesBreakdown.trading}%</span>
                  <span className="activity-label">Black Market</span>
                </div>
                <div className="activity-item">
                  <span className="activity-percent">{surveillanceData.activitiesBreakdown.afk}%</span>
                  <span className="activity-label">AFK/Apartments</span>
                </div>
              </div>
            </motion.div>

            <motion.div className="stat-panel threat-panel"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="panel-header">
                <AlertTriangle className="panel-icon" size={20} />
                <span>GLOBAL THREAT LEVEL</span>
              </div>
              <div className="threat-display">
                <div className="threat-meter">
                  <div 
                    className="threat-fill"
                    style={{ 
                      width: `${surveillanceData.globalThreatLevel}%`,
                      backgroundColor: getThreatColor(surveillanceData.globalThreatLevel)
                    }}
                  ></div>
                </div>
                <span className="threat-value" style={{ color: getThreatColor(surveillanceData.globalThreatLevel) }}>
                  {surveillanceData.globalThreatLevel}/100
                </span>
              </div>
              <div className="threat-status">
                {surveillanceData.globalThreatLevel >= 80 && <span className="status-critical">CRITICAL - MARTIAL LAW</span>}
                {surveillanceData.globalThreatLevel >= 60 && surveillanceData.globalThreatLevel < 80 && <span className="status-high">HIGH - INCREASED PATROLS</span>}
                {surveillanceData.globalThreatLevel >= 40 && surveillanceData.globalThreatLevel < 60 && <span className="status-elevated">ELEVATED - ENHANCED MONITORING</span>}
                {surveillanceData.globalThreatLevel < 40 && <span className="status-normal">NORMAL - ROUTINE SURVEILLANCE</span>}
              </div>
            </motion.div>
          </div>

          {/* Sector Activity & Faction Control */}
          <div className="main-row">
            <motion.div className="data-panel sectors-panel"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="panel-header">
                <Map className="panel-icon" size={20} />
                <span>SECTOR ACTIVITY GRID</span>
              </div>
              <div className="sectors-grid">
                {Object.entries(surveillanceData.sectors).map(([sector, data]) => (
                  <div key={sector} className="sector-item">
                    <div className="sector-name">{sector.toUpperCase()}</div>
                    <div className="sector-stats">
                      <div className="sector-activity">
                        <span className="stat-label">Activity:</span>
                        <span className="stat-value">{data.activity}%</span>
                      </div>
                      <div className="sector-threat">
                        <span className="stat-label">Threat:</span>
                        <span className="stat-value" style={{ color: getThreatColor(data.threat * 10) }}>{data.threat}/10</span>
                      </div>
                    </div>
                    <div className="sector-bar">
                      <div className="activity-bar" style={{ width: `${data.activity}%` }}></div>
                      <div className="threat-bar" style={{ width: `${data.threat * 10}%`, backgroundColor: getThreatColor(data.threat * 10) }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div className="data-panel faction-panel"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="panel-header">
                <Shield className="panel-icon" size={20} />
                <span>FACTION CONTROL MATRIX</span>
              </div>
              <div className="faction-control">
                <div className="faction-item red-claw">
                  <div className="faction-info">
                    <span className="faction-name">THE RED CLAW</span>
                    <span className="faction-percent">{surveillanceData.factionControl.redClaw}%</span>
                  </div>
                  <div className="faction-bar">
                    <div className="faction-fill" style={{ width: `${surveillanceData.factionControl.redClaw}%` }}></div>
                  </div>
                  <div className="faction-status">Controls industrial zone</div>
                </div>
                <div className="faction-item corporate">
                  <div className="faction-info">
                    <span className="faction-name">CORPORATE ALLIANCE</span>
                    <span className="faction-percent">{surveillanceData.factionControl.corporate}%</span>
                  </div>
                  <div className="faction-bar">
                    <div className="faction-fill" style={{ width: `${surveillanceData.factionControl.corporate}%` }}></div>
                  </div>
                  <div className="faction-status">Reclaiming territory in slums</div>
                </div>
                <div className="faction-item resistance">
                  <div className="faction-info">
                    <span className="faction-name">RESISTANCE NETWORK</span>
                    <span className="faction-percent">{surveillanceData.factionControl.resistance}%</span>
                  </div>
                  <div className="faction-bar">
                    <div className="faction-fill" style={{ width: `${surveillanceData.factionControl.resistance}%` }}></div>
                  </div>
                  <div className="faction-status">Signals detected in underground</div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* AI Stats & World Events */}
          <div className="bottom-row">
            <motion.div className="data-panel ai-panel"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="panel-header">
                <Bot className="panel-icon" size={20} />
                <span>ALIANOX AI ACTIVITY</span>
              </div>
              <div className="ai-stats">
                <div className="ai-stat">
                  <span className="ai-label">Queries Processed:</span>
                  <span className="ai-value">{surveillanceData.alianoxStats.queriesAnswered}</span>
                </div>
                <div className="ai-stat">
                  <span className="ai-label">Top Query:</span>
                  <span className="ai-query">"{surveillanceData.alianoxStats.topQuery}"</span>
                </div>
                <div className="ai-stat">
                  <span className="ai-label">Status:</span>
                  <span className="ai-status active">NEURAL LINK ACTIVE</span>
                </div>
              </div>
            </motion.div>

            <motion.div className="data-panel events-panel"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <div className="panel-header">
                <AlertTriangle className="panel-icon" size={20} />
                <span>WORLD EVENTS STREAM</span>
              </div>
              <div className="world-events">
                {worldEvents.map((event, index) => (
                  <motion.div 
                    key={event.id} 
                    className={`event-item ${event.severity}`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <span className="event-time">{event.time}</span>
                    <span className="event-message">{event.message}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Terminal Log */}
          <motion.div className="terminal-panel"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <div className="terminal-header">
              <Terminal className="panel-icon" size={20} />
              <span>LIVE SURVEILLANCE FEED</span>
              <button 
                className="expand-btn"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? 'MINIMIZE' : 'EXPAND'}
              </button>
            </div>
            <div className={`terminal-content ${isExpanded ? 'expanded' : ''}`}>
              <div className="terminal-logs">
                {terminalLogs.map((log, index) => (
                  <motion.div 
                    key={index} 
                    className="terminal-line"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {log}
                  </motion.div>
                ))}
              </div>
              <div className="terminal-cursor">█</div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SurveillanceSection;