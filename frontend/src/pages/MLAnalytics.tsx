import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Brain, Target, AlertCircle, Download, RefreshCw, Settings } from 'lucide-react';
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  DataTable
} from '../components/ui';
import Layout from '../components/layout/Layout';
import '../styles/global-design-system.css';

// Типизация для ML аналитики
interface MLPrediction {
  id: string;
  advisorName: string;
  productType: string;
  predictedRevenue: number;
  confidence: number;
  riskLevel: 'low' | 'medium' | 'high';
  recommendations: string[];
  modelVersion: string;
}

interface MLAnalyticsData {
  totalPredictions: number;
  averageConfidence: number;
  highRiskCount: number;
  modelAccuracy: number;
  predictions: MLPrediction[];
  trends: {
    labels: string[];
    values: number[];
  };
}

const MLAnalytics: React.FC = () => {
  const [data, setData] = useState<MLAnalyticsData>({
    totalPredictions: 0,
    averageConfidence: 0,
    highRiskCount: 0,
    modelAccuracy: 0,
    predictions: [],
    trends: { labels: [], values: [] }
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  useEffect(() => {
    // Моковые данные для ML аналитики
    const mockData: MLAnalyticsData = {
      totalPredictions: 156,
      averageConfidence: 87.5,
      highRiskCount: 23,
      modelAccuracy: 94.2,
      predictions: [
        {
          id: '1',
          advisorName: 'John Smith',
          productType: 'Life Insurance',
          predictedRevenue: 25000,
          confidence: 92.3,
          riskLevel: 'low',
          recommendations: ['Increase premium products focus', 'Target high-value clients'],
          modelVersion: 'v2.1.0'
        },
        {
          id: '2',
          advisorName: 'Sarah Davis',
          productType: 'Auto Insurance',
          predictedRevenue: 18500,
          confidence: 78.6,
          riskLevel: 'medium',
          recommendations: ['Diversify product portfolio', 'Improve client retention'],
          modelVersion: 'v2.1.0'
        },
        {
          id: '3',
          advisorName: 'Michael Brown',
          productType: 'Home Insurance',
          predictedRevenue: 12300,
          confidence: 65.4,
          riskLevel: 'high',
          recommendations: ['Focus on training', 'Review pricing strategy'],
          modelVersion: 'v2.1.0'
        }
      ],
      trends: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        values: [85.2, 87.1, 89.3, 88.7, 91.2, 94.2]
      }
    };

    setData(mockData);
    setLoading(false);
  }, []);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(amount);
  };

  const getRiskColor = (riskLevel: string): string => {
    switch (riskLevel) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    // Симуляция обновления данных
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const predictionColumns = [
    { accessorKey: 'advisorName', header: 'Advisor' },
    { accessorKey: 'productType', header: 'Product Type' },
    {
      accessorKey: 'predictedRevenue',
      header: 'Predicted Revenue',
      cell: ({ row }: any) => formatCurrency(row.original.predictedRevenue)
    },
    {
      accessorKey: 'confidence',
      header: 'Confidence',
      cell: ({ row }: any) => (
        <div className="flex items-center">
          <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
            <div
              className="bg-blue-600 h-2 rounded-full"
              style={{ width: `${row.original.confidence}%` }}
            />
          </div>
          <span className="text-sm font-medium">{row.original.confidence}%</span>
        </div>
      )
    },
    {
      accessorKey: 'riskLevel',
      header: 'Risk Level',
      cell: ({ row }: any) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(row.original.riskLevel)}`}>
          {row.original.riskLevel}
        </span>
      )
    },
    { accessorKey: 'modelVersion', header: 'Model' }
  ];

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">ML Analytics Dashboard</h1>
            <p className="text-gray-600 mt-1">Machine Learning predictions and insights</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button variant="outline">
              <Settings className="w-4 h-4 mr-2" />
              Configure
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Key ML Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Brain className="w-8 h-8 text-purple-600" />
                <div className="ml-4">
                  <div className="text-2xl font-bold">{data.totalPredictions}</div>
                  <div className="text-gray-500">Total Predictions</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Target className="w-8 h-8 text-green-600" />
                <div className="ml-4">
                  <div className="text-2xl font-bold">{data.modelAccuracy}%</div>
                  <div className="text-gray-500">Model Accuracy</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="w-8 h-8 text-blue-600" />
                <div className="ml-4">
                  <div className="text-2xl font-bold">{data.averageConfidence}%</div>
                  <div className="text-gray-500">Avg Confidence</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <AlertCircle className="w-8 h-8 text-red-600" />
                <div className="ml-4">
                  <div className="text-2xl font-bold">{data.highRiskCount}</div>
                  <div className="text-gray-500">High Risk Items</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Model Performance Chart */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Model Performance Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end justify-between space-x-2">
              {data.trends.labels.map((label, index) => (
                <div key={label} className="flex flex-col items-center flex-1">
                  <div
                    className="bg-blue-500 rounded-t w-full transition-all duration-300 hover:bg-blue-600"
                    style={{
                      height: `${(data.trends.values[index] / 100) * 200}px`,
                      minHeight: '20px'
                    }}
                  />
                  <div className="mt-2 text-sm text-gray-600">{label}</div>
                  <div className="text-xs text-gray-400">{data.trends.values[index]}%</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Predictions Table */}
        <Card>
          <CardHeader>
            <CardTitle>ML Predictions ({data.predictions.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              data={data.predictions}
              columns={predictionColumns}
              pagination={true}
              searchable={false}
            />
          </CardContent>
        </Card>

        {/* Recommendations Panel */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>AI Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.predictions
                .filter(p => p.recommendations.length > 0)
                .slice(0, 3)
                .map((prediction) => (
                  <div key={prediction.id} className="border-l-4 border-blue-500 pl-4">
                    <h4 className="font-semibold text-gray-900">{prediction.advisorName}</h4>
                    <ul className="mt-1 space-y-1">
                      {prediction.recommendations.map((rec, index) => (
                        <li key={index} className="text-sm text-gray-600">• {rec}</li>
                      ))}
                    </ul>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default MLAnalytics;
