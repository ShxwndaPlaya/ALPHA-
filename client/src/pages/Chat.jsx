import React, { useEffect, useState, useContext } from "react";
import ChatSidebar from "@/components/Chat/ChatSidebar";
import ChatWindow from "@/components/Chat/ChatWindow";
import { useSocket } from "@/hooks/useSocket";
import { AuthContext } from "@/context/AuthContext";
import { api } from "@/utils/api";

export default function Chat() {
  const { user } = useContext(AuthContext);
  const socket = useSocket();
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user chats
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await api.get("/chat/my-chats");
        setChats(res.data || []);
      } catch (err) {
        console.error("Failed to load chats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchChats();
  }, []);

  // Listen for new messages
  useEffect(() => {
    if (!socket) return;

    socket.on("newMessage", (message) => {
      setChats((prev) =>
        prev.map((chat) =>
          chat._id === message.chatId
            ? { ...chat, lastMessage: message }
            : chat
        )
      );

      // Live update if open chat
      if (selectedChat?._id === message.chatId) {
        setSelectedChat((prev) => ({
          ...prev,
          messages: [...(prev.messages || []), message],
        }));
      }
    });

    return () => {
      socket.off("newMessage");
    };
  }, [socket, selectedChat]);

  const handleChatSelect = async (chatId) => {
    try {
      const res = await api.get(`/chat/${chatId}`);
      setSelectedChat(res.data);
    } catch (err) {
      console.error("Failed to open chat:", err);
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-gray-50 dark:bg-gray-900 overflow-hidden">
      {/* Sidebar */}
      <div className="w-1/3 sm:w-1/4 border-r border-gray-200 dark:border-gray-700">
        <ChatSidebar
          chats={chats}
          loading={loading}
          onSelect={handleChatSelect}
          selectedId={selectedChat?._id}
          currentUser={user}
        />
      </div>

      {/* Chat Window */}
      <div className="flex-1">
        {selectedChat ? (
          <ChatWindow
            chat={selectedChat}
            socket={socket}
            currentUser={user}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
            <p>Select a chat to start messaging 💬</p>
          </div>
        )}
      </div>
    </div>
  );
}
