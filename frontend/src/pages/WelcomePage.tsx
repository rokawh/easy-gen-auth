import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Navigation } from '../components/common/Navigation';

export const WelcomePage: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation onLogout={logout} />

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow px-5 py-6 sm:px-6">
            <h2 className="text-2xl font-bold mb-4">Welcome, {user?.email}!</h2>
            <p className="text-gray-600">
              You are now signed in to your account. You can manage your active sessions or sign out using the navigation above.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}; 