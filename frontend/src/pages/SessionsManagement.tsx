import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import authService from '../services/auth.service';
import { Navigation } from '../components/common/Navigation';

interface Session {
  id: string;
  userAgent: string;
  ipAddress: string;
  lastActivity: string;
  expiresAt: string;
  isActive: boolean;
}

interface ActionState {
  loading: boolean;
  sessionId?: string;
  type: 'single' | 'all' | null;
}

export const SessionsManagement: React.FC = () => {
  const { logout } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [actionState, setActionState] = useState<ActionState>({ loading: false, type: null });
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string>('');

  const loadSessions = async () => {
    try {
      setLoading(true);
      const data = await authService.getSessions();
      setSessions(data);
      
      // Get current session by matching user agent and IP
      const currentSession = data.find(session => 
        session.userAgent === navigator.userAgent && 
        session.isActive
      );
      
      if (currentSession) {
        setCurrentSessionId(currentSession.id);
      }
    } catch (err) {
      setError('Failed to load sessions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSessions();
  }, []);

  const handleRevokeSession = async (sessionId: string) => {
    try {
      setActionState({ loading: true, sessionId, type: 'single' });
      await authService.revokeSession(sessionId);
      await loadSessions();
      setError('');
    } catch (err) {
      setError('Failed to revoke session');
    } finally {
      setActionState({ loading: false, type: null });
    }
  };

  const handleRevokeAllSessions = async () => {
    try {
      setActionState({ loading: true, type: 'all' });
      await authService.revokeAllSessions();
      await loadSessions();
      setError('');
      setShowConfirmDialog(false);
    } catch (err) {
      setError('Failed to revoke all sessions');
    } finally {
      setActionState({ loading: false, type: null });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const getBrowserIcon = (userAgent: string) => {
    if (userAgent.includes('Firefox')) {
      return '🦊';
    } else if (userAgent.includes('Chrome')) {
      return '🌐';
    } else if (userAgent.includes('Safari')) {
      return '🧭';
    } else if (userAgent.includes('Edge')) {
      return '📱';
    } else {
      return '🌍';
    }
  };

  const ConfirmDialog = () => (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Sign out all other devices?
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          This will end all other active sessions. You'll remain signed in on this device.
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={() => setShowConfirmDialog(false)}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={handleRevokeAllSessions}
            disabled={actionState.loading}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md disabled:opacity-50"
          >
            {actionState.loading ? 'Signing out...' : 'Sign out all'}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation onLogout={logout} />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900">Active Sessions</h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Manage your active sessions across all devices
                  </p>
                </div>
                {sessions.length > 1 && (
                  <button
                    onClick={() => setShowConfirmDialog(true)}
                    disabled={actionState.loading}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    Sign out all other devices
                  </button>
                )}
              </div>

              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center">
                  <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              )}

              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="divide-y divide-gray-200">
                  {sessions.filter(session => session.isActive).map((session) => (
                    <div 
                      key={session.id} 
                      className={`p-6 flex items-center justify-between hover:bg-gray-50 ${
                        session.id === currentSessionId ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="text-2xl">{getBrowserIcon(session.userAgent)}</div>
                        <div>
                          <div className="text-sm font-medium text-gray-900 flex items-center">
                            {session.userAgent}
                            {session.id === currentSessionId && (
                              <span className="ml-2 px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full">
                                Current session
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-500">
                            IP: {session.ipAddress}
                          </div>
                          <div className="text-xs text-gray-400 flex items-center">
                            <span title={formatDate(session.lastActivity)}>
                              Last activity: {formatTimeAgo(session.lastActivity)}
                            </span>
                          </div>
                          <div className="text-xs text-gray-400">
                            Expires: {formatDate(session.expiresAt)}
                          </div>
                        </div>
                      </div>
                      {session.id !== currentSessionId && (
                        <button
                          onClick={() => handleRevokeSession(session.id)}
                          disabled={actionState.loading && actionState.sessionId === session.id}
                          className="ml-4 px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors disabled:opacity-50"
                        >
                          {actionState.loading && actionState.sessionId === session.id ? (
                            <span className="flex items-center">
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-700" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                              </svg>
                              Signing out...
                            </span>
                          ) : (
                            'Sign out'
                          )}
                        </button>
                      )}
                    </div>
                  ))}

                  {sessions.filter(session => session.isActive).length === 0 && (
                    <div className="p-6 text-center text-gray-500">
                      No active sessions found
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      {showConfirmDialog && <ConfirmDialog />}
    </div>
  );
};