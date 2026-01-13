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
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center overflow-hidden">
        <div className="text-center relative z-10">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg animate-pulse">Loading...</p>
        </div>
        
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        </div>
      </div>
    );
  }

  if (user && user.role === 'admin') {
    useEffect(() => {
      router.push('/admin');
    }, [router]);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center overflow-hidden">
        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-white/20 relative z-10">
          <h2 className="text-xl font-bold text-red-500 mb-4 gradient-text">Redirecting...</h2>
          <p className="text-gray-600 mb-6">Admins should use the admin dashboard.</p>
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
        </div>
        
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center overflow-hidden">
        <div className="text-center relative z-10">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg animate-pulse">Loading user dashboard...</p>
        </div>
        
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50/30 to-purple-50/30 overflow-hidden">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>
      
      <header className="bg-white/80 backdrop-blur-sm shadow-lg sticky top-0 z-10 border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center animate-float">
                <div className="p-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 shadow-lg">
                  <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <span className="ml-3 text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">User Dashboard</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 flex items-center justify-center shadow-md">
                  <span className="text-sm font-bold text-indigo-600">
                    {user?.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-700 hidden sm:block">{user?.username}</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 shadow-sm">
                  User
                </span>
              </div>
              <button
                onClick={logout}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full text-white bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl btn-hover"
              >
                <svg className="-ml-0.5 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                </svg>
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {error && (
          <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-pink-50 text-red-700 rounded-xl flex items-center animate-shake shadow-md">
            <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <div className="mb-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
          <div className="flex border-b border-gray-200/50">
            <button
              className={`py-3 px-6 font-semibold text-sm rounded-t-lg transition-all duration-300 ${
                activeTab === 'spaces' 
                  ? 'border-b-2 border-indigo-500 text-indigo-600 bg-indigo-50' 
                  : 'text-gray-500 hover:text-indigo-600 hover:bg-indigo-50/50'
              }`}
              onClick={() => setActiveTab('spaces')}
            >
              <span className="flex items-center">
                <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                My Spaces
              </span>
            </button>
            <button
              className={`py-3 px-6 font-semibold text-sm rounded-t-lg transition-all duration-300 ${
                activeTab === 'messages' 
                  ? 'border-b-2 border-indigo-500 text-indigo-600 bg-indigo-50' 
                  : 'text-gray-500 hover:text-indigo-600 hover:bg-indigo-50/50'
              }`}
              onClick={() => setActiveTab('messages')}
            >
              <span className="flex items-center">
                <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                Recent Messages
              </span>
            </button>
            <button
              className={`py-3 px-6 font-semibold text-sm rounded-t-lg transition-all duration-300 ${
                activeTab === 'profile' 
                  ? 'border-b-2 border-indigo-500 text-indigo-600 bg-indigo-50' 
                  : 'text-gray-500 hover:text-indigo-600 hover:bg-indigo-50/50'
              }`}
              onClick={() => setActiveTab('profile')}
            >
              <span className="flex items-center">
                <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Profile
              </span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20 transition-all duration-300 hover:shadow-2xl">
              <h2 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-100/50">
                {activeTab === 'spaces' ? (
                  <span className="flex items-center">
                    <svg className="mr-2 h-5 w-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    My Spaces
                  </span>
                ) : activeTab === 'messages' ? (
                  <span className="flex items-center">
                    <svg className="mr-2 h-5 w-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    Recent Messages
                  </span>
                ) : (
                  <span className="flex items-center">
                    <svg className="mr-2 h-5 w-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Profile Information
                  </span>
                )}
              </h2>
              
              {activeTab === 'spaces' && (
                <div className="space-y-5">
                  {mySpaces.length > 0 ? (
                    mySpaces.map((space, index) => (
                      <div 
                        key={space.id} 
                        className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-50/50 to-purple-50/50 rounded-xl border border-indigo-100/30 transition-all duration-300 hover:scale-[1.02] animate-fade-in-left"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <div>
                          <p className="text-sm font-semibold text-gray-800">#{space.name}</p>
                          <p className="text-xs text-gray-600 mt-1">{space.description}</p>
                        </div>
                        <button 
                          onClick={() => window.location.href = `/chat?space=${space.id}`}
                          className="text-xs bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-lg hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 shadow-md hover:shadow-lg"
                        >
                          Join
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10 animate-float">
                      <div className="p-4 rounded-full bg-indigo-100 inline-block mb-4">
                        <svg className="mx-auto h-12 w-12 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                      </div>
                      <h3 className="mt-2 text-lg font-semibold text-gray-800 gradient-text">No spaces joined</h3>
                      <p className="mt-1 text-gray-600">Join a space to start chatting</p>
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === 'messages' && (
                <div className="space-y-4 max-h-80 overflow-y-auto">
                  {messages.slice(0, 10).map((msg, index) => (
                    <div 
                      key={index} 
                      className="p-4 bg-gradient-to-r from-white/80 to-indigo-50/50 rounded-xl border border-gray-100/30 transition-all duration-300 hover:scale-[1.01] animate-fade-in-left"
                      style={{ animationDelay: `${index * 30}ms` }}
                    >
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-indigo-600">{msg.user}</span>
                        <span className="text-xs text-gray-500">{new Date(msg.timestamp).toLocaleTimeString()}</span>
                      </div>
                      <p className="text-sm text-gray-800 mt-2">{msg.content}</p>
                      <span className="text-xs text-gray-600">in #{msg.spaceName}</span>
                    </div>
                  ))}
                  
                  {messages.length === 0 && (
                    <div className="text-center py-10 animate-float">
                      <div className="p-4 rounded-full bg-indigo-100 inline-block mb-4">
                        <svg className="mx-auto h-12 w-12 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                      </div>
                      <h3 className="mt-2 text-lg font-semibold text-gray-800 gradient-text">No recent messages</h3>
                      <p className="mt-1 text-gray-600">Start chatting to see messages here</p>
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === 'profile' && (
                <div className="space-y-5">
                  <div className="flex items-center p-5 bg-gradient-to-r from-indigo-50/50 to-purple-50/50 rounded-xl border border-indigo-100/30 animate-fade-in-up">
                    <div className="h-20 w-20 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 flex items-center justify-center mr-5 shadow-md">
                      <span className="text-xl font-bold text-indigo-600">
                        {user?.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">{user?.username}</h3>
                      <p className="text-gray-600">{user?.email}</p>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 mt-2 shadow-sm">
                        {(user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'User')} Account
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-5 bg-gradient-to-r from-white/80 to-indigo-50/50 rounded-xl border border-gray-100/30 animate-fade-in-up">
                    <h4 className="text-sm font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-100">Account Details</h4>
                    <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
                      <dt className="text-sm font-medium text-gray-600">Joined</dt>
                      <dd className="text-sm text-gray-900">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</dd>
                      
                      <dt className="text-sm font-medium text-gray-600">Last seen</dt>
                      <dd className="text-sm text-gray-900">{user?.lastSeen ? new Date(user.lastSeen).toLocaleString() : 'Just now'}</dd>
                      
                      <dt className="text-sm font-medium text-gray-600">Status</dt>
                      <dd className="text-sm text-gray-900">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 shadow-sm">
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
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20 transition-all duration-300 hover:shadow-2xl">
              <h2 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-100/50 flex items-center">
                <svg className="mr-2 h-5 w-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                All Spaces
              </h2>
              <div className="space-y-5 max-h-96 overflow-y-auto">
                {spaces.map((space, index) => (
                  <div 
                    key={space.id} 
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-white/80 to-indigo-50/50 rounded-xl border border-gray-100/30 transition-all duration-300 hover:scale-[1.01] animate-fade-in-left"
                    style={{ animationDelay: `${index * 40}ms` }}
                  >
                    <div>
                      <p className="text-sm font-semibold text-gray-800">#{space.name}</p>
                      <p className="text-xs text-gray-600 mt-1">{space.description}</p>
                      <p className="text-xs text-gray-600 mt-1 flex items-center">
                        <svg className="mr-1 h-3 w-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        {space.members.length} members
                      </p>
                    </div>
                    <button 
                      onClick={() => {
                        alert(`Joining space: ${space.name}`);
                      }}
                      className={`text-xs px-4 py-2 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg ${
                        mySpaces.some(s => s.id === space.id) 
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white cursor-default' 
                          : 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600'
                      }`}
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
      
      <style jsx global>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .btn-hover {
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }
        
        .btn-hover::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s;
        }
        
        .btn-hover:hover::before {
          left: 100%;
        }
      `}</style>
    </div>
  );
};

export default UserDashboard;