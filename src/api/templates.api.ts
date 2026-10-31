import { apiClient } from './client';
import type {
  Template,
  TemplateListParams,
  TemplateListResponse,
  TemplateSlide,
  TemplateType,
} from '../types/template.types';

export const templatesApi = {
  list: async (params: TemplateListParams): Promise<TemplateListResponse> => {
    const { data } = await apiClient.get<TemplateListResponse>('/templates', { params });
    return data;
  },

  categories: async (type?: TemplateType): Promise<string[]> => {
    const { data } = await apiClient.get<string[]>('/templates/categories', {
      params: type ? { type } : undefined,
    });
    return data;
  },

  getById: async (id: string): Promise<Template> => {
    const { data } = await apiClient.get<Template>(`/templates/${id}`);
    return data;
  },

  getSlides: async (id: string): Promise<TemplateSlide[]> => {
    const { data } = await apiClient.get<TemplateSlide[]>(`/templates/${id}/slides`);
    return data;
  },
};
