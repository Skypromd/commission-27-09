import { Card, Col, Row, Statistic } from 'antd';
import { DollarOutlined, FileProtectOutlined, RiseOutlined } from '@ant-design/icons';

interface DashboardStatsProps {
  totalMortgages: number;
  totalPolicies: number;
  totalLoanAmount: number;
  totalPremiumAmount: number;
}

const DashboardStats = ({ totalMortgages, totalPolicies, totalLoanAmount, totalPremiumAmount }: DashboardStatsProps) => {
  return (
    <Row gutter={16}>
      <Col span={6}>
        <Card>
          <Statistic title="Всего ипотек" value={totalMortgages} prefix={<DollarOutlined />} />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic title="Всего полисов" value={totalPolicies} prefix={<FileProtectOutlined />} />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic
            title="Общая сумма кредитов"
            value={totalLoanAmount}
            precision={2}
            prefix={<RiseOutlined />}
            suffix="₽"
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic
            title="Общая сумма премий"
            value={totalPremiumAmount}
            precision={2}
            prefix={<RiseOutlined />}
            suffix="₽"
          />
        </Card>
      </Col>
    </Row>
  );
};

export default DashboardStats;

