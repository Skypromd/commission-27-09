import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import '../styles/global-design-system.css';

const Reports = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(amount);
  };

  return (
    <Layout>
      <div className="module-content slide-up">
        {/* Сводка отчетов */}
        <div className="grid grid-4 mb-lg">
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <h3>Доступные отчеты</h3>
              <p className="stat-value">24</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📈</div>
            <div className="stat-content">
              <h3>Автоматические</h3>
              <p className="stat-value">12</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⏰</div>
            <div className="stat-content">
              <h3>Запланированные</h3>
              <p className="stat-value">8</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📋</div>
            <div className="stat-content">
              <h3>Кастомные</h3>
              <p className="stat-value">4</p>
            </div>
          </div>
        </div>

        {/* Навигация по типам отчетов */}
        <div className="nav-bar mb-lg">
          <button
            className={`nav-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            📊 Дашборд отчетов
          </button>
          <button
            className={`nav-tab ${activeTab === 'commission' ? 'active' : ''}`}
            onClick={() => setActiveTab('commission')}
          >
            💰 Отчеты по комиссиям
          </button>
          <button
            className={`nav-tab ${activeTab === 'performance' ? 'active' : ''}`}
            onClick={() => setActiveTab('performance')}
          >
            🏆 Производительность
          </button>
          <button
            className={`nav-tab ${activeTab === 'custom' ? 'active' : ''}`}
            onClick={() => setActiveTab('custom')}
          >
            🔧 Кастомные отчеты
          </button>
        </div>

        {/* Дашборд отчетов */}
        {activeTab === 'dashboard' && (
          <div className="space-y-lg">
            <div className="card">
              <div className="card-header">
                <h2 className="section-title">📊 Основные отчеты</h2>
                <button className="btn btn-primary">📈 Создать отчет</button>
              </div>

              <div className="grid grid-3">
                <div className="glass-panel p-lg">
                  <div className="flex gap-md mb-md">
                    <span style={{ fontSize: '2em' }}>💰</span>
                    <div>
                      <h3>Комиссионный отчет</h3>
                      <p className="text-secondary">Последнее обновление: сегодня</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex-between">
                      <span>Общие комиссии:</span>
                      <span className="stat-value">{formatCurrency(54350)}</span>
                    </div>
                    <div className="flex-between">
                      <span>За этот месяц:</span>
                      <span className="stat-value">{formatCurrency(12450)}</span>
                    </div>
                  </div>
                  <div className="mt-md">
                    <button className="btn btn-primary btn-small">👁️ Просмотр</button>
                    <button className="btn btn-outline btn-small">📥 Скачать</button>
                  </div>
                </div>

                <div className="glass-panel p-lg">
                  <div className="flex gap-md mb-md">
                    <span style={{ fontSize: '2em' }}>👥</span>
                    <div>
                      <h3>Отчет по клиентам</h3>
                      <p className="text-secondary">Еженедельно</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex-between">
                      <span>Всего клиентов:</span>
                      <span className="stat-value">247</span>
                    </div>
                    <div className="flex-between">
                      <span>Новых за месяц:</span>
                      <span className="stat-value">24</span>
                    </div>
                  </div>
                  <div className="mt-md">
                    <button className="btn btn-primary btn-small">👁️ Просмотр</button>
                    <button className="btn btn-outline btn-small">📥 Скачать</button>
                  </div>
                </div>

                <div className="glass-panel p-lg">
                  <div className="flex gap-md mb-md">
                    <span style={{ fontSize: '2em' }}>🏆</span>
                    <div>
                      <h3>Отчет по продажам</h3>
                      <p className="text-secondary">Ежедневно</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex-between">
                      <span>Объем продаж:</span>
                      <span className="stat-value">{formatCurrency(340000)}</span>
                    </div>
                    <div className="flex-between">
                      <span>Конверсия:</span>
                      <span className="stat-value">67%</span>
                    </div>
                  </div>
                  <div className="mt-md">
                    <button className="btn btn-primary btn-small">👁️ Просмотр</button>
                    <button className="btn btn-outline btn-small">📥 Скачать</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Отчеты по комиссиям */}
        {activeTab === 'commission' && (
          <div className="card">
            <div className="card-header">
              <h2 className="section-title">💰 Детализация комиссий</h2>
              <div className="flex gap-md">
                <button className="btn btn-primary">📊 Новый отчет</button>
                <button className="btn btn-secondary">📧 Отправить по email</button>
              </div>
            </div>

            <div className="space-y-lg">
              <div className="grid grid-2">
                <div className="glass-panel p-lg">
                  <h3>Комиссии по типам продуктов</h3>
                  <div className="space-y-4 mt-md">
                    <div className="flex-between p-md glass-panel">
                      <div className="flex gap-md">
                        <span style={{ fontSize: '1.5em' }}>🛡️</span>
                        <span>Страхование</span>
                      </div>
                      <span className="stat-value">{formatCurrency(28450)}</span>
                    </div>
                    <div className="flex-between p-md glass-panel">
                      <div className="flex gap-md">
                        <span style={{ fontSize: '1.5em' }}>🏠</span>
                        <span>Ипотека</span>
                      </div>
                      <span className="stat-value">{formatCurrency(18320)}</span>
                    </div>
                    <div className="flex-between p-md glass-panel">
                      <div className="flex gap-md">
                        <span style={{ fontSize: '1.5em' }}>📈</span>
                        <span>Инвестиции</span>
                      </div>
                      <span className="stat-value">{formatCurrency(7580)}</span>
                    </div>
                  </div>
                </div>

                <div className="glass-panel p-lg">
                  <h3>Топ консультанты по комиссиям</h3>
                  <div className="space-y-4 mt-md">
                    <div className="flex-between p-md glass-panel">
                      <div>
                        <strong>Анна Петрова</strong>
                        <div className="text-secondary">Страховой консультант</div>
                      </div>
                      <span className="stat-value">{formatCurrency(8450)}</span>
                    </div>
                    <div className="flex-between p-md glass-panel">
                      <div>
                        <strong>Иван Сидоров</strong>
                        <div className="text-secondary">Ипотечный брокер</div>
                      </div>
                      <span className="stat-value">{formatCurrency(7200)}</span>
                    </div>
                    <div className="flex-between p-md glass-panel">
                      <div>
                        <strong>Мария Козлова</strong>
                        <div className="text-secondary">Универсальный консультант</div>
                      </div>
                      <span className="stat-value">{formatCurrency(6800)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Производительность */}
        {activeTab === 'performance' && (
          <div className="card">
            <div className="card-header">
              <h2 className="section-title">🏆 Анализ производительности</h2>
              <button className="btn btn-primary">📈 Обновить метрики</button>
            </div>

            <div className="grid grid-2 space-y-lg">
              <div className="glass-panel p-lg">
                <h3>KPI по команде</h3>
                <div className="space-y-4 mt-md">
                  <div className="space-y-2">
                    <div className="flex-between">
                      <span>Конверсия лидов</span>
                      <span className="badge badge-success">67%</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{width: '67%'}}></div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex-between">
                      <span>Средний чек</span>
                      <span className="badge badge-primary">£1,630</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{width: '81%'}}></div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex-between">
                      <span>Удержание клиентов</span>
                      <span className="badge badge-info">89%</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{width: '89%'}}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="glass-panel p-lg">
                <h3>Цели vs Факт</h3>
                <div className="space-y-4 mt-md">
                  <div className="p-md glass-panel">
                    <div className="flex-between">
                      <span>Месячная цель продаж</span>
                      <span className="stat-value">{formatCurrency(30000)}</span>
                    </div>
                    <div className="flex-between">
                      <span>Достигнуто</span>
                      <span className="badge badge-success">81.5%</span>
                    </div>
                  </div>

                  <div className="p-md glass-panel">
                    <div className="flex-between">
                      <span>Количество новых клиентов</span>
                      <span className="stat-value">50</span>
                    </div>
                    <div className="flex-between">
                      <span>Достигнуто</span>
                      <span className="badge badge-warning">48%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Кастомные отчеты */}
        {activeTab === 'custom' && (
          <div className="card">
            <div className="card-header">
              <h2 className="section-title">🔧 Кастомные отчеты</h2>
              <button className="btn btn-primary">+ Создать отчет</button>
            </div>

            <div className="space-y-4">
              <div className="glass-panel p-lg">
                <h3>Конструктор отчетов</h3>
                <div className="grid grid-3 mt-md">
                  <div className="form-group">
                    <label className="form-label">Источник данных</label>
                    <select className="form-input">
                      <option>Комиссии</option>
                      <option>Клиенты</option>
                      <option>Продукты</option>
                      <option>Консультанты</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Период</label>
                    <select className="form-input">
                      <option>Текущий месяц</option>
                      <option>Последние 3 месяца</option>
                      <option>Текущий год</option>
                      <option>Кастомный период</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Формат</label>
                    <select className="form-input">
                      <option>Excel</option>
                      <option>PDF</option>
                      <option>CSV</option>
                    </select>
                  </div>
                </div>
                <div className="mt-md">
                  <button className="btn btn-primary">🚀 Генерировать отчет</button>
                  <button className="btn btn-outline">💾 Сохранить шаблон</button>
                </div>
              </div>

              <div className="glass-panel p-lg">
                <h3>Сохраненные шаблоны</h3>
                <div className="space-y-2 mt-md">
                  <div className="flex-between p-md glass-panel">
                    <div>
                      <strong>Месячный отчет по комиссиям</strong>
                      <div className="text-secondary">Создан 15.11.2024</div>
                    </div>
                    <div className="flex gap-sm">
                      <button className="btn btn-primary btn-small">🚀 Запустить</button>
                      <button className="btn btn-outline btn-small">✏️ Изменить</button>
                    </div>
                  </div>

                  <div className="flex-between p-md glass-panel">
                    <div>
                      <strong>Анализ производительности консультантов</strong>
                      <div className="text-secondary">Создан 08.12.2024</div>
                    </div>
                    <div className="flex gap-sm">
                      <button className="btn btn-primary btn-small">🚀 Запустить</button>
                      <button className="btn btn-outline btn-small">✏️ Изменить</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Стили для прогресс-бара */}
      <style jsx>{`
        .progress-bar {
          width: 100%;
          height: 8px;
          background: rgba(0,0,0,0.1);
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #667eea, #764ba2);
          border-radius: 4px;
          transition: width 0.3s ease;
        }
      `}</style>
    </Layout>
  );
};

export default Reports;
