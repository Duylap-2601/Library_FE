import React from 'react';
import clsx from 'clsx';
import { FileText, Presentation, FileSpreadsheet } from 'lucide-react';
import type { TemplateType } from '../../types/template.types';

interface BadgeProps {
  type?: TemplateType;
  children?: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ type, children, className }) => {
  if (!type) {
    return <span className={clsx('chip', className)}>{children}</span>;
  }

  const Icon =
    type === 'DOCX'
      ? FileText
      : type === 'PPTX'
        ? Presentation
        : FileSpreadsheet;

  return (
    <span className={clsx('chip', className)}>
      <Icon className="h-3 w-3" strokeWidth={1.5} aria-hidden="true" />
      {type}
    </span>
  );
};
