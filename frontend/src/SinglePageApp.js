import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Zap, Users, Download, Star, MessageCircle, Play, Eye, ChevronDown, AlertTriangle, Lock, Globe, Menu, X, Home, Info, BarChart3, Bot, Map, Gamepad2, Monitor, Cpu, HardDrive, Settings, Clock, CloudRain, TrendingUp, Shield, Coins, Activity, Languages, Mail, Send, Instagram, Music, UserCircle, Palette, Camera, Shuffle, RotateCcw, ZoomIn, ZoomOut, Move3D, Code, Terminal, Upload } from 'lucide-react';
import './App.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const SinglePageApp = () => {
  const [gameStats, setGameStats] = useState(null);
  const [aliaChatOpen, setAliaChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasInitialMessage, setHasInitialMessage] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const [backgroundParticles, setBackgroundParticles] = useState([]);
  const [rainDrops, setRainDrops] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [pcConfig, setPcConfig] = useState({
    cpu: '',
    gpu: '',
    ram: '',
    storage: ''
  });
  const [analysisResult, setAnalysisResult] = useState(null);
  const [liveData, setLiveData] = useState({
    onlinePlayers: 847239,
    downloads: 1234567,
    activeSessions: 52341,
    newUsers: 8924
  });
  
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [aliaNoxComments, setAliaNoxComments] = useState([]);

  // Translations
  const translations = {
    en: {
      home: 'Home',
      features: 'Features',
      wishlist_steam: 'Wishlist on Steam',
      character_customization: 'Character Customization',
      ai_chat: 'AI Chat',
      pc_requirements: 'PC Requirements',
      live_activity: 'Live Activity',
      game_stats: 'Game Stats',
      roadmap: 'Roadmap',
      contact: 'Contact',
      modding_hub: 'Modding Hub',
      language: 'Language',
      // Add more translations as needed
      neural_interface: 'Neural Interface',
      system_status: 'System Status',
      development_progress: 'Development in Progress'
    },
    fr: {
      home: 'Accueil',
      features: 'Fonctionnalités',
      wishlist_steam: 'Liste de souhaits Steam',
      character_customization: 'Personnalisation',
      ai_chat: 'Chat IA',
      pc_requirements: 'Configuration PC',
      live_activity: 'Activité en Direct',
      game_stats: 'Statistiques',
      roadmap: 'Feuille de Route',
      contact: 'Contact',
      modding_hub: 'Hub de Modding',
      language: 'Langue'
    },
    zh: {
      home: '首页',
      features: '功能',
      wishlist_steam: 'Steam愿望单',
      character_customization: '角色定制',
      ai_chat: 'AI聊天',
      pc_requirements: 'PC配置',
      live_activity: '实时活动',
      game_stats: '游戏统计',
      roadmap: '路线图',
      contact: '联系我们',
      modding_hub: '模组中心',
      language: '语言'
    }
  };

  const t = (key) => translations[currentLanguage]?.[key] || translations.en[key] || key;

  const menuItems = [
    { id: 'hero', label: t('home'), icon: <Home size={20} /> },
    { id: 'about', label: t('features'), icon: <Info size={20} /> },
    { id: 'beta', label: t('wishlist_steam'), icon: <Gamepad2 size={20} /> },
    { id: 'modding', label: t('modding_hub'), icon: <Code size={20} /> },
    { id: 'character', label: t('character_customization'), icon: <UserCircle size={20} /> },
    { id: 'alia', label: t('ai_chat'), icon: <Bot size={20} /> },
    { id: 'pc_requirements', label: t('pc_requirements'), icon: <Monitor size={20} /> },
    { id: 'live_activity', label: t('live_activity'), icon: <Globe size={20} /> },
    { id: 'stats', label: t('game_stats'), icon: <BarChart3 size={20} /> },
    { id: 'roadmap', label: t('roadmap'), icon: <Map size={20} /> },
    { id: 'contact', label: t('contact'), icon: <Mail size={20} /> },
    { id: 'language', label: t('language'), icon: <Languages size={20} />, isLanguageSelector: true }
  ];

  // Smooth scroll to section
  const scrollToSection = (sectionId) => {
    if (sectionId === 'language') {
      setLanguageMenuOpen(!languageMenuOpen);
      return;
    }
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
    setMenuOpen(false);
    setLanguageMenuOpen(false);
  };

  // Modding Hub Coming Soon Section
  const ModdingHubComingSoon = () => {
    const [scanlinePosition, setScanlinePosition] = useState(0);
    const [glitchActive, setGlitchActive] = useState(false);
    
    useEffect(() => {
      const scanlineInterval = setInterval(() => {
        setScanlinePosition(prev => (prev + 2) % 100);
      }, 50);
      
      const glitchInterval = setInterval(() => {
        setGlitchActive(true);
        setTimeout(() => setGlitchActive(false), 150);
      }, 4000 + Math.random() * 2000);
      
      return () => {
        clearInterval(scanlineInterval);
        clearInterval(glitchInterval);
      };
    }, []);

    return (
      <div className="section-container modding-coming-soon">
        <div className="section-content">
          <div className="coming-soon-frame">
            <div className="frame-corners">
              <div className="corner corner-tl"></div>
              <div className="corner corner-tr"></div>
              <div className="corner corner-bl"></div>
              <div className="corner corner-br"></div>
            </div>
            
            <div 
              className="scanlines-overlay" 
              style={{ transform: `translateY(${scanlinePosition}px)` }}
            ></div>
            
            <div className={`coming-soon-content ${glitchActive ? 'glitch-active' : ''}`}>
              <div className="status-bar">
                <div className="status-dot"></div>
                <span className="status-text">MODDING INTERFACE</span>
                <div className="status-dot"></div>
              </div>
              
              <motion.h1 
                className="coming-soon-title"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
              >
                MODDING HUB
                <span className="title-subtitle">Creator Central Station</span>
              </motion.h1>
              
              <motion.div 
                className="dev-status"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                <div className="status-icon">
                  <Code size={32} />
                </div>
                <div className="status-info">
                  <h3>Development in Progress</h3>
                  <p>Advanced creator tools and community features coming soon...</p>
                </div>
              </motion.div>
              
              <motion.div 
                className="features-preview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <h4>Incoming Features</h4>
                <div className="features-grid">
                  <div className="feature-item">
                    <Terminal size={20} />
                    <span>Modding Documentation</span>
                  </div>
                  <div className="feature-item">
                    <Palette size={20} />
                    <span>Skin Creator Tools</span>
                  </div>
                  <div className="feature-item">
                    <Upload size={20} />
                    <span>Community Upload Hub</span>
                  </div>
                  <div className="feature-item">
                    <Bot size={20} />
                    <span>AI Mod Assistant</span>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                className="progress-section"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.1 }}
              >
                <div className="progress-item">
                  <span className="progress-label">Development Progress</span>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: '65%' }}></div>
                  </div>
                  <span className="progress-percent">65%</span>
                </div>
              </motion.div>
              
              <motion.div 
                className="notify-signup"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.4 }}
              >
                <p>Get notified when the Creator Hub goes live</p>
                <div className="notify-form">
                  <input 
                    type="email" 
                    placeholder="your.email@zeropunk.net"
                    className="notify-input"
                  />
                  <button className="notify-btn">
                    <Zap size={16} />
                    SYNC
                  </button>
                </div>
              </motion.div>
            </div>
            
            <div className="holo-overlay"></div>
            <div className="data-stream"></div>
          </div>
        </div>
      </div>
    );
  };

  // Simple placeholder sections for demo
  const PlaceholderSection = ({ title, id }) => (
    <div className="section-container" id={id}>
      <div className="section-content">
        <h2 className="section-title">{title}</h2>
        <p>This section contains the {title} content.</p>
      </div>
    </div>
  );

  return (
    <div className="app">
      {/* Header with navigation */}
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <span className="logo-text">ZEROPUNK</span>
            <span className="logo-version">OS v0.92</span>
          </div>
          
          <button 
            className="menu-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div 
            className="menu-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="menu-content">
              <div className="menu-header">
                <div className="menu-logo">
                  <span>ZEROPUNK</span>
                  <span>Neural Network</span>
                </div>
                <button 
                  className="menu-close"
                  onClick={() => setMenuOpen(false)}
                >
                  <X size={24} />
                </button>
              </div>
              
              <nav className="menu-nav">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    className={`menu-item ${item.isLanguageSelector ? 'language-selector' : ''}`}
                    onClick={() => scrollToSection(item.id)}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content - All sections in single page */}
      <main className="main-content">
        <section id="hero">
          <PlaceholderSection title="ZEROPUNK - Welcome to the Future" id="hero" />
        </section>
        
        <section id="about">
          <PlaceholderSection title="Features & About" id="about" />
        </section>
        
        <section id="beta">
          <PlaceholderSection title="Wishlist on Steam" id="beta" />
        </section>
        
        <section id="modding">
          <ModdingHubComingSoon />
        </section>
        
        <section id="character">
          <PlaceholderSection title="Character Customization" id="character" />
        </section>
        
        <section id="alia">
          <PlaceholderSection title="AI Chat with Alia Nox" id="alia" />
        </section>
        
        <section id="pc_requirements">
          <PlaceholderSection title="PC Requirements" id="pc_requirements" />
        </section>
        
        <section id="live_activity">
          <PlaceholderSection title="Live Activity" id="live_activity" />
        </section>
        
        <section id="stats">
          <PlaceholderSection title="Game Statistics" id="stats" />
        </section>
        
        <section id="roadmap">
          <PlaceholderSection title="Development Roadmap" id="roadmap" />
        </section>
        
        <section id="contact">
          <PlaceholderSection title="Contact Us" id="contact" />
        </section>
      </main>

      {/* Background effects */}
      <div className="background-effects">
        <div className="rain-effect">
          {/* Rain drops */}
          {[...Array(50)].map((_, i) => (
            <div 
              key={i}
              className="rain-drop"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${0.5 + Math.random() * 1}s`
              }}
            />
          ))}
        </div>
        
        <div className="particle-field">
          {/* Floating particles */}
          {[...Array(30)].map((_, i) => (
            <div 
              key={i}
              className="particle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SinglePageApp;