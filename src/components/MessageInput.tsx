interface MessageInputProps {
  newMessage: string;
  handleSendMessage: (e: React.FormEvent) => void;
  setNewMessage: (message: string) => void;
  isLoading: boolean;
  messageCount: number;
  isConnected?: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({ 
  newMessage, 
  handleSendMessage, 
  setNewMessage, 
  isLoading, 
  messageCount,
  isConnected = true
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    if (e.nativeEvent instanceof KeyboardEvent && e.nativeEvent.key === 'Enter' && !e.nativeEvent.shiftKey) {
      e.preventDefault();
      if (newMessage.trim() && !isLoading) {
        handleSendMessage(e);
      }
    }
  };

  return (
    <div className="border-t border-gray-200 p-4 bg-white">
      <form onSubmit={handleSendMessage} className="flex items-end">
        <div className="flex-1 bg-white border border-gray-300 rounded-lg shadow-sm overflow-hidden">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleSubmit}
            placeholder="Type a message..."
            className="w-full px-4 py-3 resize-none focus:outline-none text-sm max-h-32"
            rows={1}
            required
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || !newMessage.trim()}
          className={`ml-3 inline-flex items-center justify-center h-11 w-11 rounded-full ${
            newMessage.trim() 
              ? 'bg-indigo-500 hover:bg-indigo-600 text-white' 
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          } transition-colors duration-200 flex-shrink-0`}
        >
          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
          </svg>
        </button>
      </form>
      <div className="mt-2 text-xs text-gray-500 flex justify-between">
        <div className="flex items-center">
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
            isConnected 
              ? 'bg-green-100 text-green-800' 
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            <span className={`flex-shrink-0 w-2 h-2 rounded-full mr-1 ${
              isConnected ? 'bg-green-400' : 'bg-yellow-400'
            }`}></span>
            <span>{isConnected ? 'Connected' : 'Offline'}</span>
          </span>
          <span className="ml-2">Press Enter to send</span>
        </div>
        <span>{messageCount} messages</span>
      </div>
    </div>
  );
};

export default MessageInput;