import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";

/**
 * Custom hook to access authentication context easily.
 * 
 * Provides:
 *  - currentUser → the logged-in user's info
 *  - login(email, password) → sign in
 *  - register(data) → sign up
 *  - logout() → end session
 *  - loading → state for auth operations
 *  - error → any auth-related errors
 */
export default function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
