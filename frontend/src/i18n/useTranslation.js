import { useState, useContext, createContext } from 'react';
import { getTranslation, languages } from './translations';

// Language Context
const LanguageContext = createContext();

// Language Provider Component
export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState(
    localStorage.getItem('zeropunk_language') || 'en'
  );

  const changeLanguage = (languageCode) => {
    setCurrentLanguage(languageCode);
    localStorage.setItem('zeropunk_language', languageCode);
  };

  const t = (key) => getTranslation(currentLanguage, key);

  return (
    <LanguageContext.Provider value={{
      currentLanguage,
      changeLanguage,
      t,
      languages
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use translation
export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};