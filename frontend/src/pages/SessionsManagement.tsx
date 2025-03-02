import React, { useState, useEffect } from 'react';
import { useAuth } from '@hooks/useAuth';
import authService from '@services/auth.service';
import { Navigation } from '@components/common/Navigation';
import { Button, Card, Loading, Alert } from '@components/common/ui';

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
  const [actionState, setActionState] = useState<ActionState>({
    loading: false,
    type: null,
  });
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string>('');

  const loadSessions = async () => {
    try {
      setLoading(true);
      const data = await authService.getSessions();
      setSessions(data);

      // Get current session by matching user agent and IP
      const currentSession = data.find(
        (session) =>
          session.userAgent === navigator.userAgent && session.isActive
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
    <div className='fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50'>
      <Card className='max-w-sm w-full mx-4'>
        <h3 className='text-lg font-medium text-gray-900 mb-4'>
          Sign out all other devices?
        </h3>
        <p className='text-sm text-gray-500 mb-4'>
          This will end all other active sessions. You'll remain signed in on
          this device.
        </p>
        <div className='flex justify-end space-x-3'>
          <Button
            variant='secondary'
            onClick={() => setShowConfirmDialog(false)}
          >
            Cancel
          </Button>
          <Button
            variant='danger'
            onClick={handleRevokeAllSessions}
            isLoading={actionState.loading}
          >
            Sign out all
          </Button>
        </div>
      </Card>
    </div>
  );

  return (
    <div className='min-h-screen bg-gray-100'>
      <Navigation onLogout={logout} />

      <main className='max-w-7xl mx-auto py-6 sm:px-6 lg:px-8'>
        <div className='px-4 py-6 sm:px-0'>
          {loading ? (
            <Loading center />
          ) : (
            <>
              <div className='flex justify-between items-center mb-6'>
                <div>
                  <h2 className='text-2xl font-semibold text-gray-900'>
                    Active Sessions
                  </h2>
                  <p className='mt-1 text-sm text-gray-500'>
                    Manage your active sessions across all devices
                  </p>
                </div>
                {sessions.length > 1 && (
                  <Button
                    variant='danger'
                    onClick={() => setShowConfirmDialog(true)}
                    isLoading={actionState.loading}
                  >
                    Sign out all other devices
                  </Button>
                )}
              </div>

              {error && (
                <Alert
                  type='error'
                  className='mb-4'
                >
                  {error}
                </Alert>
              )}

              <Card>
                <div className='divide-y divide-gray-200'>
                  {sessions
                    .filter((session) => session.isActive)
                    .map((session) => (
                      <div
                        key={session.id}
                        className={`p-6 flex items-center justify-between hover:bg-gray-50 ${
                          session.id === currentSessionId ? 'bg-blue-50' : ''
                        }`}
                      >
                        <div className='flex items-center space-x-4'>
                          <div className='text-2xl'>
                            {getBrowserIcon(session.userAgent)}
                          </div>
                          <div>
                            <div className='text-sm font-medium text-gray-900 flex items-center'>
                              {session.userAgent}
                              {session.id === currentSessionId && (
                                <span className='ml-2 px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full'>
                                  Current session
                                </span>
                              )}
                            </div>
                            <div className='text-sm text-gray-500'>
                              IP: {session.ipAddress}
                            </div>
                            <div className='text-xs text-gray-400 flex items-center'>
                              <span title={formatDate(session.lastActivity)}>
                                Last activity:{' '}
                                {formatTimeAgo(session.lastActivity)}
                              </span>
                            </div>
                            <div className='text-xs text-gray-400'>
                              Expires: {formatDate(session.expiresAt)}
                            </div>
                          </div>
                        </div>
                        {session.id !== currentSessionId && (
                          <Button
                            variant='secondary'
                            size='sm'
                            onClick={() => handleRevokeSession(session.id)}
                            isLoading={
                              actionState.loading &&
                              actionState.sessionId === session.id
                            }
                          >
                            Sign out
                          </Button>
                        )}
                      </div>
                    ))}

                  {sessions.filter((session) => session.isActive).length ===
                    0 && (
                    <div className='p-6 text-center text-gray-500'>
                      No active sessions found
                    </div>
                  )}
                </div>
              </Card>
            </>
          )}
        </div>
      </main>

      {showConfirmDialog && <ConfirmDialog />}
    </div>
  );
};
