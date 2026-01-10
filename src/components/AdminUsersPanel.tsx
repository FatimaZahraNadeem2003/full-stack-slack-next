import { User } from '@/services/api';

interface AdminUsersPanelProps {
  users: User[];
}

const AdminUsersPanel: React.FC<AdminUsersPanelProps> = ({ users }) => {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Users ({users.length})</h2>
      <div className="space-y-4 max-h-96 overflow-y-auto">
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