import { useContext, useEffect } from "react";
import { ThemeContext } from "@/context/ThemeContext";

/**
 * useTheme - Easy access to theme context.
 *
 * Provides:
 *  - theme → current theme ("light" | "dark")
 *  - toggleTheme() → switch between light/dark
 *
 * Automatically applies class to <html> and saves user preference.
 */
export default function useTheme() {
  const { theme, setTheme } = useContext(ThemeContext);

  // Toggle between light and dark mode
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  // Apply theme to document root
  useEffect(() => {
    const root = window.document.documentElement;
    const prev = theme === "light" ? "dark" : "light";
    root.classList.remove(prev);
    root.classList.add(theme);

    localStorage.setItem("theme", theme);
  }, [theme]);

  return { theme, toggleTheme };
}
