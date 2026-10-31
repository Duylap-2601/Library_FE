import type { PlaceholderDef, TemplateType } from './template.types';

export interface Document {
  id: string;
  templateId: string;
  type: TemplateType;
  title: string;
  fieldValues: Record<string, unknown>;
  status: 'READY' | 'FAILED';
  template?: {
    id: string;
    name: string;
    type: TemplateType;
    thumbnailPath: string;
    placeholders?: PlaceholderDef[];
  };
  createdAt: string;
  updatedAt: string;
}

export type PreviewResult =
  | { type: 'html'; html: string }
  | { type: 'images'; paths: string[] }
  | {
      type: 'pending';
      status: 'QUEUED' | 'PROCESSING';
      retryAfterMs: number;
    };

export interface DocumentListParams {
  page?: number;
  limit?: number;
  q?: string;
  type?: TemplateType;
  status?: 'READY' | 'FAILED';
}

export interface DocumentListResponse {
  data: Document[];
  total: number;
  page: number;
  limit: number;
}

export interface CreateDocumentInput {
  templateId: string;
  title: string;
}

export interface UpdateDocumentInput {
  title?: string;
  fieldValues?: Record<string, unknown>;
}
