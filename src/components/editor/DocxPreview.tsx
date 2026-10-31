import React from 'react';
import { useDocumentPreview } from '../../hooks/useDocuments';
import { PreviewSkeleton } from '../ui/Skeleton';
import { ErrorState } from '../ui/ErrorState';

interface DocxPreviewProps {
  documentId: string;
}

const DOC_STYLES = `
  *, *::before, *::after { box-sizing: border-box; }
  body {
    margin: 0;
    padding: 24px;
    background: #eef0f1;
    color: #1a1a1a;
    font-family: "IBM Plex Sans", Inter, system-ui, sans-serif;
    font-size: 14px;
    line-height: 1.7;
    -webkit-font-smoothing: antialiased;
  }
  .paper {
    max-width: 760px;
    min-height: 842px;
    margin: 0 auto;
    padding: 56px 48px;
    background: #ffffff;
    border: 1px solid #e8eaec;
  }
  @media (max-width: 640px) {
    body { padding: 16px; }
    .paper { padding: 32px 24px; min-height: 560px; }
  }
  h1 { margin: 0 0 16px; font-size: 24px; font-weight: 600; line-height: 1.3; }
  h2 { margin: 24px 0 8px; font-size: 18px; font-weight: 600; line-height: 1.35; }
  h3 { margin: 20px 0 6px; font-size: 15px; font-weight: 600; }
  p { margin: 0 0 12px; }
  ul, ol { margin: 0 0 12px 20px; }
  ul { list-style: disc; }
  ol { list-style: decimal; }
  li { margin-bottom: 4px; }
  a { color: #1b6c80; text-decoration: underline; }
  table { width: 100%; margin: 16px 0; border-collapse: collapse; font-size: 13px; }
  th, td { border: 1px solid #d8dadd; padding: 6px 8px; text-align: left; vertical-align: top; }
  th { background: #f2f1ee; font-weight: 500; }
  img { max-width: 100%; height: auto; }
  hr { margin: 20px 0; border: 0; border-top: 1px solid #e8eaec; }
`;

const buildPreviewDocument = (html: string) => `<!doctype html>
<html lang="vi">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600&display=swap" rel="stylesheet" />
    <style>${DOC_STYLES}</style>
  </head>
  <body>
    <div class="paper">${html}</div>
  </body>
</html>`;

export const DocxPreview: React.FC<DocxPreviewProps> = ({ documentId }) => {
  const { data: preview, isLoading, isError, refetch } = useDocumentPreview(documentId);

  if (isLoading) {
    return <PreviewSkeleton />;
  }

  if (isError) {
    return (
      <div className="flex h-full items-center justify-center bg-well p-6">
        <ErrorState
          title="Không thể tải xem trước DOCX"
          message="Quá trình render HTML thất bại hoặc file đang được cập nhật."
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  if (!preview || preview.type !== 'html') {
    return (
      <div className="flex h-full items-center justify-center bg-well p-6">
        <p className="text-[13px] text-muted">Chưa có dữ liệu xem trước.</p>
      </div>
    );
  }

  return (
    <iframe
      title="Xem trước tài liệu"
      srcDoc={buildPreviewDocument(preview.html)}
      sandbox=""
      className="h-full w-full border-0"
    />
  );
};
