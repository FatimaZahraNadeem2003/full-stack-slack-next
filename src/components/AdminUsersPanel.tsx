import { useState } from 'react';
import { User, api } from '@/services/api';

interface AdminUsersPanelProps {
  users: User[];
}

const AdminUsersPanel: React.FC<AdminUsersPanelProps> = ({ users }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await api.createUser(username, email, password);
      
      if (result.error) {
        throw new Error(result.error);
      }

      setSuccess('User created successfully!');
      setUsername('');
      setEmail('');
      setPassword('');
      
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/20 transition-all duration-300 hover:shadow-xl">
      <h2 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100/50 flex items-center">
        <svg className="mr-2 h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
        Users ({users.length})
      </h2>
      
      <div className="mb-6 p-5 bg-gradient-to-r from-red-50/50 to-pink-50/50 rounded-xl border border-red-100/30">
        <h3 className="text-md font-semibold text-gray-800 mb-4 flex items-center">
          <svg className="mr-2 h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
          Create New User
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300/50 rounded-lg bg-white/70 backdrop-blur-sm text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
              placeholder="Enter username"
              required
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300/50 rounded-lg bg-white/70 backdrop-blur-sm text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
              placeholder="Enter email"
              required
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300/50 rounded-lg bg-white/70 backdrop-blur-sm text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
              placeholder="Enter password"
              required
              minLength={6}
            />
          </div>
          
          {error && (
            <div className="text-sm text-red-600 bg-red-50/70 p-3 rounded-lg border border-red-100 animate-shake">
              {error}
            </div>
          )}
          
          {success && (
            <div className="text-sm text-green-600 bg-green-50/70 p-3 rounded-lg border border-green-100 animate-fade-in-up">
              {success}
            </div>
          )}
          
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white text-sm font-medium rounded-lg disabled:opacity-50 transition-all duration-300 transform hover:scale-[1.02] shadow-md hover:shadow-lg"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating...
              </span>
            ) : 'Create User'}
          </button>
        </form>
      </div>
      
      <div className="space-y-4 max-h-80 overflow-y-auto">
        {users.map((user, index) => (
          <div 
            key={user.id} 
            className="flex items-center justify-between p-4 bg-gradient-to-r from-white/80 to-red-50/30 rounded-xl border border-gray-100/30 transition-all duration-300 hover:scale-[1.01] animate-fade-in-left"
            style={{ animationDelay: `${index * 30}ms` }}
          >
            <div className="flex items-center">
              <div className="h-12 w-12 rounded-full bg-gradient-to-r from-red-100 to-pink-100 flex items-center justify-center mr-4 shadow-md">
                <span className="text-sm font-bold text-red-600">
                  {user.username.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">{user.username}</p>
                <p className="text-xs text-gray-600">{user.email}</p>
              </div>
            </div>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
              user.role === 'admin' 
                ? 'bg-gradient-to-r from-red-100 to-red-200 text-red-800 shadow-sm' 
                : 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 shadow-sm'
            }`}>
              {user.role}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminUsersPanel;