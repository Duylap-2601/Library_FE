import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useDocumentPreview } from '../../hooks/useDocuments';
import { SlideViewer } from './SlideViewer';

vi.mock('../../hooks/useDocuments', () => ({
  useDocumentPreview: vi.fn(),
}));

const mockedPreview = vi.mocked(useDocumentPreview);

function mockQuery(data: unknown): void {
  mockedPreview.mockReturnValue({
    data,
    isLoading: false,
    isError: false,
    refetch: vi.fn(),
  } as unknown as ReturnType<typeof useDocumentPreview>);
}

describe('SlideViewer', () => {
  it('shows a rendering state while the queue is working', () => {
    mockQuery({
      type: 'pending',
      status: 'QUEUED',
      retryAfterMs: 1500,
    });

    render(<SlideViewer documentId="doc-1" />);
    expect(screen.getByText(/Đang render slide/)).toBeInTheDocument();
  });

  it('renders the slide images when ready', () => {
    mockQuery({
      type: 'images',
      paths: [
        '/previews/doc-1/slide-1.png?v=1',
        '/previews/doc-1/slide-2.png?v=1',
      ],
    });

    render(<SlideViewer documentId="doc-1" />);
    expect(screen.getByAltText('Slide 1')).toBeInTheDocument();
    expect(screen.getByText('Slide 1 / 2')).toBeInTheDocument();
  });
});
