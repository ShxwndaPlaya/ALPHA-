import React, { useState } from "react";

export default function CodeTabs({ html, setHtml, css, setCss, js, setJs }) {
  const [activeTab, setActiveTab] = useState("html");

  const renderEditor = () => {
    switch (activeTab) {
      case "html":
        return (
          <textarea
            value={html}
            onChange={(e) => setHtml(e.target.value)}
            className="w-full h-full bg-gray-900 text-gray-100 font-mono text-sm p-3 rounded-lg focus:outline-none resize-none"
          />
        );
      case "css":
        return (
          <textarea
            value={css}
            onChange={(e) => setCss(e.target.value)}
            className="w-full h-full bg-gray-900 text-gray-100 font-mono text-sm p-3 rounded-lg focus:outline-none resize-none"
          />
        );
      case "js":
        return (
          <textarea
            value={js}
            onChange={(e) => setJs(e.target.value)}
            className="w-full h-full bg-gray-900 text-gray-100 font-mono text-sm p-3 rounded-lg focus:outline-none resize-none"
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex space-x-2 mb-2">
        {["html", "css", "js"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium ${
              activeTab === tab
                ? "bg-blue-600 text-white"
                : "bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
            }`}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-hidden">{renderEditor()}</div>
    </div>
  );
}
