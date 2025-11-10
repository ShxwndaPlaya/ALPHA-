import React, { useState } from "react";
import { Folder, FileCode, Plus, Trash2, Edit3 } from "lucide-react";
import PropTypes from "prop-types";

export default function FileExplorer({ files, onSelectFile, onAddFile, onDeleteFile, onRenameFile }) {
  const [selected, setSelected] = useState(null);
  const [renaming, setRenaming] = useState(null);
  const [newName, setNewName] = useState("");

  const handleSelect = (file) => {
    setSelected(file.name);
    onSelectFile(file);
  };

  const handleRename = (file) => {
    if (!newName.trim()) return;
    onRenameFile(file.name, newName.trim());
    setRenaming(null);
    setNewName("");
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 rounded-l-lg">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-800">
        <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
          File Explorer
        </span>
        <button
          onClick={onAddFile}
          className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition"
        >
          <Plus size={16} className="text-gray-600 dark:text-gray-300" />
        </button>
      </div>

      {/* File list */}
      <div className="flex-1 overflow-y-auto text-sm">
        {files.length === 0 && (
          <p className="p-3 text-gray-400 italic text-center">No files yet</p>
        )}

        <ul className="divide-y divide-gray-200 dark:divide-gray-800">
          {files.map((file) => (
            <li
              key={file.name}
              className={`flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition ${
                selected === file.name
                  ? "bg-gray-200 dark:bg-gray-700"
                  : ""
              }`}
              onClick={() => handleSelect(file)}
            >
              <div className="flex items-center space-x-2">
                {file.type === "folder" ? (
                  <Folder size={16} className="text-yellow-500" />
                ) : (
                  <FileCode size={16} className="text-blue-500" />
                )}
                {renaming === file.name ? (
                  <input
                    autoFocus
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    onBlur={() => handleRename(file)}
                    onKeyDown={(e) => e.key === "Enter" && handleRename(file)}
                    className="bg-transparent border-b border-gray-400 focus:outline-none w-32 text-gray-800 dark:text-gray-200"
                  />
                ) : (
                  <span className="truncate text-gray-700 dark:text-gray-200">
                    {file.name}
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setRenaming(file.name);
                    setNewName(file.name);
                  }}
                  className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                >
                  <Edit3 size={14} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteFile(file.name);
                  }}
                  className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                >
                  <Trash2 size={14} className="text-red-500" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

FileExplorer.propTypes = {
  files: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      type: PropTypes.oneOf(["file", "folder"]).isRequired,
    })
  ).isRequired,
  onSelectFile: PropTypes.func.isRequired,
  onAddFile: PropTypes.func.isRequired,
  onDeleteFile: PropTypes.func.isRequired,
  onRenameFile: PropTypes.func.isRequired,
};
