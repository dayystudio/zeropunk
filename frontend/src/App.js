import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Zap, Users, Download, Star, MessageCircle, Play, Eye, ChevronDown, AlertTriangle, Lock, Globe, Menu, X, Home, Info, BarChart3, Bot, Map, Gamepad2 } from 'lucide-react';
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
  const [currentLanguage, setCurrentLanguage] = useState('en');
  
  // Navigation state
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState('hero');

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuOpen && !event.target.closest('.navigation-menu') && !event.target.closest('.hamburger-menu')) {
        setMenuOpen(false);
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
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => document.removeEventListener('keydown', handleEscKey);
  }, []);

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
        content: t('neural_link_disrupted'), 
        timestamp: new Date() 
      };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const navigateToSection = (section) => {
    setCurrentSection(section);
    setMenuOpen(false);
  };

  // Translations
  const translations = {
    en: {
      // Navigation
      home: 'Home',
      features: 'Features',
      beta_access: 'Beta Access',
      ai_chat: 'AI Chat',
      game_stats: 'Game Stats',
      roadmap: 'Roadmap',
      neural_interface_menu: 'NEURAL INTERFACE MENU',
      language: 'Language',

      // Hero Section
      hero_subtitle: 'ZeropunkOS v0.92 | Guest Access | dayystudio',
      hero_message: 'You are not the hero. You are a citizen — another cog in the fractured system. But the system is crumbling, and you might be the spark.',
      enter_beta: 'ENTER THE BETA',
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
      beta_title: 'BETA ACCESS',
      beta_warning: 'WARNING: Neural Interface Testing Phase Active',
      beta_description: 'Join the closed beta and experience the future of AI-powered gaming. Your neural patterns will help train our advanced AI systems.',
      system_requirements: 'System Requirements',
      neural_compatibility: 'Neural compatibility index: 7.5+',
      consciousness_stability: 'Consciousness stability rating: B-Class minimum',
      memory_fragmentation: 'Memory fragmentation: <15%',
      quantum_processing: 'Quantum processing capabilities: Recommended',
      request_beta_access: 'REQUEST BETA ACCESS',
      view_system_specs: 'VIEW SYSTEM SPECS',

      // Alia Section
      alia_title: 'ALIA NOX',
      alia_description: 'Meet Alia Nox, your guide through the fractured digital landscape. She\'s not just an AI assistant—she\'s a consciousness born from the collective memories of the city\'s neural network.',
      advanced_memory: 'Advanced Memory Systems',
      natural_language: 'Natural Language Processing',
      emotional_intelligence: 'Real-time Emotional Intelligence',
      initiate_neural_link: 'INITIATE NEURAL LINK',

      // Stats Section
      stats_title: 'SYSTEM STATISTICS',
      active_neural_links: 'Active Neural Links',
      beta_downloads: 'Beta Downloads',
      wishlist_count: 'Wishlist Count',
      neural_rating: 'Neural Rating',

      // Roadmap Section
      roadmap_title: 'DEVELOPMENT ROADMAP',

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
      ai_chat: 'AI 聊天',
      game_stats: '游戏统计',
      roadmap: '路线图',
      neural_interface_menu: '神经接口菜单',
      language: '语言',

      // Hero Section
      hero_subtitle: 'ZeropunkOS v0.92 | 访客模式 | dayystudio',
      hero_message: '你不是英雄。你是一个公民——破碎系统中的又一个齿轮。但系统正在崩溃，而你可能就是那个火花。',
      enter_beta: '进入测试版',
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
      beta_title: '测试版访问',
      beta_warning: '警告：神经接口测试阶段激活',
      beta_description: '加入封闭测试版，体验AI驱动游戏的未来。你的神经模式将帮助训练我们先进的AI系统。',
      system_requirements: '系统要求',
      neural_compatibility: '神经兼容性指数：7.5+',
      consciousness_stability: '意识稳定性评级：B级最低',
      memory_fragmentation: '记忆碎片化：<15%',
      quantum_processing: '量子处理能力：推荐',
      request_beta_access: '请求测试版访问',
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
      ai_chat: 'Chat IA',
      game_stats: 'Statistiques',
      roadmap: 'Feuille de Route',
      neural_interface_menu: 'MENU INTERFACE NEURALE',
      language: 'Langue',

      // Hero Section
      hero_subtitle: 'ZeropunkOS v0.92 | Accès Invité | dayystudio',
      hero_message: 'Vous n\'êtes pas le héros. Vous êtes un citoyen — un autre rouage dans le système fracturé. Mais le système s\'effrite, et vous pourriez être l\'étincelle.',
      enter_beta: 'ENTRER DANS LA BÊTA',
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
      beta_title: 'ACCÈS BÊTA',
      beta_warning: 'ATTENTION : Phase de Test d\'Interface Neurale Active',
      beta_description: 'Rejoignez la bêta fermée et découvrez l\'avenir du jeu alimenté par IA. Vos modèles neuraux aideront à entraîner nos systèmes IA avancés.',
      system_requirements: 'Configuration Requise',
      neural_compatibility: 'Index de compatibilité neurale : 7.5+',
      consciousness_stability: 'Évaluation de stabilité de conscience : Classe B minimum',
      memory_fragmentation: 'Fragmentation de mémoire : <15%',
      quantum_processing: 'Capacités de traitement quantique : Recommandé',
      request_beta_access: 'DEMANDER ACCÈS BÊTA',
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
    { id: 'beta', label: t('beta_access'), icon: <Gamepad2 size={20} /> },
    { id: 'alia', label: t('ai_chat'), icon: <Bot size={20} /> },
    { id: 'stats', label: t('game_stats'), icon: <BarChart3 size={20} /> },
    { id: 'roadmap', label: t('roadmap'), icon: <Map size={20} /> }
  ];

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

  const BetaSection = () => (
    <div className="section-container beta-section">
      <div className="section-content">
        <h2 className="section-title">{t('beta_title')}</h2>
        <div className="beta-grid">
          <div className="beta-content">
            <div className="beta-warning">
              <AlertTriangle className="warning-icon" />
              <span>{t('beta_warning')}</span>
            </div>
            
            <p className="beta-description">
              {t('beta_description')}
            </p>
            
            <div className="beta-requirements">
              <h3>{t('system_requirements')}</h3>
              <ul>
                <li>{t('neural_compatibility')}</li>
                <li>{t('consciousness_stability')}</li>
                <li>{t('memory_fragmentation')}</li>
                <li>{t('quantum_processing')}</li>
              </ul>
            </div>
            
            <div className="beta-buttons">
              <button className="cta-button primary">
                <Lock className="icon" />
                {t('request_beta_access')}
              </button>
              <button className="cta-button secondary">
                <Globe className="icon" />
                {t('view_system_specs')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

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

  const StatsSection = () => (
    <div className="section-container stats-section">
      <div className="section-content">
        <h2 className="section-title">{t('stats_title')}</h2>
        <div className="stats-grid">
          {gameStats && (
            <>
              <motion.div 
                className="stat-card"
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <Users className="stat-icon" />
                <div className="stat-value">{gameStats.players_online.toLocaleString()}</div>
                <div className="stat-label">{t('active_neural_links')}</div>
              </motion.div>
              
              <motion.div 
                className="stat-card"
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <Download className="stat-icon" />
                <div className="stat-value">{gameStats.beta_downloads.toLocaleString()}</div>
                <div className="stat-label">{t('beta_downloads')}</div>
              </motion.div>
              
              <motion.div 
                className="stat-card"
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <Star className="stat-icon" />
                <div className="stat-value">{gameStats.wishlist_count.toLocaleString()}</div>
                <div className="stat-label">{t('wishlist_count')}</div>
              </motion.div>
              
              <motion.div 
                className="stat-card"
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <Brain className="stat-icon" />
                <div className="stat-value">{gameStats.rating}/5</div>
                <div className="stat-label">{t('neural_rating')}</div>
              </motion.div>
            </>
          )}
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

  const renderCurrentSection = () => {
    switch (currentSection) {
      case 'hero': return <HeroSection />;
      case 'about': return <AboutSection />;
      case 'beta': return <BetaSection />;
      case 'alia': return <AliaNoxSection />;
      case 'stats': return <StatsSection />;
      case 'roadmap': return <RoadmapSection />;
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
                    <motion.button
                      key={item.id}
                      className={`menu-item ${currentSection === item.id ? 'active' : ''}`}
                      onClick={() => navigateToSection(item.id)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </motion.button>
                  ))}
                </div>
                
                <div className="menu-footer">
                  <div className="language-selector">
                    <span className="language-label">{t('language')}:</span>
                    <select 
                      value={currentLanguage}
                      onChange={(e) => setCurrentLanguage(e.target.value)}
                      className="language-select"
                    >
                      {languages.map(lang => (
                        <option key={lang.code} value={lang.code}>
                          {lang.flag} {lang.name}
                        </option>
                      ))}
                    </select>
                  </div>
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