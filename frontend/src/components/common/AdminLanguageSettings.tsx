import React, { useState } from 'react';
import { useTranslation } from '../../hooks/useTranslation';

interface AdminLanguageSettingsProps {
  className?: string;
}

interface AdminSettings {
  enabledLanguages: string[];
  defaultLanguage: string;
  fallbackLanguage: string;
  autoDetect: boolean;
}

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag?: string;
}

const AdminLanguageSettings: React.FC<AdminLanguageSettingsProps> = ({ className = '' }) => {
  const {
    t,
    adminSettings,
    updateAdminSettings,
    allAvailableLanguages
  } = useTranslation();

  const [localSettings, setLocalSettings] = useState<AdminSettings>(adminSettings || {
    enabledLanguages: ['en', 'ru'],
    defaultLanguage: 'en',
    fallbackLanguage: 'en',
    autoDetect: false
  });
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleLanguageToggle = (languageCode: string) => {
    const newEnabledLanguages = localSettings.enabledLanguages.includes(languageCode)
      ? localSettings.enabledLanguages.filter(lang => lang !== languageCode)
      : [...localSettings.enabledLanguages, languageCode];

    // Не позволяем удалить все языки
    if (newEnabledLanguages.length === 0) {
      return;
    }

    setLocalSettings(prev => ({
      ...prev,
      enabledLanguages: newEnabledLanguages
    }));
  };

  const handleDefaultLanguageChange = (languageCode: string) => {
    setLocalSettings(prev => ({
      ...prev,
      defaultLanguage: languageCode,
      // Убеждаемся, что язык по умолчанию включен
      enabledLanguages: prev.enabledLanguages.includes(languageCode)
        ? prev.enabledLanguages
        : [...prev.enabledLanguages, languageCode]
    }));
  };

  const handleFallbackLanguageChange = (languageCode: string) => {
    setLocalSettings(prev => ({
      ...prev,
      fallbackLanguage: languageCode
    }));
  };

  const handleAutoDetectToggle = () => {
    setLocalSettings(prev => ({
      ...prev,
      autoDetect: !prev.autoDetect
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await updateAdminSettings(localSettings);
    } catch (error) {
      console.error('Failed to save language settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setLocalSettings(adminSettings);
  };

  return (
    <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
      <h2 className="text-xl font-semibold mb-4">{t('admin.languageSettings.title')}</h2>

      <div className="space-y-6">
        {/* Включенные языки */}
        <div>
          <h3 className="text-lg font-medium mb-3">{t('admin.languageSettings.enabledLanguages')}</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {allAvailableLanguages.map((language: Language) => (
              <label key={language.code} className="flex items-center space-x-2 p-2 border rounded hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={localSettings.enabledLanguages.includes(language.code)}
                  onChange={() => handleLanguageToggle(language.code)}
                  className="form-checkbox h-4 w-4 text-blue-600"
                />
                <span className="text-xl">{language.flag}</span>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{language.name}</span>
                  <span className="text-xs text-gray-500">{language.nativeName}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Язык по умолчанию */}
        <div>
          <h3 className="text-lg font-medium mb-3">{t('admin.languageSettings.defaultLanguage')}</h3>
          <select
            value={localSettings.defaultLanguage}
            onChange={(e) => handleDefaultLanguageChange(e.target.value)}
            className="form-select block w-full mt-1 rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          >
            {localSettings.enabledLanguages.map(langCode => {
              const language = allAvailableLanguages.find((l: Language) => l.code === langCode);
              return (
                <option key={langCode} value={langCode}>
                  {language?.name || langCode}
                </option>
              );
            })}
          </select>
        </div>

        {/* Расширенные настройки */}
        <div>
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            {showAdvanced ? t('admin.languageSettings.hideAdvanced') : t('admin.languageSettings.showAdvanced')}
          </button>

          {showAdvanced && (
            <div className="mt-4 space-y-4 p-4 bg-gray-50 rounded-lg">
              {/* Резервный язык */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('admin.languageSettings.fallbackLanguage')}
                </label>
                <select
                  value={localSettings.fallbackLanguage}
                  onChange={(e) => handleFallbackLanguageChange(e.target.value)}
                  className="form-select block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                >
                  {localSettings.enabledLanguages.map(langCode => {
                    const language = allAvailableLanguages.find((l: Language) => l.code === langCode);
                    return (
                      <option key={langCode} value={langCode}>
                        {language?.name || langCode}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Автоопределение языка */}
              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={localSettings.autoDetect}
                    onChange={handleAutoDetectToggle}
                    className="form-checkbox h-4 w-4 text-blue-600"
                  />
                  <span className="text-sm text-gray-700">
                    {t('admin.languageSettings.autoDetect')}
                  </span>
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  {t('admin.languageSettings.autoDetectHelp')}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Кнопки действий */}
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <button
            type="button"
            onClick={handleReset}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50"
          >
            {t('admin.languageSettings.reset')}
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? t('admin.languageSettings.saving') : t('admin.languageSettings.save')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLanguageSettings;
