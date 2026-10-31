import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { documentsApi } from '../api/documents.api';
import type {
  CreateDocumentInput,
  DocumentListParams,
  UpdateDocumentInput,
} from '../types/document.types';

export function useDocuments(params: DocumentListParams = {}) {
  return useQuery({
    queryKey: ['documents', params],
    queryFn: () => documentsApi.list(params),
    placeholderData: keepPreviousData,
  });
}

export function useDocumentDetail(id: string) {
  return useQuery({
    queryKey: ['document', id],
    queryFn: () => documentsApi.getById(id),
    enabled: Boolean(id),
  });
}

export function useDocumentPreview(id: string) {
  return useQuery({
    queryKey: ['document', id, 'preview'],
    queryFn: () => documentsApi.getPreview(id),
    enabled: Boolean(id),
    refetchInterval: (query) => {
      const data = query.state.data;
      return data?.type === 'pending' ? data.retryAfterMs : false;
    },
  });
}

export function useCreateDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateDocumentInput) => documentsApi.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });
}

export function useUpdateDocument(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateDocumentInput) => documentsApi.update(id, input),
    onSuccess: (updated) => {
      queryClient.setQueryData(['document', id], updated);
      queryClient.invalidateQueries({ queryKey: ['document', id, 'preview'] });
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });
}
