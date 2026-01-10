interface MessageInputProps {
  newMessage: string;
  handleSendMessage: (e: React.FormEvent) => void;
  setNewMessage: (message: string) => void;
  isLoading: boolean;
  messageCount: number;
}

const MessageInput: React.FC<MessageInputProps> = ({ 
  newMessage, 
  handleSendMessage, 
  setNewMessage, 
  isLoading, 
  messageCount 
}) => {
  return (
    <div className="border-t border-gray-200 p-4">
      <form onSubmit={handleSendMessage} className="flex items-center">
        <div className="flex-1 bg-gray-100 rounded-full mr-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="w-full bg-transparent border-0 focus:ring-0 text-sm py-2 px-4 text-gray-900"
            required
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || !newMessage.trim()}
          className={`inline-flex items-center justify-center h-11 w-11 rounded-full ${
            newMessage.trim() 
              ? 'bg-indigo-500 hover:bg-indigo-600 text-white' 
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          } transition-colors duration-200`}
        >
          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
          </svg>
        </button>
      </form>
      <div className="mt-2 text-xs text-gray-500 flex justify-between">
        <span>Press Enter to send</span>
        <span>{messageCount} messages in this channel</span>
      </div>
    </div>
  );
};

export default MessageInput;