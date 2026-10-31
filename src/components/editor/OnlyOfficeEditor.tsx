import React, { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { editorApi } from '../../api/editor.api';

interface OnlyOfficeEditorInstance {
  destroyEditor?: () => void;
}

declare global {
  interface Window {
    DocsAPI?: {
      DocEditor: new (
        id: string,
        config: Record<string, unknown>,
      ) => OnlyOfficeEditorInstance;
    };
  }
}

interface OnlyOfficeEditorProps {
  documentId: string;
  onClose: () => void;
}

const SCRIPT_ID = 'onlyoffice-api-script';

function loadScript(url: string): Promise<void> {
  const existing = document.getElementById(SCRIPT_ID) as
    | HTMLScriptElement
    | null;

  if (existing) {
    return existing.dataset.loaded === 'true'
      ? Promise.resolve()
      : new Promise((resolve, reject) => {
          existing.addEventListener('load', () => resolve(), { once: true });
          existing.addEventListener(
            'error',
            () => reject(new Error('Không tải được OnlyOffice API')),
            { once: true },
          );
        });
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.src = url;
    script.async = true;
    script.addEventListener(
      'load',
      () => {
        script.dataset.loaded = 'true';
        resolve();
      },
      { once: true },
    );
    script.addEventListener(
      'error',
      () => reject(new Error('Không tải được OnlyOffice API')),
      { once: true },
    );
    document.body.appendChild(script);
  });
}

export const OnlyOfficeEditor: React.FC<OnlyOfficeEditorProps> = ({
  documentId,
  onClose,
}) => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    let editor: OnlyOfficeEditorInstance | null = null;
    let active = true;

    const boot = async () => {
      try {
        const response = await editorApi.config(documentId);
        await loadScript(
          `${response.documentServerUrl}/web-apps/apps/api/documents/api.js`,
        );

        if (!active) return;
        if (!window.DocsAPI) {
          throw new Error('OnlyOffice API chưa sẵn sàng');
        }

        const config = {
          ...response.config,
          events: {
            onRequestClose: () => onCloseRef.current(),
            onError: (event: { data?: { message?: string } }) => {
              setError(
                event?.data?.message ?? 'OnlyOffice gặp lỗi khi mở tài liệu',
              );
            },
          },
        } as Record<string, unknown>;

        editor = new window.DocsAPI.DocEditor(
          'onlyoffice-editor',
          config,
        );
        setLoading(false);
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error ? err.message : 'Không mở được OnlyOffice',
          );
          setLoading(false);
        }
      }
    };

    void boot();

    return () => {
      active = false;
      editor?.destroyEditor?.();
      editor = null;
    };
  }, [documentId]);

  return (
    <div className="relative min-h-[620px] flex-1 overflow-hidden rounded-[8px] border border-line bg-paper">
      {loading && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-paper">
          <Loader2 className="h-5 w-5 animate-spin text-muted" strokeWidth={1.5} />
          <p className="text-[13px] text-muted">Đang mở trình soạn thảo…</p>
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="absolute inset-x-4 top-4 z-20 rounded-[6px] border border-[#fecaca] bg-[#fef2f2] px-3 py-2 text-[12px] text-[#991b1b]"
        >
          {error}
        </div>
      )}

      <div id="onlyoffice-editor" className="h-[620px] w-full" />
    </div>
  );
};
