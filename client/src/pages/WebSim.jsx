import React, { useState, useEffect } from "react";
import CodeTabs from "@/components/WebSim/CodeTabs";
import PreviewPane from "@/components/WebSim/PreviewPane";
import { api } from "@/utils/api";
import { Save, UploadCloud, RefreshCw } from "lucide-react";

export default function WebSim() {
  const [html, setHtml] = useState("<h1>Hello, ALPHA LAN!</h1>");
  const [css, setCss] = useState("h1 { color: #2563eb; text-align: center; }");
  const [js, setJs] = useState("console.log('Welcome to WebSim ⚡');");
  const [srcDoc, setSrcDoc] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Combine HTML/CSS/JS for preview
  useEffect(() => {
    const timeout = setTimeout(() => {
      const src = `
        <html>
          <head>
            <style>${css}</style>
          </head>
          <body>
            ${html}
            <script>${js}<\/script>
          </body>
        </html>`;
      setSrcDoc(src);
    }, 400);
    return () => clearTimeout(timeout);
  }, [html, css, js]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await api.post("/websim/save", { html, css, js });
      alert("Web demo saved locally!");
    } catch (err) {
      console.error("Save failed:", err);
      alert("Failed to save demo.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleShare = async () => {
    try {
      const res = await api.post("/websim/share", { html, css, js });
      const shareLink = res.data?.link || "N/A";
      alert(`LAN Share Link: ${shareLink}`);
    } catch (err) {
      console.error("Share failed:", err);
    }
  };

  const handleReset = () => {
    setHtml("<h1>Hello, ALPHA LAN!</h1>");
    setCss("h1 { color: #2563eb; text-align: center; }");
    setJs("console.log('Welcome to WebSim ⚡');");
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-gray-50 dark:bg-gray-900">
      {/* Editor Section */}
      <div className="w-1/2 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <h2 className="font-semibold text-gray-800 dark:text-gray-100">
            Web Simulator
          </h2>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-3 py-1.5 text-sm rounded bg-green-600 hover:bg-green-700 text-white"
            >
              <Save size={16} /> {isSaving ? "Saving..." : "Save"}
            </button>
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-3 py-1.5 text-sm rounded bg-blue-600 hover:bg-blue-700 text-white"
            >
              <UploadCloud size={16} /> Share
            </button>
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-3 py-1.5 text-sm rounded bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100"
            >
              <RefreshCw size={16} /> Reset
            </button>
          </div>
        </div>

        <CodeTabs
          html={html}
          css={css}
          js={js}
          onHtmlChange={setHtml}
          onCssChange={setCss}
          onJsChange={setJs}
        />
      </div>

      {/* Live Preview */}
      <div className="flex-1 bg-white dark:bg-gray-950">
        <PreviewPane srcDoc={srcDoc} />
      </div>
    </div>
  );
}
