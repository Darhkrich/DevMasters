"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext(undefined);

function getInitialTheme() {
  if (typeof window === "undefined") {
    return "dark";
  }

  const storedTheme = window.localStorage.getItem("app-theme");
  if (storedTheme) {
    return storedTheme;
  }

  if (window.matchMedia("(prefers-color-scheme: light)").matches) {
    return "light";
  }

  return "dark";
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    // Update document element when theme changes
    const root = document.documentElement;
    root.setAttribute("data-theme", theme);
    
    // Also add class for backward compatibility and simpler CSS targeting
    if (theme === "light") {
      document.body.classList.add("wc-light", "light-mode");
      document.body.classList.remove("dark-mode");
    } else {
      document.body.classList.remove("wc-light", "light-mode");
      document.body.classList.add("dark-mode");
    }
    
    localStorage.setItem("app-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
