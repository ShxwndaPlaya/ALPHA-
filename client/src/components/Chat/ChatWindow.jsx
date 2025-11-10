import React, { useEffect, useRef, useState, useContext } from "react";
import { ChatContext } from "@/context/ChatContext";
import { AuthContext } from "@/context/AuthContext";
import { useSocket } from "@/hooks/useSocket";
import { SendIcon } from "@/assets/icons";

export default function ChatWindow() {
  const { currentChat, messages, addMessage } = useContext(ChatContext);
  const { user } = useContext(AuthContext);
  const socket = useSocket();
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Listen for incoming messages
  useEffect(() => {
    if (!socket) return;
    socket.on("receiveMessage", (message) => {
      addMessage(message);
    });
    return () => socket.off("receiveMessage");
  }, [socket, addMessage]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !currentChat) return;

    const message = {
      sender: user.username,
      text: newMessage,
      chatId: currentChat._id,
      timestamp: new Date().toISOString(),
    };

    // Emit message via socket
    socket.emit("sendMessage", message);
    addMessage(message);
    setNewMessage("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 rounded-lg">
      {/* Chat Header */}
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          {currentChat ? currentChat.name : "Select a Chat"}
        </h2>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
        {messages.length === 0 && (
          <p className="text-center text-gray-400 mt-10">
            No messages yet — start chatting!
          </p>
        )}
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${
              msg.sender === user.username ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-2xl text-sm ${
                msg.sender === user.username
                  ? "bg-blue-500 text-white rounded-br-none"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-none"
              }`}
            >
              <p>{msg.text}</p>
              <span className="block text-xs text-gray-400 mt-1">
                {new Date(msg.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef}></div>
      </div>

      {/* Message Input */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 flex items-center gap-2">
        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type a message..."
          rows={1}
          className="flex-1 resize-none rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={handleSendMessage}
          className="p-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white transition"
        >
          <SendIcon size={20} />
        </button>
      </div>
    </div>
  );
}
