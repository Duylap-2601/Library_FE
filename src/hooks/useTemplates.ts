import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { templatesApi } from '../api/templates.api';
import type { TemplateListParams, TemplateType } from '../types/template.types';

export function useTemplates(params: TemplateListParams) {
  return useQuery({
    queryKey: ['templates', params],
    queryFn: () => templatesApi.list(params),
    placeholderData: keepPreviousData,
  });
}

export function useCategories(type?: TemplateType) {
  return useQuery({
    queryKey: ['categories', type],
    queryFn: () => templatesApi.categories(type),
    staleTime: 5 * 60 * 1000,
  });
}

export function useTemplateDetail(id: string | null) {
  return useQuery({
    queryKey: ['template', id],
    queryFn: () => templatesApi.getById(id!),
    enabled: Boolean(id),
  });
}

export function useTemplateSlides(id: string | null) {
  return useQuery({
    queryKey: ['template', id, 'slides'],
    queryFn: () => templatesApi.getSlides(id!),
    enabled: Boolean(id),
  });
}
