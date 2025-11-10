import React, { useEffect, useState } from "react";
import { api } from "@/utils/api";
import { Users, MessageSquare, Code2, Zap } from "lucide-react";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/admin/stats");
        setStats(res.data);
      } catch (err) {
        console.error("Failed to fetch admin stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-full text-gray-500">
        Loading dashboard...
      </div>
    );

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          Admin Dashboard
        </h1>
        <button
          onClick={() => alert("Broadcast feature coming soon!")}
          className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium shadow transition"
        >
          Broadcast Message
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Users size={22} />}
          label="Active Users"
          value={stats.activeUsers || 0}
          color="bg-blue-500"
        />
        <StatCard
          icon={<MessageSquare size={22} />}
          label="Messages Sent"
          value={stats.messages || 0}
          color="bg-green-500"
        />
        <StatCard
          icon={<Code2 size={22} />}
          label="Projects Shared"
          value={stats.projects || 0}
          color="bg-purple-500"
        />
        <StatCard
          icon={<Zap size={22} />}
          label="Active Sessions"
          value={stats.sessions || 0}
          color="bg-amber-500"
        />
      </div>

      {/* System Summary */}
      <div className="p-5 rounded-xl bg-gray-100 dark:bg-gray-800 shadow">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
          System Summary
        </h2>
        <ul className="text-gray-600 dark:text-gray-300 text-sm space-y-1">
          <li>🧑‍💻 Total Registered Users: {stats.totalUsers}</li>
          <li>💬 Total Messages: {stats.totalMessages}</li>
          <li>🗂️ Total Projects in Shop: {stats.totalProjects}</li>
          <li>🧠 Ongoing Challenges: {stats.activeChallenges}</li>
        </ul>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }) {
  return (
    <div className="p-4 rounded-xl bg-white dark:bg-gray-900 shadow flex items-center justify-between border border-gray-200 dark:border-gray-700">
      <div className="flex flex-col">
        <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
        <span className="text-xl font-bold text-gray-800 dark:text-gray-100">
          {value}
        </span>
      </div>
      <div className={`p-3 rounded-full ${color} text-white shadow`}>
        {icon}
      </div>
    </div>
  );
}
