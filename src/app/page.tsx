"use client";

import { useState, useEffect } from "react";
import { api, Message } from "@/lib/api";

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    setIsLoading(true);
    const result = await api.getMessages();
    if (result.error) {
      console.error("Error fetching messages:", result.error);
    } else {
      setMessages(result.data.messages);
    }
    setIsLoading(false);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !username.trim()) return;

    const result = await api.sendMessage(username, newMessage);
    if (result.error) {
      console.error("Error sending message:", result.error);
    } else {
      setMessages([...messages, result.data]);
      setNewMessage("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Chat App</h1>
          <p className="text-gray-600">A simple chat application built with Next.js and Express</p>
        </div>
        
        <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
          {/* Chat header */}
          <div className="bg-indigo-600 px-6 py-4">
            <h2 className="text-xl font-semibold text-white">Chat Room</h2>
          </div>
          
          {/* Messages container */}
          <div className="p-4 h-96 overflow-y-auto">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <p className="text-gray-500">Loading messages...</p>
              </div>
            ) : messages.length > 0 ? (
              <ul className="space-y-4">
                {messages.map((msg) => (
                  <li key={msg.id} className="flex flex-col">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-xs font-medium text-indigo-600">{msg.user}</span>
                      <span className="text-xs text-gray-500">{new Date(msg.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <div className="bg-gray-100 rounded-lg p-3 max-w-xs sm:max-w-md">
                      <p className="text-gray-800">{msg.text}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex justify-center items-center h-64">
                <p className="text-gray-500">No messages yet. Be the first to send one!</p>
              </div>
            )}
          </div>
          
          {/* Message input form */}
          <div className="border-t p-4 bg-gray-50">
            <form onSubmit={handleSendMessage} className="flex flex-col space-y-4">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Your name"
                  className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
        
        <div className="text-center text-sm text-gray-500">
          <p>Frontend: Next.js • Backend: Express.js</p>
        </div>
      </div>
    </div>
  );
}
