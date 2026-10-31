import React from 'react';
import { FilterX } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  message?: string;
  onClear?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'Không tìm thấy mẫu phù hợp',
  message = 'Thử thay đổi từ khóa tìm kiếm hoặc bỏ bớt các tiêu chí lọc.',
  onClear,
}) => {
  return (
    <div className="rounded-[8px] border border-dashed border-[#dcdee0] bg-paper px-6 py-10 text-center">
      <h2 className="text-[14px] font-medium text-ink">{title}</h2>
      <p className="mx-auto mt-1 max-w-sm text-[13px] leading-5 text-muted">{message}</p>
      {onClear && (
        <button type="button" onClick={onClear} className="btn btn-secondary mt-4">
          <FilterX className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
          Xóa bộ lọc
        </button>
      )}
    </div>
  );
};
