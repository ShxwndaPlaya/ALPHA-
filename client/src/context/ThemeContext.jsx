import React, { createContext, useState, useEffect } from "react";

// Create Theme Context
export const ThemeContext = createContext();

/**
 * ThemeProvider - Global provider for dark/light mode.
 *
 * Exposes:
 *  - theme → current theme ("light" | "dark")
 *  - setTheme() → manually set a theme
 */
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("light");

  // Load user preference or system theme
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      // Respect system preference
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setTheme(prefersDark ? "dark" : "light");
    }
  }, []);

  // Apply theme to <html> and persist choice
  useEffect(() => {
    const root = window.document.documentElement;
    const prev = theme === "light" ? "dark" : "light";
    root.classList.remove(prev);
    root.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
