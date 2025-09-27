// Типизация для аналитики
interface AnalyticsEvent {
  id: string;
  name: string;
  properties: Record<string, any>;
}

interface AnalyticsProperties {
  [key: string]: any;
}

interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  properties?: AnalyticsProperties;
}

class AnalyticsService {
  private events: AnalyticsEvent[] = [];
  private sessionId: string;
  private startTime: number;
  private apiEndpoint: string = '/api/analytics/events';

  constructor() {
    this.events = [];
    this.sessionId = this.generateSessionId();
    this.startTime = Date.now();

    // Автоматическая отправка событий при закрытии страницы
    window.addEventListener('beforeunload', () => {
      this.flush();
    });
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  track(eventName: string, properties: AnalyticsProperties = {}): void {
    const event: AnalyticsEvent = {
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: eventName,
      properties: {
        ...properties,
        sessionId: this.sessionId,
        timestamp: Date.now(),
        url: window.location.href,
        userAgent: navigator.userAgent
      }
    };

    this.events.push(event);

    // Отправляем на сервер (батчами)
    if (this.events.length >= 10) {
      this.flush();
    }

    console.log('Analytics Event:', event);
  }

  trackPageView(pageName: string, properties: AnalyticsProperties = {}): void {
    this.track('page_view', {
      page: pageName,
      ...properties
    });
  }

  trackUserAction(action: string, target: string, properties: AnalyticsProperties = {}): void {
    this.track('user_action', {
      action,
      target,
      ...properties
    });
  }

  trackPerformance(metric: string, value: number, properties: AnalyticsProperties = {}): void {
    this.track('performance_metric', {
      metric,
      value,
      ...properties
    });
  }

  trackError(error: Error, context: AnalyticsProperties = {}): void {
    this.track('error', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      ...context
    });
  }

  trackTiming(name: string, startTime: number, endTime: number, properties: AnalyticsProperties = {}): void {
    const duration = endTime - startTime;
    this.track('timing', {
      name,
      duration,
      startTime,
      endTime,
      ...properties
    });
  }

  async flush(): Promise<void> {
    if (this.events.length === 0) return;

    const eventsToSend = [...this.events];
    this.events = [];

    try {
      await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          events: eventsToSend,
          sessionId: this.sessionId,
          timestamp: Date.now()
        })
      });
    } catch (error) {
      console.error('Failed to send analytics events:', error);
      // Возвращаем события обратно в очередь при ошибке
      this.events.unshift(...eventsToSend);
    }
  }

  getSessionId(): string {
    return this.sessionId;
  }

  getSessionDuration(): number {
    return Date.now() - this.startTime;
  }

  clearEvents(): void {
    this.events = [];
  }

  getQueuedEventsCount(): number {
    return this.events.length;
  }
}

// Создаем единственный экземпляр сервиса
const analyticsService = new AnalyticsService();

// Экспортируем сервис и типы
export default analyticsService;
export type { AnalyticsEvent, AnalyticsProperties, PerformanceMetric };
export { AnalyticsService };
