import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { FormEvent } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { PlaceholderForm } from './PlaceholderForm';

describe('PlaceholderForm', () => {
  it('renders fields from metadata and submits values', async () => {
    const onChange = vi.fn();
    const onSubmit = vi.fn((event: FormEvent) => event.preventDefault());

    render(
      <PlaceholderForm
        placeholders={[
          {
            key: 'full_name',
            label: 'Họ và tên',
            type: 'text',
            required: true,
          },
        ]}
        values={{ full_name: 'A' }}
        onChange={onChange}
        onSubmit={onSubmit}
      />,
    );

    const input = screen.getByLabelText('Họ và tên');
    fireEvent.change(input, { target: { value: 'Nguyễn Văn An' } });
    expect(onChange).toHaveBeenCalled();
    expect(onChange.mock.calls[0][0]).toBe('full_name');

    await userEvent.click(screen.getByRole('button', { name: /Lưu/i }));
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('shows the empty message when there are no placeholders', () => {
    render(
      <PlaceholderForm
        placeholders={[]}
        values={{}}
        onChange={vi.fn()}
        onSubmit={vi.fn()}
      />,
    );

    expect(
      screen.getByText(/không có trường placeholder/i),
    ).toBeInTheDocument();
  });
});
