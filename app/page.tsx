'use client';

import { useState, useEffect } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { ConversionPanel } from '@/components/ConversionPanel';

export default function Home() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const updateTheme = () => {
      const theme = localStorage.getItem('theme');
      setIsDark(theme === 'dark');
    };

    updateTheme();
    window.addEventListener('storage', updateTheme);

    const handleCustomEvent = () => {
      updateTheme();
    };
    window.addEventListener('theme-changed', handleCustomEvent);

    return () => {
      window.removeEventListener('storage', updateTheme);
      window.removeEventListener('theme-changed', handleCustomEvent);
    };
  }, []);

  const scrollToConverter = () => {
    const converterSection = document.getElementById('converter-section');
    if (converterSection) {
      converterSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <PageLayout>
      {/* Hero Section with Gradient */}
      <div className="relative overflow-hidden" style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        minHeight: '500px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {/* Animated background elements */}
        <div style={{
          position: 'absolute',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.1)',
          top: '-100px',
          right: '-100px',
          filter: 'blur(40px)'
        }} />
        <div style={{
          position: 'absolute',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.05)',
          bottom: '-50px',
          left: '-50px',
          filter: 'blur(40px)'
        }} />

        {/* Content */}
        <div className="relative z-10 text-center px-6 max-w-4xl">
          <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>📊</div>
          <h1 style={{
            fontSize: '3.5rem',
            fontWeight: '800',
            color: '#ffffff',
            marginBottom: '1rem',
            lineHeight: '1.2'
          }}>
            Data Format Converter
          </h1>
          <p style={{
            fontSize: '1.3rem',
            color: 'rgba(255,255,255,0.9)',
            marginBottom: '2rem'
          }}>
            CSV、JSON、XML を瞬時に相互変換。シンプルで強力なデータ変換ツール
          </p>
          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={scrollToConverter}
              style={{
              padding: '0.75rem 2rem',
              fontSize: '1rem',
              fontWeight: '600',
              color: '#667eea',
              background: '#ffffff',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
            }} onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.3)';
            }} onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.2)';
            }}>
              今すぐ変換開始
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div style={{
        padding: '5rem 2rem',
        background: isDark ? '#1a202c' : '#ffffff'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            textAlign: 'center',
            marginBottom: '3rem',
            color: isDark ? '#ffffff' : '#1a202c'
          }}>
            主な機能
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem'
          }}>
            {[
              { icon: '⚡', title: '高速変換', desc: 'リアルタイムでデータを変換' },
              { icon: '🔒', title: 'セキュア', desc: 'クライアント側で処理・データ保護' },
              { icon: '📁', title: 'ファイル対応', desc: 'ファイルアップロード機能搭載' },
              { icon: '🎨', title: 'カスタマイズ', desc: '柔軟な変換オプション' }
            ].map((feature, i) => (
              <div key={i} style={{
                padding: '2rem',
                borderRadius: '0.75rem',
                border: `1px solid ${isDark ? '#2d3748' : '#e2e8f0'}`,
                background: isDark ? '#2d3748' : '#f8f9fa',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }} onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(102, 126, 234, 0.1)';
              }} onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{feature.icon}</div>
                <h3 style={{
                  fontSize: '1.3rem',
                  fontWeight: '600',
                  color: isDark ? '#ffffff' : '#1a202c',
                  marginBottom: '0.5rem'
                }}>
                  {feature.title}
                </h3>
                <p style={{
                  color: isDark ? '#cbd5e1' : '#666666',
                  lineHeight: '1.6'
                }}>
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Converter Section */}
      <div
        id="converter-section"
        style={{
        padding: '5rem 2rem',
        background: isDark ? '#0f1419' : '#f8f9fa'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            textAlign: 'center',
            marginBottom: '3rem',
            color: isDark ? '#ffffff' : '#1a202c'
          }}>
            データを変換する
          </h2>
          <ConversionPanel />
        </div>
      </div>

      {/* Footer */}
      <footer style={{
        padding: '2rem',
        background: '#1a202c',
        color: '#ffffff',
        textAlign: 'center'
      }}>
        <p>© 2025 Data Format Converter. All rights reserved.</p>
      </footer>
    </PageLayout>
  );
}
