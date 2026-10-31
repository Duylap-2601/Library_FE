import React, { useState } from 'react';
import { useDocumentPreview } from '../../hooks/useDocuments';
import { PreviewSkeleton } from '../ui/Skeleton';
import { ErrorState } from '../ui/ErrorState';
import { ChevronLeft, ChevronRight, Info, Loader2 } from 'lucide-react';
import clsx from 'clsx';

interface SlideViewerProps {
  documentId: string;
}

export const SlideViewer: React.FC<SlideViewerProps> = ({ documentId }) => {
  const { data: preview, isLoading, isError, refetch } = useDocumentPreview(documentId);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (isLoading) {
    return <PreviewSkeleton />;
  }

  if (isError) {
    return (
      <ErrorState
        title="Không thể tải slide PPTX"
        message="Quá trình render slide thất bại. Bạn vẫn có thể tải file về để xem trực tiếp."
        onRetry={() => refetch()}
      />
    );
  }

  if (!preview || preview.type === 'pending') {
    return (
      <div className="flex min-h-[320px] flex-col items-center justify-center gap-2">
        <Loader2 className="h-5 w-5 animate-spin text-muted" strokeWidth={1.5} />
        <p className="text-[13px] text-muted">
          Đang render slide{preview?.type === 'pending' ? ` (${preview.status.toLowerCase()})` : ''}…
        </p>
      </div>
    );
  }

  if (preview.type !== 'images' || preview.paths.length === 0) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <p className="text-[13px] text-muted">Chưa có ảnh xem trước cho bộ slide này.</p>
      </div>
    );
  }

  const { paths } = preview;
  const currentImage = paths[currentIndex];

  return (
    <div className="flex h-full flex-col gap-3">
      <div className="flex shrink-0 items-start gap-2.5 rounded-[6px] border border-[#fde68a] bg-[#fffbeb] px-3 py-2.5">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#92400e]" strokeWidth={1.5} aria-hidden="true" />
        <p className="text-[12px] leading-5 text-[#92400e]">
          <span className="font-medium">Có thể sửa nội dung qua biểu mẫu bên trái.</span> Bản trình
          chiếu/bảng tính được sinh lại sau mỗi lần lưu; layout, màu sắc và ảnh giữ nguyên. Tải về để
          chỉnh sửa chi tiết bằng PowerPoint, Excel hoặc LibreOffice.
        </p>
      </div>

      <div className="relative flex min-h-[360px] flex-1 items-center justify-center overflow-hidden bg-[#131416]">
        <img
          src={currentImage}
          alt={`Slide ${currentIndex + 1}`}
          className="max-h-[56vh] max-w-full object-contain"
        />

        {paths.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => setCurrentIndex((prev) => (prev - 1 + paths.length) % paths.length)}
              aria-label="Slide trước"
              className="absolute left-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-[6px] bg-white/10 text-white hover:bg-white/20"
            >
              <ChevronLeft className="h-4 w-4" strokeWidth={1.5} />
            </button>
            <button
              type="button"
              onClick={() => setCurrentIndex((prev) => (prev + 1) % paths.length)}
              aria-label="Slide sau"
              className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-[6px] bg-white/10 text-white hover:bg-white/20"
            >
              <ChevronRight className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </>
        )}

        <span className="num absolute right-3 top-3 text-[12px] text-white/70">
          Slide {currentIndex + 1} / {paths.length}
        </span>
      </div>

      {paths.length > 1 && (
        <div className="flex shrink-0 items-center gap-2 overflow-x-auto rounded-[6px] border border-line bg-paper p-2">
          {paths.map((path, index) => (
            <button
              key={path || index}
              type="button"
              onClick={() => setCurrentIndex(index)}
              aria-label={`Xem slide ${index + 1}`}
              aria-pressed={currentIndex === index}
              className={clsx(
                'h-12 aspect-[16/10] shrink-0 overflow-hidden rounded-[4px] border-2 transition-colors',
                currentIndex === index
                  ? 'border-accent'
                  : 'border-transparent opacity-60 hover:opacity-100',
              )}
            >
              <img src={path} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
