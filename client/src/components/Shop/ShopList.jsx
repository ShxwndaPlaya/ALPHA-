import React, { useEffect, useState } from "react";
import CodeCard from "./CodeCard";
import UploadModal from "./UploadModal";
import { PlusCircle } from "lucide-react";
import { api } from "@/utils/api";

export default function ShopList() {
  const [projects, setProjects] = useState([]);
  const [showUpload, setShowUpload] = useState(false);

  // Fetch all available code projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.get("/shop");
        setProjects(res.data);
      } catch (err) {
        console.error("Error fetching projects:", err);
      }
    };
    fetchProjects();
  }, []);

  const handleUploadSuccess = (newProject) => {
    setProjects((prev) => [newProject, ...prev]);
    setShowUpload(false);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
          Code Marketplace
        </h1>
        <button
          onClick={() => setShowUpload(true)}
          className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition"
        >
          <PlusCircle size={18} />
          <span>Upload Project</span>
        </button>
      </div>

      {/* Projects grid */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {projects.length > 0 ? (
          projects.map((proj) => (
            <CodeCard key={proj._id} project={proj} />
          ))
        ) : (
          <p className="text-gray-500 dark:text-gray-400 col-span-full text-center italic">
            No projects shared yet — be the first to upload!
          </p>
        )}
      </div>

      {/* Upload modal */}
      {showUpload && (
        <UploadModal
          onClose={() => setShowUpload(false)}
          onSuccess={handleUploadSuccess}
        />
      )}
    </div>
  );
}
