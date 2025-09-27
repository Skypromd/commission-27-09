import React from 'react';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { LanguageSettings } from '@/components/common/LanguageSettings';
import { Card } from '@/components/ui/Card';

// Временно используем заглушку, пока API не будет готово
const useGetSettingsQuery = () => ({
  data: { language: 'en', theme: 'light', notifications: { email: true, push: true } },
  isLoading: false,
  isError: false,
  error: null,
});


const SettingsPage: React.FC = () => {
  const { data: settings, isLoading, isError, error } = useGetSettingsQuery();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return <ErrorMessage message={error?.toString() || 'Failed to load settings.'} />;
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      <Card>
        <h2 className="text-xl font-semibold mb-4">Language</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">Choose your preferred language for the application interface.</p>
        <LanguageSettings />
      </Card>

      <Card>
        <h2 className="text-xl font-semibold mb-4">Theme</h2>
        <p className="text-gray-600 dark:text-gray-400">This feature is coming soon.</p>
      </Card>

      <Card>
        <h2 className="text-xl font-semibold mb-4">Notifications</h2>
        <p className="text-gray-600 dark:text-gray-400">This feature is coming soon.</p>
      </Card>

    </div>
  );
};

export default SettingsPage;

