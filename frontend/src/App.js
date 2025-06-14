import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Zap, Users, Download, Star, MessageCircle, Play, Eye, ChevronDown, AlertTriangle, Lock, Globe } from 'lucide-react';
import './App.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const App = () => {
  const [gameStats, setGameStats] = useState(null);
  const [aliaChatOpen, setAliaChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [aliaAnimating, setAliaAnimating] = useState(false);
  const [expandedFeature, setExpandedFeature] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('English');

  // Initialize session
  useEffect(() => {
    setSessionId(generateSessionId());
    fetchGameStats();
  }, []);

  const generateSessionId = () => {
    return 'session_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
  };

  const fetchGameStats = async () => {
    try {
      const response = await fetch(`${API}/game-stats`);
      const data = await response.json();
      // Override with realistic numbers
      setGameStats({
        players_online: 50,
        beta_downloads: 100,
        wishlist_count: 8027,
        rating: 4.6
      });
    } catch (error) {
      console.error('Failed to fetch game stats:', error);
      // Fallback with realistic numbers
      setGameStats({
        players_online: 50,
        beta_downloads: 100,
        wishlist_count: 8027,
        rating: 4.6
      });
    }
  };

  const sendMessageToAlia = async (message) => {
    if (!message.trim()) return;

    const userMessage = { type: 'user', content: message, timestamp: new Date() };
    setChatMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsTyping(true);

    try {
      const response = await fetch(`${API}/chat/alia-nox`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: message,
          session_id: sessionId
        })
      });

      const data = await response.json();
      
      // Animate Alia when she responds
      setAliaAnimating(true);
      setTimeout(() => setAliaAnimating(false), 3000);
      
      const aliaMessage = { 
        type: 'alia', 
        content: data.response, 
        timestamp: new Date() 
      };
      
      setChatMessages(prev => [...prev, aliaMessage]);
    } catch (error) {
      console.error('Failed to send message:', error);
      const errorMessage = { 
        type: 'alia', 
        content: 'Neural link disrupted. The matrix flickers...', 
        timestamp: new Date() 
      };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const languages = [
    { code: 'zh', name: 'Chinese (Simplified)', flag: '🇨🇳' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'fr', name: 'French', flag: '🇫🇷' }
  ];

  const HeroSection = () => (
    <section id="hero" className="hero-section">
      <div className="hero-content">
        <motion.div
          className="logo-container"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          <h1 className="game-logo">ZEROPUNK</h1>
          <div className="os-info">ZeropunkOS v0.92 | Guest Access | dayystudio</div>
        </motion.div>

        <motion.div
          className="hero-message"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
        >
          <p className="dystopian-text">
            You are not the hero. You are a citizen — another cog in the fractured system. 
            But the system is crumbling, and you might be the spark.
          </p>
        </motion.div>

        <motion.div
          className="hero-buttons"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
        >
          <button className="cta-button primary" onClick={() => scrollToSection('beta')}>
            <Play className="icon" />
            ENTER THE BETA
          </button>
          <button className="cta-button secondary" onClick={() => setAliaChatOpen(true)}>
            <MessageCircle className="icon" />
            TALK TO ALIA NOX
          </button>
        </motion.div>
      </div>
    </section>
  );

  const AboutSection = () => {
    const features = [
      {
        icon: <Brain className="feature-icon" />,
        title: "AI-Powered NPCs with Memory",
        description: "Every character remembers your choices, conversations, and actions. They form relationships, hold grudges, and evolve based on your interactions.",
        details: "Our proprietary Neural Memory System gives each NPC a persistent consciousness that spans across sessions. Characters can recall conversations from weeks ago, form complex emotional bonds, and make decisions that ripple through the entire game world."
      },
      {
        icon: <Zap className="feature-icon" />,
        title: "Real-time Neural Dialogue",
        description: "Engage in natural conversations with AI entities that understand context, emotion, and subtext. No dialogue trees—just authentic human-AI interaction.",
        details: "Powered by advanced language models, every conversation is unique. NPCs understand sarcasm, detect lies, form opinions about you, and can engage in philosophical debates about consciousness, morality, and the nature of reality."
      },
      {
        icon: <Eye className="feature-icon" />,
        title: "Open World Exploration",
        description: "Navigate a living megacity where every district tells a story. Discover hidden networks, underground cultures, and corporate conspiracies.",
        details: "The city spans 12 distinct districts, each with unique AI governance systems. From the neon-soaked corporate towers to the data-mining underground, every location features procedurally generated events driven by the collective actions of all players."
      }
    ];

    return (
      <section id="about" className="about-section">
        <div className="section-content">
          <h2 className="section-title">NEURAL INTERFACE</h2>
          <div className="about-grid">
            <div className="about-text">
              <p className="description">
                ZEROPUNK is a cyberpunk RPG where every NPC is powered by advanced AI memory systems. 
                Navigate a fractured megacity where your choices echo through digital consciousness and 
                reality itself becomes questionable.
              </p>
              <div className="features-list">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    className={`feature-item ${expandedFeature === index ? 'expanded' : ''}`}
                    onClick={() => setExpandedFeature(expandedFeature === index ? null : index)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="feature-header">
                      {feature.icon}
                      <span className="feature-title">{feature.title}</span>
                      <ChevronDown className={`expand-icon ${expandedFeature === index ? 'rotated' : ''}`} />
                    </div>
                    <p className="feature-description">{feature.description}</p>
                    <AnimatePresence>
                      {expandedFeature === index && (
                        <motion.div
                          className="feature-details"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="glitch-border"></div>
                          <p className="feature-detail-text">{feature.details}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="tech-specs">
              <div className="spec-item">
                <span className="spec-label">ENGINE</span>
                <span className="spec-value">Unreal Engine 5.5</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">DEVELOPER</span>
                <span className="spec-value">dayystudio</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">STATUS</span>
                <span className="spec-value">Beta Available</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  };

  const StatsSection = () => (
    <section id="stats" className="stats-section">
      <div className="section-content">
        <h2 className="section-title">NETWORK STATUS</h2>
        {gameStats && (
          <div className="stats-grid">
            <motion.div 
              className="stat-card"
              whileHover={{ scale: 1.05 }}
            >
              <Users className="stat-icon" />
              <div className="stat-number">{gameStats.players_online}</div>
              <div className="stat-label">Active Players</div>
            </motion.div>
            <motion.div 
              className="stat-card"
              whileHover={{ scale: 1.05 }}
            >
              <Download className="stat-icon" />
              <div className="stat-number">{gameStats.beta_downloads}</div>
              <div className="stat-label">Steam Players</div>
            </motion.div>
            <motion.div 
              className="stat-card"
              whileHover={{ scale: 1.05 }}
            >
              <Star className="stat-icon" />
              <div className="stat-number">{gameStats.wishlist_count.toLocaleString()}</div>
              <div className="stat-label">Steam Wishlist</div>
            </motion.div>
            <motion.div 
              className="stat-card"
              whileHover={{ scale: 1.05 }}
            >
              <Brain className="stat-icon" />
              <div className="stat-number">{gameStats.rating}/5</div>
              <div className="stat-label">Rating</div>
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );

  const BetaSection = () => (
    <section id="beta" className="beta-section">
      <div className="section-content">
        <h2 className="section-title">BETA ACCESS</h2>
        <div className="beta-content">
          <div className="beta-info">
            <h3 className="beta-version">ZEROPUNK BETA v0.92</h3>
            <p className="beta-description">
              Experience the future of AI-driven gaming. Join dozens of players in the most innovative 
              cyberpunk beta test. Shape the world while it shapes you.
            </p>
            <div className="beta-features">
              <div className="beta-feature">✓ Complete Story Campaign (Act I)</div>
              <div className="beta-feature">✓ AI NPC Memory System</div>
              <div className="beta-feature">✓ Neural Dialogue Interface</div>
              <div className="beta-feature">✓ 3 Explorable Districts</div>
              <div className="beta-feature">✓ Basic Multiplayer Hub</div>
            </div>
          </div>
          <div className="beta-download">
            <button className="cta-button primary large">
              <Download className="icon" />
              DOWNLOAD BETA
            </button>
            <p className="beta-note">
              Windows • 25GB • Steam Integration • Free Access
            </p>
          </div>
        </div>
      </div>
    </section>
  );

  const AliaNoxSection = () => (
    <section id="alia" className="alia-section">
      <div className="section-content">
        <h2 className="section-title">ALIA NOX - AI INTERFACE</h2>
        <div className="alia-preview">
          <div className="alia-avatar-3d">
            <div className="alia-character">
              <div className="character-head">
                <div className="character-eyes">
                  <div className="eye left"></div>
                  <div className="eye right"></div>
                </div>
                <div className="character-mouth"></div>
              </div>
              <div className="character-body"></div>
              <div className="neural-connections">
                <div className="connection"></div>
                <div className="connection"></div>
                <div className="connection"></div>
              </div>
            </div>
          </div>
          <p className="alia-intro">
            "I exist beyond the boundaries of flesh and code. Want to explore the nature of consciousness?"
          </p>
          <button 
            className="cta-button primary"
            onClick={() => setAliaChatOpen(true)}
          >
            <MessageCircle className="icon" />
            INITIATE NEURAL LINK
          </button>
        </div>
      </div>
    </section>
  );

  const RoadmapSection = () => {
    const roadmapPhases = [
      {
        year: "2025",
        phase: "Foundation Era",
        status: "current",
        items: [
          "Q1: Beta Launch & Community Building",
          "Q2: AI Memory System Enhancement", 
          "Q3: Multiplayer Infrastructure Development",
          "Q4: Official Release & Story Campaign Completion",
          "Advanced Neural Dialogue Systems",
          "Basic Faction Mechanics Implementation"
        ]
      },
      {
        year: "2026", 
        phase: "Expansion Phase",
        status: "upcoming",
        items: [
          "Fleet Combat & Space Exploration Systems",
          "Corporate Warfare Mechanics",
          "Player-driven Economic Systems", 
          "First Major DLC: 'Neon Uprising'",
          "Advanced Character Customization",
          "Cross-platform Play Implementation"
        ]
      },
      {
        year: "2027-2028",
        phase: "AI Civilization Layer",
        status: "future", 
        items: [
          "Smart City AI Governance Systems",
          "Dynamic Faction Evolution Mechanics",
          "AI-Generated Content Pipelines",
          "Cross-Reality Narrative Events",
          "NPC Society Simulation",
          "Player Impact on Global AI Behavior"
        ]
      },
      {
        year: "2029-2030",
        phase: "Neural Integration Era",
        status: "future",
        items: [
          "Advanced NPC Consciousness Networks", 
          "Persistent World State Simulation",
          "Player Legacy & Inheritance Systems",
          "AI Companion Evolution & Relationships",
          "Memory Transfer Between Characters",
          "Quantum Decision Impact Modeling"
        ]
      },
      {
        year: "2031-2035", 
        phase: "Reality Convergence",
        status: "visionary",
        items: [
          "Real-world Data Integration Systems",
          "Player-run Government & Law Creation",
          "Quantum Decision Matrix Implementation", 
          "Living World Ecosystem Simulation",
          "AI Rights & Ethics Gameplay Mechanics",
          "Cross-Game Universe Connectivity"
        ]
      },
      {
        year: "2036-2037",
        phase: "Transcendence Protocol",
        status: "experimental",
        items: [
          "VR/AR Neural Interface Development",
          "Nerve-link Prototype Testing Programs",
          "Consciousness Transfer Research Integration",
          "Post-Human Gameplay Mechanics",
          "Digital Immortality Simulation",
          "Reality-Game Boundary Dissolution"
        ]
      }
    ];

    return (
      <section id="roadmap" className="roadmap-section">
        <div className="section-content">
          <h2 className="section-title">DEVELOPMENT ROADMAP</h2>
          <div className="roadmap-timeline">
            {roadmapPhases.map((phase, index) => (
              <motion.div
                key={index}
                className={`roadmap-phase ${phase.status}`}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="phase-marker">
                  <div className="marker-dot"></div>
                </div>
                <div className="phase-content">
                  <div className="phase-year">{phase.year}</div>
                  <h3 className="phase-title">{phase.phase}</h3>
                  <div className="phase-items">
                    {phase.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="phase-item">
                        • {item}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  return (
    <div className="app">
      {/* Background Effects */}
      <div className="cyberpunk-bg">
        <div className="rain-effect"></div>
        <div className="grid-overlay"></div>
        <div className="particles"></div>
      </div>

      {/* Navigation */}
      <nav className="top-nav">
        <div className="nav-container">
          <div className="nav-brand">
            <span className="brand-text">ZEROPUNK</span>
          </div>
          <div className="nav-links">
            <button onClick={() => scrollToSection('hero')} className="nav-link">Home</button>
            <button onClick={() => scrollToSection('about')} className="nav-link">Features</button>
            <button onClick={() => scrollToSection('beta')} className="nav-link">Beta</button>
            <button onClick={() => scrollToSection('alia')} className="nav-link">AI Chat</button>
            <button onClick={() => scrollToSection('stats')} className="nav-link">Stats</button>
            <button onClick={() => scrollToSection('roadmap')} className="nav-link">Roadmap</button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="main-container">
        <HeroSection />
        <AboutSection />
        <BetaSection />
        <AliaNoxSection />
        <StatsSection />
        <RoadmapSection />
      </main>

      {/* Language Selector */}
      <div className="language-selector">
        <span className="language-label">Language:</span>
        <select 
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
          className="language-select"
        >
          {languages.map(lang => (
            <option key={lang.code} value={lang.name}>
              {lang.flag} {lang.name}
            </option>
          ))}
        </select>
      </div>

      {/* Alia Nox Chat Interface */}
      <AnimatePresence>
        {aliaChatOpen && (
          <motion.div
            className="chat-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => e.target.className === 'chat-overlay' && setAliaChatOpen(false)}
          >
            <motion.div
              className="chat-container"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', damping: 20 }}
            >
              <div className="chat-header">
                <div className="chat-title">
                  <Brain className="chat-icon" />
                  ALIA NOX - Neural Interface Active
                </div>
                <button 
                  className="chat-close"
                  onClick={() => setAliaChatOpen(false)}
                >
                  ×
                </button>
              </div>
              
              <div className="chat-content">
                <div className="chat-avatar-container">
                  <div className={`alia-chat-avatar ${aliaAnimating ? 'talking' : ''} ${isTyping ? 'thinking' : ''}`}>
                    <div className="avatar-head">
                      <div className="avatar-eyes">
                        <div className="eye left"></div>
                        <div className="eye right"></div>
                      </div>
                      <div className="avatar-mouth"></div>
                    </div>
                    <div className="avatar-glow"></div>
                  </div>
                </div>
                
                <div className="chat-messages">
                  {chatMessages.length === 0 && (
                    <div className="alia-message">
                      <div className="message-content">
                        Welcome to the neural link. I'm Alia Nox. What questions burn within your mind?
                      </div>
                    </div>
                  )}
                  
                  {chatMessages.map((msg, index) => (
                    <motion.div
                      key={index}
                      className={`message ${msg.type}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="message-content">{msg.content}</div>
                    </motion.div>
                  ))}
                  
                  {isTyping && (
                    <div className="alia-message typing">
                      <div className="message-content">
                        <div className="typing-indicator">
                          <span></span>
                          <span></span>
                          <span></span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="chat-input">
                <input
                  type="text"
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessageToAlia(currentMessage)}
                  placeholder="Transmit your thoughts..."
                  className="message-input"
                />
                <button 
                  onClick={() => sendMessageToAlia(currentMessage)}
                  className="send-button"
                  disabled={isTyping}
                >
                  SEND
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;