// Real-time WebSocket hook for React
import { useEffect, useRef, useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';

interface WebSocketMessage {
  type: string;
  title?: string;
  message: string;
  data?: any;
  timestamp: string;
  priority?: 'high' | 'medium' | 'low';
}

interface UseWebSocketOptions {
  autoConnect?: boolean;
  reconnectAttempts?: number;
  reconnectInterval?: number;
}

export const useWebSocket = (options: UseWebSocketOptions = {}) => {
  const {
    autoConnect = true,
    reconnectAttempts = 5,
    reconnectInterval = 3000
  } = options;

  const { user } = useAuth();
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected');
  const [reconnectCount, setReconnectCount] = useState(0);

  const connect = useCallback(() => {
    if (!user) {
      console.warn('[WebSocket] User not authenticated, skipping connection');
      return;
    }

    const token = localStorage.getItem('auth_tokens') ?
      JSON.parse(localStorage.getItem('auth_tokens')!)?.accessToken : null;

    if (!token) {
      console.warn('[WebSocket] No auth token available');
      return;
    }

    const wsUrl = `ws://localhost:8000/api/v1/ws/${user.id}?token=${token}`;

    try {
      setConnectionStatus('connecting');
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        console.log('[WebSocket] Connected successfully');
        setIsConnected(true);
        setConnectionStatus('connected');
        setReconnectCount(0);

        toast.success('🔗 Real-time updates connected', {
          duration: 2000,
          position: 'bottom-right'
        });
      };

      wsRef.current.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          handleMessage(message);
        } catch (error) {
          console.error('[WebSocket] Error parsing message:', error);
        }
      };

      wsRef.current.onclose = (event) => {
        console.log('[WebSocket] Connection closed:', event.code, event.reason);
        setIsConnected(false);
        setConnectionStatus('disconnected');

        // Attempt to reconnect if not manually closed
        if (event.code !== 1000 && reconnectCount < reconnectAttempts) {
          scheduleReconnect();
        }
      };

      wsRef.current.onerror = (error) => {
        console.error('[WebSocket] Connection error:', error);
        setConnectionStatus('error');
      };

    } catch (error) {
      console.error('[WebSocket] Failed to create connection:', error);
      setConnectionStatus('error');
    }
  }, [user, reconnectCount, reconnectAttempts]);

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close(1000, 'User disconnected');
      wsRef.current = null;
    }

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
  }, []);

  const scheduleReconnect = useCallback(() => {
    if (reconnectCount >= reconnectAttempts) {
      console.log('[WebSocket] Max reconnection attempts reached');
      toast.error('❌ Unable to establish real-time connection', {
        duration: 5000
      });
      return;
    }

    reconnectTimeoutRef.current = setTimeout(() => {
      console.log(`[WebSocket] Attempting to reconnect (${reconnectCount + 1}/${reconnectAttempts})`);
      setReconnectCount(prev => prev + 1);
      connect();
    }, reconnectInterval);
  }, [connect, reconnectCount, reconnectAttempts, reconnectInterval]);

  const sendMessage = useCallback((message: any) => {
    if (wsRef.current && isConnected) {
      wsRef.current.send(JSON.stringify(message));
    } else {
      console.warn('[WebSocket] Cannot send message - not connected');
    }
  }, [isConnected]);

  const handleMessage = useCallback((message: WebSocketMessage) => {
    console.log('[WebSocket] Received message:', message);

    // Handle different message types
    switch (message.type) {
      case 'commission_created':
        toast.success(`💰 ${message.title}: ${message.message}`, {
          duration: 5000,
          icon: '💰'
        });
        break;

      case 'commission_paid':
        toast.success(message.message, {
          duration: 8000,
          icon: '🎉',
          style: {
            background: '#10B981',
            color: 'white',
          }
        });
        break;

      case 'commission_updated':
        toast(`📊 ${message.title}: ${message.message}`, {
          duration: 4000,
          icon: '📊',
        });
        break;

      case 'client_assigned':
        toast(`👤 ${message.title}: ${message.message}`, {
          duration: 4000,
          icon: '👤',
        });
        break;

      case 'system_announcement':
        toast(message.message, {
          duration: 10000,
          icon: '📢',
          style: {
            background: '#3B82F6',
            color: 'white',
          }
        });
        break;

      case 'deadline_reminder':
        toast.error(`⏰ ${message.title}: ${message.message}`, {
          duration: 8000
        });
        break;

      case 'connection':
      case 'initial_data':
        console.log('[WebSocket] Connection established with initial data');
        break;

      case 'pong':
        // Handle ping/pong for connection health
        break;

      default:
        console.log('[WebSocket] Unknown message type:', message.type);
    }

    // Trigger custom events for components to listen to
    window.dispatchEvent(new CustomEvent('websocket-message', {
      detail: message
    }));
  }, []);

  // Auto-connect on mount if enabled
  useEffect(() => {
    if (autoConnect && user) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [autoConnect, user, connect, disconnect]);

  // Send periodic ping to keep connection alive
  useEffect(() => {
    if (isConnected) {
      const pingInterval = setInterval(() => {
        sendMessage({
          type: 'ping',
          timestamp: new Date().toISOString()
        });
      }, 30000); // Ping every 30 seconds

      return () => clearInterval(pingInterval);
    }
  }, [isConnected, sendMessage]);

  return {
    isConnected,
    connectionStatus,
    connect,
    disconnect,
    sendMessage,
    reconnectCount
  };
};
