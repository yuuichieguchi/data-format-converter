import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Header } from '@/components/layout/Header';

describe('Header Component', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('renders header with title', () => {
    render(<Header />);
    expect(screen.getByText('Data Converter')).toBeInTheDocument();
  });

  it('renders theme toggle button', () => {
    render(<Header />);
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('toggles theme on button click', () => {
    render(<Header />);
    const buttons = screen.getAllByRole('button');
    const themeButton = buttons[0];

    fireEvent.click(themeButton);
    expect(localStorage.getItem('theme')).toBeTruthy();
  });

  it('displays moon emoji in light mode', () => {
    render(<Header />);
    const buttons = screen.getAllByRole('button');
    const themeButton = buttons[0];
    expect(themeButton).toHaveTextContent('🌙');
  });
});
