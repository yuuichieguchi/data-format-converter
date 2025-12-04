import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';

describe('ErrorDisplay Component', () => {
  it('returns null when error is undefined', () => {
    const { container } = render(
      <ErrorDisplay error={undefined} onDismiss={() => {}} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('displays error message', () => {
    render(
      <ErrorDisplay
        error={{ message: 'テストエラー' }}
        onDismiss={() => {}}
      />
    );
    expect(screen.getByText('テストエラー')).toBeInTheDocument();
  });

  it('displays error title', () => {
    render(
      <ErrorDisplay
        error={{ message: 'テストエラー' }}
        onDismiss={() => {}}
      />
    );
    expect(screen.getByText('エラー')).toBeInTheDocument();
  });

  it('displays error line number when provided', () => {
    render(
      <ErrorDisplay
        error={{ message: 'エラー', line: 42 }}
        onDismiss={() => {}}
      />
    );
    expect(screen.getByText('行 42')).toBeInTheDocument();
  });

  it('displays error context when provided', () => {
    render(
      <ErrorDisplay
        error={{ message: 'エラー', context: 'invalid data' }}
        onDismiss={() => {}}
      />
    );
    expect(screen.getByText('invalid data')).toBeInTheDocument();
  });

  it('calls onDismiss when close button is clicked', () => {
    const onDismiss = jest.fn();
    render(
      <ErrorDisplay
        error={{ message: 'テストエラー' }}
        onDismiss={onDismiss}
      />
    );

    const closeButton = screen.getByLabelText('エラーを閉じる');
    fireEvent.click(closeButton);

    expect(onDismiss).toHaveBeenCalled();
  });
});
