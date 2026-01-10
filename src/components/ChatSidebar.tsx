import { useAuth } from '@/hooks/useAuth';

interface ChatSidebarProps {
  isAdmin: boolean;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({ isAdmin }) => {
  return (
    <div className="w-full md:w-64 flex-shrink-0">
      <div className="bg-white rounded-xl shadow p-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Channels</h2>
        <ul className="space-y-2">
          <li>
            <a href="#" className="flex items-center p-2 text-sm font-medium text-indigo-700 bg-indigo-50 rounded-lg">
              <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
              </svg>
              # general
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center p-2 text-sm text-gray-600 rounded-lg hover:bg-gray-50">
              <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
              </svg>
              # random
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center p-2 text-sm text-gray-600 rounded-lg hover:bg-gray-50">
              <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
              </svg>
              # announcements
            </a>
          </li>
        </ul>
        
        <h3 className="text-md font-medium text-gray-900 mt-6 mb-3">Direct Messages</h3>
        <ul className="space-y-2">
          <li>
            <a href="#" className="flex items-center p-2 text-sm text-gray-600 rounded-lg hover:bg-gray-50">
              <div className="h-6 w-6 rounded-full bg-green-400 flex items-center justify-center mr-2">
                <span className="text-xs text-white">A</span>
              </div>
              Alex Johnson
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center p-2 text-sm text-gray-600 rounded-lg hover:bg-gray-50">
              <div className="h-6 w-6 rounded-full bg-yellow-400 flex items-center justify-center mr-2">
                <span className="text-xs text-white">S</span>
              </div>
              Sarah Miller
            </a>
          </li>
        </ul>
        
        {isAdmin && (
          <>
            <h3 className="text-md font-medium text-gray-900 mt-6 mb-3">Admin Actions</h3>
            <ul className="space-y-2">
              <li>
                <a 
                  href="/admin" 
                  className="flex items-center p-2 text-sm text-gray-600 rounded-lg hover:bg-indigo-50 hover:text-indigo-700"
                >
                  <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  </svg>
                  Admin Dashboard
                </a>
              </li>
            </ul>
          </>
        )}
      </div>
    </div>
  );
};

export default ChatSidebar;