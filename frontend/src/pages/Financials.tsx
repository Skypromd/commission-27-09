import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import '../styles/global-design-system.css';

const Financials: React.FC = () => {
  const [financialData, setFinancialData] = useState({
    totalRevenue: 54350,
    totalCommissions: 24450,
    pendingPayments: 8320,
    monthlyGrowth: 12.5
  });
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(amount);
  };

  return (
    <Layout>
      <div className="module-content slide-up">
        <h1>Финансовый раздел</h1>
        <p>
          Здесь будет отображаться информация о комиссиях, выплатах и другая
          финансовая отчетность.
        </p>

        {/* Финансовая сводка */}
        <div className="grid grid-4 mb-lg">
          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <h3>Total Revenue</h3>
              <p className="stat-value">{formatCurrency(financialData.totalRevenue)}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">💷</div>
            <div className="stat-content">
              <h3>Commissions</h3>
              <p className="stat-value">{formatCurrency(financialData.totalCommissions)}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⏳</div>
            <div className="stat-content">
              <h3>Pending Payments</h3>
              <p className="stat-value">{formatCurrency(financialData.pendingPayments)}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📈</div>
            <div className="stat-content">
              <h3>Monthly Growth</h3>
              <p className="stat-value">+{financialData.monthlyGrowth}%</p>
            </div>
          </div>
        </div>

        {/* Навигация по финансовым разделам */}
        <div className="nav-bar mb-lg">
          <button
            className={`nav-tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            📊 Financial Overview
          </button>
          <button
            className={`nav-tab ${activeTab === 'payments' ? 'active' : ''}`}
            onClick={() => setActiveTab('payments')}
          >
            💳 Payments
          </button>
          <button
            className={`nav-tab ${activeTab === 'reports' ? 'active' : ''}`}
            onClick={() => setActiveTab('reports')}
          >
            📈 Financial Reports
          </button>
          <button
            className={`nav-tab ${activeTab === 'budgets' ? 'active' : ''}`}
            onClick={() => setActiveTab('budgets')}
          >
            🎯 Budgets
          </button>
        </div>

        {/* Финансовый обзор */}
        {activeTab === 'overview' && (
          <div className="space-y-lg">
            <div className="grid grid-2">
              <div className="card">
                <div className="card-header">
                  <h3 className="section-title">💰 Income by Month</h3>
                </div>
                <div className="space-y-4">
                  <div className="glass-panel p-md">
                    <div className="flex-between">
                      <span>December 2024</span>
                      <div className="text-right">
                        <div className="stat-value text-lg">{formatCurrency(24450)}</div>
                        <div className="text-secondary">+12.5% vs November</div>
                      </div>
                    </div>
                  </div>
                  <div className="glass-panel p-md">
                    <div className="flex-between">
                      <span>November 2024</span>
                      <div className="text-right">
                        <div className="stat-value text-lg">{formatCurrency(21720)}</div>
                        <div className="text-secondary">+8.3% vs October</div>
                      </div>
                    </div>
                  </div>
                  <div className="glass-panel p-md">
                    <div className="flex-between">
                      <span>October 2024</span>
                      <div className="text-right">
                        <div className="stat-value text-lg">{formatCurrency(20050)}</div>
                        <div className="text-secondary">+5.2% vs September</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="card-header">
                  <h3 className="section-title">📊 Income Distribution</h3>
                </div>
                <div className="space-y-4">
                  <div className="glass-panel p-md">
                    <div className="flex-between mb-sm">
                      <div className="flex gap-md">
                        <span style={{ fontSize: '1.5em' }}>🛡️</span>
                        <span>Insurance</span>
                      </div>
                      <span className="stat-value text-lg">{formatCurrency(12450)}</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{width: '51%'}}></div>
                    </div>
                  </div>

                  <div className="glass-panel p-md">
                    <div className="flex-between mb-sm">
                      <div className="flex gap-md">
                        <span style={{ fontSize: '1.5em' }}>🏠</span>
                        <span>Mortgage</span>
                      </div>
                      <span className="stat-value text-lg">{formatCurrency(8320)}</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{width: '34%'}}></div>
                    </div>
                  </div>

                  <div className="glass-panel p-md">
                    <div className="flex-between mb-sm">
                      <div className="flex gap-md">
                        <span style={{ fontSize: '1.5em' }}>📈</span>
                        <span>Investments</span>
                      </div>
                      <span className="stat-value text-lg">{formatCurrency(3680)}</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{width: '15%'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h3 className="section-title">🎯 KPI & Goals</h3>
              </div>
              <div className="grid grid-3">
                <div className="glass-panel p-lg text-center">
                  <div style={{ fontSize: '2em', marginBottom: '10px' }}>🎯</div>
                  <h4>Monthly Goal</h4>
                  <div className="stat-value">{formatCurrency(30000)}</div>
                  <div className="text-secondary">Achieved: 81.5%</div>
                </div>

                <div className="glass-panel p-lg text-center">
                  <div style={{ fontSize: '2em', marginBottom: '10px' }}>📊</div>
                  <h4>Average Deal</h4>
                  <div className="stat-value">{formatCurrency(1630)}</div>
                  <div className="text-secondary">+15% vs last month</div>
                </div>

                <div className="glass-panel p-lg text-center">
                  <div style={{ fontSize: '2em', marginBottom: '10px' }}>🏆</div>
                  <h4>Conversion</h4>
                  <div className="stat-value">67%</div>
                  <div className="text-secondary">Best performance</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Раздел платежей */}
        {activeTab === 'payments' && (
          <div className="card">
            <div className="card-header">
              <h2 className="section-title">💳 Payment Management</h2>
              <div className="flex gap-md">
                <button className="btn btn-primary">+ New Payment</button>
                <button className="btn btn-secondary">💳 Bulk Payments</button>
                <button className="btn btn-outline">📤 Export</button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="glass-panel p-lg">
                <div className="flex-between">
                  <div className="flex gap-md">
                    <span style={{ fontSize: '2em' }}>💰</span>
                    <div>
                      <h3>Commission - Anna Petrova</h3>
                      <p className="text-secondary">Life Insurance #1205</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="stat-value text-lg">{formatCurrency(525)}</div>
                    <span className="badge badge-warning">⏳ Pending</span>
                  </div>
                </div>
              </div>

              <div className="glass-panel p-lg">
                <div className="flex-between">
                  <div className="flex gap-md">
                    <span style={{ fontSize: '2em' }}>💰</span>
                    <div>
                      <h3>Commission - Ivan Sidorov</h3>
                      <p className="text-secondary">Mortgage #2047</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="stat-value text-lg">{formatCurrency(875)}</div>
                    <span className="badge badge-success">✅ Paid</span>
                  </div>
                </div>
              </div>

              <div className="glass-panel p-lg">
                <div className="flex-between">
                  <div className="flex gap-md">
                    <span style={{ fontSize: '2em' }}>💰</span>
                    <div>
                      <h3>Commission - Maria Kozlova</h3>
                      <p className="text-secondary">Income Protection #3012</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="stat-value text-lg">{formatCurrency(320)}</div>
                    <span className="badge badge-primary">🔄 Processing</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Финансовые отчеты */}
        {activeTab === 'reports' && (
          <div className="card">
            <div className="card-header">
              <h2 className="section-title">📈 Financial Reports</h2>
              <button className="btn btn-primary">📊 Generate Report</button>
            </div>

            <div className="grid grid-2">
              <div className="glass-panel p-lg">
                <div className="flex gap-md mb-md">
                  <span style={{ fontSize: '2em' }}>📊</span>
                  <div>
                    <h3>Commission Report</h3>
                    <p className="text-secondary">December 2024</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex-between">
                    <span>Status:</span>
                    <span className="badge badge-success">Ready</span>
                  </div>
                  <div className="flex-between">
                    <span>Period:</span>
                    <span>12/01 - 12/31/2024</span>
                  </div>
                  <div className="flex-between">
                    <span>Size:</span>
                    <span>2.4 MB</span>
                  </div>
                </div>
                <div className="mt-md">
                  <button className="btn btn-primary btn-small">📥 Download</button>
                  <button className="btn btn-outline btn-small">👁️ View</button>
                </div>
              </div>

              <div className="glass-panel p-lg">
                <div className="flex gap-md mb-md">
                  <span style={{ fontSize: '2em' }}>💰</span>
                  <div>
                    <h3>P&L Report</h3>
                    <p className="text-secondary">Quarterly</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex-between">
                    <span>Status:</span>
                    <span className="badge badge-warning">Generating</span>
                  </div>
                  <div className="flex-between">
                    <span>Period:</span>
                    <span>Q4 2024</span>
                  </div>
                  <div className="flex-between">
                    <span>Progress:</span>
                    <span>75%</span>
                  </div>
                </div>
                <div className="mt-md">
                  <button className="btn btn-outline btn-small" disabled>⏳ Waiting</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Бюджеты */}
        {activeTab === 'budgets' && (
          <div className="card">
            <div className="card-header">
              <h2 className="section-title">🎯 Budget Planning</h2>
              <button className="btn btn-primary">+ New Budget</button>
            </div>

            <div className="space-y-lg">
              <div className="glass-panel p-lg">
                <h3 className="section-title">Budget for 2025</h3>
                <div className="grid grid-4 mt-md">
                  <div className="text-center">
                    <div className="stat-value">{formatCurrency(400000)}</div>
                    <div className="text-secondary">Target Revenue</div>
                  </div>
                  <div className="text-center">
                    <div className="stat-value">{formatCurrency(120000)}</div>
                    <div className="text-secondary">Operating Expenses</div>
                  </div>
                  <div className="text-center">
                    <div className="stat-value">{formatCurrency(280000)}</div>
                    <div className="text-secondary">Net Profit</div>
                  </div>
                  <div className="text-center">
                    <div className="stat-value">70%</div>
                    <div className="text-secondary">Margin</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-2">
                <div className="glass-panel p-lg">
                  <h4>Quarterly Goals</h4>
                  <div className="space-y-2 mt-md">
                    <div className="flex-between">
                      <span>Q1 2025</span>
                      <span className="stat-value">{formatCurrency(90000)}</span>
                    </div>
                    <div className="flex-between">
                      <span>Q2 2025</span>
                      <span className="stat-value">{formatCurrency(95000)}</span>
                    </div>
                    <div className="flex-between">
                      <span>Q3 2025</span>
                      <span className="stat-value">{formatCurrency(105000)}</span>
                    </div>
                    <div className="flex-between">
                      <span>Q4 2025</span>
                      <span className="stat-value">{formatCurrency(110000)}</span>
                    </div>
                  </div>
                </div>

                <div className="glass-panel p-lg">
                  <h4>Allocation by Category</h4>
                  <div className="space-y-2 mt-md">
                    <div className="flex-between">
                      <span>🛡️ Insurance</span>
                      <span className="badge badge-success">50%</span>
                    </div>
                    <div className="flex-between">
                      <span>🏠 Mortgage</span>
                      <span className="badge badge-primary">35%</span>
                    </div>
                    <div className="flex-between">
                      <span>📈 Investments</span>
                      <span className="badge badge-info">15%</span>
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

export default Financials;
