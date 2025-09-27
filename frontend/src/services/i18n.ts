// Расширенная система интернационализации с админскими настройками
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Типы для интернационализации
interface AdminSettings {
  enabledLanguages: string[];
  maxUserLanguages: number;
  defaultLanguage: string;
  fallbackLanguage: string;
}

interface TranslationResource {
  [key: string]: any;
}

// Переводы напрямую в коде для избежания проблем с импортом JSON
const translations: Record<string, TranslationResource> = {
  en: {
    common: {
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      loading: 'Loading...',
      error: 'Error occurred'
    },
    navigation: {
      dashboard: 'Dashboard',
      clients: 'Clients',
      products: 'Products',
      reports: 'Reports'
    }
  },
  ru: {
    common: {
      save: 'Сохранить',
      cancel: 'Отмена',
      delete: 'Удалить',
      edit: 'Редактировать',
      loading: 'Загрузка...',
      error: 'Произошла ошибка'
    },
    navigation: {
      dashboard: 'Дашборд',
      clients: 'Клиенты',
      products: 'Продукты',
      reports: 'Отчеты'
    }
  },
  uk: {
    common: {
      save: 'Зберегти',
      cancel: 'Скасувати',
      delete: 'Видалити',
      edit: 'Редагувати',
      loading: 'Завантаження...',
      error: 'Сталася помилка'
    },
    navigation: {
      dashboard: 'Дашборд',
      clients: 'Клієнти',
      products: 'Продукти',
      reports: 'Звіти'
    }
  }
};

// Дефолтные настройки (можно изменять через админ-панель)
const DEFAULT_ADMIN_SETTINGS: AdminSettings = {
  enabledLanguages: ['en', 'ru', 'uk'], // Языки, доступные пользователям
  maxUserLanguages: 3, // Максимум языков для выбора пользователем
  defaultLanguage: 'en', // Язык по умолчанию
  fallbackLanguage: 'en' // Язык для fallback
};

class I18n {
  private adminSettings: AdminSettings;
  private currentLanguage: string;
  private selectedLanguages: string[];

  constructor() {
    // Загружаем админские настройки
    this.adminSettings = this.loadAdminSettings();

    // Загружаем пользовательские настройки
    this.currentLanguage = localStorage.getItem('primaryLanguage') || this.adminSettings.defaultLanguage;
    const savedUserLanguages = JSON.parse(localStorage.getItem('selectedLanguages') || '[]');

    // Фильтруем пользовательские языки по админским настройкам
    this.selectedLanguages = savedUserLanguages.filter((lang: string) =>
      this.adminSettings.enabledLanguages.includes(lang)
    );

    // Инициализируем i18next
    this.initI18next();
  }

  private loadAdminSettings(): AdminSettings {
    try {
      const saved = localStorage.getItem('adminI18nSettings');
      return saved ? JSON.parse(saved) : DEFAULT_ADMIN_SETTINGS;
    } catch {
      return DEFAULT_ADMIN_SETTINGS;
    }
  }

  private initI18next(): void {
    const resources: Record<string, { translation: TranslationResource }> = {};

    Object.keys(translations).forEach(lang => {
      resources[lang] = { translation: translations[lang] };
    });

    i18n
      .use(initReactI18next)
      .init({
        resources,
        lng: this.currentLanguage,
        fallbackLng: this.adminSettings.fallbackLanguage,
        interpolation: {
          escapeValue: false,
        },
      });
  }

  getCurrentLanguage(): string {
    return this.currentLanguage;
  }

  setLanguage(language: string): void {
    if (this.adminSettings.enabledLanguages.includes(language)) {
      this.currentLanguage = language;
      localStorage.setItem('primaryLanguage', language);
      i18n.changeLanguage(language);
    }
  }

  getEnabledLanguages(): string[] {
    return this.adminSettings.enabledLanguages;
  }

  updateAdminSettings(settings: Partial<AdminSettings>): void {
    this.adminSettings = { ...this.adminSettings, ...settings };
    localStorage.setItem('adminI18nSettings', JSON.stringify(this.adminSettings));
  }
}

// Экспортируем экземпляр и сам i18n
export const i18nService = new I18n();
export default i18n;
