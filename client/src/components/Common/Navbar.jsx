import React, { useContext, useState } from "react";
import { Sun, Moon, Bell, User, LogOut } from "lucide-react";
import { ThemeContext } from "@/context/ThemeContext";
import { AuthContext } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="w-full px-6 py-3 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center shadow-sm z-40">
      {/* Logo */}
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => navigate("/")}
      >
        <img
          src="/icons/logo.svg"
          alt="ALPHA LAN"
          className="w-8 h-8"
        />
        <span className="font-bold text-lg text-gray-800 dark:text-gray-100 tracking-wide">
          ALPHA LAN
        </span>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-4 relative">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:scale-110 transition"
          title="Toggle theme"
        >
          {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        {/* Notifications */}
        <button
          className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:scale-110 transition relative"
          title="Notifications"
        >
          <Bell size={18} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* Profile dropdown */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 p-1 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            <img
              src={user?.avatar || "/icons/user.svg"}
              alt="avatar"
              className="w-8 h-8 rounded-full object-cover"
            />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
              <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
                  {user?.username || "Guest"}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {user?.role || "Student"}
                </p>
              </div>
              <ul className="py-2 text-sm text-gray-700 dark:text-gray-300">
                <li>
                  <button
                    onClick={() => navigate("/profile")}
                    className="flex items-center w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <User size={16} className="mr-2" /> Profile
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      logout();
                      navigate("/login");
                    }}
                    className="flex items-center w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 text-red-500"
                  >
                    <LogOut size={16} className="mr-2" /> Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
