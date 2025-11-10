import React, { useEffect, useState } from "react";
import { api } from "@/utils/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Activity, BarChart3, PieChart as PieIcon } from "lucide-react";

export default function AnalyticsPanel() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get("/admin/analytics");
        setData(res.data);
      } catch (err) {
        console.error("Failed to fetch analytics:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-full text-gray-500">
        Loading analytics...
      </div>
    );

  if (!data)
    return (
      <div className="p-6 text-center text-gray-500">
        No analytics data available.
      </div>
    );

  const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444"];

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          System Analytics
        </h1>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow transition"
        >
          Refresh Data
        </button>
      </div>

      {/* User Activity Trend */}
      <div className="p-5 rounded-xl bg-white dark:bg-gray-900 shadow border border-gray-200 dark:border-gray-700">
        <div className="flex items-center mb-4">
          <Activity className="text-blue-500 mr-2" />
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            User Activity (Last 7 Days)
          </h2>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={data.userActivity}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="activeUsers"
              stroke="#3B82F6"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Message & Project Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Messages per Day */}
        <div className="p-5 rounded-xl bg-white dark:bg-gray-900 shadow border border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-4">
            <BarChart3 className="text-green-500 mr-2" />
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              Messages Sent (Last 7 Days)
            </h2>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data.messagesPerDay}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Project Distribution */}
        <div className="p-5 rounded-xl bg-white dark:bg-gray-900 shadow border border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-4">
            <PieIcon className="text-purple-500 mr-2" />
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              Projects by Language
            </h2>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={data.projectLanguages}
                dataKey="value"
                nameKey="language"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {data.projectLanguages.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
