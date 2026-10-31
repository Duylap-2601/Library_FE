import { apiClient } from './client';

export interface EditorStatus {
  enabled: boolean;
  documentServerUrl: string | null;
}

export interface EditorConfig {
  documentServerUrl: string;
  config: Record<string, unknown>;
}

export const editorApi = {
  status: (): Promise<EditorStatus> =>
    apiClient.get<EditorStatus>('/editor/status').then((res) => res.data),

  config: (documentId: string): Promise<EditorConfig> =>
    apiClient
      .get<EditorConfig>(`/editor/documents/${documentId}/config`)
      .then((res) => res.data),
};
