import { useState, useEffect } from 'react';
import { api, User, Message, AdminSpace } from '@/services/api';
import { useAuth } from '@/hooks/useAuth';
import AdminUsersPanel from './AdminUsersPanel';
import AdminSpacesPanel from './AdminSpacesPanel';
import AdminMessagesPanel from './AdminMessagesPanel';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [spaces, setSpaces] = useState<AdminSpace[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedSpace, setSelectedSpace] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.role !== 'admin') {
      setError('Access denied. Admin privileges required.');
      return;
    }

    loadData();
  }, [user, selectedSpace]);

  const loadData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [usersRes, spacesRes, messagesRes] = await Promise.all([
        api.getUsers(),
        api.getAdminSpaces(),
        selectedSpace === 'all' 
          ? api.getAdminMessages() 
          : api.getAdminMessages(selectedSpace)
      ]);

      if (usersRes.error) throw new Error(usersRes.error);
      if (spacesRes.error) throw new Error(spacesRes.error);
      if (messagesRes.error) throw new Error(messagesRes.error);

      setUsers(usersRes.data.users);
      setSpaces(spacesRes.data.spaces);
      setMessages(messagesRes.data.messages);
    } catch (err: any) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <h2 className="text-xl font-bold text-red-600 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">You must be an admin to access this page.</p>
          <button
            onClick={() => window.location.href = user?.role === 'user' ? '/user' : '/'}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Go {user?.role === 'user' ? 'To User Dashboard' : 'Home'}
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <svg className="h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
                <span className="ml-2 text-xl font-bold text-gray-900">Admin Dashboard</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                  <span className="text-sm font-medium text-indigo-600">
                    {user.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-700">{user.username}</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  Admin
                </span>
              </div>
              <button
                onClick={logout}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
              >
                <svg className="-ml-0.5 mr-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                </svg>
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg flex items-center">
            <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <AdminUsersPanel users={users} />
          </div>
          
          <div className="lg:col-span-1">
            <AdminSpacesPanel 
              spaces={spaces} 
              selectedSpace={selectedSpace}
              onSpaceChange={setSelectedSpace}
            />
          </div>
          
          <div className="lg:col-span-1">
            <AdminMessagesPanel 
              messages={messages} 
              selectedSpace={selectedSpace}
              spaces={spaces}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;