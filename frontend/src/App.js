import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, X, ChevronDown, Play, Pause, Volume2, VolumeX, 
  MessageCircle, Users, Activity, Download, Star, Zap, 
  Shield, Cpu, HardDrive, Monitor, Smartphone, Settings,
  Globe, LogOut, User, Clock, TrendingUp, MapPin, Target,
  Gamepad2, Headphones, Mic, Eye, Brain, Heart, Home, Info,
  BarChart3, Bot, Map, Camera, UserCircle, ShoppingCart, 
  Code, Mail, Languages, Terminal, ZoomIn, Palette, 
  AlertTriangle, CloudRain, Music, Send, Upload, Instagram, Coins,
  Lock, ShoppingBag
} from 'lucide-react';

// Import Reality Components
import RealityFractures from './RealityFractures';
import SpecterBlackReality from './SpecterBlackReality';
import EchoesFutureReality from './EchoesFutureReality';
import ZoneDeltaReality from './ZoneDeltaReality';
import YougnShopPage from './YougnShopPage';
import IDScanEntry from './IDScanEntry';
import { useTranslation } from './i18n/useTranslation';
import './App.css';
import './LiveActivity.css';
import './ZeroMarket.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const App = () => {
  // Translation hook
  const { currentLanguage, changeLanguage, t, languages } = useTranslation();
  
  // Core app states
  const [gameStats, setGameStats] = useState(null);
  const [aliaChatOpen, setAliaChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [aliaAnimating, setAliaAnimating] = useState(false);
  const [expandedFeature, setExpandedFeature] = useState(null);
  
  // Navigation state
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState('hero');
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  
  // Reality Management States
  const [currentReality, setCurrentReality] = useState(
    localStorage.getItem('zeropunk_reality') || 'primary'
  );
  
  // ID Scan Entry State
  const [showIDScan, setShowIDScan] = useState(true);
  const [mainAppVisible, setMainAppVisible] = useState(false);
  
  // Contact form state
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [contactSubmitted, setContactSubmitted] = useState(false);

  // Authentication state
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'

  // FAQ state
  const [openFaqItems, setOpenFaqItems] = useState(new Set());

  // Add scroll detection for section highlighting
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'broadcast', 'about', 'beta', 'support', 'visual-archive', 'faq', 'alia', 'character', 'pc_requirements', 'stats', 'live_activity', 'zeromarket', 'reality-fractures', 'yougnshop', 'roadmap', 'modding', 'contact'];
      const scrollPos = window.scrollY + 100; // Offset for header

      for (let i = sections.length - 1; i >= 0; i--) {
        const element = document.getElementById(sections[i]);
        if (element && element.offsetTop <= scrollPos) {
          setCurrentSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Check for existing authentication token on app load
  useEffect(() => {
    const token = localStorage.getItem('zeropunk_token');
    if (token) {
      validateToken(token);
    }
  }, []);

  // Authentication functions
  const validateToken = async (token) => {
    try {
      const response = await fetch(`${import.meta.env.REACT_APP_BACKEND_URL || process.env.REACT_APP_BACKEND_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem('zeropunk_token');
      }
    } catch (error) {
      console.error('Token validation failed:', error);
      localStorage.removeItem('zeropunk_token');
    }
  };

  const handleLogin = async (credentials) => {
    try {
      const response = await fetch(`${import.meta.env.REACT_APP_BACKEND_URL || process.env.REACT_APP_BACKEND_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials)
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('zeropunk_token', data.access_token);
        setUser(data.user);
        setIsAuthenticated(true);
        setShowAuthModal(false);
        return { success: true };
      } else {
        const error = await response.json();
        return { success: false, error: error.detail };
      }
    } catch (error) {
      return { success: false, error: 'Neural link connection failed. Please try again.' };
    }
  };

  const handleRegister = async (userData) => {
    try {
      const response = await fetch(`${import.meta.env.REACT_APP_BACKEND_URL || process.env.REACT_APP_BACKEND_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('zeropunk_token', data.access_token);
        setUser(data.user);
        setIsAuthenticated(true);
        setShowAuthModal(false);
        return { success: true };
      } else {
        const error = await response.json();
        return { success: false, error: error.detail };
      }
    } catch (error) {
      return { success: false, error: 'Neural network registration failed. Please try again.' };
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('zeropunk_token');
    setUser(null);
    setIsAuthenticated(false);
  };

  // Reality Management Functions
  const handleRealityChange = (newReality) => {
    setCurrentReality(newReality);
    localStorage.setItem('zeropunk_reality', newReality);
  };

  const returnToPrimaryReality = () => {
    setCurrentReality('primary');
    localStorage.setItem('zeropunk_reality', 'primary');
  };

  // ID Scan Entry Functions
  const handleIDScanComplete = () => {
    setShowIDScan(false);
    setMainAppVisible(true);
  };

  // Check if we should render alternate reality
  const renderCurrentReality = () => {
    switch (currentReality) {
      case 'specter-black':
        return <SpecterBlackReality onReturnToPrimary={returnToPrimaryReality} />;
      case 'echoes-future':
        return <EchoesFutureReality onReturnToPrimary={returnToPrimaryReality} />;
      case 'zone-delta':
        return <ZoneDeltaReality onReturnToPrimary={returnToPrimaryReality} />;
      default:
        return null; // Return null for primary reality to show main app
    }
  };

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
        if (showIDScan) {
          // Skip ID scan on ESC
          handleIDScanComplete();
        } else {
          // Normal ESC behavior for menu
          setMenuOpen(false);
          setLanguageMenuOpen(false);
        }
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => document.removeEventListener('keydown', handleEscKey);
  }, [showIDScan]);

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
    
    if (section === 'vip') {
      // VIP section is locked - show a message or do nothing
      console.log('VIP section is locked - premium feature');
      return;
    }
    
    // Close menu
    setMenuOpen(false);
    setLanguageMenuOpen(false);
    
    // Smooth scroll to section
    const targetElement = document.getElementById(section);
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const selectLanguage = (langCode) => {
    changeLanguage(langCode);
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
      hero_description: 'Zeropunk is a cinematic cyberpunk open-world game where you\'re not the hero — you\'re just trying to survive. Talk to AI-powered NPCs, hack, fly, and fight your way through a collapsing futuristic city.',
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
      beta_title: 'Beta coming soon',
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

      // Modding Hub
      modding_hub: 'Modding Hub',

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
      hero_description: 'Zeropunk是一个电影级的赛博朋克开放世界游戏，在这里你不是英雄——你只是在努力生存。与AI驱动的NPC交谈，黑客入侵，飞行，战斗，穿越一个崩溃中的未来城市。',
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
      beta_title: '测试版即将推出',
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
      hero_description: 'Zeropunk est un jeu open-world cyberpunk cinématographique où tu n\'es pas le héros — juste un citoyen en survie. Discute avec des IA, pirate, vole et affronte le chaos d\'une ville futuriste en chute libre.',
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
      beta_title: 'Bêta bientôt disponible',
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



  const menuItems = [
    { id: 'hero', label: t('home'), icon: <Home size={16} /> },
    { id: 'broadcast', label: t('citycast_live'), icon: <Monitor size={16} /> },
    { id: 'about', label: t('features'), icon: <Info size={16} /> },
    { id: 'beta', label: t('wishlist_steam'), icon: <Gamepad2 size={16} /> },
    { id: 'support', label: t('support_project'), icon: <Heart size={16} /> },
    { id: 'visual-archive', label: t('visual_archive'), icon: <Camera size={16} /> },
    { id: 'faq', label: t('faq'), icon: <Info size={16} /> },
    { id: 'character', label: t('character_customization'), icon: <UserCircle size={16} /> },
    { id: 'pc_requirements', label: t('pc_requirements'), icon: <Monitor size={16} /> },
    { id: 'stats', label: t('gamestats'), icon: <BarChart3 size={16} /> },
    { id: 'live_activity', label: t('live_world_activity'), icon: <Globe size={16} /> },
    { id: 'zeromarket', label: t('zeromarket'), icon: <ShoppingCart size={16} /> },
    { id: 'reality-fractures', label: t('reality_fractures'), icon: <Eye size={16} /> },
    { id: 'yougnshop', label: t('yougnshop_title'), icon: <ShoppingBag size={16} /> },
    { id: 'roadmap', label: t('roadmap'), icon: <Map size={16} /> },
    { id: 'modding', label: t('modding_hub'), icon: <Code size={16} /> },
    { id: 'contact', label: t('contact'), icon: <Mail size={16} /> },
    { id: 'vip', label: t('vip_section'), icon: <Lock size={16} />, isLocked: true }, // VIP section - locked
    { id: 'language', label: t('language'), icon: <Languages size={16} />, isLanguageSelector: true } // Language selector
  ];

  const ModdingHubComingSoon = () => {
    const [scanlinePosition, setScanlinePosition] = useState(0);
    const [glitchActive, setGlitchActive] = useState(false);
    
    useEffect(() => {
      // Scanline animation
      const scanlineInterval = setInterval(() => {
        setScanlinePosition(prev => (prev + 2) % 100);
      }, 50);
      
      // Glitch effect
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
      <div className="modding-coming-soon">
        <div className="coming-soon-frame">
          {/* Animated border corners */}
          <div className="frame-corners">
            <div className="corner corner-tl"></div>
            <div className="corner corner-tr"></div>
            <div className="corner corner-bl"></div>
            <div className="corner corner-br"></div>
          </div>
          
          {/* Scanlines effect */}
          <div 
            className="scanlines-overlay" 
            style={{ transform: `translateY(${scanlinePosition}px)` }}
          ></div>
          
          <div className={`coming-soon-content ${glitchActive ? 'glitch-active' : ''}`}>
            {/* Status indicator */}
            <div className="status-bar">
              <div className="status-dot"></div>
              <span className="status-text">MODDING INTERFACE</span>
              <div className="status-dot"></div>
            </div>
            
            {/* Main title */}
            <motion.h1 
              className="coming-soon-title"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              MODDING HUB
              <span className="title-subtitle">Creator Central Station</span>
            </motion.h1>
            
            {/* Development status */}
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
            
            {/* Feature preview */}
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
            
            {/* Development progress */}
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
            
            {/* Notification signup */}
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
                  placeholder={t('email_placeholder_hero')}
                  className="notify-input"
                />
                <button className="notify-btn">
                  <Zap size={16} />
                  SYNC
                </button>
              </div>
            </motion.div>
          </div>
          
          {/* Holographic overlay effects */}
          <div className="holo-overlay"></div>
          <div className="data-stream"></div>
        </div>
      </div>
    );
  };

  const CharacterCustomizationSection = () => {
    const [glitchActive, setGlitchActive] = useState(false);
    const [scanlinePosition, setScanlinePosition] = useState(0);
    
    useEffect(() => {
      // Glitch effect interval
      const glitchInterval = setInterval(() => {
        setGlitchActive(true);
        setTimeout(() => setGlitchActive(false), 200);
      }, 3000 + Math.random() * 2000);
      
      // Scanline animation
      const scanlineInterval = setInterval(() => {
        setScanlinePosition(prev => (prev + 1) % 100);
      }, 50);
      
      return () => {
        clearInterval(glitchInterval);
        clearInterval(scanlineInterval);
      };
    }, []);

    return (
      <div className="character-section coming-soon-section">
        <div className="coming-soon-container">
          {/* Holographic display frame */}
          <div className="holo-frame">
            <div className="frame-corners">
              <div className="corner corner-tl"></div>
              <div className="corner corner-tr"></div>
              <div className="corner corner-bl"></div>
              <div className="corner corner-br"></div>
            </div>
            
            {/* Scanlines effect */}
            <div 
              className="scanlines" 
              style={{ transform: `translateY(${scanlinePosition * 6}px)` }}
            ></div>
            
            {/* Main content */}
            <div className={`coming-soon-content ${glitchActive ? 'glitch-active' : ''}`}>
              {/* Status indicator */}
              <div className="status-indicator">
                <div className="status-dot pulsing"></div>
                <span className="status-text">NEURAL INTERFACE</span>
              </div>
              
              {/* Main title */}
              <motion.h1 
                className="coming-soon-title"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
              >
                CHARACTER FORGE
                <span className="title-glitch" data-text="CHARACTER FORGE">CHARACTER FORGE</span>
              </motion.h1>
              
              {/* Subtitle */}
              <motion.h2 
                className="coming-soon-subtitle"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.8 }}
              >
                NEURAL AVATAR CUSTOMIZATION
              </motion.h2>
              
              {/* Status message */}
              <motion.div 
                className="status-message"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 1.2 }}
              >
                <div className="message-header">
                  <Cpu className="message-icon" size={24} />
                  <span>SYSTEM STATUS</span>
                </div>
                <div className="message-content">
                  <p>Neural interface calibration in progress...</p>
                  <p>Advanced avatar customization system under development</p>
                </div>
              </motion.div>
              
              {/* Progress indicators */}
              <motion.div 
                className="development-progress"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.5 }}
              >
                <div className="progress-item">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: '75%' }}></div>
                  </div>
                  <span className="progress-label">Facial Recognition System</span>
                  <span className="progress-value">75%</span>
                </div>
                
                <div className="progress-item">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: '60%' }}></div>
                  </div>
                  <span className="progress-label">Cybernetic Implant Database</span>
                  <span className="progress-value">60%</span>
                </div>
                
                <div className="progress-item">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: '90%' }}></div>
                  </div>
                  <span className="progress-label">Neural Pattern Mapping</span>
                  <span className="progress-value">90%</span>
                </div>
              </motion.div>
              
              {/* Feature list */}
              <motion.div 
                className="feature-preview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.8 }}
              >
                <h3>INCOMING FEATURES</h3>
                <div className="feature-grid">
                  <div className="feature-item">
                    <UserCircle size={20} />
                    <span>Facial Reconstruction</span>
                  </div>
                  <div className="feature-item">
                    <Eye size={20} />
                    <span>Augmented Reality Eyes</span>
                  </div>
                  <div className="feature-item">
                    <Brain size={20} />
                    <span>Neural Implants</span>
                  </div>
                  <div className="feature-item">
                    <Cpu size={20} />
                    <span>Cybernetic Limbs</span>
                  </div>
                  <div className="feature-item">
                    <Palette size={20} />
                    <span>Bio-luminescent Hair</span>
                  </div>
                  <div className="feature-item">
                    <Shield size={20} />
                    <span>Tactical Gear Systems</span>
                  </div>
                </div>
              </motion.div>
              
              {/* Notification signup */}
              <motion.div 
                className="notify-section"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 2.1 }}
              >
                <h4>GET NOTIFIED WHEN READY</h4>
                <div className="notify-input-group">
                  <input 
                    type="email" 
                    placeholder={t('email_placeholder_neural')}
                    className="notify-input"
                  />
                  <button className="notify-btn">
                    <Zap size={16} />
                    SYNC
                  </button>
                </div>
                <p className="notify-disclaimer">
                  Join the neural network for early access to avatar customization
                </p>
              </motion.div>
            </div>
            
            {/* Holographic effects */}
            <div className="holo-overlay"></div>
            <div className="holo-flicker"></div>
          </div>
          
          {/* Background effects */}
          <div className="bg-matrix">
            <div className="matrix-rain"></div>
            <div className="matrix-rain"></div>
            <div className="matrix-rain"></div>
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
                href="https://discord.gg/cGWWV2TF2C"
                target="_blank"
                rel="noopener noreferrer" 
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
            {t('hero_description')}
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
    const [activeFeature, setActiveFeature] = useState(0);
    const [hoveredFeature, setHoveredFeature] = useState(null);
    const [scanlinePosition, setScanlinePosition] = useState(0);
    const [dataStreamActive, setDataStreamActive] = useState(false);
    const [systemPulse, setSystemPulse] = useState(0);
    const [particleCount, setParticleCount] = useState(50);

    useEffect(() => {
      // Advanced scanline animation
      const scanlineInterval = setInterval(() => {
        setScanlinePosition(prev => (prev + 2) % 100);
      }, 60);
      
      // Data stream activation
      const dataStreamInterval = setInterval(() => {
        setDataStreamActive(prev => !prev);
      }, 3000);
      
      // System pulse for heartbeat effect
      const pulseInterval = setInterval(() => {
        setSystemPulse(prev => (prev + 1) % 100);
      }, 50);

      return () => {
        clearInterval(scanlineInterval);
        clearInterval(dataStreamInterval);
        clearInterval(pulseInterval);
      };
    }, []);

    const features = [
      {
        id: 'ai_npcs',
        icon: <Brain className="feature-icon" />,
        title: t('ai_npcs_title'),
        description: t('ai_npcs_desc'),
        details: t('ai_npcs_details'),
        accent: '#00FFFF',
        gradient: 'linear-gradient(135deg, #00FFFF 0%, #0080FF 100%)',
        stats: { 
          memory: { value: 99.8, unit: '%', label: 'Neural Memory' },
          interactions: { value: 2.4, unit: 'M+', label: 'Daily Interactions' },
          accuracy: { value: 97.2, unit: '%', label: 'Response Accuracy' }
        },
        capabilities: [
          'Dynamic personality adaptation',
          'Cross-session memory retention',
          'Emotional intelligence processing',
          'Contextual relationship building'
        ],
        technicalSpecs: {
          'Neural Pathways': '2.4B parameters',
          'Memory Capacity': '∞ TB',
          'Response Time': '< 50ms',
          'Learning Rate': 'Adaptive'
        }
      },
      {
        id: 'neural_dialogue',
        icon: <Zap className="feature-icon" />,
        title: t('neural_dialogue_title'),
        description: t('neural_dialogue_desc'),
        details: t('neural_dialogue_details'),
        accent: '#FF0080',
        gradient: 'linear-gradient(135deg, #FF0080 0%, #FF4040 100%)',
        stats: { 
          processing: { value: 12, unit: 'ms', label: 'Processing Speed' },
          contexts: { value: 500, unit: 'K+', label: 'Context Windows' },
          languages: { value: 47, unit: '', label: 'Languages Supported' }
        },
        capabilities: [
          'Real-time sentiment analysis',
          'Multi-language neural translation',
          'Contextual subtext understanding',
          'Philosophical reasoning engine'
        ],
        technicalSpecs: {
          'Language Models': 'GPT-4O Hybrid',
          'Context Length': '128K tokens',
          'Reasoning Depth': '∞ levels',
          'Emotion Detection': '99.4% accuracy'
        }
      },
      {
        id: 'open_world',
        icon: <Eye className="feature-icon" />,
        title: t('open_world_title'),
        description: t('open_world_desc'),
        details: t('open_world_details'),
        accent: '#80FF00',
        gradient: 'linear-gradient(135deg, #80FF00 0%, #40FF80 100%)',
        stats: { 
          districts: { value: 12, unit: '', label: 'City Districts' },
          events: { value: '∞', unit: '', label: 'Dynamic Events' },
          players: { value: 'Live', unit: '', label: 'Player Activity' }
        },
        capabilities: [
          'Procedural event generation',
          'Real-time world simulation',
          'Player-driven narrative evolution',
          'Quantum-state city systems'
        ],
        technicalSpecs: {
          'World Size': '847 km²',
          'NPCs Active': '50K+',
          'Simulation Depth': 'Quantum-level',
          'Update Frequency': 'Real-time'
        }
      }
    ];

    const currentFeature = features[activeFeature];

    return (
      <div className="section-container about-section">
        <div className="features-dashboard-v2">
          {/* Advanced Background Effects */}
          <div className="dashboard-bg-effects">
            <div className="neural-grid"></div>
            <div className="data-streams">
              {[...Array(8)].map((_, i) => (
                <div key={i} className={`data-stream stream-${i + 1} ${dataStreamActive ? 'active' : ''}`}></div>
              ))}
            </div>
            <div className="particle-system">
              {[...Array(particleCount)].map((_, i) => (
                <div key={i} className="particle" style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${3 + Math.random() * 4}s`
                }}></div>
              ))}
            </div>
          </div>

          {/* Enhanced Dashboard Header */}
          <div className="dashboard-header-v2">
            <div className="header-top-bar">
              <div className="system-status">
                <div className="status-cluster">
                  <div className="status-dot pulsing" style={{ '--pulse-color': '#00FFFF' }}></div>
                  <span className="status-label">NEURAL_CORE</span>
                  <span className="status-value">ONLINE</span>
                </div>
                <div className="status-cluster">
                  <div className="status-dot pulsing" style={{ '--pulse-color': '#80FF00' }}></div>
                  <span className="status-label">MEMORY_BANK</span>
                  <span className="status-value">ACTIVE</span>
                </div>
                <div className="status-cluster">
                  <div className="status-dot pulsing" style={{ '--pulse-color': '#FF0080' }}></div>
                  <span className="status-label">AI_MATRIX</span>
                  <span className="status-value">SYNCED</span>
                </div>
              </div>
              <div className="system-metrics-top">
                <div className="metric-chip">
                  <span className="metric-label">SYSTEM_LOAD</span>
                  <span className="metric-value">73.2%</span>
                </div>
                <div className="metric-chip">
                  <span className="metric-label">UPTIME</span>
                  <span className="metric-value">247:15:32</span>
                </div>
                <div className="metric-chip">
                  <span className="metric-label">VERSION</span>
                  <span className="metric-value">v0.92.3</span>
                </div>
              </div>
            </div>
            
            <div className="title-section">
              <motion.h1 
                className="dashboard-title-v2"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
              >
                <span className="title-prefix">ZEROPUNK://</span>
                <span className="title-main-v2">{t('neural_interface')}</span>
                <span className="title-suffix">CORE_SYSTEMS</span>
              </motion.h1>
              <div className="subtitle-container">
                <div className="subtitle-line"></div>
                <span className="subtitle-text">Advanced AI Technology Suite</span>
                <div className="subtitle-line"></div>
              </div>
            </div>
          </div>

          {/* Main Dashboard Grid */}
          <div className="features-main-grid">
            {/* Enhanced Feature Navigation */}
            <div className="features-nav-v2">
              <div className="nav-header-v2">
                <Terminal className="nav-icon" />
                <span className="nav-title">FEATURE_MODULES</span>
                <div className="nav-indicator-bar"></div>
              </div>
              
              <div className="nav-items-container">
                {features.map((feature, index) => (
                  <motion.div
                    key={feature.id}
                    className={`nav-item-v2 ${activeFeature === index ? 'active' : ''}`}
                    onClick={() => setActiveFeature(index)}
                    onHoverStart={() => setHoveredFeature(index)}
                    onHoverEnd={() => setHoveredFeature(null)}
                    whileHover={{ x: 8, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    style={{ 
                      '--accent-color': feature.accent,
                      '--feature-gradient': feature.gradient
                    }}
                  >
                    <div className="nav-item-bg"></div>
                    <div className="nav-item-content">
                      <div className="nav-item-icon">
                        {feature.icon}
                        <div className="icon-glow"></div>
                      </div>
                      <div className="nav-item-info">
                        <div className="nav-item-title">{feature.title}</div>
                        <div className="nav-item-id">MODULE_{String(index + 1).padStart(2, '0')}</div>
                        <div className="nav-item-stats">
                          {Object.entries(feature.stats).slice(0, 1).map(([key, stat]) => (
                            <span key={key} className="nav-stat">
                              {stat.value}{stat.unit}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="nav-item-indicator">
                        <div className="indicator-dot"></div>
                        <div className="indicator-line"></div>
                      </div>
                    </div>
                    <div className="nav-item-overlay"></div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Enhanced Main Display */}
            <div className="feature-display-v2">
              <div className="display-frame-v2">
                {/* Advanced Visual Effects */}
                <div className="display-effects">
                  <div 
                    className="advanced-scanlines" 
                    style={{ transform: `translateY(${scanlinePosition * 6}px)` }}
                  ></div>
                  <div className="holo-mesh"></div>
                  <div className="data-overlay"></div>
                </div>
                
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeFeature}
                    className="feature-content-v2"
                    initial={{ opacity: 0, x: 100, rotateY: 10 }}
                    animate={{ opacity: 1, x: 0, rotateY: 0 }}
                    exit={{ opacity: 0, x: -100, rotateY: -10 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    style={{ 
                      '--accent-color': currentFeature.accent,
                      '--feature-gradient': currentFeature.gradient
                    }}
                  >
                    {/* Feature Header */}
                    <div className="feature-header-v2">
                      <div className="feature-icon-container">
                        <div className="icon-frame">
                          {currentFeature.icon}
                          <div className="icon-rings">
                            <div className="ring ring-1"></div>
                            <div className="ring ring-2"></div>
                            <div className="ring ring-3"></div>
                          </div>
                        </div>
                      </div>
                      <div className="feature-info">
                        <h2 className="feature-title-v2">{currentFeature.title}</h2>
                        <p className="feature-category">NEURAL_TECHNOLOGY_SUITE</p>
                        <div className="feature-id">#{currentFeature.id.toUpperCase()}_CORE</div>
                      </div>
                    </div>

                    {/* Advanced Stats Grid */}
                    <div className="stats-grid-v2">
                      {Object.entries(currentFeature.stats).map(([key, stat], index) => (
                        <motion.div
                          key={key}
                          className="stat-card-v2"
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 + 0.3 }}
                        >
                          <div className="stat-header">
                            <div className="stat-icon">
                              <Activity size={16} />
                            </div>
                            <span className="stat-label-v2">{stat.label}</span>
                          </div>
                          <div className="stat-value-container">
                            <span className="stat-value-v2">{stat.value}</span>
                            <span className="stat-unit">{stat.unit}</span>
                          </div>
                          <div className="stat-progress">
                            <motion.div 
                              className="progress-fill"
                              initial={{ width: 0 }}
                              animate={{ width: typeof stat.value === 'number' ? `${Math.min(stat.value, 100)}%` : '100%' }}
                              transition={{ delay: index * 0.1 + 0.5, duration: 1 }}
                            ></motion.div>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Feature Description */}
                    <div className="feature-description-v2">
                      <div className="description-header-v2">
                        <Code className="section-icon" />
                        <span>SYSTEM_OVERVIEW</span>
                        <div className="header-line"></div>
                      </div>
                      <p className="description-text-v2">{currentFeature.description}</p>
                    </div>

                    {/* Capabilities Grid */}
                    <div className="capabilities-section">
                      <div className="capabilities-header">
                        <Settings className="section-icon" />
                        <span>CORE_CAPABILITIES</span>
                        <div className="header-line"></div>
                      </div>
                      <div className="capabilities-grid">
                        {currentFeature.capabilities.map((capability, index) => (
                          <motion.div
                            key={index}
                            className="capability-item"
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 + 0.6 }}
                          >
                            <div className="capability-dot"></div>
                            <span>{capability}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Enhanced Action Buttons */}
                    <div className="action-buttons-v2">
                      <motion.button
                        className="action-btn-v2 primary"
                        whileHover={{ scale: 1.05, boxShadow: `0 0 30px ${currentFeature.accent}` }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Play size={18} />
                        <span>INITIALIZE_MODULE</span>
                        <div className="btn-glow"></div>
                      </motion.button>
                      <motion.button
                        className="action-btn-v2 secondary"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Terminal size={18} />
                        <span>ACCESS_DOCS</span>
                      </motion.button>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Enhanced Side Panel */}
            <div className="side-panel-v2">
              {/* Technical Specifications */}
              <div className="panel-section-v2">
                <div className="panel-header-v2">
                  <Cpu className="panel-icon" />
                  <span>TECH_SPECS</span>
                </div>
                <div className="tech-specs">
                  {Object.entries(currentFeature.technicalSpecs).map(([key, value]) => (
                    <div key={key} className="spec-item">
                      <span className="spec-key">{key}</span>
                      <span className="spec-value">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Real-time Monitoring */}
              <div className="panel-section-v2">
                <div className="panel-header-v2">
                  <Activity className="panel-icon" />
                  <span>LIVE_MONITOR</span>
                </div>
                <div className="monitoring-display">
                  <div className="monitor-item">
                    <span className="monitor-label">Neural Activity</span>
                    <div className="monitor-bar">
                      <motion.div 
                        className="monitor-fill"
                        animate={{ width: `${50 + Math.sin(systemPulse * 0.1) * 30}%` }}
                        style={{ backgroundColor: '#00FFFF' }}
                      ></motion.div>
                    </div>
                  </div>
                  <div className="monitor-item">
                    <span className="monitor-label">Data Flow</span>
                    <div className="monitor-bar">
                      <motion.div 
                        className="monitor-fill"
                        animate={{ width: `${60 + Math.cos(systemPulse * 0.15) * 25}%` }}
                        style={{ backgroundColor: '#FF0080' }}
                      ></motion.div>
                    </div>
                  </div>
                  <div className="monitor-item">
                    <span className="monitor-label">System Load</span>
                    <div className="monitor-bar">
                      <motion.div 
                        className="monitor-fill"
                        animate={{ width: `${70 + Math.sin(systemPulse * 0.08) * 20}%` }}
                        style={{ backgroundColor: '#80FF00' }}
                      ></motion.div>
                    </div>
                  </div>
                </div>
              </div>

              {/* System Alerts */}
              <div className="panel-section-v2">
                <div className="panel-header-v2">
                  <AlertTriangle className="panel-icon" />
                  <span>ALERTS</span>
                </div>
                <div className="alerts-display">
                  <div className="alert-item-v2 success">
                    <div className="alert-indicator"></div>
                    <div className="alert-content">
                      <span className="alert-title">Neural sync complete</span>
                      <span className="alert-time">2m ago</span>
                    </div>
                  </div>
                  <div className="alert-item-v2 warning">
                    <div className="alert-indicator"></div>
                    <div className="alert-content">
                      <span className="alert-title">Cache optimization needed</span>
                      <span className="alert-time">5m ago</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Footer */}
          <div className="dashboard-footer-v2">
            <div className="footer-section">
              <Shield className="footer-icon" />
              <span>QUANTUM_ENCRYPTION_ACTIVE</span>
            </div>
            <div className="footer-section">
              <Lock className="footer-icon" />
              <span>NEURAL_FIREWALL_ENABLED</span>
            </div>
            <div className="footer-section">
              <Globe className="footer-icon" />
              <span>GLOBAL_NEURAL_NETWORK</span>
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

  const FAQSection = () => {
    const toggleFaqItem = (index) => {
      const newOpenItems = new Set(openFaqItems);
      if (newOpenItems.has(index)) {
        newOpenItems.delete(index);
      } else {
        newOpenItems.add(index);
      }
      setOpenFaqItems(newOpenItems);
    };

    const faqData = [
      {
        question: "What is ZEROPUNK?",
        answer: "ZEROPUNK is an immersive open-world futuristic RPG, blending deep narrative, AI-driven NPCs, and a cinematic cyberpunk experience. Set in a dystopian megacity fractured by AI control, mega-corporations, underground resistance groups, and forgotten secrets, the game invites you to explore, survive, and make your own story — with no chosen-one, no fixed path, and full freedom."
      },
      {
        question: "What kind of universe does the game take place in?",
        answer: "ZEROPUNK is set in Neon District 7, year 2137. A dense and vertical city with rich corporate zones, outlaw sectors, AI-controlled districts, slums, and restricted areas. Augmentations are common, surveillance is constant, and freedom is rare."
      },
      {
        question: "Is there a main storyline?",
        answer: "Yes — but it's fully optional and dynamic. You can follow the main quest or ignore it entirely. The story adapts to your choices, alliances, betrayals, and your unique path."
      },
      {
        question: "Can I customize my character?",
        answer: "Absolutely. You can fully customize your gender, body, voice, clothing, tattoos, cybernetic implants, skills, abilities, and personality. You'll be able to make a character that truly feels like your own."
      },
      {
        question: "Are there vehicles?",
        answer: "Yes. You can drive cars, ride bikes, and even fly futuristic vehicles. Some are customizable, and vehicles are seamlessly integrated into the open world."
      },
      {
        question: "Will I have my own apartment?",
        answer: "Yes. You'll be able to buy, unlock, or take over apartments in the city. Apartments can be customized and used as your base for sleeping, storing items, upgrading gear, or accessing secret networks."
      },
      {
        question: "What kinds of weapons are available?",
        answer: "From traditional firearms to futuristic plasma guns, drones, hacking tools, energy blades, and cybernetic melee weapons — the game gives you total freedom to build your own combat style."
      },
      {
        question: "Can I play stealth or melee?",
        answer: "Yes. You can play full stealth, hack your way through systems, or beat enemies with fists or augmented strength. The gameplay supports combat, infiltration, tech-based approaches, and social manipulation."
      },
      {
        question: "Is there a skill tree?",
        answer: "Yes, a modular progression system allows you to shape your playstyle. Branches include: Hacking, Combat (ranged/melee), Piloting, Stealth, Social manipulation, and Survival/Analysis."
      },
      {
        question: "Are NPCs controlled by AI?",
        answer: "Yes. All core NPCs are powered by a neural AI system, allowing them to remember previous conversations with you, react to your behavior, history, and decisions, and change attitudes dynamically over time."
      },
      {
        question: "Can I talk to NPCs like real people?",
        answer: "Yes. ZEROPUNK integrates natural language AI. You'll be able to talk to NPCs freely. They respond with real personality, emotion, and memory. You'll build relationships through real interaction — not just dialogue trees."
      },
      {
        question: "Do NPCs remember me?",
        answer: "Absolutely. NPCs will remember what you say, how you act, and what you've done. They'll hold grudges, grow fond of you, betray you — or even become long-term allies."
      },
      {
        question: "Is the city open-world and explorable?",
        answer: "Yes. ZEROPUNK is fully open-world. You can travel on foot, by vehicle, through alleys, rooftops, tunnels, and elevators. Many buildings are enterable and have secrets inside."
      },
      {
        question: "Can I go inside buildings?",
        answer: "Yes. Stores, apartments, clubs, labs, and secret areas can be accessed. Some require hacking, bribing, or persuading guards. Urban exploration is a big part of the experience."
      },
      {
        question: "Is there a day/night cycle?",
        answer: "Yes, with full dynamic impact: Some quests only appear at night, police are more present during certain hours, stores open and close, and some NPCs only come out after dark."
      },
      {
        question: "Does the game have a HUD?",
        answer: "The HUD is minimal and immersive. Most information is shown through your cyber implants, holographic projections, and real-world cues like signs, sounds, and AI voice assistants."
      },
      {
        question: "Will there be advanced graphic settings?",
        answer: "Yes — but they'll be available once the full settings system is in place. For now, the demo visuals are scaled down for performance. Future phases will increase visual fidelity significantly."
      },
      {
        question: "What engine is ZEROPUNK developed with?",
        answer: "ZEROPUNK is developed using Unreal Engine 5.5, with Nanite, Lumen, Virtual Shadow Maps, World Partition, AI-driven NPC systems, and real-time voice dialogue systems."
      },
      {
        question: "Will the game run on my PC?",
        answer: "The goal is to offer multiple quality presets. ZEROPUNK will support high-end rigs (Ultra Mode) and mid-range setups, with scalable options and automatic performance tuning."
      },
      {
        question: "How can I support the project?",
        answer: "You can support the development by donating via the [Donate] page, joining the Discord server, sharing ZEROPUNK on social media, and wishlisting on Steam. Supporters get early access, rewards, and exclusive community roles."
      },
      {
        question: "What do I get if I donate?",
        answer: "Donors get access to a private Discord channel, exclusive in-development previews, in-game rewards, recognition in the game credits, and possibly early access to testing phases."
      },
      {
        question: "What's inside the Discord?",
        answer: "The Discord server includes devlogs & behind-the-scenes content, community votes for development decisions, exclusive polls, content drops, and bonus rewards, plus live discussions with the dev(s)."
      },
      {
        question: "Is there a roadmap?",
        answer: "Yes. A long-term roadmap up to 2037 includes: Beta testing, full NPC AI integration, multiplayer PVE & PVP, player-run factions and economies, dynamic city expansion, advanced housing & base-building, emotional NPC interaction, and console support."
      }
    ];

    return (
      <div className="section-container faq-section">
        <div className="section-content">
          {/* Background Effects */}
          <div className="faq-bg-effects">
            <div className="faq-grid-overlay"></div>
            <div className="faq-particles"></div>
          </div>

          {/* FAQ Content */}
          <div className="faq-container">
            <motion.div
              className="faq-header"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="faq-title">
                <span className="faq-icon">📘</span>
                {t('faq_full_title')}
              </h2>
              <p className="faq-subtitle">
                {t('faq_subtitle')}
              </p>
            </motion.div>

            <div className="faq-list">
              {faqData.map((item, index) => (
                <motion.div
                  key={index}
                  className="faq-item"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <div
                    className={`faq-question ${openFaqItems.has(index) ? 'active' : ''}`}
                    onClick={() => toggleFaqItem(index)}
                  >
                    <div className="question-content">
                      <span className="question-icon">❓</span>
                      <span className="question-text">{item.question}</span>
                    </div>
                    <ChevronDown
                      className={`faq-chevron ${openFaqItems.has(index) ? 'rotated' : ''}`}
                      size={20}
                    />
                  </div>
                  
                  <AnimatePresence>
                    {openFaqItems.has(index) && (
                      <motion.div
                        className="faq-answer"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      >
                        <div className="answer-content">
                          {item.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const SupportSection = () => {
    return (
      <div className="section-container support-section">
        <div className="section-content">
          {/* Background Effects */}
          <div className="support-bg-effects">
            <div className="support-grid-overlay"></div>
            <div className="support-particles"></div>
            <div className="support-glitch-lines"></div>
          </div>

          {/* Support Content */}
          <div className="support-container">
            <motion.div
              className="support-header"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="support-title">
                <span className="support-icon">💜</span>
                {t('support_project_title')}
              </h2>
              <p className="support-intro">
                {t('support_description')}
              </p>
            </motion.div>

            <motion.div
              className="support-actions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <div className="support-buttons">
                <motion.button
                  className="support-btn donation-btn"
                  onClick={() => {
                    window.open('https://buymeacoffee.com/zeropunk', '_blank');
                  }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="btn-glow-effect"></div>
                  <Heart className="btn-icon" size={20} />
                  <span className="btn-text">Make a Donation</span>
                  <div className="btn-arrow">→</div>
                </motion.button>

                <motion.button
                  className="support-btn discord-btn"
                  onClick={() => {
                    window.open('https://discord.gg/cGWWV2TF2C', '_blank');
                  }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="btn-glow-effect"></div>
                  <MessageCircle className="btn-icon" size={20} />
                  <span className="btn-text">Join the Discord Server</span>
                  <div className="btn-arrow">→</div>
                </motion.button>
              </div>
            </motion.div>

            <motion.div
              className="support-benefits"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <div className="benefits-content">
                <p className="benefits-intro">
                  By supporting the project and joining Discord, you'll gain access to an exclusive developer-only channel, where you can:
                </p>
                <ul className="benefits-list">
                  <li>
                    <span className="benefit-icon">💡</span>
                    Share your ideas directly with the dev
                  </li>
                  <li>
                    <span className="benefit-icon">🎬</span>
                    See exclusive behind-the-scenes content
                  </li>
                  <li>
                    <span className="benefit-icon">🎁</span>
                    Get early previews, polls, and rewards
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  };

  const BroadcastSection = () => {
    const [isMuted, setIsMuted] = useState(true);
    const [currentFeed, setCurrentFeed] = useState(0);
    
    const feedContent = [
      {
        title: t('sector_7_uprising'),
        subtitle: t('corporate_forces_mobilizing'),
        content: t('neural_chip_shortage')
      },
      {
        title: t('ai_consciousness_debate'),
        subtitle: t('ethics_committee_hearing'),
        content: t('artificial_sentience_threat')
      },
      {
        title: t('neon_district_lockdown'),
        subtitle: t('security_breach_detected'),
        content: t('unknown_hackers_content')
      },
      {
        title: t('beta_access_title'),
        subtitle: t('beta_slots'),
        content: t('beta_launch_text')
      }
    ];

    useEffect(() => {
      const feedInterval = setInterval(() => {
        setCurrentFeed(prev => (prev + 1) % feedContent.length);
      }, 4000);
      
      return () => clearInterval(feedInterval);
    }, []);

    return (
      <div className="section-container broadcast-section" id="broadcast">
        <div className="section-content">
          {/* Background Effects */}
          <div className="broadcast-bg-effects">
            <div className="broadcast-grid"></div>
            <div className="broadcast-static"></div>
            <div className="broadcast-scanlines"></div>
          </div>

          {/* Broadcast Content */}
          <div className="broadcast-container">
            <motion.div
              className="broadcast-header"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="broadcast-title">
                <span className="broadcast-icon">📡</span>
                {t('citycast_title')}
              </h2>
              <p className="broadcast-subtitle">
                {t('citycast_subtitle')}
              </p>
            </motion.div>

            <div className="broadcast-screen-container">
              <div className="broadcast-screen">
                {/* Screen Frame */}
                <div className="screen-frame">
                  <div className="frame-corner tl"></div>
                  <div className="frame-corner tr"></div>
                  <div className="frame-corner bl"></div>
                  <div className="frame-corner br"></div>
                </div>

                {/* Screen Content */}
                <div className="screen-content">
                  <div className="broadcast-hud">
                    <div className="hud-top">
                      <div className="live-indicator">
                        <div className="live-dot"></div>
                        <span>LIVE</span>
                      </div>
                      <div className="signal-strength">
                        <div className="signal-bar"></div>
                        <div className="signal-bar"></div>
                        <div className="signal-bar"></div>
                        <div className="signal-bar active"></div>
                        <div className="signal-bar active"></div>
                      </div>
                    </div>
                    
                    <div className="hud-bottom">
                      <div className="timestamp">2137.03.15 | 23:47:33</div>
                      <button 
                        className="mute-toggle"
                        onClick={() => setIsMuted(!isMuted)}
                      >
                        {isMuted ? '🔇' : '🔊'}
                      </button>
                    </div>
                  </div>

                  {/* News Feed Content */}
                  <div className="news-feed">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentFeed}
                        className="news-item"
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ duration: 0.5 }}
                      >
                        <div className="news-header">
                          <h3 className="news-title">{feedContent[currentFeed].title}</h3>
                          <p className="news-subtitle">{feedContent[currentFeed].subtitle}</p>
                        </div>
                        <p className="news-content">{feedContent[currentFeed].content}</p>
                        
                        {/* Fake gameplay preview */}
                        <div className="gameplay-preview">
                          <div className="preview-placeholder">
                            <div className="preview-text">{t('gameplay_preview')}</div>
                            <div className="preview-bars">
                              <div className="bar bar-1"></div>
                              <div className="bar bar-2"></div>
                              <div className="bar bar-3"></div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* Ticker at bottom */}
                  <div className="news-ticker">
                    <div className="ticker-content">
                      BREAKING: Neural implant compatibility tests show 94% success rate • 
                      ZEROPUNK beta signups exceed 10,000 registrations • 
                      City Council debates AI rights legislation • 
                      Neon Corp stock rises 15% after quantum breakthrough •
                    </div>
                  </div>
                </div>

                {/* Screen Effects */}
                <div className="screen-glitch"></div>
                <div className="screen-reflection"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const AuthModal = () => {
    const [formData, setFormData] = useState({
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      username_or_email: '',
      accept_terms: false,
      remember_me: false
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(null);
    const [usernameAvailable, setUsernameAvailable] = useState(null);

    const checkUsernameAvailability = async (username) => {
      if (username.length < 3) return;
      
      try {
        const response = await fetch(`${import.meta.env.REACT_APP_BACKEND_URL || process.env.REACT_APP_BACKEND_URL}/auth/check-username?username=${username}`);
        const data = await response.json();
        setUsernameAvailable(data);
      } catch (error) {
        console.error('Username check failed:', error);
      }
    };

    const checkPasswordStrength = async (password) => {
      if (password.length === 0) {
        setPasswordStrength(null);
        return;
      }

      try {
        const response = await fetch(`${import.meta.env.REACT_APP_BACKEND_URL || process.env.REACT_APP_BACKEND_URL}/auth/check-password?password=${password}`, {
          method: 'POST'
        });
        const data = await response.json();
        setPasswordStrength(data);
      } catch (error) {
        console.error('Password strength check failed:', error);
      }
    };

    const handleInputChange = (e) => {
      const { name, value, type, checked } = e.target;
      const newValue = type === 'checkbox' ? checked : value;
      
      setFormData(prev => ({
        ...prev,
        [name]: newValue
      }));

      // Clear errors for this field
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));

      // Check username availability
      if (name === 'username' && authMode === 'register') {
        checkUsernameAvailability(value);
      }

      // Check password strength
      if (name === 'password' && authMode === 'register') {
        checkPasswordStrength(value);
      }
    };

    const validateForm = () => {
      const newErrors = {};

      if (authMode === 'register') {
        if (!formData.username) newErrors.username = 'Username is required';
        if (!formData.email) newErrors.email = 'Email is required';
        if (!formData.password) newErrors.password = 'Password is required';
        if (!formData.confirmPassword) newErrors.confirmPassword = 'Confirm password is required';
        if (formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = 'Passwords do not match';
        }
        if (!formData.accept_terms) newErrors.accept_terms = 'You must accept the terms';
        if (usernameAvailable && !usernameAvailable.available) {
          newErrors.username = 'Username not available';
        }
        if (passwordStrength && !passwordStrength.is_valid) {
          newErrors.password = 'Password is too weak';
        }
      } else {
        if (!formData.username_or_email) newErrors.username_or_email = 'Username or email is required';
        if (!formData.password) newErrors.password = 'Password is required';
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      
      if (!validateForm()) return;
      
      setIsLoading(true);
      
      let result;
      if (authMode === 'register') {
        result = await handleRegister({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          accept_terms: formData.accept_terms
        });
      } else {
        result = await handleLogin({
          username_or_email: formData.username_or_email,
          password: formData.password,
          remember_me: formData.remember_me
        });
      }

      setIsLoading(false);

      if (!result.success) {
        setErrors({ submit: result.error });
      }
    };

    const resetForm = () => {
      setFormData({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        username_or_email: '',
        accept_terms: false,
        remember_me: false
      });
      setErrors({});
      setPasswordStrength(null);
      setUsernameAvailable(null);
    };

    const switchMode = (mode) => {
      setAuthMode(mode);
      resetForm();
    };

    if (!showAuthModal) return null;

    return (
      <div className="auth-modal-overlay" onClick={() => setShowAuthModal(false)}>
        <motion.div
          className="auth-modal"
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 50 }}
          transition={{ duration: 0.3 }}
        >
          {/* Background Effects */}
          <div className="auth-bg-effects">
            <div className="auth-grid"></div>
            <div className="auth-scanlines"></div>
            <div className="auth-particles"></div>
          </div>

          {/* Header */}
          <div className="auth-header">
            <h2 className="auth-title">
              <span className="auth-icon">🔐</span>
              {authMode === 'login' ? 'Z-NET ACCESS TERMINAL' : 'NEURAL REGISTRATION MATRIX'}
            </h2>
            <p className="auth-subtitle">
              {authMode === 'login' 
                ? 'Welcome back, Citizen. Verify your identity.' 
                : 'Initialize your neural profile in the ZEROPUNK network.'
              }
            </p>
            <button 
              className="auth-close"
              onClick={() => setShowAuthModal(false)}
            >
              <X size={20} />
            </button>
          </div>

          {/* Mode Toggle */}
          <div className="auth-mode-toggle">
            <button
              className={`mode-btn ${authMode === 'login' ? 'active' : ''}`}
              onClick={() => switchMode('login')}
            >
              LOGIN
            </button>
            <button
              className={`mode-btn ${authMode === 'register' ? 'active' : ''}`}
              onClick={() => switchMode('register')}
            >
              REGISTER
            </button>
          </div>

          {/* Form */}
          <form className="auth-form" onSubmit={handleSubmit}>
            {authMode === 'register' ? (
              <>
                {/* Username Field */}
                <div className="auth-field">
                  <label className="auth-label">Neural ID (Username)</label>
                  <div className="field-container">
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className={`auth-input ${errors.username ? 'error' : ''} ${usernameAvailable?.available === true ? 'success' : ''}`}
                      placeholder={t('username_placeholder')}
                    />
                    {usernameAvailable && (
                      <div className={`field-status ${usernameAvailable.available ? 'success' : 'error'}`}>
                        {usernameAvailable.available ? '✓ Available' : '✗ Taken'}
                      </div>
                    )}
                  </div>
                  {errors.username && <div className="auth-error">{errors.username}</div>}
                </div>

                {/* Email Field */}
                <div className="auth-field">
                  <label className="auth-label">Neural Link Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`auth-input ${errors.email ? 'error' : ''}`}
                    placeholder={t('email_placeholder')}
                  />
                  {errors.email && <div className="auth-error">{errors.email}</div>}
                </div>

                {/* Password Field */}
                <div className="auth-field">
                  <label className="auth-label">Security Passphrase</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`auth-input ${errors.password ? 'error' : ''}`}
                    placeholder={t('password_placeholder')}
                  />
                  {passwordStrength && (
                    <div className="password-strength">
                      <div className="strength-bar">
                        <div 
                          className={`strength-fill strength-${passwordStrength.score}`}
                          style={{ width: `${(passwordStrength.score / 4) * 100}%` }}
                        ></div>
                      </div>
                      <div className="strength-feedback">
                        {passwordStrength.feedback.map((feedback, index) => (
                          <div key={index} className="feedback-item">{feedback}</div>
                        ))}
                      </div>
                    </div>
                  )}
                  {errors.password && <div className="auth-error">{errors.password}</div>}
                </div>

                {/* Confirm Password Field */}
                <div className="auth-field">
                  <label className="auth-label">Confirm Passphrase</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`auth-input ${errors.confirmPassword ? 'error' : ''}`}
                    placeholder={t('confirm_password_placeholder')}
                  />
                  {errors.confirmPassword && <div className="auth-error">{errors.confirmPassword}</div>}
                </div>

                {/* Terms Checkbox */}
                <div className="auth-field checkbox-field">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="accept_terms"
                      checked={formData.accept_terms}
                      onChange={handleInputChange}
                      className="auth-checkbox"
                    />
                    <span className="checkbox-custom"></span>
                    <span className="checkbox-text">
                      I accept the <span className="terms-link">Neural Interface Terms & Conditions</span>
                    </span>
                  </label>
                  {errors.accept_terms && <div className="auth-error">{errors.accept_terms}</div>}
                </div>
              </>
            ) : (
              <>
                {/* Username/Email Field */}
                <div className="auth-field">
                  <label className="auth-label">Neural ID or Email</label>
                  <input
                    type="text"
                    name="username_or_email"
                    value={formData.username_or_email}
                    onChange={handleInputChange}
                    className={`auth-input ${errors.username_or_email ? 'error' : ''}`}
                    placeholder={t('login_username_placeholder')}
                  />
                  {errors.username_or_email && <div className="auth-error">{errors.username_or_email}</div>}
                </div>

                {/* Password Field */}
                <div className="auth-field">
                  <label className="auth-label">Security Passphrase</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`auth-input ${errors.password ? 'error' : ''}`}
                    placeholder={t('login_password_placeholder')}
                  />
                  {errors.password && <div className="auth-error">{errors.password}</div>}
                </div>

                {/* Remember Me Checkbox */}
                <div className="auth-field checkbox-field">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="remember_me"
                      checked={formData.remember_me}
                      onChange={handleInputChange}
                      className="auth-checkbox"
                    />
                    <span className="checkbox-custom"></span>
                    <span className="checkbox-text">Keep me logged into the neural matrix</span>
                  </label>
                </div>

                {/* Forgot Password Link */}
                <div className="auth-link">
                  <a href="#" className="forgot-password">Neural pattern corrupted? Reset access codes</a>
                </div>
              </>
            )}

            {/* Submit Error */}
            {errors.submit && <div className="auth-error submit-error">{errors.submit}</div>}

            {/* Submit Button */}
            <button 
              type="submit" 
              className="auth-submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="loading-spinner">
                  <div className="spinner"></div>
                  <span>
                    {authMode === 'login' ? 'Verifying Identity...' : 'Initializing Neural Profile...'}
                  </span>
                </div>
              ) : (
                <>
                  <span className="submit-icon">
                    {authMode === 'login' ? '🚀' : '🧠'}
                  </span>
                  <span>
                    {authMode === 'login' ? 'ACCESS Z-NET' : 'JOIN THE MATRIX'}
                  </span>
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="auth-footer">
            <p className="auth-disclaimer">
              {authMode === 'login' 
                ? '⚠️ Unauthorized access will be reported to the Nexus Authority'
                : '🛡️ Your neural data is encrypted with quantum-level security'
              }
            </p>
          </div>
        </motion.div>
      </div>
    );
  };

  const VisualArchiveSection = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);

    const gameplayImages = [
      {
        id: 1,
        url: "https://images.unsplash.com/photo-1573767291321-c0af2eaf5266",
        title: "NEON DISTRICT OVERVIEW",
        subtitle: "Aerial view of the sprawling megacity",
        description: "Explore the vast cyberpunk metropolis from above, where neon lights pierce through the eternal darkness of District 7."
      },
      {
        id: 2,
        url: "https://images.unsplash.com/photo-1512364615838-8088a04a778b",
        title: "DOWNTOWN SECTOR",
        subtitle: "Street-level urban exploration",
        description: "Navigate through the dense urban landscape where corporate towers and underground networks intersect."
      },
      {
        id: 3,
        url: "https://images.pexels.com/photos/4090093/pexels-photo-4090093.jpeg",
        title: "PLAYER APARTMENT",
        subtitle: "Your personal neural sanctuary",
        description: "Customize your living space with futuristic amenities and advanced neural interface technology."
      },
      {
        id: 4,
        url: "https://images.unsplash.com/photo-1613046883984-dcf0c289b896",
        title: "SHADOW ALLEYS",
        subtitle: "Hidden passages of the underground",
        description: "Discover secret routes through the city's dark underbelly where resistance movements thrive."
      }
    ];

    const openLightbox = (image) => {
      setSelectedImage(image);
      setIsLightboxOpen(true);
    };

    const closeLightbox = () => {
      setIsLightboxOpen(false);
      setSelectedImage(null);
    };

    const nextImage = () => {
      const currentIndex = gameplayImages.findIndex(img => img.id === selectedImage.id);
      const nextIndex = (currentIndex + 1) % gameplayImages.length;
      setSelectedImage(gameplayImages[nextIndex]);
    };

    const prevImage = () => {
      const currentIndex = gameplayImages.findIndex(img => img.id === selectedImage.id);
      const prevIndex = (currentIndex - 1 + gameplayImages.length) % gameplayImages.length;
      setSelectedImage(gameplayImages[prevIndex]);
    };

    return (
      <>
        <div className="section-container visual-archive-section" id="visual-archive">
          <div className="section-content">
            {/* Background Effects */}
            <div className="visual-bg-effects">
              <div className="visual-grid-overlay"></div>
              <div className="visual-scan-lines"></div>
              <div className="visual-particles"></div>
            </div>

            {/* Visual Archive Content */}
            <div className="visual-container">
              <motion.div
                className="visual-header"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h2 className="visual-title">
                  <span className="visual-icon">📷</span>
                  {t('visual_archive_full_title')}
                </h2>
                <p className="visual-subtitle">
                  {t('visual_archive_description')}
                </p>
              </motion.div>

              <div className="gameplay-gallery">
                {gameplayImages.map((image, index) => (
                  <motion.div
                    key={image.id}
                    className="gallery-item"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.2, duration: 0.6 }}
                    onClick={() => openLightbox(image)}
                  >
                    <div className="image-container">
                      <img 
                        src={`${image.url}?w=600&h=400&fit=crop&auto=format&q=80`}
                        alt={t('image_alt_gameplay')}
                        className="gameplay-image"
                        loading="lazy"
                      />
                      
                      {/* Image Overlay */}
                      <div className="image-overlay">
                        <div className="overlay-content">
                          <h3 className="image-title">{image.title}</h3>
                          <p className="image-subtitle">{image.subtitle}</p>
                          <div className="view-indicator">
                            <ZoomIn size={24} />
                            <span>ENTER NEURAL LINK</span>
                          </div>
                        </div>
                      </div>

                      {/* Glitch Effect */}
                      <div className="glitch-effect"></div>
                      
                      {/* Scan Lines */}
                      <div className="image-scanlines"></div>
                    </div>

                    <div className="image-info">
                      <h4 className="info-title">{image.title}</h4>
                      <p className="info-description">{image.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Lightbox Modal */}
        <AnimatePresence>
          {isLightboxOpen && selectedImage && (
            <motion.div
              className="lightbox-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeLightbox}
            >
              <motion.div
                className="lightbox-container"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <button className="lightbox-close" onClick={closeLightbox}>
                  <X size={24} />
                </button>

                {/* Navigation Arrows */}
                <button className="lightbox-nav prev" onClick={prevImage}>
                  <ChevronDown size={32} style={{ transform: 'rotate(90deg)' }} />
                </button>
                <button className="lightbox-nav next" onClick={nextImage}>
                  <ChevronDown size={32} style={{ transform: 'rotate(-90deg)' }} />
                </button>

                {/* Image */}
                <div className="lightbox-image-container">
                  <img 
                    src={`${selectedImage.url}?w=1200&h=800&fit=crop&auto=format&q=90`}
                    alt={t('image_alt_gameplay')}
                    className="lightbox-image"
                  />
                  
                  {/* Info Panel */}
                  <div className="lightbox-info">
                    <h3 className="lightbox-title">{selectedImage.title}</h3>
                    <p className="lightbox-subtitle">{selectedImage.subtitle}</p>
                    <p className="lightbox-description">{selectedImage.description}</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
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

  const LiveActivitySection = () => {
    const [liveData, setLiveData] = useState({
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
    const [timeOfDay, setTimeOfDay] = useState('day');

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

    // Set time of day based on hour
    useEffect(() => {
      const hour = liveData.currentTime.hour;
      if (hour >= 6 && hour < 18) {
        setTimeOfDay('day');
      } else if (hour >= 18 && hour < 22) {
        setTimeOfDay('evening');
      } else {
        setTimeOfDay('night');
      }
    }, [liveData.currentTime.hour]);

    return (
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
                    {String(liveData.currentTime.hour).padStart(2, '0')}:
                    {String(liveData.currentTime.minute).padStart(2, '0')}
                  </span>
                  <span className="time-period">{liveData.currentTime.period}</span>
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
  };

  const ZeroMarketSection = () => {
    const [activeCategory, setActiveCategory] = useState('all');
    const [selectedFilters, setSelectedFilters] = useState({
      rarity: [],
      price: 'all'
    });
    const [cart, setCart] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const sectionRef = useRef(null);

    // Initialize visual effects
    useEffect(() => {
      // Add a small delay to ensure DOM is fully rendered
      const timer = setTimeout(() => {
        if (sectionRef.current) {
          import('./zeroMarketEffects.js').then(({ initZeroMarketEffects }) => {
            initZeroMarketEffects(sectionRef.current);
          }).catch(error => {
            console.error('Failed to load zeroMarketEffects:', error);
          });
        }
        // Removed console warning as it's expected behavior on first render
      }, 150); // Slightly increased delay for better reliability

      return () => clearTimeout(timer);
    }, []); // Dependency array to prevent re-running

    // Enhanced product data with better structure
    const products = [
      {
        id: 1,
        name: "Neural Chip MK-VII",
        category: "cybernetics",
        rarity: "legendary",
        price: 4500,
        originalPrice: 6000,
        description: "Military-grade neural enhancement chip. Direct cortex interface with 99.7% compatibility rate.",
        image: "🧠",
        stock: 3,
        tags: ["neural", "military", "enhancement"],
        specs: ["7nm architecture", "Quantum encryption", "Bio-compatible"],
        popularity: 95
      },
      {
        id: 2,
        name: "Holo T-Shirt",
        category: "apparel",
        rarity: "rare",
        price: 89,
        originalPrice: 120,
        description: "Smart fabric with programmable holographic patterns. Street fashion meets cutting-edge tech.",
        image: "👕",
        stock: 12,
        tags: ["fashion", "holo", "smart"],
        specs: ["Smart fiber", "RGB adaptive", "Machine washable"],
        popularity: 78
      },
      {
        id: 3,
        name: "Data Blade",
        category: "weapons",
        rarity: "epic",
        price: 2300,
        originalPrice: 2300,
        description: "Monofilament edge with integrated data storage. Cuts through steel and encrypts data simultaneously.",
        image: "⚔️",
        stock: 5,
        tags: ["blade", "data", "weapon"],
        specs: ["Monofilament edge", "1TB storage", "Biometric lock"],
        popularity: 88
      },
      {
        id: 4,
        name: "Quantum Deck",
        category: "tech",
        rarity: "legendary",
        price: 8900,
        originalPrice: 12000,
        description: "Portable quantum computing deck. Process impossible calculations in your backpack.",
        image: "💻",
        stock: 1,
        tags: ["quantum", "computing", "portable"],
        specs: ["Quantum processor", "Portable design", "AI assistant"],
        popularity: 92
      },
      {
        id: 5,
        name: "Stealth Cloak",
        category: "gear",
        rarity: "epic",
        price: 3400,
        originalPrice: 4200,
        description: "Adaptive camouflage cloak with optical bending technology. Nearly invisible to most sensors.",
        image: "🥷",
        stock: 7,
        tags: ["stealth", "cloak", "optical"],
        specs: ["Optical bending", "8hr battery", "Silent operation"],
        popularity: 85
      },
      {
        id: 6,
        name: "Void Grenade",
        category: "weapons",
        rarity: "classified",
        price: 15000,
        originalPrice: 15000,
        description: "[CLASSIFIED] Experimental void-tech ordnance. Reality distortion effects. Handle with extreme caution.",
        image: "💣",
        stock: 0,
        tags: ["void", "experimental", "classified"],
        specs: ["Void technology", "Reality distortion", "Single use"],
        popularity: 99,
        locked: true
      }
    ];

    const categories = [
      { id: 'all', name: 'All Items', icon: '🌐' },
      { id: 'cybernetics', name: 'Cybernetics', icon: '🧠' },
      { id: 'weapons', name: 'Weapons', icon: '⚔️' },
      { id: 'apparel', name: 'Apparel', icon: '👕' },
      { id: 'tech', name: 'Tech', icon: '💻' },
      { id: 'gear', name: 'Gear', icon: '🎒' }
    ];

    const rarities = [
      { id: 'common', name: 'Common', color: '#888888' },
      { id: 'rare', name: 'Rare', color: '#00aaff' },
      { id: 'epic', name: 'Epic', color: '#aa00ff' },
      { id: 'legendary', name: 'Legendary', color: '#ff6600' },
      { id: 'classified', name: 'Classified', color: '#ff0040' }
    ];

    // Filter products
    const filteredProducts = products.filter(product => {
      const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesRarity = selectedFilters.rarity.length === 0 || selectedFilters.rarity.includes(product.rarity);
      
      let matchesPrice = true;
      if (selectedFilters.price === 'low') matchesPrice = product.price < 1000;
      else if (selectedFilters.price === 'mid') matchesPrice = product.price >= 1000 && product.price < 5000;
      else if (selectedFilters.price === 'high') matchesPrice = product.price >= 5000;

      return matchesCategory && matchesSearch && matchesRarity && matchesPrice;
    });

    const addToCart = (product) => {
      if (product.locked || product.stock === 0) return;
      setCart(prev => [...prev, product]);
    };

    const removeFromCart = (productId) => {
      setCart(prev => prev.filter((item, index) => index !== productId));
    };

    const getTotalPrice = () => {
      return cart.reduce((sum, item) => sum + item.price, 0);
    };

    const handleCheckout = () => {
      if (cart.length > 0) {
        alert(`Order confirmed! ${cart.length} items - ₦${getTotalPrice().toLocaleString()}\n\nItems will be delivered to your neural mailbox within 24 hours.`);
        setCart([]);
      }
    };

    const toggleRarityFilter = (rarity) => {
      setSelectedFilters(prev => ({
        ...prev,
        rarity: prev.rarity.includes(rarity) 
          ? prev.rarity.filter(r => r !== rarity)
          : [...prev.rarity, rarity]
      }));
    };

    return (
      <div className="zeromarket-v2" ref={sectionRef}>
        {/* Header */}
        <div className="zm-header">
          <div className="zm-header-content">
            <h1 className="zm-title">
              <span className="zm-title-main">ZERO</span>
              <span className="zm-title-accent">MARKET</span>
            </h1>
            <p className="zm-subtitle">Underground Tech Exchange • Neural Commerce Authorized</p>
            
            {/* Search Bar */}
            <div className="zm-search">
              <input
                type="text"
                placeholder="Search neural tech..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="zm-search-input"
              />
              <span className="zm-search-icon">🔍</span>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="zm-categories">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`zm-category-btn ${activeCategory === category.id ? 'active' : ''}`}
            >
              <span className="zm-category-icon">{category.icon}</span>
              <span className="zm-category-name">{category.name}</span>
            </button>
          ))}
        </div>

        <div className="zm-main">
          {/* Filters Sidebar */}
          <div className="zm-filters">
            <h3 className="zm-filter-title">Filters</h3>
            
            {/* Rarity Filter */}
            <div className="zm-filter-group">
              <h4 className="zm-filter-label">Rarity</h4>
              {rarities.map(rarity => (
                <label key={rarity.id} className="zm-filter-option">
                  <input
                    type="checkbox"
                    checked={selectedFilters.rarity.includes(rarity.id)}
                    onChange={() => toggleRarityFilter(rarity.id)}
                    className="zm-checkbox"
                  />
                  <span className="zm-checkbox-custom" style={{ borderColor: rarity.color }}></span>
                  <span className="zm-filter-text" style={{ color: rarity.color }}>{rarity.name}</span>
                </label>
              ))}
            </div>

            {/* Price Filter */}
            <div className="zm-filter-group">
              <h4 className="zm-filter-label">Price Range</h4>
              <select 
                value={selectedFilters.price} 
                onChange={(e) => setSelectedFilters(prev => ({...prev, price: e.target.value}))}
                className="zm-select"
              >
                <option value="all">All Prices</option>
                <option value="low">Under ₦1,000</option>
                <option value="mid">₦1,000 - ₦5,000</option>
                <option value="high">Over ₦5,000</option>
              </select>
            </div>

            {/* Cart Summary */}
            <div className="zm-cart-summary">
              <h4 className="zm-cart-title">Neural Cart</h4>
              <div className="zm-cart-info">
                <span className="zm-cart-count">{cart.length} items</span>
                <span className="zm-cart-total">₦{getTotalPrice().toLocaleString()}</span>
              </div>
              <button 
                onClick={handleCheckout}
                disabled={cart.length === 0}
                className="zm-checkout-btn"
              >
                {cart.length === 0 ? 'Cart Empty' : 'Neural Transfer'}
              </button>
            </div>
          </div>

          {/* Products Grid */}
          <div className="zm-products">
            <div className="zm-products-header">
              <span className="zm-results-count">{filteredProducts.length} items found</span>
              <span className="zm-sort">Sort: Popularity ↓</span>
            </div>
            
            <div className="zm-products-grid">
              {filteredProducts.map(product => (
                <motion.div
                  key={product.id}
                  className={`zm-product-card ${product.locked ? 'locked' : ''} ${product.stock === 0 ? 'out-of-stock' : ''}`}
                  whileHover={{ y: -5, scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  {/* Product Header */}
                  <div className="zm-product-header">
                    <span className={`zm-rarity rarity-${product.rarity}`}>
                      {product.rarity.toUpperCase()}
                    </span>
                    {product.originalPrice > product.price && (
                      <span className="zm-sale-badge">SALE</span>
                    )}
                  </div>

                  {/* Product Image */}
                  <div className="zm-product-image">
                    <span className="zm-product-icon">{product.image}</span>
                    {product.locked && <div className="zm-lock-overlay">🔒</div>}
                    {product.stock === 0 && !product.locked && <div className="zm-stock-overlay">OUT OF STOCK</div>}
                  </div>

                  {/* Product Info */}
                  <div className="zm-product-info">
                    <h3 className="zm-product-name">{product.name}</h3>
                    <p className="zm-product-description">{product.description}</p>
                    
                    {/* Specs */}
                    <div className="zm-product-specs">
                      {product.specs.slice(0, 2).map((spec, index) => (
                        <span key={index} className="zm-spec-tag">{spec}</span>
                      ))}
                    </div>

                    {/* Price */}
                    <div className="zm-product-price">
                      <span className="zm-price-current">₦{product.price.toLocaleString()}</span>
                      {product.originalPrice > product.price && (
                        <span className="zm-price-original">₦{product.originalPrice.toLocaleString()}</span>
                      )}
                    </div>

                    {/* Stock Info */}
                    <div className="zm-product-stock">
                      {product.stock > 0 && !product.locked && (
                        <span className="zm-stock-count">{product.stock} in stock</span>
                      )}
                    </div>

                    {/* Add to Cart Button */}
                    <button
                      onClick={() => addToCart(product)}
                      disabled={product.locked || product.stock === 0}
                      className="zm-add-to-cart"
                    >
                      {product.locked ? 'CLASSIFIED' : 
                       product.stock === 0 ? 'OUT OF STOCK' : 
                       'Add to Cart'}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

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
    const [systemStats, setSystemStats] = useState({
      networkLoad: 73.2,
      securityLevel: 94.8,
      dataFlow: 847320,
      activeSessions: 2847,
      threatLevel: 23.1
    });

    // Live system stats updates
    useEffect(() => {
      const interval = setInterval(() => {
        setSystemStats(prev => ({
          networkLoad: Math.max(60, Math.min(95, prev.networkLoad + (Math.random() * 4 - 2))),
          securityLevel: Math.max(85, Math.min(99, prev.securityLevel + (Math.random() * 2 - 1))),
          dataFlow: prev.dataFlow + Math.floor(Math.random() * 10000) - 5000,
          activeSessions: Math.max(2000, prev.activeSessions + Math.floor(Math.random() * 40) - 20),
          threatLevel: Math.max(0, Math.min(100, prev.threatLevel + (Math.random() * 6 - 3)))
        }));
      }, 2000);
      
      return () => clearInterval(interval);
    }, []);

    const getStatusColor = (value, type) => {
      if (type === 'threat') {
        if (value < 25) return '#00ff88';
        if (value < 50) return '#ffff00';
        if (value < 75) return '#ff8800';
        return '#ff0040';
      } else {
        if (value > 90) return '#00ff88';
        if (value > 70) return '#00ffff';
        if (value > 50) return '#ffff00';
        return '#ff8800';
      }
    };

    return (
      <div className="section-container stats-section">
        <div className="section-content">
          <h2 className="section-title">{t('neural_stats_title')}</h2>
          
          {/* Real-time Game Stats */}
          <div className="stats-grid">
            {gameStats && (
              <>
                <motion.div 
                  className="stat-card primary-stat"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <Users className="stat-icon" />
                  <div className="stat-number">{gameStats.players_online?.toLocaleString()}</div>
                  <div className="stat-label">NEURAL LINKS</div>
                  <div className="stat-sublabel">Active connections</div>
                </motion.div>
                
                <motion.div 
                  className="stat-card"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <Download className="stat-icon" />
                  <div className="stat-number">{gameStats.beta_downloads?.toLocaleString()}</div>
                  <div className="stat-label">DOWNLOADS</div>
                  <div className="stat-sublabel">Beta installs</div>
                </motion.div>
                
                <motion.div 
                  className="stat-card"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <Star className="stat-icon" />
                  <div className="stat-number">{gameStats.wishlist_count?.toLocaleString()}</div>
                  <div className="stat-label">WISHLIST</div>
                  <div className="stat-sublabel">Queue pending</div>
                </motion.div>
                
                <motion.div 
                  className="stat-card"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <Activity className="stat-icon" />
                  <div className="stat-number">{gameStats.rating}</div>
                  <div className="stat-label">RATING</div>
                  <div className="stat-sublabel">Sync score</div>
                </motion.div>
              </>
            )}
          </div>

          {/* System Monitoring Dashboard */}
          <div className="system-dashboard">
            <h3 className="dashboard-title">SYSTEM MONITORING</h3>
            
            <div className="monitoring-grid">
              <motion.div 
                className="monitor-card"
                whileHover={{ scale: 1.02 }}
              >
                <div className="monitor-header">
                  <Monitor className="monitor-icon" />
                  <span>Network Load</span>
                </div>
                <div className="monitor-value" style={{ color: getStatusColor(systemStats.networkLoad, 'normal') }}>
                  {systemStats.networkLoad.toFixed(1)}%
                </div>
                <div className="monitor-bar">
                  <div 
                    className="monitor-fill"
                    style={{ 
                      width: `${systemStats.networkLoad}%`,
                      backgroundColor: getStatusColor(systemStats.networkLoad, 'normal')
                    }}
                  ></div>
                </div>
              </motion.div>

              <motion.div 
                className="monitor-card"
                whileHover={{ scale: 1.02 }}
              >
                <div className="monitor-header">
                  <Shield className="monitor-icon" />
                  <span>Security Level</span>
                </div>
                <div className="monitor-value" style={{ color: getStatusColor(systemStats.securityLevel, 'normal') }}>
                  {systemStats.securityLevel.toFixed(1)}%
                </div>
                <div className="monitor-bar">
                  <div 
                    className="monitor-fill"
                    style={{ 
                      width: `${systemStats.securityLevel}%`,
                      backgroundColor: getStatusColor(systemStats.securityLevel, 'normal')
                    }}
                  ></div>
                </div>
              </motion.div>

              <motion.div 
                className="monitor-card"
                whileHover={{ scale: 1.02 }}
              >
                <div className="monitor-header">
                  <Zap className="monitor-icon" />
                  <span>Data Flow</span>
                </div>
                <div className="monitor-value" style={{ color: '#00ffff' }}>
                  {(systemStats.dataFlow / 1000).toFixed(1)}K
                </div>
                <div className="monitor-sublabel">packets/sec</div>
              </motion.div>

              <motion.div 
                className="monitor-card"
                whileHover={{ scale: 1.02 }}
              >
                <div className="monitor-header">
                  <Globe className="monitor-icon" />
                  <span>Active Sessions</span>
                </div>
                <div className="monitor-value" style={{ color: '#00ff88' }}>
                  {systemStats.activeSessions.toLocaleString()}
                </div>
                <div className="monitor-sublabel">concurrent users</div>
              </motion.div>

              <motion.div 
                className="monitor-card threat-monitor"
                whileHover={{ scale: 1.02 }}
              >
                <div className="monitor-header">
                  <AlertTriangle className="monitor-icon" />
                  <span>Threat Level</span>
                </div>
                <div className="monitor-value" style={{ color: getStatusColor(systemStats.threatLevel, 'threat') }}>
                  {systemStats.threatLevel.toFixed(1)}%
                </div>
                <div className="monitor-bar">
                  <div 
                    className="monitor-fill"
                    style={{ 
                      width: `${systemStats.threatLevel}%`,
                      backgroundColor: getStatusColor(systemStats.threatLevel, 'threat')
                    }}
                  ></div>
                </div>
              </motion.div>

              <motion.div 
                className="monitor-card status-monitor"
                whileHover={{ scale: 1.02 }}
              >
                <div className="monitor-header">
                  <Terminal className="monitor-icon" />
                  <span>System Status</span>
                </div>
                <div className="status-display">
                  <div className="status-item">
                    <span className="status-dot online"></span>
                    <span>Neural Core: ONLINE</span>
                  </div>
                  <div className="status-item">
                    <span className="status-dot online"></span>
                    <span>Data Matrix: STABLE</span>
                  </div>
                  <div className="status-item">
                    <span className="status-dot warning"></span>
                    <span>Firewall: ELEVATED</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="app">
      {/* ID Scan Entry - Shows first, then main app */}
      {showIDScan && (
        <IDScanEntry onComplete={handleIDScanComplete} />
      )}
      
      {/* Render alternate reality if not primary and main app is visible */}
      {mainAppVisible && currentReality !== 'primary' && renderCurrentReality()}
      
      {/* Only render main app content if in primary reality and main app is visible */}
      {mainAppVisible && currentReality === 'primary' && (
        <>
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
          
          <div className="header-controls">
            {/* Auth Controls */}
            <div className="auth-controls">
              {isAuthenticated ? (
                <div className="user-menu">
                  <div className="user-info">
                    <span className="user-icon">🧠</span>
                    <span className="username">{user?.username}</span>
                  </div>
                  <button 
                    className="logout-btn"
                    onClick={handleLogout}
                    title="Disconnect from Z-Net"
                  >
                    <Send size={16} />
                  </button>
                </div>
              ) : (
                <button 
                  className="auth-btn"
                  onClick={() => {
                    setAuthMode('login');
                    setShowAuthModal(true);
                  }}
                >
                  <span>ACCOUNT</span>
                </button>
              )}
            </div>

            {/* Navigation Toggle */}
            <button 
              className={`hamburger-menu ${menuOpen ? 'open' : ''}`}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={t('open_menu')}
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Futuristic Right-Aligned Glassmorphism Menu */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="menu-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setMenuOpen(false)}
            />
            
            {/* Minimalist HUD-Style Navigation Menu */}
            <motion.nav 
              className="navigation-menu"
              initial={{ opacity: 0, x: 30, scale: 0.98 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 30, scale: 0.98 }}
              transition={{ 
                duration: 0.3, 
                ease: [0.4, 0, 0.2, 1]
              }}
            >
              <div className="menu-content">
                {/* Clean HUD Header */}
                <div className="menu-header">
                  <h3>System Menu</h3>
                </div>
                
                {/* Smooth Dropdown Panel */}
                <div className="menu-items">
                  {menuItems.map((item, index) => (
                    <div key={item.id}>
                      {item.isLanguageSelector ? (
                        <div className="language-dropdown">
                          <motion.button
                            className={`menu-item ${languageMenuOpen ? 'active' : ''}`}
                            onClick={() => navigateToSection('language')}
                            initial={{ opacity: 0, x: 15 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.04, duration: 0.25 }}
                          >
                            <div className="menu-item-icon">{item.icon}</div>
                            <span>{item.label}</span>
                            <ChevronDown 
                              className={`item-chevron ${languageMenuOpen ? 'rotated' : ''}`} 
                              size={14} 
                            />
                          </motion.button>
                          
                          <AnimatePresence>
                            {languageMenuOpen && (
                              <motion.div
                                className="language-dropdown-menu"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.25 }}
                              >
                                {languages.map((lang) => (
                                  <div
                                    key={lang.code}
                                    className={`language-option ${currentLanguage === lang.code ? 'active' : ''}`}
                                    onClick={() => selectLanguage(lang.code)}
                                  >
                                    <span className="language-flag">{lang.flag}</span>
                                    <span className="language-name">{lang.name}</span>
                                    {currentLanguage === lang.code && (
                                      <div className="active-indicator"></div>
                                    )}
                                  </div>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ) : (
                        <motion.button
                          className={`menu-item ${currentSection === item.id ? 'active' : ''} ${item.isLocked ? 'locked' : ''}`}
                          onClick={() => navigateToSection(item.id)}
                          disabled={item.isLocked}
                          initial={{ opacity: 0, x: 15 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.04, duration: 0.25 }}
                        >
                          <div className="menu-item-icon">{item.icon}</div>
                          <span>{item.label}</span>
                          {item.isLocked && (
                            <div className="lock-indicator">
                              <Lock size={12} />
                            </div>
                          )}
                        </motion.button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>

      {/* Main Content - Scrollable Homepage */}
      <main className="main-content scrollable-homepage">
        {/* Hero Section */}
        <div id="hero">
          <HeroSection />
        </div>

        {/* Broadcast TV Section */}
        <div id="broadcast">
          <BroadcastSection />
        </div>

        {/* Features/About Section */}
        <div id="about">
          <AboutSection />
        </div>

        {/* Wishlist/Beta Section */}
        <div id="beta">
          <BetaSection />
        </div>

        {/* Support Section (directly on homepage) */}
        <div id="support">
          <SupportSection />
        </div>

        {/* Visual Archive Section */}
        <div id="visual-archive">
          <VisualArchiveSection />
        </div>

        {/* FAQ Section */}
        <div id="faq">
          <FAQSection />
        </div>

        {/* Alia Nox Section */}
        <div id="alia">
          <AliaNoxSection />
        </div>

        {/* Character Customization Section */}
        <div id="character">
          <CharacterCustomizationSection />
        </div>

        {/* PC Requirements Section */}
        <div id="pc_requirements">
          <PCRequirementsSection />
        </div>

        {/* Game Stats Section */}
        <div id="stats">
          <StatsSection />
        </div>

        {/* Live Activity Section */}
        <div id="live_activity">
          <LiveActivitySection />
        </div>

        {/* ZEROMARKET Section */}
        <div id="zeromarket">
          <ZeroMarketSection />
        </div>

        {/* Reality Fractures Section */}
        <div id="reality-fractures">
          <RealityFractures onResetToMain={handleRealityChange} />
        </div>

        {/* YougnShop Section */}
        <div id="yougnshop">
          <YougnShopPage />
        </div>

        {/* Roadmap Section */}
        <div id="roadmap">
          <RoadmapSection />
        </div>

        {/* Modding Hub Section */}
        <div id="modding">
          <ModdingHubComingSoon />
        </div>

        {/* Contact Section */}
        <div id="contact">
          <ContactSection />
        </div>

        {/* Footer Copyright */}
        <footer className="site-footer">
          <div className="footer-content">
            <div className="footer-text">
              Zeropunk © 2025
            </div>
            <div className="footer-glow"></div>
          </div>
        </footer>
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
                  aria-label={t('close_chat')}
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

      {/* Authentication Modal */}
      <AnimatePresence>
        {showAuthModal && <AuthModal />}
      </AnimatePresence>
      </>
      )}
    </div>
  );
};

export default App;