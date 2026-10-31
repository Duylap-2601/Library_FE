import React from 'react';
import type { Template } from '../../types/template.types';
import { Badge } from '../ui/Badge';
import { ArrowRight } from 'lucide-react';

interface TemplateCardProps {
  template: Template;
  onPreview: (template: Template) => void;
  onUse: (template: Template) => void;
  isCreating?: boolean;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  onPreview,
  onUse,
  isCreating = false,
}) => {
  return (
    <article className="flex flex-col overflow-hidden rounded-[8px] border border-line bg-paper transition-colors hover:border-[#d8dadd]">
      <button
        type="button"
        onClick={() => onPreview(template)}
        aria-label={`Xem trước mẫu ${template.name}`}
        className="block aspect-[16/10] w-full overflow-hidden bg-raised"
      >
        <img
          src={template.thumbnailPath}
          alt={`Bìa mẫu ${template.name}`}
          loading="lazy"
          className="h-full w-full object-cover transition-opacity hover:opacity-90"
        />
      </button>

      <div className="flex flex-1 flex-col p-3">
        <div className="flex items-center justify-between gap-2">
          <span className="truncate text-[12px] text-muted">{template.category}</span>
          <Badge type={template.type} />
        </div>

        <h3 className="mt-1.5 truncate text-[14px] font-medium text-ink">{template.name}</h3>
        <p className="mt-1 line-clamp-2 text-[13px] leading-5 text-muted">{template.description}</p>

        <div className="mt-3 flex items-center justify-between border-t border-rule pt-2.5">
          <button
            type="button"
            onClick={() => onPreview(template)}
            className="text-[13px] text-muted transition-colors hover:text-ink"
          >
            Xem trước
          </button>

          <button
            type="button"
            onClick={() => onUse(template)}
            disabled={isCreating}
            className="inline-flex items-center gap-1 text-[13px] font-medium text-ink transition-colors hover:text-accent disabled:cursor-not-allowed disabled:opacity-45"
          >
            {isCreating ? 'Đang tạo…' : 'Dùng mẫu'}
            {!isCreating && <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />}
          </button>
        </div>
      </div>
    </article>
  );
};
