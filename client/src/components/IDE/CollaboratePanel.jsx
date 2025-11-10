import React, { useEffect, useState } from "react";
import { Users, Circle, Share2 } from "lucide-react";
import PropTypes from "prop-types";
import { useSocket } from "@/hooks/useSocket";
import { useAuth } from "@/hooks/useAuth";

export default function CollaboratePanel({ roomId }) {
  const socket = useSocket();
  const { user } = useAuth();
  const [collaborators, setCollaborators] = useState([]);

  useEffect(() => {
    if (!socket || !roomId) return;

    socket.emit("joinRoom", roomId, user);

    socket.on("updateCollaborators", (users) => {
      setCollaborators(users);
    });

    socket.on("userJoined", (newUser) => {
      setCollaborators((prev) => {
        if (!prev.find((u) => u.id === newUser.id)) {
          return [...prev, newUser];
        }
        return prev;
      });
    });

    socket.on("userLeft", (leftUserId) => {
      setCollaborators((prev) => prev.filter((u) => u.id !== leftUserId));
    });

    return () => {
      socket.emit("leaveRoom", roomId, user);
      socket.off("updateCollaborators");
      socket.off("userJoined");
      socket.off("userLeft");
    };
  }, [socket, roomId, user]);

  const copyInviteLink = () => {
    navigator.clipboard.writeText(`LAN://join/${roomId}`);
    alert("Invite link copied to clipboard (for LAN use)!");
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 rounded-r-lg">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center space-x-2">
          <Users size={16} className="text-blue-500" />
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
            Collaborators
          </span>
        </div>
        <button
          onClick={copyInviteLink}
          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
          title="Copy LAN invite link"
        >
          <Share2 size={14} className="text-gray-600 dark:text-gray-300" />
        </button>
      </div>

      {/* Collaborators list */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 text-sm">
        {collaborators.length === 0 && (
          <p className="text-gray-400 italic text-center">No one else here</p>
        )}

        {collaborators.map((collab) => (
          <div
            key={collab.id}
            className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 rounded-md px-3 py-2"
          >
            <div className="flex items-center space-x-2">
              <img
                src={collab.avatar || "/default-avatar.png"}
                alt={collab.name}
                className="w-6 h-6 rounded-full border border-gray-300 dark:border-gray-700"
              />
              <span className="text-gray-700 dark:text-gray-200 font-medium">
                {collab.name}
              </span>
            </div>
            <Circle
              size={10}
              className={
                collab.status === "online"
                  ? "text-green-500"
                  : "text-gray-500"
              }
            />
          </div>
        ))}
      </div>

      {/* Footer / Room info */}
      <div className="border-t border-gray-200 dark:border-gray-800 px-4 py-2 text-xs text-gray-500 dark:text-gray-400">
        Room ID: <span className="font-mono text-gray-600 dark:text-gray-300">{roomId}</span>
      </div>
    </div>
  );
}

CollaboratePanel.propTypes = {
  roomId: PropTypes.string.isRequired,
};
