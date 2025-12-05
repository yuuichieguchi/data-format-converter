'use client';

import { ReactNode } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { Header } from './Header';

interface PageLayoutProps {
  children: ReactNode;
}

export function PageLayout({ children }: PageLayoutProps) {
  const isDark = useTheme();

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: isDark ? '#1a202c' : '#ffffff',
      color: isDark ? '#ffffff' : '#000000',
      transition: 'background-color 0.3s ease, color 0.3s ease'
    }}>
      <Header />
      <main style={{ flex: 1 }}>
        {children}
      </main>
    </div>
  );
}
