import React from 'react';
import { Card } from '@/components/ui/Card';
import { useGetLiveActivityQuery } from '../api/dashboardApiSlice';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { FaHandshake, FaUserPlus, FaMoneyBillWave } from 'react-icons/fa';

const activityIcons = {
  deal_created: <FaHandshake className="text-blue-500" />,
  commission_paid: <FaMoneyBillWave className="text-green-500" />,
  client_added: <FaUserPlus className="text-purple-500" />,
};

const LiveActivityFeed: React.FC = React.memo(() => {
  const { data: activities, isLoading } = useGetLiveActivityQuery(undefined, {
    pollingInterval: 30000, // Опрашивать активность каждые 30 секунд
  });

  return (
    <Card>
      <h3 className="text-lg font-semibold mb-4">Live Activity</h3>
      {isLoading && !activities ? (
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner />
        </div>
      ) : (
        <ul className="space-y-4">
          {activities?.slice(0, 5).map(activity => (
            <li key={activity.id} className="flex items-center space-x-3">
              <div className="flex-shrink-0">{activityIcons[activity.type]}</div>
              <div>
                <p className="text-sm text-gray-800">{activity.description}</p>
                <p className="text-xs text-gray-500">{new Date(activity.timestamp).toLocaleString()}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
});

export default LiveActivityFeed;
