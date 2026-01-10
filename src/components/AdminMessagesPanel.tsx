import { Message, AdminSpace } from '@/services/api';

interface AdminMessagesPanelProps {
  messages: Message[];
  selectedSpace: string;
  spaces: AdminSpace[];
}

const AdminMessagesPanel: React.FC<AdminMessagesPanelProps> = ({ 
  messages, 
  selectedSpace, 
  spaces 
}) => {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Messages</h2>
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {messages.length > 0 ? (
          messages.map(message => (
            <div key={message.id} className="p-3 bg-gray-50 rounded-lg border-l-4 border-indigo-500">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-900">{message.user}</p>
                  <p className="text-xs text-gray-500">
                    {message.userRole} • {new Date(message.timestamp).toLocaleString()}
                  </p>
                </div>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {message.spaceName}
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-700">{message.content}</p>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No messages</h3>
            <p className="mt-1 text-sm text-gray-500">
              {selectedSpace === 'all' 
                ? 'No messages found in any space' 
                : `No messages found in #${spaces.find(s => s.id === selectedSpace)?.name}`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMessagesPanel;