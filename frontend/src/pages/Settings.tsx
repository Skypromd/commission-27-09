import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import '../styles/global-design-system.css';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('system');
  const [settings, setSettings] = useState({
    companyName: 'UK Commission Admin Panel',
    currency: 'GBP',
    dateFormat: 'DD/MM/YYYY',
    timezone: 'Europe/London',
    emailNotifications: true,
    smsNotifications: false,
    autoBackup: true
  });

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Layout>
      <div className="module-content slide-up">
        {/* Статистика системы */}
        <div className="grid grid-4 mb-lg">
          <div className="stat-card">
            <div className="stat-icon">⚙️</div>
            <div className="stat-content">
              <h3>Системные настройки</h3>
              <p className="stat-value">24</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <h3>Пользовательские</h3>
              <p className="stat-value">18</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🔐</div>
            <div className="stat-content">
              <h3>Безопасность</h3>
              <p className="stat-value">12</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">���</div>
            <div className="stat-content">
              <h3>Уведомления</h3>
              <p className="stat-value">8</p>
            </div>
          </div>
        </div>

        {/* Навигация по настройкам */}
        <div className="nav-bar mb-lg">
          <button
            className={`nav-tab ${activeTab === 'system' ? 'active' : ''}`}
            onClick={() => setActiveTab('system')}
          >
            ⚙️ Система
          </button>
          <button
            className={`nav-tab ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            👥 Пользователи
          </button>
          <button
            className={`nav-tab ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => setActiveTab('security')}
          >
            🔐 Безопасность
          </button>
          <button
            className={`nav-tab ${activeTab === 'notifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('notifications')}
          >
            📧 Уведомления
          </button>
        </div>

        {/* Системные настройки */}
        {activeTab === 'system' && (
          <div className="space-y-lg">
            <div className="card">
              <div className="card-header">
                <h2 className="section-title">⚙️ Основные настройки системы</h2>
                <button className="btn btn-primary">💾 Сохранить изменения</button>
              </div>

              <div className="grid grid-2">
                <div className="glass-panel p-lg">
                  <h3>Общие настройки</h3>
                  <div className="space-y-4 mt-md">
                    <div className="form-group">
                      <label className="form-label">Название компании</label>
                      <input
                        type="text"
                        className="form-input"
                        value={settings.companyName}
                        onChange={(e) => handleSettingChange('companyName', e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Валюта по умолчанию</label>
                      <select
                        className="form-input"
                        value={settings.currency}
                        onChange={(e) => handleSettingChange('currency', e.target.value)}
                      >
                        <option value="GBP">British Pound (£)</option>
                        <option value="EUR">Euro (€)</option>
                        <option value="USD">US Dollar ($)</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Формат даты</label>
                      <select
                        className="form-input"
                        value={settings.dateFormat}
                        onChange={(e) => handleSettingChange('dateFormat', e.target.value)}
                      >
                        <option value="DD/MM/YYYY">DD/MM/YYYY (UK)</option>
                        <option value="MM/DD/YYYY">MM/DD/YYYY (US)</option>
                        <option value="YYYY-MM-DD">YYYY-MM-DD (ISO)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="glass-panel p-lg">
                  <h3>Региональные настройки</h3>
                  <div className="space-y-4 mt-md">
                    <div className="form-group">
                      <label className="form-label">Часовой пояс</label>
                      <select
                        className="form-input"
                        value={settings.timezone}
                        onChange={(e) => handleSettingChange('timezone', e.target.value)}
                      >
                        <option value="Europe/London">Europe/London (GMT)</option>
                        <option value="Europe/Berlin">Europe/Berlin (CET)</option>
                        <option value="America/New_York">America/New_York (EST)</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Язык интерфейса</label>
                      <select className="form-input">
                        <option value="ru">Русский</option>
                        <option value="en">English</option>
                        <option value="de">Deutsch</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Рабочие дни</label>
                      <div className="flex gap-sm mt-sm">
                        {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map(day => (
                          <button key={day} className="btn btn-outline btn-small">
                            {day}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Настройки поль��ователей */}
        {activeTab === 'users' && (
          <div className="card">
            <div className="card-header">
              <h2 className="section-title">👥 Управление п��льзователями</h2>
              <button className="btn btn-primary">+ Добавить пользователя</button>
            </div>

            <div className="space-y-lg">
              <div className="glass-panel p-lg">
                <h3>Политики пользователей</h3>
                <div className="space-y-4 mt-md">
                  <div className="flex-between p-md glass-panel">
                    <div>
                      <strong>Обязательная смена пароля</strong>
                      <div className="text-secondary">Каждые 90 дней</div>
                    </div>
                    <label className="switch">
                      <input type="checkbox" defaultChecked />
                      <span className="slider"></span>
                    </label>
                  </div>

                  <div className="flex-between p-md glass-panel">
                    <div>
                      <strong>Двухфакторная аутентификация</strong>
                      <div className="text-secondary">Обязательна для админов</div>
                    </div>
                    <label className="switch">
                      <input type="checkbox" defaultChecked />
                      <span className="slider"></span>
                    </label>
                  </div>

                  <div className="flex-between p-md glass-panel">
                    <div>
                      <strong>Автоматическая блокировка</strong>
                      <div className="text-secondary">После 30 минут неактивности</div>
                    </div>
                    <label className="switch">
                      <input type="checkbox" />
                      <span className="slider"></span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Настройки безопасности */}
        {activeTab === 'security' && (
          <div className="card">
            <div className="card-header">
              <h2 className="section-title">🔐 Настройки безопасности</h2>
              <button className="btn btn-warning">🔄 Обновить политики</button>
            </div>

            <div className="grid grid-2">
              <div className="glass-panel p-lg">
                <h3>Аудит безопасности</h3>
                <div className="space-y-4 mt-md">
                  <div className="flex-between">
                    <span>Последняя проверка</span>
                    <span className="badge badge-success">20.12.2024</span>
                  </div>
                  <div className="flex-between">
                    <span>Уровень безопасности</span>
                    <span className="badge badge-success">Высокий</span>
                  </div>
                  <div className="flex-between">
                    <span>Активных сессий</span>
                    <span className="badge badge-info">24</span>
                  </div>
                  <div className="flex-between">
                    <span>Заблокированных IP</span>
                    <span className="badge badge-warning">3</span>
                  </div>
                </div>
              </div>

              <div className="glass-panel p-lg">
                <h3>Настройки доступа</h3>
                <div className="space-y-4 mt-md">
                  <div className="form-group">
                    <label className="form-label">Максимум попыток входа</label>
                    <input type="number" className="form-input" defaultValue="5" />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Время блокировки (минуты)</label>
                    <input type="number" className="form-input" defaultValue="30" />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Разрешенные IP адреса</label>
                    <textarea className="form-input" rows="3" placeholder="192.168.1.0/24"></textarea>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Настройки уведомлений */}
        {activeTab === 'notifications' && (
          <div className="card">
            <div className="card-header">
              <h2 className="section-title">📧 Настройки уведомлений</h2>
              <button className="btn btn-primary">🧪 Тестовое уведомление</button>
            </div>

            <div className="space-y-lg">
              <div className="glass-panel p-lg">
                <h3>Email уведомления</h3>
                <div className="space-y-4 mt-md">
                  <div className="flex-between p-md glass-panel">
                    <div>
                      <strong>Новые комиссии</strong>
                      <div className="text-secondary">При создании новой комиссии</div>
                    </div>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={settings.emailNotifications}
                        onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>

                  <div className="flex-between p-md glass-panel">
                    <div>
                      <strong>Статус платежей</strong>
                      <div className="text-secondary">При изменении статуса</div>
                    </div>
                    <label className="switch">
                      <input type="checkbox" defaultChecked />
                      <span className="slider"></span>
                    </label>
                  </div>

                  <div className="flex-between p-md glass-panel">
                    <div>
                      <strong>Ежедневные отчеты</strong>
                      <div className="text-secondary">Сводка за день</div>
                    </div>
                    <label className="switch">
                      <input type="checkbox" />
                      <span className="slider"></span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="glass-panel p-lg">
                <h3>SMS уведомления</h3>
                <div className="space-y-4 mt-md">
                  <div className="flex-between p-md glass-panel">
                    <div>
                      <strong>Критические события</strong>
                      <div className="text-secondary">Проблемы безопасности</div>
                    </div>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={settings.smsNotifications}
                        onChange={(e) => handleSettingChange('smsNotifications', e.target.checked)}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Стили для переключателей */}
      <style jsx>{`
        .switch {
          position: relative;
          display: inline-block;
          width: 50px;
          height: 24px;
        }

        .switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #ccc;
          -webkit-transition: .4s;
          transition: .4s;
          border-radius: 24px;
        }

        .slider:before {
          position: absolute;
          content: "";
          height: 18px;
          width: 18px;
          left: 3px;
          bottom: 3px;
          background-color: white;
          -webkit-transition: .4s;
          transition: .4s;
          border-radius: 50%;
        }

        input:checked + .slider {
          background: linear-gradient(45deg, #667eea, #764ba2);
        }

        input:checked + .slider:before {
          -webkit-transform: translateX(26px);
          -ms-transform: translateX(26px);
          transform: translateX(26px);
        }
      `}</style>
    </Layout>
  );
};

export default Settings;
