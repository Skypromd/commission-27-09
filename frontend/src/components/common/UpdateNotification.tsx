import React, { useState, useEffect } from 'react';

const UpdateNotification = () => {
  const [showUpdate, setShowUpdate] = useState(false);
  const [registration, setRegistration] = useState(null);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((reg) => {
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              setRegistration(reg);
              setShowUpdate(true);
            }
          });
        });
      });
    }
  }, []);

  const handleUpdate = () => {
    if (registration && registration.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      window.location.reload();
    }
  };

  const handleDismiss = () => {
    setShowUpdate(false);
  };

  if (!showUpdate) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-blue-600 text-white p-4 rounded-lg shadow-lg max-w-sm z-50">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg className="w-6 h-6 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium">Update Available</h3>
          <p className="text-sm text-blue-200 mt-1">
            A new version of the app is available. Refresh to get the latest features.
          </p>
          <div className="mt-3 flex space-x-2">
            <button
              onClick={handleUpdate}
              className="bg-blue-500 hover:bg-blue-400 text-white px-3 py-1 rounded text-sm"
            >
              Update Now
            </button>
            <button
              onClick={handleDismiss}
              className="bg-transparent hover:bg-blue-500 text-blue-200 px-3 py-1 rounded text-sm border border-blue-400"
            >
              Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateNotification;