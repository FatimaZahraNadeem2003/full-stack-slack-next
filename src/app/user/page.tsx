'use client';

import { useState, useEffect } from 'react';
import { api, Space } from '@/services/api';
import { useAuth } from '@/hooks/useAuth';
import { useChat } from '@/hooks/useChat';
import { useRouter } from 'next/navigation';

const UserDashboard = () => {
  const { user, logout, isLoading: authLoading } = useAuth();
  const { messages, sendMessage } = useChat('general');
  const router = useRouter();
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [mySpaces, setMySpaces] = useState<Space[]>([]);
  const [activeTab, setActiveTab] = useState<'spaces' | 'messages' | 'profile'>('spaces');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && user) {
      if (user.role === 'admin') {
        router.push('/admin');
        return;
      }
      
      loadUserData();
    } else if (!authLoading && !user) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  const loadUserData = async () => {
    setLoading(true);
    setError(null);

    try {
      const allSpacesRes = await api.getSpaces();

      if (allSpacesRes.error) throw new Error(allSpacesRes.error);

      setSpaces(allSpacesRes.data.spaces);
      setMySpaces(allSpacesRes.data.spaces.filter((space: Space) => 
        space.members.some((member: any) => member.id === user?.id)
      ));
    } catch (err: any) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || (!user && !authLoading)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (user && user.role === 'admin') {
    useEffect(() => {
      router.push('/admin');
    }, [router]);
    
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <h2 className="text-xl font-bold text-red-600 mb-4">Redirecting...</h2>
          <p className="text-gray-600 mb-6">Admins should use the admin dashboard.</p>
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading user dashboard...</p>
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <span className="ml-2 text-xl font-bold text-gray-900">User Dashboard</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                  <span className="text-sm font-medium text-indigo-600">
                    {user?.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-700">{user?.username}</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  User
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

        <div className="mb-6 bg-white rounded-xl shadow p-4">
          <div className="flex border-b border-gray-200">
            <button
              className={`py-2 px-4 font-medium text-sm ${activeTab === 'spaces' ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('spaces')}
            >
              My Spaces
            </button>
            <button
              className={`py-2 px-4 font-medium text-sm ${activeTab === 'messages' ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('messages')}
            >
              Recent Messages
            </button>
            <button
              className={`py-2 px-4 font-medium text-sm ${activeTab === 'profile' ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('profile')}
            >
              Profile
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {activeTab === 'spaces' ? 'My Spaces' : 
                 activeTab === 'messages' ? 'Recent Messages' : 
                 'Profile Information'}
              </h2>
              
              {activeTab === 'spaces' && (
                <div className="space-y-4">
                  {mySpaces.length > 0 ? (
                    mySpaces.map(space => (
                      <div key={space.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-gray-900">#{space.name}</p>
                          <p className="text-xs text-gray-500">{space.description}</p>
                        </div>
                        <button 
                          onClick={() => window.location.href = `/chat?space=${space.id}`}
                          className="text-xs bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700"
                        >
                          Join
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No spaces joined</h3>
                      <p className="mt-1 text-sm text-gray-500">Join a space to start chatting</p>
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === 'messages' && (
                <div className="space-y-4 max-h-80 overflow-y-auto">
                  {messages.slice(0, 10).map((msg, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex justify-between">
                        <span className="text-xs font-medium text-indigo-600">{msg.user}</span>
                        <span className="text-xs text-gray-500">{new Date(msg.timestamp).toLocaleTimeString()}</span>
                      </div>
                      <p className="text-sm text-gray-800 mt-1">{msg.content}</p>
                      <span className="text-xs text-gray-500">in #{msg.spaceName}</span>
                    </div>
                  ))}
                  
                  {messages.length === 0 && (
                    <div className="text-center py-8">
                      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No recent messages</h3>
                      <p className="mt-1 text-sm text-gray-500">Start chatting to see messages here</p>
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === 'profile' && (
                <div className="space-y-4">
                  <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                    <div className="h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center mr-4">
                      <span className="text-xl font-medium text-indigo-600">
                        {user?.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{user?.username}</h3>
                      <p className="text-gray-600">{user?.email}</p>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                        {(user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'User')} Account
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Account Details</h4>
                    <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
                      <dt className="text-sm text-gray-600">Joined</dt>
                      <dd className="text-sm text-gray-900">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</dd>
                      
                      <dt className="text-sm text-gray-600">Last seen</dt>
                      <dd className="text-sm text-gray-900">{user?.lastSeen ? new Date(user.lastSeen).toLocaleString() : 'Just now'}</dd>
                      
                      <dt className="text-sm text-gray-600">Status</dt>
                      <dd className="text-sm text-gray-900">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Active
                        </span>
                      </dd>
                    </dl>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">All Spaces</h2>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {spaces.map(space => (
                  <div key={space.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">#{space.name}</p>
                      <p className="text-xs text-gray-500">{space.description}</p>
                      <p className="text-xs text-gray-500">{space.members.length} members</p>
                    </div>
                    <button 
                      onClick={() => {
                        alert(`Joining space: ${space.name}`);
                      }}
                      className="text-xs bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 disabled:opacity-50"
                      disabled={mySpaces.some(s => s.id === space.id)}
                    >
                      {mySpaces.some(s => s.id === space.id) ? 'Joined' : 'Join'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;