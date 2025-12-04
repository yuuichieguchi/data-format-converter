'use client';

import { useRef, useState, useEffect } from 'react';

interface FileUploadProps {
  onFileSelect: (content: string, fileName: string) => void;
  onError: (message: string) => void;
  acceptedFormats?: string[];
}

export function FileUpload({ onFileSelect, onError, acceptedFormats = ['csv', 'json', 'xml'] }: FileUploadProps) {
  const [isDark, setIsDark] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const updateTheme = () => {
      const theme = localStorage.getItem('theme');
      setIsDark(theme === 'dark');
    };

    updateTheme();
    window.addEventListener('theme-changed', updateTheme);
    return () => window.removeEventListener('theme-changed', updateTheme);
  }, []);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file size (max 10MB)
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      onError('File is too large (max 10MB)');
      return;
    }

    // Check file type
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!ext || !acceptedFormats.includes(ext)) {
      onError(`Invalid file type. Accepted: ${acceptedFormats.join(', ')}`);
      return;
    }

    try {
      const content = await file.text();
      onFileSelect(content, file.name);
    } catch (error) {
      onError('Failed to read file');
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const file = event.dataTransfer.files?.[0];
    if (file) {
      // Trigger file handling by simulating file selection
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      if (fileInputRef.current) {
        fileInputRef.current.files = dataTransfer.files;
        handleFileChange({ target: fileInputRef.current } as React.ChangeEvent<HTMLInputElement>);
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <label style={{
        display: 'block',
        fontSize: '0.875rem',
        fontWeight: '600',
        color: isDark ? '#ffffff' : '#000000'
      }}>
        またはファイルをアップロード
      </label>
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        style={{
          borderRadius: '0.5rem',
          border: `2px dashed ${isDark ? '#2d3748' : '#cbd5e1'}`,
          backgroundColor: isDark ? '#1a202c' : '#f8f9fa',
          padding: '1.5rem',
          textAlign: 'center',
          transition: 'all 0.2s ease',
          cursor: 'pointer'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.borderColor = '#667eea';
          e.currentTarget.style.backgroundColor = isDark ? '#2d3748' : '#f0f3ff';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.borderColor = isDark ? '#2d3748' : '#cbd5e1';
          e.currentTarget.style.backgroundColor = isDark ? '#1a202c' : '#f8f9fa';
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileChange}
          accept={acceptedFormats.map((f) => `.${f}`).join(',')}
          style={{ display: 'none' }}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          style={{
            fontWeight: '500',
            color: '#667eea',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '0.875rem',
            transition: 'color 0.2s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.color = '#764ba2';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.color = '#667eea';
          }}
        >
          📁 ここをクリックしてアップロード
        </button>
        <p style={{ marginTop: '0.25rem', fontSize: '0.875rem', color: isDark ? '#ffffff' : '#000000', margin: '0.25rem 0 0 0' }}>
          またはドラッグ&ドロップ
        </p>
        <p style={{ marginTop: '0.25rem', fontSize: '0.75rem', color: isDark ? '#cbd5e1' : '#666666', margin: '0.25rem 0 0 0' }}>
          CSV、JSON、または XML（最大 10MB）
        </p>
      </div>
    </div>
  );
}
