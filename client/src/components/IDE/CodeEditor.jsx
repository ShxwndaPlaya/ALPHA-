import React, { useEffect, useRef, useState, useContext } from "react";
import Editor from "@monaco-editor/react";
import { useSocket } from "@/hooks/useSocket";
import { ThemeContext } from "@/context/ThemeContext";
import PropTypes from "prop-types";

export default function CodeEditor({ language, code, onChange, roomId }) {
  const editorRef = useRef(null);
  const socket = useSocket();
  const { theme } = useContext(ThemeContext);
  const [isConnected, setIsConnected] = useState(false);

  // Initialize socket room for collaboration
  useEffect(() => {
    if (!socket || !roomId) return;
    socket.emit("joinRoom", roomId);
    setIsConnected(true);

    socket.on("codeChange", (data) => {
      if (data.roomId === roomId && data.code !== code) {
        onChange(data.code);
      }
    });

    return () => {
      socket.emit("leaveRoom", roomId);
      socket.off("codeChange");
      setIsConnected(false);
    };
  }, [socket, roomId, code, onChange]);

  // Handle local edits and broadcast
  const handleCodeChange = (value) => {
    onChange(value);
    if (isConnected && socket) {
      socket.emit("codeChange", { roomId, code: value });
    }
  };

  // Editor mount reference
  const handleEditorMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800">
        <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
          {language.toUpperCase()} Editor
        </span>
        <span
          className={`text-xs font-medium ${
            isConnected ? "text-green-500" : "text-gray-400"
          }`}
        >
          {isConnected ? "Collaborating" : "Offline"}
        </span>
      </div>

      {/* Monaco Editor */}
      <Editor
        height="100%"
        defaultLanguage={language || "javascript"}
        value={code}
        onMount={handleEditorMount}
        onChange={handleCodeChange}
        theme={theme === "dark" ? "vs-dark" : "light"}
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          wordWrap: "on",
          automaticLayout: true,
          lineNumbers: "on",
          smoothScrolling: true,
        }}
      />
    </div>
  );
}

CodeEditor.propTypes = {
  language: PropTypes.string.isRequired,
  code: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  roomId: PropTypes.string,
};
