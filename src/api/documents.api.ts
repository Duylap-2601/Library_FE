import { apiClient } from './client';
import type {
  CreateDocumentInput,
  Document,
  DocumentListParams,
  DocumentListResponse,
  PreviewResult,
  UpdateDocumentInput,
} from '../types/document.types';

export const documentsApi = {
  create: async (payload: CreateDocumentInput): Promise<Document> => {
    const { data } = await apiClient.post<Document>('/documents', payload);
    return data;
  },

  list: async (params: DocumentListParams = {}): Promise<DocumentListResponse> => {
    const { data } = await apiClient.get<DocumentListResponse>('/documents', {
      params,
    });
    return data;
  },

  getById: async (id: string): Promise<Document> => {
    const { data } = await apiClient.get<Document>(`/documents/${id}`);
    return data;
  },

  update: async (id: string, payload: UpdateDocumentInput): Promise<Document> => {
    const { data } = await apiClient.patch<Document>(`/documents/${id}`, payload);
    return data;
  },

  getPreview: async (id: string): Promise<PreviewResult> => {
    const { data } = await apiClient.get<PreviewResult>(`/documents/${id}/preview`);
    return data;
  },

  getDownloadUrl: (id: string): string => {
    return `/api/v1/documents/${id}/download`;
  },
};
