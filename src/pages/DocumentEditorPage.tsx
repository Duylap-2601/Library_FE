import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link, useBlocker } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useDocumentDetail, useUpdateDocument } from '../hooks/useDocuments';
import { documentsApi } from '../api/documents.api';
import { editorApi } from '../api/editor.api';
import { PlaceholderForm } from '../components/editor/PlaceholderForm';
import { DocxPreview } from '../components/editor/DocxPreview';
import { SlideViewer } from '../components/editor/SlideViewer';
import { OnlyOfficeEditor } from '../components/editor/OnlyOfficeEditor';
import { Badge } from '../components/ui/Badge';
import { ErrorState } from '../components/ui/ErrorState';
import { PreviewSkeleton } from '../components/ui/Skeleton';
import type { PlaceholderDef } from '../types/template.types';
import { isNumericField, withNumericSuffix } from '../utils/numberFormat';
import { Download, Clock, Pencil } from 'lucide-react';

function sameFieldValues(
  left: Record<string, unknown>,
  right: Record<string, unknown>,
): boolean {
  const keys = new Set([...Object.keys(left), ...Object.keys(right)]);
  for (const key of keys) {
    const a = left[key] === undefined || left[key] === null ? '' : String(left[key]);
    const b = right[key] === undefined || right[key] === null ? '' : String(right[key]);
    if (a !== b) return false;
  }
  return true;
}

