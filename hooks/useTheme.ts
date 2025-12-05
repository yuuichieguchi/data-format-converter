'use client';

import { useState, useEffect } from 'react';

export function useTheme(): boolean {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const updateTheme = () => {
      const theme = localStorage.getItem('theme');
      setIsDark(theme === 'dark');
    };

    updateTheme();
    window.addEventListener('theme-changed', updateTheme);
    return () => window.removeEventListener('theme-changed', updateTheme);
  }, []);

  return isDark;
}
