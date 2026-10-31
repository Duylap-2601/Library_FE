import React, { useEffect, useState } from 'react';
import type { Template } from '../../types/template.types';
import { useTemplateSlides } from '../../hooks/useTemplates';
import { Badge } from '../ui/Badge';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import clsx from 'clsx';

interface PreviewModalProps {
  template: Template | null;
  onClose: () => void;
  onUse: (template: Template) => void;
  isCreating?: boolean;
}

export const PreviewModal: React.FC<PreviewModalProps> = ({
  template,
  onClose,
  onUse,
  isCreating = false,
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const { data: slides = [], isLoading: loadingSlides } = useTemplateSlides(
    template ? template.id : null,
  );

  useEffect(() => {
    setCurrentSlideIndex(0);
  }, [template]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowRight' && slides.length > 1) {
        setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
      }
      if (event.key === 'ArrowLeft' && slides.length > 1) {
        setCurrentSlideIndex((prev) => (prev - 1 + slides.length) % slides.length);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, slides.length]);

  if (!template) return null;

  const currentSlide = slides[currentSlideIndex];
  const previewImage = currentSlide?.imagePath || template.thumbnailPath;
  const titleId = 'preview-dialog-title';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#131416]/70 p-4 sm:p-6"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="flex max-h-[92vh] w-full max-w-[940px] flex-col overflow-hidden rounded-[8px] bg-paper shadow-[0_24px_64px_rgba(0,0,0,0.24)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex shrink-0 items-center justify-between gap-4 border-b border-line px-5 py-3">
          <div className="flex min-w-0 items-center gap-3">
            <Badge type={template.type} />
            <div className="min-w-0">
              <h2 id={titleId} className="truncate text-[15px] font-medium leading-5 text-ink">
                {template.name}
              </h2>
              <p className="num text-[12px] text-muted">
                {template.category} · {template.slideCount}{' '}
                {template.type === 'PPTX' ? 'slide' : 'trang'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng xem trước"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[6px] text-muted hover:bg-active hover:text-ink"
          >
            <X className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </div>

        <div className="relative flex min-h-[360px] flex-1 items-center justify-center overflow-hidden bg-[#131416]">
          {loadingSlides ? (
            <span className="text-[12px] text-white/60">Đang tải slide xem trước…</span>
          ) : (
            <img
              src={previewImage}
              alt={`Xem trước ${template.name}`}
              className="max-h-[56vh] max-w-full object-contain"
            />
          )}

          {slides.length > 1 && (
            <>
              <button
                type="button"
                onClick={() =>
                  setCurrentSlideIndex((prev) => (prev - 1 + slides.length) % slides.length)
                }
                aria-label="Slide trước"
                className="absolute left-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-[6px] bg-white/10 text-white hover:bg-white/20"
              >
                <ChevronLeft className="h-4 w-4" strokeWidth={1.5} />
              </button>
              <button
                type="button"
                onClick={() => setCurrentSlideIndex((prev) => (prev + 1) % slides.length)}
                aria-label="Slide sau"
                className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-[6px] bg-white/10 text-white hover:bg-white/20"
              >
                <ChevronRight className="h-4 w-4" strokeWidth={1.5} />
              </button>
              <span className="num absolute right-3 top-3 text-[12px] text-white/70">
                {currentSlideIndex + 1} / {slides.length}
              </span>
            </>
          )}
        </div>

        {slides.length > 1 && (
          <div className="flex shrink-0 items-center gap-2 overflow-x-auto border-t border-line bg-raised px-5 py-2.5">
            {slides.map((slide, index) => (
              <button
                key={slide.id || index}
                type="button"
                onClick={() => setCurrentSlideIndex(index)}
                aria-label={`Xem slide ${index + 1}`}
                aria-pressed={currentSlideIndex === index}
                className={clsx(
                  'h-12 aspect-[16/10] shrink-0 overflow-hidden rounded-[4px] border-2 transition-colors',
                  currentSlideIndex === index
                    ? 'border-accent'
                    : 'border-transparent opacity-60 hover:opacity-100',
                )}
              >
                <img
                  src={slide.imagePath}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        )}

        <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-line px-5 py-3">
          <p className="line-clamp-2 min-w-0 max-w-[520px] text-[12px] leading-5 text-muted">
            {template.description}
          </p>
          <div className="flex items-center gap-2">
            <button type="button" onClick={onClose} className="btn btn-ghost">
              Đóng
            </button>
            <button
              type="button"
              onClick={() => onUse(template)}
              disabled={isCreating}
              className="btn btn-primary"
            >
              {isCreating ? 'Đang tạo…' : 'Dùng mẫu này'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
