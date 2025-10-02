import React from 'react';

function App() {
  return (
    <div className="commission-tracker min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                Commission Tracker
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-600 mb-4">
                Commission Management System
              </h2>
              <p className="text-gray-500">
                Система управления комиссиями запущена и работает!
              </p>
              <div className="mt-6">
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded">
                  Начать работу
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;