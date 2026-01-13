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
    <div className="border-t border-white/20 p-4 bg-white/80 backdrop-blur-sm shadow-lg">
      <form onSubmit={handleSendMessage} className="flex items-end transition-all duration-300">
        <div className="flex-1 bg-white/70 backdrop-blur-sm border border-gray-300/50 rounded-xl shadow-sm overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition-all duration-300">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleSubmit}
            placeholder="Type a message..."
            className="w-full px-4 py-3 resize-none focus:outline-none text-sm max-h-32 bg-transparent transition-all duration-300 placeholder:text-gray-400"
            rows={1}
            required
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || !newMessage.trim()}
          className={`ml-3 inline-flex items-center justify-center h-12 w-12 rounded-full transition-all duration-300 flex-shrink-0 transform hover:scale-110 ${
            newMessage.trim() 
              ? 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl' 
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
          </svg>
        </button>
      </form>
      <div className="mt-2 text-xs text-gray-500 flex justify-between transition-all duration-300">
        <div className="flex items-center">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-all duration-300 ${
            isConnected 
              ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800' 
              : 'bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800'
          }`}>
            <span className={`flex-shrink-0 w-2 h-2 rounded-full mr-1.5 transition-all duration-300 ${
              isConnected ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'
            }`}></span>
            <span>{isConnected ? 'Connected' : 'Offline'}</span>
          </span>
          <span className="ml-2.5 transition-colors duration-300">Press Enter to send</span>
        </div>
        <span className="transition-colors duration-300">{messageCount} messages</span>
      </div>
    </div>
  );
};

export default MessageInput;