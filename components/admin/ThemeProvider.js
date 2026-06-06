import { createContext, useContext, useEffect, useState } from "react";

const STORAGE_KEY = "imagicity-admin-theme";
const ThemeContext = createContext({
  theme: "light",
  setTheme: () => {},
  toggleTheme: () => {}
});

export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({ children, defaultTheme = "light" }) {
  const [theme, setThemeState] = useState(defaultTheme);

  // Load the saved preference after mount to avoid hydration mismatches.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "light" || saved === "dark") {
        setThemeState(saved);
      }
    } catch (error) {
      /* localStorage unavailable */
    }
  }, []);

  const persist = (value) => {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch (error) {
      /* ignore */
    }
  };

  const setTheme = (value) => {
    setThemeState(value);
    persist(value);
  };

  const toggleTheme = () =>
    setThemeState((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      persist(next);
      return next;
    });

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  return (
    <button
      type="button"
      className="theme-toggle"
      data-state={theme}
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? "Switch to day mode" : "Switch to night mode"}
      title={isDark ? "Switch to day mode" : "Switch to night mode"}
      onClick={toggleTheme}
    >
      <span className="theme-toggle-track">
        <span className="theme-toggle-icon sun" aria-hidden="true">
          ☀
        </span>
        <span className="theme-toggle-icon moon" aria-hidden="true">
          ☾
        </span>
        <span className="theme-toggle-knob" />
      </span>
    </button>
  );
}
