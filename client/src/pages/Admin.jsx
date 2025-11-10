import React, { useState, useEffect } from "react";
import Dashboard from "@/components/Admin/Dashboard";
import UserManagement from "@/components/Admin/UserManagement";
import AnalyticsPanel from "@/components/Admin/AnalyticsPanel";
import { api } from "@/utils/api";
import { Shield, Users, BarChart3 } from "lucide-react";

export default function Admin() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/admin/stats");
        setStats(res.data);
      } catch (err) {
        console.error("Failed to load admin stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard stats={stats} loading={loading} />;
      case "users":
        return <UserManagement />;
      case "analytics":
        return <AnalyticsPanel />;
      default:
        return null;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          Admin Control Center ⚙️
        </h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-3 border-b border-gray-200 dark:border-gray-700">
        <TabButton
          active={activeTab === "dashboard"}
          onClick={() => setActiveTab("dashboard")}
          icon={<Shield size={16} />}
          label="Dashboard"
        />
        <TabButton
          active={activeTab === "users"}
          onClick={() => setActiveTab("users")}
          icon={<Users size={16} />}
          label="User Management"
        />
        <TabButton
          active={activeTab === "analytics"}
          onClick={() => setActiveTab("analytics")}
          icon={<BarChart3 size={16} />}
          label="Analytics"
        />
      </div>

      {/* Main Panel */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow border border-gray-200 dark:border-gray-700 p-4">
        {renderContent()}
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-md transition border-b-2 ${
        active
          ? "text-blue-600 border-blue-600 dark:text-blue-400"
          : "text-gray-500 hover:text-gray-700 border-transparent dark:text-gray-400 dark:hover:text-gray-200"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
