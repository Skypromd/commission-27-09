import React, { useState } from 'react';

const TwoFactorAuth = ({ onTwoFactorSuccess, onBackToLogin, loading, user }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (code.length !== 6) {
      setError('Please enter a 6-digit code');
      return;
    }

    const result = await onTwoFactorSuccess(code);
    if (!result.success) {
      setError(result.error);
    }
  };

  const handleCodeChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setCode(value);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🔐</div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Two-Factor Authentication
            </h1>
            <p className="text-gray-600 mt-2">
              Welcome, {user?.username || 'User'}
            </p>
            <p className="text-gray-500 text-sm">
              Please enter the 6-digit verification code
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Verification Code</label>
              <input
                type="text"
                value={code}
                onChange={handleCodeChange}
                className="w-full px-4 py-4 text-center text-2xl font-mono border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 tracking-widest"
                placeholder="000000"
                maxLength="6"
                required
                autoComplete="one-time-code"
              />
              <p className="text-xs text-gray-500 mt-2 text-center">
                Enter the 6-digit code from your authenticator app
              </p>
            </div>
            
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            
            <button
              type="submit"
              disabled={loading || code.length !== 6}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-4 rounded-lg hover:from-purple-700 hover:to-indigo-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 font-medium"
            >
              {loading ? 'Verifying...' : 'Verify Code'}
            </button>
          </form>
          
          <div className="mt-6 text-center space-y-3">
            <button
              onClick={onBackToLogin}
              className="text-purple-600 hover:text-purple-700 text-sm font-medium"
            >
              Back to Login
            </button>
            
            <div className="text-xs text-gray-500 bg-gray-50 p-4 rounded-lg">
              <strong>For Demo Purposes:</strong><br/>
              Use code: <span className="font-mono font-bold">123456</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TwoFactorAuth;