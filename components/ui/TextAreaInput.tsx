'use client';

import { useState, useEffect } from 'react';

interface TextAreaInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  rows?: number;
}

export function TextAreaInput({
  label,
  value,
  onChange,
  placeholder,
  readOnly = false,
  rows = 10,
}: TextAreaInputProps) {
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {label && (
        <label style={{
          display: 'block',
          fontSize: '0.875rem',
          fontWeight: '600',
          color: isDark ? '#ffffff' : '#000000'
        }}>
          {label}
        </label>
      )}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        readOnly={readOnly}
        rows={rows}
        style={{
          width: '100%',
          backgroundColor: isDark ? '#0f1419' : '#ffffff',
          color: isDark ? '#ffffff' : '#000000',
          border: `1px solid ${isDark ? '#2d3748' : '#cbd5e1'}`,
          borderRadius: '0.5rem',
          padding: '0.75rem',
          fontFamily: 'monospace',
          fontSize: '0.875rem',
          resize: 'none',
          transition: 'all 0.2s ease',
          cursor: readOnly ? 'default' : 'text',
          opacity: readOnly ? 0.7 : 1
        } as React.CSSProperties}
        onMouseOver={(e) => {
          if (!readOnly) {
            e.currentTarget.style.borderColor = '#667eea';
          }
        }}
        onMouseOut={(e) => {
          if (!readOnly) {
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
      />
    </div>
  );
}
