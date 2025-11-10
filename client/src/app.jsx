// client/src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Navbar from './components/Common/Navbar.jsx';
import Sidebar from './components/Common/Sidebar.jsx';

import Home from './pages/Home.jsx';
import Chat from './pages/Chat.jsx';
import IDE from './pages/IDE.jsx';
import Shop from './pages/Shop.jsx';
import WebSim from './pages/WebSim.jsx';
import Profile from './pages/Profile.jsx';
import Admin from './pages/Admin.jsx';

import { useAuth } from './hooks/useAuth.js';

function ProtectedRoute({ children, roles }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <div className="flex h-screen w-full bg-slate-900 text-white overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/chat"
              element={
                <ProtectedRoute>
                  <Chat />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ide"
              element={
                <ProtectedRoute>
                  <IDE />
                </ProtectedRoute>
              }
            />
            <Route
              path="/shop"
              element={
                <ProtectedRoute>
                  <Shop />
                </ProtectedRoute>
              }
            />
            <Route
              path="/websim"
              element={
                <ProtectedRoute>
                  <WebSim />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <Admin />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<div className="text-center mt-20 text-gray-400">404 | Page Not Found</div>} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
