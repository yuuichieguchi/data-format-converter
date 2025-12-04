"use client";

import { useEffect, useState } from "react";

export function Header() {
  const [isDark, setIsDark] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const savedTheme = localStorage.getItem("theme");
    const isDarkMode = savedTheme === "dark";
    setIsDark(isDarkMode);

    if (isDarkMode) {
      document.documentElement.style.backgroundColor = "#1a202c";
      document.documentElement.style.color = "#ffffff";
    }
  }, []);

  const handleThemeToggle = () => {
    const newDarkState = !isDark;
    setIsDark(newDarkState);

    if (newDarkState) {
      document.documentElement.style.backgroundColor = "#1a202c";
      document.documentElement.style.color = "#ffffff";
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.style.backgroundColor = "#ffffff";
      document.documentElement.style.color = "#000000";
      localStorage.setItem("theme", "light");
    }

    // イベント発火してコンポーネントに通知
    window.dispatchEvent(new Event("theme-changed"));
  };

  if (!isMounted) return null;

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 40,
        background: isDark ? "#1a202c" : "#ffffff",
        borderBottom: `1px solid ${isDark ? "#2d3748" : "#e2e8f0"}`,
        boxShadow: `0 1px 3px ${
          isDark ? "rgba(0, 0, 0, 0.3)" : "rgba(0, 0, 0, 0.08)"
        }`,
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "1rem 2rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "4rem",
        }}
      >
        {/* Logo & Title */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            cursor: "pointer",
          }}
        >
          <div style={{ fontSize: "1.5rem" }}>📋</div>
          <h1
            style={{
              fontSize: "1.25rem",
              fontWeight: "700",
              color: isDark ? "#ffffff" : "#1a202c",
            }}
          >
            Data Format Converter
          </h1>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={handleThemeToggle}
          style={{
            padding: "0.5rem 0.75rem",
            background: isDark ? "#2d3748" : "#f0f0f0",
            border: "none",
            borderRadius: "0.5rem",
            cursor: "pointer",
            fontSize: "1.25rem",
            transition: "all 0.3s ease",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = isDark ? "#3d4758" : "#e0e0e0";
            e.currentTarget.style.transform = "scale(1.1) rotate(10deg)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = isDark ? "#2d3748" : "#f0f0f0";
            e.currentTarget.style.transform = "scale(1) rotate(0deg)";
          }}
          title={isDark ? "Light Mode" : "Dark Mode"}
        >
          {isDark ? "☀️" : "🌙"}
        </button>
      </div>
    </header>
  );
}
