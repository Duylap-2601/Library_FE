import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDocuments } from '../hooks/useDocuments';
import { documentsApi } from '../api/documents.api';
import { Badge } from '../components/ui/Badge';
import { ErrorState } from '../components/ui/ErrorState';
import { FileText, Layers, ChevronLeft, ChevronRight } from 'lucide-react';

export const MyDocumentsPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const limit = 10;
  const {
    data: response,
    isLoading,
    isError,
    refetch,
  } = useDocuments({ page, limit });
  const documents = response?.data ?? [];
  const total = response?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div>
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-semibold tracking-[-0.01em] text-ink">Tài liệu của tôi</h1>
          <p className="mt-1 text-[13px] text-muted">
            {isLoading
              ? 'Đang tải danh sách tài liệu…'
              : isError
                ? 'Không đọc được dữ liệu từ máy chủ.'
                : `${total} tài liệu · Bản sao độc lập sinh ra từ mẫu gốc`}
          </p>
        </div>

        <Link
          to="/"
          className="btn btn-lg btn-primary"
          title="Chọn một mẫu trong thư viện để tạo tài liệu mới"
        >
          <Layers className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
          Chọn mẫu để tạo mới
        </Link>
      </header>

      <section className="mt-6" aria-label="Danh sách tài liệu">
        {isLoading ? (
          <div className="border-t border-line">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="flex h-[72px] items-center gap-3 border-b border-rule"
              >
                <div className="h-10 w-16 shrink-0 rounded-[3px] bg-active" />
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 w-52 rounded-[2px] bg-active" />
                  <div className="h-3 w-32 rounded-[2px] bg-rule" />
                </div>
                <div className="h-5 w-14 rounded-[4px] bg-active" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <ErrorState
            title="Không thể tải danh sách tài liệu"
            message="Không kết nối được tới máy chủ API. Kiểm tra lại dịch vụ backend rồi thử lại."
            onRetry={() => refetch()}
          />
        ) : documents.length === 0 ? (
          <div className="rounded-[8px] border border-dashed border-[#dcdee0] bg-paper px-6 py-12 text-center">
            <h2 className="text-[14px] font-medium text-ink">Chưa có tài liệu nào</h2>
            <p className="mx-auto mt-1 max-w-sm text-[13px] leading-5 text-muted">
              Bạn chưa tạo tài liệu nào từ thư viện mẫu. Chọn một mẫu để sinh văn bản hoặc trình
              chiếu đầu tiên.
            </p>
            <Link to="/" className="btn btn-secondary mt-4">
              Khám phá kho mẫu
            </Link>
          </div>
        ) : (
          <div>
            <div className="hidden h-9 items-center gap-4 border-b border-line text-[12px] text-muted md:grid md:grid-cols-[minmax(0,1fr)_100px_120px_140px]">
              <span>Tài liệu</span>
              <span>Định dạng</span>
              <span className="num text-right">Cập nhật</span>
              <span aria-hidden="true" />
            </div>

            <ul>
              {documents.map((doc) => {
                const downloadUrl = documentsApi.getDownloadUrl(doc.id);
                const thumbUrl = doc.template?.thumbnailPath;
                const updatedAt = new Date(doc.updatedAt).toLocaleDateString('vi-VN');

                return (
                  <li
                    key={doc.id}
                    className="border-b border-rule py-3 md:grid md:h-[72px] md:grid-cols-[minmax(0,1fr)_100px_120px_140px] md:items-center md:gap-4 md:py-0"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="h-10 w-16 shrink-0 overflow-hidden rounded-[3px] border border-line bg-raised">
                        {thumbUrl ? (
                          <img src={thumbUrl} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-muted">
                            <FileText className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0">
                        <Link
                          to={`/documents/${doc.id}`}
                          className="block truncate text-[14px] font-medium text-ink transition-colors hover:text-accent"
                        >
                          {doc.title}
                        </Link>
                        <span className="mt-0.5 block truncate text-[13px] text-muted">
                          {doc.template ? `Mẫu gốc: ${doc.template.name}` : 'Không rõ mẫu gốc'}
                        </span>
                        <span className="num mt-0.5 block text-[13px] text-muted md:hidden">
                          {doc.type} · Cập nhật {updatedAt}
                        </span>
                      </div>
                    </div>

                    <div className="hidden md:block">
                      <Badge type={doc.type} />
                    </div>

                    <span className="num hidden text-right text-[13px] text-muted md:block">
                      {updatedAt}
                    </span>

                    <div className="mt-2 flex items-center justify-end gap-1 md:mt-0">
                      <a
                        href={downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-sm btn-ghost"
                      >
                        Tải về
                      </a>
                      <Link to={`/documents/${doc.id}`} className="btn btn-sm btn-secondary">
                        Mở
                      </Link>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </section>

      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between border-t border-line pt-4">
          <span className="num text-[12px] text-muted">
            Trang {page}/{totalPages} · {total} tài liệu
          </span>
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
            <button
              type="button"
              onClick={() =>
                setPage((current) => Math.min(totalPages, current + 1))
              }
              disabled={page >= totalPages}
              aria-label="Trang sau"
              className="btn btn-secondary w-8 px-0"
            >
              <ChevronRight className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
