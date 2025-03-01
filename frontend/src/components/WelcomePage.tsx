import React from 'react';
import { useAuth } from '../hooks/useAuth';

export const WelcomePage: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold text-gray-800">
                Easy Generator Auth
              </h1>
            </div>
            <div className="flex items-center">
              <button
                onClick={logout}
                className="ml-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Welcome to the application
              </h2>
              {user && (
                <p className="text-lg text-gray-600">
                  Hello, {user.name}! You are logged in with {user.email}
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}; 