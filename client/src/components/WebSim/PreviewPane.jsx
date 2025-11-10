import React from "react";

export default function PreviewPane({ srcDoc }) {
  return (
    <div className="h-full border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden bg-white">
      <iframe
        srcDoc={srcDoc}
        title="Web Preview"
        sandbox="allow-scripts"
        frameBorder="0"
        className="w-full h-full"
      />
    </div>
  );
}
