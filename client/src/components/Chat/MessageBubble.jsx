import React from "react";
import PropTypes from "prop-types";

export default function MessageBubble({ message, isOwn }) {
  return (
    <div
      className={`flex ${
        isOwn ? "justify-end" : "justify-start"
      } items-end mb-2`}
    >
      <div
        className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-2xl text-sm shadow-sm transition-all ${
          isOwn
            ? "bg-blue-500 text-white rounded-br-none"
            : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-none"
        }`}
      >
        {message.sender && !isOwn && (
          <p className="font-semibold text-xs text-gray-700 dark:text-gray-300 mb-1">
            {message.sender}
          </p>
        )}
        <p className="whitespace-pre-wrap break-words">{message.text}</p>
        <p
          className={`text-[10px] mt-1 ${
            isOwn ? "text-blue-200" : "text-gray-400 dark:text-gray-400"
          } text-right`}
        >
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </div>
  );
}

MessageBubble.propTypes = {
  message: PropTypes.shape({
    sender: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    timestamp: PropTypes.string.isRequired,
  }).isRequired,
  isOwn: PropTypes.bool.isRequired,
};
