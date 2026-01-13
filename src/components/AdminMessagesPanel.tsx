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
    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/20 transition-all duration-300 hover:shadow-xl">
      <h2 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100/50 flex items-center">
        <svg className="mr-2 h-5 w-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
        Recent Messages
      </h2>
      <div className="space-y-5 max-h-96 overflow-y-auto">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <div 
              key={message.id} 
              className="p-5 bg-gradient-to-r from-white/80 to-purple-50/50 rounded-xl border-l-4 border-purple-500 border border-gray-100/30 transition-all duration-300 hover:scale-[1.01] animate-fade-in-left"
              style={{ animationDelay: `${index * 30}ms` }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-semibold text-gray-800">{message.user}</p>
                  <p className="text-xs text-gray-600 mt-1 flex items-center">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mr-2 ${
                      message.userRole === 'admin' 
                        ? 'bg-gradient-to-r from-red-100 to-red-200 text-red-800 shadow-sm' 
                        : 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 shadow-sm'
                    }`}>
                      {message.userRole}
                    </span>
                    {new Date(message.timestamp).toLocaleString()}
                  </p>
                </div>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-purple-100 to-violet-100 text-purple-800 shadow-sm">
                  #{message.spaceName}
                </span>
              </div>
              <p className="mt-3 text-sm text-gray-700 bg-white/50 p-3 rounded-lg">{message.content}</p>
            </div>
          ))
        ) : (
          <div className="text-center py-10 animate-float">
            <div className="p-4 rounded-full bg-purple-100 inline-block mb-4">
              <svg className="mx-auto h-12 w-12 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="mt-2 text-lg font-semibold text-gray-800 gradient-text">No messages</h3>
            <p className="mt-1 text-gray-600">
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