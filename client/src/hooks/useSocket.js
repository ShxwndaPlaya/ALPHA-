import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

/**
 * useSocket - Hook for real-time LAN communication.
 *
 * Provides:
 *  - socket: active socket.io connection
 *  - isConnected: boolean connection state
 *
 * Automatically connects/disconnects on mount/unmount,
 * and listens for key lifecycle events.
 */
export default function useSocket(namespace = "/") {
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    // Connect to local socket server (LAN-based)
    const socket = io(`http://localhost:5000${namespace}`, {
      transports: ["websocket"],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current = socket;

    socket.on("connect", () => setIsConnected(true));
    socket.on("disconnect", () => setIsConnected(false));
    socket.on("connect_error", (err) =>
      console.error("Socket connection failed:", err.message)
    );

    return () => {
      socket.disconnect();
    };
  }, [namespace]);

  return { socket: socketRef.current, isConnected };
}
