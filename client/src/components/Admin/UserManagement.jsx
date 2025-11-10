import React, { useEffect, useState } from "react";
import { api } from "@/utils/api";
import { Search, Shield, UserMinus, UserPlus, Loader2 } from "lucide-react";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/admin/users");
        setUsers(res.data);
        setFiltered(res.data);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    if (!search.trim()) setFiltered(users);
    else {
      const q = search.toLowerCase();
      setFiltered(
        users.filter(
          (u) =>
            u.username.toLowerCase().includes(q) ||
            u.email.toLowerCase().includes(q)
        )
      );
    }
  }, [search, users]);

  const handleRoleChange = async (id, role) => {
    try {
      await api.put(`/admin/users/${id}/role`, { role });
      setUsers((prev) =>
        prev.map((u) => (u._id === id ? { ...u, role } : u))
      );
    } catch (err) {
      console.error("Failed to update role:", err);
      alert("Error updating role.");
    }
  };

  const handleBanUser = async (id) => {
    if (!confirm("Ban this user?")) return;
    try {
      await api.delete(`/admin/users/${id}`);
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      console.error("Failed to ban user:", err);
      alert("Error banning user.");
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <Loader2 className="animate-spin mr-2" /> Loading users...
      </div>
    );

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          User Management
        </h1>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="overflow-x-auto bg-white dark:bg-gray-900 shadow rounded-xl border border-gray-200 dark:border-gray-700">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 uppercase text-xs">
            <tr>
              <th className="p-3">Username</th>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
            {filtered.map((user) => (
              <tr
                key={user._id}
                className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                <td className="p-3 font-medium">{user.username}</td>
                <td className="p-3">{user.email}</td>
                <td className="p-3">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                    className="bg-transparent border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-200 p-1"
                  >
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="p-3">
                  {user.isOnline ? (
                    <span className="text-green-600 font-medium">Online</span>
                  ) : (
                    <span className="text-gray-500">Offline</span>
                  )}
                </td>
                <td className="p-3 text-right space-x-2">
                  <button
                    onClick={() => handleBanUser(user._id)}
                    className="inline-flex items-center px-2 py-1 text-xs bg-red-600 hover:bg-red-700 text-white rounded"
                  >
                    <UserMinus size={14} className="mr-1" /> Ban
                  </button>
                  {user.role !== "admin" && (
                    <button
                      onClick={() => handleRoleChange(user._id, "admin")}
                      className="inline-flex items-center px-2 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded"
                    >
                      <Shield size={14} className="mr-1" /> Promote
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
