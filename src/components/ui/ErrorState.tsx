import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Đã có lỗi xảy ra',
  message = 'Không thể tải dữ liệu vào lúc này. Vui lòng thử lại sau.',
  onRetry,
}) => {
  return (
    <div className="rounded-[8px] border border-line bg-paper px-6 py-8 text-center">
      <AlertCircle className="mx-auto h-4 w-4 text-negative" strokeWidth={1.5} aria-hidden="true" />
      <h2 className="mt-2 text-[14px] font-medium text-ink">{title}</h2>
      <p className="mx-auto mt-1 max-w-md text-[13px] leading-5 text-muted">{message}</p>
      {onRetry && (
        <button type="button" onClick={onRetry} className="btn btn-secondary mt-4">
          <RotateCcw className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
          Thử lại
        </button>
      )}
    </div>
  );
};
