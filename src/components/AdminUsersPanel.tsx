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
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Users ({users.length})</h2>
      
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-md font-medium text-gray-900 mb-3">Create New User</h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label htmlFor="username" className="block text-xs font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter username"
              required
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-xs font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter email"
              required
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-xs font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter password"
              required
              minLength={6}
            />
          </div>
          
          {error && (
            <div className="text-xs text-red-600 bg-red-50 p-2 rounded">
              {error}
            </div>
          )}
          
          {success && (
            <div className="text-xs text-green-600 bg-green-50 p-2 rounded">
              {success}
            </div>
          )}
          
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md disabled:opacity-50 transition-colors duration-200"
          >
            {loading ? 'Creating...' : 'Create User'}
          </button>
        </form>
      </div>
      
      <div className="space-y-4 max-h-80 overflow-y-auto">
        {users.map(user => (
          <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                <span className="text-sm font-medium text-indigo-600">
                  {user.username.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{user.username}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
            </div>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              user.role === 'admin' 
                ? 'bg-red-100 text-red-800' 
                : 'bg-blue-100 text-blue-800'
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