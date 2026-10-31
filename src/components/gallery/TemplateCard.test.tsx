import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { TemplateCard } from './TemplateCard';

const template = {
  id: 'tpl-1',
  type: 'DOCX' as const,
  name: 'CV chuyên nghiệp',
  slug: 'cv-chuyen-nghiep',
  category: 'Nhân sự',
  description: 'Mẫu CV một cột',
  thumbnailPath: '/previews/tpl-1/slide-1.png',
  slideCount: 1,
  tags: ['cv'],
  placeholders: [],
  status: 'ACTIVE' as const,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

describe('TemplateCard', () => {
  it('opens preview and creates a document from the actions', async () => {
    const onPreview = vi.fn();
    const onUse = vi.fn();

    render(
      <TemplateCard
        template={template}
        onPreview={onPreview}
        onUse={onUse}
      />,
    );

    expect(screen.getByText('CV chuyên nghiệp')).toBeInTheDocument();
    expect(screen.getByText('Nhân sự')).toBeInTheDocument();

    const previewButtons = screen.getAllByRole('button', {
      name: /Xem trước/i,
    });
    await userEvent.click(previewButtons[0]);
    expect(onPreview).toHaveBeenCalledWith(template);

    await userEvent.click(screen.getByRole('button', { name: /Dùng mẫu/i }));
    expect(onUse).toHaveBeenCalledWith(template);
  });
});
