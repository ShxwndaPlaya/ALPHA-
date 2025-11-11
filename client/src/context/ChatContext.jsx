import React, { createContext, useState, useEffect, useCallback } from "react";
import useSocket from "@/hooks/useSocket";
import { api } from "@/utils/api";

export const ChatContext = createContext();

/**
 * ChatProvider - Global provider for LAN chat.
 *
 * Exposes:
 *  - messages → current chat’s messages
 *  - chats → list of available chats (groups or private)
 *  - activeChat → currently selected chat
 *  - selectChat(chatId)
 *  - sendMessage(text)
 *  - isConnected → socket connection state
 */
export const ChatProvider = ({ children }) => {
  const { socket, isConnected } = useSocket("/chat");
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);

  // Load all chat conversations (user’s groups and DMs)
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await api.get("/chat");
        setChats(res.data);
      } catch (err) {
        console.error("Failed to load chats:", err);
      }
    };
    fetchChats();
  }, []);

  // Load messages for the selected chat
  useEffect(() => {
    const fetchMessages = async () => {
      if (!activeChat) return;
      try {
        const res = await api.get(`/chat/${activeChat._id}/messages`);
        setMessages(res.data);
      } catch (err) {
        console.error("Failed to load messages:", err);
      }
    };
    fetchMessages();
  }, [activeChat]);

  // Handle incoming messages via socket
  useEffect(() => {
    if (!socket) return;

    socket.on("message", (newMsg) => {
      if (newMsg.chatId === activeChat?._id) {
        setMessages((prev) => [...prev, newMsg]);
      }
    });

    return () => {
      socket.off("message");
    };
  }, [socket, activeChat]);

  // Send message (emit socket + save to backend)
  const sendMessage = useCallback(
    async (text) => {
      if (!activeChat || !text.trim()) return;

      const messageData = {
        chatId: activeChat._id,
        content: text,
      };

      try {
        const res = await api.post("/chat/message", messageData);
        socket?.emit("message", res.data);
        setMessages((prev) => [...prev, res.data]);
      } catch (err) {
        console.error("Failed to send message:", err);
      }
    },
    [activeChat, socket]
  );

  // Select chat
  const selectChat = (chat) => {
    setActiveChat(chat);
  };

  return (
    <ChatContext.Provider
      value={{
        chats,
        activeChat,
        messages,
        isConnected,
        selectChat,
        sendMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
