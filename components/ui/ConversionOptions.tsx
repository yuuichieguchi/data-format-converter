'use client';

import { ConversionFormat, CSVOptions, JSONOptions, XMLOptions } from '@/lib/types';

interface ConversionOptionsProps {
  inputFormat: ConversionFormat;
  outputFormat: ConversionFormat;
  csvOptions: CSVOptions;
  jsonOptions: JSONOptions;
  xmlOptions: XMLOptions;
  onCSVOptionsChange: (options: Partial<CSVOptions>) => void;
  onJSONOptionsChange: (options: Partial<JSONOptions>) => void;
  onXMLOptionsChange: (options: Partial<XMLOptions>) => void;
}

export function ConversionOptions({
  inputFormat,
  outputFormat,
  csvOptions,
  jsonOptions,
  xmlOptions,
  onCSVOptionsChange,
  onJSONOptionsChange,
  onXMLOptionsChange,
}: ConversionOptionsProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {(inputFormat === 'csv' || outputFormat === 'csv') && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: '600',
            color: '#000000'
          }}>
            CSV デリミタ
          </label>
          <select
            value={csvOptions.delimiter}
            onChange={(e) => onCSVOptionsChange({ delimiter: e.target.value as CSVOptions['delimiter'] })}
            style={{
              width: '100%',
              backgroundColor: '#ffffff',
              color: '#000000',
              border: '1px solid #cbd5e1',
              borderRadius: '0.5rem',
              padding: '0.75rem',
              fontSize: '0.875rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = '#667eea';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = '#cbd5e1';
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
            <option value=",">カンマ (,)</option>
            <option value=";">セミコロン (;)</option>
            <option value="\t">タブ (→)</option>
          </select>
        </div>
      )}

      {(inputFormat === 'json' || outputFormat === 'json') && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: '600',
            color: '#000000'
          }}>
            JSON インデント
          </label>
          <select
            value={jsonOptions.indent}
            onChange={(e) => onJSONOptionsChange({ indent: parseInt(e.target.value) as 2 | 4 })}
            style={{
              width: '100%',
              backgroundColor: '#ffffff',
              color: '#000000',
              border: '1px solid #cbd5e1',
              borderRadius: '0.5rem',
              padding: '0.75rem',
              fontSize: '0.875rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = '#667eea';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = '#cbd5e1';
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
            <option value="2">2 スペース</option>
            <option value="4">4 スペース</option>
          </select>
        </div>
      )}

      {(inputFormat === 'xml' || outputFormat === 'xml') && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            cursor: 'pointer'
          }}>
            <input
              type="checkbox"
              checked={xmlOptions.prettyPrint}
              onChange={(e) => onXMLOptionsChange({ prettyPrint: e.target.checked })}
              style={{
                width: '1rem',
                height: '1rem',
                borderRadius: '0.25rem',
                accentColor: '#667eea',
                cursor: 'pointer'
              }}
            />
            <span style={{
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#000000'
            }}>
              XML をきれいに表示
            </span>
          </label>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            cursor: 'pointer'
          }}>
            <input
              type="checkbox"
              checked={xmlOptions.includeDeclaration}
              onChange={(e) => onXMLOptionsChange({ includeDeclaration: e.target.checked })}
              style={{
                width: '1rem',
                height: '1rem',
                borderRadius: '0.25rem',
                accentColor: '#667eea',
                cursor: 'pointer'
              }}
            />
            <span style={{
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#000000'
            }}>
              XML 宣言を含める
            </span>
          </label>
        </div>
      )}
    </div>
  );
}
