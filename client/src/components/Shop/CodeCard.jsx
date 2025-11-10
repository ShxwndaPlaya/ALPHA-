import React from "react";
import PropTypes from "prop-types";
import { Star, Download, GitFork } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CodeCard({ project }) {
  const navigate = useNavigate();

  return (
    <div
      className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm hover:shadow-md transition cursor-pointer overflow-hidden"
      onClick={() => navigate(`/shop/${project._id}`)}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-100 dark:border-gray-800">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 truncate">
          {project.title}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 truncate">
          by {project.author?.name || "Unknown"}
        </p>
      </div>

      {/* Body */}
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 rounded-full font-medium">
            {project.language}
          </span>
          <div className="flex items-center space-x-1 text-yellow-400">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={14}
                fill={i < project.rating ? "currentColor" : "none"}
                strokeWidth={1.5}
              />
            ))}
          </div>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
          {project.description || "No description provided."}
        </p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/40 text-sm">
        <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
          <Download size={14} />
          <span>{project.downloads || 0}</span>
        </div>
        <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
          <GitFork size={14} />
          <span>{project.forks || 0}</span>
        </div>
      </div>
    </div>
  );
}

CodeCard.propTypes = {
  project: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    author: PropTypes.shape({
      name: PropTypes.string,
    }),
    language: PropTypes.string.isRequired,
    description: PropTypes.string,
    rating: PropTypes.number,
    downloads: PropTypes.number,
    forks: PropTypes.number,
  }).isRequired,
};
