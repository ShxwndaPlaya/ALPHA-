import React, { useContext, useEffect, useState } from "react";
import { ChatContext } from "@/context/ChatContext";
import { AuthContext } from "@/context/AuthContext";
import { useSocket } from "@/hooks/useSocket";
import { ChatIcon } from "@/assets/icons";
import { GroupChatModal } from "./GroupChatModal";

export default function ChatSidebar() {
  const { user } = useContext(AuthContext);
  const { currentChat, setCurrentChat, chats, setChats } = useContext(ChatContext);
  const socket = useSocket();
  const [searchTerm, setSearchTerm] = useState("");
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);

  // Fetch chats from local API
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await fetch("/api/chat");
        const data = await res.json();
        setChats(data);
      } catch (err) {
        console.error("Failed to load chats", err);
      }
    };
    fetchChats();
  }, [setChats]);

  // Listen for new chats via socket
  useEffect(() => {
    if (!socket) return;
    socket.on("newChat", (chat) => {
      setChats((prev) => [...prev, chat]);
    });
    return () => socket.off("newChat");
  }, [socket, setChats]);

  const filteredChats = chats.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-72 h-full bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
          Chats
        </h2>
        <button
          onClick={() => setIsGroupModalOpen(true)}
          className="p-1.5 rounded-md bg-blue-500 hover:bg-blue-600 text-white transition"
          title="New Group Chat"
        >
          <ChatIcon size={18} />
        </button>
      </div>

      {/* Search */}
      <div className="p-3">
        <input
          type="text"
          placeholder="Search chats..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 text-sm rounded-md bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-400 outline-none"
        />
      </div>

      {/* Chat list */}
      <div className="flex-1 overflow-y-auto">
        {filteredChats.length === 0 ? (
          <p className="text-center text-gray-400 mt-10">No chats found</p>
        ) : (
          <ul className="space-y-1 px-2">
            {filteredChats.map((chat) => (
              <li
                key={chat._id}
                onClick={() => setCurrentChat(chat)}
                className={`p-3 rounded-md cursor-pointer transition ${
                  currentChat && currentChat._id === chat._id
                    ? "bg-blue-500 text-white"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{chat.name}</span>
                  {chat.unreadCount > 0 && (
                    <span className="bg-red-500 text-xs text-white rounded-full px-2">
                      {chat.unreadCount}
                    </span>
                  )}
                </div>
                {chat.lastMessage && (
                  <p className="text-xs mt-1 text-gray-500 dark:text-gray-400 truncate">
                    {chat.lastMessage.sender}: {chat.lastMessage.text}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Group Chat Modal */}
      {isGroupModalOpen && (
        <GroupChatModal onClose={() => setIsGroupModalOpen(false)} />
      )}
    </div>
  );
}
