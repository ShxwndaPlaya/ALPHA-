import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/utils/api";
import { AuthContext } from "@/context/AuthContext";
import {
  MessageSquare,
  Code2,
  ShoppingBag,
  Globe,
  Zap,
  Award,
  Users,
} from "lucide-react";

export default function Home() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const res = await api.get("/profile/overview");
        setStats(res.data.stats);
        setActivities(res.data.recentActivity);
      } catch (err) {
        console.error("Failed to load home data:", err);
      }
    };
    fetchHomeData();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          Welcome back, {user?.username || "Developer"} ⚡
        </h1>
        <button
          onClick={() => navigate("/profile")}
          className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white shadow"
        >
          View Profile
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          icon={<MessageSquare size={20} />}
          label="Active Chats"
          value={stats?.activeChats || 0}
          color="bg-blue-500"
        />
        <StatCard
          icon={<Code2 size={20} />}
          label="Projects"
          value={stats?.projects || 0}
          color="bg-green-500"
        />
        <StatCard
          icon={<Award size={20} />}
          label="XP"
          value={stats?.xp || 0}
          color="bg-yellow-500"
        />
        <StatCard
          icon={<Users size={20} />}
          label="Collaborators"
          value={stats?.collabs || 0}
          color="bg-purple-500"
        />
      </div>

      {/* Shortcuts */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">
          Quick Access
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <ShortcutCard
            title="Chat"
            icon={<MessageSquare size={22} />}
            color="bg-blue-600"
            onClick={() => navigate("/chat")}
          />
          <ShortcutCard
            title="IDE"
            icon={<Code2 size={22} />}
            color="bg-green-600"
            onClick={() => navigate("/ide")}
          />
          <ShortcutCard
            title="Shop"
            icon={<ShoppingBag size={22} />}
            color="bg-pink-600"
            onClick={() => navigate("/shop")}
          />
          <ShortcutCard
            title="WebSim"
            icon={<Globe size={22} />}
            color="bg-indigo-600"
            onClick={() => navigate("/websim")}
          />
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">
          Recent Activity
        </h2>
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow border border-gray-200 dark:border-gray-800 divide-y divide-gray-200 dark:divide-gray-800">
          {activities.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-6">
              No recent activity.
            </p>
          ) : (
            activities.map((a, i) => (
              <div key={i} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Zap
                    size={18}
                    className="text-yellow-500 shrink-0"
                  />
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    {a.description}
                  </p>
                </div>
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  {new Date(a.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }) {
  return (
    <div className="p-4 rounded-xl bg-white dark:bg-gray-900 shadow border border-gray-200 dark:border-gray-700 flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
          {value}
        </h3>
      </div>
      <div className={`p-3 rounded-full ${color} text-white`}>{icon}</div>
    </div>
  );
}

function ShortcutCard({ title, icon, color, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center p-4 rounded-xl bg-white dark:bg-gray-900 shadow border border-gray-200 dark:border-gray-700 hover:scale-105 transition"
    >
      <div className={`p-3 rounded-full ${color} text-white mb-2`}>{icon}</div>
      <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
        {title}
      </span>
    </button>
  );
}
