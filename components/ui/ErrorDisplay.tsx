'use client';

import { ConversionError } from '@/lib/types';

interface ErrorDisplayProps {
  error: ConversionError | undefined;
  onDismiss: () => void;
}

export function ErrorDisplay({ error, onDismiss }: ErrorDisplayProps) {
  if (!error) return null;

  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: '1rem',
      borderRadius: '0.5rem',
      border: '1px solid #fca5a5',
      backgroundColor: '#fef2f2',
      padding: '1rem'
    }}>
      <div style={{ flexShrink: 0 }}>
        <span style={{ fontSize: '1.25rem' }}>⚠️</span>
      </div>
      <div style={{ flex: 1 }}>
        <h3 style={{
          fontWeight: '600',
          color: '#7f1d1d',
          margin: 0
        }}>
          エラー
        </h3>
        <p style={{
          marginTop: '0.25rem',
          fontSize: '0.875rem',
          color: '#b91c1c'
        }}>
          {error.message}
        </p>
        {error.line && (
          <p style={{
            marginTop: '0.25rem',
            fontSize: '0.75rem',
            color: '#991b1b'
          }}>
            行 {error.line}
          </p>
        )}
        {error.context && (
          <p style={{
            marginTop: '0.25rem',
            fontFamily: 'monospace',
            fontSize: '0.75rem',
            color: '#991b1b',
            wordBreak: 'break-word'
          }}>
            {error.context}
          </p>
        )}
      </div>
      <button
        onClick={onDismiss}
        style={{
          flexShrink: 0,
          fontWeight: '600',
          color: '#dc2626',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontSize: '1.25rem',
          padding: '0',
          transition: 'color 0.2s ease'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.color = '#991b1b';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.color = '#dc2626';
        }}
        aria-label="エラーを閉じる"
      >
        ✕
      </button>
    </div>
  );
}
