import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { FormatSelector } from '@/components/ui/FormatSelector';

describe('FormatSelector Component', () => {
  it('renders label', () => {
    render(
      <FormatSelector label="テスト" value="csv" onChange={() => {}} />
    );
    expect(screen.getByText('テスト')).toBeInTheDocument();
  });

  it('renders select element with options', () => {
    render(
      <FormatSelector label="形式" value="csv" onChange={() => {}} />
    );
    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();
    expect(screen.getByText('CSV')).toBeInTheDocument();
    expect(screen.getByText('JSON')).toBeInTheDocument();
    expect(screen.getByText('XML')).toBeInTheDocument();
  });

  it('calls onChange when selection changes', () => {
    const onChange = jest.fn();
    render(
      <FormatSelector label="形式" value="csv" onChange={onChange} />
    );

    const select = screen.getByRole('combobox') as HTMLSelectElement;
    fireEvent.change(select, { target: { value: 'json' } });

    expect(onChange).toHaveBeenCalledWith('json');
  });

  it('disables select when disabled prop is true', () => {
    render(
      <FormatSelector label="形式" value="csv" onChange={() => {}} disabled={true} />
    );

    const select = screen.getByRole('combobox') as HTMLSelectElement;
    expect(select).toBeDisabled();
  });

  it('shows correct selected value', () => {
    render(
      <FormatSelector label="形式" value="xml" onChange={() => {}} />
    );

    const select = screen.getByRole('combobox') as HTMLSelectElement;
    expect(select.value).toBe('xml');
  });
});
