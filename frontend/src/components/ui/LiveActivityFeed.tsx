// Real-time Activity Feed Component
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useWebSocket } from '@/hooks/useWebSocket';
import { Card } from '@/components/ui';
import { cn } from '@/utils/cn';

interface ActivityItem {
  id: string;
  type: 'commission' | 'payment' | 'client' | 'user' | 'system';
  action: string;
  user: string;
  target?: string;
  amount?: number;
  timestamp: string;
  metadata?: any;
}

const LiveActivityFeed: React.FC = () => {
  const { user, hasPermission } = useAuth();
  const { isConnected } = useWebSocket();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    // Listen for WebSocket messages and convert to activity items
    const handleWebSocketMessage = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail) {
        const message = customEvent.detail;
        const activity: ActivityItem = {
          id: `${Date.now()}-${Math.random()}`,
          type: mapMessageToActivityType(message.type),
          action: message.message,
          user: message.user || 'System',
          target: message.data?.client_name || message.data?.target,
          amount: message.data?.amount,
          timestamp: message.timestamp || new Date().toISOString(),
          metadata: message.data
        };

        if (isLive) {
          setActivities(prev => [activity, ...prev].slice(0, 100)); // Keep last 100 activities
        }
      }
    };

    window.addEventListener('websocket-message', handleWebSocketMessage as EventListener);

    return () => {
      window.removeEventListener('websocket-message', handleWebSocketMessage as EventListener);
    };
  }, [isLive]);

  const mapMessageToActivityType = (messageType: string): ActivityItem['type'] => {
    const mapping: Record<string, ActivityItem['type']> = {
      'commission_created': 'commission',
      'commission_updated': 'commission',
      'commission_paid': 'payment',
      'client_assigned': 'client',
      'user_login': 'user',
      'system_announcement': 'system'
    };
    return mapping[messageType] || 'system';
  };

  const getActivityIcon = (type: string) => {
    const icons = {
      commission: '💰',
      payment: '🎉',
      client: '👤',
      user: '👋',
      system: '⚙️'
    };
    return icons[type as keyof typeof icons] || '📋';
  };

  const getActivityColor = (type: string) => {
    const colors = {
      commission: 'border-l-yellow-500 bg-yellow-50',
      payment: 'border-l-green-500 bg-green-50',
      client: 'border-l-blue-500 bg-blue-50',
      user: 'border-l-purple-500 bg-purple-50',
      system: 'border-l-gray-500 bg-gray-50'
    };
    return colors[type as keyof typeof colors] || 'border-l-gray-500 bg-gray-50';
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInSeconds = Math.floor((now.getTime() - time.getTime()) / 1000);

    if (diffInSeconds < 10) return 'just now';
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const formatCurrency = (amount?: number) => {
    if (!amount) return '';
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(amount);
  };

  // Only show to users with appropriate permissions
  if (!hasPermission('analytics:view')) {
    return null;
  }

  return (
    <Card className="h-96">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold">Live Activity Feed</h3>
          <span className={cn(
            "w-2 h-2 rounded-full",
            isConnected ? "bg-green-500" : "bg-red-500"
          )} />
          {isConnected && isLive && (
            <span className="animate-pulse text-green-600 text-xs font-medium">
              LIVE
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsLive(!isLive)}
            className={cn(
              "px-2 py-1 rounded text-xs font-medium transition-colors",
              isLive
                ? "bg-green-100 text-green-700 hover:bg-green-200"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            )}
          >
            {isLive ? '⏸️ Pause' : '▶️ Resume'}
          </button>

          <button
            onClick={() => setActivities([])}
            className="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200"
          >
            🗑️ Clear
          </button>
        </div>
      </div>

      {/* Activity List */}
      <div className="h-80 overflow-y-auto">
        {!isConnected && (
          <div className="p-4 text-center text-gray-500">
            <span className="text-2xl block mb-2">🔌</span>
            <p className="text-sm">Connecting to live feed...</p>
          </div>
        )}

        {isConnected && activities.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            <span className="text-4xl block mb-2">👁️</span>
            <p className="text-sm">Waiting for activity...</p>
            <p className="text-xs mt-1">Real-time updates will appear here</p>
          </div>
        )}

        <div className="divide-y">
          {activities.map((activity, index) => (
            <div
              key={activity.id}
              className={cn(
                "p-3 border-l-4 transition-all duration-300",
                getActivityColor(activity.type),
                index === 0 && isLive && "animate-pulse"
              )}
            >
              <div className="flex items-start gap-3">
                <span className="text-lg flex-shrink-0">
                  {getActivityIcon(activity.type)}
                </span>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm">
                      <span className="font-medium">{activity.user}</span>
                      <span className="text-gray-600 ml-1">{activity.action}</span>
                      {activity.target && (
                        <span className="font-medium ml-1">{activity.target}</span>
                      )}
                      {activity.amount && (
                        <span className="font-bold text-green-600 ml-1">
                          {formatCurrency(activity.amount)}
                        </span>
                      )}
                    </p>

                    <span className="text-xs text-gray-500 flex-shrink-0">
                      {formatTimeAgo(activity.timestamp)}
                    </span>
                  </div>

                  {/* Additional metadata */}
                  {activity.metadata && (
                    <div className="mt-1 text-xs text-gray-500">
                      {activity.metadata.status && (
                        <span className={cn(
                          "inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium",
                          activity.metadata.status === 'paid' ? 'bg-green-100 text-green-800' :
                          activity.metadata.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        )}>
                          {activity.metadata.status}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Stats */}
      <div className="p-3 border-t bg-gray-50">
        <div className="flex items-center justify-between text-xs text-gray-600">
          <span>
            {activities.length} activities {isLive ? '(live)' : '(paused)'}
          </span>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              Payments: {activities.filter(a => a.type === 'payment').length}
            </span>

            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-yellow-500 rounded-full" />
              Commissions: {activities.filter(a => a.type === 'commission').length}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default LiveActivityFeed;
