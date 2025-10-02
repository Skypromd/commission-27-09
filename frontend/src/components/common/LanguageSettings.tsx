import React, { useState } from 'react';
import { useTranslation } from '../../hooks/useTranslation';

// Типизация для компонента настроек языка
interface UserLanguageSettingsProps {
  className?: string;
}

const UserLanguageSettings: React.FC<UserLanguageSettingsProps> = ({ className = '' }) => {
  const {
    t,
    language,
    selectedLanguages,
    changeLanguage,
    updateSelectedLanguages,
    enabledLanguages,
    maxUserLanguages,
    isLanguageSelected,
    canAddMoreLanguages
  } = useTranslation();

  const [showSelector, setShowSelector] = useState<boolean>(false);

  const handleLanguageToggle = (languageCode: string): void => {
    if (isLanguageSelected(languageCode)) {
      // Удаляем язык (но не основной и не последний)
      if (languageCode !== language && selectedLanguages.length > 1) {
        const newLanguages = selectedLanguages.filter(lang => lang !== languageCode);
        updateSelectedLanguages(newLanguages);
      }
    } else {
      // Добавляем язык, если можем
      if (canAddMoreLanguages()) {
        const newLanguages = [...selectedLanguages, languageCode];
        updateSelectedLanguages(newLanguages);
      }
    }
  };

  const handlePrimaryLanguageChange = (newLanguage: string): void => {
    // Если новый основной язык не в списке выбранных, добавляем его
    if (!isLanguageSelected(newLanguage)) {
      if (selectedLanguages.length >= maxUserLanguages) {
        // Заменяем последний язык новым основным
        const newLanguages = [...selectedLanguages.slice(0, -1), newLanguage];
        updateSelectedLanguages(newLanguages);
      } else {
        const newLanguages = [...selectedLanguages, newLanguage];
        updateSelectedLanguages(newLanguages);
      }
    }
    changeLanguage(newLanguage);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Быстрый выбор основного языка */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('settings.primaryLanguage')}
        </label>
        <div className="flex flex-wrap gap-2">
          {selectedLanguages.map(langCode => {
            const lang = enabledLanguages.find(l => l.code === langCode);
            if (!lang) return null;

            return (
              <button
                key={langCode}
                onClick={() => handlePrimaryLanguageChange(langCode)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  language === langCode
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {lang.flag} {lang.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Управление доступными языками */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-gray-700">
            {t('settings.availableLanguages')} ({selectedLanguages.length}/{maxUserLanguages})
          </label>
          <button
            onClick={() => setShowSelector(!showSelector)}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            {showSelector ? t('common.hide') : t('common.manage')}
          </button>
        </div>

        {showSelector && (
          <div className="border rounded-lg p-3 bg-gray-50">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {enabledLanguages.map(lang => (
                <label
                  key={lang.code}
                  className={`flex items-center p-2 rounded cursor-pointer transition-colors ${
                    isLanguageSelected(lang.code)
                      ? 'bg-blue-100 border-blue-300'
                      : 'bg-white hover:bg-gray-100'
                  } ${
                    !canAddMoreLanguages() && !isLanguageSelected(lang.code)
                      ? 'opacity-50 cursor-not-allowed'
                      : ''
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isLanguageSelected(lang.code)}
                    onChange={() => handleLanguageToggle(lang.code)}
                    disabled={
                      (!canAddMoreLanguages() && !isLanguageSelected(lang.code)) ||
                      (lang.code === language && selectedLanguages.length === 1)
                    }
                    className="mr-2"
                  />
                  <span className="text-lg mr-2">{lang.flag}</span>
                  <span className="text-sm">{lang.name}</span>
                  {lang.code === language && (
                    <span className="ml-auto text-xs text-blue-600 bg-blue-100 px-1 rounded">
                      {t('common.primary')}
                    </span>
                  )}
                </label>
              ))}
            </div>

            {!canAddMoreLanguages() && (
              <p className="text-xs text-gray-500 mt-2">
                {t('settings.maxLanguagesReached', { max: maxUserLanguages })}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Информация */}
      <div className="text-xs text-gray-500">
        <p>{t('settings.languageInfo')}</p>
      </div>
    </div>
  );
};

export default UserLanguageSettings;
