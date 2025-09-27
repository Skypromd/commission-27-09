import { useMemo } from 'react';
import { Typography, Spin, Alert, Row, Col } from 'antd';
import { useGetMortgagesQuery } from '@/features/mortgages/mortgagesApiSlice';
import { useGetPoliciesQuery } from '@/features/policies/policiesApiSlice';
import DashboardStats from '@/components/Dashboard/DashboardStats';
import DealsByStatusChart from '@/components/Dashboard/DealsByStatusChart';

const { Title } = Typography;

const Dashboard = () => {
  const { data: mortgages, isLoading: isLoadingMortgages, error: errorMortgages } = useGetMortgagesQuery();
  const { data: policies, isLoading: isLoadingPolicies, error: errorPolicies } = useGetPoliciesQuery();

  const stats = useMemo(() => {
    const totalMortgages = mortgages?.length || 0;
    const totalPolicies = policies?.length || 0;
    const totalLoanAmount = mortgages?.reduce((sum, item) => sum + Number(item.loan_amount), 0) || 0;
    const totalPremiumAmount = policies?.reduce((sum, item) => sum + Number(item.premium_amount), 0) || 0;
    return { totalMortgages, totalPolicies, totalLoanAmount, totalPremiumAmount };
  }, [mortgages, policies]);

  const chartData = useMemo(() => {
    const allDeals = [...(mortgages || []), ...(policies || [])];
    const statusCounts = allDeals.reduce((acc, deal) => {
      acc[deal.status] = (acc[deal.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(statusCounts).map(([name, value]) => ({ name, value }));
  }, [mortgages, policies]);

  if (isLoadingMortgages || isLoadingPolicies) {
    return <Spin size="large" className="flex justify-center items-center h-full" />;
  }

  if (errorMortgages || errorPolicies) {
    return <Alert message="Ошибка загрузки данных для панели управления" type="error" showIcon />;
  }

  return (
    <div className="space-y-8">
      <Title level={2}>Панель управления</Title>
      <DashboardStats {...stats} />
      <Row gutter={16}>
        <Col span={12}>
          <DealsByStatusChart data={chartData} />
        </Col>
        {/* Здесь можно добавить другие графики */}
      </Row>
    </div>
  );
};

export default Dashboard;
