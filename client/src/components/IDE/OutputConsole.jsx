import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";

export default function OutputConsole({ output, onClear }) {
  const consoleEndRef = useRef(null);

  // Auto scroll to bottom when output updates
  useEffect(() => {
    consoleEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [output]);

  return (
    <div className="flex flex-col h-full bg-black text-gray-100 rounded-lg overflow-hidden border border-gray-800">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-900 border-b border-gray-700">
        <span className="text-sm font-semibold text-gray-300">Console Output</span>
        <button
          onClick={onClear}
          className="text-xs text-gray-400 hover:text-white transition"
        >
          Clear
        </button>
      </div>

      {/* Output content */}
      <div className="flex-1 overflow-y-auto font-mono text-sm p-3 space-y-1">
        {output && output.length > 0 ? (
          output.map((line, idx) => (
            <pre
              key={idx}
              className={`whitespace-pre-wrap ${
                line.type === "error"
                  ? "text-red-400"
                  : line.type === "warning"
                  ? "text-yellow-400"
                  : "text-green-400"
              }`}
            >
              {line.text}
            </pre>
          ))
        ) : (
          <p className="text-gray-500 italic">No output yet...</p>
        )}
        <div ref={consoleEndRef}></div>
      </div>
    </div>
  );
}

OutputConsole.propTypes = {
  output: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.oneOf(["log", "error", "warning"]),
      text: PropTypes.string.isRequired,
    })
  ).isRequired,
  onClear: PropTypes.func.isRequired,
};
