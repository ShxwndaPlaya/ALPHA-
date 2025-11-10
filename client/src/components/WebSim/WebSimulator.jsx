import React, { useState, useEffect } from "react";
import CodeTabs from "./CodeTabs";
import PreviewPane from "./PreviewPane";
import { Play, Save } from "lucide-react";
import { api } from "@/utils/api";

export default function WebSimulator() {
  const [html, setHtml] = useState("<h1>Hello ALPHA LAN!</h1>");
  const [css, setCss] = useState("h1 { color: #3b82f6; text-align: center; }");
  const [js, setJs] = useState("console.log('WebSim Ready!')");
  const [outputSrc, setOutputSrc] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  const runCode = () => {
    setIsRunning(true);
    const srcDoc = `
      <html>
        <head>
          <style>${css}</style>
        </head>
        <body>
          ${html}
          <script>
            ${js}
          </script>
        </body>
      </html>
    `;
    setOutputSrc(srcDoc);
    setTimeout(() => setIsRunning(false), 300);
  };

  const handleSave = async () => {
    try {
      await api.post("/websim/save", { html, css, js });
      alert("Web project saved to LAN!");
    } catch {
      alert("Save failed. Try again.");
    }
  };

  // Auto-run on changes (debounced)
  useEffect(() => {
    const timeout = setTimeout(runCode, 700);
    return () => clearTimeout(timeout);
  }, [html, css, js]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 h-[85vh] gap-4 p-4">
      {/* Left: Code Editor */}
      <div className="flex flex-col space-y-3">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            Web Simulator
          </h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={runCode}
              disabled={isRunning}
              className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-md flex items-center space-x-1 transition"
            >
              <Play size={16} />
              <span>Run</span>
            </button>
            <button
              onClick={handleSave}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md flex items-center space-x-1 transition"
            >
              <Save size={16} />
              <span>Save</span>
            </button>
          </div>
        </div>

        <CodeTabs html={html} setHtml={setHtml} css={css} setCss={setCss} js={js} setJs={setJs} />
      </div>

      {/* Right: Preview */}
      <PreviewPane srcDoc={outputSrc} />
    </div>
  );
}
