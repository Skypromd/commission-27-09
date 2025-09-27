import { useState, useEffect } from 'react';
import { i18n } from '../services/i18n';

// Типизация для языковых настроек
interface Language {
  code: string;
  name: string;
  flag: string;
  rtl?: boolean;
}

interface AdminSettings {
  enabledLanguages: Language[];
  defaultLanguage: string;
  maxUserLanguages: number;
  requireApproval: boolean;
}

interface UseTranslationReturn {
  language: string;
  selectedLanguages: string[];
  adminSettings: AdminSettings;
  enabledLanguages: Language[];
  maxUserLanguages: number;
  t: (key: string, params?: Record<string, any>) => string;
  changeLanguage: (newLanguage: string) => void;
  updateSelectedLanguages: (languages: string[]) => boolean;
  updateAdminSettings: (settings: Partial<AdminSettings>) => void;
  isLanguageSelected: (languageCode: string) => boolean;
  canAddMoreLanguages: () => boolean;
  getLanguageInfo: (languageCode: string) => Language | undefined;
}

export const useTranslation = (): UseTranslationReturn => {
  const [language, setLanguage] = useState<string>(i18n.getCurrentLanguage());
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(i18n.getSelectedLanguages());
  const [adminSettings, setAdminSettings] = useState<AdminSettings>(i18n.getAdminSettings());

  useEffect(() => {
    const unsubscribe = i18n.subscribe((newLanguage: string, newSelectedLanguages: string[], newAdminSettings: AdminSettings) => {
      setLanguage(newLanguage);
      setSelectedLanguages(newSelectedLanguages);
      setAdminSettings(newAdminSettings);
    });

    return unsubscribe;
  }, []);

  const t = (key: string, params?: Record<string, any>): string => i18n.translate(key, params);

  const changeLanguage = (newLanguage: string): void => {
    i18n.setLanguage(newLanguage);
  };

  const updateSelectedLanguages = (languages: string[]): boolean => {
    return i18n.setSelectedLanguages(languages);
  };

  // Админские методы
  const updateAdminSettings = (settings: Partial<AdminSettings>): void => {
    i18n.saveAdminSettings(settings);
  };

  // Вспомогательные методы
  const isLanguageSelected = (languageCode: string): boolean => {
    return selectedLanguages.includes(languageCode);
  };

  const canAddMoreLanguages = (): boolean => {
    return selectedLanguages.length < adminSettings.maxUserLanguages;
  };

  const getLanguageInfo = (languageCode: string): Language | undefined => {
    return adminSettings.enabledLanguages.find(lang => lang.code === languageCode);
  };

  return {
    language,
    selectedLanguages,
    adminSettings,
    enabledLanguages: adminSettings.enabledLanguages,
    maxUserLanguages: adminSettings.maxUserLanguages,
    t,
    changeLanguage,
    updateSelectedLanguages,
    updateAdminSettings,
    isLanguageSelected,
    canAddMoreLanguages,
    getLanguageInfo
  };
};

// Дополнительный хук для админских настроек
export const useAdminTranslationSettings = () => {
  const {
    adminSettings,
    updateAdminSettings,
    enabledLanguages
  } = useTranslation();

  const addLanguage = (language: Language): void => {
    const newLanguages = [...adminSettings.enabledLanguages, language];
    updateAdminSettings({ enabledLanguages: newLanguages });
  };

  const removeLanguage = (languageCode: string): void => {
    const newLanguages = adminSettings.enabledLanguages.filter(lang => lang.code !== languageCode);
    updateAdminSettings({ enabledLanguages: newLanguages });
  };

  const setDefaultLanguage = (languageCode: string): void => {
    updateAdminSettings({ defaultLanguage: languageCode });
  };

  const setMaxUserLanguages = (max: number): void => {
    updateAdminSettings({ maxUserLanguages: max });
  };

  return {
    adminSettings,
    enabledLanguages,
    addLanguage,
    removeLanguage,
    setDefaultLanguage,
    setMaxUserLanguages,
    updateAdminSettings
  };
};

// Экспорт типов
export type { Language, AdminSettings, UseTranslationReturn };
