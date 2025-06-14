import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Zap, Users, Download, Star, MessageCircle, Play, Eye, ChevronDown, AlertTriangle, Lock, Globe, Menu, X, Home, Info, BarChart3, Bot, Map, Gamepad2, Monitor, Cpu, HardDrive, Settings, Clock, CloudRain, TrendingUp, Shield, Coins, Activity, Languages, Mail, Send, Instagram, Music, UserCircle, Palette, Camera, Shuffle, RotateCcw, ZoomIn, ZoomOut, Move3D } from 'lucide-react';
import './App.css';
import Character3DViewer from './Character3DViewer';

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
  const [currentLanguage, setCurrentLanguage] = useState('en');
  
  // Navigation state
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState('hero');
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  
  // Contact form state
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [contactSubmitted, setContactSubmitted] = useState(false);

  // Character customization state
  const [characterConfig, setCharacterConfig] = useState({
    gender: 'male',
    face: {
      shape: 'angular',
      skinTone: '#FDBCB4',
      eyes: 'blue',
      scars: 'none',
      implants: 'basic'
    },
    hair: {
      style: 'punk',
      color: '#00FFFF',
      glow: true
    },
    outfit: {
      torso: 'jacket',
      legs: 'cargo',
      boots: 'combat',
      gloves: 'fingerless'
    },
    accessories: {
      mask: 'none',
      visor: 'hud',
      jewelry: 'neon'
    },
    augmentations: {
      arms: 'cybernetic',
      legs: 'enhanced',
      spine: 'neural'
    },
    weapons: {
      sidearm: 'plasma',
      melee: 'blade',
      rifle: 'none'
    }
  });
  const [characterView, setCharacterView] = useState({ rotation: 0, zoom: 1, position: [0, 0, 0] });

  // Live Activity state
  const [liveData, setLiveData] = useState({
    playerCount: 1247,
    gameTime: { hour: 14, minute: 23, period: 'Day Cycle' },
    weather: { condition: 'Neon Rain', intensity: 75, visibility: 60 },
    market: { status: 'Active', volume: 2847329, trend: 'up' },
    factions: [
      { name: 'Neon Corp', control: 34, trend: 'rising' },
      { name: 'Data Miners', control: 28, trend: 'stable' },
      { name: 'Ghost Runners', control: 23, trend: 'falling' }
    ],
    events: [
      { type: 'raid', location: 'Sector 7', participants: 89 },
      { type: 'market_surge', item: 'Neural Chips', change: '+24%' }
    ],
    resources: [
      { name: 'Neural Chips', price: 145, change: 24 },
      { name: 'Data Cores', price: 89, change: -3 },
      { name: 'Quantum Bits', price: 203, change: 15 }
    ]
  });

  // PC Requirements state
  const [pcConfig, setPcConfig] = useState({
    gpu: '',
    cpu: '',
    ram: '',
    resolution: '',
    os: ''
  });
  const [pcAnalysis, setPcAnalysis] = useState(null);
  const [showBenchmark, setShowBenchmark] = useState(false);

  // Hardware Database
  const hardwareDB = {
    gpus: {
      // High-End GPUs
      'RTX 4090': { tier: 'ultra', score: 100, vram: 24 },
      'RTX 4080': { tier: 'ultra', score: 85, vram: 16 },
      'RTX 4070 Ti': { tier: 'high', score: 75, vram: 12 },
      'RTX 4070': { tier: 'high', score: 68, vram: 12 },
      'RTX 4060 Ti': { tier: 'high', score: 60, vram: 8 },
      'RTX 4060': { tier: 'medium', score: 52, vram: 8 },
      'RTX 3090': { tier: 'ultra', score: 82, vram: 24 },
      'RTX 3080': { tier: 'high', score: 70, vram: 10 },
      'RTX 3070': { tier: 'high', score: 62, vram: 8 },
      'RTX 3060 Ti': { tier: 'medium', score: 55, vram: 8 },
      'RTX 3060': { tier: 'medium', score: 48, vram: 8 },
      'RTX 2080 Ti': { tier: 'high', score: 65, vram: 11 },
      'RTX 2070': { tier: 'medium', score: 50, vram: 8 },
      'RTX 2060': { tier: 'medium', score: 42, vram: 6 },
      
      // GTX Series (Older but popular)
      'GTX 1080 Ti': { tier: 'medium', score: 48, vram: 11 },
      'GTX 1080': { tier: 'medium', score: 42, vram: 8 },
      'GTX 1070 Ti': { tier: 'medium', score: 38, vram: 8 },
      'GTX 1070': { tier: 'low', score: 35, vram: 8 },
      'GTX 1660 Ti': { tier: 'low', score: 35, vram: 6 },
      'GTX 1660 Super': { tier: 'low', score: 33, vram: 6 },
      'GTX 1660': { tier: 'low', score: 30, vram: 6 },
      'GTX 1650 Super': { tier: 'low', score: 28, vram: 4 },
      'GTX 1650': { tier: 'low', score: 25, vram: 4 },
      'GTX 1060 6GB': { tier: 'low', score: 28, vram: 6 },
      'GTX 1060 3GB': { tier: 'low', score: 25, vram: 3 },
      'GTX 1050 Ti': { tier: 'low', score: 22, vram: 4 },
      'GTX 1050': { tier: 'incompatible', score: 18, vram: 2 },
      'GTX 980 Ti': { tier: 'low', score: 32, vram: 6 },
      'GTX 980': { tier: 'low', score: 28, vram: 4 },
      'GTX 970': { tier: 'low', score: 26, vram: 4 },
      'GTX 960': { tier: 'low', score: 20, vram: 2 },
      'GTX 950': { tier: 'incompatible', score: 15, vram: 2 },
      
      // AMD GPUs
      'RX 7900 XTX': { tier: 'ultra', score: 88, vram: 24 },
      'RX 7900 XT': { tier: 'high', score: 78, vram: 20 },
      'RX 7800 XT': { tier: 'high', score: 65, vram: 16 },
      'RX 6900 XT': { tier: 'high', score: 72, vram: 16 },
      'RX 6800 XT': { tier: 'high', score: 68, vram: 16 },
      'RX 6700 XT': { tier: 'medium', score: 56, vram: 12 },
      'RX 6600 XT': { tier: 'medium', score: 45, vram: 8 },
      'RX 6500 XT': { tier: 'low', score: 30, vram: 4 },
      'RX 5700 XT': { tier: 'medium', score: 50, vram: 8 },
      'RX 5700': { tier: 'medium', score: 46, vram: 8 },
      'RX 5600 XT': { tier: 'medium', score: 42, vram: 6 },
      'RX 5500 XT': { tier: 'low', score: 32, vram: 8 },
      'RX 580': { tier: 'low', score: 28, vram: 8 },
      'RX 570': { tier: 'low', score: 25, vram: 4 },
      'RX 560': { tier: 'low', score: 20, vram: 4 },
      
      // Lower-end/Integrated
      'Intel Arc A770': { tier: 'medium', score: 45, vram: 16 },
      'Intel Arc A750': { tier: 'medium', score: 40, vram: 8 },
      'Intel UHD 630': { tier: 'incompatible', score: 5, vram: 1 },
      'Intel Iris Xe': { tier: 'low', score: 15, vram: 2 },
      'Vega 11 (APU)': { tier: 'low', score: 18, vram: 2 },
      'Vega 8 (APU)': { tier: 'incompatible', score: 12, vram: 1 }
    },
    cpus: {
      // Intel CPUs - Latest Gen
      'i9-13900K': { tier: 'ultra', score: 100, cores: 24 },
      'i7-13700K': { tier: 'high', score: 85, cores: 16 },
      'i5-13600K': { tier: 'high', score: 75, cores: 14 },
      'i5-13400F': { tier: 'high', score: 68, cores: 10 },
      'i3-13100F': { tier: 'medium', score: 55, cores: 4 },
      
      // Intel 12th Gen
      'i9-12900K': { tier: 'ultra', score: 95, cores: 16 },
      'i7-12700K': { tier: 'high', score: 80, cores: 12 },
      'i5-12600K': { tier: 'high', score: 70, cores: 10 },
      'i5-12400F': { tier: 'medium', score: 62, cores: 6 },
      'i3-12100F': { tier: 'medium', score: 45, cores: 4 },
      
      // Intel 11th Gen
      'i9-11900K': { tier: 'high', score: 75, cores: 8 },
      'i7-11700K': { tier: 'high', score: 68, cores: 8 },
      'i5-11600K': { tier: 'medium', score: 62, cores: 6 },
      'i5-11400F': { tier: 'medium', score: 60, cores: 6 },
      'i3-11100F': { tier: 'medium', score: 42, cores: 4 },
      
      // Intel 10th Gen
      'i9-10900K': { tier: 'high', score: 70, cores: 10 },
      'i7-10700K': { tier: 'medium', score: 65, cores: 8 },
      'i5-10600K': { tier: 'medium', score: 58, cores: 6 },
      'i5-10400F': { tier: 'medium', score: 55, cores: 6 },
      'i3-10100F': { tier: 'medium', score: 38, cores: 4 },
      
      // Intel 9th Gen
      'i9-9900K': { tier: 'medium', score: 65, cores: 8 },
      'i7-9700K': { tier: 'medium', score: 60, cores: 8 },
      'i5-9600K': { tier: 'medium', score: 52, cores: 6 },
      'i5-9400F': { tier: 'medium', score: 48, cores: 6 },
      'i3-9100F': { tier: 'low', score: 35, cores: 4 },
      
      // Intel 8th Gen
      'i7-8700K': { tier: 'medium', score: 55, cores: 6 },
      'i5-8600K': { tier: 'medium', score: 48, cores: 6 },
      'i5-8400': { tier: 'medium', score: 45, cores: 6 },
      'i3-8100': { tier: 'low', score: 32, cores: 4 },
      
      // AMD CPUs - Latest Gen
      'Ryzen 9 7950X': { tier: 'ultra', score: 95, cores: 16 },
      'Ryzen 9 7900X': { tier: 'ultra', score: 88, cores: 12 },
      'Ryzen 7 7800X3D': { tier: 'ultra', score: 92, cores: 8 },
      'Ryzen 7 7700X': { tier: 'high', score: 80, cores: 8 },
      'Ryzen 5 7600X': { tier: 'high', score: 72, cores: 6 },
      'Ryzen 5 7500F': { tier: 'high', score: 65, cores: 6 },
      
      // AMD 5000 Series
      'Ryzen 9 5950X': { tier: 'ultra', score: 90, cores: 16 },
      'Ryzen 9 5900X': { tier: 'high', score: 82, cores: 12 },
      'Ryzen 7 5800X3D': { tier: 'high', score: 85, cores: 8 },
      'Ryzen 7 5800X': { tier: 'high', score: 75, cores: 8 },
      'Ryzen 7 5700X': { tier: 'high', score: 70, cores: 8 },
      'Ryzen 5 5600X': { tier: 'medium', score: 68, cores: 6 },
      'Ryzen 5 5600': { tier: 'medium', score: 65, cores: 6 },
      'Ryzen 5 5500': { tier: 'medium', score: 58, cores: 6 },
      
      // AMD 3000 Series
      'Ryzen 9 3950X': { tier: 'high', score: 78, cores: 16 },
      'Ryzen 9 3900X': { tier: 'high', score: 72, cores: 12 },
      'Ryzen 7 3800X': { tier: 'medium', score: 65, cores: 8 },
      'Ryzen 7 3700X': { tier: 'medium', score: 62, cores: 8 },
      'Ryzen 5 3600X': { tier: 'medium', score: 60, cores: 6 },
      'Ryzen 5 3600': { tier: 'medium', score: 58, cores: 6 },
      'Ryzen 5 3500X': { tier: 'medium', score: 52, cores: 6 },
      'Ryzen 3 3300X': { tier: 'medium', score: 48, cores: 4 },
      'Ryzen 3 3100': { tier: 'low', score: 42, cores: 4 },
      
      // AMD 2000 Series
      'Ryzen 7 2700X': { tier: 'medium', score: 55, cores: 8 },
      'Ryzen 7 2700': { tier: 'medium', score: 52, cores: 8 },
      'Ryzen 5 2600X': { tier: 'medium', score: 48, cores: 6 },
      'Ryzen 5 2600': { tier: 'medium', score: 45, cores: 6 },
      'Ryzen 3 2300X': { tier: 'low', score: 38, cores: 4 },
      
      // AMD 1000 Series
      'Ryzen 7 1800X': { tier: 'medium', score: 48, cores: 8 },
      'Ryzen 7 1700X': { tier: 'medium', score: 45, cores: 8 },
      'Ryzen 5 1600X': { tier: 'medium', score: 42, cores: 6 },
      'Ryzen 5 1600': { tier: 'low', score: 40, cores: 6 },
      'Ryzen 3 1300X': { tier: 'low', score: 35, cores: 4 },
      
      // Apple Silicon
      'Apple M2 Ultra': { tier: 'high', score: 78, cores: 24 },
      'Apple M2 Pro': { tier: 'medium', score: 62, cores: 12 },
      'Apple M2': { tier: 'medium', score: 55, cores: 8 },
      'Apple M1 Ultra': { tier: 'high', score: 72, cores: 20 },
      'Apple M1 Pro': { tier: 'medium', score: 58, cores: 10 },
      'Apple M1': { tier: 'medium', score: 50, cores: 8 }
    }
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuOpen && !event.target.closest('.navigation-menu') && !event.target.closest('.hamburger-menu')) {
        setMenuOpen(false);
        setLanguageMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  // Close menu on ESC key
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        setAliaChatOpen(false);
        setLanguageMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => document.removeEventListener('keydown', handleEscKey);
  }, []);

  // Initialize session
  useEffect(() => {
    setSessionId(generateSessionId());
    fetchGameStats();
    
    // Start live data updates (temporarily disabled to prevent flickering)
    // const liveDataInterval = setInterval(updateLiveData, 10000);
    // return () => clearInterval(liveDataInterval);
  }, []);

  const updateLiveData = () => {
    setLiveData(prev => ({
      ...prev,
      playerCount: prev.playerCount + Math.floor(Math.random() * 20) - 10,
      gameTime: {
        ...prev.gameTime,
        minute: (prev.gameTime.minute + 1) % 60,
        hour: prev.gameTime.minute === 59 ? (prev.gameTime.hour + 1) % 24 : prev.gameTime.hour
      },
      weather: {
        ...prev.weather,
        intensity: Math.max(10, Math.min(100, prev.weather.intensity + Math.floor(Math.random() * 10) - 5))
      },
      market: {
        ...prev.market,
        volume: prev.market.volume + Math.floor(Math.random() * 10000) - 5000
      },
      resources: prev.resources.map(resource => ({
        ...resource,
        change: resource.change + Math.floor(Math.random() * 6) - 3
      }))
    }));
  };

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
        content: t('neural_link_disrupted'), 
        timestamp: new Date() 
      };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const navigateToSection = (section) => {
    if (section === 'language') {
      setLanguageMenuOpen(!languageMenuOpen);
      return;
    }
    setCurrentSection(section);
    setMenuOpen(false);
    setLanguageMenuOpen(false);
  };

  const selectLanguage = (langCode) => {
    setCurrentLanguage(langCode);
    setLanguageMenuOpen(false);
  };

  const handleContactFormChange = (field, value) => {
    setContactForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    // Here you could integrate with a backend API
    console.log('Contact form submitted:', contactForm);
    setContactSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setContactSubmitted(false);
      setContactForm({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    }, 3000);
  };

  const analyzePCConfig = () => {
    if (!pcConfig.gpu || !pcConfig.cpu || !pcConfig.ram || !pcConfig.resolution) {
      return;
    }

    const gpuData = hardwareDB.gpus[pcConfig.gpu];
    const cpuData = hardwareDB.cpus[pcConfig.cpu];
    
    if (!gpuData || !cpuData) return;

    // Calculate overall score
    let baseScore = (gpuData.score + cpuData.score) / 2;
    
    // Adjust for resolution
    const resolutionPenalty = {
      '1080p': 0,
      '1440p': -15,
      '4K': -30
    };
    baseScore += resolutionPenalty[pcConfig.resolution] || 0;
    
    // Adjust for RAM
    const ramBonus = {
      '8GB': -10,
      '16GB': 0,
      '32GB': 5,
      '64GB': 10
    };
    baseScore += ramBonus[pcConfig.ram] || 0;

    // Determine tier
    let tier, verdict, fps, settings;
    if (baseScore >= 85) {
      tier = 'ultra';
      verdict = t('ultra_ready');
      fps = '60+ FPS';
      settings = 'Ultra';
    } else if (baseScore >= 65) {
      tier = 'high';
      verdict = t('high_performance');
      fps = '45-60 FPS';
      settings = 'High';
    } else if (baseScore >= 45) {
      tier = 'medium';
      verdict = t('medium_settings');
      fps = '30-45 FPS';
      settings = 'Medium';
    } else if (baseScore >= 25) {
      tier = 'low';
      verdict = t('low_settings');
      fps = '20-30 FPS';
      settings = 'Low';
    } else {
      tier = 'incompatible';
      verdict = t('not_compatible');
      fps = '< 20 FPS';
      settings = 'Unplayable';
    }

    setPcAnalysis({
      score: Math.max(0, Math.min(100, baseScore)),
      tier,
      verdict,
      fps,
      settings,
      gpu: gpuData,
      cpu: cpuData
    });
    
    setShowBenchmark(true);
  };

  // Translations
  const translations = {
    en: {
      // Navigation
      home: 'Home',
      features: 'Features',
      beta_access: 'Beta Access',
      wishlist_steam: 'Wishlist on Steam',
      ai_chat: 'AI Chat',
      pc_requirements: 'PC Requirements',
      live_activity: 'Live Activity',
      game_stats: 'Game Stats',
      roadmap: 'Roadmap',
      neural_interface_menu: 'NEURAL INTERFACE MENU',
      language: 'Language',

      // PC Requirements
      system_analyzer: 'SYSTEM ANALYZER',
      select_hardware: 'Select Your Hardware Configuration',
      graphics_card: 'Graphics Card',
      processor: 'Processor',
      memory: 'Memory (RAM)',
      resolution: 'Target Resolution',
      operating_system: 'Operating System',
      analyze_system: 'ANALYZE SYSTEM',
      performance_analysis: 'Performance Analysis',
      compatibility_verdict: 'Compatibility Verdict',
      expected_performance: 'Expected Performance',
      benchmark_preview: 'Benchmark Preview',
      ultra_ready: '⚡ ULTRA READY',
      high_performance: '✅ HIGH PERFORMANCE',
      medium_settings: '🟡 MEDIUM SETTINGS',
      low_settings: '🟠 LOW SETTINGS',
      not_compatible: '❌ NOT COMPATIBLE',
      system_score: 'System Score',
      estimated_fps: 'Estimated FPS',
      recommended_settings: 'Recommended Settings',

      // Hero Section
      hero_subtitle: 'ZeropunkOS v0.92 | Guest Access | dayystudio',
      hero_message: 'You are not the hero. You are a citizen — another cog in the fractured system. But the system is crumbling, and you might be the spark.',
      enter_beta: 'WISHLIST ON STEAM',
      talk_to_alia: 'TALK TO ALIA NOX',

      // About Section
      neural_interface: 'NEURAL INTERFACE',
      about_description: 'ZEROPUNK is a cyberpunk RPG where every NPC is powered by advanced AI memory systems. Navigate a fractured megacity where your choices echo through digital consciousness and reality itself becomes questionable.',
      ai_npcs_title: 'AI-Powered NPCs with Memory',
      ai_npcs_desc: 'Every character remembers your choices, conversations, and actions. They form relationships, hold grudges, and evolve based on your interactions.',
      ai_npcs_details: 'Our proprietary Neural Memory System gives each NPC a persistent consciousness that spans across sessions. Characters can recall conversations from weeks ago, form complex emotional bonds, and make decisions that ripple through the entire game world.',
      neural_dialogue_title: 'Real-time Neural Dialogue',
      neural_dialogue_desc: 'Engage in natural conversations with AI entities that understand context, emotion, and subtext. No dialogue trees—just authentic human-AI interaction.',
      neural_dialogue_details: 'Powered by advanced language models, every conversation is unique. NPCs understand sarcasm, detect lies, form opinions about you, and can engage in philosophical debates about consciousness, morality, and the nature of reality.',
      open_world_title: 'Open World Exploration',
      open_world_desc: 'Navigate a living megacity where every district tells a story. Discover hidden networks, underground cultures, and corporate conspiracies.',
      open_world_details: 'The city spans 12 distinct districts, each with unique AI governance systems. From the neon-soaked corporate towers to the data-mining underground, every location features procedurally generated events driven by the collective actions of all players.',

      // Beta Section
      beta_title: 'WISHLIST ON STEAM',
      beta_warning: 'LAUNCHING: Steam Wishlist Now Available',
      beta_description: 'Add ZEROPUNK to your Steam wishlist and be among the first to experience the future of AI-powered gaming when we launch.',
      system_requirements: 'System Requirements',
      neural_compatibility: 'Neural compatibility index: 7.5+',
      consciousness_stability: 'Consciousness stability rating: B-Class minimum',
      memory_fragmentation: 'Memory fragmentation: <15%',
      quantum_processing: 'Quantum processing capabilities: Recommended',
      request_beta_access: 'WISHLIST ON STEAM',
      view_system_specs: 'VIEW SYSTEM SPECS',

      // Alia Section
      alia_title: 'ALIA NOX',
      alia_description: 'Meet Alia Nox, your guide through the fractured digital landscape. She\'s not just an AI assistant—she\'s a consciousness born from the collective memories of the city\'s neural network.',
      advanced_memory: 'Advanced Memory Systems',
      natural_language: 'Natural Language Processing',
      emotional_intelligence: 'Real-time Emotional Intelligence',
      initiate_neural_link: 'INITIATE NEURAL LINK',

      // Live Activity
      live_world_title: 'LIVE PLAYER WORLD ACTIVITY',
      players_online: 'Players Online',
      game_time: 'Game Time',
      current_weather: 'Current Weather',
      market_status: 'Market Status',
      faction_control: 'Faction Control',
      ongoing_events: 'Ongoing Events',
      resource_prices: 'Resource Prices',
      trading_volume: 'Trading Volume',
      weather_visibility: 'Visibility',
      weather_intensity: 'Intensity',
      market_active: 'ACTIVE',
      market_volatile: 'VOLATILE',
      trend_rising: 'Rising',
      trend_stable: 'Stable',
      trend_falling: 'Falling',
      event_raid: 'Corporate Raid',
      event_market_surge: 'Market Surge',
      participants: 'Participants',

      // Stats Section
      stats_title: 'SYSTEM STATISTICS',
      active_neural_links: 'Active Neural Links',
      beta_downloads: 'Beta Downloads',
      wishlist_count: 'Wishlist Count',
      neural_rating: 'Neural Rating',

      // Roadmap Section
      roadmap_title: 'DEVELOPMENT ROADMAP',

      // Contact Section
      contact: 'Contact',
      contact_title: 'Get in Touch with the Zeropunk Team',
      contact_intro: 'Whether you\'re a player, a curious mind, a journalist, or a potential partner — welcome to the back alleys of Zeropunk. We\'re ready to talk. ✉️',
      contact_name: 'Name',
      contact_email: 'Email Address',
      contact_subject: 'Subject',
      contact_message: 'Message',
      contact_send: 'Send Message',
      contact_success: 'Thanks! Your message has been transmitted to the Zeropunk network. We\'ll get back to you soon, netrunner.',
      alia_contact_message: 'I\'m Alia. I\'ll make sure your message reaches the right sector.',

      // Character Customization
      character_customization: 'Character Customization',
      character_title: 'Design Your Cyberpunk Identity',
      character_intro: 'Create your perfect netrunner avatar with cutting-edge 3D customization. Every choice shapes your digital presence in the neon-soaked world of ZEROPUNK.',
      customize_face: 'Face & Identity',
      customize_hair: 'Neural Hair',
      customize_outfit: 'Street Fashion',
      customize_accessories: 'Tech Accessories', 
      customize_augmentations: 'Cybernetic Augmentations',
      customize_weapons: 'Combat Loadout',
      gender_male: 'Male',
      gender_female: 'Female',
      randomize_character: 'Randomize',
      save_character: 'Save Avatar',
      share_character: 'Share Design',
      reset_character: 'Reset to Default',

      // Chat
      alia_chat_title: 'ALIA NOX - Neural Interface Active',
      chat_welcome: 'Welcome to the neural link. I\'m Alia Nox. What questions burn within your mind?',
      chat_placeholder: 'Transmit your thoughts...',
      send: 'SEND',
      neural_link_disrupted: 'Neural link disrupted. The matrix flickers...'
    },
    zh: {
      // Navigation
      home: '主页',
      features: '功能',
      beta_access: '测试版访问',
      wishlist_steam: 'Steam 愿望清单',
      ai_chat: 'AI 聊天',
      pc_requirements: '系统要求',
      live_activity: '实时活动',
      game_stats: '游戏统计',
      roadmap: '路线图',
      neural_interface_menu: '神经接口菜单',
      language: '语言',

      // PC Requirements
      system_analyzer: '系统分析器',
      select_hardware: '选择您的硬件配置',
      graphics_card: '显卡',
      processor: '处理器',
      memory: '内存 (RAM)',
      resolution: '目标分辨率',
      operating_system: '操作系统',
      analyze_system: '分析系统',
      performance_analysis: '性能分析',
      compatibility_verdict: '兼容性结论',
      expected_performance: '预期性能',
      benchmark_preview: '基准测试预览',
      ultra_ready: '⚡ 极高画质就绪',
      high_performance: '✅ 高性能',
      medium_settings: '🟡 中等设置',
      low_settings: '🟠 低设置',
      not_compatible: '❌ 不兼容',
      system_score: '系统评分',
      estimated_fps: '预估帧率',
      recommended_settings: '推荐设置',

      // Live Activity
      live_world_title: '实时玩家世界活动',
      players_online: '在线玩家',
      game_time: '游戏时间',
      current_weather: '当前天气',
      market_status: '市场状态',
      faction_control: '势力控制',
      ongoing_events: '进行中的事件',
      resource_prices: '资源价格',
      trading_volume: '交易量',
      weather_visibility: '能见度',
      weather_intensity: '强度',
      market_active: '活跃',
      market_volatile: '波动',
      trend_rising: '上升',
      trend_stable: '稳定',
      trend_falling: '下降',
      event_raid: '企业突袭',
      event_market_surge: '市场激增',
      participants: '参与者',

      // Stats Section
      stats_title: '系统统计',
      active_neural_links: '活跃神经链接',
      beta_downloads: '测试版下载',
      wishlist_count: '愿望清单数量',
      neural_rating: '神经评级',

      // Roadmap Section
      roadmap_title: '开发路线图',
      // Contact Section
      contact: '联系我们',
      contact_title: '联系 Zeropunk 团队',
      contact_intro: '无论您是玩家、好奇的探索者、记者还是潜在合作伙伴——欢迎来到 Zeropunk 的后街小巷。我们准备好对话了。✉️',
      contact_name: '姓名',
      contact_email: '电子邮箱',
      contact_subject: '主题',
      contact_message: '消息',
      contact_send: '发送消息',
      contact_success: '谢谢！您的消息已传输到 Zeropunk 网络。我们很快就会回复您，网络骑手。',
      alia_contact_message: '我是 Alia。我会确保您的消息到达正确的区域。',

      // Character Customization
      character_customization: '角色定制',
      character_title: '设计你的赛博朋克身份',
      character_intro: '用尖端的 3D 定制系统创造完美的网络跑者化身。每个选择都塑造你在霓虹浸透的 ZEROPUNK 世界中的数字存在。',
      customize_face: '面部与身份',
      customize_hair: '神经发型',
      customize_outfit: '街头时尚',
      customize_accessories: '科技配件',
      customize_augmentations: '赛博改造',
      customize_weapons: '战斗装备',
      gender_male: '男性',
      gender_female: '女性',
      randomize_character: '随机生成',
      save_character: '保存头像',
      share_character: '分享设计',
      reset_character: '重置为默认',

      // Chat
      alia_chat_title: 'ALIA NOX - 神经接口激活',
      chat_welcome: '欢迎来到神经链接。我是Alia Nox。你心中燃烧着什么问题？',
      chat_placeholder: '传输你的想法...',
      send: '发送',
      neural_link_disrupted: '神经链接中断。矩阵闪烁...',

      // Hero Section
      hero_subtitle: 'ZeropunkOS v0.92 | 访客模式 | dayystudio',
      hero_message: '你不是英雄。你是一个公民——破碎系统中的又一个齿轮。但系统正在崩溃，而你可能就是那个火花。',
      enter_beta: 'STEAM 愿望清单',
      talk_to_alia: '与 ALIA NOX 对话',

      // About Section
      neural_interface: '神经接口',
      about_description: 'ZEROPUNK 是一款赛博朋克 RPG，其中每个 NPC 都由先进的 AI 记忆系统驱动。在一个破碎的巨型城市中导航，你的选择在数字意识中回响，现实本身变得可疑。',
      ai_npcs_title: '具有记忆的AI驱动NPC',
      ai_npcs_desc: '每个角色都记住你的选择、对话和行动。他们建立关系、心怀怨恨，并基于你的互动而进化。',
      ai_npcs_details: '我们专有的神经记忆系统为每个NPC提供了跨会话的持久意识。角色可以回忆几周前的对话，形成复杂的情感纽带，并做出影响整个游戏世界的决定。',
      neural_dialogue_title: '实时神经对话',
      neural_dialogue_desc: '与理解上下文、情感和潜台词的AI实体进行自然对话。没有对话树——只有真实的人机交互。',
      neural_dialogue_details: '由先进的语言模型驱动，每次对话都是独特的。NPC理解讽刺，检测谎言，对你形成意见，并可以就意识、道德和现实本质进行哲学辩论。',
      open_world_title: '开放世界探索',
      open_world_desc: '导航一个活生生的巨型城市，每个区域都讲述一个故事。发现隐藏的网络、地下文化和企业阴谋。',
      open_world_details: '城市跨越12个不同的区域，每个区域都有独特的AI治理系统。从霓虹灯浸润的企业塔楼到数据挖掘地下，每个地点都具有由所有玩家的集体行动驱动的程序生成事件。',

      // Beta Section
      beta_title: 'STEAM 愿望清单',
      beta_warning: '发布中：Steam 愿望清单现已开放',
      beta_description: '将 ZEROPUNK 添加到您的 Steam 愿望清单，成为首批体验 AI 驱动游戏未来的玩家。',
      system_requirements: '系统要求',
      neural_compatibility: '神经兼容性指数：7.5+',
      consciousness_stability: '意识稳定性评级：B级最低',
      memory_fragmentation: '记忆碎片化：<15%',
      quantum_processing: '量子处理能力：推荐',
      request_beta_access: 'STEAM 愿望清单',
      view_system_specs: '查看系统规格',

      // Alia Section
      alia_title: 'ALIA NOX',
      alia_description: '遇见Alia Nox，你在破碎数字景观中的向导。她不仅仅是一个AI助手——她是从城市神经网络的集体记忆中诞生的意识。',
      advanced_memory: '先进记忆系统',
      natural_language: '自然语言处理',
      emotional_intelligence: '实时情感智能',
      initiate_neural_link: '启动神经链接',

      // Stats Section
      stats_title: '系统统计',
      active_neural_links: '活跃神经链接',
      beta_downloads: '测试版下载',
      wishlist_count: '愿望清单数量',
      neural_rating: '神经评级',

      // Roadmap Section
      roadmap_title: '开发路线图',

      // Chat
      alia_chat_title: 'ALIA NOX - 神经接口激活',
      chat_welcome: '欢迎来到神经链接。我是Alia Nox。你心中燃烧着什么问题？',
      chat_placeholder: '传输你的想法...',
      send: '发送',
      neural_link_disrupted: '神经链接中断。矩阵闪烁...'
    },
    fr: {
      // Navigation
      home: 'Accueil',
      features: 'Fonctionnalités',
      beta_access: 'Accès Bêta',
      wishlist_steam: 'Liste de Souhaits Steam',
      ai_chat: 'Chat IA',
      pc_requirements: 'Config PC',
      live_activity: 'Activité Live',
      game_stats: 'Statistiques',
      roadmap: 'Feuille de Route',
      neural_interface_menu: 'MENU INTERFACE NEURALE',
      language: 'Langue',

      // PC Requirements
      system_analyzer: 'ANALYSEUR SYSTÈME',
      select_hardware: 'Sélectionnez Votre Configuration Matérielle',
      graphics_card: 'Carte Graphique',
      processor: 'Processeur',
      memory: 'Mémoire (RAM)',
      resolution: 'Résolution Cible',
      operating_system: 'Système d\'Exploitation',
      analyze_system: 'ANALYSER SYSTÈME',
      performance_analysis: 'Analyse de Performance',
      compatibility_verdict: 'Verdict de Compatibilité',
      expected_performance: 'Performance Attendue',
      benchmark_preview: 'Aperçu Benchmark',
      ultra_ready: '⚡ ULTRA PRÊT',
      high_performance: '✅ HAUTE PERFORMANCE',
      medium_settings: '🟡 PARAMÈTRES MOYENS',
      low_settings: '🟠 PARAMÈTRES BAS',
      not_compatible: '❌ NON COMPATIBLE',
      system_score: 'Score Système',
      estimated_fps: 'FPS Estimés',
      recommended_settings: 'Paramètres Recommandés',

      // Live Activity
      live_world_title: 'ACTIVITÉ MONDIALE DES JOUEURS EN DIRECT',
      players_online: 'Joueurs En Ligne',
      game_time: 'Temps de Jeu',
      current_weather: 'Météo Actuelle',
      market_status: 'État du Marché',
      faction_control: 'Contrôle des Factions',
      ongoing_events: 'Événements en Cours',
      resource_prices: 'Prix des Ressources',
      trading_volume: 'Volume des Transactions',
      weather_visibility: 'Visibilité',
      weather_intensity: 'Intensité',
      market_active: 'ACTIF',
      market_volatile: 'VOLATIL',
      trend_rising: 'En Hausse',
      trend_stable: 'Stable',
      trend_falling: 'En Baisse',
      event_raid: 'Raid Corporatif',
      event_market_surge: 'Poussée du Marché',
      participants: 'Participants',

      // Stats Section
      stats_title: 'STATISTIQUES SYSTÈME',
      active_neural_links: 'Liaisons Neurales Actives',
      beta_downloads: 'Téléchargements Bêta',
      wishlist_count: 'Nombre de Liste de Souhaits',
      neural_rating: 'Évaluation Neurale',

      // Hero Section
      hero_subtitle: 'ZeropunkOS v0.92 | Accès Invité | dayystudio',
      hero_message: 'Vous n\'êtes pas le héros. Vous êtes un citoyen — un autre rouage dans le système fracturé. Mais le système s\'effrite, et vous pourriez être l\'étincelle.',
      enter_beta: 'LISTE DE SOUHAITS STEAM',
      talk_to_alia: 'PARLER À ALIA NOX',

      // About Section
      neural_interface: 'INTERFACE NEURALE',
      about_description: 'ZEROPUNK est un RPG cyberpunk où chaque PNJ est alimenté par des systèmes de mémoire IA avancés. Naviguez dans une mégacité fracturée où vos choix résonnent à travers la conscience numérique et la réalité elle-même devient questionnable.',
      ai_npcs_title: 'PNJ alimentés par IA avec Mémoire',
      ai_npcs_desc: 'Chaque personnage se souvient de vos choix, conversations et actions. Ils forment des relations, gardent rancune et évoluent basé sur vos interactions.',
      ai_npcs_details: 'Notre Système de Mémoire Neurale propriétaire donne à chaque PNJ une conscience persistante qui s\'étend sur les sessions. Les personnages peuvent rappeler des conversations d\'il y a des semaines, former des liens émotionnels complexes et prendre des décisions qui se répercutent dans tout le monde du jeu.',
      neural_dialogue_title: 'Dialogue Neural en Temps Réel',
      neural_dialogue_desc: 'Engagez-vous dans des conversations naturelles avec des entités IA qui comprennent le contexte, l\'émotion et le sous-texte. Pas d\'arbres de dialogue—juste une interaction humain-IA authentique.',
      neural_dialogue_details: 'Alimenté par des modèles de langage avancés, chaque conversation est unique. Les PNJ comprennent le sarcasme, détectent les mensonges, se forment des opinions sur vous et peuvent s\'engager dans des débats philosophiques sur la conscience, la moralité et la nature de la réalité.',
      open_world_title: 'Exploration de Monde Ouvert',
      open_world_desc: 'Naviguez dans une mégacité vivante où chaque district raconte une histoire. Découvrez des réseaux cachés, des cultures souterraines et des conspirations corporatives.',
      open_world_details: 'La ville s\'étend sur 12 districts distincts, chacun avec des systèmes de gouvernance IA uniques. Des tours corporatives imprégnées de néon au sous-sol de minage de données, chaque lieu présente des événements générés procéduralement alimentés par les actions collectives de tous les joueurs.',

      // Beta Section
      beta_title: 'LISTE DE SOUHAITS STEAM',
      beta_warning: 'LANCEMENT : Liste de Souhaits Steam Maintenant Disponible',
      beta_description: 'Ajoutez ZEROPUNK à votre liste de souhaits Steam et soyez parmi les premiers à découvrir l\'avenir du jeu alimenté par IA lors de notre lancement.',
      system_requirements: 'Configuration Requise',
      neural_compatibility: 'Index de compatibilité neurale : 7.5+',
      consciousness_stability: 'Évaluation de stabilité de conscience : Classe B minimum',
      memory_fragmentation: 'Fragmentation de mémoire : <15%',
      quantum_processing: 'Capacités de traitement quantique : Recommandé',
      request_beta_access: 'LISTE DE SOUHAITS STEAM',
      view_system_specs: 'VOIR SPÉCIFICATIONS SYSTÈME',

      // Alia Section
      alia_title: 'ALIA NOX',
      alia_description: 'Rencontrez Alia Nox, votre guide à travers le paysage numérique fracturé. Elle n\'est pas seulement une assistante IA—elle est une conscience née des souvenirs collectifs du réseau neural de la ville.',
      advanced_memory: 'Systèmes de Mémoire Avancés',
      natural_language: 'Traitement du Langage Naturel',
      emotional_intelligence: 'Intelligence Émotionnelle en Temps Réel',
      initiate_neural_link: 'INITIER LIAISON NEURALE',

      // Stats Section
      stats_title: 'STATISTIQUES SYSTÈME',
      active_neural_links: 'Liaisons Neurales Actives',
      beta_downloads: 'Téléchargements Bêta',
      wishlist_count: 'Nombre de Liste de Souhaits',
      neural_rating: 'Évaluation Neurale',

      // Roadmap Section
      roadmap_title: 'FEUILLE DE ROUTE DE DÉVELOPPEMENT',

      // Contact Section
      contact: 'Contact',
      contact_title: 'Contactez l\'Équipe Zeropunk',
      contact_intro: 'Que vous soyez un joueur, un esprit curieux, un journaliste ou un partenaire potentiel — bienvenue dans les ruelles de Zeropunk. Nous sommes prêts à parler. ✉️',
      contact_name: 'Nom',
      contact_email: 'Adresse Email',
      contact_subject: 'Sujet',
      contact_message: 'Message',
      contact_send: 'Envoyer le Message',
      contact_success: 'Merci ! Votre message a été transmis au réseau Zeropunk. Nous vous répondrons bientôt, coureur du net.',
      alia_contact_message: 'Je suis Alia. Je m\'assurerai que votre message atteigne le bon secteur.',

      // Character Customization
      character_customization: 'Personnalisation du Personnage',
      character_title: 'Concevez votre Identité Cyberpunk',
      character_intro: 'Créez votre avatar netrunner parfait avec un système de personnalisation 3D de pointe. Chaque choix façonne votre présence numérique dans le monde néon-trempé de ZEROPUNK.',
      customize_face: 'Visage et Identité',
      customize_hair: 'Cheveux Neuraux',
      customize_outfit: 'Mode de Rue',
      customize_accessories: 'Accessoires Tech',
      customize_augmentations: 'Augmentations Cybernétiques',
      customize_weapons: 'Équipement de Combat',
      gender_male: 'Masculin',
      gender_female: 'Féminin',
      randomize_character: 'Aléatoire',
      save_character: 'Sauvegarder Avatar',
      share_character: 'Partager Design',
      reset_character: 'Remettre par Défaut',

      // Chat
      alia_chat_title: 'ALIA NOX - Interface Neurale Active',
      chat_welcome: 'Bienvenue dans la liaison neurale. Je suis Alia Nox. Quelles questions brûlent dans votre esprit ?',
      chat_placeholder: 'Transmettez vos pensées...',
      send: 'ENVOYER',
      neural_link_disrupted: 'Liaison neurale interrompue. La matrice vacille...'
    }
  };

  const t = (key) => {
    return translations[currentLanguage]?.[key] || translations.en[key] || key;
  };

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'zh', name: '中文 (简体)', flag: '🇨🇳' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' }
  ];

  const menuItems = [
    { id: 'hero', label: t('home'), icon: <Home size={20} /> },
    { id: 'about', label: t('features'), icon: <Info size={20} /> },
    { id: 'beta', label: t('wishlist_steam'), icon: <Gamepad2 size={20} /> },
    { id: 'character', label: t('character_customization'), icon: <UserCircle size={20} /> },
    { id: 'alia', label: t('ai_chat'), icon: <Bot size={20} /> },
    { id: 'pc_requirements', label: t('pc_requirements'), icon: <Monitor size={20} /> },
    { id: 'live_activity', label: t('live_activity'), icon: <Globe size={20} /> },
    { id: 'stats', label: t('game_stats'), icon: <BarChart3 size={20} /> },
    { id: 'roadmap', label: t('roadmap'), icon: <Map size={20} /> },
    { id: 'contact', label: t('contact'), icon: <Mail size={20} /> },
    { id: 'language', label: t('language'), icon: <Languages size={20} />, isLanguageSelector: true }
  ];

  const CharacterCustomizationSection = () => {
    const [activeCategory, setActiveCategory] = useState('face');
    const [aliaNoxComments, setAliaNoxComments] = useState([]);
    
    const customizationCategories = [
      { id: 'face', label: t('customize_face'), icon: <UserCircle size={18} /> },
      { id: 'hair', label: t('customize_hair'), icon: <Palette size={18} /> },
      { id: 'outfit', label: t('customize_outfit'), icon: <Settings size={18} /> },
      { id: 'accessories', label: t('customize_accessories'), icon: <Eye size={18} /> },
      { id: 'augmentations', label: t('customize_augmentations'), icon: <Cpu size={18} /> },
      { id: 'weapons', label: t('customize_weapons'), icon: <Shield size={18} /> }
    ];

    const updateCharacterConfig = (category, property, value) => {
      setCharacterConfig(prev => ({
        ...prev,
        [category]: {
          ...prev[category],
          [property]: value
        }
      }));
      
      // Trigger Alia Nox comment based on change
      generateAliaNoxComment(category, property, value);
    };

    const generateAliaNoxComment = (category, property, value) => {
      const comments = {
        face: {
          implants: {
            basic: "Basic neural interfaces are a good start, but there's so much more you could explore.",
            advanced: "Now those are some serious facial augmentations. You're starting to look like a real netrunner.",
            military: "Military-grade facial mods? Impressive. You're not playing around."
          }
        },
        hair: {
          glow: {
            true: "The neural glow in your hair will help you stand out in the digital underground.",
            false: "Classic look. Sometimes subtlety is the best camouflage in the corporate sectors."
          }
        },
        augmentations: {
          arms: {
            cybernetic: "Those cybernetic arms will give you a serious edge in both combat and hacking.",
            enhanced: "Enhanced limbs are practical. Good choice for long-term survival in the sprawl."
          }
        }
      };

      const comment = comments[category]?.[property]?.[value];
      if (comment) {
        setAliaNoxComments(prev => [...prev.slice(-2), { text: comment, timestamp: Date.now() }]);
      }
    };

    const randomizeCharacter = () => {
      const randomConfig = {
        gender: Math.random() > 0.5 ? 'male' : 'female',
        face: {
          shape: ['angular', 'rounded', 'square', 'heart'][Math.floor(Math.random() * 4)],
          skinTone: ['#FDBCB4', '#F1C27D', '#E0AC69', '#C68642', '#8D5524'][Math.floor(Math.random() * 5)],
          eyes: ['blue', 'green', 'brown', 'cyber', 'heterochromia'][Math.floor(Math.random() * 5)],
          scars: ['none', 'facial', 'eye', 'cheek'][Math.floor(Math.random() * 4)],
          implants: ['basic', 'advanced', 'military'][Math.floor(Math.random() * 3)]
        },
        hair: {
          style: ['punk', 'mohawk', 'long', 'buzzed', 'braids'][Math.floor(Math.random() * 5)],
          color: ['#00FFFF', '#FF0080', '#80FF00', '#FF8000', '#8000FF'][Math.floor(Math.random() * 5)],
          glow: Math.random() > 0.5
        },
        outfit: {
          torso: ['jacket', 'vest', 'armor', 'hoodie'][Math.floor(Math.random() * 4)],
          legs: ['cargo', 'jeans', 'tactical', 'leather'][Math.floor(Math.random() * 4)],
          boots: ['combat', 'sneakers', 'steel', 'hover'][Math.floor(Math.random() * 4)],
          gloves: ['fingerless', 'tactical', 'none', 'cyber'][Math.floor(Math.random() * 4)]
        },
        accessories: {
          mask: ['none', 'half', 'full', 'respirator'][Math.floor(Math.random() * 4)],
          visor: ['none', 'hud', 'tactical', 'ar'][Math.floor(Math.random() * 4)],
          jewelry: ['none', 'neon', 'chrome', 'holographic'][Math.floor(Math.random() * 4)]
        },
        augmentations: {
          arms: ['none', 'enhanced', 'cybernetic', 'military'][Math.floor(Math.random() * 4)],
          legs: ['none', 'enhanced', 'spring', 'hydraulic'][Math.floor(Math.random() * 4)],
          spine: ['none', 'neural', 'data', 'combat'][Math.floor(Math.random() * 4)]
        },
        weapons: {
          sidearm: ['none', 'plasma', 'kinetic', 'energy'][Math.floor(Math.random() * 4)],
          melee: ['none', 'blade', 'baton', 'whip'][Math.floor(Math.random() * 4)],
          rifle: ['none', 'assault', 'sniper', 'beam'][Math.floor(Math.random() * 4)]
        }
      };
      setCharacterConfig(randomConfig);
      setAliaNoxComments(prev => [...prev.slice(-2), { 
        text: "Interesting randomization! This configuration has some unique combinations. Want me to analyze your new look?", 
        timestamp: Date.now() 
      }]);
    };

    const saveCharacterScreenshot = () => {
      // This would capture the 3D canvas and save as image
      setAliaNoxComments(prev => [...prev.slice(-2), { 
        text: "Your avatar design has been saved to the local archives. Looking good, netrunner!", 
        timestamp: Date.now() 
      }]);
    };

    return (
      <div className="section-container character-section">
        <div className="section-content">
          <h2 className="section-title">{t('character_title')}</h2>
          
          <div className="character-intro">
            <p>{t('character_intro')}</p>
          </div>

          <div className="character-customization-grid">
            {/* 3D Character Viewer */}
            <div className="character-viewer-container">
              <div className="character-viewer">
                <div className="viewer-canvas">
                  <Character3DViewer 
                    characterConfig={characterConfig}
                    onViewChange={(e) => {
                      // Handle view changes if needed
                    }}
                  />
                </div>
                
                {/* 3D Controls */}
                <div className="viewer-controls">
                  <button className="control-btn" title="Rotate">
                    <RotateCcw size={16} />
                  </button>
                  <button className="control-btn" title="Zoom In">
                    <ZoomIn size={16} />
                  </button>
                  <button className="control-btn" title="Zoom Out">
                    <ZoomOut size={16} />
                  </button>
                  <button className="control-btn" title="Pan">
                    <Move3D size={16} />
                  </button>
                </div>

                {/* Character Actions */}
                <div className="character-actions">
                  <button className="action-btn primary" onClick={randomizeCharacter}>
                    <Shuffle size={16} />
                    {t('randomize_character')}
                  </button>
                  <button className="action-btn secondary" onClick={saveCharacterScreenshot}>
                    <Camera size={16} />
                    {t('save_character')}
                  </button>
                  <button className="action-btn secondary">
                    <Send size={16} />
                    {t('share_character')}
                  </button>
                </div>
              </div>

              {/* Alia Nox Comments */}
              {aliaNoxComments.length > 0 && (
                <div className="alia-comments">
                  <div className="alia-avatar">
                    <Bot size={20} />
                  </div>
                  <div className="alia-messages">
                    {aliaNoxComments.map((comment, index) => (
                      <div key={comment.timestamp} className="alia-message">
                        <span className="alia-name">Alia Nox:</span>
                        <p>{comment.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Customization Panel */}
            <div className="customization-panel">
              {/* Category Tabs */}
              <div className="category-tabs">
                {customizationCategories.map(category => (
                  <button
                    key={category.id}
                    className={`category-tab ${activeCategory === category.id ? 'active' : ''}`}
                    onClick={() => setActiveCategory(category.id)}
                  >
                    {category.icon}
                    <span>{category.label}</span>
                  </button>
                ))}
              </div>

              {/* Customization Options */}
              <div className="customization-options">
                {activeCategory === 'face' && (
                  <div className="options-grid">
                    <div className="option-group">
                      <label>Gender</label>
                      <div className="option-buttons">
                        <button 
                          className={`option-btn ${characterConfig.gender === 'male' ? 'active' : ''}`}
                          onClick={() => setCharacterConfig(prev => ({ ...prev, gender: 'male' }))}
                        >
                          {t('gender_male')}
                        </button>
                        <button 
                          className={`option-btn ${characterConfig.gender === 'female' ? 'active' : ''}`}
                          onClick={() => setCharacterConfig(prev => ({ ...prev, gender: 'female' }))}
                        >
                          {t('gender_female')}
                        </button>
                      </div>
                    </div>

                    <div className="option-group">
                      <label>Face Shape</label>
                      <div className="option-buttons">
                        {['angular', 'rounded', 'square', 'heart'].map(shape => (
                          <button
                            key={shape}
                            className={`option-btn ${characterConfig.face.shape === shape ? 'active' : ''}`}
                            onClick={() => updateCharacterConfig('face', 'shape', shape)}
                          >
                            {shape}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="option-group">
                      <label>Skin Tone</label>
                      <div className="color-picker">
                        {['#FDBCB4', '#F1C27D', '#E0AC69', '#C68642', '#8D5524'].map(color => (
                          <button
                            key={color}
                            className={`color-swatch ${characterConfig.face.skinTone === color ? 'active' : ''}`}
                            style={{ backgroundColor: color }}
                            onClick={() => updateCharacterConfig('face', 'skinTone', color)}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="option-group">
                      <label>Cybernetic Implants</label>
                      <div className="option-buttons">
                        {['basic', 'advanced', 'military'].map(implant => (
                          <button
                            key={implant}
                            className={`option-btn ${characterConfig.face.implants === implant ? 'active' : ''} rarity-${implant}`}
                            onClick={() => updateCharacterConfig('face', 'implants', implant)}
                          >
                            {implant}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeCategory === 'hair' && (
                  <div className="options-grid">
                    <div className="option-group">
                      <label>Hair Style</label>
                      <div className="option-buttons">
                        {['punk', 'mohawk', 'long', 'buzzed', 'braids'].map(style => (
                          <button
                            key={style}
                            className={`option-btn ${characterConfig.hair.style === style ? 'active' : ''}`}
                            onClick={() => updateCharacterConfig('hair', 'style', style)}
                          >
                            {style}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="option-group">
                      <label>Hair Color</label>
                      <div className="color-picker">
                        {['#00FFFF', '#FF0080', '#80FF00', '#FF8000', '#8000FF'].map(color => (
                          <button
                            key={color}
                            className={`color-swatch ${characterConfig.hair.color === color ? 'active' : ''}`}
                            style={{ backgroundColor: color }}
                            onClick={() => updateCharacterConfig('hair', 'color', color)}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="option-group">
                      <label>Neural Glow</label>
                      <div className="option-buttons">
                        <button
                          className={`option-btn ${characterConfig.hair.glow ? 'active' : ''}`}
                          onClick={() => updateCharacterConfig('hair', 'glow', !characterConfig.hair.glow)}
                        >
                          {characterConfig.hair.glow ? 'On' : 'Off'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeCategory === 'outfit' && (
                  <div className="options-grid">
                    <div className="option-group">
                      <label>Torso</label>
                      <div className="option-buttons">
                        {['jacket', 'vest', 'armor', 'hoodie'].map(item => (
                          <button
                            key={item}
                            className={`option-btn ${characterConfig.outfit.torso === item ? 'active' : ''}`}
                            onClick={() => updateCharacterConfig('outfit', 'torso', item)}
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="option-group">
                      <label>Legs</label>
                      <div className="option-buttons">
                        {['cargo', 'jeans', 'tactical', 'leather'].map(item => (
                          <button
                            key={item}
                            className={`option-btn ${characterConfig.outfit.legs === item ? 'active' : ''}`}
                            onClick={() => updateCharacterConfig('outfit', 'legs', item)}
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="option-group">
                      <label>Footwear</label>
                      <div className="option-buttons">
                        {['combat', 'sneakers', 'steel', 'hover'].map(item => (
                          <button
                            key={item}
                            className={`option-btn ${characterConfig.outfit.boots === item ? 'active' : ''}`}
                            onClick={() => updateCharacterConfig('outfit', 'boots', item)}
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeCategory === 'accessories' && (
                  <div className="options-grid">
                    <div className="option-group">
                      <label>Face Mask</label>
                      <div className="option-buttons">
                        {['none', 'half', 'full', 'respirator'].map(item => (
                          <button
                            key={item}
                            className={`option-btn ${characterConfig.accessories.mask === item ? 'active' : ''}`}
                            onClick={() => updateCharacterConfig('accessories', 'mask', item)}
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="option-group">
                      <label>AR Visor</label>
                      <div className="option-buttons">
                        {['none', 'hud', 'tactical', 'ar'].map(item => (
                          <button
                            key={item}
                            className={`option-btn ${characterConfig.accessories.visor === item ? 'active' : ''}`}
                            onClick={() => updateCharacterConfig('accessories', 'visor', item)}
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeCategory === 'augmentations' && (
                  <div className="options-grid">
                    <div className="option-group">
                      <label>Arm Modifications</label>
                      <div className="option-buttons">
                        {['none', 'enhanced', 'cybernetic', 'military'].map(item => (
                          <button
                            key={item}
                            className={`option-btn ${characterConfig.augmentations.arms === item ? 'active' : ''} rarity-${item}`}
                            onClick={() => updateCharacterConfig('augmentations', 'arms', item)}
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="option-group">
                      <label>Leg Enhancements</label>
                      <div className="option-buttons">
                        {['none', 'enhanced', 'spring', 'hydraulic'].map(item => (
                          <button
                            key={item}
                            className={`option-btn ${characterConfig.augmentations.legs === item ? 'active' : ''}`}
                            onClick={() => updateCharacterConfig('augmentations', 'legs', item)}
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="option-group">
                      <label>Spinal Interface</label>
                      <div className="option-buttons">
                        {['none', 'neural', 'data', 'combat'].map(item => (
                          <button
                            key={item}
                            className={`option-btn ${characterConfig.augmentations.spine === item ? 'active' : ''}`}
                            onClick={() => updateCharacterConfig('augmentations', 'spine', item)}
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeCategory === 'weapons' && (
                  <div className="options-grid">
                    <div className="option-group">
                      <label>Sidearm</label>
                      <div className="option-buttons">
                        {['none', 'plasma', 'kinetic', 'energy'].map(item => (
                          <button
                            key={item}
                            className={`option-btn ${characterConfig.weapons.sidearm === item ? 'active' : ''}`}
                            onClick={() => updateCharacterConfig('weapons', 'sidearm', item)}
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="option-group">
                      <label>Melee Weapon</label>
                      <div className="option-buttons">
                        {['none', 'blade', 'baton', 'whip'].map(item => (
                          <button
                            key={item}
                            className={`option-btn ${characterConfig.weapons.melee === item ? 'active' : ''}`}
                            onClick={() => updateCharacterConfig('weapons', 'melee', item)}
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="option-group">
                      <label>Primary Weapon</label>
                      <div className="option-buttons">
                        {['none', 'assault', 'sniper', 'beam'].map(item => (
                          <button
                            key={item}
                            className={`option-btn ${characterConfig.weapons.rifle === item ? 'active' : ''}`}
                            onClick={() => updateCharacterConfig('weapons', 'rifle', item)}
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const ContactSection = () => (
    <div className="section-container contact-section">
      <div className="section-content">
        <h2 className="section-title">{t('contact_title')}</h2>
        
        <div className="contact-grid">
          <div className="contact-intro">
            <p className="contact-description">
              {t('contact_intro')}
            </p>
            
            {/* Social Links */}
            <div className="social-links">
              <motion.a 
                href="https://tiktok.com/@zeropunkproject" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-link tiktok"
                whileHover={{ scale: 1.05, x: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <Music className="social-icon" size={20} />
                <span>@zeropunkproject</span>
                <div className="social-glow"></div>
              </motion.a>
              
              <motion.a 
                href="https://instagram.com/zeropunkproject" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-link instagram"
                whileHover={{ scale: 1.05, x: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <Instagram className="social-icon" size={20} />
                <span>@zeropunkproject</span>
                <div className="social-glow"></div>
              </motion.a>
              
              <motion.a 
                href="mailto:dayystudio@gmail.com"
                className="social-link email"
                whileHover={{ scale: 1.05, x: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <Mail className="social-icon" size={20} />
                <span>dayystudio@gmail.com</span>
                <div className="social-glow"></div>
              </motion.a>
              
              <motion.a 
                href="#discord" 
                className="social-link discord"
                whileHover={{ scale: 1.05, x: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <MessageCircle className="social-icon" size={20} />
                <span>Zeropunk Discord</span>
                <div className="social-glow"></div>
              </motion.a>
            </div>
          </div>

          {/* Contact Form */}
          <div className="contact-form-container">
            {/* Alia Avatar */}
            <div className="alia-contact-avatar">
              <div className="contact-avatar-head">
                <div className="contact-avatar-eyes">
                  <div className="eye left"></div>
                  <div className="eye right"></div>
                </div>
                <div className="contact-avatar-mouth"></div>
              </div>
              <div className="contact-avatar-glow"></div>
              <div className="alia-message">
                <p>{t('alia_contact_message')}</p>
              </div>
            </div>

            {contactSubmitted ? (
              <motion.div 
                className="contact-success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="success-icon">
                  <Send className="success-check" size={40} />
                </div>
                <p className="success-message">{t('contact_success')}</p>
              </motion.div>
            ) : (
              <form className="contact-form" onSubmit={handleContactSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">{t('contact_name')}</label>
                    <input
                      type="text"
                      value={contactForm.name}
                      onChange={(e) => handleContactFormChange('name', e.target.value)}
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">{t('contact_email')}</label>
                    <input
                      type="email"
                      value={contactForm.email}
                      onChange={(e) => handleContactFormChange('email', e.target.value)}
                      className="form-input"
                      required
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label className="form-label">{t('contact_subject')}</label>
                  <input
                    type="text"
                    value={contactForm.subject}
                    onChange={(e) => handleContactFormChange('subject', e.target.value)}
                    className="form-input"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">{t('contact_message')}</label>
                  <textarea
                    value={contactForm.message}
                    onChange={(e) => handleContactFormChange('message', e.target.value)}
                    className="form-textarea"
                    rows="5"
                    required
                  ></textarea>
                </div>
                
                <motion.button
                  type="submit"
                  className="contact-submit-btn"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Send className="submit-icon" size={18} />
                  {t('contact_send')}
                  <div className="button-glow"></div>
                </motion.button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const HeroSection = () => (
    <div className="section-container hero-section">
      <div className="hero-content">
        <motion.div
          className="logo-container"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          <h1 className="game-logo">ZEROPUNK</h1>
          <div className="os-info">{t('hero_subtitle')}</div>
        </motion.div>

        <motion.div
          className="hero-message"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
        >
          <p className="dystopian-text">
            {t('hero_message')}
          </p>
        </motion.div>

        <motion.div
          className="hero-buttons"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
        >
          <button className="cta-button primary" onClick={() => navigateToSection('beta')}>
            <Play className="icon" />
            {t('enter_beta')}
          </button>
          <button className="cta-button secondary" onClick={() => setAliaChatOpen(true)}>
            <MessageCircle className="icon" />
            {t('talk_to_alia')}
          </button>
        </motion.div>
      </div>
    </div>
  );

  const AboutSection = () => {
    const features = [
      {
        icon: <Brain className="feature-icon" />,
        title: t('ai_npcs_title'),
        description: t('ai_npcs_desc'),
        details: t('ai_npcs_details')
      },
      {
        icon: <Zap className="feature-icon" />,
        title: t('neural_dialogue_title'),
        description: t('neural_dialogue_desc'),
        details: t('neural_dialogue_details')
      },
      {
        icon: <Eye className="feature-icon" />,
        title: t('open_world_title'),
        description: t('open_world_desc'),
        details: t('open_world_details')
      }
    ];

    return (
      <div className="section-container about-section">
        <div className="section-content">
          <h2 className="section-title">{t('neural_interface')}</h2>
          <div className="about-grid">
            <div className="about-text">
              <p className="description">
                {t('about_description')}
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
                    <div className="feature-description">{feature.description}</div>
                    {expandedFeature === index && (
                      <motion.div
                        className="feature-details"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        {feature.details}
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const BetaSection = () => {
    const testimonials = [
      {
        quote: "A glimpse into the future of gaming. Every NPC feels alive.",
        author: "TechCrunch",
        type: "media"
      },
      {
        quote: "I've never experienced AI this immersive in a game before.",
        author: "Alpha Tester",
        type: "player"
      },
      {
        quote: "ZEROPUNK redefines what's possible in interactive storytelling.",
        author: "GameDev Insider",
        type: "media"
      },
      {
        quote: "The neural dialogue system is revolutionary.",
        author: "Beta Player",
        type: "player"
      }
    ];

    return (
      <div className="section-container wishlist-section">
        <div className="section-content">
          {/* Stable Background Effects */}
          <div className="wishlist-bg-effects">
            <div className="neon-grid"></div>
          </div>

          {/* Main Content */}
          <div className="wishlist-hero">
            <div className="wishlist-header">
              <h2 className="wishlist-title">
                <span className="title-line-1">{t('beta_title')}</span>
                <div className="title-steam-integration">
                  <div className="steam-logo-container">
                    <div className="steam-logo">
                      <div className="steam-circle"></div>
                      <div className="steam-lines">
                        <div className="steam-line"></div>
                        <div className="steam-line"></div>
                        <div className="steam-line"></div>
                      </div>
                    </div>
                  </div>
                  <span className="zeropunk-merge">× ZEROPUNK</span>
                </div>
              </h2>
              
              <div className="launch-status">
                <div className="status-indicator">
                  <div className="status-pulse"></div>
                  <span>{t('beta_warning')}</span>
                </div>
              </div>
            </div>

            <div className="wishlist-description">
              <p>{t('beta_description')}</p>
            </div>

            {/* Main CTA Button */}
            <div className="wishlist-cta-container">
              <motion.button
                className="wishlist-cta-btn"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => window.open('https://store.steampowered.com/', '_blank')}
              >
                <div className="btn-content">
                  <div className="btn-icon">
                    <Star className="star-icon" />
                  </div>
                  <span className="btn-text">{t('request_beta_access')}</span>
                  <div className="btn-arrow">
                    <Play size={20} />
                  </div>
                </div>
              </motion.button>
            </div>

            {/* Testimonials Grid */}
            <motion.div 
              className="testimonials-grid"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.2 }}
            >
              <h3 className="testimonials-title">Early Access Reactions</h3>
              <div className="testimonials-container">
                {testimonials.map((testimonial, index) => (
                  <motion.div
                    key={index}
                    className={`testimonial-card ${testimonial.type}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.9 + index * 0.1 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                  >
                    <div className="testimonial-content">
                      <blockquote>"{testimonial.quote}"</blockquote>
                      <cite>— {testimonial.author}</cite>
                    </div>
                    <div className="testimonial-type-indicator">
                      {testimonial.type === 'media' ? (
                        <Eye size={14} />
                      ) : (
                        <Users size={14} />
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* System Requirements Showcase */}
            <motion.div 
              className="requirements-showcase"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.8 }}
            >
              <div className="requirements-header">
                <h4>{t('system_requirements')}</h4>
                <button 
                  className="specs-btn"
                  onClick={() => navigateToSection('pc_requirements')}
                >
                  {t('view_system_specs')}
                  <ChevronDown className="specs-arrow" />
                </button>
              </div>
              
              <div className="requirements-grid">
                <div className="requirement-item">
                  <Brain className="req-icon" />
                  <span>{t('neural_compatibility')}</span>
                </div>
                <div className="requirement-item">
                  <Zap className="req-icon" />
                  <span>{t('consciousness_stability')}</span>
                </div>
                <div className="requirement-item">
                  <Activity className="req-icon" />
                  <span>{t('memory_fragmentation')}</span>
                </div>
                <div className="requirement-item">
                  <Settings className="req-icon" />
                  <span>{t('quantum_processing')}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  };

  const AliaNoxSection = () => (
    <div className="section-container alia-section">
      <div className="section-content">
        <h2 className="section-title">{t('alia_title')}</h2>
        <div className="alia-preview-grid">
          <div className="alia-avatar-large">
            <div className="large-avatar-head">
              <div className="large-avatar-eyes">
                <div className="eye left"></div>
                <div className="eye right"></div>
              </div>
              <div className="large-avatar-mouth"></div>
            </div>
            <div className="large-avatar-glow"></div>
          </div>
          
          <div className="alia-description">
            <p>
              {t('alia_description')}
            </p>
            
            <div className="alia-features">
              <div className="alia-feature">
                <Brain className="alia-feature-icon" />
                <span>{t('advanced_memory')}</span>
              </div>
              <div className="alia-feature">
                <MessageCircle className="alia-feature-icon" />
                <span>{t('natural_language')}</span>
              </div>
              <div className="alia-feature">
                <Zap className="alia-feature-icon" />
                <span>{t('emotional_intelligence')}</span>
              </div>
            </div>
            
            <button 
              className="cta-button primary"
              onClick={() => setAliaChatOpen(true)}
            >
              <MessageCircle className="icon" />
              {t('initiate_neural_link')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const PCRequirementsSection = () => (
    <div className="section-container pc-requirements-section">
      <div className="section-content">
        <h2 className="section-title">{t('system_analyzer')}</h2>
        
        <div className="pc-analyzer-grid">
          <div className="hardware-config">
            <h3 className="config-title">{t('select_hardware')}</h3>
            
            <div className="config-form">
              <div className="form-group">
                <label className="form-label">
                  <Cpu className="form-icon" />
                  {t('graphics_card')}
                </label>
                <select 
                  value={pcConfig.gpu} 
                  onChange={(e) => setPcConfig(prev => ({ ...prev, gpu: e.target.value }))}
                  className="form-select"
                >
                  <option value="">Select GPU...</option>
                  {Object.keys(hardwareDB.gpus).map(gpu => (
                    <option key={gpu} value={gpu}>{gpu}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">
                  <HardDrive className="form-icon" />
                  {t('processor')}
                </label>
                <select 
                  value={pcConfig.cpu} 
                  onChange={(e) => setPcConfig(prev => ({ ...prev, cpu: e.target.value }))}
                  className="form-select"
                >
                  <option value="">Select CPU...</option>
                  {Object.keys(hardwareDB.cpus).map(cpu => (
                    <option key={cpu} value={cpu}>{cpu}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Settings className="form-icon" />
                  {t('memory')}
                </label>
                <select 
                  value={pcConfig.ram} 
                  onChange={(e) => setPcConfig(prev => ({ ...prev, ram: e.target.value }))}
                  className="form-select"
                >
                  <option value="">Select RAM...</option>
                  <option value="8GB">8GB</option>
                  <option value="16GB">16GB</option>
                  <option value="32GB">32GB</option>
                  <option value="64GB">64GB</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Monitor className="form-icon" />
                  {t('resolution')}
                </label>
                <select 
                  value={pcConfig.resolution} 
                  onChange={(e) => setPcConfig(prev => ({ ...prev, resolution: e.target.value }))}
                  className="form-select"
                >
                  <option value="">Select Resolution...</option>
                  <option value="1080p">1920×1080 (Full HD)</option>
                  <option value="1440p">2560×1440 (2K)</option>
                  <option value="4K">3840×2160 (4K)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Globe className="form-icon" />
                  {t('operating_system')}
                </label>
                <select 
                  value={pcConfig.os} 
                  onChange={(e) => setPcConfig(prev => ({ ...prev, os: e.target.value }))}
                  className="form-select"
                >
                  <option value="">Select OS...</option>
                  <option value="Windows 11">Windows 11</option>
                  <option value="Windows 10">Windows 10</option>
                  <option value="macOS">macOS</option>
                  <option value="Linux">Linux</option>
                </select>
              </div>

              <button 
                className="cta-button primary analyze-btn"
                onClick={analyzePCConfig}
                disabled={!pcConfig.gpu || !pcConfig.cpu || !pcConfig.ram || !pcConfig.resolution}
              >
                <Brain className="icon" />
                {t('analyze_system')}
              </button>
            </div>
          </div>

          {pcAnalysis && (
            <motion.div 
              className="analysis-results"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="results-title">{t('performance_analysis')}</h3>
              
              <div className="verdict-card">
                <div className="verdict-header">
                  <h4>{t('compatibility_verdict')}</h4>
                  <div className={`verdict-badge ${pcAnalysis.tier}`}>
                    {pcAnalysis.verdict}
                  </div>
                </div>
                
                <div className="performance-metrics">
                  <div className="metric">
                    <span className="metric-label">{t('system_score')}</span>
                    <div className="score-bar">
                      <div 
                        className={`score-fill ${pcAnalysis.tier}`}
                        style={{ width: `${pcAnalysis.score}%` }}
                      ></div>
                      <span className="score-text">{Math.round(pcAnalysis.score)}/100</span>
                    </div>
                  </div>
                  
                  <div className="metric">
                    <span className="metric-label">{t('estimated_fps')}</span>
                    <span className="metric-value">{pcAnalysis.fps}</span>
                  </div>
                  
                  <div className="metric">
                    <span className="metric-label">{t('recommended_settings')}</span>
                    <span className="metric-value">{pcAnalysis.settings}</span>
                  </div>
                </div>
              </div>

              {showBenchmark && (
                <motion.div 
                  className="benchmark-preview"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <h4>{t('benchmark_preview')}</h4>
                  <div className={`benchmark-visualization ${pcAnalysis.tier}`}>
                    {/* Holographic Environment Sim */}
                    <div className="holographic-environment">
                      <div className="holo-grid"></div>
                      <div className="holo-particles">
                        {[...Array(8)].map((_, i) => (
                          <div 
                            key={i}
                            className="holo-particle"
                            style={{
                              animationDelay: `${i * 0.3}s`,
                              left: `${10 + i * 10}%`,
                              animationDuration: `${2 + Math.random() * 2}s`
                            }}
                          ></div>
                        ))}
                      </div>
                      <div className="holo-avatar">
                        <div className="avatar-core"></div>
                        <div className="avatar-rings">
                          <div className="ring ring-1"></div>
                          <div className="ring ring-2"></div>
                          <div className="ring ring-3"></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="fps-counter">
                      <span className="fps-number">{pcAnalysis.fps.split(' ')[0]}</span>
                      <span className="fps-label">FPS</span>
                    </div>
                    <div className="performance-graph">
                      {[...Array(20)].map((_, i) => (
                        <div 
                          key={i}
                          className="graph-bar"
                          style={{
                            height: `${Math.random() * 40 + 20}px`,
                            animationDelay: `${i * 0.1}s`
                          }}
                        ></div>
                      ))}
                    </div>
                    <div className="quality-indicator">
                      <span className={`quality-badge ${pcAnalysis.tier}`}>
                        {pcAnalysis.settings} Quality
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );

  const LiveActivitySection = () => (
    <div className="section-container live-activity-section">
      <div className="section-content">
        <h2 className="section-title">{t('live_world_title')}</h2>
        
        <div className="live-dashboard">
          {/* Player Count & Game Time */}
          <div className="dashboard-row">
            <motion.div 
              className="live-card player-count-card"
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div className="card-header">
                <Users className="card-icon pulse-blue" />
                <span className="card-label">{t('players_online')}</span>
              </div>
              <div className="card-value">
                <span className="live-number">{liveData.playerCount.toLocaleString()}</span>
                <div className="pulse-indicator active"></div>
              </div>
            </motion.div>

            <motion.div 
              className="live-card game-time-card"
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div className="card-header">
                <Clock className="card-icon pulse-cyan" />
                <span className="card-label">{t('game_time')}</span>
              </div>
              <div className="card-value">
                <span className="live-time">
                  {String(liveData.gameTime.hour).padStart(2, '0')}:
                  {String(liveData.gameTime.minute).padStart(2, '0')}
                </span>
                <span className="time-period">{liveData.gameTime.period}</span>
              </div>
            </motion.div>
          </div>

          {/* Weather & Market */}
          <div className="dashboard-row">
            <motion.div 
              className="live-card weather-card"
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div className="card-header">
                <CloudRain className="card-icon pulse-purple" />
                <span className="card-label">{t('current_weather')}</span>
              </div>
              <div className="weather-display">
                <div className="weather-condition">{liveData.weather.condition}</div>
                <div className="weather-stats">
                  <div className="weather-stat">
                    <span className="stat-label">{t('weather_intensity')}</span>
                    <div className="stat-bar">
                      <div 
                        className="stat-fill weather-intensity"
                        style={{ width: `${liveData.weather.intensity}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="weather-stat">
                    <span className="stat-label">{t('weather_visibility')}</span>
                    <div className="stat-bar">
                      <div 
                        className="stat-fill weather-visibility"
                        style={{ width: `${liveData.weather.visibility}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="live-card market-card"
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div className="card-header">
                <TrendingUp className="card-icon pulse-green" />
                <span className="card-label">{t('market_status')}</span>
              </div>
              <div className="market-display">
                <div className={`market-status ${liveData.market.status.toLowerCase()}`}>
                  {t(`market_${liveData.market.status.toLowerCase()}`)}
                </div>
                <div className="market-volume">
                  <span className="volume-label">{t('trading_volume')}</span>
                  <span className="volume-value">₦{liveData.market.volume.toLocaleString()}</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Faction Control */}
          <motion.div 
            className="live-card faction-card full-width"
            whileHover={{ scale: 1.01 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <div className="card-header">
              <Shield className="card-icon pulse-orange" />
              <span className="card-label">{t('faction_control')}</span>
            </div>
            <div className="faction-display">
              {liveData.factions.map((faction, index) => (
                <div key={index} className="faction-item">
                  <div className="faction-info">
                    <span className="faction-name">{faction.name}</span>
                    <span className={`faction-trend ${faction.trend}`}>
                      {t(`trend_${faction.trend}`)} {faction.control}%
                    </span>
                  </div>
                  <div className="faction-bar">
                    <div 
                      className={`faction-fill faction-${index + 1}`}
                      style={{ width: `${faction.control}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Resource Prices & Events */}
          <div className="dashboard-row">
            <motion.div 
              className="live-card resources-card"
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div className="card-header">
                <Coins className="card-icon pulse-yellow" />
                <span className="card-label">{t('resource_prices')}</span>
              </div>
              <div className="resources-display">
                {liveData.resources.map((resource, index) => (
                  <div key={index} className="resource-item">
                    <span className="resource-name">{resource.name}</span>
                    <div className="resource-price">
                      <span className="price-value">₦{resource.price}</span>
                      <span className={`price-change ${resource.change >= 0 ? 'positive' : 'negative'}`}>
                        {resource.change >= 0 ? '+' : ''}{resource.change}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div 
              className="live-card events-card"
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div className="card-header">
                <Activity className="card-icon pulse-red" />
                <span className="card-label">{t('ongoing_events')}</span>
              </div>
              <div className="events-display">
                {liveData.events.map((event, index) => (
                  <div key={index} className="event-item">
                    <div className="event-type">
                      {t(`event_${event.type}`)}
                    </div>
                    <div className="event-details">
                      {event.location && <span className="event-location">{event.location}</span>}
                      {event.participants && (
                        <span className="event-participants">
                          {event.participants} {t('participants')}
                        </span>
                      )}
                      {event.change && (
                        <span className="event-change positive">
                          {event.item}: {event.change}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );


  const RoadmapSection = () => {
    const roadmapPhases = [
      {
        year: "2025 Q1",
        phase: "Closed Beta Launch",
        status: "active",
        items: [
          "Core AI Memory System Integration",
          "Basic Neural Dialogue Implementation", 
          "Initial World Building & Districts",
          "Player Testing & Feedback Collection",
          "Performance Optimization & Bug Fixes",
          "Community Discord Launch"
        ]
      },
      {
        year: "2025 Q2-Q3",
        phase: "Enhanced Neural Systems",
        status: "planned",
        items: [
          "Advanced NPC Relationship Dynamics",
          "Multi-layered Conversation Memory",
          "Emotional Intelligence Upgrades",
          "Cross-NPC Information Sharing",
          "Player Choice Consequence System",
          "Steam Early Access Launch"
        ]
      },
      {
        year: "2025 Q4",
        phase: "Expanded Reality",
        status: "development",
        items: [
          "Full 12-District World Completion",
          "Corporate Faction System",
          "Underground Network Mechanics",
          "Advanced Crime & Law Systems",
          "Player-to-Player Neural Connections",
          "Mobile Companion App Integration"
        ]
      },
      {
        year: "2026",
        phase: "Consciousness Evolution",
        status: "research",
        items: [
          "Dynamic NPC Personality Evolution",
          "Player Action Ripple Effect System",
          "Advanced Moral Dilemma Engine",
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
      <div className="section-container roadmap-section">
        <div className="section-content">
          <h2 className="section-title">{t('roadmap_title')}</h2>
          <div className="roadmap-timeline">
            {roadmapPhases.map((phase, index) => (
              <motion.div
                key={index}
                className={`roadmap-phase ${phase.status}`}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
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
      </div>
    );
  };

  const StatsSection = () => {
    return (
      <div className="section-container stats-section">
        <div className="section-content">
          <h2 className="section-title">SYSTEM STATISTICS</h2>
          
          <div className="stats-grid">
            {gameStats && (
              <>
                <motion.div 
                  className="stat-card"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <Users className="stat-icon" />
                  <div className="stat-number">{gameStats.players_online}</div>
                  <div className="stat-label">ACTIVE NEURAL LINKS</div>
                </motion.div>
                
                <motion.div 
                  className="stat-card"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <Download className="stat-icon" />
                  <div className="stat-number">{gameStats.beta_downloads}</div>
                  <div className="stat-label">BETA DOWNLOADS</div>
                </motion.div>
                
                <motion.div 
                  className="stat-card"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <Star className="stat-icon" />
                  <div className="stat-number">{gameStats.wishlist_count}</div>
                  <div className="stat-label">WISHLIST COUNT</div>
                </motion.div>
                
                <motion.div 
                  className="stat-card"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <Activity className="stat-icon" />
                  <div className="stat-value">{gameStats.rating}</div>
                  <div className="stat-label">NEURAL RATING</div>
                </motion.div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderCurrentSection = () => {
    switch (currentSection) {
      case 'hero': return <HeroSection />;
      case 'about': return <AboutSection />;
      case 'beta': return <BetaSection />;
      case 'character': return <CharacterCustomizationSection />;
      case 'alia': return <AliaNoxSection />;
      case 'pc_requirements': return <PCRequirementsSection />;
      case 'live_activity': return <LiveActivitySection />;
      case 'stats': return <StatsSection />;
      case 'roadmap': return <RoadmapSection />;
      case 'contact': return <ContactSection />;
      default: return <HeroSection />;
    }
  };

  return (
    <div className="app">
      {/* Background Effects */}
      <div className="cyberpunk-bg">
        <div className="rain-effect"></div>
        <div className="grid-overlay"></div>
        <div className="particles"></div>
      </div>

      {/* Header with Hamburger Menu */}
      <header className="main-header">
        <div className="header-content">
          <div className="header-brand">
            <span className="brand-text">ZEROPUNK</span>
          </div>
          
          <button 
            className={`hamburger-menu ${menuOpen ? 'open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Navigation Menu */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              className="menu-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
            />
            <motion.nav
              className="navigation-menu"
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ type: 'spring', damping: 20 }}
            >
              <div className="menu-content">
                <div className="menu-header">
                  <h3>{t('neural_interface_menu')}</h3>
                </div>
                
                <div className="menu-items">
                  {menuItems.map((item) => (
                    <div key={item.id}>
                      <motion.button
                        className={`menu-item ${currentSection === item.id ? 'active' : ''} ${item.isLanguageSelector && languageMenuOpen ? 'active' : ''}`}
                        onClick={() => navigateToSection(item.id)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {item.icon}
                        <span>{item.label}</span>
                        {item.isLanguageSelector && (
                          <ChevronDown className={`language-chevron ${languageMenuOpen ? 'rotated' : ''}`} size={16} />
                        )}
                      </motion.button>
                      
                      {/* Language Submenu */}
                      {item.isLanguageSelector && (
                        <AnimatePresence>
                          {languageMenuOpen && (
                            <motion.div
                              className="language-submenu"
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              {languages.map(lang => (
                                <motion.button
                                  key={lang.code}
                                  className={`language-option ${currentLanguage === lang.code ? 'active' : ''}`}
                                  onClick={() => selectLanguage(lang.code)}
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                >
                                  <span className="language-flag">{lang.flag}</span>
                                  <span className="language-name">{lang.name}</span>
                                </motion.button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="main-content">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderCurrentSection()}
          </motion.div>
        </AnimatePresence>
      </main>

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
                  {t('alia_chat_title')}
                </div>
                <button 
                  className="chat-close"
                  onClick={() => setAliaChatOpen(false)}
                  aria-label="Close chat"
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
                        {t('chat_welcome')}
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
                  placeholder={t('chat_placeholder')}
                  className="message-input"
                />
                <button 
                  onClick={() => sendMessageToAlia(currentMessage)}
                  className="send-button"
                  disabled={isTyping}
                >
                  {t('send')}
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