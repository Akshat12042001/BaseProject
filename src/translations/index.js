import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import en from './english.json';

// Initialize once with a sane default; don't couple to Redux here
i18n.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  lng: 'en',
  fallbackLng: 'en',
  resources: {
    en: {translation: en},
  },
  interpolation: {escapeValue: false},
});

export default i18n;
