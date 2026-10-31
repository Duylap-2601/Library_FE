import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTemplates } from '../hooks/useTemplates';
import { useCreateDocument } from '../hooks/useDocuments';
import type { Template, TemplateType } from '../types/template.types';
import { FilterBar } from '../components/gallery/FilterBar';
import { TemplateCard } from '../components/gallery/TemplateCard';
import { PreviewModal } from '../components/gallery/PreviewModal';
import { TemplateCardSkeleton } from '../components/ui/Skeleton';
import { ErrorState } from '../components/ui/ErrorState';
import { EmptyState } from '../components/ui/EmptyState';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const GalleryPage: React.FC = () => {
  const navigate = useNavigate();

  const [type, setType] = useState<TemplateType | undefined>();
  const [category, setCategory] = useState<string | undefined>();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const limit = 12;

  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const [createError, setCreateError] = useState<string | null>(null);

  const {
    data: templateResponse,
    isLoading,
    isError,
    refetch,
  } = useTemplates({
    type,
    category,
    q: searchQuery,
    page,
    limit,
  });

  const createDocMutation = useCreateDocument();

  const handleUseTemplate = async (template: Template) => {
    setCreateError(null);
    try {
      const defaultTitle = `${template.name} - ${new Date().toLocaleDateString('vi-VN')}`;
      const newDoc = await createDocMutation.mutateAsync({
        templateId: template.id,
        title: defaultTitle,
      });
      navigate(`/documents/${newDoc.id}`);
    } catch (err) {
      setCreateError(
        err instanceof Error ? err.message : 'Không thể tạo tài liệu từ mẫu',
      );
    }
  };

  const clearFilters = () => {
    setType(undefined);
    setCategory(undefined);
    setSearchQuery('');
    setPage(1);
  };

  const total = templateResponse?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const rangeStart = total === 0 ? 0 : (page - 1) * limit + 1;
  const rangeEnd = Math.min(page * limit, total);

  const scopeLabel =
    category ||
    (type === 'DOCX'
      ? 'Văn bản (DOCX)'
      : type === 'PPTX'
        ? 'Trình chiếu (PPTX)'
        : type === 'XLSX'
          ? 'Bảng tính (XLSX)'
          : '');

  return (
    <div>
      <header>
        <h1 className="text-[22px] font-semibold tracking-[-0.01em] text-ink">Thư viện mẫu</h1>
        <p className="mt-1 text-[13px] text-muted">
          {isLoading
            ? 'Đang tải danh sách mẫu…'
            : isError
              ? 'Không đọc được dữ liệu từ máy chủ.'
              : `${total} mẫu${scopeLabel ? ` · ${scopeLabel}` : ''} sẵn sàng sử dụng`}
          {templateResponse && templateResponse.total > 0 && !isLoading && !isError && (
            <span className="num"> · Trang {page}/{totalPages}</span>
          )}
        </p>
      </header>

      <div className="mt-6">
        <FilterBar
          selectedType={type}
          selectedCategory={category}
          query={searchQuery}
          onTypeChange={(nextType) => {
            setType(nextType);
            setCategory(undefined);
            setPage(1);
          }}
          onCategoryChange={(nextCategory) => {
            setCategory(nextCategory);
            setPage(1);
          }}
          onQueryChange={(query) => {
            setSearchQuery(query);
            setPage(1);
          }}
          onClear={clearFilters}
        />
      </div>

      {createError && (
        <div
          role="alert"
          className="mt-4 rounded-[6px] border border-[#fecaca] bg-[#fef2f2] px-3 py-2 text-[12px] leading-5 text-[#991b1b]"
        >
          {createError}
        </div>
      )}

      <section className="mt-6" aria-label="Danh sách mẫu">
        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <TemplateCardSkeleton key={index} />
            ))}
          </div>
        ) : isError ? (
          <ErrorState
            title="Không thể tải danh sách mẫu"
            message="Không kết nối được tới máy chủ API. Kiểm tra lại dịch vụ backend rồi thử lại."
            onRetry={() => refetch()}
          />
        ) : !templateResponse || templateResponse.data.length === 0 ? (
          <EmptyState onClear={clearFilters} />
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {templateResponse.data.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                onPreview={(item) => setPreviewTemplate(item)}
                onUse={handleUseTemplate}
                isCreating={createDocMutation.isPending}
              />
            ))}
          </div>
        )}
      </section>

      {templateResponse && total > 0 && (
        <div className="mt-6 flex items-center justify-between border-t border-line pt-4">
          <span className="num text-[12px] text-muted">
            {rangeStart}–{rangeEnd} / {total} mẫu
          </span>

          {totalPages > 1 && (
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                disabled={page <= 1}
                aria-label="Trang trước"
                className="btn btn-secondary w-8 px-0"
              >
                <ChevronLeft className="h-4 w-4" strokeWidth={1.5} />
              </button>
              <span className="num px-2 text-[12px] text-muted">
                {page} / {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                disabled={page >= totalPages}
                aria-label="Trang sau"
                className="btn btn-secondary w-8 px-0"
              >
                <ChevronRight className="h-4 w-4" strokeWidth={1.5} />
              </button>
            </div>
          )}
        </div>
      )}

      <PreviewModal
        template={previewTemplate}
        onClose={() => setPreviewTemplate(null)}
        onUse={(template) => {
          setPreviewTemplate(null);
          handleUseTemplate(template);
        }}
        isCreating={createDocMutation.isPending}
      />
    </div>
  );
};
