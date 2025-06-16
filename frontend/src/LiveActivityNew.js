import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, Clock, CloudRain, TrendingUp, Shield, Activity, 
  Coins, Terminal, AlertTriangle 
} from 'lucide-react';

const LiveActivitySection = ({ t, liveData: externalLiveData }) => {
  const [liveData, setLiveData] = useState(externalLiveData || {
    playerCount: 2847,
    currentTime: { hour: 14, minute: 23, period: 'Day Cycle' },
    weather: { condition: 'Neon Rain', intensity: 75, visibility: 85, temperature: 18 },
    market: { 
      status: 'VOLATILE', 
      volume: 2847329, 
      trend: 'rising',
      changePercent: 12.7
    },
    zones: [
      { name: 'Downtown Core', players: 847, activity: 'High', threat: 3, status: 'stable' },
      { name: 'Underground', players: 634, activity: 'Very High', threat: 8, status: 'caution' },
      { name: 'Corporate Sector', players: 512, activity: 'Medium', threat: 2, status: 'secure' },
      { name: 'Neon District', players: 389, activity: 'High', threat: 5, status: 'active' },
      { name: 'Industrial Zone', players: 287, activity: 'Low', threat: 4, status: 'quiet' },
      { name: 'Skyline Towers', players: 178, activity: 'Medium', threat: 1, status: 'elite' }
    ],
    factions: [
      { name: 'Neon Syndicate', control: 38, trend: 'rising', color: '#00FFFF' },
      { name: 'Shadow Corp', control: 32, trend: 'stable', color: '#FF0080' },
      { name: 'Free Runners', control: 22, trend: 'rising', color: '#80FF00' },
      { name: 'Neural Collective', control: 8, trend: 'falling', color: '#FFD700' }
    ],
    events: [
      { id: 1, type: 'raid', title: 'Corporate Raid', location: 'Sector 7-Alpha', participants: 89, status: 'active', time: '2m ago' },
      { id: 2, type: 'market', title: 'Resource Surge', location: 'Underground Market', change: '+24%', status: 'trending', time: '5m ago' },
      { id: 3, type: 'faction', title: 'Territory Dispute', location: 'Neon District', participants: 67, status: 'escalating', time: '8m ago' },
      { id: 4, type: 'weather', title: 'Acid Storm Warning', location: 'Industrial Zone', severity: 'moderate', status: 'incoming', time: '12m ago' }
    ],
    resources: [
      { name: 'Neural Chips', price: 2847, change: 18, trend: 'up', volume: '1.2M' },
      { name: 'Data Cores', price: 1523, change: -7, trend: 'down', volume: '850K' },
      { name: 'Quantum Bits', price: 3901, change: 31, trend: 'up', volume: '2.1M' },
      { name: 'Nano-Tech', price: 756, change: 5, trend: 'stable', volume: '500K' }
    ],
    networkStatus: {
      latency: 12,
      stability: 94,
      encryption: 'AES-256',
      threats: 3
    }
  });

  const [activeTab, setActiveTab] = useState('overview');

  // Update live data with smooth animations
  useEffect(() => {
    const updateLiveData = () => {
      setLiveData(prev => ({
        ...prev,
        playerCount: Math.max(2000, prev.playerCount + Math.floor(Math.random() * 20) - 10),
        currentTime: {
          ...prev.currentTime,
          minute: (prev.currentTime.minute + 1) % 60,
          hour: prev.currentTime.minute === 59 ? (prev.currentTime.hour + 1) % 24 : prev.currentTime.hour
        },
        weather: {
          ...prev.weather,
          intensity: Math.max(20, Math.min(100, prev.weather.intensity + Math.floor(Math.random() * 10) - 5)),
          visibility: Math.max(30, Math.min(100, prev.weather.visibility + Math.floor(Math.random() * 8) - 4))
        },
        market: {
          ...prev.market,
          volume: prev.market.volume + Math.floor(Math.random() * 50000) - 25000,
          changePercent: Math.max(-50, Math.min(50, prev.market.changePercent + (Math.random() * 2 - 1)))
        },
        zones: prev.zones.map(zone => ({
          ...zone,
          players: Math.max(50, zone.players + Math.floor(Math.random() * 20) - 10),
          threat: Math.max(1, Math.min(10, zone.threat + Math.floor(Math.random() * 2) - 1))
        })),
        resources: prev.resources.map(resource => ({
          ...resource,
          change: Math.max(-50, Math.min(50, resource.change + Math.floor(Math.random() * 6) - 3))
        }))
      }));
    };

    const interval = setInterval(updateLiveData, 3000);
    return () => clearInterval(interval);
  }, []);

  const getZoneStatusColor = (status) => {
    const colors = {
      stable: '#00FF88',
      caution: '#FFD700',
      secure: '#00BFFF',
      active: '#FF6B35',
      quiet: '#9B59B6',
      elite: '#E74C3C'
    };
    return colors[status] || '#FFFFFF';
  };

  const getThreatLevel = (threat) => {
    if (threat <= 3) return { level: 'LOW', color: '#00FF88' };
    if (threat <= 6) return { level: 'MEDIUM', color: '#FFD700' };
    if (threat <= 8) return { level: 'HIGH', color: '#FF8800' };
    return { level: 'CRITICAL', color: '#FF0040' };
  };

  const getEventIcon = (type) => {
    const icons = {
      raid: '⚔️',
      market: '📈',
      faction: '🏴',
      weather: '⛈️'
    };
    return icons[type] || '📡';
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <div className="section-container live-activity-section">
      <div className="section-content">
        {/* Header */}
        <motion.div 
          className="live-header"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="section-title">
            <span className="live-indicator">🔴</span>
            {t('live_world_title')}
            <span className="live-badge">LIVE</span>
          </h2>
          <div className="network-status">
            <span className="status-label">Network Status:</span>
            <span className="status-value online">ONLINE</span>
            <span className="ping">{liveData.networkStatus.latency}ms</span>
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div 
          className="live-tabs"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {['overview', 'zones', 'events', 'market'].map((tab) => (
            <button
              key={tab}
              className={`live-tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </motion.div>

        {/* Main Dashboard */}
        <div className="live-dashboard">
          {activeTab === 'overview' && (
            <motion.div 
              className="overview-grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {/* Key Stats Row */}
              <div className="stats-row">
                <div className="stat-card primary">
                  <div className="stat-header">
                    <Users className="stat-icon" size={24} />
                    <span className="stat-label">{t('players_online')}</span>
                  </div>
                  <div className="stat-value">
                    <span className="big-number">{liveData.playerCount.toLocaleString()}</span>
                    <div className="pulse-dot"></div>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-header">
                    <Clock className="stat-icon" size={24} />
                    <span className="stat-label">{t('game_time')}</span>
                  </div>
                  <div className="stat-value">
                    <span className="time-display">
                      {String(liveData.currentTime.hour).padStart(2, '0')}:
                      {String(liveData.currentTime.minute).padStart(2, '0')}
                    </span>
                    <span className="time-period">{liveData.currentTime.period}</span>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-header">
                    <CloudRain className="stat-icon" size={24} />
                    <span className="stat-label">{t('current_weather')}</span>
                  </div>
                  <div className="stat-value">
                    <span className="weather-condition">{liveData.weather.condition}</span>
                    <div className="weather-details">
                      <span>{liveData.weather.temperature}°C</span>
                      <span>{liveData.weather.visibility}% vis</span>
                    </div>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-header">
                    <TrendingUp className="stat-icon" size={24} />
                    <span className="stat-label">{t('market_status')}</span>
                  </div>
                  <div className="stat-value">
                    <span className={`market-status ${liveData.market.status.toLowerCase()}`}>
                      {liveData.market.status}
                    </span>
                    <span className={`market-change ${liveData.market.changePercent >= 0 ? 'positive' : 'negative'}`}>
                      {liveData.market.changePercent >= 0 ? '+' : ''}{liveData.market.changePercent.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Factions Control */}
              <div className="factions-panel">
                <h3 className="panel-title">
                  <Shield className="title-icon" size={20} />
                  {t('faction_control')}
                </h3>
                <div className="factions-grid">
                  {liveData.factions.map((faction, index) => (
                    <motion.div 
                      key={faction.name}
                      className="faction-card"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="faction-header">
                        <div 
                          className="faction-color"
                          style={{ backgroundColor: faction.color }}
                        ></div>
                        <span className="faction-name">{faction.name}</span>
                      </div>
                      <div className="faction-stats">
                        <span className="control-percent">{faction.control}%</span>
                        <div className="control-bar">
                          <div 
                            className="control-fill"
                            style={{ 
                              width: `${faction.control}%`,
                              backgroundColor: faction.color 
                            }}
                          ></div>
                        </div>
                        <span className={`trend ${faction.trend}`}>
                          {faction.trend === 'rising' ? '↗' : faction.trend === 'falling' ? '↘' : '→'}
                          {t(`trend_${faction.trend}`)}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'zones' && (
            <motion.div 
              className="zones-grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {liveData.zones.map((zone, index) => {
                const threatInfo = getThreatLevel(zone.threat);
                return (
                  <motion.div
                    key={zone.name}
                    className="zone-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="zone-header">
                      <h4 className="zone-name">{zone.name}</h4>
                      <div 
                        className="zone-status"
                        style={{ backgroundColor: getZoneStatusColor(zone.status) }}
                      >
                        {zone.status.toUpperCase()}
                      </div>
                    </div>
                    <div className="zone-stats">
                      <div className="zone-stat">
                        <span className="stat-label">Players</span>
                        <span className="stat-value">{zone.players}</span>
                      </div>
                      <div className="zone-stat">
                        <span className="stat-label">Activity</span>
                        <span className="stat-value">{zone.activity}</span>
                      </div>
                      <div className="zone-stat">
                        <span className="stat-label">Threat</span>
                        <span 
                          className="stat-value threat-level"
                          style={{ color: threatInfo.color }}
                        >
                          {threatInfo.level}
                        </span>
                      </div>
                    </div>
                    <div className="zone-visual">
                      <div className="activity-pulse"></div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}

          {activeTab === 'events' && (
            <motion.div 
              className="events-list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {liveData.events.map((event, index) => (
                <motion.div
                  key={event.id}
                  className={`event-card ${event.type}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="event-icon">
                    {getEventIcon(event.type)}
                  </div>
                  <div className="event-content">
                    <h4 className="event-title">{event.title}</h4>
                    <p className="event-location">{event.location}</p>
                    <div className="event-details">
                      {event.participants && (
                        <span className="event-participants">
                          {event.participants} participants
                        </span>
                      )}
                      {event.change && (
                        <span className="event-change">{event.change}</span>
                      )}
                      {event.severity && (
                        <span className={`event-severity ${event.severity}`}>
                          {event.severity.toUpperCase()}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="event-meta">
                    <span className={`event-status ${event.status}`}>
                      {event.status.toUpperCase()}
                    </span>
                    <span className="event-time">{event.time}</span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeTab === 'market' && (
            <motion.div 
              className="market-dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="market-header">
                <h3 className="market-title">
                  <Coins className="title-icon" size={24} />
                  Resource Exchange
                </h3>
                <div className="market-volume">
                  <span className="volume-label">24h Volume:</span>
                  <span className="volume-value">₦{formatNumber(liveData.market.volume)}</span>
                </div>
              </div>
              <div className="resources-grid">
                {liveData.resources.map((resource, index) => (
                  <motion.div
                    key={resource.name}
                    className="resource-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="resource-header">
                      <h4 className="resource-name">{resource.name}</h4>
                      <span className={`resource-trend ${resource.trend}`}>
                        {resource.trend === 'up' ? '↗' : resource.trend === 'down' ? '↘' : '→'}
                      </span>
                    </div>
                    <div className="resource-price">
                      <span className="price-value">₦{resource.price.toLocaleString()}</span>
                      <span className={`price-change ${resource.change >= 0 ? 'positive' : 'negative'}`}>
                        {resource.change >= 0 ? '+' : ''}{resource.change}%
                      </span>
                    </div>
                    <div className="resource-volume">
                      <span className="volume-label">Volume:</span>
                      <span className="volume-value">{resource.volume}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveActivitySection;