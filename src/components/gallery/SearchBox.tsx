import React, { useEffect, useState } from 'react';
import { Search, X } from 'lucide-react';

interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const SearchBox: React.FC<SearchBoxProps> = ({
  value,
  onChange,
  placeholder = 'Tìm kiếm mẫu theo tên, mô tả, danh mục…',
}) => {
  const [keyword, setKeyword] = useState(value);

  useEffect(() => {
    setKeyword(value);
  }, [value]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (keyword !== value) {
        onChange(keyword);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [keyword, onChange, value]);

  return (
    <div className="relative w-full">
      <Search
        className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted"
        strokeWidth={1.5}
        aria-hidden="true"
      />
      <input
        type="search"
        value={keyword}
        onChange={(event) => setKeyword(event.target.value)}
        placeholder={placeholder}
        aria-label="Tìm kiếm mẫu"
        className="field h-8 pl-8 pr-8 [&::-webkit-search-cancel-button]:appearance-none"
      />
      {keyword && (
        <button
          type="button"
          onClick={() => {
            setKeyword('');
            onChange('');
          }}
          aria-label="Xóa từ khóa tìm kiếm"
          className="absolute right-1 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-[4px] text-muted hover:bg-active hover:text-ink"
        >
          <X className="h-3.5 w-3.5" strokeWidth={1.5} />
        </button>
      )}
    </div>
  );
};
