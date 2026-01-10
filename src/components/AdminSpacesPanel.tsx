import { AdminSpace } from '@/services/api';

interface AdminSpacesPanelProps {
  spaces: AdminSpace[];
  selectedSpace: string;
  onSpaceChange: (spaceId: string) => void;
}

const AdminSpacesPanel: React.FC<AdminSpacesPanelProps> = ({ 
  spaces, 
  selectedSpace, 
  onSpaceChange 
}) => {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Spaces ({spaces.length})</h2>
      
      <div className="mb-4">
        <label htmlFor="space-select" className="block text-sm font-medium text-gray-700 mb-1">
          Filter Messages by Space
        </label>
        <select
          id="space-select"
          value={selectedSpace}
          onChange={(e) => onSpaceChange(e.target.value)}
          className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          <option value="all">All Spaces</option>
          {spaces.map(space => (
            <option key={space.id} value={space.id}>
              {space.name}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-4 max-h-80 overflow-y-auto">
        {spaces.map(space => (
          <div key={space.id} className="p-3 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-900">{space.name}</p>
                <p className="text-xs text-gray-500">{space.type} • {space.members.length} members</p>
              </div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                space.type === 'public' 
                  ? 'bg-green-100 text-green-800' 
                  : space.type === 'private'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-purple-100 text-purple-800'
              }`}>
                {space.type}
              </span>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              {space.members.slice(0, 3).map(member => member.username).join(', ')}
              {space.members.length > 3 && ` +${space.members.length - 3} more`}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminSpacesPanel;