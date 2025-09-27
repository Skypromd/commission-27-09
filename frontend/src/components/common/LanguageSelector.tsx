import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';

const LanguageSelector = ({ className = '', showLabel = false, compact = true }) => {
  const { language, changeLanguage, availableLanguages } = useTranslation();

  if (compact) {
    // Компактный вид - только флаги
    return (
      <div className={`flex items-center space-x-1 ${className}`}>
        {availableLanguages.map(lang => (
          <button
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            className={`flex items-center justify-center w-8 h-8 rounded-full transition-all ${
              lang.code === language
                ? 'bg-indigo-100 ring-2 ring-indigo-300'
                : 'hover:bg-gray-100'
            }`}
            title={lang.nativeName}
          >
            <span className="text-lg">{lang.flag}</span>
          </button>
        ))}
      </div>
    );
  }

  // Полный вид с селектом
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {showLabel && (
        <span className="text-sm font-medium text-gray-700">
          🌐
        </span>
      )}
      <select
        value={language}
        onChange={(e) => changeLanguage(e.target.value)}
        className="px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
      >
        {availableLanguages.map(lang => (
          <option key={lang.code} value={lang.code}>
            {lang.flag} {lang.nativeName}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSelector;
