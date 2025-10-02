import React, { useState, useEffect } from 'react';
import {
  Zap,
  RefreshCw,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Target,
  Eye,
  ChevronRight
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { Card, CardHeader, CardTitle, CardContent, Button } from '../ui';

// Типизация для AI инсайтов
interface AIInsight {
  insight_id: string;
  title: string;
  description: string;
  type: 'trend' | 'anomaly' | 'opportunity' | 'risk';
  confidence: number;
  impact_score: number;
  recommended_actions: string[];
  generated_at: string;
  metadata?: Record<string, any>;
}

interface AIInsightsPanelProps {
  className?: string;
  maxInsights?: number;
  onInsightClick?: (insight: AIInsight) => void;
}

const AIInsightsPanel: React.FC<AIInsightsPanelProps> = ({
  className,
  maxInsights = 10,
  onInsightClick
}) => {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Получение инсайтов
  const fetchInsights = async () => {
    setLoading(true);
    setError(null);

    try {
      // Моковые данные для демонстрации
      const mockInsights: AIInsight[] = [
        {
          insight_id: '1',
          title: 'Рост продаж страхования жизни',
          description: 'Обнаружен значительный рост продаж страхования жизни на 25% по сравнению с прошлым месяцем. Основные драйверы: новые продукты и улучшенный сервис.',
          type: 'trend',
          confidence: 0.92,
          impact_score: 8,
          recommended_actions: [
            'Увеличить маркетинговый бюджет на продвижение страхования жизни',
            'Расширить линейку продуктов страхования жизни',
            'Провести анализ конкурентов'
          ],
          generated_at: new Date().toISOString()
        },
        {
          insight_id: '2',
          title: 'Аномальное снижение конверсии',
          description: 'Выявлено необычное снижение конверсии в сегменте молодых клиентов (18-25 лет) на 15%. Возможные причины: изменения в предпочтениях или конкурентное давление.',
          type: 'anomaly',
          confidence: 0.87,
          impact_score: 7,
          recommended_actions: [
            'Провести фокус-группы с молодыми клиентами',
            'Пересмотреть ценовую политику для данного сегмента',
            'Улучшить онлайн-присутствие'
          ],
          generated_at: new Date().toISOString()
        },
        {
          insight_id: '3',
          title: 'Возможность кросс-продаж',
          description: 'Модель ML выявила 150+ клиентов с высокой вероятностью покупки дополнительных продуктов. Потенциальная выручка: £45,000.',
          type: 'opportunity',
          confidence: 0.94,
          impact_score: 9,
          recommended_actions: [
            'Запустить персонализированную кампанию',
            'Подготовить специальные предложения',
            'Назначить персональных менеджеров'
          ],
          generated_at: new Date().toISOString()
        }
      ];

      // Симуляция API вызова
      await new Promise(resolve => setTimeout(resolve, 1000));

      setInsights(mockInsights.slice(0, maxInsights));
      setLastUpdated(new Date());
    } catch (err) {
      setError('Ошибка загрузки AI инсайтов');
      console.error('Error fetching AI insights:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, [maxInsights]);

  // Функции для стилизации
  const getInsightIcon = (type: AIInsight['type']) => {
    switch (type) {
      case 'trend':
        return <TrendingUp className="h-5 w-5 text-blue-600" />;
      case 'anomaly':
        return <AlertTriangle className="h-5 w-5 text-orange-600" />;
      case 'opportunity':
        return <Target className="h-5 w-5 text-green-600" />;
      case 'risk':
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      default:
        return <Sparkles className="h-5 w-5 text-purple-600" />;
    }
  };

  const getInsightColor = (type: AIInsight['type']) => {
    switch (type) {
      case 'trend':
        return 'border-blue-200 bg-blue-50';
      case 'anomaly':
        return 'border-orange-200 bg-orange-50';
      case 'opportunity':
        return 'border-green-200 bg-green-50';
      case 'risk':
        return 'border-red-200 bg-red-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'bg-green-100 text-green-800';
    if (confidence >= 0.7) return 'bg-blue-100 text-blue-800';
    if (confidence >= 0.5) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const formatPercentage = (value: number) => {
    return `${Math.round(value)}%`;
  };

  // Состояние загрузки
  if (loading && insights.length === 0) {
    return (
      <Card className={cn('w-full', className)}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-purple-600" />
            AI Инсайты
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-purple-600" />
              <p className="text-gray-500">Анализируем данные...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-purple-600" />
            AI Инсайты
          </CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">
              Обновлено: {lastUpdated.toLocaleTimeString()}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchInsights}
              disabled={loading}
            >
              <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {insights.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Sparkles className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>Нет доступных инсайтов</p>
          </div>
        ) : (
          insights.map((insight) => (
            <div
              key={insight.insight_id}
              className={cn(
                'p-4 rounded-lg border-2 transition-all hover:shadow-md cursor-pointer',
                getInsightColor(insight.type)
              )}
              onClick={() => onInsightClick?.(insight)}
            >
              {/* Заголовок */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  {getInsightIcon(insight.type)}
                  <div>
                    <h3 className="font-semibold text-gray-900">{insight.title}</h3>
                    <span className="text-xs text-gray-500 capitalize">
                      {insight.type} • Impact: {insight.impact_score}/10
                    </span>
                  </div>
                </div>
                <div className={cn(
                  'px-2 py-1 rounded text-xs font-medium',
                  getConfidenceColor(insight.confidence)
                )}>
                  {formatPercentage(insight.confidence * 100)} уверенности
                </div>
              </div>

              {/* Описание */}
              <p className="text-sm text-gray-700 mb-4">{insight.description}</p>

              {/* Рекомендации */}
              {insight.recommended_actions.length > 0 && (
                <div className="mb-3">
                  <h4 className="text-xs font-medium text-gray-800 mb-2">Рекомендуемые действия:</h4>
                  <ul className="text-xs space-y-1">
                    {insight.recommended_actions.slice(0, 3).map((action, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <ChevronRight className="h-3 w-3 text-gray-400 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600">{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Действия */}
              <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                <span className="text-xs text-gray-500">
                  {new Date(insight.generated_at).toLocaleString()}
                </span>
                <Button variant="outline" size="sm">
                  <Eye className="h-3 w-3 mr-1" />
                  Подробнее
                </Button>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default AIInsightsPanel;
