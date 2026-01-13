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
    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/20 transition-all duration-300 hover:shadow-xl">
      <h2 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100/50 flex items-center">
        <svg className="mr-2 h-5 w-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
        Spaces ({spaces.length})
      </h2>
      
      <div className="mb-6">
        <label htmlFor="space-select" className="block text-sm font-medium text-gray-700 mb-2">
          Filter Messages by Space
        </label>
        <select
          id="space-select"
          value={selectedSpace}
          onChange={(e) => onSpaceChange(e.target.value)}
          className="block w-full px-4 py-2.5 text-base border border-gray-300/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-xl bg-white/70 backdrop-blur-sm transition-all duration-300"
        >
          <option value="all">All Spaces</option>
          {spaces.map(space => (
            <option key={space.id} value={space.id}>
              {space.name}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-5 max-h-80 overflow-y-auto">
        {spaces.map((space, index) => (
          <div 
            key={space.id} 
            className="p-5 bg-gradient-to-r from-white/80 to-indigo-50/50 rounded-xl border border-gray-100/30 transition-all duration-300 hover:scale-[1.01] animate-fade-in-left"
            style={{ animationDelay: `${index * 30}ms` }}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-semibold text-gray-800">#{space.name}</p>
                <p className="text-xs text-gray-600 mt-1 flex items-center">
                  <svg className="mr-1 h-3 w-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {space.type} • {space.members.length} members
                </p>
              </div>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                space.type === 'public' 
                  ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 shadow-sm' 
                  : space.type === 'private'
                  ? 'bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 shadow-sm'
                  : 'bg-gradient-to-r from-purple-100 to-violet-100 text-purple-800 shadow-sm'
              }`}>
                {space.type}
              </span>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-100/30 text-xs text-gray-600">
              <div className="flex items-center">
                <svg className="mr-1 h-3 w-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span>
                  {space.members.slice(0, 3).map(member => member.username).join(', ')}
                  {space.members.length > 3 && ` +${space.members.length - 3} more`}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminSpacesPanel;