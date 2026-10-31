import axios from 'axios';
import type { AxiosRequestConfig } from 'axios';

export const apiClient = axios.create({
  baseURL: '/api/v1',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 45_000,
});

const refreshClient = axios.create({
  baseURL: '/api/v1',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15_000,
});

let refreshPromise: Promise<void> | null = null;

function refreshSession(): Promise<void> {
  refreshPromise ??= refreshClient
    .post('/auth/refresh')
    .then(() => undefined)
    .finally(() => {
      refreshPromise = null;
    });
  return refreshPromise;
}

type RetryableConfig = AxiosRequestConfig & { _retry?: boolean };

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config as RetryableConfig | undefined;
    const status = error.response?.status;
    const url = config?.url ?? '';
    const canRetry =
      status === 401 &&
      Boolean(config) &&
      !config?._retry &&
      !url.includes('/auth/');

    if (canRetry && config) {
      config._retry = true;
      try {
        await refreshSession();
        return apiClient(config);
      } catch {
        if (
          typeof window !== 'undefined' &&
          window.location.pathname !== '/login'
        ) {
          window.location.href = '/login';
        }
      }
    }

    const errorResponse = error.response?.data;
    const message =
      (typeof errorResponse === 'object' && errorResponse !== null && errorResponse.message) ||
      error.message ||
      'Đã xảy ra lỗi, vui lòng thử lại sau';

    return Promise.reject(
      new Error(Array.isArray(message) ? message.join('; ') : message),
    );
  },
);
