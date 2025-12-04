'use client';

import { useState, useEffect } from 'react';
import { ConversionFormat } from '@/lib/types';

interface FormatSelectorProps {
  label: string;
  value: ConversionFormat;
  onChange: (format: ConversionFormat) => void;
  disabled?: boolean;
}

export function FormatSelector({ label, value, onChange, disabled = false }: FormatSelectorProps) {
  const [isDark, setIsDark] = useState(false);
  const formats: ConversionFormat[] = ['csv', 'json', 'xml'];

  useEffect(() => {
    const updateTheme = () => {
      const theme = localStorage.getItem('theme');
      setIsDark(theme === 'dark');
    };

    updateTheme();
    window.addEventListener('theme-changed', updateTheme);
    return () => window.removeEventListener('theme-changed', updateTheme);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <label style={{
        display: 'block',
        fontSize: '0.875rem',
        fontWeight: '600',
        color: isDark ? '#ffffff' : '#000000'
      }}>
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as ConversionFormat)}
        disabled={disabled}
        style={{
          width: '100%',
          backgroundColor: isDark ? '#0f1419' : '#ffffff',
          color: isDark ? '#ffffff' : '#000000',
          border: `1px solid ${isDark ? '#2d3748' : '#cbd5e1'}`,
          borderRadius: '0.5rem',
          padding: '0.75rem',
          fontSize: '0.875rem',
          cursor: disabled ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s ease',
          opacity: disabled ? 0.6 : 1
        }}
        onMouseOver={(e) => {
          if (!disabled) {
            e.currentTarget.style.borderColor = '#667eea';
          }
        }}
        onMouseOut={(e) => {
          if (!disabled) {
            e.currentTarget.style.borderColor = '#cbd5e1';
          }
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = '#667eea';
          e.currentTarget.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = '#cbd5e1';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        {formats.map((format) => (
          <option key={format} value={format}>
            {format.toUpperCase()}
          </option>
        ))}
      </select>
    </div>
  );
}
