import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "@/utils/api";
import { ArrowLeft, Download, GitFork, Star } from "lucide-react";

export default function ShopDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await api.get(`/shop/${id}`);
        setProject(res.data);
      } catch (err) {
        console.error("Error loading project:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        Loading project...
      </div>
    );
  }

  if (!project) {
    return (
      <div className="p-6 text-center text-gray-500">
        Project not found.
      </div>
    );
  }

  const handleDownload = async () => {
    try {
      await api.get(`/shop/download/${project._id}`, { responseType: "blob" });
      alert("Project downloaded successfully (LAN transfer)!");
    } catch {
      alert("Failed to download project.");
    }
  };

  const handleFork = async () => {
    try {
      const res = await api.post(`/shop/fork/${project._id}`);
      alert(`Project forked! New ID: ${res.data.newId}`);
    } catch {
      alert("Fork failed.");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-1 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
        >
          <ArrowLeft size={18} />
          <span>Back</span>
        </button>
      </div>

      {/* Title */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          {project.title}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          by {project.author?.name || "Unknown"} • {project.language.toUpperCase()}
        </p>
      </div>

      {/* Description */}
      <p className="text-gray-700 dark:text-gray-300 mb-6">
        {project.description || "No description available."}
      </p>

      {/* Code preview */}
      <div className="bg-gray-900 text-gray-100 rounded-lg p-4 font-mono text-sm overflow-auto max-h-96 border border-gray-800 mb-6">
        <pre>{project.code}</pre>
      </div>

      {/* Rating */}
      <div className="flex items-center space-x-1 mb-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={20}
            fill={i < project.rating ? "gold" : "none"}
            stroke="gold"
            strokeWidth={1.5}
          />
        ))}
        <span className="ml-2 text-gray-600 dark:text-gray-400">
          {project.rating?.toFixed(1) || "No rating"}
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-3">
        <button
          onClick={handleDownload}
          className="flex items-center space-x-2 px-4 py-2 rounded-md bg-green-600 hover:bg-green-700 text-white transition"
        >
          <Download size={18} />
          <span>Download</span>
        </button>
        <button
          onClick={handleFork}
          className="flex items-center space-x-2 px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white transition"
        >
          <GitFork size={18} />
          <span>Fork</span>
        </button>
      </div>
    </div>
  );
}