export const DocumentEditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: document, isLoading, isError } = useDocumentDetail(id || '');
  const updateMutation = useUpdateDocument(id || '');
  const queryClient = useQueryClient();

  const [title, setTitle] = useState('');
  const [fieldValues, setFieldValues] = useState<Record<string, unknown>>({});
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [editingTitle, setEditingTitle] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [editorAvailable, setEditorAvailable] = useState(false);
  const [onlyofficeOpen, setOnlyofficeOpen] = useState(false);

  useEffect(() => {
    let active = true;
    editorApi
      .status()
      .then((status) => {
        if (active) setEditorAvailable(status.enabled);
      })
      .catch(() => {
        if (active) setEditorAvailable(false);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (document) {
      setTitle(document.title);
      setFieldValues(document.fieldValues || {});
    }
  }, [document]);

  const dirty =
    Boolean(document) &&
    (title.trim() !== (document?.title ?? '') ||
      !sameFieldValues(fieldValues, document?.fieldValues ?? {}));

  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      dirty && currentLocation.pathname !== nextLocation.pathname,
  );

  useEffect(() => {
    if (blocker.state !== 'blocked') return;

    if (window.confirm('Bạn có thay đổi chưa lưu. Rời trang và bỏ thay đổi?')) {
      blocker.proceed();
    } else {
      blocker.reset();
    }
  }, [blocker]);

  useEffect(() => {
    if (!dirty) return;

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [dirty]);

  if (isLoading) {
    return (
      <div className="min-h-[420px]">
        <PreviewSkeleton />
      </div>
    );
  }

  if (isError || !document || !id) {
    return (
      <div className="py-8">
        <ErrorState
          title="Không tìm thấy tài liệu"
          message="Tài liệu bạn yêu cầu không tồn tại hoặc đã bị xóa."
          onRetry={() => navigate('/documents')}
        />
      </div>
    );
  }

  const handleFieldChange = (key: string, value: string) => {
    setActionError(null);
    setFieldValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const editorPlaceholders: PlaceholderDef[] = document.template?.placeholders?.length
    ? document.template.placeholders
    : Object.keys(fieldValues).map((key) => ({
        key,
        label: key,
        type: 'text',
        required: false,
      }));

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setActionError(null);

    const normalizedFieldValues = Object.fromEntries(
      Object.entries(fieldValues).map(([key, value]) => {
        const field = editorPlaceholders.find((item) => item.key === key);
        return [
          key,
          field && isNumericField(field) ? withNumericSuffix(value, field) : value,
        ];
      }),
    );

    try {
      await updateMutation.mutateAsync({
        title: title.trim() || document.title,
        fieldValues: normalizedFieldValues,
      });
      setSavedSuccess(true);
      window.setTimeout(() => setSavedSuccess(false), 2500);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Lỗi khi lưu tài liệu');
    }
  };

  const commitTitle = async () => {
    const nextTitle = title.trim();
    setEditingTitle(false);

    if (!nextTitle) {
      setTitle(document.title);
      return;
    }

    if (nextTitle !== document.title) {
      setActionError(null);
      try {
        await updateMutation.mutateAsync({ title: nextTitle });
      } catch (err) {
        setTitle(document.title);
        setActionError(err instanceof Error ? err.message : 'Lỗi khi đổi tên tài liệu');
      }
    }
  };

  const handleEditorClose = () => {
    setOnlyofficeOpen(false);
    window.setTimeout(() => {
      void queryClient.invalidateQueries({ queryKey: ['document', document.id] });
      void queryClient.invalidateQueries({
        queryKey: ['document', document.id, 'preview'],
      });
      void queryClient.invalidateQueries({ queryKey: ['documents'] });
    }, 1_500);
  };

  const downloadUrl = documentsApi.getDownloadUrl(id);
  const updatedDate = new Date(document.updatedAt);
  const updatedAt = `${updatedDate.toLocaleDateString('vi-VN')} · ${updatedDate.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
  })}`;

  const placeholderForm = (
    <PlaceholderForm
      placeholders={editorPlaceholders}
      values={fieldValues}
      onChange={handleFieldChange}
      onSubmit={handleFormSubmit}
      isSaving={updateMutation.isPending}
    />
  );

  return (
    <div className="flex flex-col gap-4 lg:h-[calc(100vh-64px)]">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[12px] text-muted">
            <Link to="/documents" className="transition-colors hover:text-ink">
              Tài liệu của tôi
            </Link>
            <span aria-hidden="true">/</span>
            <span className="truncate">{document.template?.name ?? document.type}</span>
          </nav>

          <div className="mt-1 flex min-w-0 items-center gap-2">
            {editingTitle ? (
              <input
                autoFocus
                type="text"
                value={title}
                onChange={(event) => {
                  setTitle(event.target.value);
                  setActionError(null);
                }}
                onBlur={commitTitle}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    commitTitle();
                  }
                  if (event.key === 'Escape') {
                    setTitle(document.title);
                    setEditingTitle(false);
                  }
                }}
                aria-label="Tiêu đề tài liệu"
                className="field h-auto w-[560px] max-w-full px-1.5 py-0.5 text-[22px] font-semibold tracking-[-0.01em]"
              />
            ) : (
              <h1 className="min-w-0 text-[22px] font-semibold leading-7 tracking-[-0.01em] text-ink">
                <button
                  type="button"
                  onClick={() => setEditingTitle(true)}
                  title="Đổi tên tài liệu"
                  className="line-clamp-2 max-w-full text-left transition-colors hover:text-accent"
                >
                  {title || 'Tài liệu chưa đặt tên'}
                </button>
              </h1>
            )}

            <Badge type={document.type} />

            {savedSuccess && (
              <span className="shrink-0 text-[12px] font-medium text-positive" role="status">
                Đã lưu
              </span>
            )}

            {dirty && !savedSuccess && (
              <span className="shrink-0 text-[12px] text-muted" role="status">
                Chưa lưu
              </span>
            )}
          </div>

          <p className="mt-1 flex items-center gap-1 text-[12px] text-muted">
            <Clock className="h-3 w-3" strokeWidth={1.5} aria-hidden="true" />
            <span className="num">Cập nhật {updatedAt}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          {editorAvailable && (
            <button
              type="button"
              onClick={() => setOnlyofficeOpen((value) => !value)}
              title="Sửa toàn bộ nội dung, bao gồm các điều khoản"
              className="btn btn-secondary"
            >
              <Pencil className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
              {onlyofficeOpen ? 'Quay lại biểu mẫu' : 'Chỉnh sửa nâng cao'}
            </button>
          )}

          <a
            href={downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={document.type === 'PPTX' ? 'btn btn-primary' : 'btn btn-secondary'}
          >
            <Download className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
            Tải xuống {document.type}
          </a>
        </div>
      </header>

      {actionError && (
        <div
          role="alert"
          className="rounded-[6px] border border-[#fecaca] bg-[#fef2f2] px-3 py-2 text-[12px] leading-5 text-[#991b1b]"
        >
          {actionError}
        </div>
      )}

      {onlyofficeOpen ? (
        <OnlyOfficeEditor
          documentId={document.id}
          onClose={handleEditorClose}
        />
      ) : (
        <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="min-h-0 lg:col-span-5 xl:col-span-4">
          {placeholderForm}
        </div>

        <div className="flex h-[520px] min-h-0 flex-col overflow-hidden rounded-[8px] border border-line bg-paper lg:col-span-7 lg:h-auto xl:col-span-8">
          <div className="flex h-11 shrink-0 items-center justify-between gap-3 border-b border-rule px-4">
            <h2 className="text-[13px] font-medium text-ink">
              {document.type === 'DOCX'
                ? 'Xem trước bản in'
                : document.type === 'PPTX'
                  ? 'Xem trước slide'
                  : 'Xem trước bảng tính'}
            </h2>
            <span className="text-[12px] text-muted">
              {document.type === 'DOCX'
                ? 'Định dạng DOCX được giữ nguyên'
                : document.type === 'PPTX'
                  ? 'Bản PPTX được sinh lại sau mỗi lần lưu'
                  : 'Bản XLSX được sinh lại sau mỗi lần lưu'}
            </span>
          </div>
          <div className="min-h-0 flex-1">
            {document.type === 'DOCX' ? (
              <DocxPreview documentId={document.id} />
            ) : (
              <div className="h-full p-3">
                <SlideViewer documentId={document.id} />
              </div>
            )}
          </div>
        </div>
        </div>
      )}
    </div>
  );
};
