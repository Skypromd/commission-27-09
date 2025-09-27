// Enhanced Dashboard with AI/ML insights and real-time features
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useWebSocket } from '@/hooks/useWebSocket';
import { useNotifications } from '@/contexts/NotificationContext';
import { useUsers, useClients, useCommissions } from '@/hooks/useApi';
import { apiClient } from '@/api/client';
import { Button, Card, LoadingSpinner } from '@/components/ui';
import NotificationBell from '@/components/ui/NotificationBell';
import LiveActivityFeed from '@/components/ui/LiveActivityFeed';
import { toast } from 'react-hot-toast';

interface AIInsights {
  performance_trend: {
    direction: 'improving' | 'declining' | 'stable';
    trend_value: number;
  };
  top_products: Record<string, any>;
  best_months: string[];
  next_month_prediction: {
    predicted_commission: number;
    confidence: 'high' | 'medium' | 'low';
  };
  recommendations: string[];
}

const EnhancedDashboard: React.FC = () => {
  const { user, hasPermission } = useAuth();
  const { isConnected, connectionStatus } = useWebSocket();
  const { unreadCount, isConnected: notificationConnected } = useNotifications();

  // Data hooks
  const { data: users } = useUsers();
  const { data: clients } = useClients();
  const { data: commissions } = useCommissions();

  // AI/ML states
  const [aiInsights, setAiInsights] = useState<AIInsights | null>(null);
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [predictionAmount, setPredictionAmount] = useState<number | null>(null);

  // Integration states
  const [integrationStatus, setIntegrationStatus] = useState<any>(null);

  // Real-time statistics states
  const [realTimeStats, setRealTimeStats] = useState({
    onlineUsers: 0,
    activeConnections: 0,
    todayCommissions: 0,
    todayPayments: 0
  });

  useEffect(() => {
    if (user && hasPermission('analytics:view')) {
      loadAIInsights();
      loadRealTimeStats();
    }

    if (hasPermission('system:admin')) {
      loadIntegrationStatus();
    }

    // Subscribe to real-time stats updates
    const handleStatsUpdate = (event: CustomEvent) => {
      if (event.detail.type === 'stats_update') {
        setRealTimeStats(event.detail.data);
      }
    };

    window.addEventListener('websocket-message', handleStatsUpdate);

    return () => {
      window.removeEventListener('websocket-message', handleStatsUpdate);
    };
  }, [user]);

  const loadAIInsights = async () => {
    if (!user) return;

    setLoadingInsights(true);
    try {
      const response = await apiClient.get(`/analytics/ml/insights/${user.id}`);
      setAiInsights(response.data.insights);

      toast.success('🤖 AI insights loaded successfully!', {
        icon: '🧠'
      });
    } catch (error: any) {
      console.error('Failed to load AI insights:', error);
      toast.error('Failed to load AI insights');
    } finally {
      setLoadingInsights(false);
    }
  };

  const loadIntegrationStatus = async () => {
    try {
      const response = await apiClient.get('/integrations/status');
      setIntegrationStatus(response.data.integrations);
    } catch (error) {
      console.error('Failed to load integration status:', error);
    }
  };

  const loadRealTimeStats = async () => {
    try {
      const response = await apiClient.get('/analytics/real-time-stats');
      setRealTimeStats(response.data);
    } catch (error) {
      console.error('Failed to load real-time stats:', error);
    }
  };

  const predictCommission = async () => {
    try {
      const response = await apiClient.post('/analytics/ml/predict-commission', {
        product_type: 'life_insurance',
        percentage: 3.5,
        client_value: 50000
      });

      setPredictionAmount(response.data.prediction.estimated_amount);

      toast.success(`💡 Predicted commission: £${response.data.prediction.estimated_amount}`, {
        duration: 5000,
        icon: '🔮'
      });
    } catch (error: any) {
      toast.error('Failed to generate prediction');
    }
  };

  const testBankIntegration = async () => {
    if (!hasPermission('system:admin')) return;

    try {
      const response = await apiClient.post('/integrations/bank/verify-payment', {
        transaction_id: 'TX123456789',
        amount: 1500,
        integration_id: 'barclays_openbanking'
      });

      if (response.data.verification_result.success) {
        toast.success('✅ Bank integration test successful!', {
          icon: '🏦'
        });
      } else {
        toast.error('❌ Bank integration test failed');
      }
    } catch (error) {
      toast.error('Bank integration test failed');
    }
  };

  const sendTestNotification = async () => {
    try {
      await apiClient.get(`/ws/notifications/test?user_id=${user?.id}&notification_type=commission`);
      toast.success('🧪 Test notification sent!');
    } catch (error) {
      toast.error('Failed to send test notification');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(amount);
  };

  const getTrendIcon = (direction: string) => {
    switch (direction) {
      case 'improving': return '📈';
      case 'declining': return '📉';
      default: return '📊';
    }
  };

  if (!user) return <LoadingSpinner />;

  return (
    <div className="space-y-6 p-6">
      {/* Header with Real-time Status and Notifications */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Enhanced Dashboard v2.0
          </h1>
          <p className="text-gray-600">
            Welcome back, {user.full_name}!
            {isConnected && (
              <span className="ml-2 text-green-600">
                🔗 Real-time connected
              </span>
            )}
            {unreadCount > 0 && (
              <span className="ml-2 text-blue-600">
                📬 {unreadCount} new notifications
              </span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Real-time Notification Bell */}
          <NotificationBell />

          {hasPermission('analytics:view') && (
            <Button onClick={loadAIInsights} disabled={loadingInsights}>
              {loadingInsights ? '🤖 Loading...' : '🧠 Refresh AI Insights'}
            </Button>
          )}

          {hasPermission('system:admin') && (
            <>
              <Button onClick={testBankIntegration} variant="outline">
                🏦 Test Bank API
              </Button>

              <Button onClick={sendTestNotification} variant="outline">
                🧪 Test Notification
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Real-time Connection Status */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${
              isConnected ? 'bg-green-500' : 'bg-red-500'
            }`} />
            <span className="font-medium">
              Real-time Status: {connectionStatus}
            </span>
            {realTimeStats.onlineUsers > 0 && (
              <span className="text-sm text-gray-600">
                • {realTimeStats.onlineUsers} users online
              </span>
            )}
          </div>

          <div className="flex items-center gap-4 text-sm">
            <span className="text-gray-600">
              {isConnected ? 'Receiving live updates' : 'Reconnecting...'}
            </span>
            <span className="text-blue-600">
              {realTimeStats.activeConnections} active connections
            </span>
          </div>
        </div>
      </Card>

      {/* Enhanced Statistics with Real-time Data */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">
                {users?.items?.length || 0}
              </p>
              <p className="text-xs text-green-600">
                {realTimeStats.onlineUsers} online now
              </p>
            </div>
            <div className="text-3xl">👥</div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Today's Commissions</p>
              <p className="text-2xl font-bold text-gray-900">
                {realTimeStats.todayCommissions}
              </p>
              <p className="text-xs text-blue-600">
                Live updates enabled
              </p>
            </div>
            <div className="text-3xl">💰</div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Today's Payments</p>
              <p className="text-2xl font-bold text-gray-900">
                {realTimeStats.todayPayments}
              </p>
              <p className="text-xs text-green-600">
                Real-time tracking
              </p>
            </div>
            <div className="text-3xl">🎉</div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Commission Value</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(commissions?.items?.reduce((sum: number, c: any) => sum + (c.amount || 0), 0) || 0)}
              </p>
              <p className="text-xs text-purple-600">
                Live calculations
              </p>
            </div>
            <div className="text-3xl">💷</div>
          </div>
        </Card>
      </div>

      {/* AI/ML Insights with Live Activity Feed */}
      {hasPermission('analytics:view') && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* AI Insights - 2 columns */}
          <div className="lg:col-span-2 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">🤖 AI Performance Insights</h3>
                {loadingInsights && <LoadingSpinner size="sm" />}
              </div>

              {aiInsights ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">
                      {getTrendIcon(aiInsights.performance_trend.direction)}
                    </span>
                    <div>
                      <p className="font-medium">Performance Trend</p>
                      <p className="text-sm text-gray-600 capitalize">
                        {aiInsights.performance_trend.direction}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="font-medium mb-2">🔮 Next Month Prediction</p>
                    <p className="text-lg font-bold text-green-600">
                      {formatCurrency(aiInsights.next_month_prediction.predicted_commission)}
                    </p>
                    <p className="text-sm text-gray-600">
                      Confidence: {aiInsights.next_month_prediction.confidence}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">Click "Refresh AI Insights" to load personalized analytics</p>
              )}
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">💡 AI Recommendations</h3>

              {aiInsights?.recommendations ? (
                <div className="space-y-3">
                  {aiInsights.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                      <span className="text-lg">💡</span>
                      <p className="text-sm">{rec}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Button onClick={predictCommission}>
                    🔮 Generate Commission Prediction
                  </Button>
                  {predictionAmount && (
                    <p className="mt-4 text-lg font-semibold text-green-600">
                      Predicted: {formatCurrency(predictionAmount)}
                    </p>
                  )}
                </div>
              )}
            </Card>
          </div>

          {/* Live Activity Feed - 1 column */}
          <div className="lg:col-span-1">
            <LiveActivityFeed />
          </div>
        </div>
      )}

      {/* Integration Status (Admin Only) */}
      {hasPermission('system:admin') && integrationStatus && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">🔗 Integration Status</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(integrationStatus).map(([id, integration]: [string, any]) => (
              <div key={id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{integration.name}</h4>
                  <div className={`w-3 h-3 rounded-full ${
                    integration.status === 'active' ? 'bg-green-500' :
                    integration.status === 'testing' ? 'bg-yellow-500' : 'bg-red-500'
                  }`} />
                </div>
                <p className="text-sm text-gray-600">{integration.type}</p>
                <p className="text-xs text-gray-500 capitalize">{integration.status}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">⚡ Quick Actions</h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button className="h-20 flex-col gap-2">
            <span className="text-2xl">➕</span>
            <span className="text-sm">New Commission</span>
          </Button>

          <Button variant="outline" className="h-20 flex-col gap-2">
            <span className="text-2xl">👤</span>
            <span className="text-sm">Add Client</span>
          </Button>

          <Button variant="outline" className="h-20 flex-col gap-2">
            <span className="text-2xl">📊</span>
            <span className="text-sm">View Reports</span>
          </Button>

          <Button variant="outline" className="h-20 flex-col gap-2">
            <span className="text-2xl">⚙️</span>
            <span className="text-sm">Settings</span>
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default EnhancedDashboard;
