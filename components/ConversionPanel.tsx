'use client';

import { useState, useEffect, useRef } from 'react';
import { ConversionFormat, CSVOptions, JSONOptions, XMLOptions, ConversionError } from '@/lib/types';
import { DEFAULT_CSV_OPTIONS, DEFAULT_JSON_OPTIONS, DEFAULT_XML_OPTIONS } from '@/lib/constants';
import { convert } from '@/lib/converters/orchestrator';
import { FormatSelector } from './ui/FormatSelector';
import { TextAreaInput } from './ui/TextAreaInput';
import { FileUpload } from './ui/FileUpload';
import { OutputDisplay } from './ui/OutputDisplay';
import { ErrorDisplay } from './ui/ErrorDisplay';
import { ConversionOptions } from './ui/ConversionOptions';

export function ConversionPanel() {
  const [isDark, setIsDark] = useState(false);
  const [inputFormat, setInputFormat] = useState<ConversionFormat>('csv');
  const [outputFormat, setOutputFormat] = useState<ConversionFormat>('json');
  const [inputContent, setInputContent] = useState('');
  const [outputContent, setOutputContent] = useState('');
  const [error, setError] = useState<ConversionError | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  const [csvOptions, setCSVOptions] = useState<CSVOptions>(DEFAULT_CSV_OPTIONS);
  const [jsonOptions, setJSONOptions] = useState<JSONOptions>(DEFAULT_JSON_OPTIONS);
  const [xmlOptions, setXMLOptions] = useState<XMLOptions>(DEFAULT_XML_OPTIONS);

  const outputSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateTheme = () => {
      const theme = localStorage.getItem('theme');
      setIsDark(theme === 'dark');
    };

    updateTheme();
    window.addEventListener('theme-changed', updateTheme);
    return () => window.removeEventListener('theme-changed', updateTheme);
  }, []);

  useEffect(() => {
    if (outputContent && outputSectionRef.current) {
      setTimeout(() => {
        outputSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [outputContent]);

  const handleConvert = async () => {
    if (!inputContent.trim()) {
      setError({ message: 'Please enter some data to convert' });
      return;
    }

    setIsLoading(true);
    setError(undefined);
    setOutputContent('');

    try {
      const result = convert({
        input: inputContent,
        fromFormat: inputFormat,
        toFormat: outputFormat,
        csvOptions,
        jsonOptions,
        xmlOptions,
      });

      if (result.success && result.content) {
        setOutputContent(result.content);
      } else {
        setError(result.error || { message: 'Conversion failed' });
      }
    } catch (err) {
      setError({ message: err instanceof Error ? err.message : 'An error occurred' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = (content: string, fileName: string) => {
    setInputContent(content);
    setError(undefined);

    const ext = fileName.split('.').pop()?.toLowerCase();
    if (ext === 'csv' || ext === 'json' || ext === 'xml') {
      setInputFormat(ext as ConversionFormat);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(outputContent);
    } catch {
      setError({ message: 'Failed to copy to clipboard' });
    }
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([outputContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `converted.${outputFormat}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleClearAll = () => {
    setInputContent('');
    setOutputContent('');
    setError(undefined);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Error Display */}
      {error && <ErrorDisplay error={error} onDismiss={() => setError(undefined)} />}

      {/* Main Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.5rem'
      }}>
        {/* Input Section */}
        <div
          style={{
            backgroundColor: isDark ? '#1a202c' : '#ffffff',
            borderRadius: '0.75rem',
            padding: 'clamp(1rem, 4vw, 2rem)',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)',
            border: `1px solid ${isDark ? '#2d3748' : '#e2e8f0'}`,
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem'
          }}
          onMouseOver={(e) => {
            (e.currentTarget as HTMLElement).style.boxShadow = '0 10px 25px rgba(102, 126, 234, 0.08)';
            (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
          }}
          onMouseOut={(e) => {
            (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.07)';
            (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '1.5rem' }}>📥</span>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: isDark ? '#ffffff' : '#1a202c', margin: 0 }}>入力</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <FormatSelector
              label="形式"
              value={inputFormat}
              onChange={(format) => {
                setInputFormat(format);
                setError(undefined);
              }}
            />

            <TextAreaInput
              label="データ"
              value={inputContent}
              onChange={setInputContent}
              placeholder="CSV、JSON、または XML データをここに貼り付けてください..."
            />

            <FileUpload onFileSelect={handleFileSelect} onError={(msg) => setError({ message: msg })} />
          </div>
        </div>

        {/* Control & Options Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Output Format */}
          <div
            style={{
              backgroundColor: isDark ? '#1a202c' : '#ffffff',
              borderRadius: '0.75rem',
              padding: 'clamp(1rem, 4vw, 2rem)',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)',
              border: `1px solid ${isDark ? '#2d3748' : '#e2e8f0'}`,
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}
            onMouseOver={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow = '0 10px 25px rgba(102, 126, 234, 0.08)';
              (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.07)';
              (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '1.5rem' }}>📤</span>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: isDark ? '#ffffff' : '#1a202c', margin: 0 }}>出力</h2>
            </div>
            <FormatSelector label="目標形式" value={outputFormat} onChange={setOutputFormat} />
          </div>

          {/* Options */}
          <div
            style={{
              backgroundColor: isDark ? '#1a202c' : '#ffffff',
              borderRadius: '0.75rem',
              padding: 'clamp(1rem, 4vw, 2rem)',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)',
              border: `1px solid ${isDark ? '#2d3748' : '#e2e8f0'}`
            }}
            onMouseOver={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow = '0 10px 25px rgba(102, 126, 234, 0.08)';
              (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.07)';
              (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
            }}
          >
            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: isDark ? '#ffffff' : '#1a202c', margin: 0, marginBottom: '1rem' }}>設定</h3>
            <ConversionOptions
              inputFormat={inputFormat}
              outputFormat={outputFormat}
              csvOptions={csvOptions}
              jsonOptions={jsonOptions}
              xmlOptions={xmlOptions}
              onCSVOptionsChange={(opts) => setCSVOptions({ ...csvOptions, ...opts })}
              onJSONOptionsChange={(opts) => setJSONOptions({ ...jsonOptions, ...opts })}
              onXMLOptionsChange={(opts) => setXMLOptions({ ...xmlOptions, ...opts })}
            />
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <button
              onClick={handleConvert}
              disabled={isLoading}
              style={{
                width: '100%',
                fontWeight: '600',
                padding: '1rem',
                borderRadius: '0.75rem',
                border: 'none',
                backgroundColor: isLoading ? '#667eea80' : '#667eea',
                color: '#ffffff',
                fontSize: '1rem',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                opacity: isLoading ? 0.7 : 1
              }}
              onMouseOver={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.backgroundColor = '#764ba2';
                  e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 15px 35px rgba(102, 126, 234, 0.4)';
                }
              }}
              onMouseOut={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.backgroundColor = '#667eea';
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                }
              }}
            >
              {isLoading ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  <div style={{
                    width: '1rem',
                    height: '1rem',
                    borderRadius: '50%',
                    border: '2px solid #ffffff',
                    borderTopColor: 'transparent',
                    animation: 'spin 0.6s linear infinite'
                  }} />
                  変換中...
                </div>
              ) : (
                '変換'
              )}
            </button>

            <button
              onClick={handleClearAll}
              style={{
                width: '100%',
                fontWeight: '500',
                padding: '1rem',
                borderRadius: '0.75rem',
                border: `2px solid ${isDark ? '#2d3748' : '#e2e8f0'}`,
                backgroundColor: isDark ? '#0f1419' : '#ffffff',
                color: isDark ? '#cbd5e1' : '#475569',
                fontSize: '1rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = '#667eea';
                e.currentTarget.style.color = '#667eea';
                e.currentTarget.style.backgroundColor = isDark ? '#1a202c' : '#f8f9fa';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = isDark ? '#2d3748' : '#e2e8f0';
                e.currentTarget.style.color = isDark ? '#cbd5e1' : '#475569';
                e.currentTarget.style.backgroundColor = isDark ? '#0f1419' : '#ffffff';
              }}
            >
              すべてクリア
            </button>
          </div>
        </div>
      </div>

      {/* Output Section */}
      {outputContent && (
        <div
          ref={outputSectionRef}
          style={{
            backgroundColor: isDark ? '#1a202c' : '#ffffff',
            borderRadius: '0.75rem',
            padding: 'clamp(1rem, 4vw, 2rem)',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)',
            border: `1px solid ${isDark ? '#2d3748' : '#e2e8f0'}`,
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem'
          }}
          onMouseOver={(e) => {
            (e.currentTarget as HTMLElement).style.boxShadow = '0 10px 25px rgba(102, 126, 234, 0.08)';
            (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
          }}
          onMouseOut={(e) => {
            (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.07)';
            (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '1.5rem' }}>✅</span>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: isDark ? '#ffffff' : '#1a202c', margin: 0 }}>結果</h2>
          </div>
          <OutputDisplay content={outputContent} onCopy={handleCopy} onDownload={handleDownload} />
        </div>
      )}

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
