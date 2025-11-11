import React, { createContext, useState, useEffect } from "react";
import { api } from "@/utils/api";

// Create Context
export const AuthContext = createContext();

/**
 * AuthProvider - Provides authentication state and actions.
 *
 * Exposes:
 *  - currentUser → logged-in user info
 *  - login(email, password)
 *  - register(userData)
 *  - logout()
 *  - loading → global auth loading state
 *  - error → last auth error (if any)
 */
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user from localStorage or validate token
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get("/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCurrentUser(res.data.user);
      } catch (err) {
        console.error("Auth validation failed:", err);
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Login user
  const login = async (email, password) => {
    try {
      setError(null);
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      setCurrentUser(res.data.user);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      return false;
    }
  };

  // Register new user
  const register = async (userData) => {
    try {
      setError(null);
      const res = await api.post("/auth/register", userData);
      localStorage.setItem("token", res.data.token);
      setCurrentUser(res.data.user);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
      return false;
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem("token");
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        login,
        register,
        logout,
        loading,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
