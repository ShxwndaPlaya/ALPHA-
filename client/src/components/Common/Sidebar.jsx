import React, { useState, useContext } from "react";
import {
  Home,
  MessageSquare,
  Code2,
  ShoppingBag,
  Globe,
  User,
  Settings,
  Menu,
  X,
  Shield,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "@/context/AuthContext";

export default function Sidebar() {
  const { user } = useContext(AuthContext);
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();

  const links = [
    { name: "Home", path: "/", icon: <Home size={18} /> },
    { name: "Chat", path: "/chat", icon: <MessageSquare size={18} /> },
    { name: "IDE", path: "/ide", icon: <Code2 size={18} /> },
    { name: "Shop", path: "/shop", icon: <ShoppingBag size={18} /> },
    { name: "WebSim", path: "/websim", icon: <Globe size={18} /> },
    { name: "Profile", path: "/profile", icon: <User size={18} /> },
  ];

  if (user?.role === "admin") {
    links.push({
      name: "Admin",
      path: "/admin",
      icon: <Shield size={18} />,
    });
  }

  return (
    <aside
      className={`h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col transition-all duration-300 shadow-md ${
        open ? "w-60" : "w-20"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-2 cursor-pointer"
        >
          <img src="/icons/logo.svg" alt="logo" className="w-7 h-7" />
          {open && (
            <span className="font-bold text-gray-800 dark:text-gray-100">
              ALPHA LAN
            </span>
          )}
        </div>
        <button
          onClick={() => setOpen(!open)}
          className="p-1 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 overflow-y-auto mt-3 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-md mx-2 transition font-medium text-sm ${
                isActive
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`
            }
          >
            <div>{link.icon}</div>
            {open && <span>{link.name}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-800 text-xs text-gray-400 text-center">
        {open && "⚡ LAN Mode Active"}
      </div>
    </aside>
  );
}
