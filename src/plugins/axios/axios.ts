// Axios
import axios, { type InternalAxiosRequestConfig, type AxiosInstance } from 'axios';

// Plugins
import { handleHttpError } from '@/plugins/errorHandler/errorHandler';

// Schemas
import { env } from '@/app/schemas/env.schema';

/**
 * @description Shared HTTP transport configured with the validated public API base URL.
 */
const httpClient: AxiosInstance = axios.create({
  baseURL: env.VITE_APP_BASE_API_URL ?? '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * @description Request configuration hook — add auth headers, tracing, etc. here.
 */
httpClient.interceptors.request.use(
  (configurations: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    return configurations;
  },
);

/**
 * @description Transport only. UI-facing error presentation lives in
 * `plugins/errorHandler` so this file has a single responsibility.
 */
httpClient.interceptors.response.use(undefined, handleHttpError);

export default httpClient;
