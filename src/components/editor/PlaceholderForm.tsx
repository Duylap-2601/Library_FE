import React from 'react';
import type { PlaceholderDef } from '../../types/template.types';
import { Loader2, Save } from 'lucide-react';

interface PlaceholderFormProps {
  placeholders: PlaceholderDef[];
  values: Record<string, unknown>;
  onChange: (key: string, value: string) => void;
  onSubmit: (event: React.FormEvent) => void;
  isSaving?: boolean;
}

export const PlaceholderForm: React.FC<PlaceholderFormProps> = ({
  placeholders,
  values,
  onChange,
  onSubmit,
  isSaving = false,
}) => {
  return (
    <form
      onSubmit={onSubmit}
      className="flex h-full flex-col overflow-hidden rounded-[8px] border border-line bg-paper"
    >
      <div className="shrink-0 border-b border-rule px-4 py-3">
        <h2 className="text-[13px] font-medium text-ink">Thông tin biểu mẫu</h2>
        <p className="num mt-0.5 text-[12px] text-muted">
          {placeholders.length} trường · Điền để sinh lại nội dung
        </p>
      </div>

      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-4">
        {placeholders.length === 0 ? (
          <p className="text-[12px] leading-5 text-muted">
            Mẫu này không có trường placeholder tùy biến.
          </p>
        ) : (
          placeholders.map((field) => {
            const rawValue = values[field.key];
            const value = rawValue === undefined || rawValue === null ? '' : String(rawValue);
            const isLong =
              field.key.includes('summary') ||
              field.key.includes('progress') ||
              field.key.includes('plan') ||
              field.key.includes('conclusion');

            return (
              <div key={field.key}>
                <div className="mb-1.5 flex items-baseline justify-between gap-2">
                  <label htmlFor={field.key} className="label truncate">
                    {field.label || field.key}
                  </label>
                  {field.required && (
                    <span className="shrink-0 text-[11px] text-muted">Bắt buộc</span>
                  )}
                </div>

                {isLong ? (
                  <textarea
                    id={field.key}
                    rows={3}
                    value={value}
                    onChange={(event) => onChange(field.key, event.target.value)}
                    required={field.required}
                    placeholder={`Nhập ${(field.label || field.key).toLowerCase()}…`}
                    className="field h-auto min-h-[76px] resize-y py-2"
                  />
                ) : (
                  <input
                    type={field.type === 'date' ? 'date' : 'text'}
                    id={field.key}
                    value={value}
                    onChange={(event) => onChange(field.key, event.target.value)}
                    required={field.required}
                    placeholder={`Nhập ${(field.label || field.key).toLowerCase()}…`}
                    className="field"
                  />
                )}
              </div>
            );
          })
        )}
      </div>

      <div className="flex shrink-0 items-center justify-between gap-3 border-t border-rule px-4 py-3">
        <span className="hidden text-[12px] text-muted sm:block">
          {isSaving ? 'Đang sinh lại bản xem trước…' : 'Lưu vào bản sao của mẫu'}
        </span>
        <button type="submit" disabled={isSaving} className="btn btn-primary ml-auto">
          {isSaving ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" strokeWidth={1.5} aria-hidden="true" />
              Đang lưu…
            </>
          ) : (
            <>
              <Save className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
              Lưu &amp; cập nhật
            </>
          )}
        </button>
      </div>
    </form>
  );
};
