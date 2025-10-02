import React, { useMemo } from 'react';
import { Card } from '@/components/ui/Card';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { useGetDealsQuery } from '@/features/deals';
import { useGetClientsQuery } from '@/features/clients';
import { useGetAdvisersQuery } from '@/features/advisers';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const RecentDeals: React.FC = React.memo(() => {
  const { t } = useTranslation();
  const { data: dealsResponse, isLoading } = useGetDealsQuery({ ordering: '-created_at', page_size: 5 });
  const { data: clientsResponse } = useGetClientsQuery();
  const { data: advisersResponse } = useGetAdvisersQuery();

  const clientMap = useMemo(() => clientsResponse?.results.reduce((acc, client) => {
    acc[client.id] = `${client.first_name} ${client.last_name}`;
    return acc;
  }, {} as Record<string, string>) || {}, [clientsResponse]);

  const adviserMap = useMemo(() => advisersResponse?.results.reduce((acc, adviser) => {
    acc[adviser.id] = `${adviser.user.first_name} ${adviser.user.last_name}`;
    return acc;
  }, {} as Record<string, string>) || {}, [advisersResponse]);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

  return (
    <Card>
      <h3 className="text-lg font-semibold mb-4">{t('dashboard.recentDeals')}</h3>
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner />
        </div>
      ) : (
        <ul className="space-y-4">
          {dealsResponse?.results.map(deal => (
            <li key={deal.id} className="flex items-center justify-between">
              <div>
                <p className="font-medium">{clientMap[deal.client] || t('unknownClient')}</p>
                <p className="text-sm text-gray-500">{t('with')} {adviserMap[deal.adviser] || t('unknownAdviser')}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">{formatCurrency(deal.deal_value)}</p>
                <p className={`text-sm capitalize ${deal.status === 'completed' ? 'text-green-500' : 'text-yellow-500'}`}>{deal.status}</p>
              </div>
            </li>
          ))}
           {dealsResponse?.results.length === 0 && (
            <p className="text-gray-500 text-center py-10">{t('dashboard.noRecentDeals')}</p>
          )}
        </ul>
      )}
    </Card>
  );
});

export default RecentDeals;
