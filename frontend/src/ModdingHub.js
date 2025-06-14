import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Code, Download, Upload, Star, Eye, Users, Shield, Bot, FileText, 
  Image, Package, Zap, Github, ExternalLink, Search, Filter, Heart,
  MessageCircle, Share2, Clock, TrendingUp, Award, Cpu, Database,
  Terminal, BookOpen, Wrench, Palette, Camera, Play, Pause, RotateCcw,
  ZoomIn, ZoomOut, Sun, Moon, Layers, Settings, AlertTriangle, CheckCircle
} from 'lucide-react';

const ModdingHub = ({ currentLanguage = 'en' }) => {
  const [activeSection, setActiveSection] = useState('overview');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedMod, setSelectedMod] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [skinPreviewMode, setSkinPreviewMode] = useState('day');
  const [feedPosts, setFeedPosts] = useState([]);
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);
  const [glitchEffect, setGlitchEffect] = useState(false);
  
  // Translations
  const translations = {
    en: {
      title: 'MODDING HUB',
      subtitle: 'Creator Central • Neural Network Interface',
      overview: 'Hub Overview',
      documentation: 'Documentation',
      skinCreator: 'Skin Creator',
      uploadCenter: 'Upload Center',
      toolbox: 'Official Toolbox',
      featuredMods: 'Featured Mods',
      moddingFeed: 'Modding Feed',
      aiAssistant: 'AI Mod Assistant',
      totalMods: 'Total Mods',
      activeCreators: 'Active Creators',
      downloads: 'Downloads',
      communityRating: 'Community Rating'
    },
    fr: {
      title: 'HUB DE MODDING',
      subtitle: 'Central Créateur • Interface Réseau Neural',
      overview: 'Vue d\'ensemble',
      documentation: 'Documentation',
      skinCreator: 'Créateur de Skins',
      uploadCenter: 'Centre de Téléchargement',
      toolbox: 'Boîte à Outils Officielle',
      featuredMods: 'Mods en Vedette',
      moddingFeed: 'Fil de Modding',
      aiAssistant: 'Assistant IA Mod'
    },
    zh: {
      title: '模组中心',
      subtitle: '创作者中心 • 神经网络接口',
      overview: '中心概述',
      documentation: '文档',
      skinCreator: '皮肤创建器',
      uploadCenter: '上传中心',
      toolbox: '官方工具箱',
      featuredMods: '精选模组',
      moddingFeed: '模组动态',
      aiAssistant: 'AI 模组助手'
    }
  };

  const t = (key) => translations[currentLanguage]?.[key] || translations.en[key] || key;

  // Glitch effect trigger
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      setGlitchEffect(true);
      setTimeout(() => setGlitchEffect(false), 150);
    }, 5000 + Math.random() * 3000);

    return () => clearInterval(glitchInterval);
  }, []);

  // Mock data
  const hubStats = {
    totalMods: 2847,
    activeCreators: 1342,
    downloads: 98653,
    rating: 4.8
  };

  const featuredMods = [
    {
      id: 1,
      name: 'Neon District Enhanced',
      author: 'CyberCoder_X',
      category: 'Environment',
      downloads: 15420,
      rating: 4.9,
      thumbnail: '/api/placeholder/300/200',
      description: 'Ultra-realistic neon lighting overhaul for all city districts',
      tags: ['lighting', 'graphics', 'environment'],
      version: '2.3.1',
      gameVersion: '1.0.x'
    },
    {
      id: 2,
      name: 'Neural Enhancement Pack',
      author: 'BrainHacker',
      category: 'AI Behavior',
      downloads: 8934,
      rating: 4.7,
      thumbnail: '/api/placeholder/300/200',
      description: 'Advanced AI behavior patterns for more realistic NPCs',
      tags: ['ai', 'npc', 'behavior'],
      version: '1.5.0',
      gameVersion: '1.0.x'
    },
    {
      id: 3,
      name: 'Cyberpunk Weapon Arsenal',
      author: 'GunsmithPro',
      category: 'Weapons',
      downloads: 23567,
      rating: 4.8,
      thumbnail: '/api/placeholder/300/200',
      description: '50+ new weapons with unique animations and effects',
      tags: ['weapons', 'combat', 'effects'],
      version: '3.2.0',
      gameVersion: '1.0.x'
    }
  ];

  const navigationItems = [
    { id: 'overview', label: t('overview'), icon: <Eye size={20} /> },
    { id: 'documentation', label: t('documentation'), icon: <BookOpen size={20} /> },
    { id: 'skinCreator', label: t('skinCreator'), icon: <Palette size={20} /> },
    { id: 'uploadCenter', label: t('uploadCenter'), icon: <Upload size={20} /> },
    { id: 'toolbox', label: t('toolbox'), icon: <Wrench size={20} /> },
    { id: 'featuredMods', label: t('featuredMods'), icon: <Star size={20} /> },
    { id: 'moddingFeed', label: t('moddingFeed'), icon: <MessageCircle size={20} /> },
    { id: 'aiAssistant', label: t('aiAssistant'), icon: <Bot size={20} /> }
  ];

  // Overview Section
  const OverviewSection = () => (
    <div className="hub-section overview-section">
      <div className="section-header">
        <h2 className="section-title">MODDING HUB OVERVIEW</h2>
        <p className="section-subtitle">Central command for all creative operations</p>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <motion.div 
          className="stat-card"
          whileHover={{ scale: 1.02, y: -2 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="stat-icon">
            <Package size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{hubStats.totalMods.toLocaleString()}</div>
            <div className="stat-label">{t('totalMods')}</div>
          </div>
        </motion.div>

        <motion.div 
          className="stat-card"
          whileHover={{ scale: 1.02, y: -2 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="stat-icon">
            <Users size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{hubStats.activeCreators.toLocaleString()}</div>
            <div className="stat-label">{t('activeCreators')}</div>
          </div>
        </motion.div>

        <motion.div 
          className="stat-card"
          whileHover={{ scale: 1.02, y: -2 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="stat-icon">
            <Download size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{hubStats.downloads.toLocaleString()}</div>
            <div className="stat-label">{t('downloads')}</div>
          </div>
        </motion.div>

        <motion.div 
          className="stat-card"
          whileHover={{ scale: 1.02, y: -2 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="stat-icon">
            <Star size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{hubStats.rating}/5.0</div>
            <div className="stat-label">{t('communityRating')}</div>
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="action-grid">
          <button 
            className="action-btn"
            onClick={() => setActiveSection('uploadCenter')}
          >
            <Upload size={20} />
            <span>Upload Mod</span>
          </button>
          <button 
            className="action-btn"
            onClick={() => setActiveSection('skinCreator')}
          >
            <Palette size={20} />
            <span>Create Skin</span>
          </button>
          <button 
            className="action-btn"
            onClick={() => setActiveSection('documentation')}
          >
            <FileText size={20} />
            <span>View Docs</span>
          </button>
          <button 
            className="action-btn"
            onClick={() => setActiveSection('toolbox')}
          >
            <Download size={20} />
            <span>Download SDK</span>
          </button>
        </div>
      </div>
    </div>
  );

  // Documentation Section
  const DocumentationSection = () => (
    <div className="hub-section documentation-section">
      <div className="terminal-interface">
        <div className="terminal-header">
          <div className="terminal-controls">
            <div className="control-dot red"></div>
            <div className="control-dot yellow"></div>
            <div className="control-dot green"></div>
          </div>
          <div className="terminal-title">ZEROPUNK_MODDING_CODEX_v2.1</div>
        </div>
        
        <div className="terminal-content">
          <div className="terminal-line">
            <span className="prompt">root@zeropunk:~$</span>
            <span className="command">ls -la /docs/modding/</span>
          </div>
          
          <div className="doc-category">
            <h3 className="category-title">
              <Terminal size={16} />
              CREATION GUIDES
            </h3>
            <div className="doc-links">
              <a href="#" className="doc-link">
                <FileText size={14} />
                <span>Skin Creation Tutorial</span>
                <ExternalLink size={12} />
              </a>
              <a href="#" className="doc-link">
                <FileText size={14} />
                <span>Environment Modding</span>
                <ExternalLink size={12} />
              </a>
              <a href="#" className="doc-link">
                <FileText size={14} />
                <span>Weapon Design Guide</span>
                <ExternalLink size={12} />
              </a>
              <a href="#" className="doc-link">
                <FileText size={14} />
                <span>NPC Behavior Scripting</span>
                <ExternalLink size={12} />
              </a>
            </div>
          </div>

          <div className="doc-category">
            <h3 className="category-title">
              <Code size={16} />
              API DOCUMENTATION
            </h3>
            <div className="doc-links">
              <a href="#" className="doc-link">
                <Database size={14} />
                <span>Core Game Events API</span>
                <ExternalLink size={12} />
              </a>
              <a href="#" className="doc-link">
                <Database size={14} />
                <span>Neural Network Triggers</span>
                <ExternalLink size={12} />
              </a>
              <a href="#" className="doc-link">
                <Database size={14} />
                <span>AI Dialogue Endpoints</span>
                <ExternalLink size={12} />
              </a>
            </div>
          </div>

          <div className="doc-category">
            <h3 className="category-title">
              <Github size={16} />
              SAMPLE PROJECTS
            </h3>
            <div className="doc-links">
              <a href="#" className="doc-link">
                <Github size={14} />
                <span>Basic Skin Template</span>
                <ExternalLink size={12} />
              </a>
              <a href="#" className="doc-link">
                <Github size={14} />
                <span>Advanced AI Mod</span>
                <ExternalLink size={12} />
              </a>
              <a href="#" className="doc-link">
                <Github size={14} />
                <span>Environment Pack</span>
                <ExternalLink size={12} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Skin Creator Section
  const SkinCreatorSection = () => (
    <div className="hub-section skin-creator-section">
      <div className="creator-layout">
        <div className="creator-controls">
          <h3>Skin Creator Preview</h3>
          
          <div className="upload-area">
            <div className="upload-box">
              <Upload size={32} />
              <p>Drop texture files here</p>
              <span>PNG, JPG up to 10MB</span>
              <input type="file" accept="image/*" className="file-input" />
            </div>
          </div>

          <div className="preview-controls">
            <div className="control-group">
              <label>Lighting Mode</label>
              <div className="toggle-group">
                <button 
                  className={`toggle-btn ${skinPreviewMode === 'day' ? 'active' : ''}`}
                  onClick={() => setSkinPreviewMode('day')}
                >
                  <Sun size={16} />
                  Day
                </button>
                <button 
                  className={`toggle-btn ${skinPreviewMode === 'night' ? 'active' : ''}`}
                  onClick={() => setSkinPreviewMode('night')}
                >
                  <Moon size={16} />
                  Night
                </button>
              </div>
            </div>

            <div className="control-group">
              <label>Effects</label>
              <div className="effect-toggles">
                <button className="effect-btn">
                  <Zap size={16} />
                  Glow
                </button>
                <button className="effect-btn">
                  <Layers size={16} />
                  Emissive
                </button>
                <button className="effect-btn">
                  <Eye size={16} />
                  Metallic
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="model-preview">
          <div className="preview-viewport">
            <div className="model-placeholder">
              <div className="mannequin">
                <div className="mannequin-head"></div>
                <div className="mannequin-body"></div>
                <div className="mannequin-arms">
                  <div className="arm left"></div>
                  <div className="arm right"></div>
                </div>
                <div className="mannequin-legs">
                  <div className="leg left"></div>
                  <div className="leg right"></div>
                </div>
              </div>
            </div>
            
            <div className="viewport-controls">
              <button className="viewport-btn">
                <RotateCcw size={16} />
              </button>
              <button className="viewport-btn">
                <ZoomIn size={16} />
              </button>
              <button className="viewport-btn">
                <ZoomOut size={16} />
              </button>
            </div>
          </div>

          <div className="preview-info">
            <div className="info-panel">
              <h4>Skin Information</h4>
              <div className="info-item">
                <span>Resolution:</span>
                <span>2048x2048</span>
              </div>
              <div className="info-item">
                <span>Format:</span>
                <span>PNG</span>
              </div>
              <div className="info-item">
                <span>Compatibility:</span>
                <span>v1.0.x</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Upload Center Section
  const UploadCenterSection = () => (
    <div className="hub-section upload-section">
      <div className="upload-form">
        <h3>Submit Your Creation</h3>
        
        <div className="form-grid">
          <div className="form-group">
            <label>Mod Name</label>
            <input type="text" placeholder="Enter mod name" className="form-input" />
          </div>

          <div className="form-group">
            <label>Category</label>
            <select className="form-select">
              <option>Select category</option>
              <option>Skins</option>
              <option>Weapons</option>
              <option>Environment</option>
              <option>AI Behavior</option>
              <option>Audio</option>
              <option>UI/HUD</option>
            </select>
          </div>

          <div className="form-group full-width">
            <label>Description</label>
            <textarea 
              placeholder="Describe your mod..." 
              className="form-textarea"
              rows="4"
            ></textarea>
          </div>

          <div className="form-group">
            <label>Game Version</label>
            <select className="form-select">
              <option>1.0.x</option>
              <option>0.9.x</option>
              <option>Beta</option>
            </select>
          </div>

          <div className="form-group">
            <label>License</label>
            <select className="form-select">
              <option>Creative Commons</option>
              <option>Free to Use</option>
              <option>Attribution Required</option>
              <option>Commercial Use Allowed</option>
            </select>
          </div>

          <div className="form-group full-width">
            <label>Tags</label>
            <input 
              type="text" 
              placeholder="cyberpunk, neon, graphics, enhancement"
              className="form-input"
            />
          </div>

          <div className="form-group full-width">
            <label>Upload Files</label>
            <div className="file-upload-area">
              <div className="upload-zone">
                <Upload size={32} />
                <p>Drag & drop your mod files here</p>
                <span>ZIP files up to 100MB</span>
                <input type="file" className="file-input" accept=".zip" />
              </div>
              
              {uploadProgress > 0 && (
                <div className="upload-progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <span>{uploadProgress}%</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button className="btn-secondary">Save Draft</button>
          <button className="btn-primary">
            <Upload size={16} />
            Publish Mod
          </button>
        </div>
      </div>
    </div>
  );

  // Featured Mods Section
  const FeaturedModsSection = () => (
    <div className="hub-section featured-section">
      <div className="section-header">
        <h3>Featured Mods</h3>
        <div className="search-filter">
          <div className="search-box">
            <Search size={16} />
            <input 
              type="text"
              placeholder="Search mods..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select 
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Categories</option>
            <option value="skins">Skins</option>
            <option value="weapons">Weapons</option>
            <option value="environment">Environment</option>
            <option value="ai">AI Behavior</option>
          </select>
        </div>
      </div>

      <div className="mods-grid">
        {featuredMods.map((mod, index) => (
          <motion.div
            key={mod.id}
            className="mod-card"
            whileHover={{ scale: 1.02, y: -5 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            onClick={() => setSelectedMod(mod)}
          >
            <div className="mod-thumbnail">
              <img src={mod.thumbnail} alt={mod.name} />
              <div className="mod-overlay">
                <Play size={24} />
              </div>
            </div>
            
            <div className="mod-info">
              <h4 className="mod-name">{mod.name}</h4>
              <p className="mod-author">by {mod.author}</p>
              <p className="mod-description">{mod.description}</p>
              
              <div className="mod-stats">
                <div className="stat">
                  <Download size={14} />
                  <span>{mod.downloads.toLocaleString()}</span>
                </div>
                <div className="stat">
                  <Star size={14} />
                  <span>{mod.rating}</span>
                </div>
              </div>

              <div className="mod-tags">
                {mod.tags.map(tag => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="modding-hub">
      <div className="hub-header">
        <motion.h1 
          className={`hub-title ${glitchEffect ? 'glitch' : ''}`}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          {t('title')}
        </motion.h1>
        <motion.p 
          className="hub-subtitle"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          {t('subtitle')}
        </motion.p>
      </div>

      <div className="hub-layout">
        <nav className="hub-navigation">
          {navigationItems.map((item, index) => (
            <motion.button
              key={item.id}
              className={`nav-item ${activeSection === item.id ? 'active' : ''}`}
              onClick={() => setActiveSection(item.id)}
              whileHover={{ x: 5 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              {item.icon}
              <span>{item.label}</span>
            </motion.button>
          ))}
        </nav>

        <main className="hub-content">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {activeSection === 'overview' && <OverviewSection />}
              {activeSection === 'documentation' && <DocumentationSection />}
              {activeSection === 'skinCreator' && <SkinCreatorSection />}
              {activeSection === 'uploadCenter' && <UploadCenterSection />}
              {activeSection === 'featuredMods' && <FeaturedModsSection />}
              
              {/* Other sections would be implemented similarly */}
              {activeSection === 'toolbox' && (
                <div className="hub-section">
                  <h3>Official Toolbox - Coming Soon</h3>
                  <p>SDK downloads and development tools will be available here.</p>
                </div>
              )}
              
              {activeSection === 'moddingFeed' && (
                <div className="hub-section">
                  <h3>Modding Feed - Coming Soon</h3>
                  <p>Community feed and collaboration tools coming soon.</p>
                </div>
              )}
              
              {activeSection === 'aiAssistant' && (
                <div className="hub-section">
                  <h3>AI Mod Assistant - Coming Soon</h3>
                  <p>Alia Nox will help with mod troubleshooting and optimization.</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Floating AI Assistant Button */}
      <motion.button
        className="ai-assistant-fab"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setAiAssistantOpen(!aiAssistantOpen)}
      >
        <Bot size={24} />
      </motion.button>
    </div>
  );
};

export default ModdingHub;