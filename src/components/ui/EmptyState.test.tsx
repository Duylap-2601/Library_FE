import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { EmptyState } from './EmptyState';

describe('EmptyState', () => {
  it('calls onClear when the user clears filters', async () => {
    const onClear = vi.fn();
    render(<EmptyState onClear={onClear} />);

    expect(screen.getByText(/Không tìm thấy mẫu phù hợp/)).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: /Xóa bộ lọc/ }));
    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it('hides the clear action when no handler is provided', () => {
    render(<EmptyState />);
    expect(
      screen.queryByRole('button', { name: /Xóa bộ lọc/ }),
    ).not.toBeInTheDocument();
  });
});
