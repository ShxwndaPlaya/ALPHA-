import React, { useState, useEffect, useContext } from "react";
import CodeEditor from "@/components/IDE/CodeEditor";
import OutputConsole from "@/components/IDE/OutputConsole";
import FileExplorer from "@/components/IDE/FileExplorer";
import CollaboratePanel from "@/components/IDE/CollaboratePanel";
import { useSocket } from "@/hooks/useSocket";
import { api } from "@/utils/api";
import { AuthContext } from "@/context/AuthContext";
import { Play, Users } from "lucide-react";

export default function IDE() {
  const { user } = useContext(AuthContext);
  const socket = useSocket();

  const [files, setFiles] = useState([]);
  const [activeFile, setActiveFile] = useState(null);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  // Load user projects from API
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const res = await api.get("/ide/projects");
        setFiles(res.data.files || []);
      } catch (err) {
        console.error("Failed to load files:", err);
      }
    };
    fetchFiles();
  }, []);

  // Handle collaboration events
  useEffect(() => {
    if (!socket) return;

    socket.on("code:update", ({ fileId, content }) => {
      if (fileId === activeFile?._id) setCode(content);
    });

    return () => socket.off("code:update");
  }, [socket, activeFile]);

  const handleRun = async () => {
    if (!activeFile) return;
    setIsRunning(true);
    setOutput("Running...");

    try {
      const res = await api.post("/ide/run", {
        code,
        language,
        filename: activeFile.name,
      });
      setOutput(res.data.output || "No output.");
    } catch (err) {
      setOutput(`Error: ${err.response?.data?.error || err.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleSave = async () => {
    if (!activeFile) return;
    try {
      await api.put(`/ide/save/${activeFile._id}`, { content: code });
    } catch (err) {
      console.error("Save failed:", err);
    }
  };

  const handleCodeChange = (newCode) => {
    setCode(newCode);
    if (socket && activeFile) {
      socket.emit("code:update", { fileId: activeFile._id, content: newCode });
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-gray-50 dark:bg-gray-900">
      {/* Sidebar: File Explorer */}
      <div className="w-1/4 border-r border-gray-200 dark:border-gray-700">
        <FileExplorer
          files={files}
          activeFile={activeFile}
          onSelect={(file) => {
            setActiveFile(file);
            setCode(file.content);
            setLanguage(file.language || "javascript");
          }}
        />
      </div>

      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col">
        <div className="flex justify-between items-center px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <h2 className="font-semibold text-gray-800 dark:text-gray-100">
            {activeFile ? activeFile.name : "Select a file to edit"}
          </h2>
          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              className="px-3 py-1.5 text-sm rounded bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100"
            >
              Save
            </button>
            <button
              onClick={handleRun}
              disabled={isRunning}
              className="flex items-center gap-2 px-3 py-1.5 text-sm rounded bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Play size={16} />
              {isRunning ? "Running..." : "Run"}
            </button>
          </div>
        </div>

        {/* Editor */}
        <div className="flex flex-1">
          <div className="flex-1">
            <CodeEditor
              value={code}
              language={language}
              onChange={handleCodeChange}
            />
          </div>
          <div className="w-1/4 border-l border-gray-200 dark:border-gray-700">
            <CollaboratePanel socket={socket} user={user} />
          </div>
        </div>

        {/* Output Console */}
        <div className="h-40 border-t border-gray-200 dark:border-gray-700 bg-black text-white">
          <OutputConsole output={output} />
        </div>
      </div>
    </div>
  );
}
