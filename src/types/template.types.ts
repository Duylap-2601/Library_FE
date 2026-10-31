export type TemplateType = 'DOCX' | 'PPTX' | 'XLSX';

export interface PlaceholderDef {
  key: string;
  label: string;
  type: string;
  default?: string | number | boolean;
  required: boolean;
}

export interface TemplateSlide {
  id: string;
  index: number;
  imagePath: string;
}

export interface Template {
  id: string;
  type: TemplateType;
  name: string;
  slug: string;
  category: string;
  description: string;
  thumbnailPath: string;
  slideCount: number;
  tags: string[];
  placeholders: PlaceholderDef[];
  status: 'ACTIVE' | 'ARCHIVED';
  slides?: TemplateSlide[];
  createdAt: string;
  updatedAt: string;
}

export interface TemplateListResponse {
  data: Template[];
  total: number;
  page: number;
  limit: number;
}

export interface TemplateListParams {
  type?: TemplateType;
  category?: string;
  q?: string;
  page?: number;
  limit?: number;
}

