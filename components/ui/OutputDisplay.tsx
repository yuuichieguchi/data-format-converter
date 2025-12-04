'use client';

interface OutputDisplayProps {
  content: string;
  onCopy: () => void;
  onDownload: () => void;
}

export function OutputDisplay({ content, onCopy, onDownload }: OutputDisplayProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <button
          onClick={onCopy}
          style={{
            backgroundColor: '#667eea',
            color: '#ffffff',
            fontWeight: '600',
            padding: '0.625rem 1rem',
            fontSize: '0.875rem',
            borderRadius: '0.5rem',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#764ba2';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = '#667eea';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
          title="クリップボードにコピー"
        >
          📋 コピー
        </button>
        <button
          onClick={onDownload}
          style={{
            backgroundColor: '#ffffff',
            color: '#667eea',
            fontWeight: '500',
            padding: '0.625rem 1rem',
            fontSize: '0.875rem',
            borderRadius: '0.5rem',
            border: '2px solid #e2e8f0',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.borderColor = '#667eea';
            e.currentTarget.style.backgroundColor = '#f8f9fa';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.borderColor = '#e2e8f0';
            e.currentTarget.style.backgroundColor = '#ffffff';
          }}
          title="ファイルとしてダウンロード"
        >
          ⬇️ ダウンロード
        </button>
      </div>
      <textarea
        value={content}
        readOnly
        rows={10}
        style={{
          width: '100%',
          backgroundColor: '#ffffff',
          color: '#000000',
          border: '1px solid #cbd5e1',
          borderRadius: '0.5rem',
          padding: '0.75rem',
          fontFamily: 'monospace',
          fontSize: '0.875rem',
          resize: 'none',
          opacity: 0.9
        }}
      />
    </div>
  );
}
