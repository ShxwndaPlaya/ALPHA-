import { Play, Save, Share2, Download } from "lucide-react";
// ...

export default function WebSimulator() {
  const [html, setHtml] = useState("<h1>Hello ALPHA LAN!</h1>");
  const [css, setCss] = useState("h1 { color: #3b82f6; text-align: center; }");
  const [js, setJs] = useState("console.log('WebSim Ready!')");
  const [outputSrc, setOutputSrc] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [shareUrl, setShareUrl] = useState(null);

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

  const handleShare = async () => {
    try {
      const res = await api.post("/websim/share", { html, css, js });
      const { shareId } = res.data;
      const localUrl = `${window.location.origin}/websim/shared/${shareId}`;
      setShareUrl(localUrl);
      alert(`Your project is live on LAN!\nURL: ${localUrl}`);
    } catch {
      alert("Failed to share project.");
    }
  };

  const handleExport = async () => {
    try {
      const res = await api.post("/websim/export", { html, css, js }, { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "websim_project.zip");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      alert("Export failed. Try again.");
    }
  };

  useEffect(() => {
    const timeout = setTimeout(runCode, 700);
    return () => clearTimeout(timeout);
  }, [html, css, js]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 h-[85vh] gap-4 p-4">
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
            <button
              onClick={handleShare}
              className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-md flex items-center space-x-1 transition"
            >
              <Share2 size={16} />
              <span>Share</span>
            </button>
            <button
              onClick={handleExport}
              className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-md flex items-center space-x-1 transition"
            >
              <Download size={16} />
              <span>Export</span>
            </button>
          </div>
        </div>

        <CodeTabs
          html={html}
          setHtml={setHtml}
          css={css}
          setCss={setCss}
          js={js}
          setJs={setJs}
        />
      </div>

      <PreviewPane srcDoc={outputSrc} />
    </div>
  );
}
