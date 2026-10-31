import React from 'react';
import clsx from 'clsx';
import type { TemplateType } from '../../types/template.types';
import { useCategories } from '../../hooks/useTemplates';
import { SearchBox } from './SearchBox';

interface FilterBarProps {
  selectedType?: TemplateType;
  selectedCategory?: string;
  query: string;
  onTypeChange: (type?: TemplateType) => void;
  onCategoryChange: (category?: string) => void;
  onQueryChange: (query: string) => void;
  onClear: () => void;
}

const TYPE_OPTIONS: Array<{ label: string; value?: TemplateType }> = [
  { label: 'Tất cả loại', value: undefined },
  { label: 'Văn bản', value: 'DOCX' },
  { label: 'Trình chiếu', value: 'PPTX' },
  { label: 'Bảng tính', value: 'XLSX' },
];

export const FilterBar: React.FC<FilterBarProps> = ({
  selectedType,
  selectedCategory,
  query,
  onTypeChange,
  onCategoryChange,
  onQueryChange,
  onClear,
}) => {
  const { data: categories = [], isLoading } = useCategories(selectedType);
  const hasFilters = Boolean(selectedType || selectedCategory || query);

  return (
    <div>
      <div className="flex gap-6 border-b border-line" role="group" aria-label="Lọc theo loại mẫu">
        {TYPE_OPTIONS.map((option) => {
          const isActive = selectedType === option.value;
          return (
            <button
              key={option.label}
              type="button"
              aria-pressed={isActive}
              onClick={() => onTypeChange(option.value)}
              className={clsx(
                '-mb-px h-9 border-b-2 text-[13px] transition-colors',
                isActive
                  ? 'border-accent font-medium text-ink'
                  : 'border-transparent text-muted hover:text-ink',
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="order-1 w-full sm:w-[300px]">
          <SearchBox value={query} onChange={onQueryChange} />
        </div>

        <div className="order-2 flex w-full items-center gap-2 sm:w-auto">
          <select
            id="category-filter"
            aria-label="Lọc theo danh mục"
            value={selectedCategory || ''}
            onChange={(event) => onCategoryChange(event.target.value || undefined)}
            disabled={isLoading}
            className="field h-8 w-full pr-2 sm:w-[190px]"
          >
            <option value="">Tất cả danh mục</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          {hasFilters && (
            <button type="button" onClick={onClear} className="btn btn-sm btn-ghost shrink-0">
              Xóa lọc
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
