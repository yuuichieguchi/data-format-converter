import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { TextAreaInput } from '@/components/ui/TextAreaInput';

describe('TextAreaInput Component', () => {
  it('renders label', () => {
    render(
      <TextAreaInput label="入力" value="" onChange={() => {}} />
    );
    expect(screen.getByText('入力')).toBeInTheDocument();
  });

  it('renders textarea element', () => {
    render(
      <TextAreaInput label="入力" value="" onChange={() => {}} />
    );
    const textarea = screen.getByRole('textbox');
    expect(textarea).toBeInTheDocument();
  });

  it('displays placeholder text', () => {
    render(
      <TextAreaInput
        label="入力"
        value=""
        onChange={() => {}}
        placeholder="ここに入力してください"
      />
    );
    const textarea = screen.getByPlaceholderText('ここに入力してください');
    expect(textarea).toBeInTheDocument();
  });

  it('calls onChange when input changes', () => {
    const onChange = jest.fn();
    render(
      <TextAreaInput label="入力" value="" onChange={onChange} />
    );

    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'test data' } });

    expect(onChange).toHaveBeenCalledWith('test data');
  });

  it('displays initial value', () => {
    render(
      <TextAreaInput label="入力" value="initial value" onChange={() => {}} />
    );

    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
    expect(textarea.value).toBe('initial value');
  });

  it('sets readOnly when readOnly is true', () => {
    render(
      <TextAreaInput label="入力" value="test" onChange={() => {}} readOnly={true} />
    );

    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
    expect(textarea).toHaveAttribute('readonly');
  });

  it('sets correct number of rows', () => {
    render(
      <TextAreaInput label="入力" value="" onChange={() => {}} rows={15} />
    );

    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
    expect(textarea.rows).toBe(15);
  });
});
