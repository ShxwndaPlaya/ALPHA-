import React from "react";
import { Tooltip } from "react-tooltip"; // optional if you add react-tooltip
import { Sparkles } from "lucide-react";

export default function Badges({ badges = [] }) {
  if (!badges.length) {
    return (
      <div className="flex flex-col items-center text-gray-500 dark:text-gray-400 py-6">
        <Sparkles size={24} className="mb-2 text-yellow-500" />
        <p>No badges earned yet — keep coding!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {badges.map((badge) => (
        <div
          key={badge.id}
          className={`flex flex-col items-center justify-center p-3 rounded-lg border shadow-sm transition ${
            badge.unlocked
              ? "bg-gradient-to-br from-blue-100 to-purple-100 dark:from-gray-800 dark:to-gray-700 border-blue-300 dark:border-gray-600"
              : "bg-gray-100 dark:bg-gray-800 grayscale opacity-70 border-gray-300 dark:border-gray-700"
          }`}
          data-tooltip-id={`badge-${badge.id}`}
        >
          <img
            src={badge.icon || "/default-badge.svg"}
            alt={badge.name}
            className="w-12 h-12 mb-2"
          />
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100 text-center">
            {badge.name}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            {badge.unlocked ? "Unlocked" : "Locked"}
          </p>

          <Tooltip id={`badge-${badge.id}`} place="top" content={badge.description} />
        </div>
      ))}
    </div>
  );
}
