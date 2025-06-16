import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from './i18n/useTranslation';
import { ExternalLink, ShoppingBag, Mail, Clock } from 'lucide-react';
import './YoungShopPage.css';

const YoungShopPage = () => {
  const { t } = useTranslation();

  const handleVisitShop = () => {
    window.open('https://yougnshop.com', '_blank');
  };

  const handleEmailContact = () => {
    window.open('mailto:support@zeropunk-game.com', '_blank');
  };

  return (
    <div className="section-container youngshop-section">
      <div className="section-content">
        {/* Header */}
        <motion.div
          className="youngshop-header"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="youngshop-title">{t('youngshop_title')}</h1>
          <div className="title-underline"></div>
        </motion.div>

        {/* Main Content */}
        <div className="youngshop-content">
          {/* Shop Link Section */}
          <motion.div
            className="shop-link-section"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="shop-intro">
              <ShoppingBag className="shop-icon" size={48} />
              <p className="shop-text">{t('visit_clothing_website')}</p>
              <motion.button
                className="shop-button"
                onClick={handleVisitShop}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <ExternalLink className="button-icon" size={20} />
                yougnshop.com
              </motion.button>
            </div>
            
            <motion.p
              className="connection-text"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              ✨ {t('connect_style')}
            </motion.p>
          </motion.div>

          {/* How It Works Section */}
          <motion.div
            className="how-it-works-section"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h2 className="how-it-works-title">{t('how_it_works')}</h2>
            
            <div className="steps-container">
              <motion.div
                className="step-item"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <div className="step-number">1</div>
                <div className="step-content">
                  <p>{t('step_1')}</p>
                </div>
              </motion.div>

              <motion.div
                className="step-item"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                <div className="step-number">2</div>
                <div className="step-content">
                  <p>{t('step_2')}</p>
                  <p className="step-note">– {t('step_3')}</p>
                </div>
              </motion.div>

              <motion.div
                className="step-item"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0, duration: 0.5 }}
              >
                <div className="step-number">3</div>
                <div className="step-content">
                  <p>{t('step_4')}</p>
                </div>
              </motion.div>
            </div>

            {/* Email Contact */}
            <motion.div
              className="email-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.5 }}
            >
              <Mail className="email-icon" size={24} />
              <span className="email-text">{t('support_email')}</span>
              <motion.button
                className="email-button"
                onClick={handleEmailContact}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Mail size={16} />
                Contact
              </motion.button>
            </motion.div>
          </motion.div>
        </div>

        {/* Footer Notice */}
        <motion.div
          className="availability-notice"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.8 }}
        >
          <Clock className="clock-icon" size={20} />
          <p>{t('feature_availability')}</p>
        </motion.div>

        {/* Background Effects */}
        <div className="youngshop-background">
          <div className="cyber-grid"></div>
          <div className="floating-particles">
            {[...Array(15)].map((_, i) => (
              <div
                key={i}
                className="particle"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${3 + Math.random() * 2}s`
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default YoungShopPage;