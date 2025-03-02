import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import easyGeneratorLogo from '@assets/easy-generator-logo.svg';

interface NavigationProps {
  onLogout: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ onLogout }) => {
  const location = useLocation();
  const isSessionsPage = location.pathname === '/sessions';

  return (
    <nav className='bg-white shadow-lg'>
      <div className='max-w-7xl mx-auto px-4'>
        <div className='flex justify-between h-16'>
          <div className='flex items-center'>
            <img
              src={easyGeneratorLogo}
              alt='Easy Generator'
              className='h-12'
            />
          </div>
          <div className='flex items-center space-x-4'>
            <Link
              to={isSessionsPage ? '/' : '/sessions'}
              className='text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium'
            >
              {isSessionsPage ? 'Dashboard' : 'Manage Sessions'}
            </Link>
            <button
              onClick={onLogout}
              className='bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors'
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
